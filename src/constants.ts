
import { GestureType } from './types';

export const PARTICLE_COUNT = 15000;
export const LERP_FACTOR = 0.08; // Increased from 0.045 for quicker response
export const NOISE_STRENGTH = 0.12;

export const GESTURE_COLORS: Record<GestureType, string> = {
  [GestureType.NONE]: '#ffffff',
  [GestureType.FIST]: '#ffdbac',    // Soft Anatomical Peach (Phallic)
  [GestureType.PALM]: '#ffffff',    // Pure white text
  [GestureType.TWO_PALMS]: '#ffdbac', // Soft Anatomical Peach
  [GestureType.PEACE]: '#6a0dad',   // Purple Galaxy
  [GestureType.POINT]: '#f4d03f',   // Saturn Gold
  [GestureType.OK_SIGN]: '#e6e6fa', // Lavender Infinity
  [GestureType.THUMBS_UP]: '#00f2ff', // Ethereal Cyan Jellyfish
};

export const GESTURE_DESCRIPTIONS: Record<GestureType, string> = {
  [GestureType.NONE]: 'Waiting for hands...',
  [GestureType.FIST]: 'Biology: The Penis',
  [GestureType.PALM]: 'Sentiment: I Love Nidhal',
  [GestureType.TWO_PALMS]: 'Biology: The Boobies',
  [GestureType.PEACE]: 'Cosmos: The Weight of a Galaxy',
  [GestureType.POINT]: 'Cosmos: The Rings of Saturn',
  [GestureType.OK_SIGN]: 'Eternity: The Infinite Loop',
  [GestureType.THUMBS_UP]: 'Mystery: The Ethereal Jellyfish',
};
