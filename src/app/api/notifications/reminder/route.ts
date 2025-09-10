import { NextRequest, NextResponse } from 'next/server'
import { sendReminderNotification } from '@/lib/notifications'
import { Project } from '@/types'

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
const projects: { [key: string]: Project } = {}

export async function POST(request: NextRequest) {
  try {
    // 미완성 프로젝트 찾기 (3일 이상 업데이트가 없는 경우)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const projectsNeedingReminder = Object.values(projects).filter(project => {
      const lastUpdate = new Date(project.updatedAt)
      const isIncomplete = project.completionRate < 100
      const isStale = lastUpdate < threeDaysAgo
      
      return isIncomplete && isStale && project.status === 'active'
    })

    let sentCount = 0
    const results = []

    for (const project of projectsNeedingReminder) {
      try {
        await sendReminderNotification(project)
        sentCount++
        results.push({ projectId: project.id, status: 'sent' })
      } catch (error) {
        console.error(`Failed to send reminder for project ${project.id}:`, error)
        results.push({ projectId: project.id, status: 'failed', error: (error as Error).message })
      }
    }

    return NextResponse.json({
      success: true,
      message: `${sentCount} reminder notifications sent`,
      totalProjects: projectsNeedingReminder.length,
      results
    })

  } catch (error) {
    console.error('Error sending reminder notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send reminder notifications' },
      { status: 500 }
    )
  }
}

// 특정 프로젝트에 리마인더 발송
export async function PUT(request: NextRequest) {
  try {
    const { projectId } = await request.json()
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const project = projects[projectId]
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.completionRate >= 100) {
      return NextResponse.json(
        { error: 'Project is already completed' },
        { status: 400 }
      )
    }

    await sendReminderNotification(project)

    return NextResponse.json({
      success: true,
      message: 'Reminder notification sent successfully'
    })

  } catch (error) {
    console.error('Error sending reminder notification:', error)
    return NextResponse.json(
      { error: 'Failed to send reminder notification' },
      { status: 500 }
    )
  }
}