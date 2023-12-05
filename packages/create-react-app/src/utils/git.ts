/**
 * @file init git
 * @author wjh90201@gmail.com
 */

import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';

function isInGitRepository(): boolean {
    try {
        execSync('git rev-parse --is-inside-work-tree', {stdio: 'ignore'});
        return true;
    }
    catch (err) {
        console.log(err);
    }
    return false;
}

function isInMercurialRepository(): boolean {
    try {
        execSync('hg --cwd . root', {stdio: 'ignore'});
        return true;
    }
    catch (err) {
        console.log(err);
    }
    return false;
}

function isDefaultBranchSet(): boolean {
    try {
        execSync('git config init.defaultBranch', {stdio: 'ignore'});
        return true;
    }
    catch (err) {
        console.log(err);
    }
    return false;
}

export const tryGitInit = root => {
    let didInit = false;
    try {
        execSync('git --version', {stdio: 'ignore'});
        if (isInGitRepository() || isInMercurialRepository()) {
            return false;
        }

        execSync('git init', {stdio: 'ignore'});
        didInit = true;

        if (!isDefaultBranchSet()) {
            execSync('git checkout -b main', {stdio: 'ignore'});
        }

        execSync('git add -A', {stdio: 'ignore'});
        execSync('git commit -m "Initial commit from Create Next App"', {stdio: 'ignore'});
        return true;
    }
    catch (err) {
        if (didInit) {
            try {
                fs.rmSync(path.join(root, '.git'), {recursive: true});
            }
            catch (err) {
                console.log(err);
            }
        }
        return false;
    }
};
