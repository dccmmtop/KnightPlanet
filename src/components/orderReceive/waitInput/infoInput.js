// 信息录入
import React, {PureComponent} from 'react'
import {
  View,
	Text,
	TextInput,
  StyleSheet,
  Image,
	TouchableOpacity,
	DeviceEventEmitter,
	ScrollView
} from 'react-native'
import{
	Flex,
	Toast
} from 'antd-mobile'
import Modal from "react-native-modal";
// import ImagePicker from 'react-native-image-crop-picker';
import api from '../../../api';
import Request from '../../../common/request';
import commonStyles from '../../../commonStyle'
import Button from '../../../widget/Button'

const phoneVolid = /^1\d{10}$/; // 验证手机号为1开头的11位数
export default class InfoInput extends PureComponent {
	static navigationOptions = (navigation) => ({
    title: '录入收货信息'
  })
  constructor(props) {
		super(props)
		this.state = {
			isModalVisible: false,
			searchLists: [],
			orderId: props.navigation.state.params.orderId, // 订单id
			mobile: '', // 电话
			name: '', // 姓名
			district: '', // 地区编码 adcode
			street: '', // 地区名字
			lat: '',
			lng: '',
			house: '' // 门牌号
		}
		this._save = this._save.bind(this);
	}
	componentDidMount() {
		DeviceEventEmitter.addListener('infoInput', (address) => {
			this.setState({
				district: address.adCode, // 地区编码 adcode
				street: `${address.adName}${address.snippet}`, // 地区名字
				lat: address.latLonPoint.latitude,
				lng: address.latLonPoint.longitude
			})
		})
	}
	_toggleModal = () =>
	this.setState({ isModalVisible: !this.state.isModalVisible });
	
	//保存
	_save() {
		if(!phoneVolid.test(this.state.mobile)) {
			Toast.info('输入的手机号码不正确~', 1.5);
		} else if(this.state.district == '' || this.state.street == '') {
			Toast.info('地区信息不完整，请重新选择~', 1.5);
		} else {
			this._toggleModal();
		}
	}
	// 确认保存
	async _confirmSave() {
		const para = {
			expressOrderCreateAddr: {
				"mobile": this.state.mobile, // 电话
				"name": this.state.name || '姓名未填', // 姓名
				"district": this.state.district, // 地区编码 adcode
				"street": this.state.street, // 地区名字
				"lat": this.state.lat,
				"lng": this.state.lng,
				"house": this.state.house || '（门牌未填）' // 门牌号
			}
		}
		let data = await Request.post(this.props.navigation, `${api.saveInputinfo}${this.state.orderId}/delivery/info`, JSON.stringify(para));
		data = JSON.parse(data._bodyInit);
		if(data) {
			this._toggleModal();
			if(data.result) {
				Toast.info('录入信息成功~', 1.5);
				setTimeout(() => {
					this.props.navigation.goBack();
					DeviceEventEmitter.emit('waitPickup');
					DeviceEventEmitter.emit('waitInput');
					DeviceEventEmitter.emit('orderReceive');
				}, 1000)
			} else {
				Toast.info(data.message, 1.5)
			}
		}
	}
	// 输入电话号码搜索历史信息
	_changeMobile(text) {
		if(!phoneVolid.test(text)) {
			this.setState({
				mobile: text,
				searchLists: []
			})
		} else {
			this.setState({
				mobile: text
			}, () => {
				this._passsbySearch(text);
			})
		}
	}
	// 历史信息搜索
	async _passsbySearch(text) {
		const para = {
			destMobile: text
		}
		let data = await Request.get(this.props.navigation, api.getDest, para);
		data = JSON.parse(data._bodyInit).results;
		this.setState({
			searchLists: data
		})
	}
	_chooseLists(item) {
		this.setState({
			searchLists: [],
			mobile: item.destMobile,
			name: item.destName,
			district: item.district, // 地区编码 adcode
			street: item.street, // 地区名字
			lat: item.lat,
			lng: item.lng,
			house: item.house
		})
	}
	// 选择图片
	// _imagePick() {
	// 	ImagePicker.openCamera({
	// 		width: 500,
	// 		height: 500,
	// 		cropping: true,
	// 		compressImageMaxWidth: 400,
	// 		compressImageMaxHeight: 400,
	// 		compressImageQuality: 1,
	// 		enableRotationGesture: true
	// 	}).then(image => {
	// 		console.log(image);
	// 	});
	// }
	render() {
		// console.log(this.state)
		const { isModalVisible, name, street, house, searchLists } = this.state;
		const lists = this.state.searchLists.length ? this.state.searchLists.map((item, index) => {
			return(
				<Flex style={[styles.addr_line, index == 0 ? null : commonStyles.border_top]}>
					<TouchableOpacity onPress={() => this._chooseLists(item)} style={{marginRight: 30}}>
						<Flex direction='column' align='start' justify='center'>
							<Flex style={{marginRight: 30}}>
								<Text style={[commonStyles.p4, {marginRight: 20}]}>{item.destMobile}</Text>
								<Text style={commonStyles.font14}>{item.destName}</Text>
							</Flex>
							<Text numberOfLines={2} style={[commonStyles.font13, {lineHeight: 22.5}]}>{item.street}{item.house}</Text>
						</Flex>
					</TouchableOpacity>
				</Flex>
			)
		}) : null
		return(
			<View style={commonStyles.wrapper}>
				{/* {<Flex justify='center'>
					<TouchableOpacity onPress={this._imagePick}>
						<Flex justify='center' style={styles.phone_box}>
							<Image
								source={require('../../../img/camera.png')}
								style={{width: 15, height: 12, resizeMode: 'contain', marginRight: 5}}
							/>
							<Text style={commonStyles.font20}>智能能录入收货人信息</Text>
						</Flex>
					</TouchableOpacity>
				</Flex>} */}
				<View style={commonStyles.container2}>
					<Flex align='start' style={{width: '100%'}}>
						<Image
							source={require('../../../img/ic_shou.png')}
							style={{width: 25, height: 25, resizeMode: 'contain', marginRight: 15, marginTop: 47.5}}
						/>
						<Flex direction='column' style={{flex: 1}}>
							<Flex style={styles.line}>
								<Flex style={{width: 65}}>
									<Text style={commonStyles.font13}>电话：</Text>
								</Flex>
								<Flex style={{flex: 1}}>
									<TextInput
										style={styles.textinput}
										maxLength={11}
										keyboardType='numeric'
										placeholder='收件人手机号码'
										placeholderTextColor='#c0c0c0'
										underlineColorAndroid='transparent'
										onChangeText={(text) => this._changeMobile(text)}
									/>
								</Flex>
							</Flex>
							<Flex style={[styles.line, commonStyles.border_top]}>
								<Flex style={{width: 65}}>
									<Text style={commonStyles.font13}>姓名：</Text>
								</Flex>
								<Flex style={{flex: 1}}>
									<TextInput
										style={styles.textinput}
										maxLength={11}
										keyboardType='numeric'
										placeholder='收件人姓名(选填)'
										placeholderTextColor='#c0c0c0'
										underlineColorAndroid='transparent'
										value={name}
										onChangeText={(text) => this.setState({ name: text })}
									/>
								</Flex>
							</Flex>
							<Flex style={[styles.line, commonStyles.border_top]}>
								<Flex style={{width: 65}}>
									<Text style={commonStyles.font13}>地区：</Text>
								</Flex>
								<TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('AddChoose')}>
									<Flex justify='between' style={{flex: 1}}>
										{street != '' ? 
											<Text numberOfLines={2} style={{fontSize: 17, color: '#121212'}}>{street}</Text> 
											: 
											<Flex>
												<Image
													source={require('../../../img/ic_location.png')}
													style={{width: 13, height: 17, resizeMode: 'contain', marginRight: 10}}
												/>
												<Text style={{fontSize: 17, color: '#c0c0c0'}}>点击选择</Text>
											</Flex>
										}
										<Image
											source={require('../../../img/arr_right.png')}
											style={{width: 8, height: 11.5, resizeMode: 'contain'}}
										/>
									</Flex>
								</TouchableOpacity>
							</Flex>
							<Flex style={[styles.line, commonStyles.border_top]}>
								<Flex style={{width: 65}}>
									<Text style={commonStyles.font13}>门牌号：</Text>
								</Flex>
								<Flex style={{flex: 1}}>
									<TextInput
										style={styles.textinput}
										maxLength={11}
										keyboardType='numeric'
										placeholder='例：16号楼427室(选填)'
										placeholderTextColor='#c0c0c0'
										underlineColorAndroid='transparent'
										value={house}
										onChangeText={(text) => this.setState({ house: text })}
									/>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</View>
				<Button
					disabled={false}
					style={[commonStyles.primaryBtn1, styles.save_btn]}
					titleStyle={commonStyles.pbton} 
					title='保存'
					onPress={this._save}
					opacity={1}
				/>
				<Flex style={{flex: 1}}>
					<Modal isVisible={isModalVisible}>
						<Flex direction='column' style={{backgroundColor: '#fff'}}>
						<Flex justify='center' style={commonStyles.info_title}>
							<Text style={commonStyles.title_txt}>收货人信息</Text>
						</Flex>
						<Flex justify='center' style={{marginBottom: 35, marginHorizontal: 15}}>
							<Text style={commonStyles.contain_txt1}>提交保存前，请确认“收货人信息”录入是否正确！</Text>
						</Flex>
						<Flex justify='between' style={[{width: '100%'}, commonStyles.border_top]}>
							<TouchableOpacity style={{flex: 1}} onPress={this._toggleModal}>
							<Flex justify='center'>
								<Text style={commonStyles.cancel_txt}>返回修改</Text>
							</Flex>
							</TouchableOpacity>
							<View style={commonStyles.btn_line}></View>
							<TouchableOpacity style={{flex: 1}} onPress={this._confirmSave.bind(this)}>
							<Flex justify='center'>
								<Text style={commonStyles.confirm_txt}>确定保存</Text>
							</Flex>
							</TouchableOpacity>
						</Flex>
						</Flex>
					</Modal>
				</Flex>
				{searchLists.length ? 
					<View style={[commonStyles.container2, styles.search_box]}>
						<TouchableOpacity style={{position: 'absolute', top: 10, right: 10}} onPress={() => this.setState({searchLists: []})}>
							<Image
								source={require('../../../img/close.png')}
								style={styles.close_btn}
							/>
						</TouchableOpacity>
						<ScrollView style={{height: 350}}>
							{lists}
						</ScrollView>
					</View> : null
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
  phone_box: {
		width: 150,
		height: 35,
		borderWidth: 1,
		borderColor: '#ff8300',
		borderRadius: 2,
		marginVertical: 15
	},
	line: {
		height: 60
	},
  textinput: {
    flex: 1,
    fontSize: 17,
    color: '#121212',
    padding: 0, // 去掉安卓上面默认padding
	},
	save_btn: {
		marginHorizontal: 15,
		marginTop: 30
	},
	search_box: {
		position: 'absolute',
		top: 60,
		left: 55,
		width: 290,
		borderColor: '#e5e5e5',
		borderWidth: 1
	},
	addr_line: {
    paddingVertical: 20,
	},
	close_btn: {
		width: 14,
		height: 14,
		resizeMode: 'contain'
	}
})