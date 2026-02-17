export const BugErrorMessages = Object.freeze({
  TITLE_REQUIRED: "Bug title is required",
  DESCRIPTION_REQUIRED: "Bug description is required",
  INVALID_DEADLINE: "Deadline must be today or a future date",
  INVALID_TYPE: "Provide a valid bug type (pending, in-progress or completed)",
  DEVELOPER_REQUIRED: "A Developer must be assigned to the bug",
  DUPLICATE_TITLE: "Bug title must be unique within the project scope",
  INVALID_PROJECT_ID: "Create bug or task on a valid project",
});


export const BugFields = {
    TITLE: "title",
    DESCRIPTION: "description",
    DEADLINE: "deadline",
    TYPE: "type",
    DEVELOPER_ID: "developerId",
    PROJECT_ID: "projectId"
} as const;