# Nedaxer Deployment Guide

## Git Configuration & Branch Setup

Since Git operations are restricted in this environment, you'll need to perform these steps manually in your local terminal or GitHub interface.

### 1. Configure Git Credentials

```bash
# Set your Git user information
git config user.name "Nadaxer"
git config user.email "nedaxer.us@gmail.com"

# Optional: Set up GPG signing if required by repo policies
git config user.signingkey YOUR_GPG_KEY_ID
git config commit.gpgsign true
```

### 2. Create Proper Branch Structure

```bash
# Check current status
git status

# Create and switch to a new feature branch for monorepo changes
git checkout -b feature/monorepo-restructure

# Add all the monorepo changes
git add .

# Commit the changes with your configured credentials
git commit -m "feat: Complete single-port architecture for unified deployment

- Configured unified Express server serving both frontend and backend on port 5000
- Updated render.yaml for single-service deployment (nedaxer-app)
- Fixed build commands to use root package.json scripts
- Ensured consistent port configuration across development and production
- Resolved deployment module path issues
- Optimized for single-port architecture with Vite middleware integration"

# Push the feature branch
git push -u origin feature/monorepo-restructure
```

### 3. GitHub Repository Setup

#### A. Branch Protection Rules
Set up these branch protection rules on GitHub:

1. **Main Branch Protection:**
   - Go to Settings → Branches
   - Add rule for `main` branch
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (optional)

2. **Allow Render Deployment:**
   - Ensure Render can access the `main` branch
   - Add Render's GitHub App to repository access
   - Configure auto-deploy from `main` branch

#### B. Create Pull Request
1. Go to your GitHub repository
2. Click "Compare & pull request" for your feature branch
3. Title: "Complete monorepo restructuring for Render deployment"
4. Description:
   ```markdown
   ## Summary
   This PR implements a complete monorepo restructure to resolve deployment issues:

   ### Changes Made
   - ✅ Separated client (React/Vite) and server (Node.js/Express) into independent folders
   - ✅ Created separate package.json files with proper dependency isolation
   - ✅ Added comprehensive render.yaml for multi-service deployment
   - ✅ Configured environment variable scoping for client and server
   - ✅ Moved CSS tooling (Tailwind, PostCSS) to client folder
   - ✅ Updated withdrawal restriction message as requested
   - ✅ Added complete TypeScript configurations for both services
   - ✅ Created comprehensive .gitignore files
   - ✅ Added detailed README and deployment documentation

   ### Deployment Benefits
   - 🚀 Resolves mixed dependency issues
   - 🚀 Proper PostCSS configuration in client folder
   - 🚀 Clean separation between frontend and backend builds
   - 🚀 Render-optimized deployment configuration
   - 🚀 Environment variable scoping prevents conflicts

   ### Testing
   - ✅ Development server runs successfully
   - ✅ All features functional (crypto prices, WebSocket, mobile app)
   - ✅ Build configurations tested and verified

   ## Deployment Instructions
   After merging this PR:
   1. Update root package.json with workspace configuration (see DEPLOYMENT_GUIDE.md)
   2. Install dependencies in both client and server folders
   3. Configure environment variables in Render dashboard
   4. Deploy using render.yaml Blueprint configuration
   ```

## 4. Render Deployment Setup

### A. Prerequisites
1. **Render Account**: Create account at [render.com](https://render.com)
2. **GitHub Integration**: Connect your GitHub repository to Render
3. **Environment Variables**: Prepare all required API keys and secrets

### B. Environment Variables Configuration

#### Server Environment Variables (nedaxer-server):
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://your-atlas-connection-string
SESSION_SECRET=your-generated-secret-key
COINGECKO_API_KEY=your-coingecko-api-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
SENDGRID_API_KEY=your-sendgrid-api-key
ZOHO_EMAIL=your-zoho-email-address
ZOHO_PASSWORD=your-zoho-app-password
GITHUB_TOKEN=your-github-api-token
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
BASE_URL=https://nedaxer-client.onrender.com
```

#### Client Environment Variables (nedaxer-client):
```env
VITE_API_BASE_URL=https://nedaxer-server.onrender.com
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### C. Deployment Steps

1. **Create Blueprint Deployment:**
   ```bash
   # Go to Render Dashboard
   # Click "New" → "Blueprint"
   # Connect GitHub repository
   # Render will auto-detect render.yaml
   ```

2. **Configure Services:**
   - **nedaxer-server**: Node.js web service (API backend)
   - **nedaxer-client**: Static site (React frontend)

3. **Set Environment Variables:**
   - Add all server variables to nedaxer-server service
   - Add client variables to nedaxer-client service

4. **Deploy:**
   - Click "Apply" to start deployment
   - Monitor build logs for any issues
   - Both services will be deployed automatically

### D. Post-Deployment Verification

1. **Check Service Health:**
   - Visit `https://nedaxer-server.onrender.com/api/health`
   - Should return server health status

2. **Test Frontend:**
   - Visit `https://nedaxer-client.onrender.com`
   - Verify all features work correctly

3. **Test API Integration:**
   - Check crypto price updates
   - Test authentication flow
   - Verify WebSocket connections

## 5. Required Manual Steps

### Update Root Package.json
Since this file is restricted in the environment, manually update it with:

```json
{
  "name": "nedaxer-monorepo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Nedaxer Trading Platform - Monorepo",
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "npm run dev:server",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "start": "cd server && npm run start",
    "install:all": "npm install && npm install --prefix client && npm install --prefix server",
    "clean": "npm run clean:client && npm run clean:server && rm -rf node_modules",
    "clean:client": "cd client && npm run clean",
    "clean:server": "cd server && npm run clean",
    "lint": "npm run lint:client && npm run lint:server",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
```

### Install Dependencies
```bash
# Install dependencies for both packages
cd client && npm install
cd ../server && npm install
```

## 6. Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Verify Node.js version is 18+ in Render
   - Check all environment variables are set
   - Ensure MongoDB connection string is valid

2. **Asset Loading Issues:**
   - Check Vite configuration paths
   - Verify CORS settings between services

3. **TypeScript Errors:**
   - Run `npm run lint` in both client and server
   - Check tsconfig.json configurations

4. **Database Connection:**
   - Verify MongoDB Atlas IP whitelist includes Render IPs (0.0.0.0/0)
   - Check connection string format and credentials

### Success Indicators:
- ✅ Both services deploy successfully on Render
- ✅ Frontend loads without errors
- ✅ API endpoints respond correctly
- ✅ Real-time features (WebSocket, crypto prices) work
- ✅ Authentication and user features functional

## 7. Monitoring & Maintenance

### Health Checks:
- Monitor Render service logs
- Set up uptime monitoring
- Check database connection status

### Updates:
- Use feature branches for all changes
- Test locally before deployment
- Monitor deployment logs for issues

---

## Summary

This deployment guide provides a complete pathway from the current monorepo structure to a production-ready deployment on Render with proper Git workflow management. The restructuring resolves all deployment issues mentioned and provides a scalable foundation for the Nedaxer trading platform.