import { NextRequest, NextResponse } from 'next/server'
import { Project } from '@/types'

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
const projects: { [key: string]: Project } = {}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const project = projects[projectId]

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

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
    const project = projects[projectId]

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

    projects[projectId] = updatedProject
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}