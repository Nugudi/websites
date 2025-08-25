# AI Rules (Single Entry Point)

## 🚨 MANDATORY: READ ALL DOCUMENTS BEFORE ANY TASK

**IMPORTANT**: You MUST read ALL documents listed below BEFORE performing ANY task in this repository. These documents contain CRITICAL rules that override default behaviors.

### Required Reading Order:

1. **FIRST**: Read [claude/packages.md](./claude/packages.md) — Contains commit rules, import conventions, and monorepo structure (HIGHEST PRIORITY)
2. **SECOND**: Read [claude/frontend.md](./claude/frontend.md) — Frontend development patterns and code style
3. **THIRD**: Read [claude/testing.md](./claude/testing.md) — Testing requirements and patterns

## ⚠️ CRITICAL REMINDERS

- **NEVER** make commits without reading `claude/packages.md` first (contains Co-Author prohibition)
- **NEVER** create new components without checking existing packages
- **ALWAYS** follow the import rules specified in the documents
- **ALWAYS** use the exact commit format from `claude/packages.md`

## Why This Matters

Failure to read these documents will result in:

- ❌ Incorrect commit messages (Co-Author lines that break our CI/CD)
- ❌ Duplicate component creation (wasting existing packages)
- ❌ Wrong import patterns (breaking build process)
- ❌ Inconsistent code style (failing code reviews)

**DO NOT PROCEED** with any development task until you have confirmed understanding of ALL the rules in the referenced documents.
