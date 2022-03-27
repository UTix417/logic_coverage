import './App.css';
import React from "react";
import { Input, Button, Typography, notification, Table, Empty, Card, Spin } from 'antd';
import { LoadingOutlined, BarChartOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { TextArea } = Input;

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			text: "",
			loading: false,
			solveType: 0,// 1条件判定 2条件组合 3MC/DC
			tureStr: '',
		}
	}

	map = [];				//表达式形成的图
	resList = [];			//测试用例
	nowPathData = {};		//当前选中的测试用例
	hasClickdata = false;		//是否有勾选的测试用例
	collopesStatus = false;	//测试用例路径图的展开状态
	showCanvas = false;		//是否展示路径图，仅用于条件渲染
	ElementAreas = [];		//化简后的表达式中的与块

	/**
	 * 调用方：页面按钮
	 * 作用：设置页面中的loading状态
	 */
	prework = (solveType) => {
		this.map = [];
		this.resList = [];
		this.nowPathData = {};
		this.showCanvas = false;
		this.hasClickdata = false;
		this.collopesStatus = false;
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
		let testWord = new RegExp(/[a-zA-Z&|!()]/);
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
			if (!testWord.test(temp[i])) {
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
			if (str[i] !== '(') {
				break;
			}
			front++;
		}
		for (let i = str.length - 1; i >= 0; i--) {
			if (str[i] !== ')') {
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
		if (this.state.solveType === 1) {
			this.preworkX(tureStr, this.work1);
		} else if (this.state.solveType === 2) {
			this.preworkX(tureStr, this.work2);
		} else if (this.state.solveType === 3) {
			this.preworkX(tureStr, this.work3);
		}
	}

	/**
	 * 调用方：divi
	 * 作用：递归去除括号后进行测试用例生成分流 
	 * @param {string} tureStr 经过！简化的字符串
	 */
	workWithHave = async (tureStr) => {
		// console.log(tureStr,"?????");
		tureStr = await this.toFormat(tureStr);
		this.setState({ tureStr }, () => {
			// console.log(this.state)
			// console.log(tureStr,'???');
			if (this.state.solveType === 1) {
				this.preworkX(tureStr, this.work1);
			} else if (this.state.solveType === 2) {
				this.preworkX(tureStr, this.work2);
			} else if (this.state.solveType === 3) {
				this.preworkX(tureStr, this.work3);
			}
		});
	}

	/**
	 * 调用方：workWithHave、toFormat(递归)
	 * 作用：递归去除括号
	 * @param {string} str 当前处理的字符串字串 
	 */
	toFormat = async (str) => {
		// console.log(str,'1');
		let startIndex = -1;
		let num = [];
		let nowNotFlag = 0;
		//去括号递归
		for (let i = 0; i < str.length; i++) {
			// console.log(str[i],str)
			if (str[i] === '(') {
				if (num.length === 0) {
					startIndex = i + 1;
					if (i > 0) {
						if (str[i - 1] === '!') {
							nowNotFlag = 1;
							str = str.substring(0, i - 1) + str.substring(i, str.length);
							i--;
							startIndex--;
						}
					}
				}
				num.push(i);
				continue;
			}
			if (nowNotFlag) {
				if (str[i] === '&') {
					str = str.substring(0, i) + '|' + str.substring(i + 1, str.length);
				} else if (str[i] === '|') {
					str = str.substring(0, i) + '&' + str.substring(i + 1, str.length);
				} else if (str[i] === '!') {
					let j = i + 1;
					while (j < str.length && (str[j] !== '|' || str[j] !== '&')) {
						j++;
					}
					str = str.substring(0, i) + str.substring(i + 1, str.length);
					i = j - 1;
				} else if (str[i] === '(') {
					let j = i + 1;
					let tempNum = [];
					tempNum.push(i);
					while (j < str.length && tempNum.length !== 0) {
						if (str[j] === '(') {
							tempNum.push(j);
						}
						if (str[j] === ')') {
							tempNum.pop();
						}
						j++;
					}
					str = str.substring(0, i) + '!' + str.substring(i, str.length);
					i = j;
				} else {//元素
					let j = i + 1;
					while (j < str.length && str[j] !== '|' && str[j] !== '&') {
						j++;
					}
					str = str.substring(0, i) + '!' + str.substring(i, str.length);
					i = j;
				}
			}
			if (str[i] === ')') {
				num.pop();
				if (num.length === 0) {
					// console.log(startIndex,str.substring(startIndex, i))
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
					nowNotFlag = 0;
				}
			}
		}
		let elementStar = 0;
		let inFlag = false;
		// console.log(str,'递归结束');
		for (let i = 0; i < str.length; i++) {
			if (str[i] === '[') {
				inFlag = true;
			}
			if (str[i] === ']') {
				inFlag = false;
			}
			if ((str[i] === '|' || str[i] === '&') && !inFlag) {
				if (str[i - 1] !== ']') {
					str = str.substring(0, elementStar) + '[' + str.substring(elementStar, i) + ']' + str.substring(i, str.length);
					i += 2;
				}
				elementStar = i + 1;
			}
			if (i === str.length - 1 && !inFlag) {
				if (str[i] !== ']') {
					str = str.substring(0, elementStar) + '[' + str.substring(elementStar, str.length) + ']';
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
			if (str[i] === '|' || str[i] === '&') {
				lastSyn = str[i];
			}
			if (str[i] === '[') {
				deleteStart = i + 1;
				if (lastSyn === '|') {
					// nothing need to do
				} else if (lastSyn === '') {
					// emptyFlag = true;
				} else {
					andFlag = true;
				}
			}
			if (str[i] === ']') {
				// console.log(str,"去括号运算中")
				if (andFlag) {
					//deleteStart-2 是乘法的结束
					let inElement = [];
					let beforeElement = [];
					let tempElement = '';
					let isBefore = false;
					let beforeStart = 0;
					for (let j = deleteStart - 2; j >= 0; j--) {
						if (str[j] === ']' || !isBefore) {
							isBefore = true;
							continue;
						}
						if (str[j] === '[') {
							beforeStart = j;
							beforeElement.push(tempElement.split('').reverse().join(''));
							break;
						}
						if (str[j] === '|') {
							beforeElement.push(tempElement.split('').reverse().join(''));
							tempElement = '';
						} else {
							tempElement += str[j];
						}

					}
					tempElement = '';
					for (let j = deleteStart; j < i; j++) {
						if (str[j] === '|') {
							inElement.push(tempElement);
							tempElement = '';
						} else {
							tempElement += str[j];
						}
						if (j === i - 1) {
							inElement.push(tempElement);
							tempElement = '';
						}
					}
					// console.log(inElement,beforeElement)
					let resStr = '';
					for (let x = 0; x < beforeElement.length; x++) {
						for (let y = 0; y < inElement.length; y++) {
							let newelement = beforeElement[x] + '&' + inElement[y];
							// console.log(beforeElement[x],inElement[y],"???")
							let elementShowRecord = {};
							let element = '';
							let elementStart = -1;
							for (let j = 0; j < newelement.length; j++) {
								if (newelement[j] === '&' || j === newelement.length - 1) {
									if (j === newelement.length - 1) {
										element += newelement[j];
									} else {
										elementStart = j;
									}
									// console.log(newelement[j],'>>>>',element,'>>>>>',elementShowRecord[element])
									if (!elementShowRecord[element]) {
										elementShowRecord[element] = 1;
									} else {
										let copynewelement = newelement;
										// console.log(copynewelement,'------',elementStart,copynewelement.substring(0,elementStart))
										newelement = copynewelement.substring(0, elementStart);
										if (j !== copynewelement.length - 1) {
											newelement += copynewelement.substring(j + 1, copynewelement.length);
										}
									}
									element = '';
								} else {
									element += newelement[j];
								}
							}
							if (resStr.length === 0) {
								resStr += newelement;
							} else if (newelement.length > 0) {
								resStr = resStr + '|' + newelement;
							}
							// console.log(resStr,'!!!',newelement)
						}
					}
					// console.log(beforeStart,resStr)
					if (i === str.length - 1) {
						str = str.substring(0, beforeStart) + '[' + resStr + ']';
						i = (str.substring(0, beforeStart) + '[' + resStr + ']').length - 1;
					} else {
						str = str.substring(0, beforeStart) + '[' + resStr + ']' + str.substring(i + 1, str.length);
						i = (str.substring(0, beforeStart) + '[' + resStr + ']').length - 1;
					}
					// console.log(str,i,str[i])
					andFlag = false;
				}
				deleteStart = -1;
			}
		}
		str = str.replaceAll('[', '');
		str = str.replaceAll(']', '');
		return str;
	}

	/**
	 * 调用方：workWithNo、workWithHave
	 * 作用：生成mapdata
	 * @param {string} tureStr 经过！简化的字符串
	 */
	preworkX = (tureStr, workFun) => {
		let _eleAreas = [];
		let _element = '';
		let _eleArea = [];
		for (let i = 0; i < tureStr.length; i++) {
			if (tureStr[i] === '|') {
				_eleArea.push(_element);
				_eleAreas.push(_eleArea.sort());
				_eleArea = [];
				_element = '';
			} else {
				if (tureStr[i] === '&') {
					_eleArea.push(_element);
					_element = '';
				} else {
					_element += tureStr[i];
				}
			}
			if (i === tureStr.length - 1) {
				_eleArea.push(_element);
				_eleAreas.push(_eleArea.sort());
			}
		}
		_eleAreas.sort((x, y) => {
			return x.length - y.length;
		});
		let deleteIndex = [];
		for (let i = 0; i < _eleAreas.length; i++) {
			for (let j = i + 1; j < _eleAreas.length; j++) {
				let flag = true;
				for (let k = 0; k < _eleAreas[i].length; k++) {
					if (_eleAreas[i][k] !== _eleAreas[j][k]) {
						flag = false;
					}
				}
				if (flag) {
					deleteIndex.push(j);
				}
			}
		}

		let deleteArea = [];//删掉的，如果要用的话
		for (let i = 0; i < deleteIndex.length; i++) {
			deleteArea.push(_eleAreas[deleteIndex[i] - i]);
			_eleAreas.splice(deleteIndex[i] - i, 1);
		}

		tureStr = '';
		this.ElementAreas = JSON.parse(JSON.stringify(_eleAreas));
		for (let i = 0; i < _eleAreas.length; i++) {
			for (let j = 0; j < _eleAreas[i].length; j++) {
				tureStr += _eleAreas[i][j];
				if (j !== _eleAreas[i].length - 1) {
					tureStr += '&';
				}
			}
			if (i !== _eleAreas.length - 1) {
				tureStr += '|';
			}
		}

		this.setState({ tureStr }, () => {
			let mapdata = [];
			let elename = '', elesyn = '&';
			for (let i = 0; i < tureStr.length; i++) {
				if (tureStr[i] === '|' || tureStr[i] === '&' || tureStr[i] === '!') {
					elesyn += tureStr[i];
					if (elename.length) {
						mapdata[mapdata.length - 1]['elename'] = elename;
						elename = '';
					}
				} else {
					elename += tureStr[i];
					if (elesyn.length) {
						mapdata.push({ elesyn });
						elesyn = '';
					}
				}
				if (i === tureStr.length - 1) {
					mapdata[mapdata.length - 1]['elename'] = elename;
				}
			}
			/**
			 * 	this.map[i]={
					name: '$head',
					tTo: '$T',//'$T' or index
					fTo: '$F',//'$F' or index
					elesyn: '',
				}
			*/
			let toTIndex = { index: -1, isNot: false };
			let toFIndex = [];
			for (let i = 0; i < mapdata.length; i++) {
				if (mapdata[i].elesyn === '&') {
					this.map.push({
						name: mapdata[i].elename,
						tTo: '$T',
						fTo: '$F',
					});
					if (toTIndex.index !== -1) {
						if (toTIndex.isfalse !== 1) {
							this.map[toTIndex.index].tTo = this.map.length - 1;
						} else {
							this.map[toTIndex.index].fTo = this.map.length - 1;
						}
					}
					this.map[i].elesyn = mapdata[i].elesyn;
					toTIndex = {
						index: this.map.length - 1,
						isfalse: 0,
					};
					toFIndex.push({
						index: this.map.length - 1,
						isfalse: 0,
					});
				} else if (mapdata[i].elesyn === '|!') {
					this.map.push({
						name: mapdata[i].elename,
						tTo: '$F',
						fTo: '$T',
					});
					toTIndex.forEach((value) => {
						if (value.isfalse !== 1) {
							this.map[value.index].fTo = this.map.length - 1;
						} else {
							this.map[value.index].tTo = this.map.length - 1;
						}
					})
					this.map[i].elesyn = mapdata[i].elesyn;
					toTIndex = {
						index: this.map.length - 1,
						isfalse: 1,
					};
					toFIndex.push({
						index: this.map.length - 1,
						isfalse: 1,
					});
				} else if (mapdata[i].elesyn === '|') {
					this.map.push({
						name: mapdata[i].elename,
						tTo: '$T',
						fTo: '$F',
					});
					toFIndex.forEach((value) => {
						if (value.isfalse !== 1) {
							this.map[value.index].fTo = this.map.length - 1;
						} else {
							this.map[value.index].tTo = this.map.length - 1;
						}
					});
					this.map[i].elesyn = mapdata[i].elesyn;
					toFIndex = [{
						index: this.map.length - 1,
						isfalse: 0,
					}];
					toTIndex = {
						index: this.map.length - 1,
						isfalse: 0,
					};
				} else if (mapdata[i].elesyn === '&!') {
					this.map.push({
						name: mapdata[i].elename,
						tTo: '$F',
						fTo: '$T',
					});
					if (toTIndex.index !== -1) {
						if (toTIndex.isfalse !== 1) {
							this.map[toTIndex.index].tTo = this.map.length - 1;
						} else {
							this.map[toTIndex.index].fTo = this.map.length - 1;
						}
					}
					this.map[i].elesyn = mapdata[i].elesyn;
					toFIndex = [{
						index: this.map.length - 1,
						isfalse: 1,
					}];
					toTIndex = {
						index: this.map.length - 1,
						isfalse: 1,
					};
				}
			}
			workFun();
		})
	}

	/**
	 * 调用方：workWithNo、workWithHave
	 * 作用：生成测试用例
	 */
	work1 = () => {
		this.getPathFromMap(0, {}).then(() => {
			if (this.map.length !== 0) {
				this.showCanvas = true;
			}
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
	getPathFromMap = async (nowindex, nowPath) => {
		let tempPath = {};
		if (this.map.length === 0) {
			return;
		}
		if (nowPath[this.map[nowindex].name] !== 'F') {
			if (this.map[nowindex].tTo === '$T') {
				tempPath = JSON.parse(JSON.stringify(nowPath));
				if (!nowPath[this.map[nowindex].name]) {

				}
				tempPath[this.map[nowindex].name] = 'T';
				tempPath['$res'] = 'T';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			} else if (this.map[nowindex].tTo === '$F') {
				tempPath = JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name] = 'T';
				tempPath['$res'] = 'F';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			} else {
				tempPath = JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name] = 'T';
				this.getPathFromMap(this.map[nowindex].tTo, tempPath);
			}
		}
		if (nowPath[this.map[nowindex].name] !== 'T') {
			if (this.map[nowindex].fTo === '$F') {
				tempPath = JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name] = 'F';
				tempPath['$res'] = 'F';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			} else if (this.map[nowindex].fTo === '$T') {
				tempPath = JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name] = 'F';
				tempPath['$res'] = 'T';
				this.resList.push(JSON.parse(JSON.stringify(tempPath)));
			} else {
				tempPath = JSON.parse(JSON.stringify(nowPath));
				tempPath[this.map[nowindex].name] = 'F';
				this.getPathFromMap(this.map[nowindex].fTo, tempPath);
			}
		}
	}

	/**
	 * 调用方：workWithNo、workWithHave
	 * 作用：生成测试用例
	 */
	work2 = () => {
		let elements = {};
		for (let i = 0; i < this.map.length; i++) {
			elements[this.map[i].name] = 1;
		}
		let status = (1 << Object.keys(elements).length);
		let keys = Object.keys(elements);
		for (let i = 0; i < status; i++) {
			let nowStatus = i;
			let tempRes = {};
			let keyIndex = 0;
			while (nowStatus || keyIndex < keys.length) {
				if (nowStatus & 1) {
					tempRes[keys[keyIndex]] = 'T';
				} else {
					tempRes[keys[keyIndex]] = 'F';
				}
				keyIndex += 1;
				nowStatus >>= 1;
			}
			let nowIndex = 0;
			while (true) {
				if (!this.map[nowIndex]) {
					tempRes['$res'] = nowIndex.substring(1, 2);
					break;
				}
				if (tempRes[this.map[nowIndex].name] === 'T') {
					nowIndex = this.map[nowIndex].tTo;
				} else if (tempRes[this.map[nowIndex].name] === 'F') {
					nowIndex = this.map[nowIndex].fTo;
				}
			}
			this.resList.push(tempRes)
		}
		if (this.map.length !== 0) {
			this.showCanvas = true;
		}
		this.setState({
			loading: false,
		})
	}

	/**
	 * 调用方：workWithNo、workWithHave
	 * 作用：生成测试用例
	 */
	work3 = () => {
		let elements = [];
		for (let i = 0; i < this.map.length; i++) {
			elements.push(this.map[i].name);
		}
		let resListItem = {};
		for (let i = 0; i < this.ElementAreas.length; i++) {
			for (let j = 0; j < this.ElementAreas[i].length; j++) {
				resListItem[this.ElementAreas[i][j]] = 'T';
			}
			resListItem['$res'] = 'T';
			for (let j = 0; j < elements.length; j++) {
				if (!resListItem[elements[j]]) {
					resListItem[elements[j]] = 'F';
				}
			}
			this.resList.push(resListItem);
			resListItem = {};
		}
		for (let i = 0; i < elements.length; i++) {
			resListItem[elements[i]] = 'F';
		}
		resListItem['$res'] = 'F';
		this.resList.push(resListItem);
		if (this.map.length !== 0) {
			this.showCanvas = true;
		}
		this.setState({
			loading: false,
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
	readTureStr() {
		// console.log(this.state.tureStr)
		return this.state.tureStr;
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的测试用例情况
	 */
	readResList() {
		if (this.resList.length) {
			let children = [];
			let maxIndex = 0;
			let maxLength = 0;
			for (let i = 0; i < this.resList.length; i++) {
				let tempPath = this.resList[i];
				if (maxLength < Object.keys(tempPath).length) {
					maxLength = Object.keys(tempPath).length;
					maxIndex = i;
				}
			}
			Object.keys(this.resList[maxIndex]).forEach((key) => {
				if (key !== '$res') {
					children.push({
						title: `${key}`,
						dataIndex: `${key}`,
						key: `${key}`,
					})
				}
			})
			const columns = [
				{
					title: '表达式结果',
					dataIndex: '$res',
					key: '$res',
					fixed: 'left',
				},
				{
					title: '变量名',
					children,
				},
			];
			let data = [];
			for (let i = 0; i < this.resList.length; i++) {
				data.push({
					key: i,
					...this.resList[i]
				})
			}
			return (
				<Table
					rowSelection={{
						type: 'Checkbox',
						onChange: (selectedRowKeys, selectedRows) => {
							if (selectedRowKeys.length > 1) {
								return;
							}
							this.hasClickdata = selectedRowKeys.length > 0 ? true : false;
							this.nowPathData = selectedRows[0];
						},
						getCheckboxProps: (record) => ({
							disabled: JSON.stringify(record) !== JSON.stringify(this.nowPathData) && JSON.stringify(this.nowPathData) !== "{}",
						}),
					}}
					onRow={record => {
						return {
							onMouseEnter: () => {
								if (this.hasClickdata) {
									return;
								}
								this.nowPathData = record;
								this.setState({ loading: false });
								// console.log(record)
							}, // 鼠标移入行
							onMouseLeave: () => {
								if (this.hasClickdata) {
									return;
								}
								this.nowPathData = {};
								this.setState({ loading: false });
							},
						};
					}}
					columns={columns}
					dataSource={data}
					scroll={{ y: 300 }}
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
	readLoadingStatus() {
		return this.state.loading;
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的分析数据 
	 */
	readAnalyData() {
		let tureStr = this.state.tureStr;
		if (!tureStr.length > 0) {
			return false;
		}
		let analyTureStr = '';
		let elename = '', elenameArea = '';
		// console.log("-----------------------")
		for (let i = 0; i < tureStr.length; i++) {
			if (tureStr[i] === '|' || tureStr[i] === '&' || tureStr[i] === '!') {
				if (tureStr[i] === '|' || tureStr[i] === '&') {
					let resData = this.nowPathData[elename];
					if (resData) {
						if ((resData === 'T' && elenameArea[0] !== '!') || (resData === 'F' && elenameArea[0] === '!')) {
							analyTureStr += `<span style="color:lime">${elenameArea}</span>`;
						} else {
							analyTureStr += `<span style="color:red">${elenameArea}</span>`;
						}
					} else if (Object.keys(this.nowPathData).length !== 0) {
						analyTureStr += `<span style="color:blue">${elenameArea}</span>`;
					} else {
						analyTureStr += `<span style="color:black">${elenameArea}</span>`;
					}
					analyTureStr += tureStr[i];
					elenameArea = '';
				} else {
					elenameArea += tureStr[i];
				}
				elename = '';
			} else {
				elename += tureStr[i];
				elenameArea += tureStr[i];
			}
			if (i === tureStr.length - 1) {
				let resData = this.nowPathData[elename];
				if (resData) {
					if ((resData === 'T' && elenameArea[0] !== '!') || (resData === 'F' && elenameArea[0] === '!')) {
						analyTureStr += `<span style="color:lime">${elenameArea}</span>`;
					} else {
						analyTureStr += `<span style="color:red">${elenameArea}</span>`;
					}
				} else if (Object.keys(this.nowPathData).length !== 0) {
					analyTureStr += `<span style="color:blue">${elenameArea}</span>`;
				} else {
					analyTureStr += `<span style="color:black">${elenameArea}</span>`;
				}
			}
		}
		let analyData = (
			<div>
				<Text mark>绿色为T，红色为F，蓝色为非关键，金色为当前路径，点击路径图可以纵向展开图片</Text>
				<div></div>
				<Text type="warning">图中线有所交叉是正常情况，请谅解</Text>
				<div>
					化简后表达式：
					<Text code>
						<span style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: analyTureStr }}></span>
					</Text>
					{(this.nowPathData && this.nowPathData['$res'] === 'T') &&
						<span>=<span style={{ color: 'lime' }}>T</span></span>
					}
					{(this.nowPathData && this.nowPathData['$res'] === 'F') &&
						<span>=<span style={{ color: 'red' }}>F</span></span>
					}
					{(this.nowPathData && !this.nowPathData['$res']) &&
						<span>=?</span>
					}
				</div>
			</div>
		);
		return analyData;
	}

	/**
	 * 调用方：render
	 * 作用：更新页面中的分析数据的图 
	 */
	readAnalyMap() {
		if (this.map.length === 0) {
			return null;
		}
		let mapdrawdata = JSON.parse(JSON.stringify(this.map));
		let nowX = 30, nowY = 30;
		let maxX = 0, maxY = 0;
		let r = 20;
		for (let i = 0; i < mapdrawdata.length; i++) {
			if (mapdrawdata[i].elesyn[0] === '|') {
				nowY += 120;
				nowX = 30;
				mapdrawdata[i].X = nowX;
				mapdrawdata[i].Y = nowY;
				nowX += 120;
				maxX = Math.max(maxX, nowX);
				maxY = Math.max(maxY, nowY);
			} else if (mapdrawdata[i].elesyn[0] === '&') {
				mapdrawdata[i].X = nowX;
				mapdrawdata[i].Y = nowY;
				nowX += 120;
				maxX = Math.max(maxX, nowX);
				maxY = Math.max(maxY, nowY);
				maxY = Math.max(maxY, 120);
			}
		}
		const canvas = document.getElementById('mapGraph');
		canvas.setAttribute("width", maxX + 60);
		canvas.setAttribute("height", maxY + 60);
		const ctx = canvas.getContext('2d');
		ctx.font = "24px serif";
		ctx.lineJoin = "round";
		let Tx = maxX, Ty = 60, Fx = maxX, Fy = 120;

		ctx.strokeStyle = 'lime';
		ctx.fillStyle = 'lime';
		ctx.fillText('$T', maxX - 12, 66);
		ctx.beginPath();
		ctx.arc(Tx, Ty, r, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'red';
		ctx.fillText('$F', maxX - 12, 126);
		ctx.beginPath();
		ctx.arc(Fx, Fy, r, 0, 2 * Math.PI);
		ctx.stroke();

		let nowEdege = {};
		let nowIndex = 0;
		while (true) {
			if (JSON.stringify(this.nowPathData) === "{}") {
				break;
			}
			if (this.map[nowIndex]) {
				let {
					tTo,
					fTo,
					name,
				} = this.map[nowIndex];
				if (this.nowPathData[name] === 'T') {
					nowEdege['$' + nowIndex.toString()] = tTo;
					nowIndex = tTo;
				} else if (this.nowPathData[name] === 'F') {
					nowEdege['$' + nowIndex.toString()] = fTo;
					nowIndex = fTo;
				}
			} else {
				break;
			}
		}

		for (let i = 0; i < mapdrawdata.length; i++) {
			let {
				X,
				Y,
				tTo,
				fTo,
				name,
			} = mapdrawdata[i];
			if (this.nowPathData[name]) {
				if (this.nowPathData[name] === 'T') {
					ctx.strokeStyle = 'lime';
					ctx.fillStyle = 'lime';
					ctx.fillText(name, X - 6 * name.length, Y + 6 * name.length);
					ctx.beginPath();
					ctx.arc(X, Y, r, 0, 2 * Math.PI);
					ctx.stroke();
				} else if (this.nowPathData[name] === 'F') {
					ctx.strokeStyle = 'red';
					ctx.fillStyle = 'red';
					ctx.fillText(name, X - 6 * name.length, Y + 6 * name.length);
					ctx.beginPath();
					ctx.arc(X, Y, r, 0, 2 * Math.PI);
					ctx.stroke();
				} else {
					ctx.strokeStyle = 'blue';
					ctx.fillStyle = 'blue';
					ctx.fillText(name, X - 6 * name.length, Y + 6 * name.length);
					ctx.beginPath();
					ctx.arc(X, Y, r, 0, 2 * Math.PI);
					ctx.stroke();
				}
			} else {
				ctx.strokeStyle = 'black';
				ctx.fillStyle = 'black';
				ctx.fillText(name, X - 6 * name.length, Y + 6 * name.length);
				ctx.beginPath();
				ctx.arc(X, Y, r, 0, 2 * Math.PI);
				ctx.stroke();
			}
			if (mapdrawdata[tTo]) {
				let tx = mapdrawdata[tTo].X;
				let ty = mapdrawdata[tTo].Y;
				let xx = X - tx;
				let yy = Y - ty;
				let angle = Math.atan(Math.abs(yy / xx));
				if (xx === 0) {
					angle = Math.PI / 2;
				}
				let dx = Math.cos(angle) * r;
				if (xx > 0) {
					dx *= -1;
				}
				let dy = Math.sin(angle) * r;
				if (yy > 0) {
					dy *= -1;
				}
				if (this.nowPathData[name] === 'T' && nowEdege['$' + i]) {
					ctx.strokeStyle = 'gold';
					ctx.fillStyle = 'gold';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('T', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				} else {
					ctx.strokeStyle = 'black';
					ctx.fillStyle = 'black';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('T', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				}
			} else {
				let tx;
				let ty;
				if (tTo === '$T') {
					tx = Tx;
					ty = Ty;
				} else {
					tx = Fx;
					ty = Fy;
				}
				let xx = X - tx;
				let yy = Y - ty;
				let angle = Math.atan(Math.abs(yy / xx));
				if (xx === 0) {
					angle = Math.PI / 2;
				}
				let dx = Math.cos(angle) * r;
				if (xx > 0) {
					dx *= -1;
				}
				let dy = Math.sin(angle) * r;
				if (yy > 0) {
					dy *= -1;
				}
				if (this.nowPathData[name] === 'T' && nowEdege['$' + i]) {
					ctx.strokeStyle = 'gold';
					ctx.fillStyle = 'gold';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('T', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				} else {
					ctx.strokeStyle = 'black';
					ctx.fillStyle = 'black';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('T', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				}
			}
			if (mapdrawdata[fTo]) {
				let tx = mapdrawdata[fTo].X;
				let ty = mapdrawdata[fTo].Y;
				let xx = X - tx;
				let yy = Y - ty;
				let angle = Math.atan(Math.abs(yy / xx));
				if (xx === 0) {
					angle = Math.PI / 2;
				}
				let dx = Math.cos(angle) * r;
				if (xx > 0) {
					dx *= -1;
				}
				let dy = Math.sin(angle) * r;
				if (yy > 0) {
					dy *= -1;
				}
				if (this.nowPathData[name] === 'F' && nowEdege['$' + i]) {
					ctx.strokeStyle = 'gold';
					ctx.fillStyle = 'gold';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('F', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				} else {
					ctx.strokeStyle = 'black';
					ctx.fillStyle = 'black';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('F', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				}
			} else {
				let tx;
				let ty;
				if (fTo === '$T') {
					tx = Tx;
					ty = Ty;
				} else {
					tx = Fx;
					ty = Fy;
				}
				let xx = X - tx;
				let yy = Y - ty;
				let angle = Math.atan(Math.abs(yy / xx));
				if (xx === 0) {
					angle = Math.PI / 2;
				}
				let dx = Math.cos(angle) * r;
				if (xx > 0) {
					dx *= -1;
				}
				let dy = Math.sin(angle) * r;
				if (yy > 0) {
					dy *= -1;
				}
				if (this.nowPathData[name] === 'F' && nowEdege['$' + i]) {
					ctx.strokeStyle = 'gold';
					ctx.fillStyle = 'gold';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('F', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				} else {
					ctx.strokeStyle = 'black';
					ctx.fillStyle = 'black';
					ctx.beginPath();
					ctx.moveTo(X + dx, Y + dy);
					ctx.lineTo((X + tx) / 2 - dx / r * 12, (Y + ty) / 2 - dy / r * 12);
					ctx.moveTo((X + tx) / 2 + dx / r * 12, (Y + ty) / 2 + dy / r * 12);
					ctx.lineTo(tx - dx, ty - dy);
					let fx = 1, fy = 1;
					if (dx < 0) {
						fx = -1;
					}
					if (dy < 0) {
						fy = -1;
					}

					ctx.lineTo(tx - dx - fx * Math.cos(angle + Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle + Math.PI / 4) * 5);
					ctx.moveTo(tx - dx, ty - dy);
					ctx.lineTo(tx - dx - fx * Math.cos(angle - Math.PI / 4) * 5
						, ty - dy - fy * Math.sin(angle - Math.PI / 4) * 5);

					ctx.fillText('F', (X + tx) / 2 - 6, (Y + ty) / 2 + 6);
					ctx.stroke();
				}
			}
		}
		return true;
	}

	render() {
		return (
			<>
				<Title className="title">
					<BarChartOutlined />
					<span style={{ fontSize: '30px', marginLeft: '10px' }}>布尔表达式的逻辑覆盖</span>
				</Title>
				<div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
					<div className="work-box">
						<div className="input-box">
							<Card title="数据操作"
								headStyle={{
									background: '#66ccff',
									borderLeft: '1px solid #000',
									borderRight: '1px solid #000',
									borderTop: '1px solid #000',
								}}
								bodyStyle={{
									borderLeft: '1px solid #000',
									borderRight: '1px solid #000',
									borderBottom: '1px solid #000',
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
										disabled={this.state.loading && this.state.solveType !== 1}
										onClick={this.prework.bind(this, 1)}
										loading={this.state.loading && this.state.solveType === 1}
									>条件/判定</Button>
									<Button className="button"
										type="primary"
										disabled={this.state.loading && this.state.solveType !== 2}
										onClick={this.prework.bind(this, 2)}
										loading={this.state.loading && this.state.solveType === 2}
									>条件组合</Button>
									<Button className="button"
										type="primary"
										disabled={this.state.loading && this.state.solveType !== 3}
										onClick={this.prework.bind(this, 3)}
										loading={this.state.loading && this.state.solveType === 3}
									>MC/DC</Button>
								</div>
							</Card>
						</div>
						<div className="showInfo-box">
							<Card title="可视化数据"
								headStyle={{
									background: '#66ccff',
									borderLeft: '1px solid #000',
									borderRight: '1px solid #000',
									borderTop: '1px solid #000',
								}}
								bodyStyle={{
									borderLeft: '1px solid #000',
									borderRight: '1px solid #000',
									borderBottom: '1px solid #000',
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
										<div style={{ textAlign: 'center' }}>
											<Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
										</div>
									)
								)}
								{(
									(this.readAnalyData() && !this.readLoadingStatus()) &&
									(<div>{this.readAnalyData()}</div>)
								)}
								{(
									<div style={{
										overflow: 'auto',
										height: this.showCanvas ? this.collopesStatus ? '' : '120px' : '0px',
										width: 'auto',
										zIndex: '99',
										background: '#fff',
									}}
										onClick={() => {
											this.collopesStatus ^= true;
											this.forceUpdate();
										}}>
										<canvas id="mapGraph">{this.readAnalyMap()}</canvas>
									</div>
								)}
							</Card>
						</div>
					</div>
					<div className="display-box">
						<Card title="测试用例(点击以保留数据至可视化)"
							headStyle={{
								background: '#66ccff',
								borderLeft: '1px solid #000',
								borderRight: '1px solid #000',
								borderTop: '1px solid #000',
							}}
							bodyStyle={{
								borderLeft: '1px solid #000',
								borderRight: '1px solid #000',
								borderBottom: '1px solid #000',
							}}
						>
							{(
								(this.readResList().length === 0 && !this.readLoadingStatus()) &&
								(<div className='border'>
									<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
								</div>)
							)}
							{(
								this.readLoadingStatus() &&
								(
									<div style={{ textAlign: 'center' }}>
										<Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
									</div>
								)
							)}
							{(
								(this.readResList().length !== 0 && !this.readLoadingStatus()) &&
								(
									<div>
										<div style={{
											position: 'absolute',
											width: '49px',
											height: '109px',
											background: '#fafafa',
											zIndex: '999'
										}}></div>
										{this.readResList()}
									</div>
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
