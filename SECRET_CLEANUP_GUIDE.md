# 🔐 GitHub Secret Cleanup Guide for Nedaxer

## Current Status
✅ **Your code is already secure!** All files now use environment variables:
- `server/passport-config.ts` - Uses `process.env.GOOGLE_CLIENT_ID` and `process.env.GOOGLE_CLIENT_SECRET`
- `server/api/chatbot-routes.ts` - Uses `process.env.GITHUB_TOKEN`
- `replit.md` - Contains only documentation, no hardcoded secrets

❌ **Problem**: Old commits in Git history still contain hardcoded secrets that GitHub detects.

## Step-by-Step Solution

### Method 1: Quick Fix (Recommended)
1. **Make the script executable:**
   ```bash
   chmod +x git-cleanup-commands.sh
   ```

2. **Run the cleanup script:**
   ```bash
   ./git-cleanup-commands.sh
   ```

3. **Force push to GitHub:**
   ```bash
   git push origin nedaxer --force
   ```

### Method 2: Manual Cleanup (If Method 1 fails)

1. **Create replacement patterns file:**
   ```bash
   cat > secrets-to-remove.txt << 'EOF'
   # Replace Google OAuth patterns
   regex:AIzaSy[a-zA-Z0-9_-]{33}==>GOOGLE_CLIENT_ID_REMOVED
   regex:GOCSPX-[a-zA-Z0-9_-]{28}==>GOOGLE_CLIENT_SECRET_REMOVED
   regex:ghp_[a-zA-Z0-9]{36}==>GITHUB_TOKEN_REMOVED
   regex:gho_[a-zA-Z0-9]{36}==>GITHUB_TOKEN_REMOVED
   regex:ghu_[a-zA-Z0-9]{36}==>GITHUB_TOKEN_REMOVED
   regex:ghs_[a-zA-Z0-9]{36}==>GITHUB_TOKEN_REMOVED
   regex:ghr_[a-zA-Z0-9]{36}==>GITHUB_TOKEN_REMOVED
   EOF
   ```

2. **Run git filter-repo:**
   ```bash
   git filter-repo --replace-text secrets-to-remove.txt --force
   ```

3. **Clean up and push:**
   ```bash
   rm secrets-to-remove.txt
   git push origin nedaxer --force
   ```

### Method 3: Nuclear Option (Complete history reset)
⚠️ **Warning**: This removes all Git history!

```bash
# Remove .git directory
rm -rf .git

# Initialize new repository
git init
git add .
git commit -m "Initial commit - secrets removed"

# Add remote and push
git remote add origin https://github.com/nedaxer/nedaxer-com.git
git branch -M nedaxer
git push -u origin nedaxer --force
```

## Important Security Steps

### 1. Revoke Exposed Secrets
Since secrets were exposed in Git history, you should revoke and regenerate them:

**Google OAuth:**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Navigate to APIs & Services > Credentials
- Delete the exposed OAuth client
- Create new OAuth client with same redirect URIs
- Update your Replit environment variables

**GitHub Token:**
- Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
- Revoke the exposed token
- Generate new token with same permissions
- Update your Replit environment variables

### 2. Update Environment Variables
Make sure these are set in your Replit environment:
- `GOOGLE_CLIENT_ID` - New Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - New Google OAuth client secret  
- `GITHUB_TOKEN` - New GitHub personal access token
- `MONGODB_URI` - Your MongoDB connection string

### 3. Verify Cleanup
After cleanup, verify no secrets remain:
```bash
# Search for common secret patterns
git log --all --full-history -- server/passport-config.ts | grep -E "(AIzaSy|GOCSPX-|ghp_)"
git log --all --full-history -- server/api/chatbot-routes.ts | grep -E "(ghp_|gho_|ghu_)"
git log --all --full-history -- replit.md | grep -E "(AIzaSy|GOCSPX-|ghp_)"
```

If any results appear, the cleanup wasn't complete.

## Final Steps
1. Run cleanup script
2. Revoke and regenerate all exposed secrets
3. Update environment variables with new secrets
4. Force push cleaned repository
5. Verify GitHub accepts the push

Your Nedaxer platform will continue working normally since it's already configured to use environment variables!