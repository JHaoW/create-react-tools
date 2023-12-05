/**
 * @file 验证包名是否合法
 * @author wjh90201@gmail.com
 */

import validateProjectName from 'validate-npm-package-name';

function validateNpmName(name: string) {
    const nameValidation = validateProjectName(name);
    if (nameValidation.validForNewPackages) {
        return {valid: true};
    }

    return {
        valid: false,
        problems: [
            ...nameValidation.errors || [],
            ...nameValidation.warnings || [],
        ],
    };
}

export default validateNpmName;
