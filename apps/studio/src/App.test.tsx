import { describe, it, expect } from 'vitest'

describe('Situs Application', () => {
  it('should have correct package name', () => {
    const packageJson = require('../package.json')
    expect(packageJson.name).toBe('situs-visual-website-builder')
  })

  it('should have React as dependency', () => {
    const packageJson = require('../package.json')
    expect(packageJson.dependencies).toHaveProperty('react')
  })

  it('should have TypeScript as dev dependency', () => {
    const packageJson = require('../package.json')
    expect(packageJson.devDependencies).toHaveProperty('typescript')
  })

  it('should have Vite as dev dependency', () => {
    const packageJson = require('../package.json')
    expect(packageJson.devDependencies).toHaveProperty('vite')
  })

  it('should have test script configured', () => {
    const packageJson = require('../package.json')
    expect(packageJson.scripts).toHaveProperty('test')
  })

  it('should have dev script configured', () => {
    const packageJson = require('../package.json')
    expect(packageJson.scripts).toHaveProperty('dev')
  })
}) 