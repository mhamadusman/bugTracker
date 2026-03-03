import { z } from 'zod';
import { ProjectErrorMessages } from '../constants/ProjectErrorMessages';

export const validIdSchema = z.coerce
  .number({ message: ProjectErrorMessages.INVALID_PROJECT_ID }) 
  .int(ProjectErrorMessages.INVALID_PROJECT_ID)
  .positive(ProjectErrorMessages.INVALID_PROJECT_ID)
  .finite(ProjectErrorMessages.INVALID_PROJECT_ID);