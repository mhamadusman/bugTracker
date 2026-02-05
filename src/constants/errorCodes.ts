export enum errorCodes {

  // 400 — Client sent invalid or incomplete data
  // Use when: required field missing, invalid format, wrong payload
  BAD_REQUEST = 400,

  CREATED =  201,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,

  // 404 — Requested resource does not exist
  // Use when: user/project/document ID not found
  DOCUMENT_NOT_FOUND = 404,

  // 409 — Request conflicts with current system state
  // Use when: duplicate email, username already exists,
  //           invalid state transition (e.g., closing an already closed ticket)
  CONFLICT_WITH_CURRENT_STATE = 409,

  // 501 — Feature exists in API but not implemented yet
  // Use when: endpoint planned but logic not written
  NOT_IMPLEMENTED = 501,

  //system errors 

  INTERNAL_SERVER_ERROR = 500
}
