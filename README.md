# 캠퍼스 수강신청 홈페이지

학교 수강신청 화면을 구현한 정적 웹사이트입니다. 별도의 서버나 설치 없이 실행할 수 있으며 GitHub Pages에 바로 배포할 수 있습니다.

## 주요 기능

- 과목명, 교수명, 학수번호 검색
- 학과 및 학년 필터
- 최대 신청 학점 검사
- 강의시간 중복 검사
- 정원 마감 처리
- 수강 신청 및 취소
- 신청 과목 시간표 표시
- 브라우저 LocalStorage 자동 저장
- 모바일 반응형 화면

## 실행 방법

`index.html` 파일을 브라우저에서 열면 됩니다.

VS Code를 사용하는 경우 Live Server 확장 프로그램으로 실행할 수도 있습니다.

## GitHub에 올리는 방법

```bash
git init
git add .
git commit -m "feat: 수강신청 홈페이지 구현"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

## GitHub Pages 배포

1. GitHub 저장소의 `Settings`로 이동합니다.
2. 왼쪽 메뉴에서 `Pages`를 선택합니다.
3. `Deploy from a branch`를 선택합니다.
4. Branch를 `main`, 폴더를 `/root`로 설정합니다.
5. Save를 누릅니다.

## 파일 구조

```text
course-registration-site/
├─ index.html
├─ README.md
└─ assets/
   ├─ style.css
   └─ app.js
```

## 수정할 부분

- 학생 정보: `index.html` 상단의 홍길동 정보
- 과목 정보: `assets/app.js`의 `courses` 배열
- 최대 학점: `assets/app.js`의 `MAX_CREDITS`
- 학교명 및 학기: `index.html`의 상단 제목
