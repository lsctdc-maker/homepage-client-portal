'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/types'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

type FilterStatus = 'all' | 'active' | 'completed' | 'paused'

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const projectList = await response.json()
        setProjects(projectList)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // 통계 계산
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed' || p.completionRate === 100).length
  const averageCompletion = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.completionRate, 0) / projects.length)
    : 0

  // 필터링된 프로젝트
  const filteredProjects = projects.filter(project => {
    switch (filter) {
      case 'active':
        return project.status === 'active' && project.completionRate < 100
      case 'completed':
        return project.status === 'completed' || project.completionRate === 100
      case 'paused':
        return project.status === 'paused'
      default:
        return true
    }
  })

  const getStatusColor = (project: Project) => {
    if (project.completionRate === 100) return 'text-green-600 bg-green-100'
    if (project.completionRate > 50) return 'text-blue-600 bg-blue-100'
    if (project.completionRate > 0) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getUrgency = (project: Project) => {
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (project.completionRate === 0 && daysSinceCreated > 7) return 'urgent'
    if (project.completionRate < 50 && daysSinceCreated > 5) return 'warning'
    return 'normal'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tong-blue"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600">프로젝트 현황 및 모니터링</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchProjects}
                className="px-4 py-2 bg-tong-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">전체 프로젝트</p>
                <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">진행 중</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">완료</p>
                <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">평균 완료율</p>
                <p className="text-2xl font-bold text-gray-900">{averageCompletion}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 필터 및 프로젝트 목록 */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">프로젝트 목록</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-4 h-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterStatus)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체</option>
                    <option value="active">진행 중</option>
                    <option value="completed">완료</option>
                    <option value="paused">일시정지</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    프로젝트
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    담당자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    진행률
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project, index) => {
                  const urgency = getUrgency(project)
                  
                  return (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {project.companyName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {project.id.slice(0, 8)}
                            </div>
                          </div>
                          {urgency === 'urgent' && (
                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{project.managerName}</div>
                        <div className="text-sm text-gray-500">{project.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>{project.completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.completionRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(project.createdAt), 'yyyy-MM-dd', { locale: ko })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project)}`}>
                          {project.completionRate === 100 ? '완료' : 
                           project.completionRate > 0 ? '진행중' : '대기'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => window.open(`/project/${project.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          보기
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">해당 조건의 프로젝트가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}