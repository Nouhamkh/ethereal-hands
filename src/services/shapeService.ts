
import { GestureType } from '../types';

export class ShapeService {
  private static canvas: HTMLCanvasElement | null = null;

  static generatePoints(type: GestureType, count: number): Float32Array {
    const positions = new Float32Array(count * 3);
    
    switch (type) {
      case GestureType.FIST:
        this.generatePhallus(positions, count);
        break;
      case GestureType.PALM:
        this.generateText(positions, count, "I love Nidhal");
        break;
      case GestureType.PEACE:
        this.generateGalaxy(positions, count);
        break;
      case GestureType.POINT:
        this.generateSaturn(positions, count);
        break;
      case GestureType.TWO_PALMS:
        this.generateAnatomy(positions, count);
        break;
      case GestureType.OK_SIGN:
        this.generateInfinity(positions, count);
        break;
      case GestureType.THUMBS_UP:
        this.generateJellyfish(positions, count);
        break;
      default:
        this.generateCloud(positions, count);
    }
    
    return positions;
  }

  private static generateCloud(pos: Float32Array, count: number) {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
  }

  private static generateJellyfish(pos: Float32Array, count: number) {
    // Generate a fluid, ethereal jellyfish silhouette
    const bellCount = Math.floor(count * 0.45);
    const tentacleCount = count - bellCount;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (i < bellCount) {
        // BELL: A translucent-looking dome
        const u = Math.random();
        const v = Math.random();
        const phi = Math.PI * 2 * u;
        const theta = Math.acos(1 - v) * 0.7; // Half-dome
        const r = 1.8 * Math.pow(Math.random(), 0.3);
        
        pos[i3] = r * Math.sin(theta) * Math.cos(phi);
        pos[i3 + 1] = r * Math.cos(theta) + 1.5;
        pos[i3 + 2] = r * Math.sin(theta) * Math.sin(phi) * 0.8;
      } else {
        // TENTACLES: Sinuous strands
        const tIndex = (i - bellCount) % 15; // 15 main strands
        const tPos = (i - bellCount) / tentacleCount; // progression along strand
        
        const angle = (tIndex / 15) * Math.PI * 2;
        const radius = 1.2 + Math.random() * 0.4;
        
        // Helix-like sinuous path
        const wavyX = Math.cos(angle) * radius + Math.sin(tPos * 10 + angle) * 0.2;
        const wavyZ = Math.sin(angle) * radius + Math.cos(tPos * 10 + angle) * 0.2;
        
        pos[i3] = wavyX;
        pos[i3 + 1] = 1.8 - (tPos * 5.5); // long trailing
        pos[i3 + 2] = wavyZ;
        
        // Add some random "trailing dust"
        if (Math.random() > 0.8) {
            pos[i3] += (Math.random() - 0.5) * 0.5;
            pos[i3 + 1] -= Math.random() * 0.5;
            pos[i3 + 2] += (Math.random() - 0.5) * 0.5;
        }
      }
    }
  }

  private static generateGalaxy(pos: Float32Array, count: number) {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      if (Math.random() > 0.4) {
        const r = Math.pow(Math.random(), 0.5) * 4.5;
        const angle = r * 2.5 + (Math.random() - 0.5) * 0.6;
        const arm = (Math.floor(Math.random() * 2) * Math.PI);
        pos[i3] = Math.cos(angle + arm) * r;
        pos[i3 + 1] = Math.sin(angle + arm) * r;
        pos[i3 + 2] = (Math.random() - 0.5) * 0.25;
      } else {
        const r = Math.random() * 1.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i3 + 2] = r * Math.cos(phi) * 0.5;
      }
    }
  }

  private static generateSaturn(pos: Float32Array, count: number) {
    const planetCount = Math.floor(count * 0.4);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      if (i < planetCount) {
        const r = 1.2 * Math.pow(Math.random(), 0.3);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i3 + 2] = r * Math.cos(phi);
      } else {
        const r = 2.2 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        pos[i3] = r * Math.cos(theta);
        pos[i3 + 1] = (Math.random() - 0.5) * 0.05 + Math.sin(theta) * 0.2; 
        pos[i3 + 2] = r * Math.sin(theta);
      }
    }
  }

  private static generatePhallus(pos: Float32Array, count: number) {
    const shaftRadius = 0.6;
    const shaftHeight = 3.5;
    const glansRadius = 0.75;
    const testicleRadius = 0.9;
    const testicleOffset = 0.8;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const rand = Math.random();
      
      if (rand < 0.25) {
        const side = Math.random() > 0.5 ? 1 : -1;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = testicleRadius * Math.pow(Math.random(), 0.3);
        pos[i3] = r * Math.sin(theta) * Math.cos(phi) + (side * testicleOffset);
        pos[i3 + 1] = r * Math.sin(theta) * Math.sin(phi) - 1.5;
        pos[i3 + 2] = r * Math.cos(theta);
      } else if (rand < 0.75) {
        const h = Math.random() * shaftHeight;
        const phi = Math.random() * Math.PI * 2;
        const r = shaftRadius * Math.pow(Math.random(), 0.5);
        pos[i3] = r * Math.cos(phi);
        pos[i3 + 1] = h - 1.5;
        pos[i3 + 2] = r * Math.sin(phi);
      } else {
        const u = Math.random();
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.acos(1 - u) * 0.8;
        const r = glansRadius * Math.pow(Math.random(), 0.4);
        pos[i3] = r * Math.sin(theta) * Math.cos(phi);
        pos[i3 + 1] = shaftHeight - 1.5 + (r * Math.cos(theta) * 0.5);
        pos[i3 + 2] = r * Math.sin(theta) * Math.sin(phi);
        if (Math.random() > 0.9) {
          pos[i3] = (Math.random() - 0.5) * 0.05;
          pos[i3 + 1] = shaftHeight - 1.5 + glansRadius + 0.1;
          pos[i3 + 2] = (Math.random() - 0.5) * 0.15;
        }
      }
    }
  }

  private static generateAnatomy(pos: Float32Array, count: number) {
    const baseRadius = 1.75;
    const protrusion = 1.6;
    const spacing = 1.9;
    const gravityFactor = 0.38;
    const halfCount = Math.floor(count / 2);
    const nippleConcentration = 0.75;
    const shellHalfCount = Math.floor(halfCount * (1 - nippleConcentration));

    for (let i = 0; i < halfCount; i++) {
      const i3_left = i * 3;
      const i3_right = (i + halfCount) * 3;
      let rx, ry, rz;

      if (i < shellHalfCount) {
        const phi = Math.random() * Math.PI * 2;
        const u = Math.random();
        const currentRadius = baseRadius * Math.sqrt(u);
        rz = protrusion * Math.cos(u * (Math.PI / 2));
        rx = currentRadius * Math.cos(phi);
        ry = currentRadius * Math.sin(phi);
        const weight = (rz / protrusion);
        ry -= weight * gravityFactor;
      } else {
        const phi = Math.random() * Math.PI * 2;
        const isNippleCore = Math.random() > 0.65;
        if (isNippleCore) {
          const r = Math.random() * 0.14;
          rx = r * Math.cos(phi);
          ry = r * Math.sin(phi);
          rz = protrusion + (Math.random() * 0.2);
          ry -= gravityFactor;
        } else {
          const r = Math.random() * 0.48;
          rx = r * Math.cos(phi);
          ry = r * Math.sin(phi);
          rz = protrusion * Math.cos((r/baseRadius) * (Math.PI / 2)) + (Math.random() - 0.5) * 0.08;
          ry -= (rz/protrusion) * gravityFactor;
        }
      }
      pos[i3_left] = rx - spacing;
      pos[i3_left + 1] = ry;
      pos[i3_left + 2] = rz;
      pos[i3_right] = -rx + spacing;
      pos[i3_right + 1] = ry;
      pos[i3_right + 2] = rz;
    }
  }

  private static generateInfinity(pos: Float32Array, count: number) {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = Math.random() * Math.PI * 2;
      const scale = 3.0;
      const x = (scale * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
      const y = (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = (Math.random() - 0.5) * 0.5;
    }
  }

  private static generateText(pos: Float32Array, count: number, text: string) {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    this.canvas.width = 1024;
    this.canvas.height = 256;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 512, 128);
    const data = ctx.getImageData(0, 0, 1024, 256).data;
    const points: {x: number, y: number}[] = [];
    for (let y = 0; y < 256; y += 2) {
      for (let x = 0; x < 1024; x += 2) {
        if (data[(y * 1024 + x) * 4] > 180) {
          points.push({ x: (x - 512) / 70, y: -(y - 128) / 70 });
        }
      }
    }
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const p = points[Math.floor(Math.random() * points.length)] || { x: 0, y: 0 };
      pos[i3] = p.x + (Math.random() - 0.5) * 0.08;
      pos[i3 + 1] = p.y + (Math.random() - 0.5) * 0.08;
      pos[i3 + 2] = (Math.random() - 0.5) * 0.15;
    }
  }
}
