# Policy-Admin

<img width="1702" height="847" alt="Screenshot 2026-03-31 at 1 03 45 PM" src="https://github.com/user-attachments/assets/b0a9a01d-a3c1-4728-8aae-de2304b448ae" />

A private Google Apps Script-based web application for hosting infosec graphics, promotional materials, and related assets in a Google Workspace environment. 
**This branch contins the admin page of the website and is isolated from the main web application branch so it does not change interfere with the main branch**

## 📋 Project Overview

This project deploys a web application hosted via Google Apps Script, serving dynamically-routed infosec graphics and promotional materials. The application uses a single Google Apps Script project with route-based dispatch to handle multiple content types.

### Technology Stack
- **Runtime**: Google Apps Script (Apps Script)
- **Frontend**: HTML/CSS (compiled to HTML assets)
- **Backend**: Google Apps Script (JavaScript/GS)
- **Deployment**: Apps Script webapp deployment
- **Management**: `clasp` CLI (Google Apps Script command-line interface)
- **Version Control**: Git with orphan branch strategy for admin isolation

---

## 🚀 Setup & Deployment

### Prerequisites
- Node.js and npm installed
- `clasp` CLI (`npm install -g @google/clasp`)
- Authenticated Google account with Apps Script access
- Git access to this repository

### Initial Setup
```bash
git clone <repository-url>
cd infosec-graphics-website
clasp login  # Authenticate with your Google account
```

### Project Files
- **`Code.gs`** - Google Apps Script backend; handles routing and request dispatch
- **`admin.html`** - Admin dashboard/interface HTML
- **`appsscript.json`** - Apps Script project manifest (DO NOT duplicate; single manifest only)
- **`.clasp.json`** - Clasp configuration tied to the Apps Script project ID
- **`README.md`** - This documentation

### Deployment
```bash
clasp push        # Deploy changes to Apps Script
clasp deploy      # Create new versioned deployment (optional)
```

**Important**: After running `clasp create` or similar operations, restore critical settings in `appsscript.json`:
- Timezone settings
- Webapp configuration block
- OAuth scopes

---

## 🌿 Branch Management Strategy

This repository uses a **hybrid branching strategy** combining feature branches with an orphan admin branch for isolated management.

### Branch Overview

| Branch | Purpose | History | Notes |
|--------|---------|---------|-------|
| `main` | Stable release branch | Full linear history | Protected; pulled into production |
| `admin` | **Orphan branch** - Admin UI & deployment | Clean/isolated | Separate deployment; no shared history with main |
| `admin-backup` | Backup reference branch | Original admin history | Preserved for recovery; read-only reference |
| `policy-p*` | Policy-related feature/content branches | Feature branches | Topic-specific development |
| `flyer-type-*` | Flyer design & content branches | Feature branches | Content/design variants |

### ✨ Orphan Branch Design (Admin)

The `admin` branch is intentionally created as a **Git orphan branch** to isolate admin functionality and deployment:

**Why orphan?**
- **Isolation**: Admin code history isn't mixed with public content history
- **Clean Deploy**: Separate deployment artifact without main branch dependencies
- **Security**: Restricted access control can be applied independently
- **Clarity**: Explicit separation between admin and public-facing code

**How it works:**
```bash
# Admin branch is deployed independently via Apps Script routing
# In Code.gs, routing logic dispatches:
#   ?app=admin  -> admin.html (from admin branch)
#   (default)   -> main content (from main branch)
```

### Managing the Admin Branch

**After changes to admin branch:**
```bash
git checkout admin
clasp push              # Deploy admin changes
git push --force origin admin  # Force push (admin is orphan; overwrites remote)
```

**Why force push?**
- Admin orphan branch has no shared history with origin/admin
- Force push safely overwrites remote (backup preserved in `admin-backup`)
- Necessary on first push of new orphan branch

**Pulling/Merging:**
```bash
git checkout admin
git fetch origin
# DO NOT merge from main; admin is intentionally isolated
# Pull only admin-specific changes from feature branches if needed
```

---

## 🔐 Security Measures

### Repository Access Control
- **Privacy**: Repository is **PRIVATE** - no public access
- **Branch Protection**: 
  - `main` branch: Requires reviews before merge
  - `admin` branch: Restricted push access (force push by authorized users only)
- **Collaborator Management**: Limited to infosec team members; audit access regularly

### Deployment Security
- **Single Manifest**: Only ONE `appsscript.json` at repo root (prevents duplicate deployment manifests)
- **Apps Script Versioning**: Each deployment creates timestamped version (recoverable via Apps Script Dashboard)
- **OAuth Scopes**: Minimized to necessary permissions only; document in `appsscript.json`
- **Route-Based Dispatch**: All routing centralized in `Code.gs`; validate all URL parameters

### Data Protection
- **No Secrets in Repo**: 
  - `.clasp.json` contains local project ID only (not credentials)
  - Never commit API keys, OAuth tokens, or credentials
  - Use Google Apps Script Properties Service for sensitive config
- **Git History**: 
  - Admin history isolated via orphan branch (no accidental exposure via main)
  - Sensitive data: verify not committed before push
- **Backup Strategy**: 
  - `admin-backup` preserves previous admin state for recovery
  - Apps Script Dashboard retains deployment versions

### Credential Management
```bash
# Login stores token locally; never commit .clasp credentials
clasp login

# To revoke access:
clasp logout
# Then re-authenticate for development
```

---

## 📝 Workflow Guidelines

### For Content/Feature Development
```bash
git checkout main
git pull origin main
git checkout -b feature/new-content
# Make changes...
git add .
git commit -m "Add new infosec graphics"
git push origin feature/new-content
# Create PR for review
```

### For Admin Changes
```bash
git checkout admin
git pull origin admin  # Fetch latest admin
# Make changes to admin.html, Code.gs, or config
clasp push            # Test deployment
git add .
git commit -m "Update admin: [description]"
git push --force origin admin  # Force push (orphan branch)
```

### Never Merge Main → Admin
The admin branch is isolated by design. Changes should be:
- Created directly on `admin` branch, OR
- Cherry-picked from feature branches if shared logic needed

### Pulling Without Losing Admin
```bash
# Safe: pulling main doesn't affect admin branch
git checkout main
git pull origin main

# Pulling while on admin: only gets admin changes
git checkout admin
git pull origin admin
```

---

## 🛠️ Troubleshooting

**Issue: "Cannot push; branch differs from origin"**
- This is expected for orphan branch; use `git push --force origin admin`

**Issue: `clasp push` fails with duplicate manifest**
- Ensure only ONE `appsscript.json` exists at repo root
- If `admin/appsscript.json` exists, delete it
- Verify `.clasp.json` points to correct project ID

**Issue: Accidentally merged main into admin**
- Recovery: `git push --force origin admin` (reverts to backup if needed)
- Or reference `admin-backup` branch for previous state

**Issue: Lost admin work**
- Check `git reflog` for recent commits
- Reference `admin-backup` branch as fallback

---

## 📚 Additional Resources
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Clasp CLI Documentation](https://github.com/google/clasp)
- [Git Orphan Branches](https://git-scm.com/docs/git-checkout#--orphan)

---

**Last Updated**: March 31, 2026  
**Maintainer**: Infosec Team  
**Status**: PRIVATE - Do not share externally
