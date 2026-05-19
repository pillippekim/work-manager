/* ===== 좌측 메뉴바 (공통 JS) ===== */

// 이력관리 아코디언 토글
function toggleSubMenu(el) {
    el.parentElement.classList.toggle('open');
}

// 사이드바 HTML 삽입 (현재 페이지에 맞게 active 처리)
function initSidebar() {
    var page = location.pathname.split('/').pop() || 'mold_dashboard.html';
    var hash = location.hash;

    // active 클래스 결정
    var dashActive = (page === 'mold_dashboard.html') ? ' active' : '';
    var layoutActive = (page === 'mold_layout.html') ? ' active' : '';
    var adminActive = (page === 'mold_admin.html') ? ' active' : '';
    var historyActive = (page === 'mold_history.html');

    // 이력관리 하위 메뉴 active
    var damageActive = (historyActive && hash === '#damage') ? ' active' : '';
    var cleaningActive = (historyActive && hash === '#cleaning') ? ' active' : '';
    var repairActive = (historyActive && hash === '#repair') ? ' active' : '';
    // 이력관리 페이지인데 해시 없으면 손상이력 기본 active
    if (historyActive && !hash) damageActive = ' active';

    var historyToggleActive = historyActive ? ' active' : '';
    var historyGroupOpen = historyActive ? ' open' : '';

    var nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    nav.innerHTML =
        '<div class="sidebar-logo"><h2>금형관리</h2><div class="sub">Mold Management</div></div>' +
        '<div class="sidebar-section">' +
        '<div class="sidebar-section-title">메뉴</div>' +
        '<a class="sidebar-item' + dashActive + '" href="mold_dashboard.html"><span class="icon">📊</span><span>대시보드</span></a>' +
        '<a class="sidebar-item' + layoutActive + '" href="mold_layout.html"><span class="icon">🗄️</span><span>적치대 현황</span></a>' +
        '<a class="sidebar-item' + adminActive + '" href="mold_admin.html"><span class="icon">📋</span><span>금형 상세관리</span></a>' +
        '<div class="sidebar-group' + historyGroupOpen + '">' +
        '<div class="sidebar-item sidebar-toggle' + historyToggleActive + '" onclick="toggleSubMenu(this)"><span class="icon">🔧</span><span>이력 관리</span><span class="arrow">›</span></div>' +
        '<div class="sidebar-sub">' +
        '<a class="sidebar-sub-item' + damageActive + '" href="mold_history.html#damage"><span class="icon">🔴</span><span>손상 이력</span></a>' +
        '<a class="sidebar-sub-item' + cleaningActive + '" href="mold_history.html#cleaning"><span class="icon">🧹</span><span>세척 이력</span></a>' +
        '<a class="sidebar-sub-item' + repairActive + '" href="mold_history.html#repair"><span class="icon">🛠️</span><span>수리 이력</span></a>' +
        '</div></div></div>' +
        '<div class="sidebar-bottom"><a href="#">㈜한국하이테크</a></div>';
}

// 페이지 로드 시 자동 실행
document.addEventListener('DOMContentLoaded', initSidebar);
