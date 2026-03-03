import { z } from "zod";
import {
  BugErrorMessages,
  BugFields,
} from "../constants/BugErrorMessages";
import { BugType } from "../models/bug.model";

export const bugSchema = z.object({
  [BugFields.TITLE]: z
    .string({ message: BugErrorMessages.TITLE_REQUIRED })
    .trim()
    .min(1, BugErrorMessages.TITLE_REQUIRED),

  [BugFields.DESCRIPTION]: z
    .string({ message: BugErrorMessages.DESCRIPTION_REQUIRED })
    .trim()
    .min(1, BugErrorMessages.DESCRIPTION_REQUIRED),

  [BugFields.TYPE]: z.nativeEnum(BugType, {
    message: BugErrorMessages.INVALID_TYPE,
  }),

  [BugFields.DEADLINE]: z.coerce
    .date({
      message: BugErrorMessages.INVALID_DEADLINE,
    })
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: BugErrorMessages.INVALID_DEADLINE },
    ),

  [BugFields.PROJECT_ID]: z.coerce
    .number({
      message: BugErrorMessages.INVALID_PROJECT_ID,
    })
    .int(BugErrorMessages.INVALID_PROJECT_ID)
    .positive(BugErrorMessages.INVALID_PROJECT_ID),

  [BugFields.DEVELOPER_ID]: z.coerce
    .number({
      message: BugErrorMessages.DEVELOPER_REQUIRED,
    })
    .int(BugErrorMessages.DEVELOPER_REQUIRED)
    .positive(BugErrorMessages.DEVELOPER_REQUIRED),
});
