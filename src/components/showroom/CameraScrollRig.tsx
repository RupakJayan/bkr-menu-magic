import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

// Keyframe stops for the scroll journey (progress 0.0 to 1.0)
const SCROLL_CAMERA_STOPS = [
  { progress: 0.0, pos: new THREE.Vector3(0, 0.5, 5.2), target: new THREE.Vector3(0, 0.3, 0) },
  { progress: 0.33, pos: new THREE.Vector3(3.6, 1.8, 3.6), target: new THREE.Vector3(0, 0.4, 0) },
  { progress: 0.66, pos: new THREE.Vector3(-3.0, 0.1, 2.5), target: new THREE.Vector3(-0.3, 0.3, 0) },
  { progress: 1.0, pos: new THREE.Vector3(0, 4.2, 2.6), target: new THREE.Vector3(0, 0.1, 0) },
];

const HOTSPOT_TARGETS: Record<string, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  "tawa-core": {
    pos: new THREE.Vector3(0, 1.1, 2.3),
    target: new THREE.Vector3(0, 0.45, 0.7),
  },
  "canopy-optics": {
    pos: new THREE.Vector3(1.8, 1.8, 1.4),
    target: new THREE.Vector3(0.95, 1.25, -0.4),
  },
  "brass-chassis": {
    pos: new THREE.Vector3(-2.2, 0.3, 1.8),
    target: new THREE.Vector3(-0.95, 0.1, 0.5),
  },
  "queue-telemetry": {
    pos: new THREE.Vector3(0, 2.4, 2.5),
    target: new THREE.Vector3(0, 1.45, 0),
  },
};

interface CameraScrollRigProps {
  scrollProgress: number;
  activeHotspot: string | null;
}

export const CameraScrollRig: React.FC<CameraScrollRigProps> = ({ scrollProgress, activeHotspot }) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0.3, 0));

  useFrame((_, delta) => {
    let desiredPos: THREE.Vector3;
    let desiredTarget: THREE.Vector3;

    // Hotspot click inspection overrides scroll path
    if (activeHotspot && HOTSPOT_TARGETS[activeHotspot]) {
      desiredPos = HOTSPOT_TARGETS[activeHotspot].pos;
      desiredTarget = HOTSPOT_TARGETS[activeHotspot].target;
    } else {
      // Interpolate along the 4 scroll stops
      const clampedP = Math.max(0, Math.min(1, scrollProgress));
      let idx = 0;
      for (let i = 0; i < SCROLL_CAMERA_STOPS.length - 1; i++) {
        if (clampedP >= SCROLL_CAMERA_STOPS[i].progress && clampedP <= SCROLL_CAMERA_STOPS[i + 1].progress) {
          idx = i;
          break;
        }
      }

      const segStart = SCROLL_CAMERA_STOPS[idx];
      const segEnd = SCROLL_CAMERA_STOPS[idx + 1];
      const t = (clampedP - segStart.progress) / (segEnd.progress - segStart.progress || 1);
      
      // S-curve cosine ease for Apple product page feel
      const easeT = 0.5 - 0.5 * Math.cos(Math.PI * t);

      desiredPos = new THREE.Vector3().lerpVectors(segStart.pos, segEnd.pos, easeT);
      desiredTarget = new THREE.Vector3().lerpVectors(segStart.target, segEnd.target, easeT);
    }

    // High dampening lerp factor tied to delta time (60-120fps smooth)
    const lerpSpeed = Math.min(delta * 4.5, 0.15);
    camera.position.lerp(desiredPos, lerpSpeed);
    currentTarget.current.lerp(desiredTarget, lerpSpeed);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
