# MongoDB Automatic Backup & Restore System

## Overview

Your Nedaxer trading platform now has a comprehensive MongoDB backup and restore system that:

- ✅ Automatically backs up your MongoDB database every 5 minutes
- ✅ Stores timestamped backups locally in the `db_backups/` folder
- ✅ Provides easy restore functionality for redeployments
- ✅ Includes cleanup to keep only the 20 most recent backups
- ✅ Works with both MongoDB Atlas and local MongoDB instances

## Automatic Features

### Auto-Backup (Every 5 Minutes)
The backup system automatically starts when your app runs and creates backups every 5 minutes:
- Backups are stored in: `db_backups/backup-YYYY-MM-DDTHH-MM-SS/`
- Only the 20 most recent backups are kept (older ones are automatically cleaned up)
- Console logs show when backups succeed or fail

### Integration with Your App
The backup scheduler is integrated into your main server (`server/index.ts`) and starts automatically when your app launches.

## Manual Commands

Use the backup manager for manual operations:

```bash
# Create immediate backup
node backup-manager.js backup

# Restore from latest backup
node backup-manager.js restore

# List all available backups
node backup-manager.js list

# Restore from specific backup
node backup-manager.js restore backup-2025-07-09T14-30-00

# Start backup scheduler manually (if needed)
node backup-manager.js schedule
```

## Environment Variables

The system uses these environment variables:

- `MONGODB_URI` or `MONGO_URI` - Source database for backups
- `NEW_MONGO_URI` - Target database for restores (falls back to MONGODB_URI)

## For Redeployments

When you redeploy or change your MongoDB URI:

1. Set your new MongoDB URI in environment variables:
   ```bash
   export NEW_MONGO_URI="your-new-mongodb-connection-string"
   ```

2. Restore from the latest backup:
   ```bash
   node backup-manager.js restore
   ```

## File Structure

```
your-project/
├── scripts/
│   ├── backup.js          # Core backup functionality
│   ├── restore.js         # Core restore functionality
│   └── scheduleBackup.js  # Auto-backup scheduler
├── backup-manager.js      # Easy-to-use management tool
├── db_backups/           # Backup storage directory
│   ├── backup-2025-07-09T14-25-00/
│   ├── backup-2025-07-09T14-30-00/
│   └── backup-2025-07-09T14-35-00/
└── BACKUP_SETUP_GUIDE.md # This guide
```

## Logging

The system provides detailed logging:

- ✅ Successful backups with file count and location
- ❌ Failed backups with error details
- 🧹 Cleanup operations showing removed old backups
- 📊 Restore operations with progress updates

## Dependencies Installed

- `node-cron` - For scheduling automatic backups
- `mongodb-tools` - MongoDB CLI tools (mongodump, mongorestore)

## Troubleshooting

### Backup Fails
- Check that `MONGODB_URI` is set correctly
- Verify MongoDB connection and credentials
- Ensure sufficient disk space for backups

### Restore Fails
- Check that `NEW_MONGO_URI` is set correctly
- Verify target database permissions
- Ensure backup files exist in `db_backups/`

### Missing MongoDB Tools
If mongodump/mongorestore commands are not found:
```bash
# On Replit, they should be installed automatically
# If needed, you can install manually:
apt-get update && apt-get install mongodb-tools
```

## Security Notes

- Backup files contain your database data - keep them secure
- MongoDB URIs contain credentials - they're masked in logs
- The system automatically cleans up old backups to save space

## Success Indicators

You'll see these messages when everything is working:

```
✅ MongoDB auto-backup system started (every 5 minutes)
⏰ [timestamp] Starting scheduled backup...
✅ [timestamp] Scheduled backup completed successfully!
📁 Files: 15, Path: /path/to/backup-2025-07-09T14-30-00
```