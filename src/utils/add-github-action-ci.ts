import { Tree } from '@nx/devkit';
import * as yaml from 'js-yaml';

const CI_FILE_PATH = '.github/workflows/ci.yml';

type YamlFile = {
  name: string;
  jobs: {
    main: {
      steps: Array<{
        uses: string;
        name?: string;
        with?: Record<string, string>;
      }>;
    };
  };
};

export const addGithubActionCI = async (host: Tree) => {
  if (!host.exists('.github/workflows/ci.yml')) {
    return;
  }

  const file = (await yaml.load(host.read(CI_FILE_PATH, 'utf8'))) as YamlFile;

  if (!file.jobs.main.steps) {
    return;
  }

  const actionStep = file.jobs.main.steps.findIndex(
    ({ uses }) => uses === 'actions/checkout@v4',
  );

  file.jobs.main.steps.splice(actionStep + 1, 0, {
    name: 'Install Foundry',
    uses: 'foundry-rs/foundry-toolchain@v1',
  });

  host.write(CI_FILE_PATH, yaml.dump(file));
};
