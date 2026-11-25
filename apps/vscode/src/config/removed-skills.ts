const REMOVED_ENGINE_SKILLS = new Set([
  "custom-theme",
  "sub-skill",
  "sub-skill.review",
  "sub-skill.consolidate",
]);

export function isRemovedEngineSkill(name: string): boolean {
  return REMOVED_ENGINE_SKILLS.has(name.toLowerCase());
}
