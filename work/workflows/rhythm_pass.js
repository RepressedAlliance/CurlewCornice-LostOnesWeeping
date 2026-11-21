export const meta = {
  name: 'lost-one-rhythm-pass',
  description: 'User feedback pass: visuals hit the rock rhythm, lyrics in sync, ending fixed and made to hold viewers; diagnose, fix every segment, independent check',
  phases: [
    { title: 'Diagnose', detail: 'lyric lag root cause; per-segment rhythm map; ending bug and redesign' },
    { title: 'Fix', detail: 'each segment applies its rhythm prescriptions, lyric fix and (15/16) the new ending' },
    { title: 'Check', detail: 'independent check per segment, one fix round' },
  ],
}
const ROOT = (globalThis.process && globalThis.process.env && globalThis.process.env.LOSTONE_ROOT) || 'C:/path/to/CurlewCornice-LostOnesWeeping'   // absolute path of your clone
const FEEDBACK = `第一轮全片审看的反馈：1. 整体方向认可。2. 这是摇滚乐，切镜和画面动态要和歌曲节奏一致。3. 歌词出现比演唱略晚。4. 结尾的吉他弦脱离琴身；结尾效果不错，但还不够抓人、留住观众看完。`
const CTX = `工程 ${ROOT}（MV《ロストワンの号哭》，鏡音リン，摇滚，3:32，30 fps，全片帧 0–6381，段登记 web/segments.json）。先读 ${ROOT}/work/workflows/produce_segments.js 的 CTX 段（工程做法、Codex 出图、渲染锁、检查工具），再读 ${ROOT}/docs/制作约定.md（第六节节奏）、${ROOT}/docs/经验与检查清单.md、${ROOT}/docs/卡面状态.md。合成好的全片：${ROOT}/work/full/film.mp4。音频分析：${ROOT}/work/audio/（beats.npy、bars.json、accents.json、analysis.json、grid.json、vocal_onsets.npy、vocal_env.npy、lyrics_timed.json、lyric_fixes.json、sep/ 分轨）。实测拍点 beatV(k)=0.318+k*0.37037 秒。\n${FEEDBACK}\n导演对整体满意：画风、人物图、构图、各段设计和看点都保留，不推翻。仍守的规则：人物关键原画每张停两拍以上、中间张半拍以上；不做逐帧动画；镜头不转斜、竖线竖直；全片无红色；歌词是画面里的东西。用中文写。`
const SEGS = [['00','开头音型'],['01','开场'],['02','急停'],['03','片名检票口'],['04','A1'],['05','riff_ノーフィクション'],['06','A2'],['07','前副歌1'],['08a','副歌1前半'],['08b','副歌1后半'],['09','间奏riff'],['10','B'],['11','前副歌2'],['12','副歌2'],['13','C'],['14','最终副歌'],['15','尾奏riff'],['16','结尾音型']]
const S_REVIEW = { type: 'object', required: ['passes', 'must', 'nice'], properties: { passes: { type: 'boolean' }, must: { type: 'array', items: { type: 'string' } }, nice: { type: 'array', items: { type: 'string' } } } }

phase('Diagnose')
const [lyric, rhythm, ending] = await parallel([
  () => agent(`${CTX}\n任务：查清“歌词比曲子慢一点”的成因并修共用层面的成因。\n1. 实测：对全片每一句歌词（逐字出现的就逐字），量画面上字“读得出来”的时刻（不是开始淡入的时刻，是完整到能读的那一帧）和人声实际开口时刻（lyric_fixes.json / lyrics_timed.json，必要时在 sep/ 人声分轨上核）的差，列表给出每段的平均和最大延迟。画面时刻用 film.mp4 抽帧量，同时对照各段页面的歌词事件。\n2. 查合成的音画对齐：assemble_film.py 切音频的起点、AAC 编码的起始延迟（priming）、mp4 的 edit list，ffprobe 看 film.mp4 和 film_phone.mp4 音视频流的 start_time，确认音画是否整体偏移。\n3. 找成因：是数据晚了、出字动画（淡入、逐笔写、打字机）让字晚读出、还是合成偏移，或者几种叠加。\n4. 修：共用层面的成因（web/lib/lyrics.js、print.js 的出字曲线、assemble_film.py 的音频对齐）你直接改，并说明影响哪些段；各段页面自己写的出字时序不要改，写成每段一条“改法”交给后面的段修改。原则：字在开口那一帧就要读得出（可以提前 1–2 帧开始出现，但读出不能晚于开口），淡入、写字动画要在开口前完成或缩到 2 帧内。\n返回：实测表的摘要、成因、你已改的共用文件、每段的改法（段号 → 具体到哪句、怎么改）。`, { label: '诊断：歌词延迟', phase: 'Diagnose', effort: 'high' }),
  () => agent(`${CTX}\n任务：做全片“画面跟着摇滚节奏走”的诊断和处方。\n1. 从音频分析（必要时在 sep/ 鼓分轨上自己做起音检测）列出全曲的音乐结构：每段的拍、小节、底鼓、军鼓反拍、镲片、重音、过门、段落交界、能量高低（副歌、riff 最猛，主歌较克制，安静处）。\n2. 从 film.mp4 量画面的“力度”：逐帧帧差、切点、镜头起停、冲击（震、推、闪）的时刻和大小。\n3. 对照两者，按段列出：哪些强拍、军鼓、镲片、过门、段落交界画面没有反应；哪些段画面能量明显低于音乐能量（音乐在冲、画面在飘或停）；哪里画面动作和鼓点错开。\n4. 给每段写处方，具体到拍号（k 值）和手段，手段只用现有画风能做好的：在重拍上切镜或换张（人物关键张仍停两拍以上）、军鼓反拍上镜头冲击推近或下顿（几帧到位、短回弹）、镲片和重音上画面闪白或闪黑一帧到两帧、印章或字砸下、过门处镜头加速或连续快切、副歌比主歌更密更猛、段落交界用硬切对上鼓的进入。禁止：镜头转斜、乱抖、随机乱飞、为动而动；安静处保持安静。每段处方按伤害排序，标出最该改的三处。\n参考：两段 demo 第 15 版（web/scenes/a2v4_page.js、c1a_page.js）导演确认过的节奏写法。返回：全曲结构摘要、每段处方（段号 → 拍号、音乐事件、现在画面怎样、改成怎样）。`, { label: '诊断：节奏', phase: 'Diagnose', effort: 'high' }),
  () => agent(`${CTX}\n任务：结尾（段 15、16，约 181–212.7 秒）。\n1. 找到“吉他弦脱离吉他”的地方：用 film.mp4 逐帧看结尾，找出弦画在琴身外、断开、浮空的帧，查是页面代码画的弦还是人物图本身的问题，写清成因（根因清单同类：画面部件没跟着人物图走）。\n2. 结尾的完播率：导演说“结尾效果还不错，但没达到能提高完播率、让人看完的水平”。看最后 30 秒（逐 0.25 秒抽帧，对照音乐结构），判断观众会在哪一秒划走、为什么。设计两种真正不同的改法，让人愿意看到最后一秒：例如结尾要有一个前面埋下、最后才揭晓的东西；最后一个画面要是全片最值得截图的画面；最后几秒和开头呼应形成循环让人重看；节奏上最后一下要落在音乐最后一个音上。要守全片主线（全片分镜.md 审查后改定）和现有画风，Codex 出图可用。\n3. 选一个你认为最能让人看完的，写成可直接执行的分镜：拍号、画面、人物图需求（新图写清提示要点和母版）、镜头、字、和音乐的对应。\n返回：弦的问题和成因、两种设计、选定的分镜（分别写给 15 和 16）。`, { label: '诊断：结尾', phase: 'Diagnose', effort: 'high' }),
])
log('诊断完成，开始逐段修改')

phase('Fix')
const results = await pipeline(SEGS,
  ([id, name]) => agent(`${CTX}\n任务：段 ${id}「${name}」按审看反馈修改。三份诊断（只看和本段有关的部分）：\n【歌词】${lyric}\n【节奏】${rhythm}\n${(id === '15' || id === '16') ? '【结尾】' + ending + '\n' : ''}做法：\n1. 歌词：按诊断里本段的改法改出字时序，保证每个字在开口那一帧读得出。\n2. 节奏：按本段处方改，最该改的三处必须做，其余按效果取舍；用现有人物图和设计，需要新人物图（例如过门快切需要的张）就用 Codex 按母版出，自己看过再用。改完把本段带音乐的成片和音频起音对照，逐个检查冲击、切点落在鼓点上，画面不提前不拖后。\n3. ${(id === '15' || id === '16') ? '结尾：修好吉他弦（弦必须在琴上，从琴枕到琴桥，跟着人物图走），并按选定的结尾分镜改。' : '本段的看点和设计保持不变。'}\n4. 整段重渲（遵守 render.lock），重出 seg_${id}.mp4 和 _phone，重跑全部检查（BEAT/HOLD/FRAME AUDIT、red_scan、static_scan、reuse_audit、qc_sheets）。\n返回：改了哪些拍、手段、歌词实测前后对比、检查数字、你知道的不足。`, { label: `${id} 修改`, phase: 'Fix', effort: 'high' }),
  async (rep, [id, name]) => {
    const ask = `${CTX}\n你是没参与制作的独立评审。段 ${id}「${name}」按审看反馈改过了，成片 ${ROOT}/work/seg/${id}/seg_${id}.mp4。修改方报告：${rep}\n查：(1) 画面是不是跟着摇滚节奏走了：拿音频起音（work/audio 和 sep/ 鼓分轨，自己做起音检测）对照成片逐帧帧差和切点，重拍、军鼓、镲片、过门有没有画面反应，有没有错开；有没有为动而动、乱抖、转斜、人物换张太快。(2) 歌词每个字是否在开口那一帧读得出。(3) ${(id === '15' || id === '16') ? '吉他弦是否完全在琴上；结尾是否让人想看到最后一秒，最后一下是否落在最后一个音上。' : '本段原有看点是否保持。'} (4) 有没有新问题（穿帮、字被切、红色、贴图感）。passes 只在没有 MUST 时为 true。只读。`
    let review = await agent(ask, { label: `${id} 复核`, phase: 'Check', schema: S_REVIEW, effort: 'high' })
    let fix = null
    if (review && !review.passes) {
      fix = await agent(`${CTX}\n任务：段 ${id}「${name}」复核没过，按 MUST 改并重渲、重跑检查：${JSON.stringify(review.must)}\n返回改了什么。`, { label: `${id} 再改`, phase: 'Check', effort: 'high' })
      review = await agent(`${ask}\n这是修改后的复审，上一轮 MUST：${JSON.stringify(review.must)}，逐条核对。修改方报告：${fix}`, { label: `${id} 复审`, phase: 'Check', schema: S_REVIEW, effort: 'high' })
    }
    return { seg: id, review, rep, fix }
  })
return { lyric, rhythm, ending, results }
