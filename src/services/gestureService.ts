
import { GestureType } from '../types';

export class GestureService {
  static classify(landmarks: any[]): GestureType {
    if (!landmarks || landmarks.length === 0) return GestureType.NONE;

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const indexMcp = landmarks[5];
    const middleMcp = landmarks[9];
    const ringMcp = landmarks[13];
    const pinkyMcp = landmarks[17];

    const isIndexExtended = indexTip.y < indexMcp.y;
    const isMiddleExtended = middleTip.y < middleMcp.y;
    const isRingExtended = ringTip.y < ringMcp.y;
    const isPinkyExtended = pinkyTip.y < pinkyMcp.y;

    // Thumbs Up (Thumb extended vertically, others folded)
    if (thumbTip.y < landmarks[3].y && thumbTip.y < landmarks[2].y && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return GestureType.THUMBS_UP;
    }

    // OK Sign (Thumb and Index touching, others extended)
    if (this.getDist(thumbTip, indexTip) < 0.04 && isMiddleExtended && isRingExtended) {
      return GestureType.OK_SIGN;
    }

    // Fist: All fingers folded significantly below MCPs
    if (indexTip.y > landmarks[6].y && middleTip.y > landmarks[10].y && ringTip.y > landmarks[14].y && pinkyTip.y > landmarks[18].y) {
      return GestureType.FIST;
    }

    // Palm: All fingers extended
    if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      return GestureType.PALM;
    }

    // Peace: Index and Middle extended
    if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return GestureType.PEACE;
    }

    // Point: Index only
    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return GestureType.POINT;
    }

    return GestureType.NONE;
  }

  static getDist(p1: any, p2: any) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  static getHandCentroid(landmarks: any[]) {
    let x = 0, y = 0, z = 0;
    landmarks.forEach(l => {
      x += l.x; y += l.y; z += l.z;
    });
    return { x: x / 21, y: y / 21, z: z / 21 };
  }
}
