/**
 * @file 文件拷贝
 * @author wjh90201@gmail.com
 */

import fs from 'fs';
import path from 'path';
import {async as glob} from 'fast-glob';

interface CopyOption {
    cwd?: string;
    parents?: boolean;
    rename?: (basename: string) => string;
}

const identity = (x: string) => x;

const copy = async (
    src: string | string[],
    dest: string,
    {cwd, parents = true, rename = identity}: CopyOption = {},
) => {
    const source = typeof src === 'string' ? [src] : src;

    if (!source.length || !dest) {
        throw new TypeError('`src` and `dest` are required');
    }

    const sourceFiles = await glob(source, {
        cwd,
        dot: true,
        absolute: false,
        stats: false,
    });

    const destRelativeToCwd = cwd ? path.resolve(cwd, dest) : dest;

    return Promise.all(
        sourceFiles.map(async p => {
            const dirname = path.dirname(p);
            const basename = rename(path.basename(p));

            const from = cwd ? path.resolve(cwd, p) : p;
            const to = parents
                ? path.join(destRelativeToCwd, dirname, basename)
                : path.join(destRelativeToCwd, basename);

            await fs.promises.mkdir(path.dirname(to), {recursive: true});

            return fs.promises.copyFile(from, to);
        }),
    );
};

export default copy;
