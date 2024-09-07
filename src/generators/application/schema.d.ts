import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface ApplicationGeneratorSchema {
  name: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  directory?: string;
}
