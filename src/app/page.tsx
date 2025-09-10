'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRightIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [projectId, setProjectId] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고 및 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-tong-blue to-blue-600 rounded-2xl mb-4">
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">통컴퍼니</h1>
          <p className="text-gray-600">홈페이지 자료 수집 포털</p>
        </motion.div>

        {/* 메인 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            프로젝트 시작하기
          </h2>

          {/* 새 프로젝트 시작 */}
          <div className="space-y-4">
            <Link 
              href="/project/new"
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-tong-blue to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 group"
            >
              <div>
                <div className="font-semibold">새 프로젝트 시작</div>
                <div className="text-blue-100 text-sm">홈페이지 제작 자료를 준비해보세요</div>
              </div>
              <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* 구분선 */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-sm text-gray-500">또는</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* 기존 프로젝트 이어하기 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                기존 프로젝트 이어하기
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="프로젝트 ID를 입력하세요"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Link
                  href={projectId ? `/project/${projectId}` : '#'}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    projectId
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  이어하기
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 관리자 링크 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            관리자 모드
          </Link>
        </motion.div>
      </div>
    </div>
  )
}