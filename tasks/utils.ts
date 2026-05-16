import { fs, logger, exec } from "foy";
import { gbkBufferToUtf8 } from "./text-decode";
import { wsl2win } from "./wsl-path";

export async function robocopy(src: string, dist: string, files?: string[]) {
    logger.info("robocopy", src, dist, files);
    const tmpdir = `./cache/tmp/robocopy-${Date.now()}`;
    if (files?.length) {
        await fs.mkdirp(tmpdir);
        for (const f of files) {
            await fs.cp(src + "/" + f, tmpdir + "/" + f, {
                recursive: true,
                preserveTimestamps: true,
                force: true,
            });
        }
        src = tmpdir;
    }
    src = await wsl2win(src);
    dist = await wsl2win(dist);
    const cmd = `robocopy.exe '${src}' '${dist}' /e /mt /z /COPY:DAT /DCOPY:T`;
    logger.info("$", cmd);
    let r = await exec(cmd, {
        cwd: "/mnt/c",
        stdio: "pipe",
        encoding: void 0,
    }).catch((e) => {
        if (e.exitCode >= 8) {
            throw e;
        } else if (e.exitCode > 1) {
            logger.warn(e.message);
        }
        return e;
    });
    let ret = r.all || r.stdout || r.stderr;
    if (ret) {
        logger.info("robocopy", gbkBufferToUtf8(Buffer.from(ret)));
    }
    if (files?.length) {
        await fs.rm(tmpdir, { recursive: true, force: true });
    }
}

export async function runInMiniPC(cmd: string) {
    cmd = `winrs.exe -r:${process.env.MINIPC_HOST} "${cmd}"`;
    let r = await exec(cmd, {
        stdio: "pipe",
        encoding: void 0,
    }).catch((e) => {
        if (e.exitCode >= 8) {
            throw e;
        } else if (e.exitCode > 1) {
            let msg = e.message;
            if (e.stdout || e.stderr) {
                msg = gbkBufferToUtf8(Buffer.from(e.stdout || e.stderr));
            }
            logger.warn(msg);
        }
        return e;
    });
    let ret = r.all || r.stdout || r.stderr;
    if (ret) {
        logger.info(gbkBufferToUtf8(Buffer.from(ret)));
    }
}

export function mkdirInMiniPC(dir: string) {
    dir = dir.replaceAll("/", "\\\\");
    return runInMiniPC(`mkdir "${dir}"`);
}

export function delInMiniPC(dir: string) {
    dir = dir.replaceAll("/", "\\\\");
    return runInMiniPC(`rmdir /s /q "${dir}"`);
}
