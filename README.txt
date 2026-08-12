구급차 이송요금 계산기 - PWA 1차 버전

구성:
- index.html
- style.css
- app.js
- manifest.json
- service-worker.js
- icon.svg

중요:
PWA 설치/서비스워커는 보안상 file://로 index.html을 직접 열 때는 정상 동작하지 않을 수 있습니다.
HTTPS 웹주소 또는 localhost에서 실행해야 합니다.

가장 쉬운 테스트:
1. PC에서 이 폴더를 웹서버로 실행
2. 휴대폰과 같은 네트워크에서 접속
3. Android Chrome에서 "홈 화면에 추가" 또는 "앱 설치"
4. iPhone Safari에서는 공유 메뉴 → 홈 화면에 추가

현재 버전은 GPS 없이 거리와 대기시간을 직접 입력하는 임시 계산기입니다.
