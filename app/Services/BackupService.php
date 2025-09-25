<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\ActionHistory;
use Carbon\Carbon;
use ZipArchive;

class BackupService
{
    protected $backupDisk = 'local';
    protected $backupPath = 'backups';
    protected $maxBackups = 30; // Keep 30 backups maximum

    public function createFullBackup(): array
    {
        try {
            $timestamp = now()->format('Y-m-d_H-i-s');
            $backupName = "bbkits_full_backup_{$timestamp}";
            $backupDir = storage_path("app/{$this->backupPath}/{$backupName}");

            // Create backup directory
            if (!is_dir($backupDir)) {
                mkdir($backupDir, 0755, true);
            }

            $results = [
                'backup_name' => $backupName,
                'timestamp' => $timestamp,
                'files' => [],
                'database_dump' => null,
                'size' => 0,
                'status' => 'success',
                'errors' => []
            ];

            // 1. Database backup
            $databaseBackup = $this->createDatabaseBackup($backupDir);
            if ($databaseBackup['success']) {
                $results['database_dump'] = $databaseBackup['file'];
                $results['size'] += $databaseBackup['size'];
            } else {
                $results['errors'][] = 'Database backup failed: ' . $databaseBackup['error'];
            }

            // 2. Important files backup
            $fileBackups = $this->createFileBackup($backupDir);
            $results['files'] = $fileBackups['files'];
            $results['size'] += $fileBackups['total_size'];
            $results['errors'] = array_merge($results['errors'], $fileBackups['errors']);

            // 3. Configuration backup
            $configBackup = $this->createConfigBackup($backupDir);
            if ($configBackup['success']) {
                $results['files']['configs'] = $configBackup['files'];
                $results['size'] += $configBackup['size'];
            } else {
                $results['errors'][] = 'Config backup failed: ' . $configBackup['error'];
            }

            // 4. Create compressed archive
            $zipFile = $this->createCompressedBackup($backupDir, $backupName);
            if ($zipFile['success']) {
                $results['compressed_file'] = $zipFile['file'];
                $results['compressed_size'] = $zipFile['size'];

                // Remove uncompressed directory
                $this->removeDirectory($backupDir);
            } else {
                $results['errors'][] = 'Compression failed: ' . $zipFile['error'];
            }

            // 5. Cleanup old backups
            $this->cleanupOldBackups();

            // Log backup creation
            $this->logBackupAction(
                'backup_created',
                "Backup completo criado: {$backupName}",
                [
                    'backup_name' => $backupName,
                    'size' => $results['size'],
                    'compressed_size' => $results['compressed_size'] ?? null,
                    'files_count' => count($results['files']),
                    'errors_count' => count($results['errors'])
                ]
            );

            if (!empty($results['errors'])) {
                $results['status'] = 'partial';
            }

            return $results;

        } catch (\Exception $e) {
            Log::error('Backup creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'status' => 'failed',
                'error' => $e->getMessage(),
                'backup_name' => $backupName ?? 'unknown',
                'timestamp' => $timestamp ?? now()->format('Y-m-d_H-i-s')
            ];
        }
    }

    public function createDatabaseBackup(string $backupDir): array
    {
        try {
            $dbPath = database_path('database.sqlite');
            $backupFile = $backupDir . '/database.sqlite';

            if (file_exists($dbPath)) {
                copy($dbPath, $backupFile);
                $size = filesize($backupFile);

                return [
                    'success' => true,
                    'file' => 'database.sqlite',
                    'size' => $size
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Database file not found'
                ];
            }

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function createFileBackup(string $backupDir): array
    {
        $files = [];
        $totalSize = 0;
        $errors = [];

        $importantPaths = [
            'storage/app/public/product_photos' => 'product_photos',
            'storage/app/public/payment_proofs' => 'payment_proofs',
            'storage/app/public/receipts' => 'receipts',
            'storage/app/public/embroidery_designs' => 'embroidery_designs',
            'storage/logs' => 'logs'
        ];

        foreach ($importantPaths as $sourcePath => $backupName) {
            $fullSourcePath = base_path($sourcePath);

            if (is_dir($fullSourcePath)) {
                $backupPath = $backupDir . '/files/' . $backupName;

                try {
                    $this->copyDirectory($fullSourcePath, $backupPath);
                    $size = $this->getDirectorySize($backupPath);

                    $files[$backupName] = [
                        'path' => $sourcePath,
                        'size' => $size,
                        'files_count' => $this->countFiles($backupPath)
                    ];

                    $totalSize += $size;

                } catch (\Exception $e) {
                    $errors[] = "Failed to backup {$sourcePath}: " . $e->getMessage();
                }
            }
        }

        return [
            'files' => $files,
            'total_size' => $totalSize,
            'errors' => $errors
        ];
    }

    public function createConfigBackup(string $backupDir): array
    {
        try {
            $configDir = $backupDir . '/config';
            mkdir($configDir, 0755, true);

            $configFiles = [
                '.env.example',
                'config/app.php',
                'config/database.php',
                'config/services.php',
                'composer.json',
                'package.json'
            ];

            $files = [];
            $totalSize = 0;

            foreach ($configFiles as $file) {
                $sourcePath = base_path($file);

                if (file_exists($sourcePath)) {
                    $fileName = basename($file);
                    $backupFile = $configDir . '/' . $fileName;

                    copy($sourcePath, $backupFile);
                    $size = filesize($backupFile);

                    $files[$fileName] = [
                        'original_path' => $file,
                        'size' => $size
                    ];

                    $totalSize += $size;
                }
            }

            return [
                'success' => true,
                'files' => $files,
                'size' => $totalSize
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function createCompressedBackup(string $backupDir, string $backupName): array
    {
        try {
            $zipFile = storage_path("app/{$this->backupPath}/{$backupName}.zip");
            $zip = new ZipArchive();

            if ($zip->open($zipFile, ZipArchive::CREATE) !== TRUE) {
                return [
                    'success' => false,
                    'error' => 'Cannot create zip file'
                ];
            }

            $this->addDirectoryToZip($zip, $backupDir, '');
            $zip->close();

            $size = filesize($zipFile);

            return [
                'success' => true,
                'file' => $backupName . '.zip',
                'size' => $size
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function listBackups(): array
    {
        $backupDir = storage_path("app/{$this->backupPath}");
        $backups = [];

        if (is_dir($backupDir)) {
            $files = glob($backupDir . '/*.zip');

            foreach ($files as $file) {
                $filename = basename($file);
                $size = filesize($file);
                $created = Carbon::createFromTimestamp(filemtime($file));

                $backups[] = [
                    'name' => $filename,
                    'size' => $size,
                    'size_human' => $this->formatBytes($size),
                    'created_at' => $created->toDateTimeString(),
                    'age_days' => $created->diffInDays(now())
                ];
            }

            // Sort by creation time, newest first
            usort($backups, function($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });
        }

        return $backups;
    }

    public function deleteBackup(string $backupName): bool
    {
        try {
            $backupFile = storage_path("app/{$this->backupPath}/{$backupName}");

            if (file_exists($backupFile)) {
                unlink($backupFile);

                $this->logBackupAction(
                    'backup_deleted',
                    "Backup removido: {$backupName}",
                    ['backup_name' => $backupName]
                );

                return true;
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Failed to delete backup', [
                'backup_name' => $backupName,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    public function cleanupOldBackups(): int
    {
        $backups = $this->listBackups();
        $deletedCount = 0;

        if (count($backups) > $this->maxBackups) {
            $backupsToDelete = array_slice($backups, $this->maxBackups);

            foreach ($backupsToDelete as $backup) {
                if ($this->deleteBackup($backup['name'])) {
                    $deletedCount++;
                }
            }
        }

        return $deletedCount;
    }

    public function getBackupStats(): array
    {
        $backups = $this->listBackups();
        $totalSize = array_sum(array_column($backups, 'size'));

        return [
            'total_backups' => count($backups),
            'total_size' => $totalSize,
            'total_size_human' => $this->formatBytes($totalSize),
            'oldest_backup' => !empty($backups) ? end($backups)['created_at'] : null,
            'newest_backup' => !empty($backups) ? $backups[0]['created_at'] : null,
            'average_size' => count($backups) > 0 ? $totalSize / count($backups) : 0
        ];
    }

    // Private helper methods

    private function copyDirectory(string $source, string $destination): void
    {
        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            $destPath = $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName();

            if ($file->isDir()) {
                mkdir($destPath, 0755, true);
            } else {
                copy($file->getRealPath(), $destPath);
            }
        }
    }

    private function removeDirectory(string $path): void
    {
        if (is_dir($path)) {
            $files = array_diff(scandir($path), array('.', '..'));

            foreach ($files as $file) {
                $filePath = $path . DIRECTORY_SEPARATOR . $file;

                if (is_dir($filePath)) {
                    $this->removeDirectory($filePath);
                } else {
                    unlink($filePath);
                }
            }

            rmdir($path);
        }
    }

    private function getDirectorySize(string $path): int
    {
        $size = 0;

        if (is_dir($path)) {
            foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path)) as $file) {
                $size += $file->getSize();
            }
        }

        return $size;
    }

    private function countFiles(string $path): int
    {
        $count = 0;

        if (is_dir($path)) {
            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));
            $count = iterator_count($iterator);
        }

        return $count;
    }

    private function addDirectoryToZip(ZipArchive $zip, string $path, string $localPath): void
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            $filePath = $file->getRealPath();
            $relativePath = $localPath . '/' . $iterator->getSubPathName();

            if ($file->isDir()) {
                $zip->addEmptyDir($relativePath);
            } else {
                $zip->addFile($filePath, $relativePath);
            }
        }
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }

    private function logBackupAction(string $actionType, string $description, array $metadata = []): void
    {
        try {
            ActionHistory::create([
                'user_id' => auth()->id(),
                'action_type' => $actionType,
                'resource_type' => 'System',
                'resource_id' => null,
                'description' => $description,
                'changes' => null,
                'metadata' => $metadata,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'performed_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log backup action', [
                'action_type' => $actionType,
                'description' => $description,
                'error' => $e->getMessage()
            ]);
        }
    }
}