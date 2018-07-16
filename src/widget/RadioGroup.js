// 单选按钮封装
import React, { Component } from "react";
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const imgs = {
	image: require('../img/check_line.png'), // 未被选中的图片
	image2: require('../img/check.png') // 选中的图片
}
export default class RadioGroup extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selectIndex: this.props.selectIndex ? this.props.selectIndex : '', // 被选中的index
			data: this.props.data ? this.props.data : [], // 打印单选按钮组的数据
		};
	}

	render() {
		let newArray = this.state.data;
		return (
			<View style={[this.props.style]}>
				{
					newArray.map((item, index) =>

						this.renderRadioButton(newArray, item, this.onPress, index, this.state.selectIndex)
					)
				}
			</View>
		)
	}

	// 按钮被点击
	onPress = (index, item) => {
		let array = this.state.data;
		for (let i = 0; i < array.length; i++) {
			let item = array[i];
			item.select = false;
			if (i == index) {
				item.select = true;
			}
		}
		this.setState({ selectIndex: index });
		this.props.onPress ? this.props.onPress(index, item) : () => {
		}
	}
	// 单选按钮打印
	renderRadioButton(array, item, onPress, index, sexIndex) {
		let backgroundColor = 'red';
		let image = imgs.image
		if (item.select == true) {
			image = imgs.image2;
			backgroundColor = 'blue';
		} else {
			image = imgs.image;
			backgroundColor = 'red';
		}

		if (sexIndex == index && sexIndex != '') {
			backgroundColor = 'blue';
			image = imgs.image2;
		}


		return (
			<TouchableOpacity key={index} onPress={() => {
				onPress(index, item)
			}} style={[{
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			}, this.props.conTainStyle]}>
				<Image style={this.props.imageStyle} source={image} />
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	contain: {
		flex: 1,
		backgroundColor: 'white',
	}
});

// 传参说明
// style            整个组件的样式----这样可以垂直和水平
// conTainStyle     图片和文字的容器样式
// imageStyle       图片样式
// textStyle        文字样式
// selectIndex={''} 空字符串,表示不选中,数组索引表示默认选中
// data             数据源，数组类型
// onPress          按钮被选择触发的事件
