# 🖥 MyEnglishVocab - Frontend

본 레포지토리는 MyEnglishVocab 서비스의 사용자 인터페이스와 클라이언트 로직을 담당합니다.

## 🛠 Tech Stack
- **Library**: React, TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State & Context**: Context API (Profile Management)
- **Styling**: CSS Modules (Responsive Design)

## ✨ UI/UX Highlights
- **Mobile First**: 768px 이하 화면에서 테이블을 카드형 리스트로 자동 변환하여 모바일 학습 편의성을 극대화했습니다.
- **Interactive Quiz**: 학습자의 인지 부하를 줄이기 위해 단어와 예문을 먼저 노출하고, 인터랙션을 통해 뜻을 확인하는 퀴즈 기능을 구현했습니다.

## 🔍 Troubleshooting
- **SPA 404 Refresh Issue**: 클라이언트 사이드 라우팅(React Router) 사용 시 새로고침할 경우 Vercel 서버가 경로를 찾지 못하는 문제를 `vercel.json`의 `rewrites` 설정을 통해 모든 경로를 `index.html`로 리다이렉트하여 해결했습니다.
- **Input Field Zoom Issue**: 모바일 환경에서 입력창 포커스 시 화면이 강제로 확대되는 현상을 방지하기 위해 `font-size: 16px`를 적용하고 `touch-action`을 최적화했습니다.

## 🚀 How to Run
```bash
npm install
npm run dev
```
