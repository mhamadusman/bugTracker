import { z } from 'zod';
const noHtmlRegex = /<\/?[^>]+(>|$)/g;

export const emailNotificationSchema = z.object({
  managerName: z.string()
    .min(1, "Manager name is required")
    .refine(val => !noHtmlRegex.test(val), "HTML tags are not allowed"),
    
  projectName: z.string()
    .min(1, "Project name is required")
    .refine(val => !noHtmlRegex.test(val), "HTML tags are not allowed"),
    
  description: z.string()
    .min(1, "Description is required")
    .refine(val => !noHtmlRegex.test(val), "HTML tags are not allowed"),
    
  receivers: z.array(z.string().email())
    .min(1, "At least one recipient is required")
});

export type EmailNotificationData = z.infer<typeof emailNotificationSchema>;