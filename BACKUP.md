# Backup Branch Documentation

## Overview
This document explains how to create and maintain a backup branch from the main branch.

## Quick Start

### Using the Script
Run the provided script to automatically create a backup branch:
```bash
./create-backup.sh
```

### Manual Process
If you prefer to create the backup branch manually, follow these steps:

1. **Fetch the latest main branch:**
   ```bash
   git fetch origin main
   ```

2. **Create the backup branch from main:**
   ```bash
   git checkout -b backup origin/main
   ```

3. **Push the backup branch to remote:**
   ```bash
   git push -u origin backup
   ```

## Backup Branch Details
- **Source:** `main` branch
- **Name:** `backup`
- **Purpose:** Preserve a snapshot of the main branch for recovery purposes

## Updating the Backup
To update the backup branch with the latest changes from main:

```bash
git checkout backup
git fetch origin main
git reset --hard origin/main
git push -f origin backup
```

## Recovery from Backup
If you need to restore from the backup branch:

```bash
git checkout main
git reset --hard backup
git push -f origin main  # Use with caution!
```

## Notes
- Always verify the current state of `main` before creating a backup
- The backup branch provides a safety net for important changes
- Consider creating dated backup branches for long-term archival (e.g., `backup-2024-01-15`)
