import { Project } from '@/types'

// 임시 인메모리 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
class ProjectStorage {
  private projects: { [key: string]: Project } = {}

  set(id: string, project: Project): void {
    this.projects[id] = project
  }

  get(id: string): Project | undefined {
    return this.projects[id]
  }

  getAll(): Project[] {
    return Object.values(this.projects)
  }

  delete(id: string): boolean {
    if (this.projects[id]) {
      delete this.projects[id]
      return true
    }
    return false
  }

  exists(id: string): boolean {
    return !!this.projects[id]
  }
}

// 싱글톤 인스턴스
export const projectStorage = new ProjectStorage()