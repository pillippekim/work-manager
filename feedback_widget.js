/* =====================================================================
   feedback_widget.js — 개선 요청(의견 접수) 위젯  (2026-11-04 v2, 양 저장소 공통 파일)
   · auth_guard.js 가 로드하는 모든 페이지 상단 헤더(날짜/사용자 왼쪽)에 🎧 버튼 — 2026-11-04 v2: 우하단 떠 있는 버튼 → 헤더 고정(사용자 의견: 페이지 버튼 가림)
   · 답변이 새로 달리면 🎧 에 빨간 배지 숫자 → [내 요청] 열면 사라짐
   · 모달: [요청하기] 유형·내용·스크린샷(자동 축소 ≤1280px·JPEG) / [내 요청] 상태·회신 확인
   · 페이지명·사용자·출처(portal/field)는 자동 기록
   · 언어: localStorage.hkht_lang (ko/id/en, 현장 i18n 과 동일 키)
   · 의존: window.supabase (supabase-js v2). agClient() 있으면 재사용, 없으면 자체 생성
   ===================================================================== */
(function () {
  if (window.__fbWidgetLoaded) return;
  window.__fbWidgetLoaded = true;

  var SU = 'https://vpaixxlhzkwtgcllimvn.supabase.co';
  var SK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYWl4eGxoemt3dGdjbGxpbXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzk4NjMsImV4cCI6MjA5MTk1NTg2M30.V8Bj0cMbM0E2TFhklYYa7TM-vO6Fi70ctACA7uUf4Ig';
  var BUCKET = 'feedback-shots';
  var PAGE = (location.pathname.split('/').pop() || 'index.html');
  var SOURCE = location.pathname.indexOf('/project-moon/') !== -1 ? 'field' : 'portal';
  if (/^(login|change_password)\.html$/.test(PAGE)) return;

  // ── 다국어 ──
  var LANG = (function () { try { var l = localStorage.getItem('hkht_lang'); return (l === 'id' || l === 'en') ? l : 'ko'; } catch (e) { return 'ko'; } })();
  var T = {
    btn:        { ko: '문의·요청',           id: 'Bantuan',              en: 'Support' },
    title:      { ko: '💬 개선 요청 · 문의',  id: '💬 Saran / Laporan',   en: '💬 Feedback / Request' },
    tabNew:     { ko: '요청하기',            id: 'Kirim',                en: 'New' },
    tabMine:    { ko: '내 요청',             id: 'Laporan saya',         en: 'My requests' },
    page:       { ko: '화면',                id: 'Halaman',              en: 'Page' },
    category:   { ko: '유형',                id: 'Jenis',                en: 'Type' },
    catBug:     { ko: '오류 (안 됨·틀림)',    id: 'Error (tidak jalan/salah)', en: 'Bug (broken / wrong)' },
    catImprove: { ko: '개선 (이렇게 되면 좋겠다)', id: 'Saran perbaikan',   en: 'Improvement' },
    catAsk:     { ko: '문의 (사용법·질문)',   id: 'Pertanyaan',           en: 'Question' },
    content:    { ko: '내용',                id: 'Isi',                  en: 'Details' },
    contentPh:  { ko: '무엇이, 어느 화면에서, 어떻게 되어야 하는지 적어주세요.', id: 'Apa masalahnya, di halaman mana, seharusnya bagaimana.', en: 'What happened, on which screen, and what should happen.' },
    shot:       { ko: '스크린샷 (선택, 1장)', id: 'Screenshot (opsional, 1)', en: 'Screenshot (optional, 1)' },
    shotHint:   { ko: '자동으로 줄여서 올라갑니다', id: 'Otomatis diperkecil', en: 'Automatically resized' },
    submit:     { ko: '보내기',              id: 'Kirim',                en: 'Send' },
    sending:    { ko: '보내는 중...',        id: 'Mengirim...',          en: 'Sending...' },
    cancel:     { ko: '닫기',                id: 'Tutup',                en: 'Close' },
    needContent:{ ko: '내용을 입력해 주세요.', id: 'Isi dulu ya.',        en: 'Please enter details.' },
    done:       { ko: '접수되었습니다. 처리되면 [내 요청]에서 확인할 수 있어요.', id: 'Terkirim. Cek status di [Laporan saya].', en: 'Sent. Check status under [My requests].' },
    fail:       { ko: '전송 실패: ',         id: 'Gagal: ',              en: 'Failed: ' },
    noMine:     { ko: '아직 보낸 요청이 없어요.', id: 'Belum ada laporan.', en: 'No requests yet.' },
    reply:      { ko: '답변',                id: 'Jawaban',              en: 'Reply' },
    noReply:    { ko: '(아직 답변 없음)',     id: '(belum ada jawaban)',  en: '(no reply yet)' },
    tooBig:     { ko: '이미지가 너무 큽니다(2MB 초과).', id: 'Gambar terlalu besar (>2MB).', en: 'Image too large (>2MB).' },
    notLogin:   { ko: '로그인 정보를 찾을 수 없어요. 다시 로그인해 주세요.', id: 'Belum login.', en: 'Not logged in.' }
  };
  var t = function (k) { return (T[k] && (T[k][LANG] || T[k].ko)) || k; };
  var STATUS = { '접수': {ko:'접수', id:'Diterima', en:'Received', c:'#b45309', bg:'#fef3c7'},
                 '검토중': {ko:'검토중', id:'Ditinjau', en:'Reviewing', c:'#1d4ed8', bg:'#dbeafe'},
                 '배포완료': {ko:'배포완료', id:'Sudah diperbaiki', en:'Deployed', c:'#15803d', bg:'#dcfce7'},
                 '확인완료': {ko:'확인완료', id:'Selesai', en:'Closed', c:'#6b7280', bg:'#f3f4f6'},
                 '보류': {ko:'보류', id:'Ditunda', en:'On hold', c:'#7c3aed', bg:'#ede9fe'} };

  // ── 스타일 ──
  var css = ''
    + '#fbw-btn{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#243bb2;border:1px solid #c7d2fe;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;line-height:1;position:relative;white-space:nowrap}'
    + '#fbw-btn:hover{background:#eef2ff}'
    + '#fbw-btn .ic{font-size:15px}'
    + '#fbw-btn.fbw-fixed{position:fixed;top:10px;right:14px;z-index:99990;box-shadow:0 2px 8px rgba(0,0,0,.12)}'
    + '#fbw-badge{position:absolute;top:-6px;right:-6px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#dc2626;color:#fff;font-size:10.5px;font-weight:800;display:none;align-items:center;justify-content:center;box-sizing:border-box}'
    + '#fbw-badge.on{display:inline-flex}'
    + '@media (max-width:640px){#fbw-btn .lb{display:none}#fbw-btn{padding:5px 9px}}'
    + '@media print{#fbw-btn,#fbw-ov{display:none!important}}'
    + '#fbw-ov{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:99991;display:none;align-items:center;justify-content:center;padding:16px}'
    + '#fbw-ov.show{display:flex}'
    + '#fbw-box{background:#fff;border-radius:14px;width:100%;max-width:520px;max-height:92vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.3);font-family:inherit;color:#111}'
    + '#fbw-box h3{margin:0;padding:14px 18px;font-size:15px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center}'
    + '#fbw-box h3 button{background:none;border:none;font-size:18px;cursor:pointer;color:#888}'
    + '.fbw-tabs{display:flex;border-bottom:1px solid #e5e7eb}'
    + '.fbw-tab{flex:1;padding:10px;text-align:center;font-size:13px;font-weight:600;color:#64748b;cursor:pointer;border-bottom:2px solid transparent}'
    + '.fbw-tab.on{color:#243bb2;border-bottom-color:#243bb2}'
    + '.fbw-body{padding:14px 18px}'
    + '.fbw-row{margin-bottom:12px}.fbw-row label{display:block;font-size:12px;color:#555;margin-bottom:4px;font-weight:600}'
    + '.fbw-row input[type=text],.fbw-row select,.fbw-row textarea{width:100%;box-sizing:border-box;padding:9px 10px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;font-family:inherit}'
    + '.fbw-row textarea{min-height:110px;resize:vertical}'
    + '.fbw-page{font-size:12px;color:#243bb2;background:#eef2ff;padding:6px 10px;border-radius:6px;display:inline-block}'
    + '.fbw-hint{font-size:11px;color:#888;margin-top:3px}'
    + '.fbw-prev{max-width:100%;max-height:160px;border-radius:8px;border:1px solid #e5e7eb;margin-top:6px;display:none}'
    + '.fbw-act{display:flex;gap:8px;justify-content:flex-end;padding:0 18px 16px}'
    + '.fbw-act button{padding:9px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid #d1d5db;background:#fff;font-family:inherit}'
    + '.fbw-act .pri{background:#243bb2;color:#fff;border-color:#243bb2}.fbw-act .pri:disabled{opacity:.6;cursor:default}'
    + '.fbw-item{border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:12.5px}'
    + '.fbw-item .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;color:#666;font-size:11.5px}'
    + '.fbw-st{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700}'
    + '.fbw-item .txt{white-space:pre-wrap;line-height:1.5}'
    + '.fbw-item .rep{margin-top:8px;padding:8px 10px;background:#f8fafc;border-left:3px solid #243bb2;border-radius:6px;white-space:pre-wrap}'
    + '.fbw-msg{font-size:12.5px;padding:10px;border-radius:8px;margin-bottom:10px;display:none}.fbw-msg.ok{background:#dcfce7;color:#166534;display:block}.fbw-msg.err{background:#fee2e2;color:#991b1b;display:block}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ── DOM ──
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  var btn = el('button', { id: 'fbw-btn', type: 'button', title: t('btn') }, '<span class="ic">🎧</span><span class="lb">' + esc(t('btn')) + '</span><span id="fbw-badge"></span>');
  var ov = el('div', { id: 'fbw-ov' });
  ov.innerHTML = ''
    + '<div id="fbw-box">'
    + '  <h3><span>' + esc(t('title')) + '</span><button type="button" id="fbw-x" aria-label="close">✕</button></h3>'
    + '  <div class="fbw-tabs"><div class="fbw-tab on" data-tab="new">' + esc(t('tabNew')) + '</div><div class="fbw-tab" data-tab="mine">' + esc(t('tabMine')) + '</div></div>'
    + '  <div class="fbw-body" id="fbw-new">'
    + '    <div class="fbw-msg" id="fbw-msg"></div>'
    + '    <div class="fbw-row"><label>' + esc(t('page')) + '</label><span class="fbw-page" id="fbw-page"></span></div>'
    + '    <div class="fbw-row"><label>' + esc(t('category')) + '</label><select id="fbw-cat"><option value="오류">' + esc(t('catBug')) + '</option><option value="개선" selected>' + esc(t('catImprove')) + '</option><option value="문의">' + esc(t('catAsk')) + '</option></select></div>'
    + '    <div class="fbw-row"><label>' + esc(t('content')) + '</label><textarea id="fbw-txt" placeholder="' + esc(t('contentPh')) + '"></textarea></div>'
    + '    <div class="fbw-row"><label>' + esc(t('shot')) + '</label><input type="file" id="fbw-file" accept="image/*"><div class="fbw-hint">' + esc(t('shotHint')) + '</div><img class="fbw-prev" id="fbw-prev" alt=""></div>'
    + '  </div>'
    + '  <div class="fbw-body" id="fbw-mine" style="display:none"></div>'
    + '  <div class="fbw-act"><button type="button" id="fbw-cancel">' + esc(t('cancel')) + '</button><button type="button" class="pri" id="fbw-send">' + esc(t('submit')) + '</button></div>'
    + '</div>';

  // 헤더에 끼워 넣기: 포털 top-header(날짜 왼쪽) → 현장 .top-bar(사용자 정보 왼쪽) → .header-row → 폴백(상단 우측 고정)
  function place() {
    var hr = document.querySelector('.top-header-right');
    if (hr) { var dt = hr.querySelector('.top-header-date'); hr.insertBefore(btn, dt || hr.firstChild); return true; }
    // 포털(#top-header 자리가 있는 페이지)은 사이드바가 헤더를 그릴 때까지 기다림 — 페이지 자체 header-row 에 먼저 꽂히는 것 방지(위치 통일)
    if (document.getElementById('top-header')) return false;
    var ui = document.querySelector('.top-bar #userInfo, .top-bar .user-info');
    if (ui) { var rb = ui.parentElement; var wrap = el('div'); wrap.style.cssText = 'display:flex;align-items:center;gap:12px'; rb.parentNode.insertBefore(wrap, rb); wrap.appendChild(btn); wrap.appendChild(rb); return true; }
    var row = document.querySelector('.page-header .header-row');
    if (row) { var acts = row.querySelector('.header-actions'); if (acts) acts.insertBefore(btn, acts.firstChild); else row.appendChild(btn); return true; }
    return false;
  }
  function mount() {
    if (!document.body) { return setTimeout(mount, 50); }
    document.body.appendChild(ov);
    var tries = 0;
    (function tryPlace() {
      if (place()) return;
      if (++tries < 60) return setTimeout(tryPlace, 100);   // 사이드바가 헤더를 늦게 그리는 페이지 대비(최대 6초)
      btn.classList.add('fbw-fixed'); document.body.appendChild(btn);
    })();
    setTimeout(loadBadge, 1500);
    document.getElementById('fbw-page').textContent = PAGE + (document.title ? ' · ' + document.title.replace(/\s*[-·|].*$/, '') : '');
    btn.onclick = function () { ov.classList.add('show'); showTab('new'); };
    document.getElementById('fbw-x').onclick = close; document.getElementById('fbw-cancel').onclick = close;
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    var tabs = ov.querySelectorAll('.fbw-tab'); for (var i = 0; i < tabs.length; i++) tabs[i].onclick = function () { showTab(this.getAttribute('data-tab')); };
    document.getElementById('fbw-file').onchange = onFile;
    document.getElementById('fbw-send').onclick = send;
  }
  function close() { ov.classList.remove('show'); }
  function showTab(name) {
    var tabs = ov.querySelectorAll('.fbw-tab'); for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('on', tabs[i].getAttribute('data-tab') === name);
    document.getElementById('fbw-new').style.display = name === 'new' ? '' : 'none';
    document.getElementById('fbw-mine').style.display = name === 'mine' ? '' : 'none';
    document.getElementById('fbw-send').style.display = name === 'new' ? '' : 'none';
    if (name === 'mine') { loadMine(); markSeen(); }
  }
  // ── 새 답변 배지: 마지막으로 [내 요청]을 본 시각 이후에 달린 답변 수 ──
  var _uidForSeen = null;
  function seenKey() { return 'fbw_seen_' + (_uidForSeen || 'x'); }
  function markSeen() { try { localStorage.setItem(seenKey(), new Date().toISOString()); } catch (e) {} setBadge(0); }
  function setBadge(n) { var b = document.getElementById('fbw-badge'); if (!b) return; b.textContent = n > 99 ? '99+' : String(n); b.classList.toggle('on', n > 0); }
  async function loadBadge() {
    try {
      var u = await me(); if (!u) return; _uidForSeen = u.uid;
      var since = ''; try { since = localStorage.getItem(seenKey()) || ''; } catch (e) {}
      var q = client().from('feedback').select('id, replied_at').eq('reporter_uid', u.uid).not('replied_at', 'is', null).limit(100);
      if (since) q = q.gt('replied_at', since);
      var r = await q; if (r.error || !r.data) return;
      setBadge(r.data.length);
    } catch (e) {}
  }
  function msg(text, kind) { var m = document.getElementById('fbw-msg'); m.textContent = text; m.className = 'fbw-msg' + (kind ? ' ' + kind : ''); }

  // ── Supabase ──
  var _c = null;
  function client() {
    if (_c) return _c;
    if (typeof window.agClient === 'function') { try { _c = window.agClient(); } catch (e) {} }
    if (!_c && window.supabase && window.supabase.createClient) _c = window.supabase.createClient(SU, SK);
    return _c;
  }
  async function me() {
    var c = client(); if (!c) return null;
    var s = await c.auth.getSession(); var u = s && s.data && s.data.session && s.data.session.user; if (!u) return null;
    var info = null;
    try { var cached = sessionStorage.getItem('userInfo'); if (cached) { var ci = JSON.parse(cached); if (ci && ci.auth_user_id === u.id) info = ci; } } catch (e) {}
    if (!info) { var r = await c.from('users').select('name, department, process, user_type').eq('auth_user_id', u.id).single(); info = r.data || {}; }
    return { uid: u.id, name: info.name || '', dept: info.department || info.process || '', user_type: info.user_type || '' };
  }

  // ── 스크린샷 축소 (긴 변 1280px, JPEG 0.8) ──
  var shotBlob = null;
  function onFile(e) {
    shotBlob = null; var f = e.target.files && e.target.files[0]; var prev = document.getElementById('fbw-prev'); prev.style.display = 'none';
    if (!f) return;
    var img = new Image(); var url = URL.createObjectURL(f);
    img.onload = function () {
      var max = 1280, w = img.width, h = img.height, k = Math.min(1, max / Math.max(w, h));
      var cv = document.createElement('canvas'); cv.width = Math.round(w * k); cv.height = Math.round(h * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob(function (b) {
        URL.revokeObjectURL(url);
        if (!b) return;
        if (b.size > 2 * 1024 * 1024) { msg(t('tooBig'), 'err'); e.target.value = ''; return; }
        shotBlob = b; prev.src = cv.toDataURL('image/jpeg', 0.6); prev.style.display = 'block';
      }, 'image/jpeg', 0.8);
    };
    img.onerror = function () { URL.revokeObjectURL(url); };
    img.src = url;
  }

  // ── 전송 ──
  async function send() {
    var txt = document.getElementById('fbw-txt').value.trim();
    if (!txt) { msg(t('needContent'), 'err'); return; }
    var b = document.getElementById('fbw-send'); b.disabled = true; b.textContent = t('sending'); msg('', '');
    try {
      var u = await me(); if (!u) throw new Error(t('notLogin'));
      var c = client();
      var path = null;
      if (shotBlob) {
        path = new Date().toISOString().slice(0, 10) + '/' + u.uid.slice(0, 8) + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
        var up = await c.storage.from(BUCKET).upload(path, shotBlob, { contentType: 'image/jpeg', upsert: false });
        if (up.error) throw new Error('screenshot: ' + up.error.message);
      }
      var ins = await c.from('feedback').insert({
        reporter_uid: u.uid, reporter_name: u.name, reporter_dept: u.dept, source: SOURCE,
        page: PAGE, page_title: (document.title || '').replace(/\s*[-·|]\s*HKHT.*$/, ''),
        category: document.getElementById('fbw-cat').value, content: txt, screenshot: path
      });
      if (ins.error) throw new Error(ins.error.message);
      document.getElementById('fbw-txt').value = ''; document.getElementById('fbw-file').value = ''; shotBlob = null; document.getElementById('fbw-prev').style.display = 'none';
      msg(t('done'), 'ok');
    } catch (e) { msg(t('fail') + (e.message || e), 'err'); }
    b.disabled = false; b.textContent = t('submit');
  }

  // ── 내 요청 ──
  async function loadMine() {
    var box = document.getElementById('fbw-mine'); box.innerHTML = '<div style="color:#888;font-size:12px">...</div>';
    try {
      var u = await me(); if (!u) { box.innerHTML = '<div class="fbw-msg err">' + esc(t('notLogin')) + '</div>'; return; }
      var r = await client().from('feedback').select('id, created_at, page, category, content, status, admin_reply, replied_at, screenshot').eq('reporter_uid', u.uid).order('created_at', { ascending: false }).limit(30);
      if (r.error) throw new Error(r.error.message);
      if (!r.data || !r.data.length) { box.innerHTML = '<div style="color:#888;font-size:12.5px;text-align:center;padding:20px">' + esc(t('noMine')) + '</div>'; return; }
      var h = '';
      r.data.forEach(function (x) {
        var s = STATUS[x.status] || STATUS['접수'];
        h += '<div class="fbw-item"><div class="top"><span>#' + x.id + ' · ' + esc((x.created_at || '').slice(0, 10)) + ' · ' + esc(x.page || '') + ' · ' + esc(x.category) + '</span><span class="fbw-st" style="color:' + s.c + ';background:' + s.bg + '">' + esc(s[LANG] || s.ko) + '</span></div>'
           + '<div class="txt">' + esc(x.content) + '</div>'
           + (x.screenshot ? '<div style="margin-top:4px"><a href="' + SU + '/storage/v1/object/public/' + BUCKET + '/' + esc(x.screenshot) + '" target="_blank" style="font-size:11px;color:#243bb2">📎 screenshot</a></div>' : '')
           + '<div class="rep">' + (x.admin_reply ? '<b>' + esc(t('reply')) + '</b> (' + esc((x.replied_at || '').slice(0, 10)) + ')<br>' + esc(x.admin_reply) : '<span style="color:#999">' + esc(t('noReply')) + '</span>') + '</div></div>';
      });
      box.innerHTML = h;
    } catch (e) { box.innerHTML = '<div class="fbw-msg err">' + esc(e.message || e) + '</div>'; }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
