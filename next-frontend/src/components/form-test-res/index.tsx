import { RowHalfHalf } from '@/styles/voice-processing.style';
import { Form, InputNumber, Typography } from 'antd';
import React from 'react';

const FormTestRes: React.FC = () => {
  return (
    <>
      <Typography.Title
        level={4}
        style={{ margin: 0, alignSelf: 'self-start' }}
      >
        Test Results
      </Typography.Title>
      <Typography.Title
        level={5}
        style={{ margin: 0, alignSelf: 'self-start' }}
      >
        SPH:
      </Typography.Title>
      <RowHalfHalf>
        <Form.Item label="Left" name="sph_l" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Right" name="sph_r" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </RowHalfHalf>
      <Typography.Title
        level={5}
        style={{ margin: 0, alignSelf: 'self-start' }}
      >
        CYL:
      </Typography.Title>
      <RowHalfHalf>
        <Form.Item label="Left" name="cyl_l" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Right" name="cyl_r" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </RowHalfHalf>
      <Typography.Title
        level={5}
        style={{ margin: 0, alignSelf: 'self-start' }}
      >
        AX:
      </Typography.Title>
      <RowHalfHalf>
        <Form.Item label="Left" name="ax_l" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Right" name="ax_r" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </RowHalfHalf>
    </>
  );
};

export default FormTestRes;
