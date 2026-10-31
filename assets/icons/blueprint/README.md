# Blueprint 16px 图标包 · 交接说明

日期：2026-10-31  
用途：ReiVerb Sound Atorie 站内的小装饰 / 功能性图标  
状态：本地已接入；主 README 不写图标来源（按需求）

## 来源与许可

- 图标集：Blueprint Icons（16px）
- 文档：https://blueprintjs.com/docs/#icons/icons-list
- 源目录：https://github.com/palantir/blueprint/tree/develop/resources/icons/16px
- 许可证：Apache-2.0，完整文本见本目录 `LICENSE`
- 这是本目录的归属记录；**没有**往仓库根 README 添加来源说明。

## 已保存的图标

文件都在 `assets/icons/blueprint/`，类名在 `assets/css/icons.css`。

### 当前已使用

| 图标 | 类名 | 位置 |
| --- | --- | --- |
| music | `bp-music` | 首页 01 Game Audio Production；01 页 eyebrow |
| console | `bp-console` | 首页 02 Technical Implementation；03 页 eyebrow |
| chart | `bp-chart` | 首页 03 Research & Tools；04 页 eyebrow |
| comparison | `bp-comparison` | 02 页 eyebrow（BKEQ A/B） |
| microphone | `bp-microphone` | 05 页 eyebrow（Sound Design） |
| manual | `bp-manual` | 06 页 eyebrow（Research & Writing） |
| headset | `bp-headset` | 07 页 eyebrow（Game Jam） |

### 预留给后续功能

| 分组 | 文件 / 类名 |
| --- | --- |
| 播放与音量 | `play` / `pause` / `stop` / `volume-up` / `volume-down` / `volume-off` |
| 循环与随机 | `repeat` / `random` |
| 三层声音 | `layers` / `layer` |
| 技术实现 | `code` / `application` / `cog` / `wrench` / `build` |
| 研究与写作 | `timeline-events` / `timeline-line-chart` / `graph` / `book` / `citation` / `annotation` / `edit` / `document` |
| 链接与操作 | `download` / `envelope` / `link` / `arrow-top-right` / `search` / `filter` |
| 其他 | `lightbulb` |

## 用法

首页在 `</style>` 之后引入：

```html
<link rel="stylesheet" href="assets/css/icons.css" />
```

子页在 `subpage.css` 之后引入：

```html
<link rel="stylesheet" href="../../assets/css/icons.css" />
```

装饰图标：

```html
<i class="bp-icon bp-music" aria-hidden="true"></i>
```

- 基础尺寸固定 12px；建议 12–14px，不要超过 16px。
- 颜色继承 `currentColor`；当前装饰图标由 `.work-group-zh .bp-icon` / `.project-eyebrow .bp-icon` 统一为 `--accent` + 80% 不透明度。
- 纯装饰加 `aria-hidden="true"`；功能性按钮必须另有可读 label。
- 一个区块只放一颗；不要每个 Work 行都放，不要放进导航/页脚（页脚已有终端打字机）。

## 新增图标

1. 从上面的 Blueprint 16px 源目录下载 SVG 到本目录。
2. 在 `assets/css/icons.css` 末尾加一行：

```css
.bp-foo { --bp-glyph: url("../icons/blueprint/foo.svg"); }
```

3. 页面里用 `<i class="bp-icon bp-foo" aria-hidden="true"></i>`。
4. 如果用于功能按钮，补 `aria-label` 或可见文字。

## 版权注意

- 保留本目录的 `LICENSE` 和本说明，不要删除。
- 图标来自 Blueprint（Apache-2.0）；不要把它说成原创图标。
- 不要将图标文件用于与 Blueprint 无关的商标/品牌主张。
