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
      solveType: 0,// 1条件判定 2条件组合 3MC/DC
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
        if(temp[i]===temp[i-1]&&(temp[i]==='&'||temp[i]==='|')){
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
      if(str[i]==='('){
        break;
      }
      front++;
    }
    for(let i=str.length-1;i>=0;i--){
      if(str[i]===')'){
        break;
      }
      back++;
    }
    let num=Math.min(front,back);
    let tureStr=str.substring(num,str.length-num)
    for(let i=0;i<tureStr.length;i++){
      if(tureStr[i]==='('){
        return;
        this.makeElementSimpleWithNo(tureStr);
      }
    }
    this.workWithHave(tureStr);
  }

  workWithNo = (syn,pos) => {
    pos=Object.keys(pos).sort((a,b)=>{
      return pos[a]-pos[b];
    })
    let workStr='';
    
    Object.keys(pos).forEach((key)=>{
      if(workStr==''){
        workStr+=key;
      }else{
        workStr+=syn[key]+key;
      }
      let workType=this.state.solveType;
      if(workType==1){
        if(workStr==''){
          
        }else{
          if(syn[key]=='&'){

          }else if(syn[key]=='|'){

          }else if(syn[key]=='!&'){

          }else if(syn[key]=='!&'){

          }else
        }
      }
    })
  }

  workWithHave = (tureStr) => {
    
  }

  toFormat = async (str) => {
    let startIndex=-1;
    let num=[];
    let nowNotFlag=0;
    //去括号递归
    for(let i=0;i<str.length;i++){
        if(str[i]=='('&&num.length==0){
            startIndex=i+1;
            num.push(i);
            if(i>0){
                if(str[i]=='!'){
                    nowNotFlag=1;
                }
            }
        }
        if(nowNotFlag){
            if(str[i]=='&'){
                str=str.subString(0,i-1)+'|'+str.subString(i+1,str.length);
            }else if(str[i]=='|'){
                str=str.subString(0,i-1)+'&'+str.subString(i+1,str.length);
            }else if(str[i]=='!'){
                let j=i+1;
                while(j<str.length&&(str[j]!='|'||str[j]!='&')){
                    j++;
                }
                str=str.subString(0,i-1)+str.subString(i+1,str.length);
                i=j-1;
            }else if(str[i]=='('){
                let j=i+1;
                while(j<str.length&&str[j]!=')'){
                    j++;
                }
                str=str.subString(0,i-1)+'!'+str.subString(i,str.length);
                i=j;
            }else{
                let j=i+1;
                while(j<str.length&&(str[j]!='|'||str[j]!='&')){
                    j++;
                }
                str=str.subString(0,i-1)+'!'+str.subString(i,str.length);
                i=j-1;
            }
        }
        if(str[i]==')'){
            num.pop();
            if(num.length==0){
                let res=await this.toFormat(str.subString(startIndex,i));
                let tempStr=str;
                str='['+res+']';
                if(startIndex>0){
                    str=tempStr.subString(0,startIndex-1-nowNotFlag)+str;
                }
                i=str.length-1;
                if(i<tempStr.length-1){
                    str=str+tempStr.subString(i+1,tempStr.length);
                }
            }
        }
    }
    //括号内运算
    let lastSyn='';
    let deleteStart=-1;
    let andFlag=false;
    for(let i=0;i<str.length;i++){
        if(str[i]=='|'||str[i]=='&'){
            lastSyn=str[i];
        }
        if(str[i]=='['){
            deleteStart=i+1;
            if(lastSyn=='|'||lastSyn==''){
                
            }else{
                andFlag=true;
            }
        }
        if(str[i]==']'){
            deleteStart=-1;
            if(!andFlag){
                str=str.subString(0,deleteStart-2)+str.subString(deleteStart,i-1);
            }else{

                andFlag=false;
            }
        }
    }
  }

  makeElementSimpleWithNo = (tureStr) => {
    let syn={};  
    let pos={};
    for(let i=0;i<tureStr.length;){
      let eleName='';
      let eleSyn='';
      let lasts=[];//用来维护算符段终点
      let notCount=0;
      if(tureStr[i]==='|'||tureStr==='&'){
        if(eleSyn!=tureStr[i]){
          lasts.push(i);
        }
        eleSyn=tureStr[i];
      }
      while(true){
        if(tureStr[i]==='!'){
          notCount++;
          if(tureStr==='|'||tureStr==='&'||i===tureStr.length){
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
        if(syn[eleName]===eleSyn){

        }else{
          if(syn[eleName]==='|' || syn[eleName]===''){
            if(eleSyn==='&!'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='|!'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='&'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(pos).forEach((key)=>{
                if(pos[key]<last){
                  delete pos[key];
                  delete syn[key];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='|'){
              pos[eleName]=i;
            }
          }
          if(syn[eleName]==='|!' || syn[eleName]==='!'){
            if(eleSyn==='&'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='|'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='&!'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(pos).forEach((key)=>{
                if(pos[key]<last){
                  delete pos[key];
                  delete syn[key];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='|!'){
              pos[eleName]=i;
            }
          }
          if(syn[eleName]==='&'){
            if(eleSyn==='&!'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(pos).forEach((key)=>{
                if(pos[key]<last){
                  delete pos[key];
                  delete syn[key];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='|!'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='&'){
              pos[eleName]=i;
            }
            if(eleSyn==='|'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(pos).forEach((key)=>{
                if(pos[key]<last){
                  delete pos[key];
                  delete syn[key];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
          }
          if(syn[eleName]==='&!'){
            if(eleSyn==='&'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(pos).forEach((key)=>{
                if(pos[key]<last){
                  delete pos[key];
                  delete syn[key];
                }
              })
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='|'){
              syn[eleName]=eleSyn;
              pos[eleName]=i;
            }
            if(eleSyn==='&!'){
              pos[eleName]=i;
            }
            if(eleSyn==='|!'){
              let last=0;
              for(let j=0;j<lasts.length;j++){
                if(lasts[j]>pos[eleName]){
                  last=lasts[j];
                }
              }
              Object.keys(pos).forEach((key)=>{
                if(pos[key]<last){
                  delete pos[key];
                  delete syn[key];
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
    this.workWithNo(syn,pos)
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
