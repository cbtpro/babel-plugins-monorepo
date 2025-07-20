import { PluginObj, types as t } from '@babel/core';

export default function fixStringSliceMemory(): PluginObj {
  return {
    name: 'fix-string-slice-memory',
    visitor: {
      CallExpression(path) {
        const callee = path.node.callee;

        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property, { name: 'slice' })
        ) {
          const obj = callee.object;

          if (
            t.isStringLiteral(obj) ||
            t.isIdentifier(obj) ||
            t.isMemberExpression(obj) ||
            t.isCallExpression(obj) ||
            t.isTemplateLiteral(obj)
          ) {
            const newObj = t.binaryExpression(
              '+',
              t.stringLiteral(''),
              obj
            );

            const newCallee = t.memberExpression(newObj, t.identifier('slice'));

            path.replaceWith(
              t.callExpression(newCallee, path.node.arguments)
            );
          }
        }
      }
    }
  };
}
