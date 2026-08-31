/* ===== work-manager 권한 체크 모듈 ===== */
/* 각 페이지 <script> 시작 부분에서 checkAuth() 호출 */

var SUPABASE_URL_AG = 'https://vpaixxlhzkwtgcllimvn.supabase.co';
var SUPABASE_KEY_AG = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYWl4eGxoemt3dGdjbGxpbXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzk4NjMsImV4cCI6MjA5MTk1NTg2M30.V8Bj0cMbM0E2TFhklYYa7TM-vO6Fi70ctACA7uUf4Ig';

// =============================================
// 메뉴 구조 정의 (대분류 → 페이지 매핑)
// =============================================
window.MENU_STRUCTURE = {
    production: { name: '생산관리', pages: ['mold_dashboard.html', 'mold_layout.html', 'mold_detail.html', 'mold_admin.html', 'process_report.html'] },
    quality:    { name: '품질관리', pages: ['inspection_round_viewer.html', 'inspection_report.html'] },
    logistics:  { name: '물류관리', pages: ['inventory_layout.html', 'inventory_rack.html', 'inventory_zone.html', 'inventory_io.html', 'inventory_viewer.html', 'inventory_special.html'] },
    management: { name: '경영지원', pages: ['asset_manage.html'], sensitive: true },
    data:       { name: '데이터 관리', pages: ['data_viewer.html', 'safety_viewer.html', 'docs_manager.html'] },
    system:     { name: '시스템 관리', pages: ['master_data.html', 'users.html', 'permissions.html'] }
};

// 페이지가 속한 대분류 코드 반환
window.getPageCategory = function(page) {
    var ms = window.MENU_STRUCTURE;
    for (var key in ms) {
        if (ms[key].pages.indexOf(page) !== -1) return key;
    }
    return null;
};

// 기본 접근 권한 (명시적 권한 레코드가 없을 때 — 기존 동작 유지 + 민감 페이지 보호)
window.getDefaultAccess = function(userInfo, category) {
    var ut = userInfo.user_type;
    var dept = userInfo.department || '';

    if (ut === 'super') return true;            // 슈퍼관리자: 전체 허용
    if (!category) return true;                  // 분류 외 페이지(index 등): 허용

    // 시스템관리: 관리자 이상만
    if (category === 'system') return (ut === 'admin');
    // 경영지원(민감): 관리자 + 경영지원팀만
    if (category === 'management') return (ut === 'admin' && dept === '경영지원팀');
    // 나머지: 허용 (기존 동작)
    return true;
};

// 페이지 접근 가능 여부 판별
// userInfo: users 레코드, perms: page_permissions.perms JSONB (없으면 null)
window.canAccessPage = function(userInfo, perms, page) {
    if (!userInfo) return false;
    if (userInfo.user_type === 'super') return true;   // 슈퍼관리자 항상 허용

    var category = window.getPageCategory(page);

    if (perms) {
        // 1) 개별 페이지 설정이 우선
        if (perms.pages && perms.pages[page] !== undefined) return !!perms.pages[page];
        // 2) 대분류 설정
        if (perms.categories && category && perms.categories[category] !== undefined) return !!perms.categories[category];
    }
    // 3) 명시 설정 없으면 기본 권한
    return window.getDefaultAccess(userInfo, category);
};

// 대분류 접근 가능 여부 (사이드바 메뉴 표시용)
window.canAccessCategory = function(userInfo, perms, category) {
    if (!userInfo) return false;
    if (userInfo.user_type === 'super') return true;
    if (perms && perms.categories && perms.categories[category] !== undefined) return !!perms.categories[category];
    return window.getDefaultAccess(userInfo, category);
};

// 로그인 확인 함수 — 미로그인 시 login.html로 이동, 로그인 시 사용자 정보 반환
async function checkAuth() {
    var dbAuth = window.supabase.createClient(SUPABASE_URL_AG, SUPABASE_KEY_AG);

    var sessionResult = await dbAuth.auth.getSession();
    if (!sessionResult.data.session) {
        location.href = 'login.html';
        return null;
    }

    // sessionStorage 캐시 확인
    var cached = sessionStorage.getItem('userInfo');
    if (cached) {
        try {
            var userInfo = JSON.parse(cached);
            if (userInfo && userInfo.auth_user_id === sessionResult.data.session.user.id) {
                // 캐시된 권한으로 페이지 접근 체크
                var cachedPerms = null;
                try { cachedPerms = JSON.parse(sessionStorage.getItem('userPerms') || 'null'); } catch (e) {}
                userInfo._perms = cachedPerms;

                // 모니터 계정 체크
                if (userInfo.process === '모니터') {
                    var mp = location.pathname.split('/').pop();
                    var mAllowed = ['mold_layout.html', 'mold_dashboard.html', 'index.html', 'login.html'];
                    if (mAllowed.indexOf(mp) === -1) { location.href = 'mold_layout.html'; return null; }
                }

                var cp = location.pathname.split('/').pop();
                var skip = ['index.html', 'login.html', '', 'change_password.html'];
                if (skip.indexOf(cp) === -1 && !window.canAccessPage(userInfo, cachedPerms, cp)) {
                    alert('이 페이지에 접근할 권한이 없습니다.');
                    location.href = 'index.html';
                    return null;
                }
                return userInfo;
            }
        } catch (e) {}
    }

    // DB에서 사용자 정보 조회
    var userResult = await dbAuth.from('users')
        .select('*')
        .eq('auth_user_id', sessionResult.data.session.user.id)
        .single();

    if (!userResult.data) {
        alert('사용자 정보를 찾을 수 없어요.');
        await dbAuth.auth.signOut();
        location.href = 'login.html';
        return null;
    }

    if (!userResult.data.active) {
        alert('비활성화된 계정이에요.');
        await dbAuth.auth.signOut();
        location.href = 'login.html';
        return null;
    }

    // 비밀번호 미변경 시
    if (!userResult.data.password_changed) {
        location.href = 'https://pillippekim.github.io/project-moon/change_password.html';
        return null;
    }

    // 캐시 저장
    sessionStorage.setItem('userInfo', JSON.stringify(userResult.data));

    // 페이지 권한 로드 (page_permissions)
    var perms = null;
    try {
        var permResult = await dbAuth.from('page_permissions')
            .select('perms')
            .eq('emp_code', userResult.data.emp_code)
            .maybeSingle();
        if (permResult.data && permResult.data.perms) {
            perms = permResult.data.perms;
        }
    } catch (e) { perms = null; }
    sessionStorage.setItem('userPerms', JSON.stringify(perms));
    userResult.data._perms = perms;

    // 모니터 전용 계정: 적치대 + 대시보드만 접근 허용
    if (userResult.data.process === '모니터') {
        var currentPage = location.pathname.split('/').pop();
        var monitorAllowed = ['mold_layout.html', 'mold_dashboard.html', 'index.html', 'login.html'];
        var isAllowed = false;
        for (var i = 0; i < monitorAllowed.length; i++) {
            if (currentPage === monitorAllowed[i]) { isAllowed = true; break; }
        }
        if (!isAllowed) {
            location.href = 'mold_layout.html';
            return null;
        }
    }

    // 페이지 접근 권한 체크 (page_permissions 기반)
    var curPage = location.pathname.split('/').pop();
    var skipCheck = ['index.html', 'login.html', '', 'change_password.html'];
    if (skipCheck.indexOf(curPage) === -1) {
        if (!window.canAccessPage(userResult.data, perms, curPage)) {
            alert('이 페이지에 접근할 권한이 없습니다.');
            location.href = 'index.html';
            return null;
        }
    }

    return userResult.data;
}

// 로그아웃
async function logout() {
    var dbAuth = window.supabase.createClient(SUPABASE_URL_AG, SUPABASE_KEY_AG);
    await dbAuth.auth.signOut();
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('userPerms');
    location.href = 'login.html';
}
