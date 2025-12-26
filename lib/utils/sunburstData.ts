import { GroupTotal } from '@/lib/utils'

interface SunburstNode {
  name: string
  value: number
  children?: SunburstNode[]
}

export function createSunburstData(
  regionTotals: GroupTotal[],
  teamTotals: GroupTotal[]
): SunburstNode {
  // 에러가 있는 항목 제외
  const validRegions = regionTotals.filter(r => !r.error)
  const validTeams = teamTotals.filter(t => !t.error)

  // Region 자식 노드 생성 (각 지역별 티켓)
  const regionChildren: SunburstNode[] = validRegions.map(region => ({
    name: region.name,
    value: region.total,
  }))

  // Team 자식 노드 생성 (각 팀별 티켓)
  const teamChildren: SunburstNode[] = validTeams.map(team => ({
    name: team.name,
    value: team.total,
  }))

  // Region의 모든 티켓 합계 (children의 합)
  const regionChildrenSum = regionChildren.reduce((sum, c) => sum + c.value, 0)

  // Team의 모든 티켓 합계 (children의 합)
  const teamChildrenSum = teamChildren.reduce((sum, c) => sum + c.value, 0)

  // Region 노드: value는 children의 합과 정확히 일치해야 함
  const regionNode: SunburstNode = {
    name: 'Region',
    value: regionChildrenSum,
    children: regionChildren.length > 0 ? regionChildren : undefined,
  }

  // Team 노드: value는 children의 합과 정확히 일치해야 함
  const teamNode: SunburstNode = {
    name: 'Team',
    value: teamChildrenSum,
    children: teamChildren.length > 0 ? teamChildren : undefined,
  }

  // 루트 노드: value는 children (Region + Team)의 합과 정확히 일치해야 함
  // nivo는 children의 value 합을 사용하여 비율을 계산하므로 정확히 일치시켜야 함
  const rootTotal = regionNode.value + teamNode.value

  const root: SunburstNode = {
    name: '전체',
    value: rootTotal,
    children: [regionNode, teamNode],
  }

  return root
}
