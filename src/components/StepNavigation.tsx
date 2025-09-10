'use client'

import { STEPS } from '@/lib/constants'
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface StepNavigationProps {
  currentStep: number
  completedSteps: { [key: string]: boolean }
  onStepChange: (step: number) => void
}

export default function StepNavigation({ 
  currentStep, 
  completedSteps, 
  onStepChange 
}: StepNavigationProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {STEPS.map((step, stepIdx) => {
            const stepNumber = stepIdx + 1
            const isCompleted = completedSteps[`step${stepNumber}`]
            const isCurrent = stepNumber === currentStep
            
            return (
              <li key={step.id} className="relative flex-1">
                {stepIdx !== STEPS.length - 1 && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: isCompleted ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-tong-blue"
                    />
                  </div>
                )}
                
                <button
                  onClick={() => onStepChange(stepNumber)}
                  className={`relative flex flex-col items-center group ${
                    isCurrent ? 'z-10' : ''
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      isCompleted
                        ? 'bg-tong-blue border-tong-blue text-white'
                        : isCurrent
                        ? 'border-tong-blue bg-white text-tong-blue ring-4 ring-blue-50'
                        : 'border-gray-300 bg-white text-gray-500 group-hover:border-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      stepNumber
                    )}
                  </span>
                  
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium max-w-20 ${
                      isCurrent
                        ? 'text-tong-blue'
                        : isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}>
                      {step.title.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
      
      {/* 현재 단계 정보 */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 bg-blue-50 rounded-lg"
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{STEPS[currentStep - 1].icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {STEPS[currentStep - 1].title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}