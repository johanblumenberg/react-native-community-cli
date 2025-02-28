import {Config} from '@react-native-community/cli-types';
import {logger, CLIError} from '@react-native-community/cli-tools';
import fs from 'fs';
import chalk from 'chalk';

export function getAndroidProject(config: Config) {
  const androidProject = config.project.android;

  if (!androidProject) {
    throw new CLIError(`
      Android project not found. Are you sure this is a React Native project?
      If your Android files are located in a non-standard location (e.g. not inside 'android' folder), consider setting
      \`project.android.sourceDir\` option to point to a new location.
    `);
  }
  return androidProject;
}

/**
 * Get the package name of the running React Native app
 * @param config
 */
export function getPackageName(manifestPath: string) {
  const androidManifest = fs.readFileSync(manifestPath, 'utf8');

  let packageNameMatchArray = androidManifest.match(/package="(.+?)"/);
  if (!packageNameMatchArray || packageNameMatchArray.length === 0) {
    throw new CLIError(
      `Failed to build the app: No package name found. Found errors in ${chalk.underline.dim(
        `${manifestPath}`,
      )}`,
    );
  }

  let packageName = packageNameMatchArray[1];

  if (!validatePackageName(packageName)) {
    logger.warn(
      `Invalid application's package name "${chalk.bgRed(
        packageName,
      )}" in 'AndroidManifest.xml'. Read guidelines for setting the package name here: ${chalk.underline.dim(
        'https://developer.android.com/studio/build/application-id',
      )}`,
    );
  }
  return packageName;
}

// Validates that the package name is correct
export function validatePackageName(packageName: string) {
  return /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(packageName);
}
