import type { ItemType } from 'antd/es/menu/hooks/useItems';
import { PieChartOutlined, EyeOutlined } from '@ant-design/icons';

const routes: ItemType[] = [
  {
    key: '/dashboard',
    icon: <PieChartOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/voice-processing',
    icon: <EyeOutlined />,
    label: 'Testing',
  },
];

export default routes;
