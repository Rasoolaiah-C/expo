# Git & GitHub Setup Guide

## Initial Setup

### 1. Create GitHub Repository

Visit GitHub and create a new repository named `experiment-backend`

```bash
# Navigate to project
cd experiment-backend

# Initialize git
git init

# Add files
git add .

# Initial commit
git commit -m "chore: initial project setup"
```

### 2. Connect to Remote

```bash
# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/yourusername/experiment-backend.git

# Rename branch to main
git branch -M main

# Push to remote
git push -u origin main
```

## Branch Strategy

### Main Branches

- **main**: Production-ready code
  - Protected branch
  - Require PR reviews
  - Automated tests required

- **develop**: Development branch
  - Integration branch for features
  - Unstable but functional

### Feature Branches

Create feature branches from `develop`:

```bash
git checkout -b feature/add-experiment-search
git checkout -b feature/improve-validation
git checkout -b bugfix/fix-date-validation
git checkout -b hotfix/critical-performance-issue
```

## Commit Conventions

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build, dependencies, etc.
- **ci**: CI/CD changes

### Examples

```bash
git commit -m "feat(experiments): add bulk export functionality"
git commit -m "fix(api): resolve null pointer in date validation"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for CRUD operations"
git commit -m "perf: optimize database queries with indexing"
```

## Pull Request Workflow

### 1. Create Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
```

### 2. Make Changes

```bash
# Make your changes
git add .
git commit -m "feat: implement feature"
```

### 3. Push and Create PR

```bash
git push origin feature/your-feature
```

Then create PR on GitHub:
- Set base to `develop` (or `main` for hotfixes)
- Fill in PR template
- Link related issues

### 4. Code Review

- Address review comments
- Make requested changes
- Push updates (auto-updates PR)

### 5. Merge

After approval:
```bash
# Squash commits (optional)
git rebase -i develop

# Merge
git merge --no-ff feature/your-feature

# Push
git push origin develop
```

## Tagging Releases

```bash
# Create tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag
git push origin v1.0.0

# List tags
git tag -l
```

## Useful Git Commands

```bash
# See commit history
git log --oneline -10

# See what changed
git diff main develop

# Stash changes
git stash

# Apply stashed changes
git stash pop

# Check branch status
git status

# View all branches
git branch -a

# Delete branch
git branch -d feature/old-feature

# View remote branches
git remote -v
```

## GitHub Actions Integration

### Secrets Setup

1. Go to Settings → Secrets and variables → Actions
2. Add required secrets:

```
KUBE_CONFIG: base64 encoded kubeconfig
SONAR_TOKEN: SonarQube auth token
```

### Workflow Triggers

- **On Push**: Tests run automatically
- **On PR**: Tests run before merge
- **On Tag**: Release workflow triggered
- **Manual**: Rollback workflow can be triggered manually

## Continuous Integration

All changes trigger:
1. Linting
2. Unit tests
3. Integration tests
4. Code coverage analysis
5. Security scanning

## Status Checks

All status checks must pass before merging:
- ✓ Tests pass
- ✓ Code quality passes
- ✓ No conflicts

## Environment Management

### Local Development
```bash
# Create .env from template
cp .env.example .env

# Install hooks (optional)
npm install husky --save-dev
npx husky install
```

### Production
Secrets managed in:
- GitHub Secrets (for CI/CD)
- Kubernetes Secrets (for runtime)
- Environment ConfigMaps (for config)

## Troubleshooting

### Merge Conflicts

```bash
# See conflicts
git status

# Edit conflicted files
# Then:
git add .
git commit -m "fix: resolve merge conflicts"
```

### Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

### Recover Deleted Branch

```bash
git reflog
git checkout -b recovered-branch <commit-hash>
```
