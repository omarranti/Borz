# Adding the GitHub Actions Workflow File

The workflow file couldn't be pushed automatically because your Personal Access Token needs the `workflow` scope. Here are 3 ways to add it:

## Option 1: Add via GitHub Web Interface (Easiest)

1. Go to your repository: https://github.com/omarranti/Borz
2. Click "Add file" → "Create new file"
3. Enter the path: `.github/workflows/seo-checks.yml`
4. Copy the contents from `.github/workflows/seo-checks.yml` in your local files
5. Click "Commit new file"
6. Done! The workflow will run automatically

## Option 2: Update Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Edit your token (or create a new one)
3. Check the `workflow` scope/permission
4. Update your local git credentials
5. Then run:
   ```bash
   git add .github/workflows/seo-checks.yml
   git commit -m "Add GitHub Actions workflow"
   git push origin main
   ```

## Option 3: Use GitHub CLI

If you have GitHub CLI installed:
```bash
gh auth refresh -s workflow
git add .github/workflows/seo-checks.yml
git commit -m "Add GitHub Actions workflow"
git push origin main
```

---

## Quick Copy: Workflow File Path

The file is located at:
```
.github/workflows/seo-checks.yml
```

You can view it locally and copy its contents to GitHub.

---

**Recommended**: Use Option 1 (web interface) - it's the quickest and doesn't require token changes.

