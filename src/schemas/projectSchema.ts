import { z } from "zod";
import {
  ProjectErrorMessages,
  ProjectFields,
} from "../constants/ProjectErrorMessages";

const commaSeparatedNumbers = /^\d+(?:\s*,\s*\d+)*$/;

export const projectSchema = z.object({
  [ProjectFields.NAME]: z
    .string({
      message: ProjectErrorMessages.NAME_REQUIRED
    })
    .trim()
    .min(1, ProjectErrorMessages.NAME_REQUIRED),

  [ProjectFields.DESCRIPTION]: z
    .string()
    .trim()
    .refine((val) => val.length > 0, {
      message: ProjectErrorMessages.DESCRIPTION_CANT_BE_EMPTY,
    })
    .optional()
    .or(z.literal("").transform(() => undefined))
    .or(z.null().transform(() => undefined)),

  [ProjectFields.SQA_IDS]: z
    .string({
      message: ProjectErrorMessages.DEVELOPER_REQUIRED,
    })
    .min(1, ProjectErrorMessages.SQA_REQUIRED)
    .regex(commaSeparatedNumbers, ProjectErrorMessages.INVALID_SQA_IDS),

  [ProjectFields.DEVELOPER_IDS]: z
    .string({
      message: ProjectErrorMessages.DEVELOPER_REQUIRED,
    })
    .min(1, ProjectErrorMessages.DEVELOPER_REQUIRED)
    .regex(commaSeparatedNumbers, ProjectErrorMessages.INVALID_DEVELOPER_IDS),
});
