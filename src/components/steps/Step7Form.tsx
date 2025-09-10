// @ts-nocheck
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Project, Step7Data, FileInfo } from '@/types'
import { FILE_UPLOAD_CONFIG, NAS_FOLDER_STRUCTURE } from '@/lib/constants'
import { FolderIcon, CloudArrowUpIcon, DocumentIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Step7FormProps {
  project: Project
  onComplete: (step: number, data: Step7Data) => void
}

export default function Step7Form({ project, onComplete }: Step7FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ [category: string]: FileInfo[] }>({})
  const [activeCategory, setActiveCategory] = useState('01_기업정보')

  // 프로젝트 데이터가 변경될 때 업로드된 파일 복원
  useEffect(() => {
    console.log('📄 Step7Form: 프로젝트 데이터 변경 감지', project)
    
    const existingData = project.step7Data
    
    if (existingData) {
      console.log('🔄 Step7Form: 기존 저장된 파일 데이터로 복원', existingData)
      
      // uploadedFiles 상태 복원
      const restoredFiles: { [category: string]: FileInfo[] } = {}
      existingData.uploadedFiles.forEach(categoryData => {
        restoredFiles[categoryData.category] = categoryData.files
      })
      
      setUploadedFiles(restoredFiles)
    } else {
      console.log('🆕 Step7Form: 빈 상태로 초기화')
      setUploadedFiles({})
    }
  }, [project])

  const onDrop = useCallback(async (acceptedFiles: File[], category: string) => {
    for (const file of acceptedFiles) {
      // 파일 크기 검증
      if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
        alert(`파일 크기가 너무 큽니다: ${file.name} (최대 10MB)`)
        continue
      }

      // 파일 형식 검증
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!FILE_UPLOAD_CONFIG.allowedExtensions.includes(fileExtension)) {
        alert(`지원하지 않는 파일 형식입니다: ${file.name}`)
        continue
      }

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', project.id)
        formData.append('category', category)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          const fileInfo: FileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadPath: result.path,
            uploadedAt: new Date(),
          }

          setUploadedFiles(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), fileInfo]
          }))
        } else {
          throw new Error('업로드 실패')
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert(`업로드 실패: ${file.name}`)
      }
    }
  }, [project.id])

  const removeFile = async (category: string, fileIndex: number) => {
    const fileToRemove = uploadedFiles[category][fileIndex]
    
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          filePath: fileToRemove.uploadPath,
        }),
      })

      setUploadedFiles(prev => ({
        ...prev,
        [category]: prev[category].filter((_, index) => index !== fileIndex)
      }))
    } catch (error) {
      console.error('Delete error:', error)
      alert('파일 삭제 실패')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const step7Data: Step7Data = {
        uploadedFiles: Object.entries(uploadedFiles).map(([category, files]) => ({
          category,
          files
        }))
      }
      
      await onComplete(7, step7Data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const CategoryDropzone = ({ category, title }: { category: string; title: string }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, category),
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
        'application/pdf': ['.pdf'],
        'application/zip': ['.zip'],
        'application/vnd.adobe.illustrator': ['.ai'],
        'application/postscript': ['.ai'],
      },
      multiple: true
    })

    return (
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`dropzone border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">파일을 여기에 놓으세요...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">파일을 끌어다 놓거나 클릭하여 선택하세요</p>
              <p className="text-sm text-gray-500">
                지원 형식: JPG, PNG, GIF, PDF, ZIP, AI (최대 10MB)
              </p>
            </div>
          )}
        </div>

        {/* 업로드된 파일 목록 */}
        {uploadedFiles[category] && uploadedFiles[category].length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">업로드된 파일</h4>
            {uploadedFiles[category].map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(category, index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <FolderIcon className="w-6 h-6 text-tong-blue" />
          <h2 className="text-xl font-semibold text-gray-900">
            홈페이지 자료
          </h2>
        </div>
        <p className="text-gray-600">
          로고(CI/BI)는 800px 이상의 AI/PNG/PDF 등의 파일로 보내주시기 바랍니다. 
          메뉴구성에 맞게 구성하여 파일을 업로드해주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 카테고리 네비게이션 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">파일 카테고리</h3>
            <nav className="space-y-2">
              {NAS_FOLDER_STRUCTURE.map((category) => {
                const fileCount = uploadedFiles[category]?.length || 0
                const title = category.split('_')[1]
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{title}</span>
                      {fileCount > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {fileCount}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </nav>
            
            {/* 진행률 */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">업로드 진행률</span>
                <span className="font-medium">
                  {Object.values(uploadedFiles).flat().length} 파일
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-tong-blue h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (Object.keys(uploadedFiles).filter(
                        category => uploadedFiles[category]?.length > 0
                      ).length / NAS_FOLDER_STRUCTURE.length) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {activeCategory.split('_')[1]} 파일 업로드
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                해당 카테고리에 맞는 파일들을 업로드해주세요
              </p>
            </div>

            <CategoryDropzone 
              category={activeCategory} 
              title={activeCategory.split('_')[1]} 
            />
          </div>
        </div>
      </div>

      {/* 로고 업로드 특별 안내 */}
      {activeCategory === '07_홈페이지자료' && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-md font-semibold text-yellow-900 mb-2">로고 파일 안내</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 로고는 800px 이상의 고해상도로 업로드해주세요</li>
            <li>• AI, PNG, PDF 형식을 권장합니다</li>
            <li>• 배경이 투명한 PNG 파일이 있으면 함께 업로드해주세요</li>
            <li>• 세로형, 가로형 모두 있으면 더욱 좋습니다</li>
          </ul>
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(uploadedFiles).length === 0}
          className="px-6 py-3 bg-gradient-to-r from-tong-blue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              완료 처리 중...
            </>
          ) : (
            '자료 수집 완료'
          )}
        </button>
      </div>
    </div>
  )
}