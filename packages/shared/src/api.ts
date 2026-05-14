/** Wire error envelope per OpenAPI `Error` schema. */
export const apiErrorCodes = [
  "validation_failed",
  "not_found",
  "unsupported_field",
  "persistence_unavailable",
  "internal_error",
] as const;

export type ApiErrorCode = (typeof apiErrorCodes)[number];

export type ApiErrorBody = {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiErrorEnvelope = {
  error: ApiErrorBody;
};

export type HealthResponse = {
  status: "ok";
  version?: string;
};
