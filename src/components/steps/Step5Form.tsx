'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Project, Step5Data } from '@/types'
import { PaintBrushIcon, PlusIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline'

const step5Schema = z.object({
  references: z.array(z.object({
    site: z.string().min(1, '레퍼런스 사이트를 입력해주세요'),
    templateName: z.string().optional(),
    description: z.string().min(1, '설명을 입력해주세요'),
  })).min(1, '최소 1개의 레퍼런스를 추가해주세요')
})

interface Step5FormProps {
  project: Project
  onComplete: (step: number, data: Step5Data) => void
}

export default function Step5Form({ project, onComplete }: Step5FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<Step5Data>({
    resolver: zodResolver(step5Schema),
    mode: 'onTouched',
    defaultValues: {
      references: [
        { site: '', templateName: '', description: '' }
      ]
    }
  })

  // 프로젝트 데이터가 변경될 때 폼 업데이트
  useEffect(() => {
    console.log('📄 Step5Form: 프로젝트 데이터 변경 감지', project)
    
    const existingData = project.step5Data
    
    if (existingData) {
      console.log('🔄 Step5Form: 기존 저장된 데이터로 폼 업데이트', existingData)
      reset(existingData)
    } else {
      console.log('🆕 Step5Form: 기본값으로 폼 초기화')
      reset({
        references: [
          { site: '', templateName: '', description: '' }
        ]
      })
    }
  }, [project, reset])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'references'
  })

  const onSubmit = async (data: Step5Data) => {
    setIsSubmitting(true)
    try {
      await onComplete(5, data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addReference = () => {
    append({ site: '', templateName: '', description: '' })
  }

  const popularTemplates = [
    '미니멀 비즈니스',
    '모던 코퍼레이트',
    '클린 포트폴리오',
    '프리미엄 서비스',
    '테크 스타트업',
    '헬스케어',
    '교육기관',
    '제조업체'
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <PaintBrushIcon className="w-6 h-6 text-tong-blue" />
          <h2 className="text-xl font-semibold text-gray-900">
            디자인 레퍼런스
          </h2>
        </div>
        <p className="text-gray-600">
          홈페이지 제작의 방향성을 알기 위해 참고할만한 레퍼런스 사이트를 작성해 주시기 바랍니다.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">레퍼런스 정보</h3>
            <button
              type="button"
              onClick={addReference}
              className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              레퍼런스 추가
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    레퍼런스 {index + 1}
                  </h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      제거
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      레퍼런스 사이트 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        {...register(`references.${index}.site`)}
                        type="url"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                    {errors.references?.[index]?.site && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.references[index]?.site?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      템플릿명 (선택)
                    </label>
                    <input
                      {...register(`references.${index}.templateName`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="템플릿 이름 또는 스타일"
                      list={`templates-${index}`}
                    />
                    <datalist id={`templates-${index}`}>
                      {popularTemplates.map(template => (
                        <option key={template} value={template} />
                      ))}
                    </datalist>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      원하는 디자인 및 효과 설명 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register(`references.${index}.description`)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="해당 레퍼런스에서 원하는 디자인 요소, 색상, 레이아웃, 효과 등을 구체적으로 설명해주세요"
                    />
                    {errors.references?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.references[index]?.description?.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 통컴퍼니 템플릿 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <PaintBrushIcon className="w-5 h-5 mr-2" />
            통컴퍼니 템플릿 선택
          </h4>
          <p className="text-blue-800 mb-4">
            레퍼런스를 찾기 어려운 경우 제작에 사용할 통컴퍼니 템플릿을 선택해 주시기 바랍니다.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularTemplates.map((template, index) => (
              <div
                key={template}
                className="p-3 bg-white border border-blue-200 rounded-lg text-center hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => {
                  // 첫 번째 레퍼런스의 템플릿명에 자동 입력
                  const firstRef = document.querySelector('input[name="references.0.templateName"]') as HTMLInputElement
                  if (firstRef) {
                    firstRef.value = template
                    firstRef.dispatchEvent(new Event('input', { bubbles: true }))
                  }
                }}
              >
                <div className="text-2xl mb-2">🎨</div>
                <p className="text-sm text-blue-900 font-medium">{template}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <a 
                href="https://design8.kr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                템플릿 확인하기 →
              </a>
            </p>
          </div>
        </div>

        {/* 디자인 가이드라인 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">레퍼런스 작성 가이드</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 색상 조합이나 톤앤매너를 구체적으로 언급해주세요</li>
            <li>• 원하는 레이아웃 스타일 (깔끔한, 모던한, 클래식한 등)</li>
            <li>• 특별히 마음에 드는 효과나 인터랙션이 있다면 명시</li>
            <li>• 피하고 싶은 디자인 스타일이 있다면 함께 작성</li>
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