import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createEngagementTools } from 'apiSdk/engagement-tools';
import { Error } from 'components/error';
import { engagementToolsValidationSchema } from 'validationSchema/engagement-tools';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { EngagementToolsInterface } from 'interfaces/engagement-tools';

function EngagementToolsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EngagementToolsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEngagementTools(values);
      resetForm();
      router.push('/engagement-tools');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EngagementToolsInterface>({
    initialValues: {
      tool_name: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: engagementToolsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Engagement Tools
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="tool_name" mb="4" isInvalid={!!formik.errors?.tool_name}>
            <FormLabel>Tool Name</FormLabel>
            <Input type="text" name="tool_name" value={formik.values?.tool_name} onChange={formik.handleChange} />
            {formik.errors.tool_name && <FormErrorMessage>{formik.errors?.tool_name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'engagement_tools',
    operation: AccessOperationEnum.CREATE,
  }),
)(EngagementToolsCreatePage);
