import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readNxJson } from '@nx/devkit';

import { initGenerator } from './generator';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '');
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
});
