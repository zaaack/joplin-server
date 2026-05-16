import { exec } from "foy";

export function isWinPath(path: string) {
  return /^\w:/.test(path) || path.startsWith('\\')
}
export async function wsl2win(path:string) {
  if (isWinPath(path)) {
    return path
  }
  let p = await exec(`wslpath -w "${path}"`, {
    stdio: 'pipe',
  })
  return (p.stdout??'').trim()
}

export async function win2wsl(path:string) {
  if (!isWinPath(path)) {
    return path
  }
  let p = await exec(`wslpath -u "${path}"`, {
    stdio: "pipe",
  })
  return (p.stdout ?? '').trim()
}
