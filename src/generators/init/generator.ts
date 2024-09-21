import {
  addDependenciesToPackageJson,
  formatFiles,
  readNxJson,
  removeDependenciesFromPackageJson,
  Tree,
  updateNxJson,
} from '@nx/devkit';
import {
  addGithubActionCI,
  addGitIgnoreEntry,
  nxFoundryVersion,
} from '../../utils';
import { InitGeneratorSchema } from './schema';

const updateDependencies = (tree: Tree, schema: InitGeneratorSchema) => {
  removeDependenciesFromPackageJson(tree, ['nx-foundry'], []);

  return addDependenciesToPackageJson(
    tree,
    {},
    {
      'nx-foundry': nxFoundryVersion,
    },
    undefined,
    schema.keepExistingVersions
  );
};

const setupTargets = (tree: Tree) => {
  const nxJson = readNxJson(tree) || {};

  const hasPlugin = nxJson.plugins?.some((p) =>
    typeof p === 'string' ? p === 'nx-foundry' : p.plugin === 'nx-foundry'
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
          deployTargetName: 'deploy',
        },
      },
    ];
  }

  updateNxJson(tree, nxJson);
};

export async function initGenerator(tree: Tree, schema: InitGeneratorSchema) {
  setupTargets(tree);

  addGitIgnoreEntry(tree);
  addGithubActionCI(tree);

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return !schema.skipPackageJson
    ? updateDependencies(tree, schema)
    : () => null;
}

export default initGenerator;
