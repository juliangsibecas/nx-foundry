import { formatFiles, readNxJson, Tree, updateNxJson } from '@nx/devkit';
import { addGitIgnoreEntry } from '../../utils';

export async function initGenerator(tree: Tree) {
  const nxJson = readNxJson(tree) || {};

  const hasPlugin = nxJson.plugins?.some((p) =>
    typeof p === 'string' ? p === 'nx-foundry' : p.plugin === 'nx-foundry',
  );

  if (!hasPlugin) {
    if (!nxJson.plugins) {
      nxJson.plugins = [];
    }
    nxJson.plugins = [
      ...nxJson.plugins,
      {
        plugin: 'nx-foundry',
        options: {
          buildTargetName: 'build',
          testTargetName: 'test',
          formatTargetName: 'format',
          snapshotTargetName: 'snapshot',
          anvilTargetName: 'anvil',
          deployTargetName: 'deploy',
          castTargetName: 'cast',
        },
      },
    ];
  }

  updateNxJson(tree, nxJson);

  addGitIgnoreEntry(tree);

  await formatFiles(tree);
}

export default initGenerator;
