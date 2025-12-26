export interface FreshdeskTicket {
  id: number;
  subject: string;
  description_text: string;
  status: number;
  priority: number;
  created_at: string;
  updated_at: string;
  due_by: string;
  fr_due_by: string;
  requester_id: number;
  responder_id: number | null;
  group_id: number;
  agent_id: number | null;
  type: string | null;
  custom_fields: Record<string, unknown>;
}

export interface FreshdeskSearchResponse {
  results: FreshdeskTicket[];
  total: number;
}

export interface TicketSearchParams {
  groupId?: number;
  agentId?: number;
}

