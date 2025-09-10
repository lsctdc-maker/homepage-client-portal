'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Project } from '@/types'
import { STEPS } from '@/lib/constants'
import ProjectHeader from '@/components/ProjectHeader'
import ProgressDashboard from '@/components/ProgressDashboard'
import StepNavigation from '@/components/StepNavigation'
import StepContent from '@/components/StepContent'

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (response.ok) {
          const projectData = await response.json()
          setProject(projectData)
        } else {
          console.error('프로젝트를 불러올 수 없습니다')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const handleStepComplete = async (stepNumber: number, data: any) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/steps/${stepNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedProject = await response.json()
        setProject(updatedProject)
        
        // 다음 미완성 단계로 자동 이동
        const nextIncompleteStep = STEPS.findIndex((_, index) => 
          !updatedProject.progress[`step${index + 1}`]
        ) + 1
        
        if (nextIncompleteStep > 0 && nextIncompleteStep <= STEPS.length) {
          setCurrentStep(nextIncompleteStep)
        }
      }
    } catch (error) {
      console.error('Error saving step data:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tong-blue"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">프로젝트를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">프로젝트 ID를 확인해주세요</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-tong-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectHeader project={project} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 진행률 대시보드 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProgressDashboard 
                project={project} 
                currentStep={currentStep}
                onStepChange={handleStepChange}
              />
            </motion.div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* 단계 네비게이션 */}
              <StepNavigation 
                currentStep={currentStep}
                completedSteps={project.progress}
                onStepChange={handleStepChange}
              />

              {/* 단계별 컨텐츠 */}
              <StepContent
                step={currentStep}
                project={project}
                onStepComplete={handleStepComplete}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}