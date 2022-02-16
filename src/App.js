import './App.css';
import React from "react";
import { Input, Button, Typography, notification } from 'antd';
import { SettingFilled, BarChartOutlined } from '@ant-design/icons';
const { Title } = Typography;

class App extends React.Component{

  constructor(){
    super();
    this.state = {
      text: "",
      loading: false,
    }
  }
  

  prework = () => {
    this.setState({
      loading: true,
    },() => {
      this.check();
    });
  }

  check = () => {
    let temp = this.state.text;
    let tempLen = temp.length;
    let tempArray = [];//用来记录括号
    let flag=false;
    temp = temp.replace(/\s/g,"");
    for(let i=0;i<tempLen;i++){
      if(temp[i]==='('){
        tempArray.push(i);
      }
      if(temp[i]===')'){
        if(tempArray.length===0){
          flag=true;
          break;
        }
        tempArray.pop();
      }
    }
    if(tempArray.length>0||flag){
      this.setState({
        loading: false,
      },()=>{
        notification['error']({
          message: '您输入的表达式括号不匹配，请检查',
          description: null,
          onClick: () => {
            
          },
        });
      });
      return;
    }
    this.divi(temp);
  }

  divi = (str) =>{

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
            <Input className="input" 
              value={this.state.text} 
              onChange={this.input.bind()}
              placeholder="Basic usage"
            />
            <Button className="button"
              type="primary" 
              icon={<SettingFilled />}
              onClick={this.prework.bind()}
              loading={this.state.loading}
            />  
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
