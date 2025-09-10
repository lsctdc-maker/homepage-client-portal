'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Project, Step4Data } from '@/types'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const step4Schema = z.object({
  google: z.object({
    id: z.string().min(1, '구글 ID를 입력해주세요'),
    password: z.string().min(1, '구글 비밀번호를 입력해주세요'),
  }),
  naver: z.object({
    id: z.string().min(1, '네이버 ID를 입력해주세요'),
    password: z.string().min(1, '네이버 비밀번호를 입력해주세요'),
  }),
  siteInfo: z.object({
    title: z.string().min(1, '사이트 제목을 입력해주세요'),
    description: z.string().min(10, '사이트 설명을 10자 이상 입력해주세요'),
  }),
})

interface Step4FormProps {
  project: Project
  onComplete: (step: number, data: Step4Data) => void
}

export default function Step4Form({ project, onComplete }: Step4FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    mode: 'onChange',
    defaultValues: {
      siteInfo: {
        title: project.companyName,
        description: '',
      }
    }
  })

  const siteTitle = watch('siteInfo.title')
  const siteDescription = watch('siteInfo.description')

  const onSubmit = async (data: Step4Data) => {
    setIsSubmitting(true)
    try {
      await onComplete(4, data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <MagnifyingGlassIcon className="w-6 h-6 text-tong-blue" />
          <h2 className="text-xl font-semibold text-gray-900">
            SEO 세팅
          </h2>
        </div>
        <p className="text-gray-600">
          포털사이트(구글, 네이버, 다음)에 홈페이지 검색을 등록하기 위해 필요한 정보를 작성해 주시기 바랍니다.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 포털사이트 계정 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">포털사이트 계정 정보</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 구글 계정 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE0VjE0LjI2SDEyLjY5QzE4LjM2IDEzLjU5IDE4LjU2IDEwLjkzIDE2LjM4IDguNUwxOS4zOCA1LjVDMjAuOTEgNi45OSAyMi41NiA5LjQ1IDIyLjU2IDEyLjI1WiIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMTIuNTYgMjJDMTUuNTYgMjIgMTguNTYgMjAuODggMjAuNTYgMTguNzVMMTcuMzMgMTUuOTNDMTYuMjcgMTYuNjQgMTQuOTMgMTcuMDcgMTIuNTYgMTcuMDdDOS42OSAxNy4wNyA3LjIzIDE1LjI2IDYuMzMgMTIuNjlMMy4wOCAxNS41NkM1LjI2IDE5LjczIDguNzIgMjIgMTIuNTYgMjJaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGQ9Ik02LjM5IDEyLjI1QzYuMzkgMTEuNzUgNi40OSAxMS4yNSA2LjY5IDEwLjc1TDMuMDggNy44OEMxLjkzIDEwLjI1IDEuOTMgMTQuMjUgMy4wOCAxNi42Mkw2LjM5IDEzLjc1QzYuNDkgMTMuMjUgNi4zOSAxMi43NSA2LjM5IDEyLjI1WiIgZmlsbD0iI0ZCQkMwNCIvPgo8cGF0aCBkPSJNMTIuNTYgNS45M0MxNC40NiA1LjkzIDE2LjE2IDYuNjYgMTcuNDYgNy45Nkw0LjQ2IDUuMDZDOC43MiAyLjI3IDEyLjUzIDAuNSAxMi41NiAwLjVDMTYuMzMgMC41IDEzLjcxIDEuMzggMTcuMzggNS41TDE0IDguNUMxMi4xOCA5Ljc1IDEwLjQ0IDExIDEyLjU2IDVaIiBmaWxsPSIjRUE0MzM1Ii8+Cjwvc3ZnPgo="
                  alt="Google"
                  className="w-5 h-5"
                />
                <h4 className="text-md font-medium text-gray-900">구글 계정</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구글 ID <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('google.id')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Google Search Console용 계정"
                />
                {errors.google?.id && (
                  <p className="mt-1 text-sm text-red-600">{errors.google.id.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구글 PW <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('google.password')}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="구글 계정 비밀번호"
                />
                {errors.google?.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.google.password.message}</p>
                )}
              </div>
            </div>

            {/* 네이버 계정 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <h4 className="text-md font-medium text-gray-900">네이버 계정</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  네이버 ID <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('naver.id')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="네이버 웹마스터도구용 계정"
                />
                {errors.naver?.id && (
                  <p className="mt-1 text-sm text-red-600">{errors.naver.id.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  네이버 PW <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('naver.password')}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="네이버 계정 비밀번호"
                />
                {errors.naver?.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.naver.password.message}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 사이트 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">사이트 SEO 정보</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이트 제목 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('siteInfo.title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="검색 결과에 표시될 사이트 제목"
              />
              {errors.siteInfo?.title && (
                <p className="mt-1 text-sm text-red-600">{errors.siteInfo.title.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                권장 길이: 50-60자 (현재: {siteTitle?.length || 0}자)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이트 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('siteInfo.description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="사이트에 대한 간략한 설명을 입력하세요"
              />
              {errors.siteInfo?.description && (
                <p className="mt-1 text-sm text-red-600">{errors.siteInfo.description.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                권장 길이: 150-160자 (현재: {siteDescription?.length || 0}자)
              </p>
            </div>
          </div>

          {/* 미리보기 */}
          {siteTitle && siteDescription && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white">
              <h4 className="text-sm font-medium text-gray-900 mb-3">검색 결과 미리보기</h4>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                  {siteTitle}
                </h3>
                <p className="text-green-700 text-sm">www.{project.companyName.toLowerCase().replace(/\s/g, '')}.co.kr</p>
                <p className="text-gray-600 text-sm mt-1">{siteDescription}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 안내사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">SEO 등록 안내</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 제공해주신 계정으로 Google Search Console 및 네이버 웹마스터도구에 사이트를 등록합니다</li>
            <li>• 사이트맵 제출 및 색인 요청을 통해 검색 노출을 최적화합니다</li>
            <li>• 계정이 없으시면 사전에 생성해주시기 바랍니다</li>
          </ul>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-tong-blue to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                저장 중...
              </>
            ) : (
              '다음 단계로'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}