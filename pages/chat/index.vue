<template>
	<view class="chat">
		<view class="chat-record">
			<scroll-view class="scroll-view_H" scroll-y="true">
				<message
					v-for="item in messageList "
					:message="item" />
			</scroll-view>
		</view>
		<view class="chat-send">
			<uni-easyinput
				:class="context ? 'cansend' : ''"
				focus
				v-model="context"
				placeholder="请输入内容"
				suffixIcon="paperplane-filled"
				@iconClick="sendClick">
			</uni-easyinput>
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
				context: '',
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
				}]
			}
		},
		mounted() {
			wx.login({
			  success (res) {
					console.log(res)
			    if (res.code) {
						console.log(res.code)
			      //发起网络请求
			      // wx.request({
			      //   url: 'https://example.com/onLogin',
			      //   data: {
			      //     code: res.code
			      //   }
			      // })
			    } else {
			      console.log('登录失败！' + res.errMsg)
			    }
			  }
			})
		},
		methods: {
			sendClick() {
				this.messageList.push({
					name: '张三2',
					avater: 'rel_1.png',
					content: this.context,
					id: 3
				})
				this.context = ''
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
	}
	&-send {
		height: 15vh;
		border-top: 1px solid #f2f2f2;
		padding: 15px 20px;
		box-sizing: border-box;
	}
	.cansend {
		:deep(.content-clear-icon) {
			color: #0cb90c !important;
		}
	}
}
</style>
