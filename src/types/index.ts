// 프로젝트 데이터 타입 정의
export interface Project {
  id: string;
  companyName: string;
  managerName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'paused';
  progress: {
    step1: boolean; // 기업 및 관리 담당자 정보
    step2: boolean; // 호스팅 및 도메인 정보
    step3: boolean; // 메일 정보
    step4: boolean; // SEO 세팅
    step5: boolean; // 디자인 레퍼런스
    step6: boolean; // 사이트맵
    step7: boolean; // 홈페이지 자료
  };
  completionRate: number;
  // 단계별 저장된 데이터
  step1Data?: Step1Data;
  step2Data?: Step2Data;
  step3Data?: Step3Data;
  step4Data?: Step4Data;
  step5Data?: Step5Data;
  step6Data?: Step6Data;
  step7Data?: Step7Data;
}

// 단계별 데이터 타입
export interface Step1Data {
  manager: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  company: {
    name: string;
    representative: string;
    address: string;
    businessNumber: string;
    phone: string;
    fax?: string;
    email: string;
  };
}

export interface Step2Data {
  hosting: {
    provider: string;
    id: string;
    password: string;
    ftpDbPassword: string;
  };
  domain: {
    provider: string;
    address: string;
    id: string;
    password: string;
  };
}

export interface Step3Data {
  mailRecords: {
    type: 'MX' | 'CNAME' | 'TXT';
    host: string;
    value: string;
    priority?: number;
  }[];
}

export interface Step4Data {
  google: {
    id: string;
    password: string;
  };
  naver: {
    id: string;
    password: string;
  };
  siteInfo: {
    title: string;
    description: string;
  };
}

export interface Step5Data {
  references: {
    site: string;
    templateName?: string;
    description: string;
  }[];
}

export interface Step6Data {
  menuStructure: {
    primaryMenu: string[];
    secondaryMenu: { [key: string]: string[] };
  };
}

export interface Step7Data {
  uploadedFiles: {
    category: string;
    files: FileInfo[];
  }[];
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  uploadPath: string;
  uploadedAt: Date;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 알림 타입
export interface Notification {
  id: string;
  projectId: string;
  type: 'reminder' | 'completion' | 'warning';
  message: string;
  createdAt: Date;
  read: boolean;
}