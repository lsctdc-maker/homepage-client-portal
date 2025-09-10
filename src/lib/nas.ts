import SMB2 from '@marsaud/smb2'
import path from 'path'

interface NASConfig {
  host: string
  username: string
  password: string
  basePath: string
}

export class NASClient {
  private config: NASConfig
  private client: any

  constructor() {
    this.config = {
      host: process.env.NAS_HOST || '',
      username: process.env.NAS_USERNAME || '',
      password: process.env.NAS_PASSWORD || '',
      basePath: process.env.NAS_BASE_PATH || '/projects'
    }

    if (this.config.host) {
      this.client = new SMB2({
        share: `\\\\${this.config.host}\\projects`,
        domain: '',
        username: this.config.username,
        password: this.config.password,
      })
    }
  }

  async ensureDirectory(dirPath: string): Promise<void> {
    if (!this.client || !this.config.host) {
      console.log('NAS not configured, using local storage only')
      return
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.client.ensureDir(dirPath, (err: any) => {
          if (err) {
            console.error('NAS directory creation error:', err)
            reject(err)
          } else {
            console.log(`NAS directory created/ensured: ${dirPath}`)
            resolve()
          }
        })
      })
    } catch (error) {
      console.error('Failed to create NAS directory:', error)
      throw error
    }
  }

  async writeFile(filePath: string, data: Buffer): Promise<void> {
    if (!this.client || !this.config.host) {
      console.log('NAS not configured, using local storage only')
      return
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.client.writeFile(filePath, data, (err: any) => {
          if (err) {
            console.error('NAS file write error:', err)
            reject(err)
          } else {
            console.log(`File written to NAS: ${filePath}`)
            resolve()
          }
        })
      })
    } catch (error) {
      console.error('Failed to write file to NAS:', error)
      throw error
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!this.client || !this.config.host) {
      console.log('NAS not configured, using local storage only')
      return
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.client.unlink(filePath, (err: any) => {
          if (err) {
            console.error('NAS file delete error:', err)
            reject(err)
          } else {
            console.log(`File deleted from NAS: ${filePath}`)
            resolve()
          }
        })
      })
    } catch (error) {
      console.error('Failed to delete file from NAS:', error)
      throw error
    }
  }

  async createProjectFolder(projectId: string, companyName: string): Promise<string> {
    const folderStructure = [
      '01_기업정보',
      '02_호스팅도메인',
      '03_메일설정',
      '04_SEO정보',
      '05_디자인레퍼런스',
      '06_사이트맵',
      '07_홈페이지자료',
    ]

    const projectFolderName = `${companyName}_${new Date().toISOString().split('T')[0]}_${projectId.slice(0, 8)}`
    
    try {
      // 프로젝트 메인 폴더 생성
      await this.ensureDirectory(projectFolderName)
      
      // 각 단계별 서브폴더 생성
      for (const folder of folderStructure) {
        const subFolderPath = path.posix.join(projectFolderName, folder)
        await this.ensureDirectory(subFolderPath)
      }

      console.log(`Created complete NAS folder structure for: ${projectFolderName}`)
      return projectFolderName
      
    } catch (error) {
      console.error('Failed to create project folder structure:', error)
      throw error
    }
  }

  isConnected(): boolean {
    return !!(this.client && this.config.host)
  }

  getConfig(): Partial<NASConfig> {
    return {
      host: this.config.host,
      username: this.config.username,
      basePath: this.config.basePath
    }
  }
}

// 싱글톤 인스턴스
export const nasClient = new NASClient()