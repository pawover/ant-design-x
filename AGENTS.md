# AGENTS.md — OpenCode 会话上手指南（简体中文）

## 仓库定位

- `ant-design/x` 的 fork（pnpm monorepo，git 仓库根 = 本目录）。分支与提交规范**唯一来源见 `docs/FORK.md`**（sync/pr-* 合上游、fix/* 自修、禁止改写上游作者原始提交、pnpm/node 版本由根 `package.json` 固定），本文件不重复。
- 主要包：`@ant-design/x`（`packages/x`，主力）、`x-markdown`、`x-sdk`、`x-card`、`x-skill`（Node CLI，`node --test`，不走 jest）。改动先确认落在哪个包。
- `packages/x` 源码在 `packages/x/components/`（**不是 `src/`**）：组件在 `components/<组件名>/`，测试在其 `__tests__/`，demo 在 `demo/`（有 `demo.test.ts` 快照全量锁定 demo）。

## 常用命令

```bash
pnpm install                                   # 安装依赖

# 跑单个组件测试（在 packages/x 下，顺序必须：先 pretest 再 jest）
cd packages/x
npm run pretest                                # 生成 git-ignored 产物：components/version/version.ts、token-meta.json、token.json
npx jest --config .jest.js --coverage=false --no-cache --silent components/think

npx biome lint packages/x/components/<文件>     # 仓库根或任意位置单文件 lint（另：npx biome format --write <文件>）
npx tsc --noEmit                      # 在 packages/x 下（见下方既有报错说明）
```

## 测试与验证陷阱（高频踩坑）

- **jest 必须带 `--no-cache`**：带缓存会出现假性 `Cannot find './extractStyle' / './version'` 报错。根因是 `@ant-design/tools` 的 `codePreprocessor.getCacheKey()` 未含文件内容（见 `packages/x/.jest.js` transform 配置）。所有包的 `test`/`coverage` 脚本自带 `--no-cache`，手工跑时不要漏。
- **首次运行 jest 前必须先 `npm run pretest`**（同包内），否则缺 `version` / token 产物导致编译失败。
- `npx tsc --noEmit`（`packages/x`，需 `NODE_OPTIONS=--max-old-space-size=8192`）**存在既有报错**：`react-syntax-highlighter` / `lodash.throttle` 的 @types 声明缺失、`@rc-component/menu` 依赖可见性问题。这是存量问题，非新改动引起；判定标准：**改动文件无新报错**。不要为消报错而新增依赖或放宽 tsconfig。
- 单测环境为 `@happy-dom/jest-environment`，`.jest.js` 配置 `bail: true`（首个失败即终止全量）；改 demo 会触发 `demo.test.ts` 快照更新，须确认快照 diff 是预期变更。
- push 前验证基线（`docs/FORK.md`「验证要求」）：改动组件的单项测试 + biome lint，不强制全量。

## 结构与包边界

- 各包的测试有跨包映射：`packages/x/.jest.js` 的 `moduleNameMapper` 把 `@ant-design/x-markdown` / `x-sdk` / `x-card` 指到对应包的 `src/`——在 `packages/x` 跑测试实际会编译到兄弟包源码。
- CI（`.github/workflows/main.yml`）用 **utoo（`ut install / lint / tsc / coverage / test:dekko`）**，与本地工具链不同，本地不要用 `ut`，按上文命令验证。
- 根 `package.json` 的 workspace 脚本为 npm workspaces 形态（`npm run --workspaces`），安装用 pnpm（`pnpm-workspace.yaml` 与 `pnpm-lock.yaml` 均已提交，禁止手动编辑 lockfile）；`.npmrc`: `legacy-peer-deps=true`。跨包脚本若失败，退回在各包目录内单跑。

## 代码约定

- biome：单引号、行宽 100、2 空格缩进（`biome.json`）；pre-commit 经 lint-staged 对 `*.{ts,tsx,js,jsx,json,css,sh}` 跑 `biome check --write`，对 `*.{md,yml}` 跑 prettier。commit-msg 的 commitlint 已注释停用，但 commit message 仍按 `docs/FORK.md` 用 conventional commits（`fix(think): ...`，scope 为组件名）。

## Agent skills

### Issue tracker

GitHub Issues（`gh` CLI，操作前须确认目标为 pawover/ant-design-x，勿写 upstream）。See `docs/agents/issue-tracker.md`.

### Domain docs

single-context：根 `GLOSSARY.md` + `docs/adr/`。See `docs/agents/domain.md`.
