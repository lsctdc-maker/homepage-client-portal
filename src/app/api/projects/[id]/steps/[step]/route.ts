import { NextRequest, NextResponse } from 'next/server'
import { Project } from '@/types'
import fs from 'fs/promises'
import path from 'path'

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
const projects: { [key: string]: Project } = {}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; step: string } }
) {
  try {
    const projectId = params.id
    const step = parseInt(params.step)
    const project = projects[projectId]

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const stepData = await request.json()

    // 단계별 데이터를 NAS에 저장
    await saveStepDataToNAS(projectId, step, stepData)

    // 프로젝트 진행 상황 업데이트
    const updatedProject = {
      ...project,
      progress: {
        ...project.progress,
        [`step${step}`]: true,
      },
      updatedAt: new Date(),
    }

    // 완료율 계산
    const completedSteps = Object.values(updatedProject.progress).filter(Boolean).length
    updatedProject.completionRate = Math.round((completedSteps / 7) * 100)

    projects[projectId] = updatedProject

    // 모든 단계 완료 시 알림
    if (updatedProject.completionRate === 100) {
      await sendCompletionNotification(updatedProject)
    }

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error saving step data:', error)
    return NextResponse.json(
      { error: 'Failed to save step data' },
      { status: 500 }
    )
  }
}

// NAS에 단계별 데이터 저장
async function saveStepDataToNAS(projectId: string, step: number, data: any) {
  const project = projects[projectId]
  if (!project) return

  const folderNames = {
    1: '01_기업정보',
    2: '02_호스팅도메인',
    3: '03_메일설정',
    4: '04_SEO정보',
    5: '05_디자인레퍼런스',
    6: '06_사이트맵',
    7: '07_홈페이지자료'
  }

  const projectFolderName = `${project.companyName}_${new Date().toISOString().split('T')[0]}_${projectId.slice(0, 8)}`
  const stepFolder = folderNames[step as keyof typeof folderNames]

  // JSON 파일로 데이터 저장
  const jsonData = {
    projectId,
    step,
    data,
    savedAt: new Date().toISOString(),
  }

  // 실제 구현에서는 NAS 경로 사용
  const localPath = path.join(process.cwd(), 'temp', projectFolderName, stepFolder)
  
  try {
    // 디렉토리 생성
    await fs.mkdir(localPath, { recursive: true })
    
    // 데이터 저장
    await fs.writeFile(
      path.join(localPath, `step${step}_data.json`),
      JSON.stringify(jsonData, null, 2),
      'utf-8'
    )

    console.log(`Saved step ${step} data to ${localPath}`)
  } catch (error) {
    console.error('Failed to save step data:', error)
    throw error
  }
}

// 완료 알림 전송
async function sendCompletionNotification(project: Project) {
  try {
    // 이메일 발송
    const emailData = {
      to: project.email,
      subject: `[통컴퍼니] ${project.companyName} 홈페이지 자료 수집이 완료되었습니다`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0099cc;">자료 수집 완료!</h2>
          <p>안녕하세요, ${project.managerName}님.</p>
          <p><strong>${project.companyName}</strong> 홈페이지 제작을 위한 모든 자료가 성공적으로 수집되었습니다.</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0369a1;">수집 완료 내역:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>✅ 기업 및 관리 담당자 정보</li>
              <li>✅ 호스팅 및 도메인 정보</li>
              <li>✅ 메일 정보</li>
              <li>✅ SEO 세팅</li>
              <li>✅ 디자인 레퍼런스</li>
              <li>✅ 사이트맵</li>
              <li>✅ 홈페이지 자료</li>
            </ul>
          </div>
          <p>곧 홈페이지 제작 작업을 시작하겠습니다. 추가 문의사항이 있으시면 언제든 연락 주세요.</p>
          <p style="margin-top: 30px;">
            <strong>통컴퍼니</strong><br>
            📞 02-402-2589<br>
            📧 tong@tongcompany.co.kr
          </p>
        </div>
      `
    }

    // 실제 이메일 발송 로직 구현
    console.log('Sending completion email to:', project.email)
    
    // 관리자에게도 알림
    console.log('Notifying admin about project completion:', project.id)
  } catch (error) {
    console.error('Failed to send completion notification:', error)
  }
}