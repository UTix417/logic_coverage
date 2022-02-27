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
    let kuohaoflag=false;
    let sysflag=false;
    temp = temp.replace(/\s/g,"");
    for(let i=0;i<tempLen;i++){
      if(temp[i]==='('){
        tempArray.push(i);
      }
      if(temp[i]===')'){
        if(tempArray.length===0){
          kuohaoflag=true;
          break;
        }
        tempArray.pop();
      }
      if(i>0){
        if(temp[i]==temp[i-1]&&(temp[i]=='&'||temp[i]=='|')){
          sysflag=true;
          break;
        }
      }
    }
    if(sysflag){
      this.setState({
        loading: false,
      },()=>{
        notification['error']({
          message: '您输入的表达式有算符错误，请检查',
          description: null,
          onClick: () => {
            
          },
        });
      });
      return;
    }
    if(tempArray.length>0||kuohaoflag){
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
    let front=0;
    let back=0;
    for(let i=0;i<str.length;i++){
      if(str[i]=='('){
        break;
      }
      front++;
    }
    for(let i=str.length-1;i>=0;i--){
      if(str[i]==')'){
        break;
      }
      back++;
    }
    let num=Math.min(front,back);
    let tureStr=str.substring(num,str.length-num)
    for(let i=0;i<tureStr.length;i++){
      if(tureStr[i]=='('){
        return;
        this.makeElementSimpleWithNo(tureStr);
      }
    }
    this.workWithHave(tureStr);
  }

  workWithNo = (syn,pos) => {
    
  }

  workWithHave = (tureStr) => {
    
  }

  makeElementSimpleWithNo = (tureStr) => {
    let syn={};  
    let pos={};
    for(let i=0;i<tureStr.length;){
      let eleName='';
      let eleSyn='';
      let lasts=[];//用来维护算符段终点
      let notCount=0;
      if(tureStr[i]=='|'||tureStr=='&'){
        if(eleSyn!=tureStr[i]){
          lasts.push(i);
        }
        eleSyn=tureStr[i];
      }
      while(true){
        if(trueStr[i]=='!'){
          notCount++;
          if(tureStr=='|'||tureStr=='&'||i==tureStr.length){
            break;
          }else if(eleName.length){
            this.setState({
              loading: false,
            },()=>{
              notification['error']({
                message: '您输入的表达式有算符错误，请检查',
                description: null,
                onClick: () => {
                  
                },
              });
            });
            return;
          }
        }else{
          eleName+=tureStr[i];
        }
        i++;
      }
      if(notCount&1){
        eleSyn+='!';
      } 
      if(syn[eleName]){
        if(syn[eleName]==eleSyn){

        }else{
          if(syn[eleName]=='|'){
            if(eleSyn=='&!'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='|!'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='&'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(obj).forEach(()=>{
                if(pos[obj]<last){
                  delete pos[obj];
                  delete syn[obj];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='|'){
              pos[eleName]=i;
            }
          }
          if(syn[eleName]=='|!'){
            if(eleSyn=='&'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='|'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='&!'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(obj).forEach(()=>{
                if(pos[obj]<last){
                  delete pos[obj];
                  delete syn[obj];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='|!'){
              pos[eleName]=i;
            }
          }
          if(syn[eleName]=='&'){
            if(eleSyn=='&!'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(obj).forEach(()=>{
                if(pos[obj]<last){
                  delete pos[obj];
                  delete syn[obj];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='|!'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='&'){
              pos[eleName]=i;
            }
            if(eleSyn=='|'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(obj).forEach(()=>{
                if(pos[obj]<last){
                  delete pos[obj];
                  delete syn[obj];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
          }
          if(syn[eleName]=='&!'){
            if(eleSyn=='&'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(obj).forEach(()=>{
                if(pos[obj]<last){
                  delete pos[obj];
                  delete syn[obj];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='|'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn=='&!'){
              pos[eleName]=i;
            }
            if(eleSyn=='|!'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(obj).forEach(()=>{
                if(pos[obj]<last){
                  delete pos[obj];
                  delete syn[obj];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
          }
        }
      }else{
        syn[eleName]=eleSyn;
        pos[eleName]=i;
      }
    }  
    workWithNo(syn,pos)
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
