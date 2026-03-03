export const ProjectErrorMessages = Object.freeze({
  INVALID_PROJECT_ID: "Project not found",
  PERMISSION_DENIED: "You do not have permission to modify this project",
  NAME_REQUIRED: "Project name is required",
  SQA_REQUIRED: "At least one SQA must be assigned",
  INVALID_SQA_IDS: "One or more SQA IDs are invalid",
  DEVELOPER_REQUIRED: "At least one Developer must be assigned",
  INVALID_DEVELOPER_IDS: "One or more Developer IDs are invalid",
  DESCRIPTION_CANT_BE_EMPTY: 'Description can not be empty',
  
});


export const ProjectFields = {
    NAME: "name",
    SQA_IDS: "sqaIds",
    DEVELOPER_IDS: "developerIds",
    PROJECT_ID: "projectId",
    DESCRIPTION: "description",
    MANAGER_ID: "managerId",
    

 
} as const;