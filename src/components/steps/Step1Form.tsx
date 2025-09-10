'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Project, Step1Data } from '@/types'
import { BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline'

const step1Schema = z.object({
  manager: z.object({
    name: z.string().min(1, '담당자명을 입력해주세요'),
    position: z.string().min(1, '직함을 입력해주세요'),
    phone: z.string().min(8, '연락처를 입력해주세요'),
    email: z.string().email('올바른 이메일을 입력해주세요'),
  }),
  company: z.object({
    name: z.string().min(1, '회사명을 입력해주세요'),
    representative: z.string().min(1, '대표자명을 입력해주세요'),
    address: z.string().min(5, '주소를 입력해주세요'),
    businessNumber: z.string().min(8, '사업자등록번호를 입력해주세요'),
    phone: z.string().min(8, '대표전화를 입력해주세요'),
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
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    reset,
    trigger
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      manager: {
        name: project.managerName || '',
        email: project.email || '',
        phone: project.phone || '',
        position: '',
      },
      company: {
        name: project.companyName || '',
        representative: '',
        address: '',
        businessNumber: '',
        phone: '',
        fax: '',
        email: project.email || '', // 기본값으로 담당자 이메일 사용
      }
    }
  })

  // 폼 값들을 실시간으로 감시
  const watchedValues = watch()

  // 프로젝트 데이터가 변경될 때 폼 업데이트
  useEffect(() => {
    console.log('📄 Step1Form: 프로젝트 데이터 변경 감지', project)
    
    // 기존 step1 데이터가 있으면 사용, 없으면 프로젝트 기본 데이터 사용
    const existingData = project.step1Data
    
    if (existingData) {
      console.log('🔄 Step1Form: 기존 저장된 데이터로 폼 업데이트', existingData)
      reset(existingData)
    } else {
      console.log('🆕 Step1Form: 프로젝트 기본 데이터로 폼 초기화')
      reset({
        manager: {
          name: project.managerName || '',
          email: project.email || '',
          phone: project.phone || '',
          position: '',
        },
        company: {
          name: project.companyName || '',
          representative: '',
          address: '',
          businessNumber: '',
          phone: '',
          fax: '',
          email: project.email || '',
        }
      })
    }
  }, [project, reset])

  const onSubmit = async (data: Step1Data) => {
    console.log('🚀 Step1Form: 폼 제출 시작', data)
    setIsSubmitting(true)
    try {
      await onComplete(1, data)
      console.log('✅ Step1Form: 폼 제출 완료')
    } catch (error) {
      console.error('❌ Step1Form: 폼 제출 오류:', error)
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
        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>안내:</strong> 이미 입력하신 정보는 자동으로 채워집니다. 추가 정보를 입력하시고 다음 단계로 진행해주세요.
          </p>
        </div>
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
                key="manager-name"
                id="manager-name"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400"
                placeholder="예: 홍길동"
                autoComplete="name"
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
                key="manager-position"
                id="manager-position"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400"
                placeholder="예: 마케팅팀장, 대리 등"
                autoComplete="organization-title"
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
                key="manager-phone"
                id="manager-phone"
                type="tel"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400"
                placeholder="010-1234-5678"
                autoComplete="mobile tel"
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
                key="manager-email"
                id="manager-email"
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400"
                placeholder="담당자 이메일을 입력하세요"
                autoComplete="email"
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
                key="company-name"
                id="company-name"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400 relative z-10"
                placeholder="예: (주)통컴퍼니"
                autoComplete="organization"
                onClick={() => {
                  console.log('🖱️ 회사명 필드 클릭됨')
                  trigger('company.name')
                }}
                onFocus={() => console.log('🎯 회사명 필드 포커스됨')}
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
                key="company-representative"
                id="company-representative"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400 relative z-10"
                placeholder="대표자명을 입력하세요"
                autoComplete="name"
                onClick={() => {
                  console.log('🖱️ 대표자명 필드 클릭됨')
                  trigger('company.representative')
                }}
                onFocus={() => console.log('🎯 대표자명 필드 포커스됨')}
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
                key="company-address"
                id="company-address"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400 relative z-10"
                placeholder="회사 주소를 입력하세요"
                autoComplete="street-address"
                onClick={() => {
                  console.log('🖱️ 주소 필드 클릭됨')
                  trigger('company.address')
                }}
                onFocus={() => console.log('🎯 주소 필드 포커스됨')}
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
                key="company-business-number"
                id="company-business-number"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400 relative z-10"
                placeholder="예: 123-45-67890"
                onClick={() => {
                  console.log('🖱️ 사업자등록번호 필드 클릭됨')
                  trigger('company.businessNumber')
                }}
                onFocus={() => console.log('🎯 사업자등록번호 필드 포커스됨')}
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
                key="company-phone"
                id="company-phone"
                type="tel"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400 relative z-10"
                placeholder="02-000-0000"
                autoComplete="tel"
                onClick={() => {
                  console.log('🖱️ 회사전화 필드 클릭됨')
                  trigger('company.phone')
                }}
                onFocus={() => console.log('🎯 회사전화 필드 포커스됨')}
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
                key="company-fax"
                id="company-fax"
                type="tel"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400"
                placeholder="02-000-0000"
                autoComplete="tel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('company.email')}
                key="company-email"
                id="company-email"
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-400 relative z-10"
                placeholder="회사 이메일을 입력하세요"
                autoComplete="email"
                onClick={() => {
                  console.log('🖱️ 회사이메일 필드 클릭됨')
                  trigger('company.email')
                }}
                onFocus={() => console.log('🎯 회사이메일 필드 포커스됨')}
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
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="px-8 py-4 bg-gradient-to-r from-tong-blue to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={() => {
              console.log('🔘 버튼 클릭됨')
              console.log('- isValid:', isValid)
              console.log('- isSubmitting:', isSubmitting)
              console.log('- isDirty:', isDirty)
              console.log('- errors:', errors)
              console.log('- watchedValues:', watchedValues)
            }}
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
              <span className="flex items-center">
                다음 단계로
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}