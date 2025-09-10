// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Project, Step6Data } from '@/types'
import { Squares2X2Icon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const step6Schema = z.object({
  menuStructure: z.object({
    primaryMenu: z.array(z.string().min(1, '메뉴명을 입력해주세요')).min(1, '최소 1개의 주메뉴를 추가해주세요'),
    secondaryMenu: z.record(z.array(z.string()))
  })
})

interface Step6FormProps {
  project: Project
  onComplete: (step: number, data: Step6Data) => void
}

export default function Step6Form({ project, onComplete }: Step6FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      menuStructure: {
        primaryMenu: ['ABOUT US', 'BUSINESS', 'PRODUCT', 'NOTICE', 'CONTACT'],
        secondaryMenu: {
          'ABOUT US': ['회사소개', '조직도', '연혁', '오시는길'],
          'BUSINESS': ['홈페이지', '카탈로그', '영상'],
          'PRODUCT': ['제품 카테고리1', '제품 카테고리2'],
          'NOTICE': ['공지사항', '언론보도', '갤러리'],
          'CONTACT': ['온라인 문의']
        }
      }
    }
  })

  // 프로젝트 데이터가 변경될 때 폼 업데이트
  useEffect(() => {
    console.log('📄 Step6Form: 프로젝트 데이터 변경 감지', project)
    
    const existingData = project.step6Data
    
    if (existingData) {
      console.log('🔄 Step6Form: 기존 저장된 데이터로 폼 업데이트', existingData)
      reset(existingData)
    } else {
      console.log('🆕 Step6Form: 기본값으로 폼 초기화')
      reset({
        menuStructure: {
          primaryMenu: ['ABOUT US', 'BUSINESS', 'PRODUCT', 'NOTICE', 'CONTACT'],
          secondaryMenu: {
            'ABOUT US': ['회사소개', '조직도', '연혁', '오시는길'],
            'BUSINESS': ['홈페이지', '카탈로그', '영상'],
            'PRODUCT': ['제품 카테고리1', '제품 카테고리2'],
            'NOTICE': ['공지사항', '언론보도', '갤러리'],
            'CONTACT': ['온라인 문의']
          }
        }
      })
    }
  }, [project, reset])

  // @ts-ignore
  const { fields: primaryFields, append: appendPrimary, remove: removePrimary } = useFieldArray({
    control,
    name: 'menuStructure.primaryMenu'
  })

  // @ts-ignore
  const primaryMenu = watch('menuStructure.primaryMenu')
  // @ts-ignore
  const secondaryMenu = watch('menuStructure.secondaryMenu')

  const onSubmit = async (data: Step6Data) => {
    setIsSubmitting(true)
    try {
      await onComplete(6, data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSecondaryMenu = (primaryIndex: number, value: string) => {
    if (!value.trim()) return
    
    const primaryMenuName = primaryMenu[primaryIndex]
    const currentSecondary = secondaryMenu[primaryMenuName] || []
    setValue(`menuStructure.secondaryMenu.${primaryMenuName}`, [...currentSecondary, value])
  }

  const removeSecondaryMenu = (primaryIndex: number, secondaryIndex: number) => {
    const primaryMenuName = primaryMenu[primaryIndex]
    const currentSecondary = secondaryMenu[primaryMenuName] || []
    const updated = currentSecondary.filter((_, idx) => idx !== secondaryIndex)
    setValue(`menuStructure.secondaryMenu.${primaryMenuName}`, updated)
  }

  const commonMenuStructures = [
    {
      name: '기업 소개형',
      structure: {
        primaryMenu: ['회사소개', '사업분야', '제품/서비스', '고객센터', '채용정보'],
        secondaryMenu: {
          '회사소개': ['CEO인사말', '회사개요', '연혁', '조직도', '오시는길'],
          '사업분야': ['주요사업', '연구개발', '특허기술'],
          '제품/서비스': ['제품소개', '서비스안내', '카탈로그'],
          '고객센터': ['공지사항', '보도자료', 'FAQ', '온라인문의'],
          '채용정보': ['채용공고', '인재상', '복리후생']
        }
      }
    },
    {
      name: '제조업체형',
      structure: {
        primaryMenu: ['회사소개', '제품정보', '기술력', '고객지원', '문의하기'],
        secondaryMenu: {
          '회사소개': ['회사개요', '사업영역', '연혁', '인증서', '찾아오시는길'],
          '제품정보': ['제품카테고리', '신제품', '베스트상품', '카탈로그'],
          '기술력': ['연구개발', '품질관리', '특허기술', '시험성적서'],
          '고객지원': ['공지사항', '기술지원', 'A/S센터', '자료실'],
          '문의하기': ['온라인상담', '견적문의', '대리점문의']
        }
      }
    }
  ]

  const applyTemplate = (template: any) => {
    setValue('menuStructure.primaryMenu', template.primaryMenu)
    setValue('menuStructure.secondaryMenu', template.secondaryMenu)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Squares2X2Icon className="w-6 h-6 text-tong-blue" />
          <h2 className="text-xl font-semibold text-gray-900">
            사이트맵
          </h2>
        </div>
        <p className="text-gray-600">
          원하는 레퍼런스 사이트의 메뉴를 참조하여 메뉴명을 정하고 아래의 예시처럼 작성 해주시기 바랍니다.
        </p>
      </div>

      {/* 템플릿 선택 */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-md font-semibold text-blue-900 mb-3">빠른 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonMenuStructures.map((template, index) => (
            <button
              key={index}
              type="button"
              onClick={() => applyTemplate(template.structure)}
              className="p-3 bg-white border border-blue-200 rounded-lg text-left hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-blue-900">{template.name}</h4>
              <p className="text-sm text-blue-700 mt-1">
                {template.structure.primaryMenu.slice(0, 3).join(', ')} 등
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">메뉴 구성</h3>
            <button
              type="button"
              onClick={() => appendPrimary('')}
              className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              주메뉴 추가
            </button>
          </div>

          <div className="space-y-6">
            {primaryFields.map((field, primaryIndex) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: primaryIndex * 0.1 }}
                className="bg-white rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1차 메뉴 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`menuStructure.primaryMenu.${primaryIndex}`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="주메뉴명을 입력하세요"
                    />
                    {errors.menuStructure?.primaryMenu?.[primaryIndex] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.menuStructure.primaryMenu[primaryIndex]?.message}
                      </p>
                    )}
                  </div>
                  
                  {primaryFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrimary(primaryIndex)}
                      className="flex items-center px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 2차 메뉴 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2차 메뉴 (서브메뉴)
                  </label>
                  
                  {primaryMenu[primaryIndex] && (
                    <div className="space-y-2">
                      {(secondaryMenu[primaryMenu[primaryIndex]] || []).map((subMenu: string, subIndex: number) => (
                        <div key={subIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={subMenu}
                            onChange={(e) => {
                              const primaryMenuName = primaryMenu[primaryIndex]
                              const currentSecondary = secondaryMenu[primaryMenuName] || []
                              const updated = [...currentSecondary]
                              updated[subIndex] = e.target.value
                              setValue(`menuStructure.secondaryMenu.${primaryMenuName}`, updated)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="서브메뉴명"
                          />
                          <button
                            type="button"
                            onClick={() => removeSecondaryMenu(primaryIndex, subIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="새 서브메뉴 추가"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const target = e.target as HTMLInputElement
                              addSecondaryMenu(primaryIndex, target.value)
                              target.value = ''
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                            addSecondaryMenu(primaryIndex, input.value)
                            input.value = ''
                          }}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 미리보기 */}
        {primaryMenu && primaryMenu.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">메뉴 구조 미리보기</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-900">1차 메뉴</th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-900">2차 메뉴</th>
                  </tr>
                </thead>
                <tbody>
                  {primaryMenu.map((primary, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4 text-sm font-medium text-gray-900 align-top">
                        {primary}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {(secondaryMenu[primary] || []).map((secondary: string, subIndex: number) => (
                            <span
                              key={subIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {secondary}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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