import { NextRequest, NextResponse } from 'next/server'
import { Project } from '@/types'
import { projectStorage } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    console.log(`🔍 API: Searching for project: ${projectId}`)
    
    // 저장소 디버그 정보 출력
    projectStorage.debug()
    
    const project = projectStorage.get(projectId)

    if (!project) {
      console.error(`❌ Project not found: ${projectId}`)
      return NextResponse.json(
        { 
          error: 'Project not found',
          projectId: projectId,
          message: '프로젝트를 찾을 수 없습니다. 프로젝트 ID를 확인해주세요.'
        },
        { status: 404 }
      )
    }

    console.log(`✅ Project found: ${project.companyName}`)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const project = projectStorage.get(projectId)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const updates = await request.json()
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    }

    projectStorage.set(projectId, updatedProject)
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}