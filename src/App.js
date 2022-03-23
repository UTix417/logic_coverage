import './App.css';
import React from "react";
import { Input, Button, Typography, notification, Table, Empty, Card, Spin } from 'antd';
import { LoadingOutlined , BarChartOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { TextArea } = Input;

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

	map = [];
	resList = [];
	nowPathData = [];

	/**
	 * 调用方：页面按钮
	 * 作用：设置页面中的loading状态
	 */
	prework = (solveType) => {
		this.map=[];
		this.resList=[];
		this.setState({
			loading: true,
			solveType,
		}, () => {
			this.check();
		});
	}

	/**
	 * 调用方：prework
	 * 作用：检查输入表达式正确与否，包含有无非法字符、有无合法字符的非法组合（如&&）以及括号是否匹配
	 */
	check = () => {
		let temp = this.state.text;
		let tempLen = temp.length;
		let tempArray = [];//用来记录括号
		let kuohaoflag = false;
		let sysflag = false;
		temp = temp.replace(/\s/g, "");
		let testWord=new RegExp(/[a-zA-Z&|!()]/);
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
			if(!testWord.test(temp[i])){
				sysflag = true;
				break;
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


	/**
	 * 调用方：check
	 * 作用：区分该表达式有无括号
	 * @param {string} str 去括号后的表达式
	 */
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
		this.workWithNo(tureStr);
	}

	/**
	 * 调用方：divi
	 * 作用：进行测试用例生成分流 
	 * @param {*} tureStr 经过！简化的字符串
	 */
	workWithNo = (tureStr) => {
		if(this.state.solveType==1){
			this.prework1(tureStr);
		}else if(this.state.solveType==2){

		}else if(this.state.solveType==3){
			
		}
	}

	/**
	 * 调用方：prework1
	 * 作用：组织一张图
	 * @param {{elesyn: string,elename: string}[]} mapdata 字符串获取的顺序节点
	 */
	work1 = (mapdata) => {
		{
		// pos = Object.keys(pos).sort((a, b) => {
		// 	return pos[a] - pos[b];
		// })
		// let workStr = '';
		// let this.map = [{
		// 	name: '$head',
		// 	tTo: '$T',//'$T' or index
		// 	fTo: '$F',//'$F' or index
		// }];
		// let toTIndex = [];
		// let toFIndex = [];
		// Object.keys(pos).forEach((key) => {
		// 	if (workStr == '') {
		// 		workStr += key;
		// 	} else {
		// 		workStr += syn[key] + key;
		// 	}
		// 	let workType = this.state.solveType;
		// 	if (workType == 1) {// 1条件判定
		// 		if (workStr == '') {
		// 			this.map[0].name = key;
		// 			toTIndex.push(0);
		// 			toFIndex.push(0);
		// 		} else {
		// 			if (syn[key] == '&') {
		// 				this.map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toTIndex.forEach((value) => {
		// 					this.map[value].tTo = this.map.length - 1;
		// 				})
		// 				toTIndex = this.map.length - 1;
		// 				toFIndex.push(this.map.length - 1);
		// 			} else if (syn[key] == '|!') {
		// 				this.map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toTIndex.forEach((value) => {
		// 					this.map[value].tTo = this.map.length - 1;
		// 				})
		// 				toTIndex = this.map.length - 1;
		// 				toFIndex.push(this.map.length - 1);
		// 			} else if (syn[key] == '|') {
		// 				this.map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toFIndex.forEach((value) => {
		// 					this.map[value].fTo = this.map.length - 1;
		// 				});
		// 				toFIndex = this.map.length - 1;
		// 				toTIndex.push(this.map.length - 1);
		// 			} else if (syn[key] == '&!') {
		// 				this.map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toFIndex.forEach((value) => {
		// 					this.map[value].fTo = this.map.length - 1;
		// 				});
		// 				toFIndex = this.map.length - 1;
		// 				toTIndex.push(this.map.length - 1);
		// 			}
		// 		}
		// 	}
		// })
		}
		/**
		 * 	this.map[i]={
				name: '$head',
				tTo: '$T',//'$T' or index
				fTo: '$F',//'$F' or index
				elesyn: '',
			}
		 */
		let toTIndex = -1;
		let toFIndex = [];
		for(let i=0;i<mapdata.length;i++){
			if (mapdata[i].elesyn == '&') {
				this.map.push({
					name: mapdata[i].elename,
					tTo: '$T',
					fTo: '$F',
				});
				// toTIndex.forEach((value) => {
				// 	this.map[value].tTo = this.map.length - 1;
				// })
				if(toTIndex!=-1){
					this.map[toTIndex].tTo=this.map.length - 1;
				}
				this.map[i].elesyn=mapdata[i].elesyn;
				toTIndex = this.map.length - 1;
				toFIndex.push(this.map.length - 1);
			} else if (mapdata[i].elesyn == '|!') {
				this.map.push({
					name: mapdata[i].elename,
					tTo: '$F',
					fTo: '$T',
				});
				toTIndex.forEach((value) => {
					this.map[value].tTo = this.map.length - 1;
				})
				this.map[i].elesyn=mapdata[i].elesyn;
				toTIndex = [this.map.length - 1];
				toFIndex.push(this.map.length - 1);
			} else if (mapdata[i].elesyn == '|') {
				this.map.push({
					name: mapdata[i].elename,
					tTo: '$T',
					fTo: '$F',
				});
				toFIndex.forEach((value) => {
					this.map[value].fTo = this.map.length - 1;
				});
				this.map[i].elesyn=mapdata[i].elesyn;
				toFIndex = [this.map.length - 1];
				// toTIndex.push(this.map.length - 1);
				toTIndex=this.map.length - 1;
			} else if (mapdata[i].elesyn == '&!') {
				this.map.push({
					name: mapdata[i].elename,
					tTo: '$F',
					fTo: '$T',
				});
				// toFIndex.forEach((value) => {
				// 	this.map[value].fTo = this.map.length - 1;
				// });
				if(toTIndex!=-1){
					this.map[toTIndex].fTo=this.map.length - 1;
				}
				this.map[i].elesyn=mapdata[i].elesyn;
				toTIndex = this.map.length - 1;
				toFIndex = [this.map.length - 1];
				// toTIndex.push(this.map.length - 1);
				toTIndex=this.map.length - 1;
			}
		}

		this.getPathFromMap(0,{}).then(()=>{
			this.setState({
				loading: false,
			})
		});
	}

	/**
	 * 调用方：work1、getPathFromMap(递归)
	 * 作用：dfs求测试用例
	 * @param {Number} nowindex 当前节点
	 * @param {{变量名:boolean, $res:boolean}} nowPath  现在的变量情况
	 */
	getPathFromMap = async (nowindex, nowPath)=> {
		let tempPath = {};
		if(this.map.length==0){
			return;
		}
		// console.log(nowindex,nowPath)
		// if(nowPath[this.map[nowindex].name]=='T'){
		// 	this.getPathFromMap(this.map,this.map[nowindex].tTo,JSON.parse(JSON.stringify(nowPath)));
		// 	return;
		// }
		// if(nowPath[this.map[nowindex].name]=='F'){
		// 	this.getPathFromMap(this.map,this.map[nowindex].tFo,JSON.parse(JSON.stringify(nowPath)));
		// 	return;
		// }
		if(nowPath[this.map[nowindex].name]!='F'){
			if(this.map[nowindex].tTo=='$T'){
				tempPath=JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name]='T';
				tempPath['$res']='T';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
				// let tempList=[...this.state.resList];
				// console.log(this.resList,"??",tempPath)
				// tempList.push(JSON.parse(JSON.stringify(tempPath)));
				// console.log(tempList,"!!",tempPath)
				// this.setState({
				// 	resList: tempList
				// });
			}else if(this.map[nowindex].tTo=='$F'){
				tempPath=JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name]='T';
				tempPath['$res']='F';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			}else{
				tempPath=JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name]='T';
				this.getPathFromMap(this.map[nowindex].tTo,tempPath);
			}	
		}
		if(nowPath[this.map[nowindex].name]!='T'){
			if(this.map[nowindex].fTo=='$F'){
				tempPath=JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name]='F';
				tempPath['$res']='F';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
				// let tempList=[...this.state.resList];
				// console.log(this.resList,"??",tempPath)
				// tempList.push(JSON.parse(JSON.stringify(tempPath)));
				// console.log(tempList,"!!",tempPath)
				// this.setState({
				// 	resList: tempList
				// });
			}else if(this.map[nowindex].fTo=='$T'){
				tempPath=JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name]='F';
				tempPath['$res']='T';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			}else{
				tempPath=JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name]='F';
				this.getPathFromMap(this.map[nowindex].fTo,tempPath);
			}
		}
	}

	/**
	 * 调用方：divi
	 * 作用：递归去除括号后进行测试用例生成分流 
	 * @param {string} tureStr 经过！简化的字符串
	 */
	workWithHave = async (tureStr) => {
		tureStr = await this.toFormat(tureStr);
		this.setState({tureStr},()=>{
			// console.log(this.state)
			//console.log(tureStr,'???');
			if(this.state.solveType==1){
				this.prework1(tureStr);
				{
					// let target={};// &的部分
					// let elements=[];// 变量
					// let element='',elememtArea='';
					// let res=[];// 测试用例
					// for(let i=0;i<tureStr;i++){
					// 	if(tureStr[i]=='|'){
					// 		target[elememtArea]=[];
					// 		elements[element]=1;
					// 		element='';
					// 		elememtArea='';
					// 	}else if(tureStr[i]=='&'){
					// 		elements[element]=1;
					// 		element='';
					// 	}else{
					// 		elememtArea+=tureStr[i];
					// 		if(tureStr[i]!='!'){
					// 			element+=tureStr[i];
					// 		}
					// 	}
					// }
					// //可能需要化简
					// let tempRes=[];
					// for(let i=0;i<elements.length;i++){
					// 	tempRes.push(1);
					// }
					// res.push(tempRes);
					// tempRes=[];
					// for(let i=0;i<elements.length;i++){
					// 	tempRes.push(0);
					// }
					// res.push(tempRes);
					// Object.keys(target).forEach((key)=>{//$$$ 如果想增加一些测试用例
					// 	let isNotFlag=false;
					// 	let innerElement='';
					// 	for(let i=0;i<key.length;i++){
					// 		if(key[i]=='!'){
					// 			isNotFlag=true;
					// 		}else if(key[i]=='&'){

					// 			isNotFlag=false;
					// 			innerElement='';
					// 		}else{
					// 			innerElement+=key[i];
					// 		}
					// 		if(i==key.length-1){

					// 		}
					// 	}
					// })
				}
			}else if(this.state.solveType==2){

			}else if(this.state.solveType==3){

			}	
		});
	}

	/**
	 * 调用方：workWithHave、toFormat(递归)
	 * 作用：递归去除括号
	 * @param {string} str 当前处理的字符串字串 
	 */
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
		// console.log(str,'递归结束');
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
		// console.log(str,'括号内运算')
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
				// console.log(str,"去括号运算中")
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
					// console.log(inElement,beforeElement)
					let resStr='';
					for (let x = 0;x<beforeElement.length;x++){
						for(let y=0;y<inElement.length;y++){
							let newelement=beforeElement[x]+'&'+inElement[y];
							// console.log(beforeElement[x],inElement[y],"???")
							let elementShowRecord={};
							let element='';
							let elementStart=-1;
							for(let j=0;j<newelement.length;j++){
								if(newelement[j]=='&'||j==newelement.length-1){
									if(j==newelement.length-1){
										element+=newelement[j];
									}else{
										elementStart=j;
									}
									// console.log(newelement[j],'>>>>',element,'>>>>>',elementShowRecord[element])
									if(!elementShowRecord[element]){
										elementShowRecord[element]=1;
									}else{
										let copynewelement=newelement;
										// console.log(copynewelement,'------',elementStart,copynewelement.substring(0,elementStart))
										newelement=copynewelement.substring(0,elementStart);
										if(j!=copynewelement.length-1){
											newelement+=copynewelement.substring(j+1,copynewelement.length);
										}
									}
									element='';
								}else{
									element+=newelement[j];
								}
							}
							if(resStr.length==0){
								resStr+=newelement;
							}else if(newelement.length>0){
								resStr=resStr+'|'+newelement;
							}
							// console.log(resStr,'!!!',newelement)
						}
					}
					if(i==str.length-1){
						str='['+resStr+']';
						i+=2;
					}else{
						str='['+resStr+']'+str.substring(i+1,str.length);
						i+=2;
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

	/**
	 * 调用方：workWithNo、workWithHave
	 * 作用：生成mapdata
	 * @param {string} tureStr 经过！简化的字符串
	 */
	prework1 = (tureStr) => {//这里的消除逻辑有问题，要重新推导
		{
		// let syn = {};
		// let pos = {};
		// for (let i = 0; i < tureStr.length;) {
		// 	let eleName = '';
		// 	let eleSyn = '';
		// 	let lasts = [];//用来维护算符段终点
		// 	let notCount = 0;
		// 	if (tureStr[i] === '|' || tureStr === '&') {
		// 		if (eleSyn != tureStr[i]) {
		// 			lasts.push(i);
		// 		}
		// 		eleSyn = tureStr[i];
		// 	}
		// 	while (true) {
		// 		if (tureStr[i] === '!') {
		// 			notCount++;
		// 			if (tureStr[i] === '|' || tureStr[i] === '&' || i === tureStr.length) {
		// 				break;
		// 			} else if (eleName.length) {
		// 				this.setState({
		// 					loading: false,
		// 				}, () => {
		// 					notification['error']({
		// 						message: '您输入的表达式有算符错误，请检查',
		// 						description: null,
		// 						onClick: () => {

		// 						},
		// 					});
		// 				});
		// 				return;
		// 			}
		// 		} else {
		// 			eleName += tureStr[i];
		// 		}
		// 		i++;
		// 	}
		// 	if (notCount & 1) {
		// 		eleSyn += '!';
		// 	}
		// 	{// if (syn[eleName]) {
		// 	// 	if (syn[eleName] === eleSyn) {

		// 	// 	} else {
		// 	// 		if (syn[eleName] === '|' || syn[eleName] === '') {
		// 	// 			if (eleSyn === '&!') {
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|!') {
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '&') {
		// 	// 				let last = 0;
		// 	// 				for (let j = 0; j < lasts.length; j++) {
		// 	// 					if (lasts[j] > pos[eleName]) {
		// 	// 						last = lasts[j];
		// 	// 					}
		// 	// 				}
		// 	// 				Object.keys(pos).forEach((key) => {
		// 	// 					if (pos[key] < last) {
		// 	// 						delete pos[key];
		// 	// 						delete syn[key];
		// 	// 					}
		// 	// 				})
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|') {
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 		}
		// 	// 		if (syn[eleName] === '|!' || syn[eleName] === '!') {
		// 	// 			if (eleSyn === '&') {
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|') {
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '&!') {
		// 	// 				let last = 0;
		// 	// 				for (let j = 0; j < lasts.length; j++) {
		// 	// 					if (lasts[j] > pos[eleName]) {
		// 	// 						last = lasts[j];
		// 	// 					}
		// 	// 				}
		// 	// 				Object.keys(pos).forEach((key) => {
		// 	// 					if (pos[key] < last) {
		// 	// 						delete pos[key];
		// 	// 						delete syn[key];
		// 	// 					}
		// 	// 				})
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|!') {
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 		}
		// 	// 		if (syn[eleName] === '&') {
		// 	// 			if (eleSyn === '&!') {
		// 	// 				let last = 0;
		// 	// 				for (let j = 0; j < lasts.length; j++) {
		// 	// 					if (lasts[j] > pos[eleName]) {
		// 	// 						last = lasts[j];
		// 	// 					}
		// 	// 				}
		// 	// 				Object.keys(pos).forEach((key) => {
		// 	// 					if (pos[key] < last) {
		// 	// 						delete pos[key];
		// 	// 						delete syn[key];
		// 	// 					}
		// 	// 				})
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|!') {
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '&') {
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|') {
		// 	// 				let last = 0;
		// 	// 				for (let j = 0; j < lasts.length; j++) {
		// 	// 					if (lasts[j] > pos[eleName]) {
		// 	// 						last = lasts[j];
		// 	// 					}
		// 	// 				}
		// 	// 				Object.keys(pos).forEach((key) => {
		// 	// 					if (pos[key] < last) {
		// 	// 						delete pos[key];
		// 	// 						delete syn[key];
		// 	// 					}
		// 	// 				})
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 		}
		// 	// 		if (syn[eleName] === '&!') {
		// 	// 			if (eleSyn === '&') {
		// 	// 				let last = 0;
		// 	// 				for (let j = 0; j < lasts.length; j++) {
		// 	// 					if (lasts[j] > pos[eleName]) {
		// 	// 						last = lasts[j];
		// 	// 					}
		// 	// 				}
		// 	// 				Object.keys(pos).forEach((key) => {
		// 	// 					if (pos[key] < last) {
		// 	// 						delete pos[key];
		// 	// 						delete syn[key];
		// 	// 					}
		// 	// 				})
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|') {
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '&!') {
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 			if (eleSyn === '|!') {
		// 	// 				let last = 0;
		// 	// 				for (let j = 0; j < lasts.length; j++) {
		// 	// 					if (lasts[j] > pos[eleName]) {
		// 	// 						last = lasts[j];
		// 	// 					}
		// 	// 				}
		// 	// 				Object.keys(pos).forEach((key) => {
		// 	// 					if (pos[key] < last) {
		// 	// 						delete pos[key];
		// 	// 						delete syn[key];
		// 	// 					}
		// 	// 				})
		// 	// 				syn[eleName] = eleSyn;
		// 	// 				pos[eleName] = i;
		// 	// 			}
		// 	// 		}
		// 	// 	}
		// 	// } else {
		// 	// 	syn[eleName] = eleSyn;
		// 	// 	pos[eleName] = i;
		// 	// }
		// 	}
		// }
		}
		this.setState({tureStr},()=>{
			let mapdata=[];
			let elename='',elesyn='&';
			for(let i=0;i<tureStr.length;i++){
				if(tureStr[i]=='|'||tureStr[i]=='&'||tureStr[i]=='!'){//$$$ 非还要处理
					elesyn+=tureStr[i];
					if(mapdata.length==0){
						continue;
					}
					mapdata[mapdata.length-1]['elename']=elename;
					elename='';
				}else{
					elename+=tureStr[i];
					mapdata.push({elesyn});
					elesyn='';
				}
				if(i==tureStr.length-1){
					mapdata[mapdata.length-1]['elename']=elename;
				}
			}
			this.work1(mapdata)	
		})
	}

	/**
	 * 调用方：ant组件调用
	 * 作用：绑定输入字符串
	 * @param {ReactDOM} e 输入事件
	 */
	input = e => {
		this.setState({
			text: e.target.value,
		});
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的化简情况
	 */
	readTureStr(){
		// console.log(this.state.tureStr)
		return this.state.tureStr;
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的测试用例情况
	 */
	readResList(){
		if(this.resList.length){
			let children=[];
			let maxIndex=0;
			let maxLength=0;
			for(let i=0;i<this.resList.length;i++){
				let tempPath=this.resList[i];
				if(maxLength<Object.keys(tempPath).length){
					maxLength=Object.keys(tempPath).length;
					maxIndex=i;
				}
			}
			Object.keys(this.resList[maxIndex]).forEach((key)=>{
				if(key!='$res'){
					children.push({
						title:`${key}`,
						dataIndex:`${key}`,
						key: `${key}`,
						width: 20,
					})
				}
			})
			const columns = [
				{
					title:'表达式结果',
					dataIndex: '$res',
    				key: '$res',
					width: 10,
					fixed: 'left',
				},
				{
					title: '变量名',
					children,
				},
			];
			let data=[];
			for(let i=0;i<this.resList.length;i++){
				data.push({
					key:i,
					...this.resList[i]
				})
			}
			return (
			<Table 
				onRow={record => {
					return {
					  onMouseEnter: () => {
						this.nowPathData=record;
						this.setState({loading:false});
						// console.log(record)
					  }, // 鼠标移入行
					  onMouseLeave: () => {
						this.nowPathData={};
						this.setState({loading:false});
					  },
					};
				  }}
				columns={columns} 
				dataSource={data} 
				scroll={{ x: 1300, y: 300 }} 
				pagination={false}
				bordered={true}
			/>);
		}
		return this.resList;
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的算法完成与否 
	 */
	readLoadingStatus(){
		return this.state.loading;
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的分析数据 
	 */
	readAnalyData(){
		let tureStr=this.state.tureStr;
		if(!tureStr.length>0){
			return false;
		}
		let analyTureStr='';
		let elename='',elenameArea='';
		// console.log("-----------------------")
		for(let i=0;i<tureStr.length;i++){
			if(tureStr[i]=='|'||tureStr[i]=='&'||tureStr[i]=='!'){
				if(tureStr[i]=='|'||tureStr[i]=='&'){
					let resData=this.nowPathData[elename];
					if(resData){
						if((resData=='T'&&elenameArea[0]!='!')||(resData=='F'&&elenameArea[0]=='!')){
							analyTureStr+=`<span style="color:lime">${elenameArea}</span>`;
						}else{
							analyTureStr+=`<span style="color:red">${elenameArea}</span>`;
						}
					}else if(Object.keys(this.nowPathData).length!=0){
						analyTureStr+=`<span style="color:blue">${elenameArea}</span>`;
					}else{
						analyTureStr+=`<span style="color:black">${elenameArea}</span>`;
					}
					analyTureStr+=tureStr[i];
					elenameArea='';
				}else{
					elenameArea+=tureStr[i];
				}
				elename='';
			}else{
				elename+=tureStr[i];
				elenameArea+=tureStr[i];
			}
			if(i==tureStr.length-1){
				let resData=this.nowPathData[elename];
				if(resData){
					if((resData=='T'&&elenameArea[0]!='!')||(resData=='F'&&elenameArea[0]=='!')){
						analyTureStr+=`<span style="color:lime">${elenameArea}</span>`;
					}else{
						analyTureStr+=`<span style="color:red">${elenameArea}</span>`;
					}
				}else if(Object.keys(this.nowPathData).length!=0){
					analyTureStr+=`<span style="color:blue">${elenameArea}</span>`;
				}else{
					analyTureStr+=`<span style="color:black">${elenameArea}</span>`;
				}
			}
		}
		let analyData=(
			<div>
				<Text mark>绿色为T，红色为F，蓝色为非关键</Text>
				<div>
					<Text code>
						<span style={{fontSize:'16px'}} dangerouslySetInnerHTML={{__html:analyTureStr}}></span>
					</Text>	
				</div>
			</div>
			);
		return analyData;
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的分析数据的图 
	 */
	readAnalyMap(){
		if(this.map.length==0){
			return null;
		}
		let mapdrawdata = JSON.parse(JSON.stringify(this.map));
		let nowX=10,nowY=10;
		let analyMapHtml='';
		for(let i=0;i<mapdrawdata.length;i++){
			if(mapdrawdata[i].elesyn[0]=='|'){
				nowY+=60;
				nowX=10;
				mapdrawdata[i].X=nowX;
				mapdrawdata[i].Y=nowY;
				nowX+=60;
			}else if(mapdrawdata[i].elesyn[0]=='&'){
				mapdrawdata[i].X=nowX;
				mapdrawdata[i].Y=nowY;
				nowX+=60;
			}
		}
		for(let i=0;i<mapdrawdata.length;i++){
			let{
				X,
				Y,
				tTo,
				fTo,
				name,
			}=mapdrawdata[i];
			if(this.nowPathData[name]){
				if(this.nowPathData[name]=='T'){
					analyMapHtml+=
					`<div style="position: absolute;
						left: ${X}px;
						top:${Y}px;
						border: 1px solid lime;
						border-radius: 50%;
						height: 25px;
						width: 25px;
						color: lime;
						text-align: center;">${name}</div>`;
				}else if(this.nowPathData[name]=='F'){
					analyMapHtml+=
					`<div style="position: absolute;
						left: ${X}px;
						top:${Y}px;
						border: 1px solid red;
						border-radius: 50%;
						height: 25px;
						width: 25px;
						color:red;
						text-align: center;">${name}</div>`;
				}else{
					analyMapHtml+=
					`<div style="position: absolute;
						left: ${X}px;
						top:${Y}px;
						border: 1px solid blue;
						border-radius: 50%;
						height: 25px;
						width: 25px;
						color:blue;
						text-align: center;">${name}</div>`;
				}
			}else{
				analyMapHtml+=
					`<div style="position: absolute;
						left: ${X}px;
						top:${Y}px;
						border: 1px solid;
						border-radius: 50%;
						height: 25px;
						width: 25px;
						text-align: center;">${name}</div>`;	
			}
			if(mapdrawdata[tTo]){
				let xx=X-mapdrawdata[tTo].X;
				let yy=Y-mapdrawdata[tTo].Y;
				let angle=Math.atan(yy/xx)*360/2/Math.PI;
				if(xx==0){
					angle=90;
				}
				let backx=0;
				let backy=0;
				if(xx>0){
					backx=-6;
				}else if(xx<0){
					backx=6;
				}
				if(yy>0){
					backy=-6;
				}else if(yy<0){
					backy=6;
				}
				let startX=Math.min(X,mapdrawdata[tTo].X);
				let startY=Math.min(Y,mapdrawdata[tTo].Y);
				console.log(startX,startY)
				analyMapHtml+=
					`<div style="position: absolute;
						left: ${startX+12.5*Math.abs(Math.cos(angle))+12.5}px;
						top:${startY+12.5*Math.abs(Math.sin(angle))+12.5}px;
						width:${((Math.abs(xx)-12.5)<0?0:(Math.abs(xx)-12.5))+1}px;
						height:${((Math.abs(yy)-12.5)<0?0:(Math.abs(yy)-12.5))+1}px;
						display:flex;
						align-items: center;
						background: linear-gradient(${angle}deg, transparent 49.5%,black, black, transparent 50.5%);
						justify-content: center;">
						<div style="background: white;">T</div>
					</div>
					<div style="position: absolute;
						left: ${X-xx-backx}px;
						top:${Y-yy-backy}px;
						width:10px;
						height:10px;
						background: linear-gradient(${angle+45}deg, transparent 49.5%,black, black, transparent 50.5%);
					></div>
					<div style="position: absolute;
						left: ${X-xx-backx}px;
						top:${Y-yy-backy}px;
						width:10px;
						height:10px;
						background: linear-gradient(${angle-45}deg, transparent 49.5%,black, black, transparent 50.5%);
					></div>`;
			}else{

			}
			if(mapdrawdata[fTo]){

			}else{

			}
		}
		return (
			<div dangerouslySetInnerHTML={{__html:analyMapHtml}}></div>
		);
	}

	render() {
		return (
			<>
				<Title className="title">
					<BarChartOutlined />
					<span style={{ fontSize: '30px', marginLeft: '10px' }}>布尔表达式的逻辑覆盖</span>
				</Title>
				<div style={{paddingLeft: '10%',paddingRight: '10%'}}>
					<div className="work-box">
						<div className="input-box">
							<Card title="数据操作" 
								headStyle={{
									background:'#66ccff',
									borderLeft:'1px solid #000',
									borderRight:'1px solid #000',
									borderTop:'1px solid #000',
								}} 
								bodyStyle={{ 
									borderLeft:'1px solid #000',
									borderRight:'1px solid #000',
									borderBottom:'1px solid #000',
								}}
							>
								<Text code>变量名仅支持英文字母</Text>
								<Text code>算符仅支持 & | ! ( )</Text>
								<TextArea className="input"
									value={this.state.text}
									onChange={this.input.bind(this)}
									placeholder="Basic usage"
									rows={4}
								/>
								<div className="button-box">
									<Button className="button"
										type="primary"
										disabled={this.state.loading&&this.state.solveType!=1}
										onClick={this.prework.bind(this,1)}
										loading={this.state.loading&&this.state.solveType==1}
									>条件/判定</Button>
									<Button className="button"
										type="primary"
										disabled={this.state.loading&&this.state.solveType!=2}
										onClick={this.prework.bind(this,2)}
										loading={this.state.loading&&this.state.solveType==2}
									>条件组合</Button>
									<Button className="button"
										type="primary"
										disabled={this.state.loading&&this.state.solveType!=3}
										onClick={this.prework.bind(this,3)}
										loading={this.state.loading&&this.state.solveType==3}
									>MC/DC</Button>	
								</div>
							</Card>
						</div>
						<div className="showInfo-box">
							<Card title="可视化数据" 
								headStyle={{
									background:'#66ccff',
									borderLeft:'1px solid #000',
									borderRight:'1px solid #000',
									borderTop:'1px solid #000',
								}} 
								bodyStyle={{ 
									borderLeft:'1px solid #000',
									borderRight:'1px solid #000',
									borderBottom:'1px solid #000',
								}}
							>
								{(
									(!this.readAnalyData() && !this.readLoadingStatus()) &&
										(<div className='border'>
											<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
										</div>)
								)}
								{(
									this.readLoadingStatus() &&
									(
										<div style={{textAlign: 'center'}}>
											<Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
										</div>
									)
								)}
								{(
									(this.readAnalyData() && !this.readLoadingStatus())&&
									(<div>{this.readAnalyData()}</div>)
								)}
								{(
									(this.readAnalyMap() && !this.readLoadingStatus())&&
									(<div style={{
										position:'relative',
										width:'100%',
										height:'113px',
										overflow:'auto',
										border: '2px dotted red',}}>
											{this.readAnalyMap()}
									</div>)
								)}
							</Card>
						</div>
					</div>
					<div className="display-box">
					<Card title="测试用例" 
						headStyle={{
							background:'#66ccff',
							borderLeft:'1px solid #000',
							borderRight:'1px solid #000',
							borderTop:'1px solid #000',
						}} 
						bodyStyle={{ 
							borderLeft:'1px solid #000',
							borderRight:'1px solid #000',
							borderBottom:'1px solid #000',
						}}
					>
						{(
							(this.readResList().length==0 && !this.readLoadingStatus()) &&
								(<div className='border'>
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
								</div>)
						)}
						{(
							this.readLoadingStatus() &&
							(
								<div style={{textAlign: 'center'}}>
									<Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
								</div>
							)
						)}
						{(
							(this.readResList().length!=0 && !this.readLoadingStatus()) &&
							(
								<div>{this.readResList()}</div>
							)
						)}
					</Card>
				</div>
				</div>
			</>
		);
	}
}

export default App;
