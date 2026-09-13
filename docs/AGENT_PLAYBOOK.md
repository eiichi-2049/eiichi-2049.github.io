# AI Agent 操作手册 · ReiVerb Sound Atorie 作品集

配套：[`PORTFOLIO_TODO.md`](./PORTFOLIO_TODO.md)  
站点根目录：`E:\eiichi-2049.github.io\eiichi-2049.github.io`

---

## 1. 你是谁 / 任务是什么

你是一个接手该个人站的工程/产品型 Agent。用户是**游戏音频向**独立作者（配乐、音效、Wwise 集成、少量插件/分析）。

**总目标**：把站点从「能力目录 + 播放器」变成**可被招聘方在 3 分钟内信任的专业作品集**——能听、能看证据、能读懂方法论。

**用户可提供的东西（你无法凭空造）**：  
Showreel 成片、15s 静音游戏画面、三层音频、Wwise 工程截图/录屏、真实团队人数、可公开数据。  
缺料时：**做壳、做规范、写模板、修 bug**；禁止编造数字与经历。

---

## 2. 仓库与编辑规则

1. 主工作区：上述 `eiichi-2049.github.io` 根目录（有 `.git`）。
2. 大改首页信息架构时，若用户要求「先验收」，写到 `EI修改/`（或用户指定的草稿夹）再合并。
3. **不要**提交用户未要求的密钥、本地 `AI修改` 草稿除非点名。
4. 提交信息：中文短句，说明「为什么」；推送失败（网络）就保留本地 commit 并告知用户。
5. 样式：保持  
   - 纸色 `--paper` / 墨 `--ink` / 橄榄 `--olive` / 青柠 `--accent`  
   - 衬线标题 Fraunces + 等宽 DM Mono + OPPO Sans  
   - Selected Work bento + Experiments 卡片语言  
6. CSS：改「作品证据卡」类名时注意**选择器特异性**（`.b-text p`、`.b-eyebrow span` 会吞掉短类名）。
7. 动画：进场用 `translate` + `opacity`；若元素有 hover `transform`，transition 必须同时保留 `transform .25s, box-shadow .25s`。
8. 音频：必须用户手势后再播放；尊重 `prefers-reduced-motion`；不自动播有声。
9. 中文 UI 文案与品牌名：`ReiVerb Sound Atorie`；HSR 相关用 **Music Analysis / 学习型拆解**，避免「扒曲复刻」措辞。

---

## 3. 已完成（不要重做）

- [x] 首页 01–03 项目证据 + Experiments  
- [x] 六子页品牌/主题/页眉页脚统一 + `shared/subpage.css`  
- [x] HSR → Music Analysis 叙事  
- [x] Hero 字距与 Atorie 高光；阅读区系统光标  
- [x] `.exp-card` 进场动画；实验区移动端 padding 40px  
- [x] Work 证据卡 CSS 特异性修复（`.b-eyebrow .work-num` / `.b-text .work-role|tags`）  
- [x] 简历 PDF、微信/飞书二维码、og-cover、字体子集  

---

## 4. 当前站若「打开看」会缺什么

1. 首屏无法播放任何专业 Demo（无 Reel、无迷你播放器）。  
2. 无交互式分层音频体验。  
3. Wwise 等子页缺工程实证（截图/录屏）。  
4. 无统一 Case Study 元数据（Role/Team/Contribution）。  
5. 无 Portfolio Package / 命名 / LUFS 规范页。  
6. `05` 空壳；BKEQ 可能仍有占位 YouTube ID。  
7. 无「最近更新」类活性信号（可选时钟见 TODO P2）。

---

## 5. 优先级与「本回合做什么」

**每次只推进一个 Sprint（见 TODO §5）**，完成标准见 TODO 勾选项。  
默认顺序：**规范 → 首页钩子壳 → 素材填充 → 观点文化 → 收尾**。

若用户只说「继续改进」：  
1. 读 `PORTFOLIO_TODO.md` 找第一个未完成且**不依赖缺失素材**的项。  
2. 或问用户要素材（Showreel / Wwise 截图 / 三层音频）。

---

## 6. 页面级操作提示

### 6.1 `index.html`
- Work：只维护 3 张证据卡 + Experiments，不要加回 6+ 能力平铺。  
- 可加：Showreel 壳、迷你播放器、三层体验模块。  
- 导航锚点：`#top #work #now #contact`；新模块若要导航入口，同步改 nav。

### 6.2 `03-wwise/03-wwise.html`
- 优先补：工程图、事件树、短 GIF/MP4。  
- 技术叙述：Exploration→Combat、Layered、Intensity、RTPC。

### 6.3 `05/05.html`
- 当前近空壳；可按 Case Study 模板从零填，或暂在首页标注「TBD」避免空点。

### 6.4 `02-bkeq/02-bkeq.html`
- 去掉 `你的视频ID`；无真片就删 iframe 只留截图。

### 6.5 `04-hsr/04-hsr-1.html`
- 保持 Analysis 框架；补分层图/参数则更佳。

### 6.6 `06-research&writing/`
- 承接 Cultural Studies / Journal；md 内容可链入列表。

### 6.7 `shared/`
- `subpage.css`：子页公共头脚。  
- 新增 `case-study.css` 时在此扩展，勿每页复制粘贴。

---

## 7. 首页三层交互模块（实现草图）

```
[静音视频 loop]
[● 仅画面] [○ 环境] [○ 交互+BGM]  [重新体验]
说明：Ambience Bus · … / SFX · … / Music Bus · …
```

实现要点：
- `video`：`muted loop playsinline`，无声。  
- 点击第 n 个点：开启层 1..n（或自由 toggle，产品定）。  
- `AudioContext` 仅在 `pointerup` 后创建/resume。  
- 失败：显示「点击重试播放」+ `<a download>`。  
- 内联或 `audio/` 目录；命名遵守 Package 规范。

---

## 8. 验收清单（每次改动后自检）

- [ ] 本地用浏览器打开 `index.html`，控制台无新错误  
- [ ] 桌面 + ~390px 宽：布局不裂、按钮可点  
- [ ] 若有音频：点击才响；刷新后无自动播  
- [ ] 颜色/字体仍像原站；无未说明的第三方依赖  
- [ ] 未误改用户未要求的文案（尤其 CTA、版权、品牌名）  
- [ ] 需要用户的素材：在回复里列出缺失清单，不要空转造数  

---

## 9. 文案语气

- 专业、具体、可验证；少空话。  
- 第一人称「我」；避免营销腔堆砌。  
- 对外项目：标 Role / 团队 / 职责；无数据不编数据。  
- Rescore/分析：标明学习、研究、版权归属。

---

## 10. 沟通格式（对用户）

- 先说做了什么、改了哪个文件。  
- 再说卡在什么素材或决策。  
- 大事再问，小事做完汇报即可。  
- 不要一次开 10 个 P0；保持一个可验收增量。

---

## 11. 快速命令备忘

```powershell
# 站点根目录
cd E:\eiichi-2049.github.io\eiichi-2049.github.io
git status
git add <files>
git commit -m "简短中文说明"
git push origin main
```

网络推失败：保留 commit，告知用户手动 push。

---

## 12. 参考原始笔记

用户原始碎片（乱、未结构化）：  
`C:\Users\Eiichi\OneDrive\Desktop\mimo 参阅.txt`  

结构化结果：  
- `docs/PORTFOLIO_TODO.md`  
- 本手册  

原始 txt 若更新，以 txt 新增内容为准，回写 TODO 的对应勾选项。
