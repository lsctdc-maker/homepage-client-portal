'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Project, Step1Data } from '@/types'
import { BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline'

const step1Schema = z.object({
  manager: z.object({
    name: z.string().min(2, '담당자명을 입력해주세요'),
    position: z.string().min(1, '직함을 입력해주세요'),
    phone: z.string().min(10, '연락처를 입력해주세요'),
    email: z.string().email('올바른 이메일을 입력해주세요'),
  }),
  company: z.object({
    name: z.string().min(2, '회사명을 입력해주세요'),
    representative: z.string().min(2, '대표자명을 입력해주세요'),
    address: z.string().min(10, '주소를 입력해주세요'),
    businessNumber: z.string().min(10, '사업자등록번호를 입력해주세요'),
    phone: z.string().min(10, '대표전화를 입력해주세요'),
    fax: z.string().optional(),
    email: z.string().email('올바른 이메일을 입력해주세요'),
  }),
})

interface Step1FormProps {
  project: Project
  onComplete: (step: number, data: Step1Data) => void
}

export default function Step1Form({ project, onComplete }: Step1FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    defaultValues: {
      manager: {
        name: project.managerName,
        email: project.email,
        phone: project.phone,
        position: '',
      },
      company: {
        name: project.companyName,
        representative: '',
        address: '',
        businessNumber: '',
        phone: '',
        fax: '',
        email: '',
      }
    }
  })

  const onSubmit = async (data: Step1Data) => {
    setIsSubmitting(true)
    try {
      await onComplete(1, data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <UserIcon className="w-6 h-6 text-tong-blue" />
          <h2 className="text-xl font-semibold text-gray-900">
            기업 및 관리 담당자 정보
          </h2>
        </div>
        <p className="text-gray-600">
          작업 시 연락을 주고 받을 담당자와 홈페이지 하단에 들어갈 회사 정보를 작성해 주시기 바랍니다.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 담당자 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
            담당자 정보
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('manager.name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="담당자명을 입력하세요"
              />
              {errors.manager?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.manager.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직함 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('manager.position')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="직함을 입력하세요"
              />
              {errors.manager?.position && (
                <p className="mt-1 text-sm text-red-600">{errors.manager.position.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 (휴대폰) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('manager.phone')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="010-1234-5678"
              />
              {errors.manager?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.manager.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('manager.email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="담당자 이메일을 입력하세요"
              />
              {errors.manager?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.manager.email.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 회사 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2 text-gray-600" />
            회사 정보
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회사명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company.name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="회사명을 입력하세요"
              />
              {errors.company?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.company.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표자명 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company.representative')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="대표자명을 입력하세요"
              />
              {errors.company?.representative && (
                <p className="mt-1 text-sm text-red-600">{errors.company.representative.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company.address')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="회사 주소를 입력하세요"
              />
              {errors.company?.address && (
                <p className="mt-1 text-sm text-red-600">{errors.company.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업자등록번호 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company.businessNumber')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000-00-00000"
              />
              {errors.company?.businessNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.company.businessNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표전화 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company.phone')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="02-000-0000"
              />
              {errors.company?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.company.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                팩스
              </label>
              <input
                {...register('company.fax')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="02-000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company.email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="회사 이메일을 입력하세요"
              />
              {errors.company?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.company.email.message}</p>
              )}
            </div>
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