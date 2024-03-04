import React, { useState } from 'react';
import {
  Container,
  FormContainer,
  Frame,
} from '@/styles/voice-processing.style';
import LayoutProvider from '@/providers/layout.provider';
import { Button, Form, Steps, notification } from 'antd';
import FormPatient from '@/components/form-patient';
import { pb } from '../_app';
import EyeTest from '@/components/eye-test';
import FormTestRes from '@/components/form-test-res';
import { useRouter } from 'next/router';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
const steps = [
  {
    title: 'Patient Information',
    content: <FormPatient />,
  },
  {
    title: 'Testing',
    content: <EyeTest />,
  },
  {
    title: 'Test Results',
    content: <FormTestRes />,
  },
];
const VoiceProcessingPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [current, setCurrent] = useState(0);
  const [patientId, setPatientId] = useState('');

  const doctor_id = pb.authStore.model?.id;
  const clinic_id = pb.authStore.model?.clinic_id;
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const next = () => setCurrent((prev: number) => prev + 1);
  const prev = () => setCurrent((prev: number) => prev - 1);

  const onFinish = async (values: any) => {
    if (current === 0) {
      const name = `${values.firstname} ${values.lastname}`;
      try {
        const resPatient = await pb
          .collection('patient')
          .getFirstListItem(`name="${name}" && clinic_id="${clinic_id}"`);
        setPatientId(resPatient.id);
        next();
      } catch (error: any) {
        try {
          const data = { name, clinic_id };
          const resPatient = await pb.collection('patient').create(data);
          setPatientId(resPatient.id);
          next();
        } catch (error: any) {
          api.error({
            message: 'Error',
            description: error?.message,
          });
        }
      }
    } else if (current === 1) {
      next();
    } else if (current === 2) {
      const data = { ...values, doctor_id, patient_id: patientId };
      try {
        await pb.collection('history').create(data);
        router.push('/dashboard');
      } catch (error: any) {
        api.error({
          message: 'Error',
          description: error?.message,
        });
      }
    }
  };

  return (
    <LayoutProvider>
      {contextHolder}
      <Container>
        <Steps current={current} items={items} />
        <Frame>
          <FormContainer
            id="myForm"
            name="patient-information-form"
            form={form}
            onFinish={onFinish}
          >
            {steps[current].content}
          </FormContainer>
        </Frame>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {current !== 0 ? (
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => prev()}
              icon={<ArrowLeftOutlined />}
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          {current >= 0 && (
            <Button type="primary" form="myForm" key="submit" htmlType="submit">
              {current !== steps.length - 1 ? 'Next' : 'Done'}
              {current !== steps.length - 1 ? <ArrowRightOutlined /> : ''}
            </Button>
          )}
        </div>
      </Container>
    </LayoutProvider>
  );
};

export default VoiceProcessingPage;
