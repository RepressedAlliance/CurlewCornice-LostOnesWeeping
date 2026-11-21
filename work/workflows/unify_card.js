export const meta = {
  name: 'lost-one-unify-card',
  description: 'Move her card face into a shared lib, apply it to every segment, fix phone-look and same-class issues, re-render, review',
  phases: [
    { title: 'Lib', detail: 'web/lib/her_card.js from seg_03, seg_03 unchanged' },
    { title: 'Apply', detail: 'each segment uses her_card.js; card never reads as a phone; same-class checks' },
    { title: 'Review', detail: 'independent check of card state and no regression' },
  ],
}
// args: { segments: [{ id, name, extra }], skipLib: false }
const ROOT = (globalThis.process && globalThis.process.env && globalThis.process.env.LOSTONE_ROOT) || 'C:/path/to/CurlewCornice-LostOnesWeeping'   // absolute path of your clone
const CTX = `工程 ${ROOT}（MV《ロストワンの号哭》）。先读 ${ROOT}/work/workflows/produce_segments.js 的 CTX 段（工程做法、出图、渲染锁、检查工具），再读 ${ROOT}/docs/卡面状态.md（全片唯一卡面状态，本次任务的依据）、${ROOT}/docs/经验与检查清单.md、${ROOT}/docs/全片分镜.md 末尾“审查后改定”。渲染遵守 work/render.lock，同一时间只开一个 Chrome。用中文写报告。`
const S_REVIEW = { type: 'object', required: ['passes', 'must', 'nice'], properties: { passes: { type: 'boolean' }, must: { type: 'array', items: { type: 'string' } }, nice: { type: 'array', items: { type: 'string' } } } }

if (!args.skipLib) {
  phase('Lib')
  await agent(`${CTX}\n任务：把她的卡面画法搬进共用库。新建 web/lib/her_card.js，内容取自 web/scenes/segments/seg_03.js 的 cardBase、drawBand、knockGrid、inkLine1（含以左上角为锚的砸下 slamAt）、line2Pos、cardFace 以及它们依赖的小函数，接口要让别的段方便调用：给定状态（00–02 的“只有字带前/字带后、格子满浓度”，03 k40 起的完整状态，可选打印头扫描进度和砸下 age）和卡宽 u，画出卡面到一个 canvas；另给一个函数返回各行墨迹框和标签框，供版面检查登记。卡背也做成函数：按卡面状态.md 第四节，黑只在书写区漫开、留纸边和卡夹孔、石墨透纸纹。然后把 seg_03.js 改成 import 这个库。验证：用 node web/preview.mjs 渲 seg_03 的 455、470、520、650、760 这几帧，和改之前（先渲一份存到 work/infra/her_card_base/）逐像素比，必须一致（允许 ≤1 灰阶的个别像素）。不改其他段。返回：接口说明（函数名、参数、坐标约定）、验证结果。`, { label: '共用卡面库', phase: 'Lib', effort: 'high' })
}

const results = await pipeline(args.segments,
  seg => agent(`${CTX}\n任务：段 ${seg.id}「${seg.name}」统一卡面。web/lib/her_card.js 是全片唯一的卡面画法（先读它的接口说明，在文件头）。\n1. 本段凡是出现她的卡（正面或背面、挂在胸前、在手里、飞出去、特写），都改成调用 her_card.js，删掉本段自己写的卡面坐标。正面按时间点用对的状态（03 k40 以前只有字带或没有字带、格子满浓度；以后是完整状态）。贴到人物图里画的卡上时，按实测四角做透视并裁在卡内。\n2. 按卡面状态.md 第四节查“卡会不会在手机上被读成手机”：把每个出现卡的镜头缩到 390×220 看；黑色卡背、阴影里的卡、远景里一排人胸前的卡都要读得出是纸卡（纸边、卡夹孔、颈绳、格子纹或纸纹）。路人的卡也照这条处理（路人的卡面可以不同，但不能是黑色圆角块）。\n3. 同类问题自查：(a) 本段如果用了 print16 / print16ByCount 的 slam（冲击放大），逐帧量冲击帧的实际墨迹框，登记进版面检查，压到别的字或标签就改成以远离邻近元素的一角为锚放大；(b) 本段如果有网点、格纹这类贴图在镜头缩放下采样（尤其缓推的远景），用 work/seg/03/moire_check.py 的方法逐帧比，有摩尔纹就照 seg_03.js 的 screen() 按屏幕缩放预滤波。${seg.extra || ''}\n4. 整段重渲（render_film.mjs 支持只渲改动的帧区间就只渲那些），重出 seg_${seg.id}.mp4 和 _phone，重跑全部检查。改动处用 qc_sheets 逐帧看。\n不要改本段已经通过评审的其他设计。返回：改了哪些镜头、手机尺寸复核结论、同类自查结果、检查数字。`, { label: `${seg.id} 统一卡面`, phase: 'Apply', effort: 'high' }),
  async (rep, seg) => {
    let review = await agent(`${CTX}\n你是没参与制作的独立评审。段 ${seg.id}「${seg.name}」刚统一了卡面（成片 ${ROOT}/work/seg/${seg.id}/seg_${seg.id}.mp4，用 ffmpeg 每 0.25 秒抽帧，卡出现的地方逐帧看，并缩到 390×220 看）。修改方报告：${rep}\n查：她的卡是否完全符合 docs/卡面状态.md（字带位置、片名两行位置、标签完整、格子压浅、卡背画法）；任何卡在手机尺寸下会不会被读成手机；有没有因为这次修改出现新问题（穿帮、跳、贴图感、字被切、摩尔纹、冲击帧压字）；这段原有的看点是否保持。passes 只在没有 MUST 时为 true。只读。`, { label: `${seg.id} 卡面复核`, phase: 'Review', schema: S_REVIEW, effort: 'high' })
    let fix = null
    if (review && !review.passes) {
      fix = await agent(`${CTX}\n任务：段 ${seg.id}「${seg.name}」卡面复核没过，按 MUST 改并重渲、重跑检查：${JSON.stringify(review.must)}\n返回改了什么。`, { label: `${seg.id} 卡面修改`, phase: 'Review', effort: 'high' })
      review = await agent(`${CTX}\n你是没参与制作的独立评审。段 ${seg.id}「${seg.name}」卡面修改后的成片在 ${ROOT}/work/seg/${seg.id}/。修改方报告：${fix}\n上一轮 MUST：${JSON.stringify(review.must)}，逐条核对，并查有没有新问题。passes 只在没有 MUST 时为 true。只读。`, { label: `${seg.id} 卡面复审`, phase: 'Review', schema: S_REVIEW, effort: 'high' })
    }
    return { seg: seg.id, rep, review, fix }
  })
return results
