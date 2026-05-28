/* ===== 공통 사이드바 + 상단 헤더 (JS) ===== */
/* work-manager 전체 페이지에서 사용 */
/* 세션5: 메뉴 구조 전면 개편 — 데이터관리 그룹 신설, PM→WM 이동 */

function initSidebar() {
    var page = location.pathname.split('/').pop() || 'index.html';
    var hash = location.hash;

    // 모니터 계정 감지
    var isMonitor = false;
    var isWorker = false;
    try {
        var cached = sessionStorage.getItem('userInfo');
        if (cached) {
            var uInfo = JSON.parse(cached);
            if (uInfo && uInfo.process === '모니터') isMonitor = true;
            if (uInfo && uInfo.user_type === 'worker') isWorker = true;
        }
    } catch(e) {}

    // ── 페이지별 active / 자동 펼침 ──
    var isMoldPage = ['mold_dashboard.html','mold_layout.html','mold_detail.html'].indexOf(page) !== -1;
    var isQualityPage = ['inspection_round_viewer.html'].indexOf(page) !== -1;
    var isDataPage = ['data_viewer.html','safety_viewer.html','docs_manager.html'].indexOf(page) !== -1;
    var isSystemPage = ['master_data.html','users.html'].indexOf(page) !== -1;
    var isInventoryPage = ['inventory_layout.html','inventory_rack.html','inventory_io.html','inventory_viewer.html','inventory_zone.html'].indexOf(page) !== -1;

    // 금형관리 active
    var dashActive = (page === 'mold_dashboard.html') ? ' nav-active' : '';
    var layoutActive = (page === 'mold_layout.html') ? ' nav-active' : '';
    var detailActive = (page === 'mold_detail.html') ? ' nav-active' : '';

    // 품질관리 active
    var inspViewActive = (page === 'inspection_round_viewer.html') ? ' nav-active' : '';

    // 데이터관리 active
    var dataViewActive = (page === 'data_viewer.html') ? ' nav-active' : '';
    var safetyViewActive = (page === 'safety_viewer.html') ? ' nav-active' : '';
    var docsActive = (page === 'docs_manager.html') ? ' nav-active' : '';

    // 시스템 active
    var masterActive = (page === 'master_data.html') ? ' nav-active' : '';
    var usersActive = (page === 'users.html') ? ' nav-active' : '';

    // 재고관리 active
    var invLayoutActive = (page === 'inventory_layout.html') ? ' nav-active' : '';
    var invRackActive = (page === 'inventory_rack.html') ? ' nav-active' : '';
    var invZoneActive = (page === 'inventory_zone.html') ? ' nav-active' : '';
    var invOutboundActive = (page === 'inventory_io.html') ? ' nav-active' : '';
    var invViewerActive = (page === 'inventory_viewer.html') ? ' nav-active' : '';

    // 자동 펼침
    var prodOpen = isMoldPage ? ' open' : '';
    var moldOpen = isMoldPage ? ' open' : '';
    var qualityOpen = isQualityPage ? ' open' : '';
    var inspOpen = isQualityPage ? ' open' : '';
    var dataOpen = isDataPage ? ' open' : '';
    var systemOpen = isSystemPage ? ' open' : '';
    var logisticsOpen = isInventoryPage ? ' open' : '';
    var inventoryOpen = isInventoryPage ? ' open' : '';

    /* ── 상단 헤더 바 ── */
    var headerEl = document.getElementById('top-header');
    if (headerEl) {
        var now = new Date();
        var days = ['일','월','화','수','목','금','토'];
        var dateStr = now.getFullYear() + '년 ' + (now.getMonth()+1) + '월 ' + now.getDate() + '일 (' + days[now.getDay()] + ')';

        headerEl.innerHTML =
            '<div class="top-header-left">' +
                '<a href="index.html" style="text-decoration:none;"><img class="top-header-logo" src="hkht_logo.png" alt="HKHT"></a>' +
                '<div class="top-header-divider"></div>' +
                '<div class="top-header-title">㈜한국하이테크</div>' +
            '</div>' +
            '<div class="top-header-right">' +
                '<div class="top-header-date">' + dateStr + '</div>' +
                '<div class="top-header-user" id="headerUser"></div>' +
            '</div>';

        // 사용자 정보 표시
        try {
            var cached = sessionStorage.getItem('userInfo');
            if (cached) {
                var u = JSON.parse(cached);
                var avatar = u.name ? u.name.charAt(0) : '?';
                var role = u.user_type === 'super' ? '슈퍼관리자' : (u.department || u.process || '');
                document.getElementById('headerUser').innerHTML =
                    '<div class="top-header-avatar">' + avatar + '</div>' +
                    '<div class="top-header-uinfo">' +
                        '<div class="top-header-uname">' + (u.name || '-') + '</div>' +
                        '<div class="top-header-urole">' + role + '</div>' +
                    '</div>' +
                    '<button class="top-header-logout" onclick="logout()">로그아웃</button>';
            }
        } catch(e) {}
    }

    /* ── 사이드바 ── */
    var nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    var PM = 'https://pillippekim.github.io/project-moon/';

    nav.innerHTML =
        '<div class="menu-scroll">' +

        /* ═══ 1. 업무관리 ═══ */
        '<div class="menu-group">' +
            '<div class="menu-group-title">업무관리</div>' +

            /* 생산관리 */
            '<div class="cat-item' + prodOpen + '" id="c-prod">' +
                '<button class="cat-btn" onclick="toggleCat(\'c-prod\')">' +
                    '<span class="c-icon">🏭</span><span class="c-label">생산관리</span>' +
                    '<span class="c-badge on">운영</span><span class="c-arrow">▼</span>' +
                '</button>' +
                '<div class="cat-body">' +
                    /* 금형관리 */
                    '<div class="sub-item' + moldOpen + '" id="s-mold">' +
                        '<button class="sub-btn" onclick="toggleCat(\'s-mold\')">' +
                            '<span class="s-icon">🔧</span><span class="s-label">금형관리</span>' +
                            '<span class="s-badge c-badge on">1차</span><span class="s-arrow">▼</span>' +
                        '</button>' +
                        '<div class="sub-body">' +
                            '<a class="nav-link' + dashActive + '" href="mold_dashboard.html"><span class="n-icon">📊</span>대시보드 / 이력</a>' +
                            '<a class="nav-link' + layoutActive + '" href="mold_layout.html"><span class="n-icon">🗄️</span>적치대 현황</a>' +
                            '<a class="nav-link' + detailActive + '" href="mold_detail.html"><span class="n-icon">📋</span>금형 상세관리</a>' +
                        '</div>' +
                    '</div>' +
            '</div>' +

            /* 품질관리 */
            '<div class="cat-item' + qualityOpen + '" id="c-quality">' +
                '<button class="cat-btn" onclick="toggleCat(\'c-quality\')">' +
                    '<span class="c-icon">✅</span><span class="c-label">품질관리</span>' +
                    '<span class="c-badge on">운영</span><span class="c-arrow">▼</span>' +
                '</button>' +
                '<div class="cat-body">' +
                    /* 공정검사 (하위 그룹) */
                    '<div class="sub-item' + inspOpen + '" id="s-insp">' +
                        '<button class="sub-btn" onclick="toggleCat(\'s-insp\')">' +
                            '<span class="s-icon">🔬</span><span class="s-label">공정검사</span>' +
                            '<span class="s-arrow">▼</span>' +
                        '</button>' +
                        '<div class="sub-body">' +
                            '<a class="nav-link" href="' + PM + 'inspection_round.html"><span class="n-icon">📋</span>공정검사 작성</a>' +
                            '<a class="nav-link' + inspViewActive + '" href="inspection_round_viewer.html"><span class="n-icon">📂</span>공정검사 조회</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            /* 비활성 메뉴 */
            /* 물류관리 */
            '<div class="cat-item' + logisticsOpen + '" id="c-logistics">' +
                '<button class="cat-btn" onclick="toggleCat(\'c-logistics\')">' +
                    '<span class="c-icon">🚚</span><span class="c-label">물류관리</span>' +
                    '<span class="c-badge on">운영</span><span class="c-arrow">▼</span>' +
                '</button>' +
                '<div class="cat-body">' +
                    '<div class="sub-item' + inventoryOpen + '" id="s-inventory">' +
                        '<button class="sub-btn" onclick="toggleCat(\'s-inventory\')">' +
                            '<span class="s-icon">📦</span><span class="s-label">재고관리</span>' +
                            '<span class="s-badge c-badge on">1차</span><span class="s-arrow">▼</span>' +
                        '</button>' +
                        '<div class="sub-body">' +
                            '<a class="nav-link' + invLayoutActive + '" href="inventory_layout.html"><span class="n-icon">🗺️</span>적재대 현황</a>' +
                            '<a class="nav-link' + invRackActive + '" href="inventory_rack.html"><span class="n-icon">🗄️</span>랙 상세 현황</a>' +
                            '<a class="nav-link' + invZoneActive + '" href="inventory_rack.html?type=zone"><span class="n-icon">🚚</span>대차 현황</a>' +
                            '<a class="nav-link' + invOutboundActive + '" href="inventory_io.html"><span class="n-icon">📤</span>입출고 관리</a>' +
                            '<a class="nav-link' + invViewerActive + '" href="inventory_viewer.html"><span class="n-icon">📊</span>재고 조회</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="cat-item disabled"><button class="cat-btn"><span class="c-icon">🔬</span><span class="c-label">R&D</span><span class="c-badge off">향후</span></button></div>' +
            '<div class="cat-item disabled"><button class="cat-btn"><span class="c-icon">💼</span><span class="c-label">경영지원</span><span class="c-badge off">향후</span></button></div>' +
        '</div>' +

        '<div class="menu-divider"></div>' +

        /* ═══ 2. 데이터관리 ═══ */
        '<div class="menu-group">' +
            '<div class="menu-group-title">데이터관리</div>' +
            '<div class="cat-item' + dataOpen + '" id="c-data">' +
                '<button class="cat-btn" onclick="toggleCat(\'c-data\')">' +
                    '<span class="c-icon">📊</span><span class="c-label">데이터 관리</span>' +
                    '<span class="c-badge on">운영</span><span class="c-arrow">▼</span>' +
                '</button>' +
                '<div class="cat-body">' +
                    '<a class="nav-link' + dataViewActive + '" href="data_viewer.html"><span class="n-icon">📊</span>데이터 조회 및 추출</a>' +
                    '<a class="nav-link' + safetyViewActive + '" href="safety_viewer.html"><span class="n-icon">🔍</span>설비 점검 조회</a>' +
                    '<a class="nav-link' + docsActive + '" href="docs_manager.html"><span class="n-icon">📄</span>문서 관리</a>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="menu-divider"></div>' +

        /* ═══ 3. 현장관리 ═══ */
        '<div class="menu-group">' +
            '<div class="menu-group-title">현장관리</div>' +
            '<div class="cat-item">' +
                '<a class="cat-btn" href="' + PM + 'index.html" target="_blank" style="text-decoration:none;color:inherit;">' +
                    '<span class="c-icon">📝</span><span class="c-label">작업일지 프로그램</span><span class="c-badge on">바로가기</span>' +
                '</a>' +
            '</div>' +
        '</div>' +

        '<div class="menu-divider"></div>' +

        /* ═══ 4. 시스템 ═══ */
        '<div class="menu-group">' +
            '<div class="menu-group-title">시스템</div>' +
            '<div class="cat-item' + systemOpen + '" id="c-system">' +
                '<button class="cat-btn" onclick="toggleCat(\'c-system\')">' +
                    '<span class="c-icon">⚙️</span><span class="c-label">시스템 관리</span><span class="c-arrow">▼</span>' +
                '</button>' +
                '<div class="cat-body">' +
                    '<a class="nav-link' + masterActive + '" href="master_data.html"><span class="n-icon">🗂️</span>기준정보 관리</a>' +
                    '<a class="nav-link' + usersActive + '" href="users.html"><span class="n-icon">👥</span>사용자 관리</a>' +
                    '<a class="nav-link" href="' + PM + 'audit.html"><span class="n-icon">📋</span>변경 이력</a>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '</div>' + /* menu-scroll 끝 */
        '<div class="menu-bottom"><a href="#">㈜한국하이테크</a></div>';
}

function toggleCat(id) {
    document.getElementById(id).classList.toggle('open');
}

// 모니터/worker/물류기사 계정: 허용 페이지 외 링크 비활성화
function applyAccessRestrictions() {
    try {
        var cached = sessionStorage.getItem('userInfo');
        if (!cached) return;
        var u = JSON.parse(cached);
        if (!u) return;

        var isMonitor = (u.process === '모니터');
        var isWorker = (u.user_type === 'worker');

        // 물류기사 판별: 사번 기준 (추가 시 여기에 사번 추가)
        var logisticsIds = ['25120901', '24010201'];
        var empId = String(u.employee_id || u.id || '');
        var isLogistics = false;
        for (var k = 0; k < logisticsIds.length; k++) {
            if (empId === logisticsIds[k]) { isLogistics = true; break; }
        }

        if (!isMonitor && !isWorker && !isLogistics) return;

        // 모니터: 적치대+대시보드만
        // worker: 적치대+대시보드+공정검사(작성/조회)+작업일지
        // 물류기사: 재고관리 4개 페이지만
        var allowedPages = [];
        if (isLogistics) {
            allowedPages = [
                'inventory_layout.html',
                'inventory_rack.html',
                'inventory_zone.html',
                'inventory_io.html',
                'inventory_viewer.html'
            ];
        } else {
            allowedPages = ['mold_layout.html', 'mold_dashboard.html'];
            if (isWorker) {
                allowedPages.push('inspection_round.html');
                allowedPages.push('inspection_round_viewer.html');
            }
        }

        var links = document.querySelectorAll('#sidebar-nav a.nav-link, #sidebar-nav a.cat-btn');
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute('href') || '';
            var pageName = href.split('/').pop().split('?')[0].split('#')[0];
            var isAllowed = false;

            // 작업일지 바로가기(PM index.html)는 worker에게 허용
            if (isWorker && href.indexOf('project-moon/index.html') !== -1) {
                isAllowed = true;
            }

            for (var j = 0; j < allowedPages.length; j++) {
                if (pageName === allowedPages[j]) { isAllowed = true; break; }
            }
            if (!isAllowed) {
                links[i].style.opacity = '0.35';
                links[i].style.pointerEvents = 'none';
                links[i].style.cursor = 'default';
            }
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    applyAccessRestrictions();
});
