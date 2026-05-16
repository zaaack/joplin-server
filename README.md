# joplin-server Windows 部署

将 [joplin-server](https://github.com/laurent22/joplin/tree/dev/packages/server) 直接部署到 Windows 主机，无需 Docker。

## 工作原理

```mermaid
flowchart LR
    A[WSL Linux] -->|pnpm build| B[编译 server/]
    B -->|robocopy| C[Windows 远程主机]
    C -->|pnpm i -P| D[安装生产依赖]
    D -->|supervisorctl| E[启动服务]
```

部署流程在 `Foyfile.ts` 中定义：

1. 在 `server/` 目录下执行 `pnpm install` 和 `pnpm build`，编译 joplin-server 后端
2. 通过 `winrs` 远程停止目标 Windows 主机上的 supervisor 管理的 joplin-server 进程
3. 使用 `robocopy` 将编译产物（`dist`、`package.json`、`pnpm-lock.yaml`、`public`、`stripeConfig.json`、`src/views`）同步到 Windows 主机
4. 在 Windows 主机上执行 `pnpm i -P` 安装仅生产依赖（包括 `thirty-two` 包）
5. 通过 supervisor 重启 joplin-server 并查看日志

## 前置条件

| 条件 | 说明 |
|------|------|
| WSL | 在 WSL 中运行部署脚本 |
| pnpm | WSL 中安装 pnpm |
| Windows 远程主机 | 目标部署机器（当前配置为 `DESKTOP-4PGV4PO`） |
| winrs | Windows 远程管理服务（WinRM）已启用 |
| supervisor | 远程主机上安装 supervisor 管理 joplin-server 进程 |

## 环境变量

| 变量 | 说明 |
|------|------|
| `MINIPC_HOST` | 远程 Windows 主机地址，`winrs` 通过此变量连接 |

## 使用

```bash
# 部署到远程 Windows 主机
pnpm foy deploy
```

## 目录结构

```
joplin-server/
├── Foyfile.ts          # 部署任务定义
├── tasks/
│   ├── utils.ts        # robocopy / winrs 工具函数
│   ├── text-decode.ts  # GBK 编码解码
│   └── wsl-path.ts     # WSL 路径转 Windows 路径
├── server/             # joplin-server 源码（子项目）
└── cache/              # 临时缓存目录
```

## 与官方 Docker 方案的区别

| | 本方案 | 官方方案 |
|--|--------|----------|
| 依赖 | 无容器化依赖 | 需 Docker |
| 部署目标 | Windows 主机 | 任意支持 Docker 的主机 |
| 进程管理 | supervisor | Docker 容器编排 |
