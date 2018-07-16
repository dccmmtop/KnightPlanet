// 滑动选择按钮封装

import React, { Component } from 'react';
import {
	View,
	Text,
	Animated,
	TouchableOpacity,
	Easing,
	Image,
	I18nManager,
	PanResponder
} from 'react-native';

export default class SwitchSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: this.props.initial ? this.props.initial : 0,
			sliderWidth: 65
		};
		// 滑动时的动画
		this.animatedValue = new Animated
			.Value(this.props.initial ? (I18nManager.isRTL ? -(this.props.initial / this.props.options.length) : (this.props.initial / this.props.options.length)) : 0);
	}

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: this.shouldSetResponder,
			onMoveShouldSetPanResponder: this.shouldSetResponder,
			onPanResponderRelease: this.responderEnd,
			onPanResponderTerminate: this.responderEnd
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.initial !== this.state.selected) {
			this.toggleItem(nextProps.initial);
		}
	}

	shouldSetResponder = (evt, gestureState) => {
		return evt.nativeEvent.touches.length === 1 &&
			!(Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5);
	}

	responderEnd = (evt, gestureState) => {
		const swipeDirection = this._getSwipeDirection(gestureState);
		if (swipeDirection === 'RIGHT' && this.state.selected < (this.props.options.length - 1)) {
			this.toggleItem(this.state.selected + 1)
		} else if (swipeDirection === 'LEFT' && this.state.selected > 0) {
			this.toggleItem(this.state.selected - 1)
		}
	}

	_getSwipeDirection(gestureState) {
		const { dx, dy, vx } = gestureState;
		// 0.1 velocity
		if (Math.abs(vx) > 0.1 && Math.abs(dy) < 80) {
			return (dx > 0)
				? 'RIGHT'
				: 'LEFT';
		}
		return null;
	}

	getBgColor() {
		const { selected } = this.state;
		const { options, buttonColor } = this.props;
		return options[selected].activeColor || buttonColor;
	}

	animate = (value, last) => {
		this.animatedValue.setValue(last);
		Animated.timing(
			this.animatedValue,
			{
				toValue: value,
				duration: 250,
				easing: Easing.cubic,
				useNativeDriver: true,
			}
		).start();
	}

	// 返回被选择的项的index
	toggleItem = (index) => {
		if (this.props.options.length <= 1) return;
		this.animate(
			I18nManager.isRTL ? -(index / this.props.options.length) : (index / this.props.options.length),
			I18nManager.isRTL ? -(this.state.selected / this.props.options.length) : (this.state.selected / this.props.options.length)
		);
		if (this.props.onPress) {
			this.props.onPress(this.props.options[index].value);
		} else {
			console.log('Call onPress with value: ', this.props.options[index].value);
		}
		this.setState({ selected: index });
	}

	render() {
		const {
			textColor,
			selectedColor,
			fontSize,
			backgroundColor,
			borderColor,
			hasPadding
		} = this.props;
		// 循环打印选项
		const options = this.props.options.map((element, index) =>
			(
				<View
					key={index}
					style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
					<TouchableOpacity style={styles.button} onPress={() => this.toggleItem(index)}>
						{element.customIcon}
						{element.imageIcon && <Image source={element.imageIcon} style={{ height: 30, width: 30, tintColor: this.state.selected == index ? selectedColor : textColor }} />}
						<Text style={{
							fontSize, textAlign: 'center', color: this.state.selected == index ? selectedColor : textColor, backgroundColor: 'transparent'
						}}>{element.label}
						</Text>
					</TouchableOpacity>
				</View>
			));

		return (
			<View style={{ flexDirection: 'row' }}>
				<View
					{...this._panResponder.panHandlers}
					style={{ flex: 1 }}>
					<View
						style={{ borderRadius: 50, backgroundColor: backgroundColor, height: 31 }}
						onLayout={(event) => {
							const { width } = event.nativeEvent.layout;
							this.setState({ sliderWidth: (width - (hasPadding ? 2 : 0)) });
						}}>
						<View
							style={{
								flex: 1, flexDirection: 'row', borderColor: borderColor || '#c9c9c9', borderRadius: 60, borderWidth: hasPadding ? 1 : 0
							}}>
							{this.state.sliderWidth ? (
								<Animated.View
									style={[
										{
											height: hasPadding ? 25 : 31,
											backgroundColor: this.getBgColor(),
											width:
												this.state.sliderWidth / this.props.options.length - (hasPadding ? 2 : 0),
											transform: [
												{
													translateX: this.animatedValue.interpolate({
														inputRange: [0, 1],
														outputRange: [
															hasPadding ? 2 : 0,
															this.state.sliderWidth - (hasPadding ? 2 : 0),
														],
													}),
												},
											],
											marginTop: hasPadding ? 2 : 0,
										},
										styles.animated,
									]}
								/>
							) : null}
							{options}
						</View>
					</View>
				</View>
			</View>
		);
	}
}

const styles = {
	button: { width: 65, height: 31, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
	containerButton: {
		flexDirection: 'row', flex: 1, height: 31, justifyContent: 'center', alignItems: 'center'
	},
	animated: {
		borderRadius: 30,
		borderWidth: 0,
		position: 'absolute'
	}
};

// 默认样式，可以自定义
SwitchSelector.defaultProps = {
	textColor: '#000000',
	selectedColor: '#FFFFFF',
	fontSize: 14,
	backgroundColor: '#FFFFFF',
	borderColor: '#C9C9C9',
	hasPadding: false,
	buttonColor: '#BCD635'
};

// 组件调用时参数说明
// Prop	                  Type	       Default	    Required	     Note
// options	              array	       null	        true	         Items array to render. Each item has a label and a value and optionals icons
// options[].label	      string	   null	        true	         Label from each item
// options[].value	      string	   null	        true	         Value from each item
// options[].customIcon	  Jsx element  null	        false	         Optional custom icon from each item
// options[].imageIcon	  string	   null	        false	         Source from a image icon form each item. Has the same color then label in render
// options[].activeColor  string	   null	        false	         Color from each item when is selected
// initial	              number	   0	        true	         Item selected in initial render
// onPress	              function	   console.log	true	         Callback function called after change value.
// fontSize	              number	   null	        false	         Font size from labels. If null default fontSize of the app is used.
// selectedColor	      string	   '#fff'	    false	         Color text of the item selected
// buttonColor	          string	   '#BCD635'	false	         Color bg of the item selected
// textColor	          string	   '#000'	    false	         Color text of the not selecteds items
// backgroundColor	      string	   '#ffffff'	false	         Color bg of the component
// borderColor	          string	   '#c9c9c9'	false	         Border Color of the component
// hasPadding	          bool	       false	    false	         Indicate if item has padding