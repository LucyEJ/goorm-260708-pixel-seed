# Pixel Seed Landing Page

> 하루를 시작하는 가장 작은 영감, AI가 그려주는 픽셀 아트와 함께.

Pixel Seed 제품 소개용 단일 페이지 랜딩 사이트입니다.  
빌드 도구 없이 **HTML, CSS, JavaScript**만으로 구성되어 있으며, 브라우저에서 `index.html`을 열면 바로 확인할 수 있습니다.

**Repository:** [LucyEJ/goorm-260708-pixel-seed](https://github.com/LucyEJ/goorm-260708-pixel-seed)

---

## 주요 작업 내용

### 1. 프로젝트 개요

- 앱 소개서([`Ref/spec_pixel art.txt`](Ref/spec_pixel%20art.txt))를 바탕으로 **Pixel Seed** 제품 랜딩페이지 구현
- **Anthropic Light / Dark Theme** 지원 (warm ivory canvas ↔ slate dark canvas, clay CTA)
- 별도 이미지 에셋 없이 **inline SVG/CSS 픽셀 아트 목업**으로 16bit 감성 표현
- **한국어 / English / 日本語** 다국어 지원

### 2. 기술 스택

| 구분 | 내용 |
|------|------|
| 마크업 | HTML5 (시맨틱 태그, `lang` 동적 전환, OG 메타) |
| 스타일 | CSS Custom Properties, Light/Dark 토큰, 모바일 퍼스트 반응형 |
| 스크립트 | Vanilla JavaScript (빌드/프레임워크 없음), `localStorage` 설정 유지 |

### 3. 파일 구조

```
260708/
├── index.html          # 랜딩페이지 본문 + 언어/테마 토글 UI
├── css/
│   ├── tokens.css      # Anthropic Light / Dark Theme 디자인 토큰
│   ├── base.css        # 리셋, 타이포, 버튼, 모달, reveal
│   └── main.css        # 섹션·컴포넌트·토글·반응형 레이아웃
├── js/
│   ├── i18n.js         # ko / en / ja 번역 사전
│   └── main.js         # 언어·테마·모달·스크롤·rotator 등
├── Ref/
│   └── spec_pixel art.txt
└── README.md
```

### 4. 페이지 섹션

1. **Sticky Header** — 로고, `KO/EN/JA` 언어 토글, Light/Dark 테마 토글, 앵커 네비, Coming Soon CTA
2. **Hero** — 핵심 헤드라인, 가치 제안, 픽셀 씬 SVG, CTA
3. **문제 → 해결** — 명언 앱 한계 vs 매일 다른 픽셀 아트 (3장 rotator)
4. **핵심 기능 5종** — Daily Thought, AI Pixel Art, Pixel Companion, Home Widget, Archive
5. **차별화** — 기존 앱 vs Pixel Seed 비교 플로우 + Gemini API 기술 소개
6. **타겟 사용자** — Primary / Secondary / Tertiary 페르소나 카드
7. **사용자 경험** — 매일 아침 5단계 루틴 타임라인
8. **Closing CTA** — 감정 경험 메시지 + Coming Soon
9. **Footer** — dark band Anthropic 스타일 푸터

### 5. 디자인 시스템

#### Anthropic Light Theme

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-canvas` | `#faf9f5` | 페이지 배경 |
| `--color-surface` | `#f0eee6` | 카드/섹션 배경 |
| `--color-manilla` | `#f5e3c7` | 히어로·강조 카드 |
| `--color-ink` | `#141413` | 제목 |
| `--color-clay` | `#d97757` | CTA/강조 |
| `--color-footer` | `#141413` | 푸터 배경 |

#### Anthropic Dark Theme (`[data-theme="dark"]`)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-canvas` | `#141413` | 페이지 배경 |
| `--color-surface` | `#1a1a18` | 카드/섹션 배경 |
| `--color-manilla` | `#2c2419` | 강조 카드 |
| `--color-ink` | `#faf9f5` | 제목 |
| `--color-clay` | `#d97757` | CTA/강조 (유지) |
| `--color-footer` | `#0c0c0b` | 푸터 배경 |

- Display/H1~H2: `Georgia, "Times New Roman", serif`
- Body/UI: `system-ui, "Segoe UI", "Hiragino Sans", "Noto Sans JP", sans-serif`
- 섹션 surface alternation, 얕은 border, 그림자 최소화

### 6. 다국어 & 테마

| 기능 | 설명 |
|------|------|
| 언어 토글 | 헤더 `KO / EN / JA` 세그먼트 버튼 ([`js/i18n.js`](js/i18n.js)) |
| 테마 토글 | 라이트 ↔ Anthropic Dark Theme (달/해 아이콘) |
| 적용 방식 | `data-i18n` / `data-i18n-html` / `data-i18n-aria` 속성 + `data-theme` |
| 저장 | `localStorage`에 언어·테마 유지 |
| FOUC 방지 | `<head>` 인라인 스크립트로 저장된 설정 즉시 적용 |

### 7. JavaScript 인터랙션

| 기능 | 설명 |
|------|------|
| Coming Soon 모달 | CTA 클릭 시 준비 중 안내, ESC/backdrop 닫기, 포커스 트랩 |
| Smooth scroll | 앵커 링크 부드러운 스크롤 |
| Scroll reveal | `IntersectionObserver` 기반 fade-up (`html.js .reveal`) |
| Art rotator | 새싹/여우/캠프파이어 SVG 4초 자동 전환 |
| Companion highlight | 캐릭터 성장 단계 순차 highlight |
| Mobile nav | 768px 이하 햄버거 메뉴 |
| Reduced motion | `prefers-reduced-motion` 시 애니메이션·자동 전환 비활성화 |

### 8. 접근성

- Skip link, `role="dialog"`, `aria-modal`, `aria-labelledby`
- `:focus-visible` 아웃라인
- 키보드만으로 네비·언어/테마 토글·CTA·모달 조작 가능

---

## 오류 수정 사항

구현 과정에서 발견·수정한 항목입니다.

| # | 문제 | 수정 |
|---|------|------|
| 1 | 본문/푸터에 `픽셀 아rt` 오타 (영문 `rt` 혼입) | `픽셀 아트`로 통일 ([`index.html`](index.html)) |
| 2 | Hero 비주얼 컨테이너에 `aria-hidden="true"`가 설정되어, 내부 SVG `aria-label`과 충돌 | 컨테이너 `aria-hidden` 제거 → 스크린 리더가 픽셀 씬 설명 접근 가능 |
| 3 | `prefers-reduced-motion` 미적용 시 rotator/reveal이 과도하게 동작 | CSS·JS 양쪽에서 reduced motion 분기 처리 |
| 4 | 모바일 nav 열린 상태에서 메뉴 클릭 후 패널이 닫히지 않음 | 링크 클릭 시 `is-open` 클래스 및 `aria-expanded` 초기화 ([`js/main.js`](js/main.js)) |
| 5 | **본문 전체가 보이지 않음** — `applyLanguage()`가 `navToggle`/`siteNav` 선언보다 먼저 실행되며 `ReferenceError` 발생 → reveal 스크립트가 중단되고 `.reveal { opacity: 0 }` 상태로 고정 | 초기화 순서를 nav 참조 선언 이후로 변경. 추가로 JS 실패 시에도 본문이 보이도록 reveal을 `html.js .reveal`로만 숨기도록 CSS 안전장치 추가 |

---

## 실행 방법

1. 저장소 클론 또는 파일 다운로드
2. `index.html`을 웹 브라우저로 열기

```bash
# Windows (기본 브라우저)
start index.html

# macOS
open index.html
```

로컬 서버 없이도 CSS/JS가 정상 동작합니다.

헤더에서 **KO / EN / JA**와 **달·해 아이콘**으로 언어·테마를 바로 전환할 수 있습니다.

---

## 범위 밖 (미구현)

- 이메일 수집/백엔드, App Store 링크
- Gemini API 실연동 (기술 소개 텍스트만 포함)
- 빌드 파이프라인 (Vite, Webpack 등)

---

## 라이선스

© 2026 Pixel Seed. All rights reserved.
