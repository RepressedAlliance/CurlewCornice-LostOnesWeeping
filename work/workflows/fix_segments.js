export const meta = {
  name: 'lost-one-fix-segments',
  description: 'Extra fix rounds for segments that failed re-review: fix MUSTs, independent review, one more fix if needed',
  phases: [
    { title: 'Fix', detail: 'resolve every MUST; redesign the block if it is not worth watching' },
    { title: 'Review', detail: 'fresh independent review' },
  ],
}
// args: { segments: [{ id: '03', name: '片名检票口', must: ['...'], note: '...' }], label: '03' }
const ROOT = (globalThis.process && globalThis.process.env && globalThis.process.env.LOSTONE_ROOT) || 'C:/path/to/CurlewCornice-LostOnesWeeping'   // absolute path of your clone
const SEGS = (args && args.segments) || []
const CTX = `工程 ${ROOT}（MV《ロストワンの号哭》，鏡音リン，3:32）。必读：${ROOT}/docs/制作约定.md（第十节：首要关卡是好看、抓人，不是没错）、${ROOT}/docs/全片分镜.md（末尾“审查后改定”为准）、${ROOT}/docs/经验与检查清单.md、${ROOT}/docs/设定包.md、${ROOT}/docs/分镜/帧表_定稿.md、${ROOT}/docs/demo说明.md（demo 第 15 版是及格线，联络表 work/a2v4/v15_sheets/*.png、work/c1a/v15_sheets/*.png）。
工程做法同 work/workflows/produce_segments.js 里的 CTX（页面 web/scenes/segments/seg_<段号>.js、共用库 web/lib/、Codex 出图 tools/make_jobs.py + tools/gen_batch.ps1、渲染遵守 work/render.lock 同时只开一个 Chrome、检查 red_scan/static_scan/reuse_audit/qc_sheets 与 BEAT/HOLD/FRAME AUDIT）。先读那个文件的 CTX 段。只改自己段的文件。用中文写报告。`
const S_REVIEW = { type: 'object', required: ['passes', 'must', 'nice'], properties: { passes: { type: 'boolean' }, must: { type: 'array', items: { type: 'string' } }, nice: { type: 'array', items: { type: 'string' } } } }

const results = await parallel(SEGS.map(seg => async () => {
  let must = seg.must || `（全文见 ${ROOT}/work/workflows/${args.argsFile} 里段 ${seg.id} 的 must 数组和 note 字段，先用 Read 读它）`
  if (!seg.note && args.argsFile) seg = { ...seg, note: `本段的补充说明见 ${ROOT}/work/workflows/${args.argsFile} 里段 ${seg.id} 的 note 字段。` }
  let review = null
  let fixes = []
  for (let round = 1; round <= 2; round++) {
    const fix = await agent(`${CTX}\n任务：段 ${seg.id}「${seg.name}」上一轮独立复审没过，按下面的 MUST 改，改完整段重渲成片（work/seg/${seg.id}/seg_${seg.id}.mp4 和 _phone）并重跑全部检查。${seg.note || ''}\nMUST：${JSON.stringify(must)}\n要求：每条 MUST 从成因改，不是只改被点到的那一帧；看点不成立就换这一块的设计，不打补丁。改完自己逐帧看改动处（qc_sheets，手机尺寸也看）。返回：每条 MUST 怎么改的、检查数字、你知道的不足。`, { label: `${seg.id} 补修 ${round}`, phase: 'Fix', effort: 'high' })
    fixes.push(fix)
    review = await agent(`${CTX}\n你是没参与制作的独立评审，没看过任何旧版。段 ${seg.id}「${seg.name}」的成片在 ${ROOT}/work/seg/${seg.id}/（用 ffmpeg 自己每 0.25 秒抽一帧看，再看 qc 检查图；改动处逐帧看）。修改方报告（只作参考）：${fix}\n先判“值不值得看”（静音、手机、和 demo 第 15 版比），再查规则。上一轮的 MUST 是：${JSON.stringify(must)}，逐条核对是否真的解决。passes 只在没有 MUST 时为 true。只读，不改文件。`, { label: `${seg.id} 复审 ${round}`, phase: 'Review', schema: S_REVIEW, effort: 'high' })
    if (!review || review.passes) break
    must = review.must
  }
  return { seg: seg.id, review, fixes }
}))
return results
