import nodemailer from 'nodemailer'
import { Project } from '@/types'

// 이메일 전송 설정
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password',
    },
  })
}

// 스텝 완료 알림
export async function sendStepCompletionNotification(project: Project, step: number) {
  const transporter = createTransporter()
  
  const stepTitles = {
    1: '기업 및 관리 담당자 정보',
    2: '호스팅 및 도메인 정보',
    3: '메일 정보',
    4: 'SEO 세팅',
    5: '디자인 레퍼런스',
    6: '사이트맵',
    7: '홈페이지 자료',
  }

  const stepTitle = stepTitles[step as keyof typeof stepTitles]
  
  // 클라이언트에게 발송
  const clientEmailOptions = {
    from: process.env.SMTP_FROM || '"통컴퍼니" <noreply@tongcompany.co.kr>',
    to: project.email,
    subject: `[통컴퍼니] ${stepTitle} 단계가 완료되었습니다`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0099cc; margin: 0;">통컴퍼니</h1>
          <p style="color: #666; margin: 5px 0;">홈페이지 제작 전문회사</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">단계 완료 알림</h2>
          <p>안녕하세요, <strong>${project.managerName}</strong>님.</p>
          <p><strong>${project.companyName}</strong> 홈페이지 제작 프로젝트의 <strong>${stepTitle}</strong> 단계가 성공적으로 완료되었습니다.</p>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white; text-align: center; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0;">현재 진행률</h3>
          <div style="font-size: 2em; font-weight: bold;">${project.completionRate}%</div>
          <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; margin: 15px 0;">
            <div style="background: white; height: 100%; width: ${project.completionRate}%; border-radius: 4px; transition: width 0.3s;"></div>
          </div>
          <p style="margin: 0; opacity: 0.9;">7단계 중 ${Object.values(project.progress).filter(Boolean).length}단계 완료</p>
        </div>

        ${project.completionRate < 100 ? `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #856404; margin-top: 0;">다음 단계</h4>
          <p style="color: #856404; margin: 0;">계속해서 다음 단계 정보를 입력해주세요. 프로젝트 완료까지 조금만 더 진행하시면 됩니다!</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/project/${project.id}" 
             style="background: #0099cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            프로젝트 계속하기
          </a>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
          <p><strong>통컴퍼니</strong></p>
          <p>📞 02-402-2589 | 📧 tong@tongcompany.co.kr</p>
          <p>서울시 송파구 법원로11길 25, H비즈니스파크 B동 610호</p>
        </div>
      </div>
    `,
  }

  // 관리자에게 발송
  const adminEmailOptions = {
    from: process.env.SMTP_FROM || '"통컴퍼니 시스템" <noreply@tongcompany.co.kr>',
    to: process.env.ADMIN_EMAIL || 'admin@tongcompany.co.kr',
    subject: `[시스템] ${project.companyName} - ${stepTitle} 단계 완료`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0099cc;">프로젝트 진행 알림</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">회사명:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">담당자:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.managerName} (${project.email})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">완료 단계:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${step}. ${stepTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">진행률:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.completionRate}%</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">프로젝트 ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.id}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" 
             style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            관리자 대시보드에서 보기
          </a>
        </div>
      </div>
    `,
  }

  try {
    await Promise.all([
      transporter.sendMail(clientEmailOptions),
      transporter.sendMail(adminEmailOptions),
    ])
    
    console.log(`Step completion notification sent for project ${project.id}, step ${step}`)
  } catch (error) {
    console.error('Failed to send step completion notification:', error)
    throw error
  }
}

// 프로젝트 완료 알림
export async function sendProjectCompletionNotification(project: Project) {
  const transporter = createTransporter()
  
  const clientEmailOptions = {
    from: process.env.SMTP_FROM || '"통컴퍼니" <noreply@tongcompany.co.kr>',
    to: project.email,
    subject: `[통컴퍼니] ${project.companyName} 홈페이지 자료 수집이 완료되었습니다! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0099cc; margin: 0;">🎉 자료 수집 완료! 🎉</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0;">축하합니다!</h2>
          <p style="font-size: 18px; margin: 0 0 20px 0;"><strong>${project.companyName}</strong> 홈페이지 제작을 위한 모든 자료가 성공적으로 수집되었습니다.</p>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
            <div style="font-size: 3em; margin-bottom: 10px;">💯</div>
            <div style="font-size: 1.5em; font-weight: bold;">100% 완료</div>
          </div>
        </div>

        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #155724; margin-top: 0;">✅ 수집 완료 항목</h3>
          <ul style="color: #155724; margin: 0; padding-left: 20px;">
            <li>기업 및 관리 담당자 정보</li>
            <li>호스팅 및 도메인 정보</li>
            <li>메일 정보</li>
            <li>SEO 세팅</li>
            <li>디자인 레퍼런스</li>
            <li>사이트맵</li>
            <li>홈페이지 자료</li>
          </ul>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #333; margin-top: 0;">🚀 다음 단계</h3>
          <p style="margin: 0;">이제 저희 디자인팀이 제공해주신 자료를 바탕으로 홈페이지 제작 작업을 시작합니다.</p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>디자인 시안 제작 (3-5일)</li>
            <li>개발 및 구축 작업</li>
            <li>테스트 및 최종 점검</li>
            <li>런칭 및 SEO 등록</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666;">작업 진행 상황은 수시로 업데이트해드리겠습니다.</p>
          <p style="color: #666;">궁금한 사항이 있으시면 언제든 연락 주세요!</p>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="font-weight: bold; color: #0099cc; font-size: 16px;">통컴퍼니</p>
          <p>행복한 소통으로 고객의 가치에 기여하겠습니다.</p>
          <p>📞 02-402-2589 | 📧 tong@tongcompany.co.kr</p>
          <p>서울시 송파구 법원로11길 25, H비즈니스파크 B동 610호</p>
          <p><a href="https://www.tongcompany.co.kr" style="color: #0099cc;">www.tongcompany.co.kr</a> | <a href="https://design8.kr" style="color: #0099cc;">design8.kr</a></p>
        </div>
      </div>
    `,
  }

  const adminEmailOptions = {
    from: process.env.SMTP_FROM || '"통컴퍼니 시스템" <noreply@tongcompany.co.kr>',
    to: process.env.ADMIN_EMAIL || 'admin@tongcompany.co.kr',
    subject: `🎉 [프로젝트 완료] ${project.companyName} - 모든 자료 수집 완료`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0;">🎉 프로젝트 완료!</h2>
          <p style="margin: 10px 0 0 0;">모든 자료 수집이 완료되었습니다</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">회사명:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">담당자:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.managerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">연락처:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">이메일:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">프로젝트 ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${project.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">시작일:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(project.createdAt).toLocaleDateString('ko-KR')}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">완료일:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString('ko-KR')}</td>
          </tr>
        </table>

        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin-top: 0; color: #495057;">⚡ 액션 필요</h4>
          <ul style="margin: 0; padding-left: 20px; color: #495057;">
            <li>NAS에서 수집된 자료 확인</li>
            <li>디자인팀에 프로젝트 할당</li>
            <li>작업 일정 수립 및 클라이언트 공유</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" 
             style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
            관리자 대시보드
          </a>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/project/${project.id}" 
             style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            프로젝트 상세보기
          </a>
        </div>
      </div>
    `,
  }

  try {
    await Promise.all([
      transporter.sendMail(clientEmailOptions),
      transporter.sendMail(adminEmailOptions),
    ])
    
    console.log(`Project completion notification sent for project ${project.id}`)
  } catch (error) {
    console.error('Failed to send project completion notification:', error)
    throw error
  }
}

// 리마인더 알림 (미완성 프로젝트)
export async function sendReminderNotification(project: Project) {
  const transporter = createTransporter()
  
  const incompleteSteps = Object.entries(project.progress)
    .filter(([_, completed]) => !completed)
    .map(([step, _]) => {
      const stepNum = parseInt(step.replace('step', ''))
      const stepTitles = {
        1: '기업 및 관리 담당자 정보',
        2: '호스팅 및 도메인 정보', 
        3: '메일 정보',
        4: 'SEO 세팅',
        5: '디자인 레퍼런스',
        6: '사이트맵',
        7: '홈페이지 자료',
      }
      return stepTitles[stepNum as keyof typeof stepTitles]
    })

  const emailOptions = {
    from: process.env.SMTP_FROM || '"통컴퍼니" <noreply@tongcompany.co.kr>',
    to: project.email,
    subject: `[리마인더] ${project.companyName} 홈페이지 자료 제출을 기다리고 있습니다`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0099cc; margin: 0;">통컴퍼니</h1>
          <p style="color: #666; margin: 5px 0;">홈페이지 제작 진행 현황</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #856404; margin-top: 0;">📝 자료 제출 리마인더</h2>
          <p style="color: #856404;">안녕하세요, <strong>${project.managerName}</strong>님.</p>
          <p style="color: #856404;"><strong>${project.companyName}</strong> 홈페이지 제작 프로젝트가 진행 중입니다.</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">현재 진행률: ${project.completionRate}%</h3>
          <div style="background: #e9ecef; height: 10px; border-radius: 5px; margin: 15px 0;">
            <div style="background: #0099cc; height: 100%; width: ${project.completionRate}%; border-radius: 5px; transition: width 0.3s;"></div>
          </div>
        </div>

        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #721c24; margin-top: 0;">⏳ 대기 중인 항목</h3>
          <ul style="color: #721c24; margin: 0; padding-left: 20px;">
            ${incompleteSteps.map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/project/${project.id}" 
             style="background: #0099cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
            자료 입력 계속하기
          </a>
        </div>

        <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #0c5460; margin: 0; text-align: center;">
            <strong>빠른 완료를 위해</strong><br>
            가능한 한 빠른 시일 내에 남은 자료를 제출해주시면<br>
            더욱 신속하게 홈페이지 제작을 진행할 수 있습니다.
          </p>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
          <p><strong>통컴퍼니</strong></p>
          <p>📞 02-402-2589 | 📧 tong@tongcompany.co.kr</p>
          <p>궁금한 사항이 있으시면 언제든 연락 주세요!</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(emailOptions)
    console.log(`Reminder notification sent for project ${project.id}`)
  } catch (error) {
    console.error('Failed to send reminder notification:', error)
    throw error
  }
}

// SMS 발송 (선택사항 - 실제 SMS 서비스 연동 필요)
export async function sendSMSNotification(phone: string, message: string) {
  try {
    // 실제 SMS 서비스 연동 (예: 알림톡, Cool SMS 등)
    // const smsResult = await smsService.send({
    //   to: phone,
    //   message: message
    // })
    
    console.log(`SMS sent to ${phone}: ${message}`)
  } catch (error) {
    console.error('Failed to send SMS notification:', error)
  }
}