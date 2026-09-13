# ReiVerb Sound Atorie · 作品集路线图 TODO

> 来源：`mimo 参阅.txt` 整理。面向执行者（你 / 未来 AI Agent）。  
> 站点根目录：`E:\eiichi-2049.github.io\eiichi-2049.github.io`  
> 状态标记：`[ ]` 未做 / `[~]` 部分 / `[x]` 完成 / `[!]` 阻塞（等素材）

---

## 0. 站点当前基线（执行前必读）

| 区域 | 现状 |
|------|------|
| 首页 Work | 已改为 **Selected Work 01–03 项目证据** + **Experiments 三层** |
| 首页音频 | **无**「第一屏可听」播放器；点进子页才有声音 |
| Showreel / Demo Reel | **未做**（作者自理剪辑；站点负责展示） |
| 子页 | OST 播放器较完整；BKEQ 有截图、**YouTube 占位 ID**；05 几乎空壳；Wwise/HSR/写作有内容但证据深度不一 |
| 交互音频演示 | **无**；「三阶段叠加」构想仅存在于参阅文案 |
| 命名 / 交付包 | **未建立** Portfolio Package 规范 |
| 深度 Case Study 模板 | **未建立** |

**主站不应直接大改前先确认**：是否合并分支、是否只在 `AI修改/` 草稿验收。

---

## 1. P0 — 决定作品集「能不能用」

### 1.1 资产与工程规范（先做，后面全部依赖它）

- [ ] **统一所有音频文件命名**  
  建议规则（可改，但要唯一、可检索）：  
  `Project_Music|SFX|UI|Ambience_Section_Type_vX.Y.wav`  
  示例：`GameJam_Chase_Music_Combat_Loop_v1.0.wav`  
  禁止：`最终版2.wav` / `Final_v2_真实.wav`
- [ ] **建立 Portfolio Package 文件夹规范**（仓库内或网盘，二选一写清路径）  
  ```
  00-pkg/
    00-src/           原始 WAV / 工程截图 / DAW 工程
    01-derive/        发布用 mp3/ogg、封面、poster
    02-showreel/      Demo Reel 母版 + 发布版
    03-ab/            Rescore A/B 对比
    04-wwise/         工程树截图 / 录屏
    05-meta/          规格、命名说明、版权与 AI 标注
  ```
- [ ] **写一页「技术规格」文案**（可放子页或 Package 内）  
  - 采样率：48 kHz（游戏）/ 96 kHz（母带可选）  
  - 位深：24 bit  
  - 响度：交付流媒体 **-16 LUFS** 或游戏线 **-18～-14**（选定并写清场景）  
  - Stems 命名与交付物清单  
  - AI 使用边界标注（若有）

### 1.2 Demo Reel（首页可看的最强内容）

- [ ] **完成 Demo Reel 成片**（作者剪辑；时长目标见下）  
  - 大厂面试向：**30–90s** Hero Reel（非 8 分钟长片）  
  - 结构建议：**画面 → 声音 → 结果**（攻击 Whoosh+Impact+Tail 等）  
  - 快速回答：你是谁 / 最擅长什么 / 声音有何特点
- [ ] **首页嵌入 Showreel**（待成片）  
  - 位置：Hero 下或 Selected Work 上  
  - 默认不自动出声；`preload="none"` + poster  
  - 点击播放；移动端 `playsinline`
- [ ] 结束卡 / 页脚与站上品牌统一（姓名、角色、邮箱）

### 1.3 首页「立刻能听」迷你播放器

- [ ] 在 Hero 或 Work 顶部加 **1–2 条精选音频**迷你播放器  
  - 可先 SoundCloud / 网易云，但优先自托管 + 自研控件（与站风一致）  
  - 默认静音/需点击播放；不要自动轰炸  
- [ ] 或：把迷你播放器与「Showreel」合并为单一「Listen / Watch」模块，避免堆叠

### 1.4 首页交互式三层音频体验（「KTV 小绿点」）

**核心目标**：面试官点 3 次，亲手感到「音频成为玩法催化剂」。

#### 内容文案
- [ ] 一句话模块目标（写入 HTML 注释或内部 brief 即可）
- [ ] 三阶段命名：仅画面 → +环境层 → +交互与音乐层  
  （避免「无聊/好爽」等口语，用职责与术语）
- [ ] 每层技术标签示例：  
  `Ambience Bus · RTPC Distance`  
  `SFX · Ducking · Priority`  
  `Music Bus · RTPC Combat · Transition`
- [ ] 引导语：「点击三个点，逐层叠加音频」
- [ ] 重置：「重新体验」

#### 画面素材 `[!] 等作者提供`
- [ ] ~15s 游戏画面，**静音循环**，版权干净
- [ ] `<3MB`，`webm` + `mp4` 双格式
- [ ] poster 封面
- [ ] `autoplay muted loop playsinline`，绝不自动出声

#### 音频素材 `[!] 等作者提供`
- [ ] 环境层：无缝循环、空间/材质/距离
- [ ] 交互层：短促清晰，不抢音乐频段
- [ ] 音乐层：有强度曲线
- [ ] Web 格式 ogg/mp3/m4a；默认音量防爆频
- [ ] 独立 `Audio` 或 Web Audio 总线；低码率备选

#### 交互与实现（Agent 可写代码）
- [ ] HTML：视频容器 + 三交互点 + 状态文案 + 重置
- [ ] CSS：响应式、克制动效、焦点态；尊重 `prefers-reduced-motion`
- [ ] JS：**用户手势后**再 `AudioContext.resume`
- [ ] 点击层 → 播/停对应层 + 视觉状态；可顺序引导也可自由勾选
- [ ] 失败降级：权限/加载错误提示；无 JS 至少静态说明 + 下载链
- [ ] 可选：折叠「技术说明」（Wwise 事件树 / 总线图）
- [ ] 无障碍：`aria-*`、键盘可达、对比度
- [ ] 三端浏览器实测 + 非音频朋友试用

### 1.5 Rescore / A·B 对比

- [ ] **完整 Rescore 项目一件**（拿已有公开片段，展示 Original vs 你的版本）
- [ ] **Video + Audio Sync Player**（画面与音轨对齐；可点击重放）
- [ ] **A/B Original vs Rescore** 切换器  
  - 每条下标注技术参数（采样率、压缩比等）  
  - 结果可写：重击使用率 +22% 一类**可验证叙事**（有数据更佳）
- [ ] 可选：同一能力再补「音效 AB」（无音频 / 有音频）

---

## 2. P1 — 决定「是不是专业 / 能不能进大厂」

### 2.1 Case Study 模板（先定模板再填项目）

统一结构（每个项目复用）：
1. 钩子（1 句问题 / 痛点）
2. 截图或 15s 静音循环
3. Role / Responsibilities / Team size / My Contribution
4. 技术栈标签（Unity / UE / Wwise / FMOD / MetaSounds / DAW…）
5. 实现过程（分层图、RTPC、事件树、或合成链）
6. 结果（可听 AB / 玩家数据 / 性能数据）
7. 灰底引用：**「这次我最后悔没做到的事」+ 改进方案**
8. 策划 Brief → Audio Solution 对话示例（可选）
9. 技术规格与命名 / AI 标注

- [ ] 落地为 `shared/case-study.css` + 子页 HTML 片段或 md→html 流程  
- [ ] 至少 1 个项目按模板写满

### 2.2 项目元数据（招聘方必读）

- [ ] 每个精选项目补：  
  - Role（如 Sound Designer）  
  - Responsibilities（Character SFX / Combat / UI / Ambience）  
  - Team（N people）  
  - Contribution（约 N 条 SFX、是否实现到 Wwise 等）

### 2.3 Wwise Case Study（含「游戏内」证据）

- [ ] 补 **Wwise 工程截图 / 事件树 / 录屏**（至少 GIF 或短 MP4）
- [ ] 首页或 `03-wwise` 露一张缩略图当钩子
- [ ] 写清 Dynamic Music：Exploration→Combat、Layered、Intensity、RTPC Transition
- [ ] 如有性能案例：降采样/删轨/内存 300MB→80MB 等写进工作流

### 2.4 交互音乐「紧张度滑条」演示

- [ ] 页面控件：拖动战斗紧张度，音乐层实时过渡（Web Audio / 预渲染层）
- [ ] 或：静音录屏 + 用户点「Play 我的配音版」看卡帧（Attack 峰值）

### 2.5 工业化透明度

- [ ] 核心曲目可展开：弦乐/铜管/电子/打击 **分层结构图**
- [ ] 音效例：展示拟音源（铁链、电流…）+ 效果链备注（EQ/Comp/Reverb）
- [ ] **命名规范 + 版本管理** 在页面「技术规格」栏可见

### 2.6 AI 与传统边界

- [ ] 诚实标注哪些 AI、哪些实录/MIDI
- [ ] 若有过程：AI 氛围垫音 → 传统压缩重塑动态，可写成小案例

### 2.7 风格与分类导航（独立开发者视角）

- [ ] Music / Gameplay（Battle Boss Character Cinematic Vocal Orchestral…）
- [ ] Sound Design（Character Combat Creature Environment UI Cinematic Foley）
- [ ] Interactive Audio（Wwise FMOD UE Unity）  
- [ ] 标明 **交互音乐能力**（分层/垂直重编） vs 线性贴片

### 2.8 文化融合 / 文化研究（HoYo 向加分）

- [ ] **第一篇 Cultural Studies** 短文  
  例：Duduk + Dubstep 混音难点；民族乐器进重型合成器的频段策略
- [ ] Duduk / Electronic **真实音频实验**
- [ ] 传统乐器 + Synth **实际制作案例**

### 2.9 协作与「战友感」

- [ ] 《音频规范与工作流优化》栏：公共素材库、响度标准、内存优化
- [ ] 观点句示例：「顶级游戏音频是删出来的；为性能做减法更考验审美」
- [ ] Brief → Direction → Result 示例块（轻盈但有攻击性 → Organic+Metallic / Avoid heavy low-end / Emphasize transient）

### 2.10 合作模式（可选但大厂/独立都会瞟）

- [ ] 是否写「商用授权起价 / 按首 / 按工时 / 红利」——你定是否上站
- [ ] 若不上站，Package 内备一页话术

### 2.11 其他站务 P1

- [ ] HSR 叙事已改为 Music Analysis；如需再对齐 Reconstruction 用语，统一一次
- [ ] 写第一篇 Cultural Studies（同 2.8）
- [ ] 完成真正完整的 **Wwise Case Study 页**

---

## 3. P2 — 完善信息架构与细节

### 3.1 页面与栏目

- [ ] **About**（一句话价值锚点 + 联系方式）
- [ ] **Technical Stack**（引擎 / 中间件 / DAW）
- [ ] **Resume**（PDF 已有：`个人简历.pdf`；页内可链）
- [ ] **Research / Journal**（已有 06 写作；可串联 Cultural Studies）
- [ ] **项目贡献说明** / 团队规模 —— 并入 Case Study 模板
- [ ] **Before / After** —— 并入 Rescore / AB
- [ ] **Technical Timeline** —— 可选制作流程时间线

### 3.2 设计与信息呈现

- [ ] 文件夹样式图标（非 emoji）
- [ ] Work 层级：01–03 证据 + Experiments 已有；可再加「更多作品 →」
- [ ] Quote 区观点是否与 About 合并成「观点区」——待主次决策
- [ ] 服务/描述区与正文对比度是否抬升——小改，不阻塞 P0

### 3.3 时钟 /「站还活着」

**决策结论（参阅倾向）**：
- [x] 页脚静态版权年（已有 JS 自动年份）
- [ ] 增加 **「最近更新：YYYY-MM」** 静态文本（优先）
- [ ] Now 区强化：「正在做 XX，可接 XX」
- [ ] 实时时钟：**可选、不抢戏** —— 页脚角落等宽小字；非功能必做
- [ ] 不要让时钟成为主视觉

### 3.4 首页定位（三选一或主次）

需人工拍板：
- [ ] 主打 **展示作品** → Work 更精、阅读深度
- [ ] 主打 **表达观点** → Quote + Services + About 成一条线
- [ ] 主打 **接单转化** → CTA 提前、Now 写工作方式

---

## 4. 受众画像（文案与 Case Study 写给谁看）

### 4.1 独立开发者 / 战友型

关心：舒适区与技能树、Demo Reel 第一屏、SFX 是否主业、游戏感与引擎限制、工作流能否对接穷鬼引擎、合作模式、是否好合作。  
→ 板块：Reel、Role 表、Wwise 证据、命名与交付、Brief 案例。

### 4.2 大厂（HoYoverse 类）音乐/音效面试官

额外关心：专业深度、生产能力、协作、审美稳定；  
分栏 Music / Sound Design / Interactive Audio；  
交互实机演示；工业化拆解；全球审美融合；命名强迫症；AI 边界诚实。  
→ 板块：分栏导航、层解图、Cultural Studies、规格与 AI 标注。

---

## 5. 建议执行顺序（给 Agent 的默认 Sprint）

**Sprint A — 规范（1 个会话内可完成）**  
1. 文件夹与命名规范 md（可进仓库 `docs/`）  
2. 技术规格文案模板  
3. Case Study HTML/CSS 模板骨架  

**Sprint B — 首页钩子（等素材则只做壳）**  
1. Showreel 区块壳（缺片则 `display` 占位）  
2. 迷你播放器（先接 1 条已有 OST）  
3. 三层交互模块（先 UI+状态机，音频 stub）  

**Sprint C — 证据填充（作者供料）**  
1. Wwise 截图/录屏挂进 `03-wwise`  
2. Rescore AB 一条  
3. 一个完整 Case Study（建议 GameJam 或 BKEQ）  

**Sprint D — 观点与文化**  
1. Cultural Studies 一文  
2. 工作流优化栏  
3. About / Tech Stack  

**Sprint E — 收尾**  
1. 最近更新日期  
2. 全站可访问性与弱网  
3. 非音频朋友试用与文案收敛  

---

## 6. 明确非目标（避免 Agent 跑偏）

- 不要把首页重新做成 11 卡能力目录  
- 不要自动播放有声视频  
- 不要虚构团队人数 / 战绩数据（无数据就写过程与定性结果）  
- 不要在未获授权时用他人游戏原声做「官方作品」展示；Rescore 须标明学习/重构性质  
- 视觉：保持现有米白/橄榄/青柠与 bento 证据卡语言，不推翻  

---

## 7. 相关文件（站点）

| 路径 | 用途 |
|------|------|
| `index.html` | 首页（Work 证据层、Experiments、Hero） |
| `shared/subpage.css` | 子页公共版式 |
| `01-ost/01-ost.html` | 音乐播放器（较完整） |
| `02-bkeq/02-bkeq.html` | 插件页（需去占位视频） |
| `03-wwise/03-wwise.html` | Wwise 笔记（需加强工程证据） |
| `04-hsr/04-hsr-1.html` | Music Analysis（已弱化复刻叙事） |
| `05/05.html` | 声音设计空壳 |
| `06-research&writing/06-rw.html` | 写作 / 未来 Journal |
| `个人简历.pdf` | 简历 |
| `00-index_images/` | og、二维码等 |
| `docs/`（本文件） | Agent 操作说明 |
