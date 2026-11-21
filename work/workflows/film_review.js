export const meta = {
  name: 'lost-one-film-review',
  description: 'Render and assemble the whole film, then review rounds (5 independent lenses) -> fix list -> grouped fixes with art-director check -> re-render, until no MUST',
  phases: [
    { title: 'Render', detail: 'render_film.py run + assemble_film.py --phone' },
    { title: 'Review', detail: 'five independent reviewers, each one lens' },
    { title: 'List', detail: 'merge into docs/全片修改清单N.md' },
    { title: 'Fix', detail: 'per segment: fix -> art director -> revise' },
    { title: 'Final', detail: 'sync with the official audio, opening and ending, delivery check' },
  ],
}
// args: { startRound: 1, maxRounds: 4 }
const ROOT = (globalThis.process && globalThis.process.env && globalThis.process.env.LOSTONE_ROOT) || 'C:/path/to/CurlewCornice-LostOnesWeeping'   // absolute path of your clone
const FILM = `${ROOT}/work/full/film.mp4`
const CTX = `工程 ${ROOT}（MV《ロストワンの号哭》，鏡音リン，3:32，30 fps，全片帧 0–6381）。规则：${ROOT}/docs/制作约定.md（第十节：首要是好看、抓人；第十一节：全片审查）、${ROOT}/docs/经验与检查清单.md、${ROOT}/docs/全片分镜.md（末尾“审查后改定”为准）、${ROOT}/docs/卡面状态.md、${ROOT}/docs/设定包.md（art/canon/）。段的登记在 ${ROOT}/web/segments.json（每段 id、f0、f1），python tools/segments.py at <秒> 查某秒属于哪段。用中文写。`
const RENDER = `${CTX}\n任务：把全片渲出来并合成。先确认 ${ROOT}/work/render.lock 不存在（存在就等它消失）。然后在 ${ROOT} 下：python tools/render_film.py status 看状态；python tools/render_film.py run（它按依赖哈希只重渲改过的段，按内存自动定并行数；用受控的后台进程启动这个长任务并登记，用 read_process_output 看进度，失败按报错处理，再跑同一命令会续渲）；完成后 python tools/assemble_film.py --phone（输出 work/full/film.mp4 和 film_phone.mp4，脚本自己检查接缝、音画长度、黑帧，退出码 1 说明有检查没过，要查清并修好）。如果 segments.py check 报空档或重叠，查清是哪段登记错了再修 segments.json。返回：每段渲染状态、合成检查结果、成片路径、时长和帧数。`
const S_FIND = { type: 'object', required: ['verdict', 'findings'], properties: {
  verdict: { type: 'string' },
  findings: { type: 'array', items: { type: 'object', required: ['seg', 'time', 'level', 'issue', 'confidence', 'fix'], properties: {
    seg: { type: 'string' }, time: { type: 'string' }, level: { type: 'string', enum: ['MUST', 'NICE'] }, issue: { type: 'string' }, confidence: { type: 'string' }, fix: { type: 'string' } } } } } }
const S_LIST = { type: 'object', required: ['must_count', 'list_path', 'groups'], properties: {
  must_count: { type: 'number' }, list_path: { type: 'string' },
  groups: { type: 'array', items: { type: 'object', required: ['seg', 'items'], properties: { seg: { type: 'string' }, items: { type: 'array', items: { type: 'string' } } } } } } }

const LENSES = [
  ['现实常识和穿帮', '查现实常识和穿帮：人和物的接触（坐、站、拿、挂）、穿模、遮挡顺序、光和影的方向、比例、透视、物件朝向、手指数、卡和颈绳、文字被切或被挡。每个镜头至少全尺寸看一帧，接触点裁大看。'],
  ['运动和节奏', '查运动和节奏：用 ffmpeg 抽全片逐帧帧差（例如 select 帧差或自己用 python 算），找跳变、冻结、闪帧、一帧错位、接缝处的跳；对照 docs/分镜/节拍核对.md 和实测拍点（beatV(k)=0.318+k*0.37037 秒）看切点、换张、镜头起止是否落拍、画面有没有提前；人物换张停留是否太短或 A→B→A。'],
  ['静音观众', '你是在手机上静音刷到这支片子的观众，不懂日语。按 0.5 秒抽帧，并对开头前 10 秒和最后 30 秒逐 0.25 秒看：开头会不会让人停下点进来；故事看不看得懂（她是谁、发生了什么、结尾怎样）；哪里无聊、哪里看不懂、哪里像幻灯片或 PPT；会不会看到最后一秒。和两段 demo 第 15 版（work/a2v4/v15_sheets、work/c1a/v15_sheets）比，哪些段掉档。'],
  ['关键镜头和人设', '查关键镜头和人设：她每次出现都对照 art/canon/ 的设定（碧青色眼 #218EA3、金发、大蝴蝶结、14 岁 152 cm、服装），比例、头身、脸、手是否一致，同一段换张是否像同一个人；Les Paul、卡、颈绳等关键道具前后一致；查全片重复：同样的场景、机位、点子反复用（刻意呼应除外）。'],
  ['根因清单', '拿 docs/经验与检查清单.md 逐行对全片：每一行“全片要查的同类”都要在成片里实际找一遍（例如红色、字被切、手忽大忽小、记号被读成字、贴纸感、歌词条、乱切人物、小孩蜡笔画、同一张图排满），写明查了哪些秒、结果如何。另外全片不许出现红色。'],
]

let round = (args && args.startRound) || 1
const maxRounds = (args && args.maxRounds) || 4
let prevList = null
let lastMust = -1
phase('Render')
await agent(RENDER, { label: `渲染合成 r${round}`, phase: 'Render', effort: 'high' })

while (round <= maxRounds) {
  phase('Review')
  const prevNote = prevList ? `上一轮修改清单是 ${prevList}：先逐条核对是否真的改好（没改好的照样列为 MUST），再做本方面的新审查。` : ''
  const reviews = await parallel(LENSES.map(([name, lens]) => () => agent(`${CTX}\n你是没参与制作的独立评审，只看成片，不看代码、不看制作方报告。成片：${FILM}（手机版 ${ROOT}/work/full/film_phone.mp4）。用 ffmpeg 自己抽帧看（Read 看图），需要时裁大。${prevNote}\n你的方面：${lens}\nMUST = 观众会觉得坏了、廉价、错了，或违反根因清单；其余 NICE。每条写段号、秒数、问题、把握程度、修法，按伤害排序。verdict 写这一方面的总评（值不值得看、和 demo 第 15 版比）。只读。`, { label: `r${round} ${name}`, phase: 'Review', schema: S_FIND, effort: 'high' })))
  phase('List')
  const list = await agent(`${CTX}\n任务：把第 ${round} 轮五位评审的意见合成 docs/全片修改清单${round}.md。评审结果：${JSON.stringify(reviews.filter(Boolean))}\n要求：去重合并；每条自己去成片里核实（ffmpeg 抽那一秒看），确认是真问题再收，误判的写进文末“未采纳”并说明理由（评审也是 AI，会错）；按段分组；每条写秒数、问题、修法方向、来自哪位评审；MUST 和 NICE 分开。${args && args.mustOnly ? 'groups 里只放 MUST（这一版要尽快交付，NICE 只记在清单里不安排修改）；没有 MUST 的段不进 groups。' : 'NICE 里明显提升观感、改动小的也安排进去。'}全片性的问题（多段同类）在每段里都列上。返回 must_count（核实后的 MUST 条数）、list_path、groups（每段要改的条目，MUST 在前，含要做的 NICE）。`, { label: `r${round} 汇总清单`, phase: 'List', schema: S_LIST, effort: 'high' })
  if (!list) break
  log(`第 ${round} 轮：MUST ${list.must_count} 条，涉及 ${list.groups.length} 段`)
  if (list.must_count === 0 && list.groups.length === 0) break
  if (list.must_count === 0 && lastMust === 0) break
  phase('Fix')
  await pipeline(list.groups,
    g => agent(`${CTX}\n先读 ${ROOT}/work/workflows/produce_segments.js 的 CTX 段（工程做法、出图、渲染锁、检查）。任务：按 ${list.list_path} 里段 ${g.seg} 的条目修改：${JSON.stringify(g.items)}\nMUST 从成因改，看点不成立就换设计，不打补丁；只改本段文件（共用库要改先写进报告，确实全片同类才改，并说明影响哪些段）。改完重渲本段成片 work/seg/${g.seg}/seg_${g.seg}.mp4 和 _phone、重跑全部检查，改动处 qc_sheets 逐帧看。返回每条怎么改的。`, { label: `r${round} ${g.seg} 修改`, phase: 'Fix', effort: 'high' }),
    (rep, g) => agent(`${CTX}\n你是没参与制作的美术指导。段 ${g.seg} 按修改清单改过了，成片在 ${ROOT}/work/seg/${g.seg}/。要改的条目：${JSON.stringify(g.items)}\n修改方报告：${rep}\n逐条看改好了没有，改出来好不好看，有没有新问题。只读。返回：每条“好了/没好/改坏了”和理由，以及新问题。`, { label: `r${round} ${g.seg} 美术挑错`, phase: 'Fix', effort: 'high' })
      .then(ad => agent(`${CTX}\n任务：段 ${g.seg} 修改后，美术指导的意见：${ad}\n没好、改坏、新问题都要处理，然后重渲本段成片并重跑检查。都已经好了就不用动。返回改了什么。`, { label: `r${round} ${g.seg} 修订`, phase: 'Fix', effort: 'high' })))
  prevList = list.list_path
  lastMust = list.must_count
  round++
  phase('Render')
  await agent(`${RENDER}\n另外：合成后用帧差证明这一轮没改的段逐帧不变（和上一版 work/full/prev/ 里的同段比），把结果写进 ${prevList} 文末。`, { label: `渲染合成 r${round}`, phase: 'Render', effort: 'high' })
}

phase('Final')
const final = await agent(`${CTX}\n你是交付前最后一关的独立检查，没参与制作。成片 ${FILM}。任务：(1) 用正式音轨从头到尾核对音画：音频长度、开头对齐、每个接缝处音画是否连续，并抽查每句歌词出字时间和实际开口（work/audio/lyric_fixes.json、web/lib/lyrics.js）是否一致，画面不提前；(2) 开头前 10 秒、最后 30 秒按“会不会点进来、会不会看到最后一秒”单独看；(3) 全片逐 0.5 秒抽帧过一遍，确认没有坏帧、黑帧、红色、字被切；(4) 读最后一张全片修改清单，确认 MUST 都已解决、“已知不足”“没核对到的”两栏可以为空。只读。返回：是否可以交付（是/否），不能交付的话列出 MUST。`, { label: '交付前检查', phase: 'Final', schema: S_FIND, effort: 'high' })
return { rounds: round, lastList: prevList, final }
