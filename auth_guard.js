/* ===== work-manager 권한 체크 모듈 ===== */
/* 각 페이지 <script> 시작 부분에서 checkAuth() 호출 */

var SUPABASE_URL_AG = 'https://vpaixxlhzkwtgcllimvn.supabase.co';
var SUPABASE_KEY_AG = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYWl4eGxoemt3dGdjbGxpbXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzk4NjMsImV4cCI6MjA5MTk1NTg2M30.V8Bj0cMbM0E2TFhklYYa7TM-vO6Fi70ctACA7uUf4Ig';

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

    // 모니터 전용 계정: 적치대 + 대시보드/이력만 접근 허용
    if (userResult.data.process === '모니터') {
        var currentPage = location.pathname.split('/').pop();
        if (currentPage !== 'mold_layout.html' && currentPage !== 'mold_dashboard.html') {
            location.href = 'mold_layout.html';
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
    location.href = 'login.html';
}
