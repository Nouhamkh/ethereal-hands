
export enum GestureType {
  NONE = 'NONE',
  FIST = 'FIST',
  PALM = 'PALM',
  TWO_PALMS = 'TWO_PALMS',
  PEACE = 'PEACE',
  POINT = 'POINT',
  OK_SIGN = 'OK_SIGN',
  THUMBS_UP = 'THUMBS_UP'
}

export interface HandData {
  landmarks: any[];
  handedness: string;
  centroid: { x: number, y: number, z: number };
}

export interface ParticleConfig {
  count: number;
  size: number;
  color: string;
}
