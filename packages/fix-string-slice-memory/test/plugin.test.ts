import { describe, it, expect } from 'vitest'
import * as babel from '@babel/core'
import plugin from '../src/index'
import fs from 'fs'
import path from 'path'

function transform(code: string) {
  return babel.transformSync(code, {
    plugins: [plugin],
    presets: ['@babel/preset-env'],
    filename: 'test.js',
  })?.code
}

const fixture = (name: string) => {
  const inputPath = path.join(__dirname, 'fixtures', `${name}.input.js`)
  const expectedPath = path.join(__dirname, 'fixtures', `${name}.expected.js`)
  const input = fs.readFileSync(inputPath, 'utf8')
  const expected = fs.readFileSync(expectedPath, 'utf8')

  return { input, expected }
}

describe('babel-plugin-fix-string-slice-memory', () => {
  it('should fix string.slice leak', () => {
    const { input, expected } = fixture('basic')
    const output = transform(input)
    expect(output?.replace(/\r\n/g, '\n').trim())
      .toBe(expected.replace(/\r\n/g, '\n').trim())
  })
})
