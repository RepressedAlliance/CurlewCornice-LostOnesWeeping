// loader probe: proves ?page=seg_<id> loading works; draws a paper-white frame and publishes an empty audit
export default async function probe({ g, W, H }) {
  window.renderAt = async () => { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#f7f5ef'; g.fillRect(0, 0, W, H); };
  window.__audit = { id: 'seg_probe', beat: { events: 0, off: 0, offEvents: [] }, holds: [], holdProblems: [], layout: { boxes: [], overlaps: [], outOfFrame: [] }, drawings: [], events: [] };
  await window.renderAt(0);
}
