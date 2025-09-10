'use client'

import { Project } from '@/types'
import { STEPS } from '@/lib/constants'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface ProgressDashboardProps {
  project: Project
  currentStep: number
  onStepChange: (step: number) => void
}

export default function ProgressDashboard({ 
  project, 
  currentStep, 
  onStepChange 
}: ProgressDashboardProps) {
  const getStepStatus = (stepNumber: number) => {
    const stepKey = `step${stepNumber}` as keyof typeof project.progress
    if (project.progress[stepKey]) return 'completed'
    if (stepNumber === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">진행 현황</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">전체 진행률</span>
          <span className="font-semibold text-tong-blue">{project.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.completionRate}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-gradient-to-r from-tong-blue to-blue-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 mb-3">단계별 진행상황</h4>
        {STEPS.map((step, index) => {
          const stepNumber = index + 1
          const status = getStepStatus(stepNumber)
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                status === 'active'
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : status === 'completed'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => onStepChange(stepNumber)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {status === 'completed' ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : status === 'active' ? (
                    <ClockIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{step.icon}</span>
                    <p className={`text-sm font-medium ${
                      status === 'active'
                        ? 'text-blue-700'
                        : status === 'completed'
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {project.completionRate === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-800">
                모든 자료가 수집되었습니다!
              </p>
              <p className="text-xs text-green-600">
                곧 홈페이지 제작을 시작하겠습니다.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}