# 模块清单（Module Inventory）

> 站点根目录：仓库根（`index.html` 所在目录）
> 建立：2026-11-03 · 依据 Fictive Kin《Web Systems》七层结构中的「模块层 + 传承层」
> **用途**：任何接手的人（或 AI）先看这一页，再动手。它回答两个问题：**这东西在哪、能不能再写一份**。
> 状态说明：`published` 线上可见 ｜ `hidden` 有代码但未上线 ｜ `draft` 内容未完成

---

## 0. 快速定位（先查这张表，再搜代码）

| 你想改什么 | 改哪里 |
|---|---|
| **作品目录的年份显示** | `index.html` 里每条 `.work-subrow` 的**最后一个 span**：`<span class="work-subrow-year">2026</span>`；样式在同文件 `<style>` 的 `.work-subrow-year,.work-subrow-status{…}` |
| 作品目录加一张卡 | `index.html` → 对应 `.work-group-list` 内复制一张 `<a class="work-subrow apple-squircle sq-ring">`，四件套：`work-card-media`（mono + mark）/ `work-card-body`（title + meta）/ `work-card-foot`（year）；分组只有一条时加 `work-card--wide` |
| 某条作品暂时下架 | 给该 `<a class="work-subrow">` 加 `style="display:none"`（01-music、05-sound-design 就是这么藏的） |
| 履历加一条 | `index.html` → 对应 `.tl-year` 内加一个 `<li class="tl-item">`（type / title / stack / result 四字段） |
| 导航加一项 | 首页改 `index.html` 的 `.nav-links`；子页改各自同名结构；**样式只改 `assets/css/nav.css`** |
| 换主题色 | `index.html` 的 `:root --accent` + `assets/css/subpage.css` 的 `:root:root --accent`（**共 10 处副本，见 §技术债**） |
| 首页页脚文字/时钟 | `index.html` → `.foot`（`.foot-meta` / `.foot-clock` / `.foot-brand`） |
| 子页页脚 | 各子页 `.footer-sub`（样式在 `subpage.css`） |
| 三层体验开关 | `index.html` → `<section class="sec" id="stage" hidden>` 删掉 `hidden` |
| **卡片圆角/形状** | 给元素加 `class="apple-squircle"`；半径用 `--squircle-radius`，描边加 `.sq-ring`，投影加 `.sq-lift`（详见 §8.1） |
| 调整某个卡片的圆角大小 | 在该组件 CSS 里写 `--squircle-radius: 12px`，不要去改 `squircle.js` |

---

## 1. 导航 Navigation

| 项 | 内容 |
|---|---|
| **位置** | 首页：`index.html` `<header class="nav">`；子页：各自 `nav.css` 引用的同结构标记 |
| **唯一实现** | 样式：首页内联 `.nav*` 规则；子页 `assets/css/nav.css`（`body .nav` 提高特异性接管）。标记：**8 份复制**（首页 + 7 子页），非组件化 |
| **变体** | ①首页锚点（`#work` `#timeline` `#contact`）②子页锚点（`../../index.html#…`）③移动端 ≤820px 汉堡下拉（`.nav-links.open`） |
| **禁止复制项** | 不要再往子页写内联 `.nav` CSS（2026-10-31 已清掉 1490 行）；不要在 `nav.css` 用 `!important`；不要单独改某页 `--nav-h`（96px 全站共用） |
| **状态** | published |
| **无障碍验收** | 汉堡按钮 `aria-controls` + `aria-expanded`；`:focus-visible` 2px 外框；移动端菜单项整行可点（≥44px） |
| **性能约束** | 纯 CSS，无网络请求；依赖字体已 preload，不得引入第三方字体/CDN |

---

## 2. 首屏 Hero

| 项 | 内容 |
|---|---|
| **位置** | `index.html` → `.hero` > `.hero-in` > 眉标 `.eyebrow` + `<h1 class="hero h1">`（三行字标） |
| **唯一实现** | `index.html` 内联 CSS `.hero*`；仅此一处 |
| **变体** | 只有一种（纯文字，无图无视频） |
| **禁止复制项** | 不要在子页复制 `.hero`；不要在 h1 里追加副标题句（定位句在 `<meta description>` 与 `.stage-hint`） |
| **状态** | published |
| **无障碍验收** | 全站唯一 `<h1>`；`em` 仅承担样式，不改语义；无背景图，无对比度风险 |
| **性能约束** | 零请求（纯文字 + 系统/自托管字体） |

---

## 3. 作品目录 Work Index

| 项 | 内容 |
|---|---|
| **位置** | `index.html` → `#work` → `.work-groups` → 三组 `.work-group`（01 Game Audio Production / 02 Technical Implementation / 03 Research & Tools） |
| **结构** | `.work-group-head`（`-num` / `-title` / `-zh`）+ `.work-group-list`（网格）> 若干 `.work-subrow.apple-squircle.sq-ring` 卡片，每张卡三件套：`.work-card-media`（`.work-card-mono` 字母水印 + `.work-card-mark` 标签）/ `.work-card-body`（`-title` / `-meta`）/ `.work-card-foot`（`-year`） |
| **唯一实现** | **硬编码在 `index.html`**。`data/works.json` 只有 1 条 draft、**全站零引用**——别以为页面是它渲染的 |
| **变体** | ①普通卡（1/3 宽）②宽卡 `.work-card--wide`（占满整行，横向排版；分组只有 1 条时用）③隐藏卡（`style="display:none"`）；分组固定 3 组 |
| **禁止复制项** | 不要在子页复制 `.work-*` 样式；**不要重建 `.work-subgroup*` / `.work-toggle*`**（10-31 已删除）；**不要给卡片加 `border-radius`**（形状由 squircle 决定，见 §8.1） |
| **状态** | published（可见 5 张 / 隐藏 2 张：01-music、05-sound-design） |
| **悬停/按压** | 由 `assets/js/spring-hover.js` 的**阻尼谐振子**驱动（ζ=0.8、response=0.42s），不是 CSS 过渡：上浮 6px + 缩放 1.018，阴影随位移进度从 `0 2px 4px .045` 插值到 `0 14px 28px .13`；带指针速度注入与过冲回弹。参数可用 `data-spring-*` 逐元素覆盖（详见 §8.2） |
| **无障碍验收** | 整卡是 `<a>`，键盘可达；**clip-path 会裁掉 outline，所以聚焦态用 `.work-subrow:focus-visible` 的内侧 2px 描边**；链接文本即标题，无需 `aria-label`；水印 `aria-hidden`；隐藏卡 `display:none` 不进读屏序列 |
| **性能约束** | 零请求（水印是文字，不是图片）；分组图标走 `assets/css/icons.css` 的 mask；每张卡的 squircle 路径由 `squircle.js` 生成，无额外网络开销 |

---

## 4. 履历 Timeline

| 项 | 内容 |
|---|---|
| **位置** | `index.html` → `#timeline` → `.tl-year`（年份）→ `.tl-list` > `.tl-item`（`.tl-type` / `.tl-title` / `.tl-stack` / `.tl-result`） |
| **唯一实现** | `index.html` 内联 |
| **变体** | 按年分组；单条 4 字段；`.tl-type` 为胶囊标签（Game Jam / Plugin / Analysis…） |
| **禁止复制项** | 不要与作品目录混用：目录回答"有哪些项目"，履历回答"能力跨度与节奏"；不要在同一条里堆两段以上 result |
| **状态** | published（2026 ×2、2025 ×1） |
| **无障碍验收** | 语义为 `ul/li`；纯展示，无交互元素；年份用 `tabular-nums` 保证对齐 |
| **性能约束** | 零请求 |

---

## 5. 三层体验 #stage（唯一 Showstopper）

| 项 | 内容 |
|---|---|
| **位置** | `index.html` → `<section class="sec" id="stage" hidden>` |
| **结构** | `.stage-video > video` ｜ `.stage-hint` ｜ `.stage-dots` > 3 × `.stage-dot[data-layer]` ｜ `.stage-status[aria-live]` ｜ `.stage-actions`（`.stage-reset` + `.stage-mute`）｜ `details.stage-tech` ｜ 3 × `<audio data-layer>` |
| **唯一实现** | `index.html` 内联 CSS `.stage-*` + 内联 JS「分层演示状态机」（`[data-hook="stage"]`）。**`assets/js/home-hooks.js` 已删除，不要复活** |
| **变体** | 三层（ambience / sfx / music）；交互层与音乐层当前 `disabled`；每点三态（未激活 / `aria-pressed` / `data-done`） |
| **禁止复制项** | 不要写第二份状态机；不要自动出声（必须用户手势）；不要删 `prefers-reduced-motion` 分支；不要把遮罩改成无条件显示（无 JS 时会盖住 poster） |
| **状态** | **hidden**（等环境层音轨；进度见 `stage-module-todo.md`） |
| **无障碍验收** | `role="group"` + `aria-pressed` + `aria-live="polite"` + 原生 `<button>`；禁用态有文字说明；无 JS 有 `<noscript>`；`details` 原生可展开 |
| **性能约束** | 视频 2.28MB mp4 / 2.80MB webm + poster 60KB，`preload="metadata"`；hidden 时不下载；音轨上线后单条 ≤1.5MB、mp3 192k |

---

## 6. 联系表单 Contact

| 项 | 内容 |
|---|---|
| **位置** | `index.html` → `#contact` → `.contact-body` → 左：`.mail-form#foot-form`（`.mail-fields` / `.mail-agree` / `.mail-status` / `.mail-actions`）；右：`.contact-direct`（邮箱 / 飞书 / 简历 / 社媒） |
| **唯一实现** | `index.html` 内联 JS：「询盘表单」（校验 + 拼 mailto） |
| **变体** | 合作事项三选一（创作邀约 / 商务合作 / 其他）；来源值：`home`、`xingzhicai`、`wwise-101`、`music-analysis`、`bkeq`、`research-writing`（隐藏页另有 `original-soundtracks`、`sound-design`） |
| **禁止复制项** | 不要改成后端提交（当前 mailto，本站不收不发，隐私条款据此写）；不要引入第三方埋点 |
| **状态** | published |
| **无障碍验收** | `label for` 全关联；状态区 `role="status" aria-live="polite"`；校验失败聚焦到出错字段；隐私协议为必勾 |
| **性能约束** | 零请求（mailto 唤起本地客户端） |

---

## 7. 页脚 Footer（两种实现，别混）

| 项 | 内容 |
|---|---|
| **位置** | 首页：`index.html` → `footer.foot`（`.foot-brand` + `.foot-type` 打字彩蛋 + `.foot-meta` + `.foot-clock`）<br>子页：各页 `.footer-sub`（一行版权） |
| **唯一实现** | 首页 = `index.html` 内联；子页 = `assets/css/subpage.css` 的 `.footer-sub` |
| **变体** | 大页脚（首页，含时钟与悬停打字）/ 细页脚（子页） |
| **禁止复制项** | 不要把 `.foot`（大页脚）搬进子页；`.foot-brand` 用的是 `background-clip:text`，**字号上限 5.8rem 是有原因的**（超过会切掉末字，见该规则上方注释），不要随手放大 |
| **状态** | published |
| **无障碍验收** | `.foot-brand` 是可聚焦 `<button>`，`aria-describedby` 指向 `.sr-only` 宣言；时钟 `aria-hidden="true"` |
| **性能约束** | 时钟每 30s 更新一次 DOM 文本，无网络请求；无第三方脚本 |

---

## 8. 子页模板 Subpage

| 项 | 内容 |
|---|---|
| **位置** | 公共版式 `assets/css/subpage.css`；每页页头 `.project-header`（`.page-back` / `.project-eyebrow` / `.project-title` / `.page-desc`） |
| **唯一实现** | `subpage.css`（版式、token、页脚）+ `nav.css`（导航）+ `icons.css`（图标）；页面只保留自己的内容样式 |
| **变体** | ①项目页（07 形之彩）②笔记页（03 Wwise）③分析页（04 PV 分析）④写作页（06，窗口式阅读器）⑤TBD 页（01、05） |
| **禁止复制项** | 不要在子页内联重复 `:root` token（**现存 9 份副本，是已知技术债**）；不要复制 `.nav` 样式；不要给单页写 `!important` 覆盖公共版式 |
| **状态** | 模板 published；内容：01/05 为 draft（已 `display:none` + `noindex`） |
| **无障碍验收** | `.page-back` 可聚焦；每页唯一 `<h1>`；禁用无障碍：无（子页无交互控件，除 06 的窗口阅读器） |
| **性能约束** | 字体子集 woff2 + preload；图片全 WebP；视频仅 07 页（2.3MB）与首页元数据引用 |

---

### 8.1 卡片形状：Squircle（2026-11-08 新增）

| 项 | 内容 |
|---|---|
| **位置** | `assets/css/squircle.css`（形状 / 描边 / 投影）+ `assets/js/squircle.js`（按元素尺寸生成路径） |
| **唯一实现** | 上述两个文件。**不要在单页里另写圆角逻辑** |
| **变体** | 默认 18px；`--squircle-radius` 调半径；`--squircle-curvature` 调曲率（4–5 接近苹果，越大越方） |
| **修饰类** | `.sq-ring` 描边（inset 阴影，替代 border）；`.sq-lift` / `.sq-lift--strong` 外投影 |
| **已应用** | 首页 `.stage-video` `.chain-box`；07 `.video-frame` `.case-figure`；03 `.media-block` `.wg-chain-box`；04 `.video-wrap` |
| **禁止复制项** | ①不要再给这些组件写 `border-radius`（与 clip 冲突，形状会被后写的圆角覆盖）②不要改回 SVG `objectBoundingBox` 方案（圆角会按宽高比拉扁）③描边不要用 `border`（矩形环被裁后有缺口） |
| **无障碍** | 纯装饰，不改语义、不影响键盘顺序 |
| **性能** | 每个元素一条 `clip-path: path()`；`ResizeObserver` 驱动重算，无网络请求 |
| **兜底** | 无 JS 或不支持 `path()` → 退回 `border-radius`，形状退化但不会出现直角 |
| **回滚** | 删掉类名即可；CSS/JS 留着不影响未使用它的元素 |

> **与视觉基线的冲突记录**：§0 基线写的是「hairline + 小圆角（2–14px）」，squircle 把卡片圆角改成 18px 连续曲率，**属于有意破例**。如果哪天要回到纯 hairline 语言，按上面「回滚」一行处理，并在 §11 记一笔。

---

### 8.2 Spring Hover（弹簧悬停）

| 项 | 内容 |
|---|---|
| **位置** | `assets/js/spring-hover.js`（物理 + 控制器）；形状仍由 §8.1 的 squircle 提供 |
| **唯一实现** | 上表文件。**不要再写第二套 hover 动画**，也不要用 CSS `transition` 叠在上面（会被逐帧写入覆盖/打架） |
| **启用方式** | 给元素加 `data-spring`；JS 启动后自动接管 `transform` 与 `filter` |
| **物理参数** | ζ=0.8、response=0.42s（ω₀=2π/0.42）；过冲 1.5%（理论值 exp(-πζ/√(1-ζ²))），约 350ms 到达最低点 |
| **逐元素覆盖** | `data-spring-zeta` / `data-spring-response` / `data-spring-lift`（px，负值=上浮）/ `data-spring-scale` / `data-spring-shadow="off"` |
| **已应用** | 首页 5 张作品卡；07 `.video-frame`（shadow off，因内含播放中的 video）与 `.case-figure`；03 `.media-block`；04 `.video-wrap` ×4 |
| **禁止复制项** | ①不要给 `[data-spring]` 或 `.apple-squircle` 加 `transition: filter`——会让逐帧阴影滞后，表现为"发闷、跟不上手"（2026-11-09 踩过）②不要在 rAF 里读布局属性 ③不要给 `display:none` 的元素挂 `data-spring`（白跑） |
| **技术选择** | 用**解析解**积分阻尼振子（闭式），不用数值积分：半隐式欧拉在 ω₀h≈0.06 时吃掉约 30% 过冲（1.51%→1.09%），弹性被算法磨平 |
| **无障碍** | `prefers-reduced-motion: reduce` 下完全不启动；触摸设备忽略 hover；键盘聚焦只在 `:focus-visible` 时抬升，避免触摸点按后卡住 |
| **性能** | 单 rAF 循环、静止即停机；只写 `transform`/`filter`，不读写布局；`will-change` 仅在动画期间挂载 |
| **回退** | JS 未加载时，`html:not(.spring-js)` 分支给 `.work-subrow` 保留一段 CSS 过渡，形状与位移仍在，只是没有弹簧手感 |

---

## 9. 模块分级（对照手册）

| 级别 | 本模块 | 说明 |
|---|---|---|
| **Workhorse**（应平庸） | 导航、首屏、作品目录、页脚、子页模板 | 用互联网通用结构，**不要在它们身上追求独创**（"unique is another kind of brittle"） |
| **High-touch** | 履历、联系表单 | 形式跟随内容：年表按稀疏条目排，表单按接单判断裁剪字段 |
| **Showstopper** | `#stage` 三层体验 | **全站只允许 1 个**；在音频到位前不要再开第二个（Showreel 暂缓） |

### 9.1 香料许可（Spice License）

规则：个性只允许出现在**三类位置**——页脚、Grace Notes（引言、光标、页脚彩蛋）、子系统页。其余位置一律"老实说话"。

| 模块 | 许可 | 允许的位置 | 范例 |
|---|---|---|---|
| 首屏 / 作品目录 / 履历 | **仅限 Grace Note 与页脚** | 引言区、页脚 | 「音乐始于词尽之处」；页脚英文宣言（仅悬停出现） |
| 联系表单 | **禁止** | — | 只留字段、说明与隐私提示 |
| 子页模板（项目页 / 分析页 / 规格页） | **禁止** | — | 2026-11-03 已改写：02 规格页的 emoji 玩笑、04 分析页的口语结语 |
| 03-interactive（子系统） | **允许（自有语气）** | 章节名 + 章节注脚 | 章节名保留梗；注脚须含内容锚点 |
| 06-writing（子系统） | **允许（自有语气）** | 阅读器外观、文章标题 | 窗口式阅读器 |
| 页脚 | **允许** | 首页大页脚 | 打字机宣言、UTC+8 时钟 |

**注脚规则（2026-11-03 定）**：梗可以留半句，但每条至少要有**一个可读的内容锚点**。
反例：`逃げちゃダメだ…`（零信息量，导航失灵）→ 正例：`从零建工程、发第一个 Event——别逃`（梗留半句，锚点在"建工程/发 Event"）。
**纯缩写类梗不再保留**（如 `zdjd`），因为对非中文互联网读者等于噪音。

**CSS 伪元素里的 emoji 也算香料**：`content: "📖"` 这类写法在 HTML 里搜不到，扫页面时看不见，但会在每个实例上重复渲染（本次 03 的 18 个章节就重复了 18 次）。自检时除了扫 HTML，还要 `grep content:` 查一遍 `::before` / `::after`。

---

## 10. 已知技术债（不是本次要修的，但别当成正常）

1. **`data/works.json` 未接线**：只有 1 条 draft，页面仍是硬编码。新增项目 = 手改 `index.html`。
2. **token 有 10 份副本**：9 个页面各一份 `:root` + `subpage.css` 4 处 `:root`；换主题色要改 10 个地方。
3. **子页导航标记 8 份复制**：样式已收口到 `nav.css`，但标记仍是复制粘贴。
4. **`_m.txt` 类临时文件**：曾多次出现在工作区根目录，提交前先 `git status` 看一眼。

---

## 11. 变更记录

| 日期 | 变更 |
|---|---|
| 2026-11-03 | 建立本清单（含 8 类模块、香料许可、技术债） |
| 2026-11-03 | 增补 §9.1 香料许可；执行 D：02 规格页 emoji 玩笑改写、04 口语结语改写、03 十八条章节注脚改写（保语气 + 加内容锚点） |
| 2026-11-08 | 新增 §8.1 Squircle 组件；首页 / 07 / 03 / 04 的媒体与图卡改用连续曲率圆角（有意破例，见该节冲突记录） |
| 2026-11-08 | **作品目录卡片化**：行式目录 → 3 列卡片网格（宽卡 + 普通卡 + 字母水印），履历与联系保持原样；同步更新 §3 与快速定位表 |
| 2026-11-09 | 新增 §8.2 Spring Hover；作品卡与 07/03/04 的媒体卡改为阻尼谐振子驱动（ζ=0.8），删除 `squircle.css` 里会拖慢逐帧阴影的 `transition: filter` |
