export const UserErrorMessages = Object.freeze({
  // Validation errors
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  USER_DATA_INCOMPLETE:  'Please provide all requiered details and user type to create user',
  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_MISSING: 'Authentication token is missing',
  TOKEN_EXPIRED: 'Session expired, please login again',
  LOGIN_AGAIN: 'Please login again',
  // Authorization errors
  ACCESS_DENIED: 'Access denied',
  UNAUTHORIZED: 'Please login to perform this action',
  // Resource errors
  USER_NOT_FOUND: 'User not found',
  DOCUMENT_NOT_FOUND: 'Requested document does not exist',
  // Conflict errors
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_ALREADY_EXISTS: 'User already exists',
  // State errors
  INVALID_REQUEST_STATE: 'Request cannot be processed in current state',
  //invalid user type
  INVALID_USER_TYPE: 'Please enter valid user type',
  INVALID_EMAIL_FOMATE: 'Please provide valid email formate',
  //incomplete project data 
  INVALID_SQA_IDS_TO_CREATE_PROJECET: 'Please enter valid SQA ids',
  INVALID_DEVELOPER_IDS_TO_CREATE_PROJECET: 'Please enter valid DEVELOPER ids',
  PROJECT_NOT_FOUND: 'Project could not be deleted. It may have already been removed.',
  INcOMPELETE_DATA_TO_CREATE_PROEJECT: 'Please enter valid data proper SQA or developer IDS, Project name to create project',
  //bug errors
  INVALID_BUG_STATUS: 'Please select bugStatus from (pending, in_progress, completed)',
  //un-uthorized 
  ACCESS_TOKEN_EXPIRED: 'Session expired please log in again',
  REFRESH_TOKEN_EXPIRED: 'Session expired please login again',
});
