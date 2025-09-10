# 통컴퍼니 클라이언트 포털 시스템

홈페이지 제작을 위한 클라이언트 자료 수집 및 관리 시스템입니다.

## ✨ 주요 기능

### 📋 클라이언트 기능
- **7단계 자료 수집**: 체계적인 단계별 정보 입력
- **실시간 진행률 추적**: 시각적 진행 상황 확인
- **파일 업로드**: 드래그 앤 드롭으로 간편한 파일 업로드
- **자동 저장**: 입력한 정보의 자동 저장
- **모바일 반응형**: 모든 기기에서 최적화된 경험

### 🔧 관리자 기능
- **프로젝트 모니터링**: 전체 프로젝트 현황 대시보드
- **진행률 추적**: 프로젝트별 완료율 및 상태 관리
- **자동 알림**: 단계 완료 및 리마인더 이메일 발송
- **NAS 연동**: 자동 폴더 생성 및 파일 관리

### 🚀 시스템 기능
- **NAS 자동 연동**: SMB/CIFS 프로토콜을 통한 파일 동기화
- **이메일 알림**: SMTP를 통한 자동 알림 발송
- **크론잡 지원**: 자동 리마인더 및 정기 작업
- **보안 파일 업로드**: 파일 형식 및 크기 검증

## 🏗️ 시스템 구조

```
📁 프로젝트명_날짜_ID/
├── 📂 01_기업정보/
├── 📂 02_호스팅도메인/
├── 📂 03_메일설정/
├── 📂 04_SEO정보/
├── 📂 05_디자인레퍼런스/
├── 📂 06_사이트맵/
└── 📂 07_홈페이지자료/
    ├── 📄 로고/
    ├── 📄 회사소개/
    └── 📄 [메뉴별 자료]/
```

## 📊 수집하는 자료

### 1단계: 기업 및 관리 담당자 정보
- 담당자 정보 (이름, 직함, 연락처, 이메일)
- 회사 정보 (회사명, 대표자, 주소, 사업자등록번호)

### 2단계: 호스팅 및 도메인 정보
- 호스팅 정보 (업체, 계정정보, FTP/DB 접근 정보)
- 도메인 정보 (등록업체, 도메인 주소, 관리 계정)

### 3단계: 메일 정보
- DNS 레코드 (MX, CNAME, TXT/SPF)
- 회사 메일 서버 설정 정보

### 4단계: SEO 세팅
- 구글/네이버 웹마스터 도구 계정
- 사이트 제목 및 설명 (메타 정보)

### 5단계: 디자인 레퍼런스
- 참고 사이트 URL
- 원하는 디자인 스타일 설명
- 통컴퍼니 템플릿 선택

### 6단계: 사이트맵
- 1차 메뉴 구성
- 2차 메뉴 (서브메뉴) 구조

### 7단계: 홈페이지 자료
- 로고 파일 (AI, PNG, PDF)
- 회사 소개 자료
- 제품/서비스 이미지
- 기타 컨텐츠 자료

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn
- NAS 시스템 (SMB/CIFS 지원)

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/tongcompany/client-portal.git
cd client-portal
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 설정 입력
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
```
http://localhost:3000
```

### 프로덕션 배포

1. **빌드**
```bash
npm run build
```

2. **프로덕션 서버 실행**
```bash
npm start
```

## 📧 이메일 설정

### Gmail 사용 시
1. Gmail에서 앱 비밀번호 생성
2. `.env.local`에 설정:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 회사 메일 서버 사용 시
```env
SMTP_HOST=mail.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASS=your-email-password
```

## 💾 NAS 연동 설정

### SMB/CIFS 설정
```env
NAS_HOST=192.168.1.100
NAS_USERNAME=admin
NAS_PASSWORD=your-nas-password
NAS_BASE_PATH=/projects
```

### 폴더 권한 설정
- NAS에서 `/projects` 폴더 생성
- 웹 서버 계정에 읽기/쓰기 권한 부여
- 자동 폴더 생성을 위한 권한 설정

## ⏰ 자동 알림 설정

### Vercel Cron 사용
`vercel.json` 파일:
```json
{
  "crons": [
    {
      "path": "/api/cron/reminder",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### 외부 크론잡 서비스
- URL: `https://your-domain.com/api/cron/reminder`
- Method: GET
- Header: `Authorization: Bearer your-secret-key`
- 스케줄: 매일 오전 9시 (`0 9 * * *`)

## 📱 사용법

### 클라이언트
1. **프로젝트 시작**: 홈페이지에서 "새 프로젝트 시작"
2. **기본 정보 입력**: 회사명, 담당자 정보 입력
3. **단계별 진행**: 7단계에 걸쳐 순차적으로 정보 입력
4. **파일 업로드**: 각 단계에서 필요한 파일 업로드
5. **완료 확인**: 모든 단계 완료 시 자동 알림 발송

### 관리자
1. **관리자 모드**: `/admin` 경로로 접속
2. **프로젝트 모니터링**: 전체 프로젝트 현황 확인
3. **진행률 추적**: 각 프로젝트의 완료율 및 상태 확인
4. **수동 리마인더**: 필요 시 개별 프로젝트에 리마인더 발송

## 🔧 커스터마이징

### 브랜딩 변경
- `src/lib/constants.ts`에서 회사 정보 수정
- `tailwind.config.js`에서 색상 테마 변경
- 로고 및 이미지 교체

### 단계 추가/수정
1. `src/types/index.ts`에서 데이터 타입 정의
2. `src/lib/constants.ts`에서 단계 정보 추가
3. `src/components/steps/`에 새 단계 컴포넌트 생성
4. 백엔드 API 업데이트

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **UI/UX**: Framer Motion, Headless UI, Heroicons
- **파일 처리**: React Dropzone, Multer
- **이메일**: Nodemailer
- **폼 관리**: React Hook Form, Zod
- **NAS 연동**: node-smb2

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 통컴퍼니의 소유입니다.

## 📞 지원

- **이메일**: tong@tongcompany.co.kr
- **전화**: 02-402-2589
- **웹사이트**: [통컴퍼니](https://tongcompany.co.kr)

---

**통컴퍼니** | 행복한 소통으로 고객의 가치에 기여하겠습니다.