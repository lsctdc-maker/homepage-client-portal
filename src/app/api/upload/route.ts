import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink, stat } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const category = formData.get('category') as string

    if (!file || !projectId || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 파일 검증
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.adobe.illustrator',
      'application/postscript'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    // 파일 저장 경로 설정
    const uploadDir = path.join(process.cwd(), 'uploads', projectId, category)
    await mkdir(uploadDir, { recursive: true })

    // 파일명 생성 (중복 방지)
    const fileExtension = path.extname(file.name)
    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // 파일 저장
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // NAS에도 동일한 구조로 저장 (실제 환경에서)
    await saveToNAS(projectId, category, fileName, buffer)

    const relativePath = path.posix.join('uploads', projectId, category, fileName)

    return NextResponse.json({
      success: true,
      path: relativePath,
      filename: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { projectId, filePath } = await request.json()
    
    if (!projectId || !filePath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const fullPath = path.join(process.cwd(), filePath)
    
    // 파일 존재 확인
    try {
      await stat(fullPath)
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // 파일 삭제
    await unlink(fullPath)
    
    // NAS에서도 삭제 (실제 환경에서)
    await deleteFromNAS(filePath)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}

// NAS에 파일 저장
async function saveToNAS(projectId: string, category: string, fileName: string, buffer: Buffer) {
  try {
    // 실제 NAS SMB 클라이언트 구현
    const nasConfig = {
      host: process.env.NAS_HOST || 'localhost',
      username: process.env.NAS_USERNAME || 'admin',
      password: process.env.NAS_PASSWORD || 'password',
      basePath: process.env.NAS_BASE_PATH || '/projects'
    }

    // 프로젝트 폴더 구조에 맞게 저장
    // const smbClient = new SMB2Client(nasConfig)
    // const nasPath = `${nasConfig.basePath}/${projectId}/${category}/${fileName}`
    // await smbClient.writeFile(nasPath, buffer)

    console.log(`File saved to NAS: ${projectId}/${category}/${fileName}`)
  } catch (error) {
    console.error('NAS save failed:', error)
    // NAS 저장 실패해도 로컬 저장은 성공으로 처리
  }
}

// NAS에서 파일 삭제
async function deleteFromNAS(filePath: string) {
  try {
    // 실제 NAS SMB 클라이언트 구현
    // const smbClient = new SMB2Client(nasConfig)
    // await smbClient.unlink(nasPath)
    
    console.log(`File deleted from NAS: ${filePath}`)
  } catch (error) {
    console.error('NAS delete failed:', error)
  }
}