# babel-plugin-fix-string-slice-memory

[![npm](https://img.shields.io/npm/v/babel-plugin-fix-string-slice-memory.svg)](https://www.npmjs.com/package/babel-plugin-fix-string-slice-memory)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 💡 一个 Babel 插件，用于修复 `string.slice` / `substring` / `substr` 的潜在内存泄漏问题，确保截取的是真实的字符串副本。

---

## 🧠 背景介绍

在某些 JavaScript 引擎（如 V8）中，调用 `slice`、`substring` 或 `substr` 从大型字符串中截取子串时，返回的子串可能仍然引用原始大字符串的内存。这会导致不必要的内存保留（memory retention）问题。

例如：

```js
const sub = longStr.slice(0, 10); // 可能仍然引用整个 longStr，占用大量内存
````

而强制触发复制可以避免这种问题：

```js
const sub = ('' + longStr).slice(0, 10); // 强制复制，释放原始字符串内存
```

---

## ✨ 插件功能

将以下代码：

```js
str.slice(0, 10)
str.substring(0, 10)
str.substr(0, 10)
```

自动转换为更安全的形式：

```js
('' + str).slice(0, 10)
('' + str).substring(0, 10)
('' + str).substr(0, 10)
```

避免内存泄漏，提升健壮性。

---

## 📦 安装方式

```bash
pnpm add -D babel-plugin-fix-string-slice-memory
# 或
npm install --save-dev babel-plugin-fix-string-slice-memory
# 或
yarn add -D babel-plugin-fix-string-slice-memory
```

---

## 🔧 使用方式

### `babel.config.js` 中配置：

babel.config.js

```js
const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['babel-plugin-fix-string-slice-memory']
          }
        }
      }
    ]
  }
};
```

## 📌 转换示例

**输入代码：**

```js
const part = longStr.slice(0, 5);
const head = longStr.substring(0, 8);
const tail = longStr.substr(0, 12);
```

**转换结果：**

```js
const part = ('' + longStr).slice(0, 5);
const head = ('' + longStr).substring(0, 8);
const tail = ('' + longStr).substr(0, 12);
```

---

## 🧪 运行测试

项目中已包含单元测试：

```bash
pnpm test
```

使用 [Vitest](https://vitest.dev/) 编写快照测试，确保插件行为一致。

---

## 🛠 本地开发

本插件属于 monorepo 仓库中的一个子包：

```bash
git clone https://github.com/cbtpro/babel-plugins-monorepo.git
cd babel-plugins-monorepo
pnpm install
pnpm build
```

修改插件代码请前往：

```
packages/fix-string-slice-memory/
```