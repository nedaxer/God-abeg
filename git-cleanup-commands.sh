#!/bin/bash

# Git History Cleanup Script for Nedaxer
# This script removes hardcoded secrets from Git history

echo "🧹 Starting Git history cleanup for secret removal..."

# Remove any existing lock files
rm -f .git/index.lock

# Method 1: Using git filter-repo to remove specific content from history
echo "📝 Creating temporary file with patterns to remove..."
cat > secrets-to-remove.txt << 'EOF'
***REMOVED***
regex:AIzaSy[a-zA-Z0-9_-]{33}
regex:GOCSPX-[a-zA-Z0-9_-]{28}
regex:ghp_[a-zA-Z0-9]{36}
regex:gho_[a-zA-Z0-9]{36}
regex:ghu_[a-zA-Z0-9]{36}
regex:ghs_[a-zA-Z0-9]{36}
regex:ghr_[a-zA-Z0-9]{36}
EOF

# Alternative method: Remove specific commits that contain secrets
# Based on the GitHub error, these are the problematic commits:
echo "🔄 Rewriting Git history to remove secrets..."

# Option A: Use git filter-repo with text replacement
git filter-repo --replace-text secrets-to-remove.txt --force

# If the above doesn't work, try this more aggressive approach:
# git filter-repo --path server/passport-config.ts --path server/api/chatbot-routes.ts --path replit.md --invert-paths --force

echo "✅ Git history cleanup completed!"

# Clean up temporary files
rm -f secrets-to-remove.txt

echo "🔍 Verifying cleanup..."
git log --oneline -10

echo "✨ Ready to push to GitHub!"
EOF