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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getEngagementToolsById, updateEngagementToolsById } from 'apiSdk/engagement-tools';
import { Error } from 'components/error';
import { engagementToolsValidationSchema } from 'validationSchema/engagement-tools';
import { EngagementToolsInterface } from 'interfaces/engagement-tools';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function EngagementToolsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EngagementToolsInterface>(
    () => (id ? `/engagement-tools/${id}` : null),
    () => getEngagementToolsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EngagementToolsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEngagementToolsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/engagement-tools');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EngagementToolsInterface>({
    initialValues: data,
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
            Edit Engagement Tools
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(EngagementToolsEditPage);
