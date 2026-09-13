# 音频命名与 Portfolio Package 规范

适用：交付物、站内自托管音频、给程序的 Stems。  
状态：规范稿（主站仓库可再拷一份到 `docs/`）。

---

## 1. 文件命名

### 1.1 通用格式

```
{Project}_{Domain}_{Section}_{Type}_{Variant}_v{MAJOR.MINOR}
```

| 段 | 含义 | 示例 |
|----|------|------|
| Project | 项目短名，Pascal/下划线 | `GameJam2026` `BKEQ` `Personal` |
| Domain | `Music` `SFX` `UI` `Ambience` `VO` `Foley` | `Combat` |
| Section | 场景/角色/界面 | `Dungeon` `Sword` `HUD` |
| Type | `Loop` `OneShot` `Stinger` `Bed` `UIClick` | `OneShot` |
| Variant | 可选 | `Dark` `Bright` `Alt` |
| v | 语义化，禁止 Final/真实 | `v1.0` `v1.2` |

**合法示例**

```
GameJam2026_Music_Combat_Loop_v1.0.wav
GameJam2026_SFX_Sword_Impact_OneShot_v2.1.wav
Personal_UI_ComboMeter_Click_OneShot_v1.0.wav
Personal_Ambience_Cave_Bed_Loop_v1.0.wav
```

**非法示例（直接拒收）**

```
最终版2.wav
Final_v2_真实.wav
aaa.wav
untitled(1).wav
```

### 1.2 大小写与分隔

- 字母数字用 `PascalCase` 或 `UPPER_SNAKE` 二者统一其一  
- 分隔符只用 `_`  
- 不用空格、中文标点、emoji  

### 1.3 Stem / 分轨

```
{Project}_{Domain}_{Section}_STEMS/
  {Project}_{Domain}_{Section}_STEM_{Layer}_v{X.Y}.wav
```

示例：`GameJam2026_Music_Boss_STEM_Perc_v1.0.wav`

### 1.4 发布用派生文件

与源文件同名，仅扩展名/容器不同：

```
GameJam2026_Music_Combat_Loop_v1.0.mp3
GameJam2026_Music_Combat_Loop_v1.0.ogg
```

禁止为派生文件另起「preview」「final」名。

---

## 2. Portfolio Package 目录规范

建议放在个人网盘或私有仓库；**公开站只挂 derive**，不挂 DAW 工程与原始多轨。

```
00-pkg/
  00-src/                 # 源工程、未压缩 WAV、会话
    {Project}/...
  01-derive/              # 网页与分发用
    {Project}/
      audio/
      img/
  02-showreel/
    master/               # 母版 mp4/mov
    web/                  # 发布用 mp4/webm
  03-ab/
    {Project}/
      original/
      rescore/
  04-wwise/
    screenshots/
    captures/
  05-meta/
    NAMING.md             # 可指向本规范
    SPEC.md               # 见 TECH_SPECS.md
    AI_DISCLOSURE.md      # AI 使用说明
    CREDITS.md
```

---

## 3. 与站点对应关系

| Package 路径 | 站点用途 |
|--------------|----------|
| `01-derive/**/audio` | 迷你播放器、Case Study 内嵌、AB 播放器 |
| `02-showreel/web` | 首页 Showreel |
| `04-wwise` | `03-wwise` 页证据图/录屏 |
| `05-meta` | 子页「技术规格」栏文案来源 |

站内自托管路径建议：

```
assets/audio/{Project}/...
assets/video/showreel/{Project}_Showreel_v1.0.mp4
```

（若沿用现有结构，可映射到 `01-ost/audio` 等，但**文件名仍须合规**。）

---

## 4. 版本递增

- 破坏混音/长度/用途 → `MAJOR+1`  
- 参数微调、不改长度结构 → `MINOR+1`  
- 历史版本可保留：`..._v1.0.wav` 与 `..._v1.1.wav` 并存，写进交付清单  

---

## 5. 交付清单模板（随包）

| 文件名 | 时长 | 格式 | 响度 | 备注 |
|--------|------|------|------|------|
| … | … | WAV 48k/24b | … | Loop 点已设 |

程序侧若只要 MP3：注明码率（如 256k）与是否保留 WAV 母版路径。
