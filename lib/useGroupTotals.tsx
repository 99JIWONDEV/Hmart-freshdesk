import { getGroupUnresolvedTickets } from '@/lib/api/freshdesk'
import { GroupTotal } from '@/lib/utils'

interface Group {
  name: string
  id: number
}

export async function useGroupTotals(groups: Group[]): Promise<GroupTotal[]> {
  const results = await Promise.all(
    groups.map(async group => {
      try {
        const data = await getGroupUnresolvedTickets(group.id)
        return {
          name: group.name,
          total: data.total,
          error: null,
        }
      } catch (err) {
        return {
          name: group.name,
          total: 0,
          error: err instanceof Error ? err.message : '알 수 없는 오류',
        }
      }
    })
  )
  return results
}
