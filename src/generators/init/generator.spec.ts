import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readNxJson } from '@nx/devkit';

import { initGenerator } from './generator';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '');
    tree.write(
      '.github/workflows/ci.yml',
      `
name: CI

on:
  push:
    branches:
      - main
  pull_request:

permissions:
  actions: read
  contents: read

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v4
        with:
          version: 8

`,
    );
  });

  it('should add plugin to nx.json', async () => {
    await initGenerator(tree);
    const nxJson = readNxJson(tree);

    expect(nxJson.plugins).toMatchObject([
      {
        plugin: 'nx-foundry',
        options: {
          buildTargetName: 'build',
          testTargetName: 'test',
          formatTargetName: 'format',
          snapshotTargetName: 'snapshot',
          deployTargetName: 'deploy',
        },
      },
    ]);
  });

  it('should add .gitignore entry', async () => {
    await initGenerator(tree);
    const gitIgnore = tree.read('.gitignore', 'utf-8');

    expect(gitIgnore.includes('# Foundry')).toBe(true);
  });

  it('should add github actions step', async () => {
    await initGenerator(tree);
    expect(tree.read('.github/workflows/ci.yml', 'utf8')).toContain(
      'Install Foundry',
    );
  });
});
