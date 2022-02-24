import { ConfigService } from '@metaio/worker-common';
import { config as dotEnvConfig } from 'dotenv-flow';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
dotEnvConfig();

function configBuilder(): Record<string, unknown> {
  try {
    const configFile = path.join(
      __dirname,
      '..',
      '..',
      'configs',
      'config.yaml',
    );
    fs.accessSync(configFile, fs.constants.R_OK);
    const configData = fs.readFileSync(configFile, 'utf8');
    return yaml.parse(configData);
  } catch (error) {
    console.warn(`Config file not found. \n`, error);
    return {};
  }
}

export const config = new ConfigService(configBuilder());
