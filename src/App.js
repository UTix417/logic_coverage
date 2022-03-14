import './App.css';
import React from "react";
import { Input, Button, Typography, notification } from 'antd';
import { SettingFilled, BarChartOutlined } from '@ant-design/icons';
const { Title } = Typography;

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			text: "",
			loading: false,
			solveType: 0,// 1条件判定 2条件组合 3MC/DC
			tureStr:'',
		}
	}


	prework = () => {
		this.setState({
			loading: true,
		}, () => {
			this.check();
		});
	}

	check = () => {
		let temp = this.state.text;
		let tempLen = temp.length;
		let tempArray = [];//用来记录括号
		let kuohaoflag = false;
		let sysflag = false;
		temp = temp.replace(/\s/g, "");
		for (let i = 0; i < tempLen; i++) {
			if (temp[i] === '(') {
				tempArray.push(i);
			}
			if (temp[i] === ')') {
				if (tempArray.length === 0) {
					kuohaoflag = true;
					break;
				}
				tempArray.pop();
			}
			if (i > 0) {
				if (temp[i] === temp[i - 1] && (temp[i] === '&' || temp[i] === '|')) {
					sysflag = true;
					break;
				}
			}
		}
		if (sysflag) {
			this.setState({
				loading: false,
			}, () => {
				notification['error']({
					message: '您输入的表达式有算符错误，请检查',
					description: null,
					onClick: () => {

					},
				});
			});
			return;
		}
		if (tempArray.length > 0 || kuohaoflag) {
			this.setState({
				loading: false,
			}, () => {
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

	divi = (str) => {
		let front = 0;
		let back = 0;
		for (let i = 0; i < str.length; i++) {
			if (str[i] === '(') {
				break;
			}
			front++;
		}
		for (let i = str.length - 1; i >= 0; i--) {
			if (str[i] === ')') {
				break;
			}
			back++;
		}
		let num = Math.min(front, back);
		let tureStr = str.substring(num, str.length - num)
		for (let i = 0; i < tureStr.length; i++) {
			if (tureStr[i] === '(') {
				this.workWithHave(tureStr);
				return;
			}
		}
		this.makeElementSimpleWithNo(tureStr);
	}

	workWithNo = (syn, pos) => {
		pos = Object.keys(pos).sort((a, b) => {
			return pos[a] - pos[b];
		})
		let workStr = '';
		let map = [{
			name: '$head',
			tTo: '$T',//'$T' or index
			fTo: '$F',//'$F' or index
		}];
		let toTIndex = [];
		let toFIndex = [];
		Object.keys(pos).forEach((key) => {
			if (workStr == '') {
				workStr += key;
			} else {
				workStr += syn[key] + key;
			}
			let workType = this.state.solveType;
			if (workType == 1) {// 1条件判定
				if (workStr == '') {
					map[0].name = key;
					toTIndex.push(0);
					toFIndex.push(0);
				} else {
					if (syn[key] == '&') {
						map.push({
							name: key,
							tTo: '$T',
							fTo: '$F',
						});
						toTIndex.forEach((value) => {
							map[value].tTo = map.size() - 1;
						})
						toTIndex = map.size() - 1;
						toFIndex.push(map.size() - 1);
					} else if (syn[key] == '|!') {
						map.push({
							name: key,
							tTo: '$T',
							fTo: '$F',
						});
						toTIndex.forEach((value) => {
							map[value].tTo = map.size() - 1;
						})
						toTIndex = map.size() - 1;
						toFIndex.push(map.size() - 1);
					} else if (syn[key] == '|') {
						map.push({
							name: key,
							tTo: '$T',
							fTo: '$F',
						});
						toFIndex.forEach((value) => {
							map[value].fTo = map.size() - 1;
						});
						toFIndex = map.size() - 1;
						toTIndex.push(map.size() - 1);
					} else if (syn[key] == '&!') {
						map.push({
							name: key,
							tTo: '$T',
							fTo: '$F',
						});
						toFIndex.forEach((value) => {
							map[value].fTo = map.size() - 1;
						});
						toFIndex = map.size() - 1;
						toTIndex.push(map.size() - 1);
					}
				}
			}
		})
	}

	workWithHave = async (tureStr) => {
		tureStr = await this.toFormat(tureStr);
		this.setState({tureStr});
		//console.log(tureStr,'???');
		if(this.state.solveType==1){
			let target={};
			let elements=[];
			let element='',elememtArea='';
			let res=[];
			for(let i=0;i<tureStr;i++){
				if(tureStr[i]=='|'){
					target[elememtArea]=[];
					elements[element]=1;
					element='';
					elememtArea='';
				}else if(tureStr[i]=='&'){
					elements[element]=1;
					element='';
				}else{
					elememtArea+=tureStr[i];
					if(tureStr[i]!='!'){
						element+=tureStr[i];
					}
				}
			}
			//可能需要化简
			let tempRes=[];
			for(let i=0;i<elements.length;i++){
				tempRes.push(1);
			}
			res.push(tempRes);
			tempRes=[];
			for(let i=0;i<elements.length;i++){
				tempRes.push(0);
			}
			res.push(tempRes);
		}
	}

	toFormat = async (str) => {
		let startIndex = -1;
		let num = [];
		let nowNotFlag = 0;
		//去括号递归
		for (let i = 0; i < str.length; i++) {
			if (str[i] == '(' && num.length == 0) {
				startIndex = i + 1;
				num.push(i);
				if (i > 0) {
					if (str[i-1] == '!') {
						nowNotFlag = 1;
					}
				}
				continue;
			}
			if (nowNotFlag) {
				if (str[i] == '&') {
					str = str.substring(0, i) + '|' + str.substring(i + 1, str.length);
				} else if (str[i] == '|') {
					str = str.substring(0, i) + '&' + str.substring(i + 1, str.length);
				} else if (str[i] == '!') {
					let j = i + 1;
					while (j < str.length && (str[j] != '|' || str[j] != '&')) {
						j++;
					}
					str = str.substring(0, i) + str.substring(i + 1, str.length);
					i = j - 1;
				} else if (str[i] == '(') {
					let j = i + 1;
					let tempNum=[];
					tempNum.push(i);
					while (j < str.length && tempNum.length!=0) {
						if(str[j]=='('){
							tempNum.push(j);
						}
						if(str[j]==')'){
							tempNum.pop();
						}
						j++;
					}
					str = str.substring(0, i) + '!' + str.substring(i, str.length);
					i = j;
				} else {//元素
					let j = i + 1;
					while (j < str.length && (str[j] != '|' || str[j] != '&')) {
						j++;
					}
					str = str.substring(0, i) + '!' + str.substring(i, str.length);
					i = j - 1;
				}
			}
			if (str[i] == ')') {
				num.pop();
				if (num.length == 0) {
					let res = await this.toFormat(str.substring(startIndex, i));
					let tempStr = str;
					str = '[' + res + ']';
					if (startIndex > 0) {
						str = tempStr.substring(0, startIndex - 1 - nowNotFlag) + str;
					}
					i = str.length - 1;
					if (i < tempStr.length - 1) {
						str = str + tempStr.substring(i + 1, tempStr.length);
					}
				}
			}
		}
		let elementStar=0;
		let inFlag=false;
		//console.log(str,'递归结束');
		for(let i=0;i<str.length;i++){
			if(str[i]=='['){
				inFlag=true;
			}
			if(str[i]==']'){
				inFlag=false;
			}
			if((str[i]=='|'||str[i]=='&')&&!inFlag){
				if(str[i-1]!=']'){
					str=str.substring(0,elementStar)+'['+str.substring(elementStar,i)+']'+str.substring(i,str.length);
					i+=2;
				}
				elementStar=i+1;
			}
			if(i==str.length-1&&!inFlag){
				if(str[i]!=']'){
					str=str.substring(0,elementStar)+'['+str.substring(elementStar,str.length)+']';
				}
			}
		}
		//括号内运算
		let lastSyn = '';
		let deleteStart = -1;
		let andFlag = false;
		// let emptyFlag = false;
		//console.log(str,'括号内运算')
		for (let i = 0; i < str.length; i++) {
			if (str[i] == '|' || str[i] == '&') {
				lastSyn = str[i];
			}
			if (str[i] == '[') {
				deleteStart = i + 1;
				if (lastSyn == '|') {
					// nothing need to do
				} else if(lastSyn == ''){
					// emptyFlag = true;
				} else {
					andFlag = true;
				}
			}
			if (str[i] == ']') {
				// if(emptyFlag){
				// 	if(str[i+1]=='&'){
				// 		andFlag=true;
				// 	}		
				// }
				// if (!andFlag) {
				// 	str = str.substring(0, deleteStart - 1) + str.substring(deleteStart, i)+str.substring(i+1,str.length);
				// 	i-=2;
				// }
				if(andFlag) {
					//deleteStart-2 是乘法的结束
					let inElement = [];
					let beforeElement = [];
					let tempElement = '';
					let isBefore=false;
					for (let j = deleteStart - 2; j >=0 ; j--) {
						if(str[j]==']'||!isBefore){
							isBefore=true;
							continue;
						}
						if(str[j]=='['){
							beforeElement.push(tempElement.split('').reverse().join(''));
							break;
						}
						if (str[j] == '|') {
							beforeElement.push(tempElement.split('').reverse().join(''));
							tempElement = '';
						} else {
							tempElement += str[j];
						}
						
					}
					tempElement = '';
					for (let j = deleteStart; j < i; j++) {
						if (str[j] == '|') {
							inElement.push(tempElement);
							tempElement = '';
						} else {
							tempElement += str[j];
						}
						if(j==i-1){
							inElement.push(tempElement);
							tempElement = '';
						}
					}
					//console.log(inElement,beforeElement)
					let resStr='';
					for (let x = 0;x<beforeElement.length;x++){
						for(let y=0;y<inElement.length;y++){
							let newelement=beforeElement[x]+'&'+inElement[y];
							let elementShowRecord={};
							let element='';
							let elementStart=-1;
							for(let j=0;j<newelement.length;j++){
								if(newelement[j]=='&'||j==newelement.length-1){
									if(!elementShowRecord[element]){
										elementShowRecord[element]=1;
									}else{
										let copynewelement=newelement;
										newelement=copynewelement.substring(0,elementStart);
										if(j!=copynewelement.length-1){
											newelement+=copynewelement.substring(j+1,copynewelement.length);
										}
									}
									if(resStr.length==0){
										resStr+=newelement;
									}else if(newelement.length>0){
										resStr=resStr+'|'+newelement;
									}
									element='';
									elementStart=-1;
								}else{
									elementStart=i;
								}
							}
						}
					}
					if(i==str.length-1){
						str=resStr;
					}else{
						str=resStr+str.substring(i+1,str.length);
					}
					andFlag = false;
				}
				deleteStart = -1;
			}
		}
		str=str.replaceAll('[','');
		str=str.replaceAll(']','');
		return str;
	}

	makeElementSimpleWithNo = (tureStr) => {//这里的消除逻辑有问题，要重新推导
		let syn = {};
		let pos = {};
		for (let i = 0; i < tureStr.length;) {
			let eleName = '';
			let eleSyn = '';
			let lasts = [];//用来维护算符段终点
			let notCount = 0;
			if (tureStr[i] === '|' || tureStr === '&') {
				if (eleSyn != tureStr[i]) {
					lasts.push(i);
				}
				eleSyn = tureStr[i];
			}
			while (true) {
				if (tureStr[i] === '!') {
					notCount++;
					if (tureStr === '|' || tureStr === '&' || i === tureStr.length) {
						break;
					} else if (eleName.length) {
						this.setState({
							loading: false,
						}, () => {
							notification['error']({
								message: '您输入的表达式有算符错误，请检查',
								description: null,
								onClick: () => {

								},
							});
						});
						return;
					}
				} else {
					eleName += tureStr[i];
				}
				i++;
			}
			if (notCount & 1) {
				eleSyn += '!';
			}
			if (syn[eleName]) {
				if (syn[eleName] === eleSyn) {

				} else {
					if (syn[eleName] === '|' || syn[eleName] === '') {
						if (eleSyn === '&!') {
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '|!') {
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '&') {
							let last = 0;
							for (let j = 0; j < lasts.length; j++) {
								if (lasts[j] > pos[eleName]) {
									last = lasts[j];
								}
							}
							Object.keys(pos).forEach((key) => {
								if (pos[key] < last) {
									delete pos[key];
									delete syn[key];
								}
							})
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '|') {
							pos[eleName] = i;
						}
					}
					if (syn[eleName] === '|!' || syn[eleName] === '!') {
						if (eleSyn === '&') {
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '|') {
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '&!') {
							let last = 0;
							for (let j = 0; j < lasts.length; j++) {
								if (lasts[j] > pos[eleName]) {
									last = lasts[j];
								}
							}
							Object.keys(pos).forEach((key) => {
								if (pos[key] < last) {
									delete pos[key];
									delete syn[key];
								}
							})
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '|!') {
							pos[eleName] = i;
						}
					}
					if (syn[eleName] === '&') {
						if (eleSyn === '&!') {
							let last = 0;
							for (let j = 0; j < lasts.length; j++) {
								if (lasts[j] > pos[eleName]) {
									last = lasts[j];
								}
							}
							Object.keys(pos).forEach((key) => {
								if (pos[key] < last) {
									delete pos[key];
									delete syn[key];
								}
							})
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '|!') {
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '&') {
							pos[eleName] = i;
						}
						if (eleSyn === '|') {
							let last = 0;
							for (let j = 0; j < lasts.length; j++) {
								if (lasts[j] > pos[eleName]) {
									last = lasts[j];
								}
							}
							Object.keys(pos).forEach((key) => {
								if (pos[key] < last) {
									delete pos[key];
									delete syn[key];
								}
							})
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
					}
					if (syn[eleName] === '&!') {
						if (eleSyn === '&') {
							let last = 0;
							for (let j = 0; j < lasts.length; j++) {
								if (lasts[j] > pos[eleName]) {
									last = lasts[j];
								}
							}
							Object.keys(pos).forEach((key) => {
								if (pos[key] < last) {
									delete pos[key];
									delete syn[key];
								}
							})
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '|') {
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
						if (eleSyn === '&!') {
							pos[eleName] = i;
						}
						if (eleSyn === '|!') {
							let last = 0;
							for (let j = 0; j < lasts.length; j++) {
								if (lasts[j] > pos[eleName]) {
									last = lasts[j];
								}
							}
							Object.keys(pos).forEach((key) => {
								if (pos[key] < last) {
									delete pos[key];
									delete syn[key];
								}
							})
							syn[eleName] = eleSyn;
							pos[eleName] = i;
						}
					}
				}
			} else {
				syn[eleName] = eleSyn;
				pos[eleName] = i;
			}
		}
		this.workWithNo(syn, pos)
	}

	input = e => {
		this.setState({
			text: e.target.value,
		});
	}

	render() {
		return (
			<div>
				<div className="App">
					<Title className="title">
						<BarChartOutlined />
						<span style={{ fontSize: '30px', marginLeft: '10px' }}>布尔表达式的逻辑覆盖</span>
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
