# 特点

`zzh_simple_router`一个借鉴axios任务编排机制实现的简单易用路由，可以实现类似axios一样的多级路由拦截，
前置拦截，后置拦截，使用和原生一样的api名称，减少记忆成本，参数传递不丢失数据类型且获取简单方便

## 快速上手

使用方式较简单
vue项目和h5项目可直接在main.js中在vue原型上挂载，或者页面直接引入使用

main.js
```
import createRouter from '@/uni_modules/zzh-simple-router/js_sdk/router/router.js'

const router = createRouter()
router.encode = 0 // 任意可转化为Boolen的值，是否编码query参数,有多层对象需要true，否则只会传第一层对象的值

// 全局路由拦截器
router.before((from, next) => {
	console.log(from);
	if (!uni.getStorageSync('token')) {
		uni.showModal({
			title: '温馨提示',
			content: '是否前去登录',
			success: function (res) {
				if (res.confirm) {
					next({ url: '/pages/login/index' })
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
		return
	}
	next()
})

router.after((to) => {
	console.log(to)
	return to
})

router.onError((err) => { // 跳转错误捕获
	console.log(err)
})


Vue.prototype.$mRouter = router

vue3 没有this 可以绑定在uni上uni.$mRouter = router
或者 app.config.globalProperties.$mRouter = /**.....*/
也可以将该部分放在单独文件，每个需要使用的页面单独引入

/**
 * @example  this.$mRouter.to('pages/**/**'),  this.$mRouter.back()
 */
```
nvue项目可以挂载到globalData
App.vue
```
import  router  from '@/router/router.js'
globalData: {
		$mRouter:router
	},
```
或者main.js中
```
import  router  from '@/router/router.js'
uni.$mRouter = router
```
uni.$mRouter.to('/pages/xxx')
### nvue使用方式  
```
getApp().globalData.$mRouter.navigateTo('pages/home/index')
或者页面直接引入
import  router  from '@/router/router.js'
router.to()
 ```
 
 ###刷新当前页
  调用可刷新当前页面,所有生命周期会全部执行
  ```
  this.$mRouter.reloadPage()
  ```
	
###页面使用方式1
 直接传路径，路由处理了pages前面的/，传不传都行
 ```
 this.$mRouter.navigateTo('pages/home/index')
 ```
###页面使用方式2
 直接传路径，路由处理了pages前面的/，传不传都行,query 方式和原生跳转一样，携带在参数上，本路由增强了传参方式，且不会丢失数据类型， 如果不在h5等会刷新页面的场合，可以使用更强大的params传参，params传参没有原生跳转tabbar不能传参的限制，支持任意方式，包括navigateBack，也可以携带参数返回上一个页面，query和参数可以同时使用，并且互不影响
 ```
 this.$mRouter.back({ delta: 1,params: {a:'携带我返回上一页'} }) 
 /*上一页可以 this.$mRouter.params()获取到我传递的值*/
 ```
 ###页面使用方式3
 ```
 this.$mRouter.navigateTo({
 	url: 'pages/second/second',
	query: {
      test:'我是query参数，会携带在链接上，刷新不会丢失'
	},
 	params: {
		test:'我是params参数，不会携带在链接上，刷新会丢失，但是支持任意方式传递，包括页面返回也可以携带，并且大小无限制，甚至可以传递一个函数指针'
 		a: 5,
 		b: {
 			c: 5
 		},
		testFun: ()=> {
			console.log('下个页面调用会执行')
		}
 	}
 },{/*这儿的参数和原生uni.navigateTo传递一样*/});
 ```
 #### 可以传递第三个参数，同原生一样的配置，{ animationType: 'pop-in',animationDuration:300 }
  ```
 this.$mRouter.navigateTo(
 	{
 		url: 'pages/login/forget',
 		query: {
 			a: 5,
 			b: {
 				c: 5
 			}
 		}
 	},
 	{ animationType: 'pop-in' }
 );
  ```
###获取传递的参数
在页面需要的地方使用即可获取传递的query和params参数
 ```
const p =  this.$mRouter.query
const p =  this.$mRouter.params
跳转的路由params传入什么参数这儿获取到的就是什么参数，并且数据类型不变，解决原生参数类型被转化为字符串的问题
 ```
 注意 params携带的所有参数页面完全刷新会丢失，调用路由的刷新当前页不会丢失
#### 路由方法
保持和官方的路由跳转名相同，减少记忆成本，跳转的限制通uni原生跳转一致
比如官方reLaunch跳转tabbar页不能带参数，这儿跳转不传参数即可
 ```
this.$mRouter.navigateTo('pages/home/index')
this.$mRouter.navigateTo({url:'pages/home/index',params:{a:5}})
this.$mRouter.navigateTo({url:'pages/home/index?a=5&b=6',query:{c:4,d:8},params:{p:5}})
// 支持链接拼接参数形式，同名参数query会覆盖链接上的值
//navigateTo 使用别名，to,push。。 可在源码UNI_NAV_ACTION 的alias数组里添加方便自己记忆的别名
this.$mRouter.to('pages/home/index')
this.$mRouter.push({url:'pages/home/index',params:{a:5}})

navigateTo 使用别名replace
this.$mRouter.redirectTo('pages/home/index')
this.$mRouter.replace('pages/home/index')
this.$mRouter.redirectTo({url:'pages/home/index',params:{a:5}})

this.$mRouter.reLaunch('pages/home/index')
this.$mRouter.reLaunch({url:'pages/home/index',params:{a:5}})

this.$mRouter.switchTab('pages/home/index')
this.$mRouter.switchTab({url:'pages/home/index',params:{a:5}})

this.$mRouter.navigateBack(1)
//使用别名，。。
this.$mRouter.back(1)

//携带参数并且返回上一页
this.$mRouter.back({delta: 1 ,params: {test:'我可以携带参数返回上一页哦'}})
this.$mRouter.back({url: '上一页的路径' ,params: {test:'我可以携带参数返回上一页哦'}})
 ```
#### 路由回调方法
##### 返回promise，对官方success和fail进行promise封装返回，另外也返回了更多的参数
 ```
this.$mRouter.navigateBack(1).then(res=>{
	
}).catch(err=>{})
 ```
## 拦截器
### 使用了类似于axios的拦截器，实现了前置拦截和相应后的拦截以更方便处理
### 跳转前可对参数拦截修改或者未登录权限跳转等业务功能 next方法支持传字符串，传字符串被认为是跳转的路径，传递对象和普通跳转一致
### 
 ```
import createRouter from '@/uni_modules/zzh-simple-router/js_sdk/router/router.js'

const router = createRouter()
router.encode = 0 // 任意可转化为Boolen的值，是否编码query参数,有多层对象需要true，否则只会传第一层对象的值

// 全局路由拦截器
router.before((from, next) => {
	console.log(from);
	if (!uni.getStorageSync('token')) {
		uni.showModal({
			title: '温馨提示',
			content: '是否前去登录',
			success: function (res) {
				if (res.confirm) {
					next({ url: '/pages/login/index' })
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
		return
	}
	next()
})

router.after((to) => {
	console.log(to)
	return to
})

router.onError((err) => { // 跳转错误捕获
	console.log(err)
})
 ```
