import { task, logger, fs } from "foy";
import { robocopy, runInMiniPC, delInMiniPC } from "./tasks/utils";
import * as readline from "readline";

task("deploy", async (ctx) => {
    await ctx.exec("pnpm install", { cwd: "server" });
    await ctx.exec("pnpm build", { cwd: "server" });

    await runInMiniPC("supervisorctl stop joplin-server").catch(logger.warn);

    const dist = "\\\\DESKTOP-4PGV4PO\\Users\\z\\server\\joplin-server";
    const files = [
        "dist",
        "package.json",
        "pnpm-lock.yaml",
        "public",
        "stripeConfig.json",
        "src/views",
        "set-wal-mode.js",
    ];
    await delInMiniPC("C:/Users/z/server/joplin-server/dist");
    await fs.copy("set-wal-mode.js", "server/set-wal-mode.js");
    await robocopy("server", dist, files);

    await runInMiniPC(
        "cd C:/Users/z/server/joplin-server,
    );
    // 手动输入  pnpm i -P thirty-two  node-os-utils

    // 等待用户确认继续
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>((resolve) => {
        rl.question("继续部署？(y/回车=继续, 其他=取消): ", (ans) => {
            rl.close();
            resolve(ans);
        });
    });
    if (answer && answer !== "y") {
        logger.info("部署已取消");
        return;
    }

    await runInMiniPC(
        "cd C:/Users/z/server/joplin-server && node set-wal-mode.js db-prod.sqlite",
    );
    await runInMiniPC("supervisorctl start joplin-server");
    await runInMiniPC("supervisorctl tail joplin-server");
});


task("test", async (ctx) => {
    
    await runInMiniPC(
        "cd C:/Users/z/server/joplin-server && node set-wal-mode.js db-prod.sqlite",
    );
})
