---
name: foy
description: foy task runner
license: MIT
---

## 🛠️ Foy 极简指南

Foy 是一个基于 Promise 的轻量级 JavaScript/TypeScript 任务运行器。

### 1. 快速开始

* **安装**: `pnpm i -D foy`
* **初始化**: `pnpm foy --init ts`
* **执行**: `pnpm foy <task_name>`

### 2. 核心语法

```ts
import { task, desc, option, fs, dep } from 'foy'

desc('构建任务')
option('-e, --env <env>', '环境参数')
task('build', async ctx => {
  // 执行命令 (带自动转义)
  await ctx.$`echo "Building for ${ctx.options.env}"`
  
  // 文件操作 (Promise 版)
  await fs.rmrf('./dist')
  await fs.copy('./src', './dist')
  
  // 多行执行
  await ctx.exec(`
    tsc
    ls -la
  `)
})

```

### 3. 任务编排

* **串行/并行**:
```ts
// 默认串行运行 test, 再运行 build
task('deploy', ['test', 'build'], async ctx => { ... })

// 高级配置：并行运行 (async)
task('dev', [dep('api').async(), dep('web').async()])

```


* **监听重启**:

```ts
    task('watch', async ctx => {
      ctx.monitor('./src', 'node ./dist/index.js')
    })
    ```

### 4. 常用内置工具
*   **`ctx.$`**: 模板字符串执行命令，安全处理空格。
*   **`fs`**: `mkdirp`, `outputJson`, `iter`, `copy`, `rmrf`。
*   **`logger`**: `debug`, `info`, `warn`, `error`。
*   **`namespace`**: `namespace('db', ns => { task('migrate', ...) })`。

### 5. 实用指令
*   **自动补全**: `foy --completion-profile >> ~/.zshrc`
*   **CI 模式**: `setGlobalOptions({ spinner: false })`

```
