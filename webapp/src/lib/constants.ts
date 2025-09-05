export const RELIGIOUS_LEVELS = {
  HILONI: 1,
  TRADITIONALIST: 2,
  PRATIQUANT: 3,
  TRES_PRATIQUANT: 4,
  HAREDI: 5
} as const;

export const RELIGIOUS_LEVEL_LABELS = {
  [RELIGIOUS_LEVELS.HILONI]: 'Hiloni',
  [RELIGIOUS_LEVELS.TRADITIONALIST]: 'Traditionaliste',
  [RELIGIOUS_LEVELS.PRATIQUANT]: 'Pratiquant',
  [RELIGIOUS_LEVELS.TRES_PRATIQUANT]: 'Très pratiquant',
  [RELIGIOUS_LEVELS.HAREDI]: 'Haredi'
} as const;

export type ReligiousLevel = typeof RELIGIOUS_LEVELS[keyof typeof RELIGIOUS_LEVELS];
