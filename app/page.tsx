import { sortByTotalDescending } from '@/lib/utils'
import { useGroupTotals } from '@/lib/useGroupTotals'
import { createSunburstData } from '@/lib/utils/sunburstData'
import SunburstChart from '@/components/SunburstChart'

export default async function Home() {
  const CAIT = 43000274288
  const GAIT = 43000274289
  const DEV = 43000311421
  const ECCOMERCE = 43000648577
  const ERP = 43000394732
  const GENERAL = 43000311424
  const NETWORK = 43000368494
  const SERVER = 43000368565
  const MDVAIT = 43000274287
  const PROCUREMENT = 43000665742
  const TECH = 43000274286
  const POS = 43000374331
  const TXIT = 43000665904

  const regions = [
    { name: 'CA IT', id: CAIT },
    { name: 'GA IT', id: GAIT },
    { name: 'TX IT', id: TXIT },
    { name: 'MD/VA IT', id: MDVAIT },
  ]

  const teams = [
    { name: 'DEVOps', id: DEV },
    { name: 'E-CCOMERCE', id: ECCOMERCE },
    { name: 'ERPOps', id: ERP },
    { name: 'GENERAL HELPDESK', id: GENERAL },
    { name: 'INFRA-NETWORK', id: NETWORK },
    { name: 'INFRA-SERVER', id: SERVER },
    { name: 'PROCUREMENT', id: PROCUREMENT },
    { name: 'TECHOps', id: TECH },
    { name: 'TECHOps-POS', id: POS },
  ]

  const regionTotals = await useGroupTotals(regions)
  const teamTotals = await useGroupTotals(teams)

  // 티켓 수가 많은 순서대로 정렬
  const sortedRegionTotals = sortByTotalDescending(regionTotals)
  const sortedTeamTotals = sortByTotalDescending(teamTotals)

  // Sunburst 차트 데이터 생성
  const sunburstData = createSunburstData(regionTotals, teamTotals)

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">H Mart Unresolved Ticket Statistics</h1>

        <div className="space-y-8">
          {/* Sunburst Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">티켓 분포</h2>
            <SunburstChart data={sunburstData} />
          </div>

          {/* Region Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Region</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedRegionTotals.map(group => (
                <div key={group.name} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                  {group.error ? (
                    <p className="text-red-600 text-sm">오류: {group.error}</p>
                  ) : (
                    <p className="text-4xl font-bold">{group.total}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedTeamTotals.map(group => (
                <div key={group.name} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                  {group.error ? (
                    <p className="text-red-600 text-sm">오류: {group.error}</p>
                  ) : (
                    <p className="text-4xl font-bold">{group.total}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
