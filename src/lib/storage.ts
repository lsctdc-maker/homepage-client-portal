import { Project } from '@/types'

// Node.js 글로벌 객체를 사용한 진정한 싱글톤 저장소
declare global {
  var __PROJECT_STORAGE__: { [key: string]: Project } | undefined
}

// 글로벌 저장소 초기화
if (!global.__PROJECT_STORAGE__) {
  global.__PROJECT_STORAGE__ = {}
}

// 임시 인메모리 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
class ProjectStorage {
  private get projects(): { [key: string]: Project } {
    return global.__PROJECT_STORAGE__ || {}
  }

  private set projects(value: { [key: string]: Project }) {
    global.__PROJECT_STORAGE__ = value
  }

  set(id: string, project: Project): void {
    const currentProjects = this.projects
    currentProjects[id] = project
    this.projects = currentProjects
    console.log(`✅ Project saved: ${id} - ${project.companyName}`)
    console.log(`📊 Total projects in storage: ${Object.keys(currentProjects).length}`)
  }

  get(id: string): Project | undefined {
    const project = this.projects[id]
    console.log(`🔍 Project lookup: ${id} - ${project ? 'FOUND' : 'NOT FOUND'}`)
    if (!project) {
      console.log(`📋 Available project IDs: ${Object.keys(this.projects).join(', ')}`)
    }
    return project
  }

  getAll(): Project[] {
    const allProjects = Object.values(this.projects)
    console.log(`📝 Fetching all projects: ${allProjects.length} found`)
    return allProjects
  }

  delete(id: string): boolean {
    if (this.projects[id]) {
      const currentProjects = this.projects
      delete currentProjects[id]
      this.projects = currentProjects
      console.log(`🗑️ Project deleted: ${id}`)
      return true
    }
    return false
  }

  exists(id: string): boolean {
    return !!this.projects[id]
  }

  // 디버깅용 메서드
  debug(): void {
    console.log('🔧 PROJECT STORAGE DEBUG:')
    console.log('Total projects:', Object.keys(this.projects).length)
    Object.entries(this.projects).forEach(([id, project]) => {
      console.log(`  - ${id}: ${project.companyName}`)
    })
  }
}

// 싱글톤 인스턴스
export const projectStorage = new ProjectStorage()