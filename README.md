# p2p_display

一个用于分析 P2P 日志的前端项目，基于 React、TypeScript 和 Vite，当前用于辅助理解日志结构、提取关键字段，并为 AI 分析和排障提供上下文。

## 技术栈

- Vite 5
- React 19
- TypeScript 5
- React Router 6
- Zustand 5

## 目录结构

- `src/`: 前端应用代码
- `knowledge/`: 日志分析知识库

## 环境安装

### 运行项目所需环境

建议使用以下环境：

- Node.js 18 及以上
- npm 9 及以上

安装依赖并启动开发环境：

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

运行自动化验证：

```bash
npm run test
npm run test:e2e
```

## 本地 P2P 日志查看器

当前主界面已经替换为本地 P2P 日志查看器，包含以下能力：

- 顶部标题栏显示上传入口，解析成功后显示日志绝对路径
- 时间轴区域支持精确时间选择，并将文本列表定位到对应时间点之后的首条记录
- 右侧拖拽上传区与顶部上传共用同一解析流程
- 底部内容区域支持文本面板和拓扑占位面板切换
- 文本面板对大结果集启用虚拟滚动，小结果集直接渲染以保证交互稳定

解析规则当前聚焦仓库知识库中定义的两个核心字段：

- 时间戳
- `_msg` 核心消息

常见开发入口：

```bash
npm run dev
```

测试覆盖包含：

- `tests/unit/log-parser/parseLogFile.test.ts`
- `tests/integration/log-viewer/*.test.tsx`
- `tests/e2e/log-viewer/*.spec.ts`

## 通过 Spec Kit 开发

本仓库支持按照 Spec-Driven Development 的方式推进功能开发，即先明确原则和需求，再生成计划、任务，并据此实施。

### 1. 安装 `uv`

`spec-kit` 官方推荐通过 `uv` 安装 CLI。若本机尚未安装，可先安装 `uv`：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

安装完成后可检查版本：

```bash
uv --version
```

### 2. 安装 Specify CLI

推荐使用持久化安装：

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

安装完成后检查：

```bash
specify check
```

如果只想一次性使用，也可以：

```bash
uvx --from git+https://github.com/github/spec-kit.git specify check
```

### 3. 在项目中初始化 Spec Kit

在仓库根目录执行：

```bash
specify init . --ai codex
```

如果当前是通过 Codex CLI 以 skills 模式协作，后续通常使用 `$speckit-*` 命令；其他支持 slash command 的 AI Agent 一般使用 `/speckit.*` 命令。

### 4. 建立项目原则

先定义项目约束和开发原则，例如日志分析准确性、类型安全、可维护性和验证要求：

```text
$speckit-constitution
```

建议在原则中明确：

- 日志字段解析必须可追溯
- AI 推断与原始日志内容要区分清楚
- 前端展示需要便于定位关键上下文
- 新增知识文档优先放在 `knowledge/`，并保持一主题一文件

### 5. 编写功能规格

围绕“要解决什么问题”描述需求，而不是直接写实现细节：

```text
$speckit-specify 为 P2P 日志增加结构化解析视图，支持从原始日志中提取关键字段、关联上下文，并展示便于排障的摘要信息。
```

### 6. 生成技术实现计划

在计划阶段补充当前仓库技术背景和实现边界：

```text
$speckit-plan 使用 Vite 5、React 19、TypeScript 5、React Router 6 和 Zustand 5 实现。知识文档放在 knowledge/，日志样例参考, 优先保持前端结构清晰、类型明确、便于后续扩展多类日志解析规则。
```

### 7. 拆解任务

基于规格和计划生成可执行任务列表：

```text
$speckit-tasks
```

通常会得到面向实现的任务拆分，例如：

- 日志数据模型设计
- 解析与字段提取逻辑
- 结果展示页面
- 示例数据与知识库补充
- 验证与回归检查

### 8. 按任务实施

在规格、计划、任务都准备完成后执行实现：

```text
$speckit-implement
```

开发过程中建议遵循以下顺序：

1. 先补规格，再补计划，不直接跳到编码。
2. 实现时优先对齐 `spec.md`、`plan.md`、`tasks.md`。
3. 新增日志知识或样例时，同步更新 `knowledge/` 或相关说明文档。
4. 完成后至少执行一次构建或必要验证，例如 `npm run build`。

## 参考资料

- Spec Kit 官方仓库：<https://github.com/github/spec-kit>
- Spec Kit README：<https://github.com/github/spec-kit/blob/main/README.md>
