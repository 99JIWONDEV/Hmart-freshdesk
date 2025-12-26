import { FreshdeskSearchResponse, TicketSearchParams } from '@/types/freshdesk'

const FRESHDESK_BASE_URL = 'https://hmart.freshdesk.com/api/v2'
const UNRESOLVED_STATUS_QUERY = '(status:2 OR status:6 OR status:8 OR status:9 OR status:10)'

/**
 * Freshdesk API 인증 헤더를 생성합니다.
 */
function getAuthHeader(): string {
  const username = process.env.FRESHDESK_API_KEY
  const password = process.env.FRESHDESK_API_PASSWORD || 'X' //

  if (!username) {
    throw new Error('FRESHDESK_API_KEY 환경 변수가 설정되지 않았습니다.')
  }

  // Basic Auth 헤더 생성 (username:password를 base64 인코딩)
  const credentials = Buffer.from(`${username}:${password}`).toString('base64')
  return `Basic ${credentials}`
}

/**
 * Freshdesk API에서 티켓을 검색합니다.
 */
async function searchTickets(query: string): Promise<FreshdeskSearchResponse> {
  const authHeader = getAuthHeader()
  const url = `${FRESHDESK_BASE_URL}/search/tickets?query="${encodeURIComponent(query)}"`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Freshdesk API 오류 (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`티켓 검색 실패: ${error.message}`)
    }
    throw error
  }
}

/**
 * 그룹별 미해결 티켓을 가져옵니다.
 */
export async function getGroupUnresolvedTickets(groupId: number): Promise<FreshdeskSearchResponse> {
  const query = `group_id:${groupId} AND ${UNRESOLVED_STATUS_QUERY}`
  return searchTickets(query)
}

/**
 * 개인별 미해결 티켓을 가져옵니다.
 */
export async function getAgentUnresolvedTickets(agentId: number): Promise<FreshdeskSearchResponse> {
  const query = `agent_id:${agentId} AND ${UNRESOLVED_STATUS_QUERY}`
  return searchTickets(query)
}

/**
 * 티켓 검색 (유연한 검색)
 */
export async function searchTicketsByParams(
  params: TicketSearchParams
): Promise<FreshdeskSearchResponse> {
  const conditions: string[] = []

  if (params.groupId) {
    conditions.push(`group_id:${params.groupId}`)
  }

  if (params.agentId) {
    conditions.push(`agent_id:${params.agentId}`)
  }

  if (conditions.length === 0) {
    throw new Error('groupId 또는 agentId 중 하나는 필수입니다.')
  }

  const query = `${conditions.join(' AND ')} AND ${UNRESOLVED_STATUS_QUERY}`
  return searchTickets(query)
}
