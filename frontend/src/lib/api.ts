import type {
  ApiErrorPayload,
  LeadCreateRequest,
  LeadCreateResponse,
  SimulationRequest,
  SimulationResponse,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const NETWORK_MESSAGE =
  "Unable to reach the Relay60 server. Please check your connection and try again.";

export class ApiClientError extends Error {
  status: number;
  code: string;
  fieldErrors: Record<string, string> | null;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors: Record<string, string> | null,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

async function postJson<T>(path: string, payload: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    throw new ApiClientError(0, "NETWORK_ERROR", NETWORK_MESSAGE, null);
  }

  if (!response.ok) {
    let code = `HTTP_${response.status}`;
    let message = "One or more fields failed validation.";
    let fieldErrors: Record<string, string> | null = null;
    try {
      const body = (await response.json()) as ApiErrorPayload;
      if (body.error) {
        code = body.error.code || code;
        message = body.error.message || message;
        fieldErrors = body.error.field_errors;
      }
    } catch {
      message = NETWORK_MESSAGE;
      code = "NETWORK_ERROR";
    }
    throw new ApiClientError(response.status, code, message, fieldErrors);
  }

  return (await response.json()) as T;
}

export function runSimulationApi(
  payload: SimulationRequest,
  signal?: AbortSignal,
): Promise<SimulationResponse> {
  return postJson<SimulationResponse>("/api/v1/simulations/run", payload, signal);
}

export function createLeadApi(payload: LeadCreateRequest): Promise<LeadCreateResponse> {
  return postJson<LeadCreateResponse>("/api/v1/leads", payload);
}
