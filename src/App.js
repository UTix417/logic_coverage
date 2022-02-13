import './App.css';
import { Input, Button, Typography } from 'antd';
import { FundFilled, SettingFilled } from '@ant-design/icons';


const { Title } = Typography;
function App() {
  return (
    <div className="App">
      <Title><FundFilled /></Title>
      <Input placeholder="Basic usage"/>
      <Button type="primary" shape="circle" icon={<SettingFilled />} />
    </div>
  );
}

export default App;
