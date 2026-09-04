export type Vec2 = [number, number];

export type ShapePoint = { p: Vec2; hi: Vec2; ho: Vec2 };

const O: Vec2 = [0, 0];

const S = 5 / 7;

export const LCX = 15.6;
export const RCX = 24.7;
export const ECY = 18.4;
export const MCX = 20.15;
export const MCY = 24.2;

export function buildPath(shape: ShapePoint[], cx: number, cy: number): string {
  const f = (v: number) => +v.toFixed(3);
  const n = shape.length;
  let d = `M${f(cx + shape[0].p[0])} ${f(cy + shape[0].p[1])}`;
  for (let i = 0; i < n; i++) {
    const c = shape[i];
    const nx = shape[(i + 1) % n];
    d += ` C${f(cx + c.p[0] + c.ho[0])} ${f(cy + c.p[1] + c.ho[1])} ${f(cx + nx.p[0] + nx.hi[0])} ${f(cy + nx.p[1] + nx.hi[1])} ${f(cx + nx.p[0])} ${f(cy + nx.p[1])}`;
  }
  return d + 'Z';
}

export function makeCircle(r: number): ShapePoint[] {
  const k = r * (4 / 3) * Math.tan(Math.PI / 16);
  const a = r * Math.SQRT1_2;
  const ak = k * Math.SQRT1_2;
  return [
    { p: [r, 0], hi: [0, -k], ho: [0, k] },
    { p: [a, a], hi: [ak, -ak], ho: [-ak, ak] },
    { p: [0, r], hi: [k, 0], ho: [-k, 0] },
    { p: [-a, a], hi: [ak, ak], ho: [-ak, -ak] },
    { p: [-r, 0], hi: [0, k], ho: [0, -k] },
    { p: [-a, -a], hi: [-ak, ak], ho: [ak, -ak] },
    { p: [0, -r], hi: [-k, 0], ho: [k, 0] },
    { p: [a, -a], hi: [-ak, -ak], ho: [ak, ak] },
  ];
}

/**
 * A rectangle with its corners fully rounded — a stadium. Written as the same
 * eight points makeRect and makeCircle produce, so an eye can morph to any
 * other eye without the path interpolation falling apart on a command-count
 * mismatch. That matters for the blinks too, which interpolate against
 * whichever eye is currently showing.
 *
 * A 40px radius on shapes a couple of units across is past any corner they
 * have, so it clamps to half the short side: the caps become true semicircles
 * and the straight sides run between them. Four of the eight segments are the
 * caps, drawn as quarter arcs with the standard kappa handles; the other four
 * are straight and carry no handles at all.
 */
export function makeStadium(w: number, h: number): ShapePoint[] {
  const hw = w / 2;
  const hh = h / 2;
  const r = Math.min(hw, hh);
  const k = r * (4 / 3) * Math.tan(Math.PI / 8);

  if (hw >= hh) {
    // Wide: the caps are the left and right ends.
    return [
      { p: [hw, 0], hi: [0, -k], ho: [0, k] },
      { p: [hw - r, hh], hi: [k, 0], ho: O },
      { p: [0, hh], hi: O, ho: O },
      { p: [-hw + r, hh], hi: O, ho: [-k, 0] },
      { p: [-hw, 0], hi: [0, k], ho: [0, -k] },
      { p: [-hw + r, -hh], hi: [-k, 0], ho: O },
      { p: [0, -hh], hi: O, ho: O },
      { p: [hw - r, -hh], hi: O, ho: [k, 0] },
    ];
  }
  // Tall: the caps are the top and bottom.
  return [
    { p: [hw, 0], hi: O, ho: O },
    { p: [hw, hh - r], hi: O, ho: [0, k] },
    { p: [0, hh], hi: [k, 0], ho: [-k, 0] },
    { p: [-hw, hh - r], hi: [0, k], ho: O },
    { p: [-hw, 0], hi: O, ho: O },
    { p: [-hw, -hh + r], hi: O, ho: [0, -k] },
    { p: [0, -hh], hi: [-k, 0], ho: [k, 0] },
    { p: [hw, -hh + r], hi: [0, -k], ho: O },
  ];
}

export function makeRect(w: number, h: number): ShapePoint[] {
  const hw = w / 2, hh = h / 2;
  return [
    { p: [hw, 0], hi: O, ho: O },
    { p: [hw, hh], hi: O, ho: O },
    { p: [0, hh], hi: O, ho: O },
    { p: [-hw, hh], hi: O, ho: O },
    { p: [-hw, 0], hi: O, ho: O },
    { p: [-hw, -hh], hi: O, ho: O },
    { p: [0, -hh], hi: O, ho: O },
    { p: [hw, -hh], hi: O, ho: O },
  ];
}

export function rotShape(shape: ShapePoint[], angle: number): ShapePoint[] {
  const cs = Math.cos(angle), sn = Math.sin(angle);
  const r = (v: Vec2): Vec2 => [v[0] * cs - v[1] * sn, v[0] * sn + v[1] * cs];
  return shape.map(({ p, hi, ho }) => ({ p: r(p), hi: r(hi), ho: r(ho) }));
}

function shiftShape(shape: ShapePoint[], dx: number, dy: number): ShapePoint[] {
  return shape.map(({ p, hi, ho }) => ({
    p: [p[0] + dx, p[1] + dy] as Vec2,
    hi,
    ho,
  }));
}

function scaleShape(shape: ShapePoint[], s: number): ShapePoint[] {
  return shape.map(({ p, hi, ho }) => ({
    p: [p[0] * s, p[1] * s] as Vec2,
    hi: [hi[0] * s, hi[1] * s] as Vec2,
    ho: [ho[0] * s, ho[1] * s] as Vec2,
  }));
}

// Eye shapes (scaled for 40×40)
export const eyeCircle = makeCircle(1.6 * S);
export const eyeHBar = makeStadium(5 * S, 1.5 * S);
export const eyeVBar = makeStadium(1.5 * S, 5 * S);
export const eyeDiagLeft = rotShape(makeStadium(4.5 * S, 1.5 * S), Math.PI / 4);
export const eyeDiagRight = rotShape(makeStadium(4.5 * S, 1.5 * S), -Math.PI / 4);

export const eyeCurved: ShapePoint[] = scaleShape([
  { p: [2.0, 0.3], hi: [0, -0.6], ho: [0, 0.6] },
  { p: [1.3, 1.2], hi: [0.5, -0.15], ho: [-0.5, 0.15] },
  { p: [0, 1.5], hi: [0.7, 0], ho: [-0.7, 0] },
  { p: [-1.3, 1.2], hi: [0.5, 0.15], ho: [-0.5, -0.15] },
  { p: [-2.0, 0.3], hi: [0, 0.6], ho: [0, -0.6] },
  { p: [-1.3, -0.3], hi: [-0.4, 0], ho: [0.4, 0] },
  { p: [0, 0], hi: [-0.7, 0], ho: [0.7, 0] },
  { p: [1.3, -0.3], hi: [-0.4, 0], ho: [0.4, 0] },
], S);

export const eyeChevronRight: ShapePoint[] = scaleShape([
  { p: [2.0, 0], hi: O, ho: O },
  { p: [0.3, 0.9], hi: O, ho: O },
  { p: [-1.5, 2.0], hi: O, ho: O },
  { p: [-1.5, 0.8], hi: O, ho: O },
  { p: [0, 0], hi: O, ho: O },
  { p: [-1.5, -0.8], hi: O, ho: O },
  { p: [-1.5, -2.0], hi: O, ho: O },
  { p: [0.3, -0.9], hi: O, ho: O },
], S);

export const eyeChevronLeft: ShapePoint[] = scaleShape([
  { p: [1.5, 0.8], hi: O, ho: O },
  { p: [1.5, 2.0], hi: O, ho: O },
  { p: [-0.3, 0.9], hi: O, ho: O },
  { p: [-2.0, 0], hi: O, ho: O },
  { p: [-0.3, -0.9], hi: O, ho: O },
  { p: [1.5, -2.0], hi: O, ho: O },
  { p: [1.5, -0.8], hi: O, ho: O },
  { p: [0, 0], hi: O, ho: O },
], S);

// Mouth shapes (scaled)
export const mouthNeutral = makeRect(2.5 * S, 1.0 * S);
export const mouthAnnoyed = makeRect(3.5 * S, 0.5 * S);
export const mouthSurprised = makeCircle(1.2 * S);
export const mouthSkeptical = rotShape(makeRect(2.5 * S, 0.6 * S), Math.PI / 8);

export const mouthSmile: ShapePoint[] = scaleShape([
  { p: [1.8, -0.1], hi: [0, -0.3], ho: [0, 0.3] },
  { p: [1.2, 0.7], hi: [0.4, -0.1], ho: [-0.4, 0.1] },
  { p: [0, 1.1], hi: [0.6, 0], ho: [-0.6, 0] },
  { p: [-1.2, 0.7], hi: [0.4, 0.1], ho: [-0.4, -0.1] },
  { p: [-1.8, -0.1], hi: [0, 0.3], ho: [0, -0.3] },
  { p: [-1.2, -0.4], hi: [-0.3, 0], ho: [0.3, 0] },
  { p: [0, -0.2], hi: [-0.6, 0], ho: [0.6, 0] },
  { p: [1.2, -0.4], hi: [-0.3, 0], ho: [0.3, 0] },
], S);

export const mouthFrown: ShapePoint[] = scaleShape([
  { p: [1.8, 0.1], hi: [0, 0.3], ho: [0, -0.3] },
  { p: [1.2, -0.7], hi: [0.4, 0.1], ho: [-0.4, -0.1] },
  { p: [0, -1.1], hi: [0.6, 0], ho: [-0.6, 0] },
  { p: [-1.2, -0.7], hi: [0.4, -0.1], ho: [-0.4, 0.1] },
  { p: [-1.8, 0.1], hi: [0, -0.3], ho: [0, 0.3] },
  { p: [-1.2, 0.4], hi: [-0.3, 0], ho: [0.3, 0] },
  { p: [0, 0.2], hi: [-0.6, 0], ho: [0.6, 0] },
  { p: [1.2, 0.4], hi: [-0.3, 0], ho: [0.3, 0] },
], S);

// Expressions
export interface Expression {
  key: string;
  label: string;
  left: ShapePoint[];
  right: ShapePoint[];
  mouth: ShapePoint[];
}

export const EXPRESSIONS: Expression[] = [
  { key: 'circles', label: 'Circles', left: eyeCircle, right: eyeCircle, mouth: mouthNeutral },
  // { key: 'horizontal', label: 'Horizontal', left: eyeHBar, right: eyeHBar, mouth: mouthAnnoyed },
  { key: 'vertical', label: 'Vertical', left: eyeVBar, right: eyeVBar, mouth: mouthSurprised },
  { key: 'diagonal', label: 'Diagonal', left: eyeDiagLeft, right: eyeDiagRight, mouth: mouthSkeptical },
  { key: 'curved', label: 'Curved', left: eyeCurved, right: eyeCurved, mouth: mouthSmile },
  { key: 'chevron', label: 'Chevron', left: eyeChevronRight, right: eyeChevronLeft, mouth: mouthFrown },
];

export const PATHS = EXPRESSIONS.map((expr) => ({
  left: buildPath(expr.left, LCX, ECY),
  right: buildPath(expr.right, RCX, ECY),
  mouth: buildPath(expr.mouth, MCX, MCY),
}));

// Idle animations
export interface IdleAnimation {
  left: string[];
  right: string[];
  duration: number;
  times: number[];
}

const blinkClosed = makeStadium(3 * S, 0.3 * S);
const hBarNarrow = makeStadium(4 * S, 1.5 * S);
const vBarTall = makeStadium(1.5 * S, 6 * S);
const diagLeftRockA = rotShape(makeStadium(4.5 * S, 1.5 * S), Math.PI / 4 + 0.12);
const diagLeftRockB = rotShape(makeStadium(4.5 * S, 1.5 * S), Math.PI / 4 - 0.12);
const diagRightRockA = rotShape(makeStadium(4.5 * S, 1.5 * S), -Math.PI / 4 + 0.12);
const diagRightRockB = rotShape(makeStadium(4.5 * S, 1.5 * S), -Math.PI / 4 - 0.12);
const curvedUp = shiftShape(eyeCurved, 0, -0.5 * S);
const chevronRightJitterA = shiftShape(eyeChevronRight, 0.3 * S, 0);
const chevronRightJitterB = shiftShape(eyeChevronRight, -0.3 * S, 0);
const chevronLeftJitterA = shiftShape(eyeChevronLeft, 0.3 * S, 0);
const chevronLeftJitterB = shiftShape(eyeChevronLeft, -0.3 * S, 0);

const ep = (shape: ShapePoint[], cx: number) => buildPath(shape, cx, ECY);

// Every expression gets a blink, not just the round-eyed one. Each animation
// keeps its own movement at its own speed — the original keyframes are scaled
// into the front of a longer loop, so they play at the same rate — then the
// eyes rest, then blink. That gives one blink roughly every LOOP_S seconds
// regardless of how long the expression's own motion takes.
const LOOP_S = 4;
// A blink is two fast movements. The closing half used to be interpolated from
// wherever the expression's own motion ended all the way to the shut frame —
// 480ms on the longest expression and 1.6s on the shortest — so the eyes sank
// closed and then snapped open. Holding the rest pose until just before the
// shut gives the close its own short interval, in real time rather than as a
// leftover fraction of the loop.
const BLINK_AT = 0.9;
const BLINK_CLOSE_S = 0.07;
const BLINK_REOPEN_S = 0.1;

const withBlink = (a: IdleAnimation): IdleAnimation => {
  const motionEnd = Math.min(0.78, a.duration / LOOP_S);
  const restL = a.left[a.left.length - 1];
  const restR = a.right[a.right.length - 1];
  return {
    left: [...a.left, restL, ep(blinkClosed, LCX), restL, restL],
    right: [...a.right, restR, ep(blinkClosed, RCX), restR, restR],
    times: [
      ...a.times.map((t) => t * motionEnd),
      BLINK_AT - BLINK_CLOSE_S / LOOP_S,
      BLINK_AT,
      BLINK_AT + BLINK_REOPEN_S / LOOP_S,
      1,
    ],
    duration: LOOP_S,
  };
};

const BASE_IDLE_ANIMATIONS: IdleAnimation[] = [
  {
    left: [ep(eyeCircle, LCX), ep(eyeCircle, LCX), ep(blinkClosed, LCX), ep(eyeCircle, LCX), ep(eyeCircle, LCX)],
    right: [ep(eyeCircle, RCX), ep(eyeCircle, RCX), ep(blinkClosed, RCX), ep(eyeCircle, RCX), ep(eyeCircle, RCX)],
    duration: 3,
    times: [0, 0.4, 0.45, 0.5, 1],
  },
  // {
  //   left: [ep(eyeHBar, LCX), ep(hBarNarrow, LCX), ep(eyeHBar, LCX)],
  //   right: [ep(eyeHBar, RCX), ep(hBarNarrow, RCX), ep(eyeHBar, RCX)],
  //   duration: 2,
  //   times: [0, 0.5, 1],
  // },
  {
    left: [ep(eyeVBar, LCX), ep(vBarTall, LCX), ep(eyeVBar, LCX)],
    right: [ep(eyeVBar, RCX), ep(vBarTall, RCX), ep(eyeVBar, RCX)],
    duration: 1.5,
    times: [0, 0.5, 1],
  },
  {
    left: [ep(eyeDiagLeft, LCX), ep(diagLeftRockA, LCX), ep(eyeDiagLeft, LCX), ep(diagLeftRockB, LCX), ep(eyeDiagLeft, LCX)],
    right: [ep(eyeDiagRight, RCX), ep(diagRightRockA, RCX), ep(eyeDiagRight, RCX), ep(diagRightRockB, RCX), ep(eyeDiagRight, RCX)],
    duration: 2,
    times: [0, 0.25, 0.5, 0.75, 1],
  },
  {
    left: [ep(eyeCurved, LCX), ep(curvedUp, LCX), ep(eyeCurved, LCX)],
    right: [ep(eyeCurved, RCX), ep(curvedUp, RCX), ep(eyeCurved, RCX)],
    duration: 1.5,
    times: [0, 0.5, 1],
  },
  {
    left: [ep(eyeChevronRight, LCX), ep(eyeChevronRight, LCX), ep(chevronRightJitterA, LCX), ep(chevronRightJitterB, LCX), ep(chevronRightJitterA, LCX), ep(chevronRightJitterB, LCX), ep(eyeChevronRight, LCX), ep(eyeChevronRight, LCX)],
    right: [ep(eyeChevronLeft, RCX), ep(eyeChevronLeft, RCX), ep(chevronLeftJitterA, RCX), ep(chevronLeftJitterB, RCX), ep(chevronLeftJitterA, RCX), ep(chevronLeftJitterB, RCX), ep(eyeChevronLeft, RCX), ep(eyeChevronLeft, RCX)],
    duration: 2,
    times: [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 1],
  },
];

export const IDLE_ANIMATIONS: IdleAnimation[] = BASE_IDLE_ANIMATIONS.map(withBlink);

// Colors
export interface ColorScheme {
  key: string;
  bg: string;
  gradientFrom: string;
  gradientTo: string;
  borderFrom: string;
  borderTo: string;
  ring: string;
  eye: string;
  /** The pulse runs lighter than the eyes — same hue, L raised to ~0.88, with
   *  chroma clamped to what each hue can actually hold there (blue and purple
   *  clip above ~0.06). All five land at 11-13:1 against the panel. */
  /** The scheme's hue in OKLCH degrees. Kept as a number so effects can spread
   *  around it — the shimmer fans +/-55 either side for its chromatic split. */
  hue: number;
}

// `ring` is the selected-swatch outline: each one is its own gradientTo — the
// darker half of the swatch — converted to OKLCH and lifted by L +0.18 with
// chroma and hue held. Because only lightness moves, every ring reads as the
// same step lighter than the colour it belongs to, which a per-colour hex pick
// would not guarantee.
// Eye colour per scheme, hue-matched to the body rather than mapped in list
// order: cyan reads as the neutral partner for gray, and yellow sits nearest
// orange. Same lightness and chroma across all five, so no one eye colour
// carries more visual weight than another.
export const COLORS: ColorScheme[] = [
  { key: 'gray', bg: '#333333', gradientFrom: '#B7B6B7', gradientTo: '#515151', borderFrom: '#C1BEC1', borderTo: '#3D3C3D', ring: 'oklch(0.615 0 89.9)', eye: 'oklch(0.72 0.14 205)', hue: 205 },
  { key: 'blue', bg: '#1A2544', gradientFrom: '#7BA3E8', gradientTo: '#2E4B82', borderFrom: '#8FB5F0', borderTo: '#2A3D66', ring: 'oklch(0.599 0.098 262)', eye: 'oklch(0.72 0.15 255)', hue: 255 },
  { key: 'green', bg: '#1A3326', gradientFrom: '#6ADB8A', gradientTo: '#2B6B45', borderFrom: '#7AEB9A', borderTo: '#1F4D33', ring: 'oklch(0.655 0.09 154.7)', eye: 'oklch(0.72 0.14 155)', hue: 155 },
  { key: 'orange', bg: '#33251A', gradientFrom: '#E8B070', gradientTo: '#8B5530', borderFrom: '#F0C080', borderTo: '#6B4020', ring: 'oklch(0.683 0.088 53.7)', eye: 'oklch(0.82 0.15 95)', hue: 95 },
  { key: 'purple', bg: '#261A33', gradientFrom: '#B07AE8', gradientTo: '#5B3088', borderFrom: '#C08AF0', borderTo: '#3D2066', ring: 'oklch(0.59 0.142 303.1)', eye: 'oklch(0.72 0.15 283)', hue: 283 },
];

// Static paths (40×40 viewBox)
export const FRAME_D =
  'M12.742 4c.69 0 1.25.56 1.25 1.25V6a.5.5 0 1 0 1 0v-.75c0-.69.56-1.25 1.25-1.25h7.648c.608 0 1.102.494 1.102 1.103V6a.5.5 0 1 0 1 0v-.897c0-.61.494-1.103 1.103-1.103h4.73a4.167 4.167 0 0 1 4.167 4.167v4.375c0 .805-.653 1.458-1.458 1.458h-.542a.5.5 0 1 0 0 1h.75c.69 0 1.25.56 1.25 1.25v7.5c0 .69-.56 1.25-1.25 1.25h-.75a.5.5 0 1 0 0 1h.75c.69 0 1.25.56 1.25 1.25V31a5 5 0 0 1-5 5h-3.75c-.69 0-1.25-.56-1.25-1.25V34a.5.5 0 0 0-1 0v.75c0 .69-.56 1.25-1.25 1.25h-7.5c-.69 0-1.25-.56-1.25-1.25V34a.5.5 0 0 0-1 0v.75c0 .69-.56 1.25-1.25 1.25h-3.75a5 5 0 0 1-5-5v-3.75c0-.69.56-1.25 1.25-1.25h.75a.5.5 0 0 0 0-1h-.75c-.69 0-1.25-.56-1.25-1.25v-7.5c0-.69.56-1.25 1.25-1.25h.75a.5.5 0 0 0 0-1h-.75c-.69 0-1.25-.56-1.25-1.25V9a5 5 0 0 1 5-5Z';

export const FACE_D =
  'M22.252 8.969A4.25 4.25 0 0 0 18.054 8.969L12.212 12.29A4.25 4.25 0 0 0 10.062 15.983V22.853A4.25 4.25 0 0 0 12.182 26.529L18.024 29.911A4.25 4.25 0 0 0 22.282 29.911L28.124 26.529A4.25 4.25 0 0 0 30.244 22.852V15.983C30.244 14.455 29.424 13.045 28.094 12.29Z';
