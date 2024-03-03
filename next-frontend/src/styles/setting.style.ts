import styled from 'styled-components';
import { Form } from 'antd';

export const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const FormSetFont = styled(Form)`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-items: center;

`;
