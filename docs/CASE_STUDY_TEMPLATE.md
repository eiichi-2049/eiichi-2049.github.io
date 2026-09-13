# Case Study 模板（内容结构）

对应站点组件：`shared/case-study.css` + `shared/case-study.html`。

每个项目一页（或首页延伸页）。**禁止编造团队人数与数据。**

---

## 0. 元数据（页眉下方，等宽小字）

| 字段 | 示例 | 必填 |
|------|------|------|
| Role | Sound Designer / Audio Implementer | ✅ |
| Responsibilities | Combat SFX / Character / UI / Ambience | ✅ |
| Team | 8 people | 有真实数据再填 |
| Engine / MW | Unity + Wwise | ✅ |
| Delivery | WAV 48k/24b + Wwise project | 可选 |
| Link | Demo / itch.io / 内部构建 | 可选 |

---

## 1. 钩子（问题）

1 句，具体痛点，不要「提升沉浸感」空话。

例：  
Beta 反馈「打击感软」。玩家在重击前摇有约 0.3s 无意识屏息——问题不在音量，在频段时机。

---

## 2. 画面钩子

- 15s **静音**循环游戏画面（poster + webm/mp4）  
- 或一句「推荐戴耳机」提示 + 迷你播放器  

---

## 3. 方案（怎么做）

分 2–4 短条，每条：**判断 → 手段 → 结果类型**

例：  
- 判断：前摇是注意力真空 → 手段：环境高频 -3 dB，极弱 50 Hz 呼吸铺垫 → 命中瞬时全频释放  

配套：

- 层分解（Ambience / SFX / Music）  
- 若交互音频：事件名、RTPC、Bus 截图或 GIF  

---

## 4. 结果

优先证据：

1. AB 听感切换（Original vs Yours）  
2. 可量化数据（仅当真实）：重击使用率 +22%、内存 300→80 MB  
3. 定性：策划一次对话、程序一次实现修改  

---

## 5. 灰底：最后悔没做到的

1 句短板 + 1 句改进。诚实 > 吹嘘。

例：  
最后悔：没在立项时就把 UI 与战斗 SFX 共用压缩器，后期被迫分轨重混。  
改进：接入前先交一页「总线草图」当合同附件。

---

## 6. 协作片段（可选）

```
Designer Request: 「角色要轻盈但有攻击性」
Direction: Organic + Metallic · Avoid heavy low-end · Emphasize transient
Result: …
```

---

## 7. 技术规格条

从 `TECH_SPECS.md` 摘本项目实际值。

---

## 8. 深度折叠（可选）

- 频谱 / 分层图  
- 拟音源与效果链  
- AI 使用说明  

---

## 写作约束

- 中文为主，专有名词可英文  
- Rescore / Analysis：标题下角标「学习研究」  
- 无数据 → 只写过程与听感，不写百分比  
