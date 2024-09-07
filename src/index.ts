import {
  CreateNodesContextV2,
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { readdirSync } from 'fs';
import { dirname, join } from 'path';

export interface FoundryPluginOptions {
  buildTargetName?: string;
  testTargetName?: string;
  formatTargetName?: string;
  snapshotTargetName?: string;
  anvilTargetName?: string;
  deployTargetName?: string;
  castTargetName?: string;
}

const foundryConfigGlob = '**/foundry.toml';

export const createNodesV2: CreateNodesV2<FoundryPluginOptions> = [
  foundryConfigGlob,
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, options, context) =>
        createNodesInternal(configFile, options, context),
      configFiles,
      options,
      context,
    );
  },
];

async function createNodesInternal(
  configFilePath: string,
  options: FoundryPluginOptions,
  context: CreateNodesContextV2,
) {
  const projectRoot = dirname(configFilePath);

  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  if (
    !siblingFiles.includes('package.json') &&
    !siblingFiles.includes('project.json')
  ) {
    return {};
  }

  const buildTarget: TargetConfiguration = {
    command: `forge build`,
    options: {
      cwd: projectRoot,
    },
  };

  const testTarget: TargetConfiguration = {
    command: `forge test`,
    options: {
      cwd: projectRoot,
    },
  };

  const formatTarget: TargetConfiguration = {
    command: `forge fmt`,
    options: {
      cwd: projectRoot,
    },
  };

  const snapshotTarget: TargetConfiguration = {
    command: `forge snapshot`,
    options: {
      cwd: projectRoot,
    },
  };

  const anvilTarget: TargetConfiguration = {
    command: `anvil`,
    options: {
      cwd: projectRoot,
    },
  };

  const deployTarget: TargetConfiguration = {
    command: `forge script`,
    options: {
      cwd: projectRoot,
    },
  };

  const castTarget: TargetConfiguration = {
    command: `cast`,
    options: {
      cwd: projectRoot,
    },
  };

  return {
    projects: {
      [projectRoot]: {
        targets: {
          [options.buildTargetName]: buildTarget,
          [options.testTargetName]: testTarget,
          [options.formatTargetName]: formatTarget,
          [options.snapshotTargetName]: snapshotTarget,
          [options.anvilTargetName]: anvilTarget,
          [options.deployTargetName]: deployTarget,
          [options.castTargetName]: castTarget,
        },
      },
    },
  };
}
