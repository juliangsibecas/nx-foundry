import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { applicationGenerator } from './generator';
import { ApplicationGeneratorSchema } from './schema';

const PROJECT_NAME = 'test-project';

describe('application generator', () => {
  let tree: Tree;
  const options: ApplicationGeneratorSchema = {
    name: PROJECT_NAME,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully (derived)', async () => {
    const derivedOptions: ApplicationGeneratorSchema = {
      ...options,
      projectNameAndRootFormat: 'derived',
    };
    await applicationGenerator(tree, derivedOptions);
    const config = readProjectConfiguration(tree, PROJECT_NAME);
    expect(config).toBeDefined();
  });

  it('should run successfully (provided)', async () => {
    const providedOptions: ApplicationGeneratorSchema = {
      ...options,
      projectNameAndRootFormat: 'as-provided',
      directory: `apps/${PROJECT_NAME}`,
    };
    await applicationGenerator(tree, providedOptions);
    const config = readProjectConfiguration(tree, PROJECT_NAME);
    expect(config).toBeDefined();
  });

  it('should run successfully', async () => {
    await applicationGenerator(tree, options);
    const config = readProjectConfiguration(tree, PROJECT_NAME);
    expect(config).toBeDefined();
  });
});
