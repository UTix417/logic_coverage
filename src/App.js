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

	resList = [];

	/**
	 * 调用方：页面按钮
	 * 作用：设置页面中的loading状态
	 */
	prework = (solveType) => {
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
		// let map = [{
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
		// 			map[0].name = key;
		// 			toTIndex.push(0);
		// 			toFIndex.push(0);
		// 		} else {
		// 			if (syn[key] == '&') {
		// 				map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toTIndex.forEach((value) => {
		// 					map[value].tTo = map.length - 1;
		// 				})
		// 				toTIndex = map.length - 1;
		// 				toFIndex.push(map.length - 1);
		// 			} else if (syn[key] == '|!') {
		// 				map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toTIndex.forEach((value) => {
		// 					map[value].tTo = map.length - 1;
		// 				})
		// 				toTIndex = map.length - 1;
		// 				toFIndex.push(map.length - 1);
		// 			} else if (syn[key] == '|') {
		// 				map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toFIndex.forEach((value) => {
		// 					map[value].fTo = map.length - 1;
		// 				});
		// 				toFIndex = map.length - 1;
		// 				toTIndex.push(map.length - 1);
		// 			} else if (syn[key] == '&!') {
		// 				map.push({
		// 					name: key,
		// 					tTo: '$T',
		// 					fTo: '$F',
		// 				});
		// 				toFIndex.forEach((value) => {
		// 					map[value].fTo = map.length - 1;
		// 				});
		// 				toFIndex = map.length - 1;
		// 				toTIndex.push(map.length - 1);
		// 			}
		// 		}
		// 	}
		// })
		}
		let map = [];
		/**
		 * 	map[i]={
				name: '$head',
				tTo: '$T',//'$T' or index
				fTo: '$F',//'$F' or index
			}
		 */
		let toTIndex = [];
		let toFIndex = [];
		for(let i=0;i<mapdata.length;i++){
			if (mapdata[i].elesyn == '&') {
				map.push({
					name: mapdata[i].elename,
					tTo: '$T',
					fTo: '$F',
				});
				toTIndex.forEach((value) => {
					map[value].tTo = map.length - 1;
				})
				toTIndex = [map.length - 1];
				toFIndex.push(map.length - 1);
			} else if (mapdata[i].elesyn == '|!') {
				map.push({
					name: mapdata[i].elename,
					tTo: '$T',
					fTo: '$F',
				});
				toTIndex.forEach((value) => {
					map[value].tTo = map.length - 1;
				})
				toTIndex = [map.length - 1];
				toFIndex.push(map.length - 1);
			} else if (mapdata[i].elesyn == '|') {
				map.push({
					name: mapdata[i].elename,
					tTo: '$T',
					fTo: '$F',
				});
				toFIndex.forEach((value) => {
					map[value].fTo = map.length - 1;
				});
				toFIndex = [map.length - 1];
				toTIndex.push(map.length - 1);
			} else if (mapdata[i].elesyn == '&!') {
				map.push({
					name: mapdata[i].elename,
					tTo: '$T',
					fTo: '$F',
				});
				toFIndex.forEach((value) => {
					map[value].fTo = map.length - 1;
				});
				toFIndex = [map.length - 1];
				toTIndex.push(map.length - 1);
			}
		}
		this.getPathFromMap(map,0,{}).then(()=>{
			this.setState({
				loading: false,
			})
		});
	}

	/**
	 * 调用方：work1、getPathFromMap(递归)
	 * 作用：dfs求测试用例
	 * @param {{
				name: '$head',
				tTo: '$T',//'$T' or index
				fTo: '$F',//'$F' or index
			}} map 图
	 * @param {Number} nowindex 当前节点
	 * @param {{变量名:boolean, $res:boolean}} nowPath  现在的变量情况
	 */
	getPathFromMap = async (map, nowindex, nowPath)=> {
		let tempPath = {};
		if(map.length==0){
			return;
		}
		if(nowPath[map[nowindex].name]=='T'){
			this.getPathFromMap(map,map[nowindex].tTo,nowPath);
			return;
		}
		if(nowPath[map[nowindex].name]=='F'){
			this.getPathFromMap(map,map[nowindex].tFo,nowPath);
			return;
		}
		if(map[nowindex].tTo=='$T'){
			tempPath=nowPath;
			tempPath[map[nowindex].name]='T';
			tempPath['$res']='T';
			this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			// let tempList=[...this.state.resList];
			// console.log(this.resList,"??",tempPath)
			// tempList.push(JSON.parse(JSON.stringify(tempPath)));
			// console.log(tempList,"!!",tempPath)
			// this.setState({
			// 	resList: tempList
			// });
		}else{
			tempPath=nowPath;
			tempPath[map[nowindex].name]='T';
			this.getPathFromMap(map,map[nowindex].tTo,tempPath);
		}
		if(map[nowindex].fTo=='$F'){
			tempPath=nowPath;
			tempPath[map[nowindex].name]='F';
			tempPath['$res']='F';
			this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			// let tempList=[...this.state.resList];
			// console.log(this.resList,"??",tempPath)
			// tempList.push(JSON.parse(JSON.stringify(tempPath)));
			// console.log(tempList,"!!",tempPath)
			// this.setState({
			// 	resList: tempList
			// });
		}else{
			tempPath=nowPath;
			tempPath[map[nowindex].name]='F';
			this.getPathFromMap(map,map[nowindex].fTo,tempPath);
		}
	}

	/**
	 * 调用方：divi
	 * 作用：递归去除括号后进行测试用例生成分流 
	 * @param {string} tureStr 经过！简化的字符串
	 */
	workWithHave = async (tureStr) => {
		tureStr = await this.toFormat(tureStr);
		this.setState({tureStr});
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
		let mapdata=[];
		let elename='',elesyn='&';
		for(let i=0;i<tureStr.length;i++){
			if(tureStr[i]=='|'||tureStr[i]=='&'||tureStr[i]=='!'){
				elesyn+=tureStr[i];
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
						console.log(record)
					  }, // 鼠标移入行
					  onMouseLeave: () => {

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
							<Card title="分析数据" 
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
									(this.readResList().length>0 || !this.readLoadingStatus()) &&
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
