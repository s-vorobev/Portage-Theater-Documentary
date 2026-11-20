// Shared animation & motion configuration. Import these instead of hardcoding
// values, so timing/easing/ranges stay consistent and reusable across the app.

// Easing curves. Each maps t (0 -> 1) to eased progress.
export const EASINGS = {
  // Exponential ease-out: fast start, long smooth "logarithmic" tail.
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  // Gentler cubic ease-out (decelerating, moderate start).
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  // Smooth ease-in-out: slow start, slow end — the softest glide.
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
}

// Lenis smooth-scroll settings.
export const LENIS_OPTIONS = {
  wheelMultiplier: 2,
}

// Scroll snapping: after the user stops providing input, glide to the nearest
// full page with a timed, eased move.
export const SNAP = {
  inputIdleMs: 120,
  duration: 1.2,
  easing: EASINGS.easeInOutCubic,
}

// The home-page cinematic transition. `input` is scroll progress and `output`
// is the value to map to — passed directly to Motion's useTransform.
export const HOME_TRANSITION = {
  exteriorScale: { input: [0, 1], output: [1, 1.18] },
  exteriorBlur: { input: [0, 1], output: ['blur(0px)', 'blur(12px)'] },
  exteriorDim: { input: [0, 1], output: [0, 0.55] },
  infoOpacity: { input: [0.3, 0.75], output: [0, 1] },
  infoScale: { input: [0, 1], output: [1.08, 1] },
  textReveal: { input: [0.5, 0.9], output: [0, 1] },
}

// Content entrance rise distances (px), driven by the textReveal progress.
export const RISE = {
  infoText: 48,
  footer: 40,
}
