import { readFile } from 'node:fs/promises';
import { basename, dirname } from 'node:path';

import { parseSkillText } from '@moonshot-ai/agent-core-v2/features/skill/catalog/parser';
import type { SkillMetadata } from '@moonshot-ai/agent-core-v2/features/skill/catalog/types';

export async function readSkillMetadata(skillMdPath: string): Promise<SkillMetadata> {
  const text = await readFile(skillMdPath, 'utf8');
  const metadata = parseSkillText({
    text,
    skillMdPath,
    skillDirName: basename(dirname(skillMdPath)),
    source: 'project',
  }).metadata;
  const nested = metadata['metadata'];
  if (nested !== null && typeof nested === 'object' && !Array.isArray(nested)) {
    return { ...metadata, ...nested };
  }
  return metadata;
}
