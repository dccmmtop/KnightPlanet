// 模态框
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Modal, Text, TouchableHighlight, View } from 'react-native';

type Props = {
	visible: boolean // 模态框是否可见
}
class Modal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false
		};
	}
	setModalVisible(value) {
		this.setState({
			modalVisible: value
		})
	}

	render() {
		let { visible } = this.props;
		return (
			<Modal
				animationType={"slide"}
				transparent={false}
				visible={visible}
				onRequestClose={() => { alert("Modal has been closed.") }}
			>
				<View style={{ marginTop: 22 }}>
					<View>
						<Text>Hello World!</Text>

						<TouchableHighlight onPress={() => {
							this.setModalVisible(!this.state.modalVisible)
						}}>
							<Text>Hide Modal</Text>
						</TouchableHighlight>

					</View>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	titile: {

	},
	container: {

	},
	btnBox: {

	}
})

export default Modal