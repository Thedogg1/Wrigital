import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  firmName: z.string().trim().min(1, 'Please enter your firm name.'),
  exitReportHtml: z
    .string()
    .trim()
    .min(100, 'Exit tax calculation report is missing. Please regenerate the calculator results and try again.'),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const leadFormFieldsSchema = leadSchema.pick({
  name: true,
  email: true,
  firmName: true,
});

export type LeadFormFields = z.infer<typeof leadFormFieldsSchema>;
