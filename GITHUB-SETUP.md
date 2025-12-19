# GitHub Setup Instructions

## Option 1: If you already have a "borz" repo on GitHub

Run these commands (replace YOUR_USERNAME and REPO_NAME):

```bash
cd "/Users/omar/Desktop/Borz Detailing/index.html"

# Add your existing GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Option 2: Create a new repo on GitHub

1. Go to: https://github.com/new
2. Repository name: `borz` (or `borz-detailing`)
3. Make it **Public** (for free hosting) or **Private**
4. **Don't** initialize with README
5. Click "Create repository"
6. Copy the repo URL
7. Run:

```bash
cd "/Users/omar/Desktop/Borz Detailing/index.html"
git remote add origin https://github.com/YOUR_USERNAME/borz.git
git branch -M main
git push -u origin main
```

## Option 3: Use GitHub CLI (if installed)

```bash
gh repo create borz --public --source=. --remote=origin --push
```

---

**Your files are already committed and ready to push!**

