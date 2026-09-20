#!/usr/bin/env node
// Validates data/interests/*.json against the LearnFeed schema (see PIPELINE.md).
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'data', 'interests');
const index = JSON.parse(fs.readFileSync(path.join(dir, '..', 'index.json'), 'utf8'));
let problems = 0;
const warn = (f, m) => { console.log(`  ${f}: ${m}`); problems++; };
const isUrl = u => typeof u === 'string' && /^https?:\/\//.test(u);
for (const meta of index.interests) {
  const f = meta.id + '.json';
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { warn(f, 'MISSING FILE'); continue; }
  let d; try { d = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { warn(f, 'invalid JSON: ' + e.message); continue; }
  if (d.id !== meta.id) warn(f, `id mismatch (${d.id})`);
  const books = d.books || [], leaders = d.leaders || [], pubs = d.publications || [], chapters = d.chapters || [];
  if (books.length !== 30) warn(f, `books=${books.length} (want 30)`);
  if (leaders.length !== 10) warn(f, `leaders=${leaders.length} (want 10)`);
  if (pubs.length !== 5) warn(f, `publications=${pubs.length} (want 5)`);
  if (chapters.length < 6) warn(f, `chapters=${chapters.length} (want >=6)`);
  const ids = new Set();
  books.forEach(b => { if (!b.id || !b.title || !b.author || !b.why_he) warn(f, `book incomplete: ${b.title}`); if (ids.has(b.id)) warn(f, `dup book id ${b.id}`); ids.add(b.id); });
  leaders.forEach(L => {
    if (!L.id || !L.name || !L.role_he) warn(f, `leader incomplete: ${L.name}`);
    const vids = L.videos || [];
    if (vids.length < 2) warn(f, `leader ${L.name}: videos=${vids.length}`);
    vids.forEach(v => {
      if (!/^[A-Za-z0-9_-]{11}$/.test(v.youtube_id || '')) warn(f, `bad youtube_id for ${L.name}: ${v.youtube_id}`);
      if (!isUrl(v.source_url) || !v.source_url.includes(v.youtube_id)) warn(f, `source_url does not carry id for ${L.name}: ${v.source_url}`);
      if (!v.title) warn(f, `video without title for ${L.name}`);
    });
  });
  pubs.forEach(P => {
    if (!P.id || !P.name || !isUrl(P.url)) warn(f, `publication incomplete: ${P.name}`);
    const arts = P.articles || [];
    if (arts.length < 2) warn(f, `publication ${P.name}: articles=${arts.length}`);
    arts.forEach(a => { if (!a.title || !isUrl(a.url)) warn(f, `article incomplete in ${P.name}: ${a.title}`); });
  });
  chapters.forEach(c => {
    if (!ids.has(c.book_id)) warn(f, `chapter for unknown book ${c.book_id}`);
    if (!c.idea_he || !c.body_he || !(c.points_he || []).length) warn(f, `chapter incomplete for ${c.book_id}`);
    if (!(c.sources || []).some(isUrl)) warn(f, `chapter without sources for ${c.book_id}`);
  });
  console.log(`${f}: books=${books.length} leaders=${leaders.length} videos=${leaders.reduce((n, L) => n + (L.videos || []).length, 0)} pubs=${pubs.length} articles=${pubs.reduce((n, P) => n + (P.articles || []).length, 0)} chapters=${chapters.length}`);
}
console.log(problems ? `\n${problems} problem(s)` : '\nall good');
process.exit(problems ? 1 : 0);
