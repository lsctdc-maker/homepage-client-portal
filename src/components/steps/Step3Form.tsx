'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Project, Step3Data } from '@/types'
import { EnvelopeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const step3Schema = z.object({
  mailRecords: z.array(z.object({
    type: z.enum(['MX', 'CNAME', 'TXT']),
    host: z.string().min(1, '호스트를 입력해주세요'),
    value: z.string().min(1, '값을 입력해주세요'),
    priority: z.number().optional(),
  })).min(1, '최소 1개의 메일 레코드를 추가해주세요')
})

interface Step3FormProps {
  project: Project
  onComplete: (step: number, data: Step3Data) => void
}

export default function Step3Form({ project, onComplete }: Step3FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: 'onTouched',
    defaultValues: {
      mailRecords: [
        { type: 'MX', host: '', value: '', priority: 10 }
      ]
    }
  })

  // 프로젝트 데이터가 변경될 때 폼 업데이트
  useEffect(() => {
    console.log('📄 Step3Form: 프로젝트 데이터 변경 감지', project)
    
    const existingData = project.step3Data
    
    if (existingData) {
      console.log('🔄 Step3Form: 기존 저장된 데이터로 폼 업데이트', existingData)
      reset(existingData)
    } else {
      console.log('🆕 Step3Form: 기본값으로 폼 초기화')
      reset({
        mailRecords: [
          { type: 'MX', host: '', value: '', priority: 10 }
        ]
      })
    }
  }, [project, reset])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'mailRecords'
  })

  const onSubmit = async (data: Step3Data) => {
    setIsSubmitting(true)
    try {
      await onComplete(3, data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRecord = () => {
    append({ type: 'CNAME', host: '', value: '', priority: undefined })
  }

  const recordTypes = [
    { value: 'MX', label: 'MX (메일 서버)' },
    { value: 'CNAME', label: 'CNAME (별칭)' },
    { value: 'TXT', label: 'TXT (SPF 등)' }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <EnvelopeIcon className="w-6 h-6 text-tong-blue" />
          <h2 className="text-xl font-semibold text-gray-900">
            메일 정보
          </h2>
        </div>
        <p className="text-gray-600">
          포털사이트(구글, 네이버, 다음)가 아닌 회사 메일을 사용하는 경우 작성해 주시기 바랍니다.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">메일 DNS 레코드</h3>
            <button
              type="button"
              onClick={addRecord}
              className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              레코드 추가
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종류
                    </label>
                    <select
                      {...register(`mailRecords.${index}.type`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {recordTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      호스트
                    </label>
                    <input
                      {...register(`mailRecords.${index}.host`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: mail, @, _dmarc"
                    />
                    {errors.mailRecords?.[index]?.host && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mailRecords[index]?.host?.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      값
                    </label>
                    <input
                      {...register(`mailRecords.${index}.value`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="레코드 값을 입력하세요"
                    />
                    {errors.mailRecords?.[index]?.value && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mailRecords[index]?.value?.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      우선순위
                    </label>
                    <input
                      {...register(`mailRecords.${index}.priority`, {
                        valueAsNumber: true,
                        setValueAs: (value) => value === '' ? undefined : Number(value)
                      })}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                      disabled={watch(`mailRecords.${index}.type`) !== 'MX'}
                    />
                  </div>

                  <div className="md:col-span-1">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="w-full flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">일반적인 메일 설정 예시</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>MX:</strong> @ → mail.yourdomain.com (우선순위: 10)</p>
              <p><strong>CNAME:</strong> mail → yourdomain.com</p>
              <p><strong>TXT (SPF):</strong> @ → v=spf1 include:_spf.google.com ~all</p>
            </div>
          </div>
        </div>

        {/* 건너뛰기 옵션 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>포털 메일 사용 시:</strong> 구글, 네이버, 다음 등의 포털 메일을 사용하시는 경우 이 단계를 건너뛰고 다음으로 진행하셔도 됩니다.
          </p>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => onComplete(3, { mailRecords: [] })}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            건너뛰기
          </button>
          
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