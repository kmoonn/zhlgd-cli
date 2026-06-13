# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

zhlgd-cli is a Node.js CLI tool for 武汉理工大学 (Wuhan University of Technology) campus network management. It's published as the `zhlgd` command and currently supports campus network login via the `zhlgd login` command.

## Build & Run Commands

- **Install dependencies:** `npm install`
- **Run CLI locally:** `node bin/index.js <command>` (e.g., `node bin/index.js login -u <学号> -p <密码>`)
- **Link globally for development:** `npm link` then use `zhlgd` directly
- **Tests:** No test framework configured yet (`npm test` is a placeholder)

## Architecture

**Entry point:** `bin/index.js` — sets up a `commander` CLI program, registers all command modules, and parses args.

**Command pattern:** Each command lives in `src/commands/<name>.js` and exports a default function that receives the commander `program` instance and registers its subcommand via `program.command()`. New commands follow this pattern:

```js
// src/commands/example.js
export default (program) => {
    program
        .command('example')
        .description('...')
        .action(async (options) => { ... });
};
```

Then register it in `bin/index.js`: `import exampleCommand from '../src/commands/example.js'; exampleCommand(program);`

**Shared utilities:** `src/utils/` — currently referenced but not yet created (e.g., `prompt.js` for interactive input). Place reusable logic here.

**Campus network API:** The login endpoint is `http://10.0.0.1/login` (POST with `{username, password}`). All network requests use `axios`.

## Key Conventions

- ESM modules throughout (`"type": "module"` in package.json) — use `import`/`export`, not `require()`
- CLI UI text is in Chinese (中文)
- User-facing output uses emoji prefixes (📶 🔐 ✅ ❌)
- Interactive prompts fall back gracefully: CLI flags (`-u`, `-p`) override interactive input
