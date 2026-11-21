export const meta = {
  name: 'lost-one-produce-segments',
  description: 'Produce full-film segments quality-first: two designs as music samples, blind judging, full build, checks, independent review, fixes',
  phases: [
    { title: 'Samples', detail: 'two truly different designs per segment, rendered with music' },
    { title: 'Judge', detail: 'blind: worth watching? which design?' },
    { title: 'Build', detail: 'full quality build of the chosen design, all checks' },
    { title: 'Review', detail: 'independent review, fix, re-review once' },
  ],
}
// args: { segments: [{ id: '00', name: '开头音型' }, ...], label: '00-03' }
const ROOT = (globalThis.process && globalThis.process.env && globalThis.process.env.LOSTONE_ROOT) || 'C:/path/to/CurlewCornice-LostOnesWeeping'   // absolute path of your clone
const SEGS = (args && args.segments) || []
const CTX = `工程 ${ROOT}（MV《ロストワンの号哭》，鏡音リン，3:32）。必读：${ROOT}/docs/制作约定.md（全部规则；第十节：首要关卡是好看、抓人，不是没错）、${ROOT}/docs/全片分镜.md（尤其末尾“审查后改定”，以它为准）、${ROOT}/docs/经验与检查清单.md、${ROOT}/docs/设定包.md（所有出图以 art/canon/ 的设定为第一参考）、${ROOT}/docs/分镜/节拍核对.md、${ROOT}/docs/分镜/帧表_定稿.md、${ROOT}/docs/demo说明.md（两段已确认 demo 第 15 版是及格线，联络表 work/a2v4/v15_sheets/*.png、work/c1a/v15_sheets/*.png）。
工程做法：
- 页面：每段一个文件 web/scenes/segments/seg_<段号>.js，默认导出 async function(H)，H 里有 { g, W, H, P, q, rng, img, rinPalImage, pencilFill, erasedMark, inkjetText }；通过 web/scenes/sheet.html?page=seg_<段号> 加载。必须用共用库 web/lib/（score.js 拍点和事件、HOLD AUDIT；lyrics.js 歌词按句序号或时间窗取；type.js 排版和出框检查；camera.js；hand.js；palette.js 唯一色值；print.js 16 点阵和铅笔字），并 publishAudit 设置 window.__audit。参考 web/scenes/a2v4_page.js、c1a_page.js 的写法。只改自己段的文件，不改共用库（真的需要就写进报告）。
- 人物图：Codex 生成，提示词在 art/design/prompts/（rules.py 的 variant/full；新建 _make_seg<段号>.py），python tools/make_jobs.py seg<段号>_<轮> "<name>:<ref1>+<ref2>"，pwsh -NoProfile -File tools/gen_batch.ps1 -JobsFile art/design/jobs/seg<段号>_<轮>.json -Throttle 2。同机位换张出自同一母版（母版作第一参考，“原样重画只改一处”）；中间张从前后两张关键张一起画。要透明背景就让 Codex 直接出。每张生成后自己用 Read 看，不好看、跑偏人设、有 AI 味就重出。入片的复制到 art/cut/。
- 渲染：同一时间全机只开一个渲染 Chrome。整段或长片段渲染前先检查 ${ROOT}/work/render.lock，存在就等它消失；自己渲染时创建它（写入段号），渲完删除。单帧用 node web/preview.mjs "page=seg_<段号>" <秒> ...；片段用 node web/render_film.mjs web/scenes/sheet.html "page=seg_<段号>" <out_dir> <f0> <f1>；带音乐的视频用 python tools/mux_demo.py <帧目录> <t0> <out.mp4> --phone（帧文件名若是 g_ 开头，先按顺序改名或软链成 f_00000.png 起）。
- 检查：python tools/red_scan.py、tools/static_scan.py、tools/reuse_audit.py、tools/qc_sheets.py（用法见各文件头）；控制台的 BEAT AUDIT、HOLD AUDIT、FRAME AUDIT 必须干净或有站得住的理由。
用中文写报告。`

const S_JUDGE = { type: 'object', required: ['worth_watching_a', 'worth_watching_b', 'pick', 'why', 'must_fix'], properties: {
  worth_watching_a: { type: 'string' }, worth_watching_b: { type: 'string' }, pick: { type: 'string', enum: ['a', 'b', 'neither'] }, why: { type: 'string' }, must_fix: { type: 'array', items: { type: 'string' } } } }
const S_REVIEW = { type: 'object', required: ['passes', 'must', 'nice'], properties: { passes: { type: 'boolean' }, must: { type: 'array', items: { type: 'string' } }, nice: { type: 'array', items: { type: 'string' } } } }

const results = await pipeline(SEGS,
  seg => { phase('Samples'); return agent(`${CTX}\n任务：段 ${seg.id}「${seg.name}」，先做小样。读 ${ROOT}/docs/分镜/ 下以 ${seg.id}_ 开头的文件。按其中“关键画面的两种真正不同的设计”，各做一个带正式音乐的小样（可以只做这一段的关键 4–8 小节，但必须有动起来的人物和镜头，不是静帧）：页面用 query 参数 variant=a / variant=b 切换。需要的关键人物图按设定包用 Codex 出（小样也要用正式质量的图，不用占位）。两个小样各渲出带音乐视频（work/seg/${seg.id}/sample_a.mp4、sample_b.mp4），再各出一组按事件的检查图（tools/qc_sheets.py）和 0.5 秒一格的联络表（tools/review_sheets.py）。返回：两个设计各自的看点、文件路径、你自己觉得哪个更好看以及为什么。`, { label: `${seg.id} 小样`, phase: 'Samples', effort: 'high' }) },
  (sample, seg) => { phase('Judge'); return parallel([['静音观众', '你在手机上刷到这一段，不懂日语、静音。'], ['美术指导', '你是获奖级 MV 的美术指导。']].map(([who, lens]) => () => agent(`${CTX}\n${lens}你没参与制作，也没看过任何旧版。段 ${seg.id}「${seg.name}」有两个设计小样：看 ${ROOT}/work/seg/${seg.id}/ 下 sample_a、sample_b 的联络表和检查图（用 Read 看图；也可以用 ffmpeg 从 mp4 自己抽帧看），对照全片分镜里这一段的看点。先判断每个设计“值不值得看”：静音的人会不会停下、看不看得懂、想不想继续看；和两段 demo 第 15 版放在一起掉不掉档。再选一个（都不值得看就选 neither）。只读，不改文件。制作方的说明（只作参考，不要被带偏）：${sample}`, { label: `${seg.id} 盲看：${who}`, phase: 'Judge', schema: S_JUDGE, effort: 'high' }))).then(j => ({ sample, judges: j.filter(Boolean) })) },
  (judged, seg) => { phase('Build'); return agent(`${CTX}\n任务：段 ${seg.id}「${seg.name}」细做成片。两位独立评审对小样的结论：${JSON.stringify(judged.judges)}\n- 两位都选 neither，或者都说不值得看：先停下想清楚为什么不好看，重新设计这一段（可以偏离分镜文件，但要守全片分镜的主线和审查后改定），再做。\n- 否则按选中的设计做完整段（帧区间按帧表定稿），吸收评审的 must_fix。\n做完整段：所有人物图出齐（每张自己看过）、页面写完、整段渲染（遵守 render.lock）、带音乐成片 work/seg/${seg.id}/seg_${seg.id}.mp4（另出 _phone）、全部自动检查跑过并处理（红色、停滞、复用、BEAT/HOLD/FRAME AUDIT），每个切点和换张用 qc_sheets 逐帧看过，停留超过 1 秒的画面按静帧看过。和两段 demo 第 15 版的联络表并排比，不低于它们。更新 web/segments.json 里这一段的登记（id seg_${seg.id}、page、f0、f1、status: self-checked）。返回：做了什么、检查结果数字、你知道的不足。`, { label: `${seg.id} 细做`, phase: 'Build', effort: 'high' }) },
  async (built, seg) => {
    phase('Review')
    let review = await agent(`${CTX}\n你是没参与制作的独立评审，没看过任何旧版。段 ${seg.id}「${seg.name}」的成片在 ${ROOT}/work/seg/${seg.id}/（用 ffmpeg 自己抽帧，每 0.25 秒一张，再看 qc_sheets 检查图）。先判“值不值得看”（静音、手机、和 demo 第 15 版比），再查制作约定、经验与检查清单、全片分镜审查后改定。passes 只在没有 MUST 时为 true。只读，不改文件。`, { label: `${seg.id} 独立审`, phase: 'Review', schema: S_REVIEW, effort: 'high' })
    let fix = null
    if (review && !review.passes) {
      fix = await agent(`${CTX}\n任务：根据独立评审意见修改段 ${seg.id}「${seg.name}」并重渲成片。评审意见：${JSON.stringify(review)}\nMUST 必须解决；看点不成立就换设计，不打补丁。改完重跑全部检查。返回改了什么。`, { label: `${seg.id} 修改`, phase: 'Review', effort: 'high' })
      review = await agent(`${CTX}\n你是没参与制作的独立评审。段 ${seg.id}「${seg.name}」修改后的成片在 ${ROOT}/work/seg/${seg.id}/。修改方报告：${fix}\n重新判断（值不值得看优先，再查规则）。passes 只在没有 MUST 时为 true。只读。`, { label: `${seg.id} 复审`, phase: 'Review', schema: S_REVIEW, effort: 'high' })
    }
    return { seg: seg.id, built, review, fix }
  })
return results
