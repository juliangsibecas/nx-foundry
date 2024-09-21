import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { ApplicationGeneratorSchema } from './schema';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import { initGenerator } from '../init/generator';

export async function applicationGenerator(
  tree: Tree,
  options: ApplicationGeneratorSchema
) {
  await initGenerator(tree, options);

  let projectName = options.name;
  let projectRoot = options.directory;

  const nameAndRoot = await determineProjectNameAndRootOptions(tree, {
    ...options,
    projectNameAndRootFormat: options.projectNameAndRootFormat,
    projectType: 'application',
    callingGenerator: 'nx-foundry:application',
  });

  projectName = nameAndRoot.projectName;
  projectRoot = nameAndRoot.projectRoot;

  addProjectConfiguration(tree, projectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: joinPathFragments(projectRoot, 'src'),
    targets: {},
  });

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    root: projectRoot,
  });

  await formatFiles(tree);
}

export default applicationGenerator;
