import * as yup from 'yup';

export const engagementToolsValidationSchema = yup.object().shape({
  tool_name: yup.string().required(),
  user_id: yup.string().nullable(),
});
