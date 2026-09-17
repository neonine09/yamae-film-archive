# tokyo_Valentine — X Film Archive

E:\코덱스\스레드 게시물\tokyo_Valentine에 따로 만든 로컬 전용 아카이브입니다.

- 대상: https://x.com/tokyo_Valentine
- 공개 X 페이지에서 확인된 AI 영상 61개
- 오래된 영상부터 001번, 첫 화면은 최신순
- 데스크톱 5열 / 태블릿 4·3열 / 모바일 2열
- 검색, 정렬 전환, 무한 로딩, 영상 미리보기 모달
- 영상은 X 공개 CDN 링크로 재생하며 이 폴더에 원본 영상을 복제하지 않음
- posts.js, posts-extra-a.js, posts-extra-b.js에 영상 목록을 분리해 보관
- GitHub Pages 배포 설정 없음

## 로컬 실행

PowerShell에서 다음처럼 실행하세요.

    Set-Location "E:\코덱스\스레드 게시물\tokyo_Valentine"
    python -m http.server 4174

브라우저에서 http://127.0.0.1:4174 를 열면 됩니다.

X 공개 미디어 주소가 변경되거나 만료되면 카드의 X에서 원문 열기 링크를 사용하세요.
