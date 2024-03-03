import React, { useState, useEffect } from 'react';
import LayoutProvider from '@/providers/layout.provider';
import { pb } from '../_app';
import { Container } from '@/styles/dashboard.style';
import { useRouter } from 'next/router';
import { Button, Form, InputNumber, notification } from 'antd';
import { FormSetFont } from '@/styles/setting.style';

type size = {
  clinic_id: string;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  level7: number;
  level8: number;
};
const inputFont = [
  { name: 'level_1', fontSize: 82, fontDisplay: '8 5'},
  { name: 'level_2', fontSize: 64, fontDisplay: '1 2 3 4'},
  { name: 'level_3', fontSize: 52, fontDisplay: '5 6 7 8 3 3'  },
  { name: 'level_4', fontSize: 40, fontDisplay: '9 3 A F U H' },
  { name: 'level_5', fontSize: 32, fontDisplay: 'D I H 3 5 2' },
  { name: 'level_6', fontSize: 24, fontDisplay: '9 7 5 J 6 G' },
  { name: 'level_7', fontSize: 16, fontDisplay: '9 7 3 0 H K' },
  { name: 'level_8', fontSize: 12, fontDisplay: 'D A H U 6 0' },
];

function SettingPage() {
  const [api, contextHolder] = notification.useNotification();
  const [oldFont, setDataSource] = useState<any>();
  // const [lengthFontSize, setTotal] = React.useState<number>(0);
  const clinicID = pb.authStore.model?.clinic_id;
  console.log('clinicId:', clinicID);
  const [fontSizeID, getfontSizeID] = React.useState<any>();
  const router = useRouter();
  const [oldSize, getOldSize] = React.useState<any>();

  const [form] = Form.useForm<size>();

  const fetchData = React.useCallback(async () => {
    try {
      const result = await pb
        .collection('font_size')
        .getFirstListItem(`clinic_id="${clinicID}"`);

      getfontSizeID(result.id);

    } catch (error: any) {
      getfontSizeID(null);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, []);


  const onFinish = async (values: any) => {
    const data = {
      "clinic_id": clinicID,
      "level_1": values.level_1,
      "level_2": values.level_2,
      "level_3": values.level_3,
      "level_4": values.level_4,
      "level_5": values.level_5,
      "level_6": values.level_6,
      "level_7": values.level_7,
      "level_8": values.level_8
    };
    try {
      if (fontSizeID == null){ //post
        const record = await pb.collection('font_size').create(data);
        console.log("post")
      } else { // patch
        const record = await pb.collection('font_size').update(fontSizeID, data);
        console.log("patch")
      }
      
    }catch (error) {
      console.error('failed:', error);
    } finally {
      api.success({
        message: 'Setting Success',
      });
      router.push('/dashboard');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <LayoutProvider>
      <Container>
        <h1>Setting</h1>
        <FormSetFont
          name="basic"
          form={form}
          onFinish={onFinish}
          id="formSetFont"
        >
          <p style={{ textAlign: 'center' }}>Snellen Chart</p>
          <p style={{ textAlign: 'center' }}>Size Test (cm)</p>
          {inputFont.map((data) => {
            return (
              <>
                <p style={{ fontSize: data.fontSize, textAlign: 'center' }}>
                  {data.fontDisplay}
                </p>
                <Form.Item
                  name={data.name}
                  rules={[{ required: true, message: 'Please input number!' }]}
                  style={{}}
                >
                  <InputNumber style={{ width: '200px' }} />
                </Form.Item>
              </>
            );
          })}
        </FormSetFont>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 0',
          }}
          align-content="middle"
        >
          <Button htmlType="submit" type="primary" form="formSetFont">
            Update
          </Button>
        </div>
      </Container>
    </LayoutProvider>
  );
}

export default SettingPage;
