import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { mkdirSync, rmSync } from 'fs';

const PROJECT_NAME = 'my-project';

describe('nx-foundry', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install nx-foundry@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });

    execSync(`npx nx g nx-foundry:application ${PROJECT_NAME}`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync(`npm ls nx-foundry`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });

  it('should infer tasks', () => {
    const projectDetails = JSON.parse(
      execSync(`nx show project my-project --json`, {
        cwd: projectDirectory,
      }).toString(),
    );

    expect(projectDetails).toMatchObject({
      name: PROJECT_NAME,
      root: PROJECT_NAME,
      sourceRoot: `${PROJECT_NAME}/src`,
      targets: {
        build: {
          executor: 'nx:run-commands',
          options: {
            command: 'forge build',
            cwd: PROJECT_NAME,
          },
        },
        test: {
          executor: 'nx:run-commands',
          options: {
            command: 'forge test',
            cwd: PROJECT_NAME,
          },
        },
        format: {
          executor: 'nx:run-commands',
          options: {
            command: 'forge fmt',
            cwd: PROJECT_NAME,
          },
        },
        snapshot: {
          executor: 'nx:run-commands',
          options: {
            command: 'forge snapshot',
            cwd: PROJECT_NAME,
          },
        },
        deploy: {
          executor: 'nx:run-commands',
          options: {
            command: 'forge script',
            cwd: PROJECT_NAME,
          },
        },
      },
    });
  });
});

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject() {
  const projectDirectory = join(process.cwd(), 'tmp', PROJECT_NAME);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(
    `npx --yes create-nx-workspace@latest ${PROJECT_NAME} --preset apps --nxCloud=skip --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    },
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}
