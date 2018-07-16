import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewPropTypes, StatusBar } from 'react-native'
import color from '../../widget/color'
import screen from '../../common/screen'

type Props = {
	navigation: any,
	title: string,
	subtitle: string,
	iconImg: string,
	iconStyle: ViewPropTypes.style,
	onPress: Function
}

class DetailCell extends PureComponent<Props> {
	render() {
		return (
			<View>
				{this.props.index != 0 ? <View style={styles.line} /> : null}
				<TouchableOpacity style={[styles.container, {marginTop: this.props.index !=0 ? 10 : 0}]} onPress={this.props.onPress}>
					<View style={styles.content}>
						<Text style={styles.title}>{this.props.title}</Text>
						<Image style={[styles.arrow, this.props.iconStyle]} source={this.props.iconImg} />
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		justifyContent: 'center',
		height: 70,
		backgroundColor: '#ffffff',
		paddingLeft: 30,
		paddingRight: 30
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	title: {
		fontSize: 16,
		color: color.importantFont
	},
	arrow: {
		position: 'absolute',
		right: 0
	},
	line: {
		width: screen.width,
		height: screen.onePixel,
		backgroundColor: color.border,
	}
})

export default DetailCell
