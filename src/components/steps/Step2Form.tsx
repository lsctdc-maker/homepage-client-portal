'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Project, Step2Data } from '@/types'
import { ServerIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const step2Schema = z.object({
  hosting: z.object({
    provider: z.string().min(1, '호스팅 구입처를 입력해주세요'),
    id: z.string().min(1, '호스팅 ID를 입력해주세요'),
    password: z.string().min(1, '호스팅 비밀번호를 입력해주세요'),
    ftpDbPassword: z.string().min(1, 'FTP/DB 비밀번호를 입력해주세요'),
  }),
  domain: z.object({
    provider: z.string().min(1, '도메인 구입처를 입력해주세요'),
    address: z.string().min(1, '도메인 주소를 입력해주세요'),
    id: z.string().min(1, '도메인 ID를 입력해주세요'),
    password: z.string().min(1, '도메인 비밀번호를 입력해주세요'),
  }),
})

interface Step2FormProps {
  project: Project
  onComplete: (step: number, data: Step2Data) => void
}

export default function Step2Form({ project, onComplete }: Step2FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange'
  })

  const onSubmit = async (data: Step2Data) => {
    setIsSubmitting(true)
    try {
      await onComplete(2, data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <ServerIcon className="w-6 h-6 text-tong-blue" />
          <h2 className="text-xl font-semibold text-gray-900">
            호스팅 및 도메인 정보
          </h2>
        </div>
        <p className="text-gray-600">
          홈페이지 작업을 위한 전반적인 기본 정보를 작성해 주시기 바랍니다.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 호스팅 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ServerIcon className="w-5 h-5 mr-2 text-blue-600" />
            호스팅 정보
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구입처 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('hosting.provider')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 가비아, 후이즈, 카페24 등"
              />
              {errors.hosting?.provider && (
                <p className="mt-1 text-sm text-red-600">{errors.hosting.provider.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID <span className="text-red-500">*</span>
              </label>
              <input
                {...register('hosting.id')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="호스팅 계정 ID"
              />
              {errors.hosting?.id && (
                <p className="mt-1 text-sm text-red-600">{errors.hosting.id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PW <span className="text-red-500">*</span>
              </label>
              <input
                {...register('hosting.password')}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="호스팅 계정 비밀번호"
              />
              {errors.hosting?.password && (
                <p className="mt-1 text-sm text-red-600">{errors.hosting.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FTP/DB PW <span className="text-red-500">*</span>
              </label>
              <input
                {...register('hosting.ftpDbPassword')}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="FTP/DB 접근 비밀번호"
              />
              {errors.hosting?.ftpDbPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.hosting.ftpDbPassword.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 도메인 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <GlobeAltIcon className="w-5 h-5 mr-2 text-gray-600" />
            도메인 정보
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구입처 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('domain.provider')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 가비아, 후이즈, 카페24 등"
              />
              {errors.domain?.provider && (
                <p className="mt-1 text-sm text-red-600">{errors.domain.provider.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('domain.address')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: www.example.com"
              />
              {errors.domain?.address && (
                <p className="mt-1 text-sm text-red-600">{errors.domain.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID <span className="text-red-500">*</span>
              </label>
              <input
                {...register('domain.id')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="도메인 관리 계정 ID"
              />
              {errors.domain?.id && (
                <p className="mt-1 text-sm text-red-600">{errors.domain.id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PW <span className="text-red-500">*</span>
              </label>
              <input
                {...register('domain.password')}
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="도메인 관리 계정 비밀번호"
              />
              {errors.domain?.password && (
                <p className="mt-1 text-sm text-red-600">{errors.domain.password.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>참고:</strong> 호스팅과 도메인이 같은 업체인 경우, 동일한 계정 정보를 입력해주세요.
            </p>
          </div>
        </motion.div>

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