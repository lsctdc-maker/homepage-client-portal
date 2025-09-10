// 단계별 정보
export const STEPS = [
  {
    id: 1,
    title: '기업 및 관리 담당자 정보',
    description: '작업 시 연락을 주고 받을 담당자와 홈페이지 하단에 들어갈 회사 정보',
    icon: '🏢',
  },
  {
    id: 2,
    title: '호스팅 및 도메인 정보',
    description: '홈페이지 작업을 위한 전반적인 기본 정보',
    icon: '🌐',
  },
  {
    id: 3,
    title: '메일 정보',
    description: '포털사이트가 아닌 회사 메일을 사용하는 경우',
    icon: '📧',
  },
  {
    id: 4,
    title: 'SEO 세팅',
    description: '포털사이트에 홈페이지 검색을 등록하기 위해 필요한 정보',
    icon: '🔍',
  },
  {
    id: 5,
    title: '디자인 레퍼런스',
    description: '홈페이지 제작의 방향성을 알기 위한 참고 사이트',
    icon: '🎨',
  },
  {
    id: 6,
    title: '사이트맵',
    description: '원하는 레퍼런스 사이트의 메뉴를 참조한 메뉴 구성',
    icon: '🗂️',
  },
  {
    id: 7,
    title: '홈페이지 자료',
    description: '로고 및 메뉴 구성에 맞는 컨텐츠 자료',
    icon: '📁',
  },
] as const;

// NAS 폴더 구조
export const NAS_FOLDER_STRUCTURE = [
  '01_기업정보',
  '02_호스팅도메인',
  '03_메일설정',
  '04_SEO정보',
  '05_디자인레퍼런스',
  '06_사이트맵',
  '07_홈페이지자료',
] as const;

// 파일 업로드 설정
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.adobe.illustrator',
    'application/postscript', // .ai files
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.zip', '.ai'],
} as const;

// 알림 메시지
export const NOTIFICATION_MESSAGES = {
  STEP_COMPLETED: (step: number) => `${STEPS[step - 1].title} 단계가 완료되었습니다.`,
  REMINDER: (step: number) => `${STEPS[step - 1].title} 단계의 자료를 제출해주세요.`,
  PROJECT_COMPLETED: '모든 자료 수집이 완료되었습니다.',
  FILE_UPLOADED: '파일이 성공적으로 업로드되었습니다.',
} as const;