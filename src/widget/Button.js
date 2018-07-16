// Botton 封装

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native'

type Props = {
    onPress: Function, // 点击事件
    disabled: boolean, // 是否可点
    style: ViewPropTypes.style, // 按钮样式
    title: string, // 按钮上的文字
    imgSrc: string, // 按钮上的图片
    titleStyle: ViewPropTypes.style, // 文字样式
    iconStyle: ViewPropTypes.style, // 图片样式
    activeOpacity: number,
    opacity: number, // 按钮透明度
    needPrevent: boolean // 是否需要防重复提交
}

class Button extends PureComponent<Props> {

    static defaultProps = {
        onPress: () => {},
        activeOpacity: .8,
        needPrevent: false
    }
    constructor(props) {
        super(props)
        this.state = {
            disabled: props.disabled
        }
        this._preventClick = this._preventClick.bind(this);
    }
    componentWillReceiveProps(newProps) {
        if(newProps.disabled != this.state.disabled) {
            this.setState({
                disabled: newProps.disabled
            })
        }
    }
    // 防止按钮重复提交(3秒内不可重复提交)
    _preventClick() {
        this.props.onPress();
        if(!this.props.disabled) {
            this.setState({
                disabled: true
            })
            setTimeout(() => {
                this.setState({
                    disabled: false
                })
            }, 3000)
        }

    }
    render() {
        let {onPress, style, iconStyle, titleStyle, title, imgSrc, activeOpacity, opacity, needPrevent} = this.props
        let {disabled} = this.state
        return (
            <View opacity={opacity} style={[styles.container, style]}>
                <TouchableOpacity
                    style={[styles.container, {flex: 1}]}
                    onPress={needPrevent ? this._preventClick : onPress}
                    disabled={disabled}
                    activeOpacity={activeOpacity}
                >
                    <Image
                        source={imgSrc}
                        style={iconStyle}
                    />
                    <Text style={titleStyle}>
                        {title}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
})


export default Button