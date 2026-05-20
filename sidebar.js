/* ===== 좌측 메뉴바 + 상단 헤더 (공통 JS) ===== */
/* 업무관리 포탈(index.html)과 디자인 통일 */

function toggleSubMenu(el) {
    el.parentElement.classList.toggle('open');
}

function initSidebar() {
    var page = location.pathname.split('/').pop() || 'mold_dashboard.html';
    var hash = location.hash;

    var dashActive = (page === 'mold_dashboard.html') ? ' active' : '';
    var layoutActive = (page === 'mold_layout.html') ? ' active' : '';
    var adminActive = (page === 'mold_admin.html') ? ' active' : '';
    var historyActive = (page === 'mold_history.html');

    var damageActive = (historyActive && hash === '#damage') ? ' active' : '';
    var cleaningActive = (historyActive && hash === '#cleaning') ? ' active' : '';
    var repairActive = (historyActive && hash === '#repair') ? ' active' : '';
    if (historyActive && !hash) damageActive = ' active';

    var historyToggleActive = historyActive ? ' active' : '';
    var historyGroupOpen = historyActive ? ' open' : '';

    // 상단 헤더 바 삽입
    var headerEl = document.getElementById('top-header');
    if (headerEl) {
        var now = new Date();
        var days = ['일','월','화','수','목','금','토'];
        var dateStr = now.getFullYear() + '년 ' + (now.getMonth()+1) + '월 ' + now.getDate() + '일 (' + days[now.getDay()] + ')';

        headerEl.innerHTML =
            '<div class="top-header-left">' +
                '<img class="top-header-logo" src="hkht_logo.png" alt="HKHT">' +
                '<div class="top-header-divider"></div>' +
                '<div class="top-header-title">㈜한국하이테크</div>' +
            '</div>' +
            '<div class="top-header-right">' +
                '<div class="top-header-date">' + dateStr + '</div>' +
            '</div>';
    }

    // 사이드바 삽입
    var nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    nav.innerHTML =
        '<a class="sidebar-portal-link" href="index.html">' +
            '<span class="icon">🏠</span><span>포탈 홈</span>' +
        '</a>' +

        '<div class="sidebar-section">' +
            '<div class="sidebar-section-title">금형관리</div>' +
            '<a class="sidebar-item' + dashActive + '" href="mold_dashboard.html">' +
                '<span class="icon">📊</span><span>대시보드</span>' +
            '</a>' +
            '<a class="sidebar-item' + layoutActive + '" href="mold_layout.html">' +
                '<span class="icon">🗄️</span><span>적치대 현황</span>' +
            '</a>' +
            '<a class="sidebar-item' + adminActive + '" href="mold_admin.html">' +
                '<span class="icon">📋</span><span>금형 상세관리</span>' +
            '</a>' +
            '<div class="sidebar-group' + historyGroupOpen + '">' +
                '<div class="sidebar-item sidebar-toggle' + historyToggleActive + '" onclick="toggleSubMenu(this)">' +
                    '<span class="icon">🔧</span><span>이력 관리</span><span class="arrow">›</span>' +
                '</div>' +
                '<div class="sidebar-sub">' +
                    '<a class="sidebar-sub-item' + damageActive + '" href="mold_history.html#damage">' +
                        '<span class="icon">🔴</span><span>손상 이력</span>' +
                    '</a>' +
                    '<a class="sidebar-sub-item' + cleaningActive + '" href="mold_history.html#cleaning">' +
                        '<span class="icon">🧹</span><span>세척 이력</span>' +
                    '</a>' +
                    '<a class="sidebar-sub-item' + repairActive + '" href="mold_history.html#repair">' +
                        '<span class="icon">🛠️</span><span>수리 이력</span>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="sidebar-bottom"><a href="#">㈜한국하이테크</a></div>';
}

document.addEventListener('DOMContentLoaded', initSidebar);
