import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface AppInfo {
  readonly name: string;
  readonly version: string;
  readonly startedAt: Date;
}

export const APP_INFO = 'APP_INFO';

function isPackageMeta(val: unknown): val is { name: string; version: string } {
  if (typeof val !== 'object' || val === null) {
    return false;
  }
  return (
    'name' in val &&
    typeof val.name === 'string' &&
    'version' in val &&
    typeof val.version === 'string'
  );
}

export function appInfoFactory(): AppInfo {
  const raw = readFileSync(join(process.cwd(), 'package.json'), 'utf8');
  const parsed: unknown = JSON.parse(raw);
  const name = isPackageMeta(parsed) ? parsed.name : 'helpdesk-api';
  const version = isPackageMeta(parsed) ? parsed.version : '1.0.0';
  return {
    name,
    version,
    startedAt: new Date(),
  };
}
