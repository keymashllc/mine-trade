#!/bin/bash
# Script to push mine-trade to GitHub

# Add remote (update URL if needed)
git remote add origin https://github.com/keymashllc/mine-trade.git

# Ensure we're on main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Pushed to GitHub!"
echo "Next: Deploy to Vercel following DEPLOY.md instructions"

