'use client'

import { Project } from '@/types'
import Step1Form from '@/components/steps/Step1Form'
import Step2Form from '@/components/steps/Step2Form'
import Step3Form from '@/components/steps/Step3Form'
import Step4Form from '@/components/steps/Step4Form'
import Step5Form from '@/components/steps/Step5Form'
import Step6Form from '@/components/steps/Step6Form'
import Step7Form from '@/components/steps/Step7Form'

interface StepContentProps {
  step: number
  project: Project
  onStepComplete: (step: number, data: any) => void
}

export default function StepContent({ step, project, onStepComplete }: StepContentProps) {
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1Form project={project} onComplete={onStepComplete} />
      case 2:
        return <Step2Form project={project} onComplete={onStepComplete} />
      case 3:
        return <Step3Form project={project} onComplete={onStepComplete} />
      case 4:
        return <Step4Form project={project} onComplete={onStepComplete} />
      case 5:
        return <Step5Form project={project} onComplete={onStepComplete} />
      case 6:
        return <Step6Form project={project} onComplete={onStepComplete} />
      case 7:
        return <Step7Form project={project} onComplete={onStepComplete} />
      default:
        return <div>Invalid step</div>
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {renderStepContent()}
    </div>
  )
}