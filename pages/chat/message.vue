<!--
 * @Author: zhangjinying
 * @Date: 2023-09-22 11:09:58
 * @LastEditors: zhangjinying
 * @LastEditTime: 2023-10-18 15:44:30
 * @Description: 
-->
<template>
	<view :class="['message', +message.senderId === +userId ? 'messagerevise' : '']">
		<image class="message-header" :src="message.photoPath"></image>
		<view class="message-content">
			<view class="message-content-name">{{ message.nickname }}({{ message.timestamp.replace(/.\d{3}Z/, '').replace('T0', ' ')}})</view>
			<text class="message-content-cont">{{ message.content }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			message: {
				type: Object,
				default: {}
			},
		},
		computed: {
			userId() {
				return uni.getStorageSync('userId') || ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		margin-bottom: 20px;
		&-header {
			width: 45px;
			height: 45px;
		}
		&-content {
			margin: 0 10px;
			height: auto;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			align-self: start;
			
			&-name {
				line-height: 26px;
				color: #999;
				width: auto;
				max-width: 300px;
				margin-bottom: 5px;
			}
			&-cont {
				width: auto;
				max-width: 300px;
				background: #f2f2f2;
				padding: 10px;
				border-radius: 6px;
				word-wrap: break-word;
				word-break: break-all;
			}
			
		}
	}
	.messagerevise{
		flex-direction: row-reverse;
		.message-content{
			align-items: flex-end;
			text-align: right;
			&-cont {
				text-align: left;
			}
		}
	}
</style>