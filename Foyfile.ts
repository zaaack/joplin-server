import { task } from 'foy'
import type { TaskContext } from 'foy/lib/task-manager'
import * as path from 'path'

async function scpToMiniPC(ctx: TaskContext,src: string, dist: string) {
  await ctx.exec(`scp -r ${src} ${process.env.MINIPC_USER}@${process.env.MINIPC_HOST}:${dist}`)
}

async function runInMiniPC(ctx: TaskContext, cmd: string) {
  await ctx.exec(
    `ssh ${process.env.MINIPC_USER}@${process.env.MINIPC_HOST} ${cmd}`
  )
}

task('deploy', async (ctx) => {
  // await ctx.exec(['pnpm build', 'pnpm tsc'])
  const files = [
    './dist',
    './package.json',
    './pnpm-lock.yaml',
    './README.md',
    './public',
    './stripeConfig.json',
    './src/views',
  ]
  // const dist = '/mnt/d/admin/server/joplin-server'
  const dist = '/C/Users/z/server/joplin-server'
  for (const f of files) {
    // await fs.copy(f, path.join(dist, f))
    // await ctx.exec(
    //   `scp -r ${f} ${process.env.MINIPC_USER}@${process.env.MINIPC_HOST}:${path.join(dist, f)}`
  // )
    await scpToMiniPC(ctx, f, path.join(dist, f))
  }
  await runInMiniPC(ctx, `cd "C:/Users/z/server/joplin-server" & pnpm i -P`)
})
