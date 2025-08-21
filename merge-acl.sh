#!/bin/bash
set -e

echo "🔄 Merging ACL changes from acl-evaluation branch..."

# Проверяем текущую ветку
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Выполняем merge
echo "🔀 Merging acl-evaluation into $CURRENT_BRANCH..."
git merge --no-ff acl-evaluation -m "feat(acl): merge ACL system improvements from acl-evaluation

- Enhanced role-based access control
- Project and account-level permissions
- Improved guards and policies
- Menu access control system
- ACL configuration and decorators"

echo "✅ ACL merge completed successfully!"
echo "📊 Changes merged:"
git log --oneline -5

echo "🧪 Next steps:"
echo "- Run tests to verify ACL functionality"
echo "- Check that all guards and policies work correctly"
echo "- Verify menu access control"
