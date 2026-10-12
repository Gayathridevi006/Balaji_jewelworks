#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "Run this script from inside the Git repository." >&2
  exit 1
}
cd "$repo_root"

branch="$(git symbolic-ref --quiet --short HEAD)" || {
  echo "Cannot push from a detached HEAD. Check out a branch first." >&2
  exit 1
}

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Git remote 'origin' is not configured." >&2
  exit 1
fi

git add -A

if git diff --cached --quiet; then
  echo "No changes to commit. Pushing any existing commits on '$branch'."
else
  # Stop if a secret-like file was already tracked or explicitly staged.
  while IFS= read -r path; do
    case "$path" in
      .env|*/.env|.env.*|*/.env.*)
        case "$path" in
          *.example|*.sample|*.template) ;;
          *) echo "Refusing to commit environment file: $path" >&2; exit 1 ;;
        esac
        ;;
      *.pem|*.p12|*.pfx|*.key|credentials.json|*/credentials.json|service-account*.json|*/service-account*.json)
        echo "Refusing to commit credential or private-key file: $path" >&2
        exit 1
        ;;
    esac
  done < <(git diff --cached --name-only)

  git diff --cached --check
  git status --short
  commit_message="${*:-Update project files}"
  git commit -m "$commit_message"
fi

git push origin "$branch"
