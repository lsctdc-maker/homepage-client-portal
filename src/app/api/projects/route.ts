import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { Project } from '@/types'
import { nasClient } from '@/lib/nas'
import { projectStorage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, managerName, email, phone } = body

    // 프로젝트 생성
    const projectId = uuidv4()
    const newProject: Project = {
      id: projectId,
      companyName,
      managerName,
      email,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      progress: {
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
        step6: false,
        step7: false,
      },
      completionRate: 0,
    }

    projectStorage.set(projectId, newProject)

    // NAS에 프로젝트 폴더 구조 생성 (실패해도 프로젝트 생성 계속 진행)
    try {
      const folderName = await nasClient.createProjectFolder(projectId, companyName)
      console.log(`📁 Project folder prepared: ${folderName}`)
    } catch (error) {
      console.error('⚠️ Failed to create NAS folder:', error)
      console.log('✅ Continuing with project creation (NAS is optional)')
      // NAS 폴더 생성 실패해도 프로젝트는 생성
    }

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 모든 프로젝트 목록 반환 (관리자용)
    const projectList = projectStorage.getAll()
    return NextResponse.json(projectList)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

