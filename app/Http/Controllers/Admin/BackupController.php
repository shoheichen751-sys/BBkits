<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BackupService;
use App\Services\ActionHistoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BackupController extends Controller
{
    protected $backupService;
    protected $actionHistoryService;

    public function __construct(BackupService $backupService, ActionHistoryService $actionHistoryService)
    {
        $this->middleware(['auth', 'approved']);
        $this->backupService = $backupService;
        $this->actionHistoryService = $actionHistoryService;
    }

    /**
     * Show backup management dashboard
     */
    public function index()
    {
        $backups = $this->backupService->listBackups();
        $stats = $this->backupService->getBackupStats();

        return Inertia::render('Admin/Backups/Index', [
            'backups' => $backups,
            'stats' => $stats,
        ]);
    }

    /**
     * Create a new backup
     */
    public function create(Request $request)
    {
        $request->validate([
            'type' => 'required|in:full',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            $result = $this->backupService->createFullBackup();

            if ($result['status'] === 'success' || $result['status'] === 'partial') {
                // Log the manual backup creation
                $this->actionHistoryService->logAction(
                    'backup_manual',
                    "Backup manual criado: {$result['backup_name']}",
                    null,
                    null,
                    null,
                    [
                        'backup_name' => $result['backup_name'],
                        'description' => $request->description,
                        'status' => $result['status'],
                        'size' => $result['size'],
                        'errors_count' => count($result['errors'])
                    ]
                );

                $message = $result['status'] === 'success'
                    ? 'Backup criado com sucesso!'
                    : 'Backup criado com avisos. Verifique os logs.';

                return response()->json([
                    'success' => true,
                    'message' => $message,
                    'backup' => [
                        'name' => $result['backup_name'],
                        'size' => $result['size'],
                        'compressed_size' => $result['compressed_size'] ?? null,
                        'errors' => $result['errors']
                    ]
                ]);

            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Falha ao criar backup: ' . $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Manual backup creation failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro interno ao criar backup'
            ], 500);
        }
    }

    /**
     * Download a backup file
     */
    public function download(Request $request, string $backupName)
    {
        try {
            $backupPath = storage_path("app/backups/{$backupName}");

            if (!file_exists($backupPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Backup não encontrado'
                ], 404);
            }

            // Log the backup download
            $this->actionHistoryService->logAction(
                'backup_download',
                "Backup baixado: {$backupName}",
                null,
                null,
                null,
                [
                    'backup_name' => $backupName,
                    'file_size' => filesize($backupPath)
                ]
            );

            return response()->download($backupPath, $backupName);

        } catch (\Exception $e) {
            Log::error('Backup download failed', [
                'backup_name' => $backupName,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao baixar backup'
            ], 500);
        }
    }

    /**
     * Delete a backup
     */
    public function destroy(string $backupName)
    {
        try {
            $deleted = $this->backupService->deleteBackup($backupName);

            if ($deleted) {
                // Log already handled in BackupService
                return response()->json([
                    'success' => true,
                    'message' => 'Backup removido com sucesso'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Backup não encontrado'
                ], 404);
            }

        } catch (\Exception $e) {
            Log::error('Backup deletion failed', [
                'backup_name' => $backupName,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao remover backup'
            ], 500);
        }
    }

    /**
     * Cleanup old backups
     */
    public function cleanup(Request $request)
    {
        $request->validate([
            'keep_count' => 'required|integer|min:5|max:100',
            'confirm' => 'required|boolean|accepted'
        ]);

        try {
            $backups = $this->backupService->listBackups();
            $keepCount = $request->keep_count;

            if (count($backups) <= $keepCount) {
                return response()->json([
                    'success' => true,
                    'message' => "Apenas " . count($backups) . " backups encontrados. Nenhum removido.",
                    'deleted_count' => 0
                ]);
            }

            $backupsToDelete = array_slice($backups, $keepCount);
            $deletedCount = 0;

            foreach ($backupsToDelete as $backup) {
                if ($this->backupService->deleteBackup($backup['name'])) {
                    $deletedCount++;
                }
            }

            // Log the cleanup operation
            $this->actionHistoryService->logAction(
                'backup_cleanup',
                "Limpeza de backups: {$deletedCount} removidos, {$keepCount} mantidos",
                null,
                null,
                null,
                [
                    'deleted_count' => $deletedCount,
                    'kept_count' => $keepCount,
                    'total_before' => count($backups)
                ]
            );

            return response()->json([
                'success' => true,
                'message' => "Limpeza concluída. {$deletedCount} backups removidos.",
                'deleted_count' => $deletedCount
            ]);

        } catch (\Exception $e) {
            Log::error('Backup cleanup failed', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro durante limpeza de backups'
            ], 500);
        }
    }

    /**
     * Get backup statistics
     */
    public function stats()
    {
        try {
            $stats = $this->backupService->getBackupStats();
            $backups = $this->backupService->listBackups();

            // Calculate additional statistics
            $stats['recent_backups'] = array_slice($backups, 0, 5);

            $stats['size_trend'] = $this->calculateSizeTrend($backups);

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get backup stats', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erro ao obter estatísticas de backup'
            ], 500);
        }
    }

    /**
     * Test backup system
     */
    public function test()
    {
        try {
            // Test backup directory permissions
            $backupDir = storage_path('app/backups');
            if (!is_dir($backupDir)) {
                mkdir($backupDir, 0755, true);
            }

            $testFile = $backupDir . '/test_' . time() . '.txt';
            file_put_contents($testFile, 'Test backup system');

            $canWrite = file_exists($testFile);
            if ($canWrite) {
                unlink($testFile);
            }

            // Test database access
            $canAccessDb = false;
            try {
                $dbPath = database_path('database.sqlite');
                $canAccessDb = file_exists($dbPath) && is_readable($dbPath);
            } catch (\Exception $e) {
                // Database test failed
            }

            // Test ZIP extension
            $hasZipExtension = class_exists('ZipArchive');

            $results = [
                'backup_directory' => [
                    'status' => $canWrite ? 'ok' : 'error',
                    'message' => $canWrite ? 'Diretório de backup acessível' : 'Erro ao acessar diretório de backup',
                    'path' => $backupDir
                ],
                'database_access' => [
                    'status' => $canAccessDb ? 'ok' : 'warning',
                    'message' => $canAccessDb ? 'Banco de dados acessível' : 'Banco de dados não encontrado',
                    'path' => database_path('database.sqlite')
                ],
                'zip_extension' => [
                    'status' => $hasZipExtension ? 'ok' : 'error',
                    'message' => $hasZipExtension ? 'Extensão ZIP disponível' : 'Extensão ZIP não encontrada'
                ]
            ];

            $overallStatus = 'ok';
            foreach ($results as $test) {
                if ($test['status'] === 'error') {
                    $overallStatus = 'error';
                    break;
                } elseif ($test['status'] === 'warning' && $overallStatus === 'ok') {
                    $overallStatus = 'warning';
                }
            }

            return response()->json([
                'success' => true,
                'overall_status' => $overallStatus,
                'tests' => $results
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro no teste do sistema de backup: ' . $e->getMessage()
            ], 500);
        }
    }

    // Private helper methods

    private function calculateSizeTrend(array $backups): array
    {
        if (count($backups) < 2) {
            return ['trend' => 'stable', 'percentage' => 0];
        }

        $recent = array_slice($backups, 0, 5);
        $older = array_slice($backups, 5, 5);

        if (empty($older)) {
            return ['trend' => 'stable', 'percentage' => 0];
        }

        $recentAvg = array_sum(array_column($recent, 'size')) / count($recent);
        $olderAvg = array_sum(array_column($older, 'size')) / count($older);

        $percentageChange = (($recentAvg - $olderAvg) / $olderAvg) * 100;

        $trend = 'stable';
        if ($percentageChange > 5) {
            $trend = 'increasing';
        } elseif ($percentageChange < -5) {
            $trend = 'decreasing';
        }

        return [
            'trend' => $trend,
            'percentage' => round($percentageChange, 1)
        ];
    }
}