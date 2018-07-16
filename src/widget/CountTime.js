// 获取验证码倒计时 封装

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, ViewPropTypes } from 'react-native'
import forge from 'node-forge'
import Request from '../common/request'
import api from '../api'
import { toastShort } from '../widget/Toast'

const phoneVolid = /^1\d{10}$/; // 验证手机号为1开头的11位数
type Props = {
	// onPress: Function, // 点击事件
	style: ViewPropTypes.style, // 按钮样式
	title: string, // 按钮上的文字
	codeStyle: ViewPropTypes.style, // 文字样式
	avtiveCodestyle: ViewPropTypes.style, // 倒计时开始后文本样式
	totalTime: number, // 倒计时总时间（秒）
	phoneNumber: boolean, // 父组件调用获取验证码是否成功
	navigation: Object
}

class CountTime extends Component {
	static defaultProps = {
		// onPress: () => {}
	}
	constructor(props) {
		super(props)
		this.state = {
			timerTitle: props.title, // 按钮显示文字
			totalTime: props.totalTime, // 倒计时总时长
			counting: false,
			selfEnable: true
		}
		this._shouldStartCountting = this._shouldStartCountting.bind(this)
		this._countDownAction = this._countDownAction.bind(this)
		this._requestsmscode = this._requestsmscode.bind(this)
		this._md = this._md.bind(this)
	}
	componentWillUnmount() {
		clearInterval(this.interval)
	}
	_shouldStartCountting(shouldStart) {
		if (this.state.counting) { return; }
		if (shouldStart) {
			this._countDownAction()
			this.setState({ counting: true, selfEnable: false })
		} else {
			this.setState({ selfEnable: true })
		}
	}
	_countDownAction() {
		const codeTime = this.state.totalTime;
		this.interval = setInterval(() => {
			const timer = this.state.totalTime - 1
			if (timer === 0) {
				this.interval && clearInterval(this.interval);
				this.setState({
					totalTime: codeTime,
					timerTitle: this.props.title || '获取验证码',
					getCodeResult: null,
					counting: false,
					selfEnable: true
				})
			} else {
				this.setState({
					totalTime: timer,
					timerTitle: `${timer}s`,
				})
			}
		}, 1000)
	}

	// 获取验证码
	_requestsmscode() {
		if (phoneVolid.test(this.props.phoneNumber)) {
			// 传参
			const para = {
				mobile: this.props.phoneNumber
			}
			// 头部定义
			const headers = new Headers({
				'appKey': '1000',
				'sign': this._md(para),
				'Content-Type': 'application/json'
			});
			Request.post(this.props.navigation, api.sendVolidCode, JSON.stringify(para), headers)
				.then((res) => {
					if (res.ok) {
						this._shouldStartCountting(true);
						toastShort('验证码发送成功，请注意查收~');
					} else {
						toastShort(JSON.parse(res._bodyInit).message)
					}
				}).catch((err) => {
					toastShort(err);
				})
		} else {
			toastShort('请输入正确的手机号码~')
		}
	}
	// MD5加密
	_md(para) {
		const sign = 'appKey=1000&appSecret=8Vp9j3SBot9ZXj1Ef77jvRpbsUr5HCCo&body=' + JSON.stringify(para)
		let md = forge.md.md5.create();
		md.update(sign);
		const mdStr = md.digest().toHex();
		return mdStr
	}
	render() {
		let { onPress, style, codeStyle, avtiveCodestyle, title } = this.props;
		let { counting, timerTitle, selfEnable } = this.state;
		return (
			<TouchableOpacity style={style} onPress={this._requestsmscode}>
				<View>
					<Text style={(counting && !selfEnable) ? avtiveCodestyle : codeStyle}>{timerTitle}</Text>
				</View>
			</TouchableOpacity>
		)
	}
}

export default CountTime
