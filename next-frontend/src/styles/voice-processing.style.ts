import { Form, Input, theme } from 'antd';
import styled from 'styled-components';
// const { token } = theme.useToken();

export const Container = styled.div`
  display: flex;
  flex: 1;
  gap: 24px;
  padding: 0 0 24px 0;
  width: 100%;
  min-height: 100%;
  align-items: center;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-around;
  width: 60%;
`;

export const Header1 = styled.h1`
  font-size: 80px;
`;

export const TextInput = styled(Input)`
  width: 60%;
  height: 40vh;
  font-size: 30px;
  margin-bottom: 5%;
  color: 'black';
`;

export const FormContainer = styled(Form)`
  display: flex;
  gap: 16px;
  /* padding: 0 0 24px 0; */
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  /* align-items: center; */
`;

export const RowHalfHalf = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: auto auto;
  @media (max-width: 768px) {
    grid-template-columns: auto;
  }
`;

export const Frame = styled.div`
  display: flex;
  width: 100%;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgb(217, 217, 217);
  justify-content: center;
  flex: 1;
`;
