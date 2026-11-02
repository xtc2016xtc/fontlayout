---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: ab32d7071a53f0cd330df7eab5e49a98_21cef793c20f11f1a05452540064ee0f
    ReservedCode1: 5W89SYmTU/zEeC+tPeilKrkcdC5aBSSjECLPY2tsoI5YzXh15W6d6zmiNBAmyvcdPUd9po/1u3b29GJEULNeNqFMPUHqaQRYmV0mqSHNJm3bOOmfQlimhuSo1CYtOv/dp7uFdrphCpxGIWMSvJKttnNZ5YqQXB2VX3qgaxOmiiX0xpJUCbJC7EQ90h4=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: ab32d7071a53f0cd330df7eab5e49a98_21cef793c20f11f1a05452540064ee0f
    ReservedCode2: 5W89SYmTU/zEeC+tPeilKrkcdC5aBSSjECLPY2tsoI5YzXh15W6d6zmiNBAmyvcdPUd9po/1u3b29GJEULNeNqFMPUHqaQRYmV0mqSHNJm3bOOmfQlimhuSo1CYtOv/dp7uFdrphCpxGIWMSvJKttnNZ5YqQXB2VX3qgaxOmiiX0xpJUCbJC7EQ90h4=
---
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# fontlayout 项目规范（AI 编码约束）

> 本行以下为团队维护的项目规范正文，可自由编辑。
> 上方 `nextjs-agent-rules` 托管块由 `next dev` 自动生成与维护，请勿修改或删除（原因见块内说明）。

## 1. 项目与版本

- Next.js 16.3.6（App Router，Turbopack 为默认打包器）、React 19.3.0、TypeScript 5（strict）、Tailwind CSS v4、shadcn CLI（style: `aria-nova`）。
- 包管理器只用 npm（以 `package-lock.json` 为准），不要引入 pnpm/yarn 锁文件。
- UI 基础组件底层是 `react-aria-components`，不是 Radix UI；不要照搬 Radix 的 API 与写法。
- 动笔写代码前先读 `node_modules/next/dist/docs/`，至少包括 `01-app/02-guides/version-16.md` 与 `01-app/02-guides/ai-agents.md`；训练数据里的 Next.js 惯例在本版本可能已失效。

## 2. 目录约定


| 路径             | 用途                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| `app/`           | 路由、`layout.tsx`、页面与全局样式 `globals.css`                                   |
| `components/`    | 业务组件；`components/theme-provider.tsx` 为 next-themes 主题封装（含 `d` 键切换） |
| `components/ui/` | shadcn CLI 生成的基础组件，统一从`components/ui/index.ts` 导出                     |
| `hooks/`         | 自定义 Hook（当前为空，仅`.gitkeep` 占位）                                         |
| `lib/`           | 工具函数；`lib/utils.ts` 只 re-export `cn`                                         |
| `public/`        | 静态资源                                                                           |

- 引用一律使用 `@/*` 别名（映射项目根，见 `tsconfig.json`），禁止跨目录 `../` 相对导入。
- 空目录中的 `.gitkeep` 用于占位，不要删除。

## 3. 常用命令


| 目的                                      | 命令                |
| ----------------------------------------- | ------------------- |
| 开发（自动写入托管块、输出到`.next/dev`） | `npm run dev`       |
| 生产构建                                  | `npm run build`     |
| 启动生产服务                              | `npm run start`     |
| 代码检查                                  | `npm run lint`      |
| 格式化 TS/TSX                             | `npm run format`    |
| 类型检查                                  | `npm run typecheck` |

## 4. 代码风格

- Prettier（`.prettierrc`）：无分号、双引号、2 空格缩进、`printWidth` 80、`trailingComma: es5`、LF；已启用 `prettier-plugin-tailwindcss`，Tailwind 类名会被自动排序，`cn`/`cva` 内的类名同样参与排序。改完 `.ts/.tsx` 必须跑 `npm run format`。
- ESLint 使用扁平配置 `eslint.config.mjs`（`core-web-vitals` + `typescript`），自动忽略 `.next/`、`out/`、`build/`、`next-env.d.ts`。Next.js 16 已移除 `next lint`，统一用 `npm run lint`。
- 只写 `.ts`/`.tsx`，不新增 `.js`/`.jsx` 源码；文件名用 kebab-case（如 `theme-provider.tsx`），导出的组件用 PascalCase。
- 默认写服务端组件；只有需要状态、事件或浏览器 API 时才在文件首行加 `"use client"`，并把客户端边界压到最小范围。
- 导入分组：外部包 → `@/` 别名 → 相对路径，组间空行。

## 5. 组件与样式

- 新增 UI 组件必须用 CLI 生成：`npx shadcn@latest add <component>`，产物落在 `components/ui/`；不要手改生成文件的结构，定制请用 `className` 覆盖或在外层包业务组件。
- 新增 `components/ui/` 组件后，同步在 `components/ui/index.ts` 追加导出，保持统一出口。
- `cn()` 统一从 `@/lib/utils` 导入（底层是 `cn` 包），条件类名合并只用它，不要引入 `clsx` / `tailwind-merge`。
- 组件变体用 `class-variance-authority`，写法参考 `components/ui/button.tsx`。
- 颜色只用语义 token：`bg-background`、`text-foreground`、`bg-primary`、`border-border`、`text-muted-foreground` 等；禁止硬编码颜色值，禁止 Tailwind 调色板类（如 `bg-gray-500`）。
- 主题变量定义在 `app/globals.css`（`:root` 与 `.dark`，OKLCH）。Tailwind v4 没有 `tailwind.config.*`，主题与 token 映射写在 `@theme inline` 内。
- 深色模式走 `next-themes` + `dark` 类（`@custom-variant dark` 定义），不要自写 `matchMedia` 逻辑。
- 图标统一用 `lucide-react`（`components.json` 的 `iconLibrary`），不要混用其他图标库或内联 `<svg>` 图标。
- 字体用 `next/font` 在 `app/layout.tsx` 注入 CSS 变量（`--font-sans`、`--font-mono`），不要用 `<link>` 引外部字体。

## 6. Next.js 16 注意事项（强制）

- `params`、`searchParams`、`cookies()`、`headers()`、`draftMode()` 均为异步，必须 `await`；同步访问已彻底移除。
- 中间件文件名为 `proxy.ts`（原 `middleware.ts`），runtime 仅支持 `nodejs`。
- `revalidateTag(tag, cacheLife)` 必须传第二个参数。
- Turbopack 已是默认打包器，不要再依赖 webpack 专属配置或插件。
- 其余变更（`next/image` 默认值调整、PPR 改为 `cacheComponents`、并行路由需 `default.js`、`serverRuntimeConfig` 移除改用环境变量等）见 `node_modules/next/dist/docs/01-app/02-guides/version-16.md`。

## 7. 禁止事项与提交前检查

- 禁止修改、删除或重排 `AGENTS.md` 中的 `nextjs-agent-rules` 托管块；`CLAUDE.md` 仅一行 `@AGENTS.md`，不要改成其他内容。
- `next-env.d.ts`、`.next/`、`node_modules/` 为生成物或依赖，不要手改、不要提交（`next-env.d.ts` 由 Next 自动维护，含版本相关引用）。
- 提交前必须通过：`npm run lint`、`npm run typecheck`、`npm run build`。
- 不引入未使用或与 React 19 / Next.js 16 不兼容的依赖。
