/* ===== 공통 사이드바 + 상단 헤더 (JS) ===== */
/* 포탈(index.html)과 동일한 메뉴 구조 */
/* 금형관리 4개 페이지에서 사용 */

function initSidebar() {
    var page = location.pathname.split('/').pop() || 'index.html';
    var hash = location.hash;

    // 금형관리 페이지 여부
    var isMoldPage = ['mold_dashboard.html','mold_layout.html','mold_admin.html','mold_history.html'].indexOf(page) !== -1;

    // 금형관리 하위 페이지 active
    var dashActive = (page === 'mold_dashboard.html') ? ' nav-active' : '';
    var layoutActive = (page === 'mold_layout.html') ? ' nav-active' : '';
    var adminActive = (page === 'mold_admin.html') ? ' nav-active' : '';
    var historyActive = (page === 'mold_history.html') ? ' nav-active' : '';

    // 금형관리 페이지면 생산관리 > 금형관리 자동 펼침
    var prodOpen = isMoldPage ? ' open' : '';
    var moldOpen = isMoldPage ? ' open' : '';

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
            '</div>';
    }

    /* ── 사이드바 ── */
    var nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    nav.innerHTML =
        '<div class="menu-scroll">' +

        /* 업무관리 */
        '<div class="menu-group">' +
            '<div class="menu-group-title">업무관리</div>' +

            /* 생산관리 */
            '<div class="cat-item' + prodOpen + '" id="c-prod">' +
                '<button class="cat-btn" onclick="toggleCat(\'c-prod\')">' +
                    '<span class="c-icon">🏭</span><span class="c-label">생산관리</span>' +
                    '<span class="c-badge on">운영</span><span class="c-arrow">▼</span>' +
                '</button>' +
                '<div class="cat-body">' +
                    '<div class="sub-item' + moldOpen + '" id="s-mold">' +
                        '<button class="sub-btn" onclick="toggleCat(\'s-mold\')">' +
                            '<span class="s-icon">🔧</span><span class="s-label">금형관리</span>' +
                            '<span class="s-badge c-badge on">1차</span><span class="s-arrow">▼</span>' +
                        '</button>' +
                        '<div class="sub-body">' +
                            '<a class="nav-link' + dashActive + '" href="mold_dashboard.html"><span class="n-icon">📊</span>대시보드</a>' +
                            '<a class="nav-link' + layoutActive + '" href="mold_layout.html"><span class="n-icon">🗄️</span>적치대 현황</a>' +
                            '<a class="nav-link' + adminActive + '" href="mold_admin.html"><span class="n-icon">📋</span>금형 상세관리</a>' +
                            '<a class="nav-link' + historyActive + '" href="mold_history.html"><span class="n-icon">🔧</span>이력 관리</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="sub-item disabled">' +
                        '<button class="sub-btn"><span class="s-icon">📦</span><span class="s-label">재고관리</span><span class="s-badge c-badge off">2차</span></button>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            /* 비활성 메뉴 */
            '<div class="cat-item disabled"><button class="cat-btn"><span class="c-icon">✅</span><span class="c-label">품질관리</span><span class="c-badge off">향후</span></button></div>' +
            '<div class="cat-item disabled"><button class="cat-btn"><span class="c-icon">🚚</span><span class="c-label">물류관리</span><span class="c-badge off">향후</span></button></div>' +
            '<div class="cat-item disabled"><button class="cat-btn"><span class="c-icon">🔬</span><span class="c-label">R&D</span><span class="c-badge off">향후</span></button></div>' +
            '<div class="cat-item disabled"><button class="cat-btn"><span class="c-icon">💼</span><span class="c-label">경영지원</span><span class="c-badge off">향후</span></button></div>' +
        '</div>' +

        '<div class="menu-divider"></div>' +

        /* 현장관리 */
        '<div class="menu-group">' +
            '<div class="menu-group-title">현장관리</div>' +
            '<div class="cat-item">' +
                '<a class="cat-btn" href="https://pillippekim.github.io/project-moon/index.html" style="text-decoration:none;color:inherit;">' +
                    '<span class="c-icon">📝</span><span class="c-label">작업일지 프로그램</span><span class="c-badge on">바로가기</span>' +
                '</a>' +
            '</div>' +
        '</div>' +

        '<div class="menu-divider"></div>' +

        /* 시스템 */
        '<div class="menu-group">' +
            '<div class="menu-group-title">시스템</div>' +
            '<div class="cat-item" id="c-system">' +
                '<button class="cat-btn" onclick="toggleCat(\'c-system\')">' +
                    '<span class="c-icon">⚙️</span><span class="c-label">시스템 관리</span><span class="c-arrow">▼</span>' +
                '</button>' +
                '<div class="cat-body">' +
                    '<a class="nav-link" href="https://pillippekim.github.io/project-moon/users.html"><span class="n-icon">👥</span>사용자 관리</a>' +
                    '<a class="nav-link" href="https://pillippekim.github.io/project-moon/audit.html"><span class="n-icon">📋</span>변경 이력</a>' +
                    '<a class="nav-link" href="https://pillippekim.github.io/project-moon/admin.html"><span class="n-icon">📊</span>데이터 조회</a>' +
                    '<a class="nav-link" href="https://pillippekim.github.io/project-moon/safety_admin.html"><span class="n-icon">🔍</span>설비 점검 조회</a>' +
                    '<a class="nav-link" href="https://pillippekim.github.io/project-moon/master.html"><span class="n-icon">🗂️</span>기준정보 관리</a>' +
                    '<a class="nav-link" href="https://pillippekim.github.io/project-moon/docs_admin.html"><span class="n-icon">📄</span>문서 관리</a>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '</div>' + /* menu-scroll 끝 */
        '<div class="menu-bottom"><a href="#">㈜한국하이테크</a></div>';
}

function toggleCat(id) {
    document.getElementById(id).classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', initSidebar);
