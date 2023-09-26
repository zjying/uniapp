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
		</view>
		<view
			class="chat-send"
			:style="heightStyle">
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
					avater: 'rel_1.png',
					content: '张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试',
					id: 1
				}, {
					name: '张三1',
					avater: 'rel_1.png',
					content: '张三测试333333',
					id: 2
				}],
				inputHeight: '',
				code: ''
			}
		},
		computed: {
			heightStyle() {
				const height = this.inputHeight ? `${this.inputHeight}px` : '10vh'
				return `bottom: ${height}`
			},
			getToken() {
				return uni.getStorageSync('token')
			}
		},
		mounted() {
			 wx.onKeyboardHeightChange(res => {
			   this.inputHeight = res.height
			 })
			 const _this = this
			 uni.login({ 
			 	"provider": "weixin",
			 	"onlyAuthorize": true, // 微信登录仅请求授权认证
			 	success: function(event){
					_this.code = event.code
					console.log('111')
			 		//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
			 		uni.request({
			 		    url: 'https://mying.vip/eps/login', //仅为示例，并非真实接口地址。
			 		    data: {
			 		        code: event.code
			 		    },
			 		    success: (res) => {
								console.log(res.data.data)
			 		        //获得token完成登录
								uni.setStorageSync('token',res.data.data.token)
			 		    },
							fail: (err) => {
								console.log('3331', err)
							}
			 		});
			 	},
			 	fail: function (err) {
					console.log('2222')
					// 登录授权失败  
					// err.code是错误码
				}
			})
			uni.authorize({
			    scope: 'scope.userInfo',
			    success: (res) => {
						console.log('authorize', res)
						uni.getUserInfo({
							provider: 'weixin',
							success: function (infoRes) {
								console.log('用户昵称为：' + infoRes.userInfo.nickName);
							}
						});
			    }
			})
		},
		methods: {
			sendClick() {
				if (!this.cont) return
				this.messageList.push({
					name: '张三2',
					avater: 'rel_1.png',
					content: this.cont,
					id: 3
				})
				this.cont = ''
			},
			confirmClick() {
				this.sendClick();
			},
			keyboardheightchange (event) {
				alert(1)
				alert(event.detail)
			}
		}
	}
</script>

<style lang="scss"  scoped>
.chat {
	box-sizing: border-box;
	height: 100vh;
	background: #fff;
	overflow: hidden;
	&-record {
		padding: 20px;
		height: 85vh;
		box-sizing: border-box;
		overflow-y: auto;
	}
	&-send {
		border-top: 1px solid #f2f2f2;
		padding: 15px 20px;
		box-sizing: border-box;
		position: fixed;
		width: 100%;
		bottom: 5vh;
		margin-bottom: 10px;
		background: #fff;
		.input-wrapper {
			position: relative;
			width: 100%;
			box-sizing: border-box;
			background: #f2f2f2;
			border-radius: 6px;
		}
		.sendicon {
			position: absolute;
			right: 10px;
			bottom: calc(50% - 14px);
		}
		.active {
			:deep(.uniui-paperplane-filled) {
				color: #0cb90c !important;
			}
		}
		:deep(input){
			line-height: 45px;
			border: 1px solid #f2f2f2;
			height: 45px;
			border-radius: 6px;
			width: 100%;
			display: inline-block;
			padding: 0 50px 0 10px;
			font-size: 14px;
			box-sizing: border-box;
			font-size: 16px;
		}
	}
	
}
</style>
