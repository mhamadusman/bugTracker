import { z } from 'zod';
import { ProjectErrorMessages } from '../constants/ProjectErrorMessages';

export const validIdSchema = z.coerce
  .number({ message: ProjectErrorMessages.INVALID_ID_FORMAT }) 
  .int(ProjectErrorMessages.INVALID_ID_FORMAT)
  .positive(ProjectErrorMessages.INVALID_ID_FORMAT)
  .finite(ProjectErrorMessages.INVALID_ID_FORMAT);