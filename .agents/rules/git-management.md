# Git Management & Maintenance Rule

As requested by the user, the AI assistant must proactively and automatically manage all Git operations:

1. **Automatic Commits**:
   - Automatically stage and commit changes whenever a meaningful milestone, feature, or bugfix is completed.
   - Use standard Conventional Commits format (e.g., `feat(module): description`, `fix(ui): description`, `docs: update walkthrough`).
   - Ensure the working tree is kept clean and all newly created files are tracked.

2. **Branching & Safety**:
   - Ensure `main` remains build-passing and deployable at all times.
   - Run a production build check (`npm run build`) before committing major architectural updates.
   - Create feature branches (e.g., `feature/<name>`) if working on multi-step experimental overhauls, then cleanly merge back to `main`.

3. **Remote Synchronization**:
   - Push commits to the remote repository automatically whenever authentication credentials allow, without requiring manual user intervention.
