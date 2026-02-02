#!/bin/bash
# Script to create a backup branch from main

set -e

echo "Creating backup branch from main..."

# Fetch the latest main branch
git fetch origin main

# Create backup branch from origin/main
git checkout -b backup origin/main

# Push backup branch to remote
git push -u origin backup

echo "Backup branch created successfully!"
echo "To switch back to your previous branch, use: git checkout -"
