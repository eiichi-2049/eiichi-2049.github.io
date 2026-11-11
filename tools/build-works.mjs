#!/usr/bin/env node
/**
 * 作品目录与履历生成器
 * ─────────────────────────────────────────────────────────────
 * 数据源：data/works.json
 * 产物：  index.html 里 <!-- BEGIN:works --> … <!-- END:works -->
 *                    <!-- BEGIN:timeline --> … <!-- END:timeline -->
 *
 * 用法：
 *   node tools/build-works.mjs            # 写入
 *   node tools/build-works.mjs --check    # 只校验，不改文件（有差异则退出码 1）
 *
 * 为什么是构建期生成而不是运行时渲染：
 *   作品目录是页面最核心的证据，必须在没有 JS 的情况下也能被读到
 *   （爬虫、禁用脚本的访客、阅读模式）。运行时注入会让首屏内容晚一拍，
 *   还会引入一次 fetch 失败的可能。构建期生成同时满足单源与稳健。
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DATA = resolve(ROOT, 'data/works.json');
const PAGE = resolve(ROOT, 'index.html');

const STROKE = 'rgba(1,2,5,.22)';
const CHECK = process.argv.includes('--check');

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

/* ── 读取与校验 ─────────────────────────────────────────────── */

const data = JSON.parse(readFileSync(DATA, 'utf8'));
const works = data.works ?? [];
const groups = data.groups ?? [];
const timeline = data.timeline ?? [];

if (!groups.length) fail('works.json 里没有 groups');
if (!works.length) fail('works.json 里没有 works');

const ids = new Set();
for (const w of works) {
  for (const key of ['id', 'title', 'cardTitle', 'href', 'mono', 'mark', 'meta', 'year']) {
    if (!w[key]) fail(`作品 ${w.id ?? '(无 id)'} 缺少字段 ${key}`);
  }
  if (ids.has(w.id)) fail(`作品 id 重复：${w.id}`);
  ids.add(w.id);

  const target = resolve(ROOT, w.href.replace(/^\.\//, ''));
  if (!existsSync(target)) fail(`作品 ${w.id} 的链接目标不存在：${w.href}`);
}

const byId = new Map(works.map((w) => [w.id, w]));

for (const g of groups) {
  for (const key of ['num', 'title', 'zh', 'icon']) {
    if (!g[key]) fail(`分组 ${g.num ?? '(无编号)'} 缺少字段 ${key}`);
  }
  if (!Array.isArray(g.items) || !g.items.length) fail(`分组 ${g.num} 没有条目`);
  for (const id of g.items) {
    if (!byId.has(id)) fail(`分组 ${g.num} 引用了不存在的作品：${id}`);
  }
}

const grouped = new Set(groups.flatMap((g) => g.items));
for (const id of ids) {
  if (!grouped.has(id)) console.warn(`! 作品 ${id} 未出现在任何分组里（不会渲染）`);
}

/* ── 渲染 ───────────────────────────────────────────────────── */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderCard(w, i, groupItems) {
  const firstHidden = groupItems.findIndex((x) => byId.get(x).hidden);
  const attrs = [];
  if (w.spring && !w.hidden) attrs.push('data-spring');
  attrs.push(`data-sq-stroke="${STROKE}"`);
  attrs.push(`class="work-subrow apple-squircle${w.wide ? ' work-card--wide' : ''}"`);
  attrs.push(`href="${w.href}"`);
  if (w.hidden) attrs.push('style="display:none"');

  const lines = [];
  if (w.hidden && i === firstHidden) {
    lines.push('');
    lines.push(`            <!-- ${esc(w.hiddenNote ?? '内容未就位，先不上菜单。')} -->`);
  }
  lines.push(`            <a ${attrs.join(' ')}>`);
  lines.push(`              <span class="work-card-media" aria-hidden="true"><span class="work-card-mono">${esc(w.mono)}</span>`);
  lines.push(`                <span class="work-card-mark">${esc(w.mark)}</span></span>`);
  lines.push('              <span class="work-card-body">');
  lines.push(`                <span class="work-subrow-title">${esc(w.cardTitle)}</span>`);
  lines.push(`                <span class="work-subrow-meta">${esc(w.meta)}</span>`);
  lines.push('              </span>');
  lines.push(`              <span class="work-card-foot"><span class="work-subrow-year">${esc(w.year)}</span></span>`);
  lines.push('            </a>');
  return lines.join('\n');
}

function renderGroups() {
  return groups
    .map((g) => {
      const cards = g.items
        .map((id, i) => renderCard(byId.get(id), i, g.items))
        .join('\n');
      return [
        '        <section class="work-group reveal">',
        '          <div class="work-group-head">',
        `            <span class="work-group-num">${esc(g.num)}</span>`,
        `            <h3 class="work-group-title"><i class="bp-icon ${esc(g.icon)}" aria-hidden="true"></i>${esc(g.title)}</h3>`,
        `            <span class="work-group-zh">${esc(g.zh)}</span>`,
        '          </div>',
        '          <div class="work-group-list">',
        cards,
        '          </div>',
        '        </section>',
      ].join('\n');
    })
    .join('\n\n');
}

function renderTimeline() {
  return timeline
    .map((y) => {
      const items = y.items
        .map((it) => {
          const title = it.titleEm
            ? `${esc(it.title)} <em>${esc(it.titleEm)}</em>`
            : esc(it.title);
          return [
            '          <li class="tl-item">',
            `            <span class="tl-type">${esc(it.type)}</span>`,
            `            <span class="tl-title">${title}</span>`,
            `            <span class="tl-stack">${esc(it.stack)}</span>`,
            `            <span class="tl-result">${esc(it.result)}</span>`,
            '          </li>',
          ].join('\n');
        })
        .join('\n');
      return [
        '      <div class="tl-year reveal">',
        `        <div class="tl-year-num">${esc(y.year)}</div>`,
        '        <ul class="tl-list">',
        items,
        '        </ul>',
        '      </div>',
      ].join('\n');
    })
    .join('\n\n');
}

/* ── 写回 ───────────────────────────────────────────────────── */

const MARK_WORK = 'works';
const MARK_TL = 'timeline';

function replaceBlock(html, name, body) {
  const re = new RegExp(
    `(<!-- BEGIN:${name}[^>]*-->\\n)([\\s\\S]*?)(\\n[ \\t]*<!-- END:${name}[^>]*-->)`
  );
  if (!re.test(html)) fail(`index.html 里找不到 ${name} 的 BEGIN/END 标记`);
  return html.replace(re, (_m, open, _old, close) => `${open}${body}${close}`);
}

let raw = readFileSync(PAGE, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';

// 内部统一用 LF 处理，写回时再恢复原文件的换行符（避免整页 diff）
let html = raw.replace(/\r\n/g, '\n');

html = replaceBlock(html, MARK_WORK, renderGroups());
html = replaceBlock(html, MARK_TL, renderTimeline());

const out = html.replace(/\n/g, eol);
const changed = out !== raw;

if (CHECK) {
  if (changed) {
    console.error('✗ 产物与数据不一致：请运行 node tools/build-works.mjs');
    process.exit(1);
  }
  console.log(`✓ 产物一致（${groups.length} 组 / ${works.length} 条作品 / ${timeline.length} 个年份）`);
  process.exit(0);
}

if (!changed) {
  console.log('✓ 无变化，index.html 未改动');
  process.exit(0);
}

writeFileSync(PAGE, out, 'utf8');
console.log(`✓ 已写入 index.html（${groups.length} 组 / ${works.length} 条作品 / ${timeline.length} 个年份）`);
