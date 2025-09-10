import { NextRequest, NextResponse } from 'next/server'

// 크론잡 API 엔드포인트 (자동 리마인더 발송)
export async function GET(request: NextRequest) {
  try {
    // 인증 확인 (크론잡 서비스에서 호출하는 경우)
    const authHeader = request.headers.get('Authorization')
    const expectedAuth = process.env.CRON_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 리마인더 알림 발송 API 호출
    const reminderResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications/reminder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!reminderResponse.ok) {
      throw new Error('Failed to send reminder notifications')
    }

    const result = await reminderResponse.json()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { 
        error: 'Cron job failed',
        timestamp: new Date().toISOString(),
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}

// 수동으로 크론잡 실행 (테스트용)
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인 (실제 환경에서는 JWT 토큰 등으로 검증)
    const { adminKey } = await request.json()
    
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 리마인더 발송 실행
    const response = await fetch(
      `${request.nextUrl.origin}/api/notifications/reminder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Manual cron job executed',
      timestamp: new Date().toISOString(),
      ...result
    })

  } catch (error) {
    console.error('Manual cron job error:', error)
    return NextResponse.json(
      { 
        error: 'Manual cron job failed',
        timestamp: new Date().toISOString(),
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}

/*
크론잡 설정 예시:

1. Vercel Cron (vercel.json):
{
  "crons": [
    {
      "path": "/api/cron/reminder",
      "schedule": "0 9 * * *"
    }
  ]
}

2. GitHub Actions (.github/workflows/cron.yml):
name: Send Reminder Notifications
on:
  schedule:
    - cron: '0 9 * * *'  # 매일 오전 9시
jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Send reminders
        run: |
          curl -X GET "${{ secrets.APP_URL }}/api/cron/reminder" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"

3. 외부 크론잡 서비스 (cron-job.org, EasyCron 등):
URL: https://your-domain.com/api/cron/reminder
Method: GET
Headers: Authorization: Bearer your-secret-key
Schedule: 0 9 * * * (매일 오전 9시)
*/