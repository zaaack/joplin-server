import { task, logger } from "foy";
import { robocopy, runInMiniPC, delInMiniPC } from "./tasks/utils";

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
    ];
    await delInMiniPC("C:/Users/z/server/joplin-server/dist");
    await robocopy("server", dist, files);

    await runInMiniPC(
        "cd C:/Users/z/server/joplin-server && pnpm i -P thirty-two",
    );
    await runInMiniPC("supervisorctl start joplin-server");
    await runInMiniPC("supervisorctl tail joplin-server");
});
