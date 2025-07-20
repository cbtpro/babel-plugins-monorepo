"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fixStringSliceMemory;
const core_1 = require("@babel/core");
function fixStringSliceMemory() {
    return {
        name: 'fix-string-slice-memory',
        visitor: {
            CallExpression(path) {
                const callee = path.node.callee;
                if (core_1.types.isMemberExpression(callee) &&
                    core_1.types.isIdentifier(callee.property, { name: 'slice' })) {
                    const obj = callee.object;
                    if (core_1.types.isStringLiteral(obj) ||
                        core_1.types.isIdentifier(obj) ||
                        core_1.types.isMemberExpression(obj) ||
                        core_1.types.isCallExpression(obj) ||
                        core_1.types.isTemplateLiteral(obj)) {
                        const newObj = core_1.types.binaryExpression('+', core_1.types.stringLiteral(''), obj);
                        const newCallee = core_1.types.memberExpression(newObj, core_1.types.identifier('slice'));
                        path.replaceWith(core_1.types.callExpression(newCallee, path.node.arguments));
                    }
                }
            }
        }
    };
}
