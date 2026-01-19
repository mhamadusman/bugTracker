export const UserErrorMessages = Object.freeze({

  // Validation errors
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  USER_DATA_INCOMPLETE:  'Please provide all requiered details to create user',

  // Authentication errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_MISSING: 'Authentication token is missing',
  TOKEN_EXPIRED: 'Session expired, please login again',

  // Authorization errors
  ACCESS_DENIED: 'You do not have permission to perform this action',

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

  //incomplete project data 

  INVALID_SQA_IDS_TO_CREATE_PROJECET: 'Please enter valid SQA ids',

  INVALID_DEVELOPER_IDS_TO_CREATE_PROJECET: 'Please enter valid DEVELOPER ids',

  INVALID_ID: 'Invalid Id please provide valid id to complete the request',

  INcOMPELETE_DATA_TO_CREATE_PROEJECT: 'Please enter Valid data proper SQA or DEVELOPER IDS or Project name   to create project',
  

  //
  
});
