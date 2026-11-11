# vendor — 외부 라이브러리 자체 호스팅 (2026-11-05)

CDN 의존 제거(장애·변조 방어, 버전 고정). 출처는 npm 공식 패키지, 파일명에 버전 포함.

| 파일 | 패키지 | 원본 경로 |
|---|---|---|
| supabase-2.119.0.js | @supabase/supabase-js@2.119.0 | dist/umd/supabase.js |
| xlsx-0.18.5.full.min.js | xlsx@0.18.5 | dist/xlsx.full.min.js |
| qrcode-generator-1.4.4.js | qrcode-generator@1.4.4 | qrcode.js |
| html2canvas-1.4.1.min.js | html2canvas@1.4.1 | dist/html2canvas.min.js (2026-11-11 문의 위젯 "이 화면 캡처", 버튼 누를 때만 로드) |

업데이트 절차: 새 버전 파일을 **새 이름**으로 추가 → HTML 의 경로를 바꿔 배포 → 문제 없으면 옛 파일 삭제. (파일을 같은 이름으로 덮어쓰지 말 것 — 브라우저 캐시 혼선)
