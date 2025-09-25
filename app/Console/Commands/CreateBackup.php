<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BackupService;
use App\Services\ActionHistoryService;

class CreateBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:create
                            {--type=full : Type of backup (full)}
                            {--force : Skip confirmation prompt}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a full system backup including database, files, and configurations';

    protected $backupService;
    protected $actionHistoryService;

    public function __construct(BackupService $backupService, ActionHistoryService $actionHistoryService)
    {
        parent::__construct();
        $this->backupService = $backupService;
        $this->actionHistoryService = $actionHistoryService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');
        $force = $this->option('force');

        $this->info("BBKits Backup System");
        $this->info("==================");

        if (!$force) {
            if (!$this->confirm("Create a {$type} backup now?")) {
                $this->info('Backup cancelled.');
                return 0;
            }
        }

        $this->info('Starting backup process...');

        $progressBar = $this->output->createProgressBar(5);
        $progressBar->start();

        try {
            $progressBar->advance();
            $this->newLine();
            $this->info('Creating backup...');

            $result = $this->backupService->createFullBackup();

            $progressBar->advance();

            if ($result['status'] === 'success' || $result['status'] === 'partial') {
                $this->newLine();
                $this->info('Backup completed successfully!');
                $this->newLine();

                $this->displayBackupResults($result);

                if ($result['status'] === 'partial') {
                    $this->warn('Backup completed with some warnings:');
                    foreach ($result['errors'] as $error) {
                        $this->error("  - {$error}");
                    }
                }

                $progressBar->advance();

                // Log the backup
                $this->actionHistoryService->logAction(
                    'backup_command',
                    "Backup criado via comando: {$result['backup_name']}",
                    null,
                    null,
                    null,
                    [
                        'command' => 'backup:create',
                        'type' => $type,
                        'backup_name' => $result['backup_name'],
                        'status' => $result['status']
                    ]
                );

                $progressBar->finish();
                $this->newLine();

                return 0;

            } else {
                $progressBar->finish();
                $this->newLine();
                $this->error('Backup failed!');
                $this->error("Error: {$result['error']}");

                return 1;
            }

        } catch (\Exception $e) {
            $progressBar->finish();
            $this->newLine();
            $this->error('Backup failed with exception!');
            $this->error("Error: {$e->getMessage()}");

            return 1;
        }
    }

    private function displayBackupResults(array $result): void
    {
        $this->table(
            ['Property', 'Value'],
            [
                ['Backup Name', $result['backup_name']],
                ['Timestamp', $result['timestamp']],
                ['Status', $result['status']],
                ['Database', $result['database_dump'] ? '✓ Included' : '✗ Failed'],
                ['Files Count', count($result['files'])],
                ['Total Size', $this->formatBytes($result['size'])],
                ['Compressed Size', isset($result['compressed_size']) ? $this->formatBytes($result['compressed_size']) : 'N/A'],
                ['Compression Ratio', isset($result['compressed_size']) ? round((1 - $result['compressed_size'] / $result['size']) * 100, 1) . '%' : 'N/A'],
                ['Errors', count($result['errors'])]
            ]
        );

        if (!empty($result['files'])) {
            $this->newLine();
            $this->info('Backed up files:');

            $fileTable = [];
            foreach ($result['files'] as $name => $info) {
                if (is_array($info)) {
                    $fileTable[] = [
                        $name,
                        isset($info['files_count']) ? $info['files_count'] . ' files' : '1 file',
                        $this->formatBytes($info['size'])
                    ];
                }
            }

            if (!empty($fileTable)) {
                $this->table(['Directory', 'Files', 'Size'], $fileTable);
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
}
