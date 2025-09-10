'use client'

import Link from 'next/link'
import { ArrowLeftIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Project } from '@/types'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ProjectHeaderProps {
  project: Project
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              홈으로
            </Link>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-tong-blue rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {project.companyName}
                </h1>
                <p className="text-sm text-gray-600">
                  담당자: {project.managerName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                진행률 {project.completionRate}%
              </div>
              <div className="text-xs text-gray-600 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {format(new Date(project.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
              </div>
            </div>

            <div className="w-16 h-16 relative">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - project.completionRate / 100)}`}
                  className="text-tong-blue transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-semibold text-gray-700">
                  {project.completionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}