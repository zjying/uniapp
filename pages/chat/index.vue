<template>
	<view class="chat">
		<view class="chat-record">
			<scroll-view class="scroll-view_H" scroll-y="true">
				<message
					v-for="item in messageList "
					:message="item" />
			</scroll-view>
			getToken-{{getToken}}
			code-{{code}}
			msg-{{msg}}
			nickName - {{ nickName }}
			avatarUrl- {{avatarUrl}}
		</view>
		<view
			class="chat-send"
			:style="heightStyle"
			v-show="!!nickName">
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
		<view class="" v-show="!nickName">
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
	</view>
</template>

<script>
	import message from './message.vue'

	export default {
		components:{
			message
		},
		data() {
			return {
				cont: '',
				messageList: [{
					name: '张三12345',
					avater: '../../static/rel_1.png',
					content: '张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试',
					self: 0,
					id: 1
				}, {
					name: '张三1',
					avater: '../../static/rel_1.png',
					content: '张三测试333333',
					self: 0,
					id: 2
				}],
				inputHeight: '',
				code: '',
				getToken: '1',
				msg: '',
				getUserInfo: {},
				avatarUrl: '',
				nickName: ''
			}
		},
		computed: {
			heightStyle() {
				const height = this.inputHeight ? `${this.inputHeight}px` : '10vh'
				return `bottom: ${height}`
			}
		},
		mounted() {
			const wxVersion = wx.getSystemInfoSync().version;
			console.log(wxVersion)
			 wx.onKeyboardHeightChange(res => {
			   this.inputHeight = res.height
			 })
			 // const _this = this
			 uni.login({
			 	"provider": "weixin",
			 	"onlyAuthorize": true, // 微信登录仅请求授权认证
			 	success: (event) => {
					this.code = event.code
					console.log('111')
			 		//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
			 		uni.request({
			 		    url: 'https://mying.vip/eps/login', //仅为示例，并非真实接口地址。
			 		    data: {
			 		        code: event.code
			 		    },
			 		    success: (res) => {
								this.getToken = res.data.data.token
			 		        //获得token完成登录
								uni.setStorageSync('token',res.data.data.token)
			 		    },
							fail: (err) => {
								this.msg = `1${JSON.stringify(err)}`
								console.log('3331', err)
							}
			 		});
			 	},
			 	fail: function (err) {
					this.msg = `2${err}`
					// 登录授权失败  
					// err.code是错误码
				}
			})
		},
		methods: {
			sendClick() {
				if (!this.cont) return
				this.messageList.push({
					name: this.nickName,
					avater: this.avatarUrl,
					content: this.cont,
					self: 1,
					id: 3
				})
				this.cont = ''
			},
			confirmClick() {
				this.sendClick();
			},
			joinPopup() {
				this.$refs.popup.open()
			},
			chooseAvatar(e) {
				const { avatarUrl } = e.detail
				this.avatarUrl = avatarUrl
			},
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
			}
		}
	}
</script>

<style lang="scss"  scoped>
	@import "index.scss";
</style>
