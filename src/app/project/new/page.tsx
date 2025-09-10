'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const newProjectSchema = z.object({
  companyName: z.string().min(2, '회사명을 입력해주세요'),
  managerName: z.string().min(2, '담당자명을 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  phone: z.string().min(10, '연락처를 입력해주세요'),
})

type NewProjectForm = z.infer<typeof newProjectSchema>

export default function NewProject() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<NewProjectForm>({
    resolver: zodResolver(newProjectSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: NewProjectForm) => {
    setIsCreating(true)
    
    try {
      // 프로젝트 생성 API 호출
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const project = await response.json()
        router.push(`/project/${project.id}`)
      } else {
        throw new Error('프로젝트 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('프로젝트 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            뒤로가기
          </Link>
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-6 h-6 text-tong-blue mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">새 프로젝트 시작</h1>
          </div>
        </motion.div>

        {/* 메인 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              기본 정보 입력
            </h2>
            <p className="text-gray-600">
              홈페이지 제작을 위한 기본 정보를 입력해주세요. 이후 단계별로 상세 정보를 수집합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 회사명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회사명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('companyName')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="회사명을 입력하세요"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>

            {/* 담당자명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('managerName')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="담당자명을 입력하세요"
              />
              {errors.managerName && (
                <p className="mt-1 text-sm text-red-600">{errors.managerName.message}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* 연락처 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="연락처를 입력하세요 (예: 010-1234-5678)"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid || isCreating}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-tong-blue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    프로젝트 생성 중...
                  </>
                ) : (
                  '프로젝트 시작하기'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}