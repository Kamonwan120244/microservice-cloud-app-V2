import { RowHalfHalf } from '@/styles/voice-processing.style';
import { Form, Input, Typography } from 'antd';
import React from 'react';

const FormPatient = () => {
  return (
    <>
      <Typography.Title
        level={4}
        style={{ margin: 0, alignSelf: 'self-start' }}
      >
        Patient Information
      </Typography.Title>
      <RowHalfHalf>
        <Form.Item
          label="First name"
          name="firstname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last name"
          name="lastname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </RowHalfHalf>
    </>
  );
};

export default FormPatient;
