import './App.css';
import React from "react";
import { Input, Button, Typography } from 'antd';
import { PaperClipOutlined, BarChartOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Title } = Typography;

class App extends React.Component{

  constructor(){
    super();
    this.state = {
      text: "",
      loading: false,
    }
  }

  work = () => {
    this.setState({
      loading: true,
    },() => {
      this.setState({
        loading: false,
      });
    });
  }

  input = e => {
    this.setState({
      text: e.target.value,
    });
  }

  render(){
    return (
      <div>
        <div className="App">
          <Title className="title">
            <BarChartOutlined />
            <span style={{fontSize:'30px',marginLeft:'10px'}}>布尔表达式的逻辑覆盖</span>
          </Title>
          <div className="input-box">
            <TextArea className="input" 
              value={this.state.text} 
              autoSize={{minRows: 3, maxRows: 3}}
              onPressEnter={this.work.bind()} 
              onChange={this.input.bind()}
              placeholder="Basic usage"
            />
            <Button className="button"
              type="primary" 
              icon={<PaperClipOutlined />}
              onClick={this.work.bind()}
              loading={this.state.loading}
            />  
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
