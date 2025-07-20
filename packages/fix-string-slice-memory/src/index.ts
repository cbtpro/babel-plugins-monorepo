import { PluginObj, types as t } from '@babel/core';

export default function fixStringSliceMemory(): PluginObj {
  return {
    name: 'fix-string-slice-memory',
    visitor: {
      CallExpression(path) {
        const { node } = path;
        const callee = node.callee;

        // 只处理 .slice, .substring, .substr
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property) &&
          ['slice', 'substring', 'substr'].includes(callee.property.name)
        ) {
          const obj = callee.object;

          // 只处理可能是字符串的表达式，比如字符串字面量、标识符、模板字面量、调用表达式等
          if (
            t.isStringLiteral(obj) ||
            t.isIdentifier(obj) ||
            t.isMemberExpression(obj) ||
            t.isCallExpression(obj) ||
            t.isTemplateLiteral(obj)
          ) {
            // 用 '' + obj 包裹原字符串对象，避免内存共享
            const wrappedObj = t.binaryExpression('+', t.stringLiteral(''), obj);

            // 新的 callee：('' + obj).slice / substring / substr
            const newCallee = t.memberExpression(wrappedObj, t.identifier(callee.property.name));

            // 替换调用，参数不变
            path.replaceWith(t.callExpression(newCallee, node.arguments));
          }
        }
      }
    }
  };
}
