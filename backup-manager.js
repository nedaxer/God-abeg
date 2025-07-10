#!/usr/bin/env node
/**
 * MongoDB Backup Management Tool
 * 
 * Usage:
 *   node backup-manager.js backup          # Create immediate backup
 *   node backup-manager.js restore         # Restore from latest backup
 *   node backup-manager.js restore <name>  # Restore from specific backup
 *   node backup-manager.js list            # List available backups
 *   node backup-manager.js schedule        # Start auto-backup scheduler
 */

import { createBackup, cleanupOldBackups } from './scripts/backup.js';
import { restoreLatest, restoreSpecific, listAvailableBackups } from './scripts/restore.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  console.log('🔧 MongoDB Backup Manager');
  console.log('═══════════════════════════\n');

  switch (command) {
    case 'backup':
      console.log('📦 Creating immediate backup...');
      try {
        const result = await createBackup();
        console.log('✅ Backup created successfully!');
        console.log(`📁 Location: ${result.backupPath}`);
        console.log(`📊 Files: ${result.fileCount}`);
        cleanupOldBackups();
      } catch (error) {
        console.error('❌ Backup failed:', error.message);
        process.exit(1);
      }
      break;

    case 'restore':
      if (args[1]) {
        console.log(`🔄 Restoring specific backup: ${args[1]}`);
        try {
          await restoreSpecific(args[1]);
          console.log('✅ Specific restore completed!');
        } catch (error) {
          console.error('❌ Restore failed:', error.message);
          process.exit(1);
        }
      } else {
        console.log('🔄 Restoring from latest backup...');
        try {
          await restoreLatest();
          console.log('✅ Latest restore completed!');
        } catch (error) {
          console.error('❌ Restore failed:', error.message);
          process.exit(1);
        }
      }
      break;

    case 'list':
      console.log('📋 Available backups:');
      try {
        await listAvailableBackups();
      } catch (error) {
        console.error('❌ List failed:', error.message);
        process.exit(1);
      }
      break;

    case 'schedule':
      console.log('⏰ Starting backup scheduler...');
      try {
        await import('./scripts/scheduleBackup.js');
      } catch (error) {
        console.error('❌ Scheduler failed:', error.message);
        process.exit(1);
      }
      break;

    default:
      console.log('📖 Available commands:');
      console.log('  backup          - Create immediate backup');
      console.log('  restore         - Restore from latest backup');
      console.log('  restore <name>  - Restore from specific backup');
      console.log('  list            - List available backups');
      console.log('  schedule        - Start auto-backup scheduler');
      console.log('\n💡 Examples:');
      console.log('  node backup-manager.js backup');
      console.log('  node backup-manager.js restore');
      console.log('  node backup-manager.js restore backup-2025-07-09T14-30-00');
      console.log('  node backup-manager.js list');
      console.log('  node backup-manager.js schedule');
      break;
  }
}

main().catch(console.error);