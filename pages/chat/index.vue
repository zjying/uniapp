<template>
	<view class="chat" v-show="userId">
		<view class="chat-record" id="record">
			<scroll-view class="scroll-view_H" :scroll-top="scrollTop"  scroll-y="true" @scroll="scroll">
				<message
					v-for="item in messageList "
					:message="item" />
			</scroll-view>
		</view>
		<view
			class="chat-send"
			:style="heightStyle"
			v-show="!!avatarUrl">
			<view class="input-wrapper">
				<input
					v-model="cont"
					class="uni-input"
					confirm-type="send"
					:adjust-position="false"
					placeholder="请输入..."
				  @confirm="confirmClick"/>
					<uni-icons :class="['sendicon', cont.length ? 'active' : '']" type="paperplane-filled" size="28" @click="sendClick"></uni-icons> 
			</view>
		</view>
		<view class="" v-show="!avatarUrl">
			<button class="button" type="primary" @click="joinPopup">
				<text class="button-text">加入</text>
			</button>
		</view>
		<uni-popup ref="popup" type="bottom">
			<div class="popup">
				 <form @submit="formsubmit" ref="formdata">
					 <button
						class="popup-avatar"
						open-type="chooseAvatar"
						@chooseavatar="chooseAvatar">
					   <image class="popup-avatar-img" :src="avatarUrl" mode="aspectFit"></image>
					 </button> 
					<input
						type="nickname"
						placeholder="请输入昵称"
						name="nickName"
						class="popup-nickname"
						:value="nickName"/>
					<button
						class="popup-submit"
						form-type="submit"
						type="primary"
						size="mini">确认并加入</button>
				</form>
			</div>
		</uni-popup>
		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog
					type="error"
					cancelText="不要"
					confirmText="要"
					title="通知"
					content="断开了，要重连么～"
					@confirm="dialogConfirm"
					@close="dialogClose">
				</uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import message from './message'
import UniappWebSocket from './socket.js';
import configs from '@/configs/index.js';

	export default {
		components:{
			message
		},
		data() {
			return {
				cont: '',
				messageList: [],
				inputHeight: '',
				msg: '',
				token: '1',
				avatarUrl: '',
				userId: '',
				nickName: '',
				ws: null,
				scrollTop: 0,
				oldScrollTop: 0,
				wsStatus: false
			}
		},
		computed: {
			heightStyle() {
				const height = this.inputHeight ? `${this.inputHeight}px` : '3vh'
				return `bottom: ${height}`
			}
		},
		mounted() {
			console.log(configs)
			// 点击输入时，控制输入框高度
			 wx.onKeyboardHeightChange(res => {
			   this.inputHeight = res.height
			 })
			 // 微信登录获取token
			 uni.login({
			 	"provider": "weixin",
			 	"onlyAuthorize": true, // 微信登录仅请求授权认证
			 	success: (event) => {
			 		//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
			 		uni.request({
			 		    url: `${configs.api_location}/login`, //仅为示例，并非真实接口地址。
			 		    data: {
			 		        code: event.code
			 		    },
			 		    success: (res) => {
								if (!res.data || !res.data.data || !res.data.data.token) {
									uni.showToast({
										title: "登录失败",
										icon: "error",
										duration: 2000
									})
									return
								}
								this.token = res.data.data.token
								this.avatarUrl = res.data.data.photoPath || ''
								this.userId = res.data.data.id
								this.nickName = res.data.data.name || ''
			 		        //获得token完成登录
								uni.setStorageSync('token',res.data.data.token)
								uni.setStorageSync('userId',res.data.data.id)

								this.initWs()
			 		    },
							fail: (err) => {
								this.msg = `serve-login：${JSON.stringify(err)}`
							}
			 		});
			 	},
			 	fail: function (err) {
					// 登录授权失败
					this.msg = `wx-login：${err}`
				}
			})
			this.getHistory()
		},
		methods: {
			getHistory() {
				//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
				uni.request({
						url: `${configs.api_location}/chat/history`, //仅为示例，并非真实接口地址。
						method: 'POST',
						data: {
								roomId: 123
						},
						success: (res) => {
							this.messageList = res.data.data
							setTimeout(() => {
								this.goTop()
							}, 0)
						},
						fail: (err) => {
							this.msg = `history：${JSON.stringify(err)}`
						}
				});
			},
			initWs() {
				// 使用示例
				this.ws = new UniappWebSocket(`${configs.ws_location}/ws?room=123&id=${this.userId}`);
				
				this.ws.on('open', () => {
				  console.log('WebSocket连接已打开');
				});
				
				this.ws.on('message', (jsonData) => {
				  console.log('收到消息:', jsonData);
					const { data, event} = JSON.parse(jsonData)
					if (event === 'prompt') {
						uni.showToast({
							title: data.content,
							icon: "success",
							duration: 2000
						})
						this.wsStatus = true
					} else if(event === 'sendMessage') {
						this.messageList.push(data)
						this.goTop()
					}
				});
				this.ws.on('close', (error) => {
				  console.log('发生错误:', error);
					this.wsStatus = false
					this.$refs.alertDialog.open()
					// uni.showToast({
					// 	title: "断开了",
					// 	icon: "error",
					// 	duration: 3000
					// })
				});
				this.ws.on('error', (error) => {
				  console.log('发生错误:', error);
					this.wsStatus = false
				});
			},
			sendClick() {
				if (!this.cont) return
				if (!this.wsStatus) {
					this.$refs.alertDialog.open()
					return
				}
				this.ws.sendMessage({
					roomId: 123,
					senderId: this.userId,
					content: this.cont
				})
				this.cont = ''
			},
			// 输入法的确认发送
			confirmClick() {
				this.sendClick();
			},
			// 首次进入，系统无昵称头像时，进行获取
			joinPopup() {
				this.$refs.popup.open()
			},
			// 选择头像
			chooseAvatar(e) {
				const { avatarUrl } = e.detail
				this.avatarUrl = avatarUrl
			},
			// 获取昵称
			formsubmit(e) {
				this.nickName = e.detail.value.nickName
				if (!this.nickName || !this.avatarUrl) {
					uni.showToast({
					 title: "请填信息",
					 icon: "error",
					 duration: 2000
				 })
					return
				}
				// 上传头像
				this.uploadAvatar()
				// 上传昵称
				// 测试
				uni.showToast({
					 title: this.nickName,
					 icon: "success",
					 duration: 2000
				 })
				console.log({
					avatarUrl: this.avatarUrl,
					nickName: this.nickName
				})
				this.$refs.popup.close()
			},
			toNext() {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},
			uploadAvatar() {
				uni.uploadFile({
					url: `${configs.api_location}/upload`,
					filePath: this.avatarUrl,
					name: 'file',
					header: {
						token: this.token,
					},
					formData: {
						userId: this.userId,
						nickname: this.nickName
					},
					success: (uploadRes) => {
						console.log('上传成功', uploadRes);
						// 在这里处理上传成功后的操作
					},
					fail: (error) => {
						console.error('上传失败', error);
						// 在这里处理上传失败后的操作
					}
				});
			},
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},
			goTop(e) {
				// 解决view层不同步的问题
				this.scrollTop = this.oldScrollTop
				this.$nextTick(()=> {
					this.scrollTop = 10000
				})
			},
			onUnload() {
				console.log('111beforeDestroy')
				this.ws.close();
			},
			dialogConfirm() {
				this.$refs.alertDialog.close()
				this.initWs()
			},
			dialogClose() {
				this.$refs.alertDialog.close()
			}
		}
	}
</script>

<style lang="scss"  scoped>
	@import "index.scss";
</style>
