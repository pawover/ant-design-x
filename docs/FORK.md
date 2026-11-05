# FORK 维护规范

本仓库是 `ant-design/x` 的 fork（`upstream` = ant-design/x，`origin` = pawover/ant-design-x），用于自行合并上游审批较慢的 BUG 修复 PR，以及自行修复 BUG。本文档约定分支流程。

## 分支命名约定

| 前缀 | 用途 | 示例 |
| --- | --- | --- |
| `sync/pr-<上游PR编号>` | 合并上游 `ant-design/x` 的 PR | `sync/pr-2026`（已完成案例） |
| `fix/<组件或路径>-<简述>` | 自己修复 BUG，提 PR 到本仓库 | `fix/think-paste-crash` |
| `feat/<简述>` | 可选，功能扩展 | `feat/new-provider` |
| `chore/<简述>` | 工具链/环境依赖类改动（如 Node/pnpm 版本固定、lockfile 提交），不涉及源码行为 | `chore/toolchain-pin` |

## 上游 PR 合入流程（`sync/pr-*`）

1. `git fetch upstream`
2. 核查 PR 状态：确认未合并，浏览改动范围与关联 issue，判断是否与本地已有改动冲突
3. `git fetch upstream pull/<PR编号>/head`
4. 从 `main` 切分支：`git switch -c sync/pr-<编号>`
5. `git merge --no-ff FETCH_HEAD` —— 保留上游作者的原始提交；merge commit 信息注明来源 PR，例如： `Merge upstream PR #2026 (fix: ...) from ant-design/x`
6. 测试验证（见下文「验证要求」）
7. `git push origin sync/pr-<编号>`
8. `gh pr create --repo pawover/ant-design-x --base main`
9. 合并 PR（使用 merge 方式）
10. 本地 main 快进：`git switch main && git pull origin main`

## 自行修 BUG 流程（`fix/*`）

1. 从 `origin/main` 切分支：`git fetch origin && git switch -c fix/<组件>-<简述> origin/main`
2. 最小改动修复，且**必须补或更新测试**覆盖该场景
3. 走与上游合入相同的后续路径：测试验证 → push origin → PR 到本仓库 `main` → merge 合并 → 本地 main 快进
4. 关注上游进展：
   - 若上游随后输出了同样的修复 PR，下次 sync 时在 merge commit / PR 描述中说明本地已有该修复
   - 处理原则：**以最终行为一致为准**。相同改动合入时 git 会自动去重；若实现有差异，以测试通过且行为一致的一版为准，废弃另一版

## 提交与 commit message 规范

- 遵循上游 conventional commits 风格：`fix(think): ...`、`feat(sender): ...`（scope 为组件名）
- 引用上游 issue / PR 编号（如 `Ref: #1999`）便于溯源
- **不修改上游作者的原始提交**：禁止 rebase / amend / squash 上游提交，只在其上追加提交或 merge

## 本地环境约定

- Node 与 pnpm 版本已由根 `package.json` 固定：`engines` 要求 `node >=24.22.2`，`devEngines` 精确锁定 `24.22.2`，`packageManager` 精确锁定 `pnpm@12.16.1`；不要绕过（如 `--engine-strict=false` 或改用其他 pnpm/node 版本）
- `pnpm-workspace.yaml` 与 `pnpm-lock.yaml` **均已提交**，是 workspace 配置与依赖锁定的正源，禁止手动编辑 lockfile；切换包管理器目录（pnpm 10+ 会把 workspace 配置迁移到 yaml）时以 yaml 为准
- `pnpm install` 若变化了 `pnpm-lock.yaml`，包含 lockfile 更新的改动**必须一并提交**，避免锁漂移

## 验证要求

合入或修复在 push 前**必须**通过：

| 项目 | 说明 |
| --- | --- |
| 相关组件单项测试 | 可仅跑改动所在组件目录的测试，不强制全量；首次运行前先执行 pretest 生成版本等文件 |
| biome lint | 全仓 lint 通过 |

- 单项测试命令形态（在 `packages/x` 下）：

  ```bash
  cd packages/x
  npm run pretest                     # 首次或首次变更后运行
  npx jest --config .jest.js components/<组件名>
  ```

- 上游各项 `test*` / `lint` 脚本位于 `packages/x/package.json`，可按需组合
- **不要为了通过测试而放宽断言**：测试必须真实锁定 BUG 场景与修复行为
