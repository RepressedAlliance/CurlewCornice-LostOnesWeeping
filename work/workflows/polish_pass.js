export const meta = {
  name: 'lost-one-polish-pass',
  description: 'Rhythm without dizziness, every code-drawn part follows its drawing, guitar-smash ending; research, fix each segment, independent check',
  phases: [
    { title: 'Research', detail: 'motion rule from 少女A vs ours; parts audit; smash ending design' },
    { title: 'Fix', detail: 'each segment: apply motion rule, fix parts, 15/16 build the smash ending' },
    { title: 'Check', detail: 'independent check, one fix round' },
  ],
}
const ROOT = (globalThis.process && globalThis.process.env && globalThis.process.env.LOSTONE_ROOT) || 'C:/path/to/CurlewCornice-LostOnesWeeping'   // absolute path of your clone
const FEEDBACK = `第二轮全片审看的反馈：1. 整屏运动要有节奏感、和摇滚节奏对上，但不能一直抖、不能让人晕（不是完全不能晃）。2. 结尾可以做砸吉他，但要用本片的优势做，效果必须好，不能为了砸而砸。3. 代码画的部件要和人物图连成一体（04 段 0:30 卡背特写的笔芯和笔身对不上，别处的吉他弦和吉他也有同类问题）。`
const CTX = `工程 ${ROOT}（MV《ロストワンの号哭》，鏡音リン，摇滚 162 BPM，3:32，30 fps，全片帧 0–6381，段登记 web/segments.json）。先读 ${ROOT}/work/workflows/produce_segments.js 的 CTX 段（工程做法、Codex 出图、渲染锁、检查工具），再读 ${ROOT}/docs/制作约定.md、${ROOT}/docs/经验与检查清单.md、${ROOT}/docs/卡面状态.md。当前成片 ${ROOT}/work/full/film.mp4。节奏诊断数据和脚本在 ${ROOT}/work/rhythm_diag/（drums.json 每拍鼓事件、align.py）。\n${FEEDBACK}\n导演对整体满意，画风、人物图、构图、各段看点保留。人物关键原画每张停两拍以上、中间张半拍以上；镜头不转斜；全片无红色。\n**导演正在用这台电脑玩游戏**：渲染一次只开一个（遵守 work/render.lock），渲染进程启动后立即设为低优先级（PowerShell：(Get-Process -Id <pid>).PriorityClass='BelowNormal'，node 和它的 chrome 子进程都设），检查脚本单进程跑（red_scan --workers 1），不开多路并行分析。用中文写。`
const SEGS = [['00','开头音型'],['01','开场'],['02','急停'],['03','片名检票口'],['04','A1'],['05','riff_ノーフィクション'],['06','A2'],['07','前副歌1'],['08a','副歌1前半'],['08b','副歌1后半'],['09','间奏riff'],['10','B'],['11','前副歌2'],['12','副歌2'],['13','C'],['14','最终副歌'],['15','尾奏riff'],['16','结尾音型']]
const S_REVIEW = { type: 'object', required: ['passes', 'must', 'nice'], properties: { passes: { type: 'boolean' }, must: { type: 'array', items: { type: 'string' } }, nice: { type: 'array', items: { type: 'string' } } } }

phase('Research')
const [motion, parts, ending] = await parallel([
  () => agent(`${CTX}\n任务：定出“有节奏感但不晕”的画面运动规则，并给每段开清单。\n1. 参考必须是摇滚的同类作品（节奏参考应选摇滚类作品）。参考对象：Neru 自己的摇滚 PV（《ロストワンの号哭》原 PV、《脱法ロック》《東京テディベア》等）、摇滚乐队动画《ぼっち・ざ・ろっく！》的演出段落和片头、《チェンソーマン》片头《KICK BACK》、其他高评价的摇滚动画 MV/OP。用 WebSearch/WebFetch 查这些作品的剪辑和镜头分析（官方访谈、分镜/演出解说、独立的剪辑分析文章和社区讨论），整理它们怎么卡鼓：切镜密度、整屏晃动用在哪、多大多频繁、靠什么画内手段出节奏、静动对比。不要下载视频文件。\n2. 量本片：当前 film.mp4 逐帧拟合整屏运动（平移、缩放、旋转），统计每分钟整屏冲击/抖动次数、幅度（屏幕百分比）、持续帧数、连续冲击之间的静止间隔、来回弹的次数；每分钟切镜次数、画内冲击次数。和参考作品的做法对比，找出本片“晕”的具体成因。再查防晕的通行做法（剪辑、动画、游戏镜头抖动设计），取能直接用的数字。\n3. 定规则：写成可检查的硬规则（例如整屏位移的幅度上限、每段/每分钟次数上限、两次之间最少静止几拍、只许单向冲击后停住、不来回弹、哪些音乐事件才配整屏冲击），以及“节奏感靠什么来补”（切镜、换张、画内冲击、静动对比）。规则写进 ${ROOT}/docs/制作约定.md 第六节，并在 web/lib/camera.js 加一个 MOTION AUDIT（按规则逐帧检查整屏运动，超标就报），不改变现有函数的行为。\n4. 按段列清单：每段现在有哪些整屏冲击/抖动（拍号、幅度），哪些删、哪些减弱、哪些保留，删掉的地方用什么画内手段保持节奏。\n返回：参考对比数字、晕的成因、规则全文、每段清单。`, { label: '调研：不晕的节奏', phase: 'Research', effort: 'high' }),
  () => agent(`${CTX}\n任务：全片查“代码画的部件没跟着人物图走”。审看截图：04 段 0:30 卡背特写，自动铅笔的笔芯是代码画的黑杆，和图里的笔身对不上（笔芯从笔尖斜出去、角度和位置都错）；还说别的地方吉他弦和吉他也不是一块的（15 段扫弦已知，其他段也有）。\n1. 逐段查所有叠在人物图或道具图上的代码部件：笔芯、铅笔、吉他弦、颈绳、卡夹、耳机线、手里的东西、影子等。方法：读各段页面代码找出这类部件，再用 film.mp4 在每张人物图出现的帧里全尺寸裁看部件和图的接合处（可用 python 抽帧裁图）。\n2. 找共同成因（例如只按一张参考图量了一套锚点、又被每张图的对齐偏移多挪一次、角度不跟图、换张时没换锚点）。\n3. 在 web/lib/ 新建 parts.js：提供“按每张图各自的锚点和同一个变换画部件”的工具，以及 PART AUDIT（沿部件取样，像素必须落在图里对应的实物上，例如弦落在指板/琴面，笔芯从笔尖延出且同角度），供各段使用。不改各段文件。\n返回：每段的问题清单（段号、秒数、帧、部件、现在怎样、该怎样、哪张图）、成因、parts.js 的用法。`, { label: '调研：部件对不上', phase: 'Research', effort: 'high' }),
  () => agent(`${CTX}\n任务：设计结尾“砸吉他”（段 15 尾奏 riff、段 16 结尾音型，约 181–212.7 秒；先读 web/scenes/segments/seg_15.js、seg_16.js 和 docs/分镜/15_*.md、16_*.md 看现在的结尾，再读 ${ROOT}/work/rhythm_diag/ 里这两段的鼓事件）。\n要求：效果一定要好，不能为了做砸吉他反而做差。用我们的优势，避开短处。\n- 优势：Codex 从同一张母版整张画的关键原画，按鼓点换张来演；印刷、纸、卡、印章、字的画面语言；冲击原画（整幅一张，黑白反转、速度线）只停几帧；动和静的对比。\n- 短处（不要用）：逐帧挥动动画；代码画的飞溅碎片和物理碎裂（根因清单 08b 折铅笔那一行）；强透视里的平面人物；歪镜头；随机乱飞。\n- 主线：04 段唱「レスポールさえも凶器に」时她把琴扛在肩上像凶器但没挥，结尾第一次真的砸下去，前后呼应。砸的对象由你定（建议是对她说「読み取れません」的检票读卡机，和全片主线呼应），砸完要有一个值得截图的最后画面，最后一下落在歌曲最后一个音上，让人想看到最后一秒。\n1. 用 WebSearch 查《ロストワンの号哭》热门 PV/翻唱视频里砸吉他是怎么做的（找它们好看在哪、常见的俗套在哪），也查动画里“冲击作画”的做法。\n2. 写成可直接执行的分镜：拍号、每张画面、人物图需求（每张写清母版、只改哪里、Codex 提示要点）、冲击原画、碎片部件（Codex 出透明底组件）、镜头（守“不晕”）、字、和鼓的对应。15 段扫弦那段的吉他弦问题一并考虑（若琴在结尾被砸，弦怎么处理）。\n返回：调研要点、分镜全文（分 15、16）、出图清单。`, { label: '设计：砸吉他结尾', phase: 'Research', effort: 'high' }),
])
log('调研完成，开始逐段修改')

phase('Fix')
const FIX = (args && args.segs) ? SEGS.filter(([id]) => args.segs.includes(id)) : SEGS
const END = id => id === '15' || id === '16'
const results = await pipeline(FIX,
  ([id, name]) => agent(`${CTX}\n任务：段 ${id}「${name}」第三轮修改。三份调研（只看和本段有关的部分）：\n【不晕的节奏规则和清单】${motion}\n【部件对不上】${parts}\n${(id === '15' || id === '16') ? '【砸吉他结尾分镜】' + ending + '\n' : ''}（更新：导演已经不玩游戏了，渲染用正常优先级，仍遵守 render.lock 一次一个；检查脚本也可正常并行。这一轮范围要收紧：只改清单里本段要改的，不做额外打磨，自己逐帧核对改动处。）\n做法：\n1. 按规则和本段清单改整屏运动：删、减弱或保留，删掉的地方用画内手段保住节奏；本段 MOTION AUDIT 必须干净。\n2. 本段所有代码部件改用 web/lib/parts.js，按每张图各自的锚点画，PART AUDIT 干净；截图里 04 段的笔芯必须和笔身同角度、从笔尖延出。\n3. ${(id === '15' || id === '16') ? '按砸吉他分镜做结尾：人物图和冲击原画用 Codex 按母版出，每张自己看过（不好就重出），碎片用 Codex 出的组件，不用代码凑。做完自己和全片最好的镜头比，不够好就改到够好。' : '本段看点不变。'}\n4. 整段重渲（遵守 render.lock、低优先级），重出 seg_${id}.mp4 和 _phone，重跑全部检查。\n返回：改了什么、MOTION AUDIT 和 PART AUDIT 数字、检查数字、不足。`, { label: `${id} 修改`, phase: 'Fix', effort: END(id) ? 'high' : 'medium' }),
  async (rep, [id, name]) => {
    if (!END(id)) return { seg: id, rep }
    const ask = `${CTX}\n你是没参与制作的独立评审。段 ${id}「${name}」第三轮修改后的成片在 ${ROOT}/work/seg/${id}/seg_${id}.mp4。修改方报告：${rep}\n查：(1) 会不会看着晕：逐帧量整屏运动，对照 docs/制作约定.md 第六节的新规则；同时节奏感还在不在（鼓点上有没有画面反应）。(2) 所有代码画的部件（笔芯、弦、颈绳等）在每一帧都和图对得上，全尺寸裁看。(3) ${(id === '15' || id === '16') ? '砸吉他结尾是不是真的好看、高级，不廉价：冲击原画、碎片、最后一个画面、和鼓和最后一个音的对应；拿它和全片最好的镜头比。' : '本段看点是否保持。'} (4) 有没有新问题。passes 只在没有 MUST 时为 true。只读。`
    let review = await agent(ask, { label: `${id} 复核`, phase: 'Check', schema: S_REVIEW, effort: 'high' })
    let fix = null
    if (review && !review.passes) {
      fix = await agent(`${CTX}\n任务：段 ${id}「${name}」复核没过，按 MUST 改并重渲、重跑检查：${JSON.stringify(review.must)}\n返回改了什么。`, { label: `${id} 再改`, phase: 'Check', effort: 'high' })
      review = await agent(`${ask}\n这是修改后的复审，上一轮 MUST：${JSON.stringify(review.must)}，逐条核对。修改方报告：${fix}`, { label: `${id} 复审`, phase: 'Check', schema: S_REVIEW, effort: 'high' })
    }
    return { seg: id, review, rep, fix }
  })
return { motion, parts, ending, results }
