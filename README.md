# Homepage Client Portal

통컴퍼니 홈페이지 제작을 위한 클라이언트 포털 시스템

## 📋 프로젝트 개요

클라이언트가 홈페이지 제작에 필요한 정보를 단계별로 입력하고 파일을 업로드할 수 있는 웹 포털입니다.

## ✨ 주요 기능

- **단계별 정보 수집**: 7단계로 구성된 체계적인 정보 수집
- **파일 업로드**: 디자인 자료, 로고, 참고 자료 등 업로드
- **진행률 추적**: 실시간 프로젝트 진행 상황 확인
- **자동 알림**: 이메일을 통한 진행 상황 알림
- **NAS 연동**: 자동 파일 저장 및 관리
- **관리자 대시보드**: 전체 프로젝트 관리 및 모니터링

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/[username]/homepage-client-portal.git
cd homepage-client-portal

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 실제 설정값 입력

# 개발 서버 실행
npm run dev
```

http://localhost:3000에서 앱에 접근할 수 있습니다.

## 📝 단계별 정보 수집

1. **기업 정보**: 회사명, 담당자, 연락처
2. **호스팅 & 도메인**: 호스팅 정보, 도메인 설정
3. **메일 설정**: 이메일 계정 및 설정
4. **SEO 정보**: 검색엔진 최적화 설정
5. **디자인 레퍼런스**: 참고 사이트, 디자인 방향
6. **사이트맵**: 페이지 구조 및 메뉴 설정
7. **홈페이지 자료**: 로고, 이미지, 콘텐츠 등

## 🔧 환경 변수

```env
# 앱 설정
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 이메일 설정
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=465
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password

# 관리자 설정
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_SECRET_KEY=your-secret-key

# NAS 설정 (선택사항)
NAS_HOST=your-nas-ip
NAS_USERNAME=your-username
NAS_PASSWORD=your-password
```

## 🚀 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해주세요:

- `NEXT_PUBLIC_BASE_URL`: 배포된 앱의 URL
- `ADMIN_EMAIL`: 관리자 이메일
- `ADMIN_SECRET_KEY`: 관리자 인증 키
- `SMTP_*`: 이메일 설정 (선택사항)

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 13 App Router
│   ├── api/               # API 라우트
│   ├── admin/             # 관리자 페이지
│   ├── project/           # 프로젝트 관련 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── steps/             # 단계별 폼 컴포넌트
│   └── ...
├── lib/                   # 유틸리티 함수
└── types/                 # TypeScript 타입 정의
```

## 🔒 보안

- 민감한 정보는 환경 변수로 관리
- 파일 업로드 시 타입 및 크기 검증
- 관리자 페이지 접근 제한

## 📞 지원

문의사항이 있으시면 admin@tongcompany.co.kr로 연락주세요.

---

🤖 Built with [Claude Code](https://claude.ai/code)