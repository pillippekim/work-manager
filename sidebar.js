/* ===== 좌측 메뉴바 (공통 JS) ===== */
/* 업무관리 포탈(index.html)과 디자인 통일 */

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
    if (historyActive && !hash) damageActive = ' active';

    var historyToggleActive = historyActive ? ' active' : '';
    var historyGroupOpen = historyActive ? ' open' : '';

    var nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    nav.innerHTML =
        // 로고 헤더 (포탈과 동일)
        '<div class="sidebar-logo">' +
            '<img class="sidebar-logo-img" src="hkht_logo_white.png" alt="HKHT">' +
            '<div class="sub">업무관리 포탈</div>' +
        '</div>' +

        // 포탈 바로가기
        '<a class="sidebar-portal-link" href="index.html">' +
            '<span class="icon">🏠</span>' +
            '<span>포탈 홈</span>' +
        '</a>' +

        // 금형관리 메뉴
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

        // 하단
        '<div class="sidebar-bottom"><a href="#">㈜한국하이테크</a></div>';
}

// 상단 바 날짜 표시
function initTopBar() {
    var dateEl = document.getElementById('topBarDate');
    if (!dateEl) return;
    var now = new Date();
    var days = ['일','월','화','수','목','금','토'];
    dateEl.textContent = now.getFullYear() + '년 ' + (now.getMonth()+1) + '월 ' + now.getDate() + '일 (' + days[now.getDay()] + ')';
}

// 페이지 로드 시 자동 실행
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initTopBar();
});
