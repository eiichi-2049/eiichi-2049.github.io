# 技术规格文案模板（页面可贴）

> 填空后可放进子页「技术规格」、Package `05-meta/SPEC.md`，或 Case Study 折叠面板。

---

## 全局默认（个人站承诺值——按你习惯改数字，改完保持全站一致）

| 项 | 值 | 说明 |
|----|-----|------|
| 采样率 | **48 kHz** | 游戏内交付默认；立体声 |
| 位深 | **24 bit** | 母版与交付 WAV |
| 文件命名 | 见 `NAMING_AND_PACKAGE.md` | 无 Final/真实/最终版 |
| 流媒体参考 | **-16 LUFS** | 网页试听/分发 |
| 游戏线参考 | **-18 ～ -14 LUFS** | 按引擎与项目真值填，例如统一 -16 + Peak -1 dBTP |
| 真峰 | **≤ -1.0 dBTP** | 防削波 |
| Stems 命名 | `{Project}_…_STEM_{Layer}_v…` | 与规范一致 |

---

## Case Study 内可展开的「规格条」

```text
Pipeline:  REAPER → (Wwise 6.2) → Unity
Delivery:  WAV 48 kHz / 24 bit stems + AAC preview
Loudness:  -16 LUFS integrated (preview bus)
Naming:    ProjectName_Music_Area1_Day_Loop_v1.0
AI:        无 AI 生成音频；界面截图中的文字为人工标注
```

---

## AI / 素材声明（诚实模板）

```text
- 乐器与合成：均实录/MIDI 编程，未使用生成式 AI 音频
- 若使用 AI：说明用途（如氛围垫音草稿）、后续人工处理（压缩/ EQ / 重录）
- 第三方采样/音源：列出库名与授权类型
- 非本人 IP 的 Rescore / Analysis：标注「学习与研究用途，版权归原作方」
```

---

## 交付物类型对照

| 给谁 | 交什么 |
|------|--------|
| 独立开发（拖拽） | 分段/循环点清晰的 WAV 或高质量 MP3 |
| 有 Wwise/FMOD | 工程 + 事件命名规范 + 测试包 |
| 只交音乐 | Loop + Stinger + Stems + 参考混音 |
| 只交音效 | OneShot 包 + 命名表 + 音量阶梯说明 |

---

## 页面 UI 建议

用等宽小字一行，例如：

`48 kHz · 24 bit · −16 LUFS · stems on request · naming v1`
