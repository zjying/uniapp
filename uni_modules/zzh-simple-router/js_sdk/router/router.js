import { Check, Base64, paramsToUrl, paramsToObj } from './util'
import InterceptorManager from './InterceptorManager.js'

// uni 方法
// 修复vue3打包后 uni['navigateTo']访问不到，所以需要直接保存函数引用
const UNI_NAV_ACTION = {
	navigateTo: {
		// 保留当前页面，跳转到应用内的某个页面，使用navigateBack可以返回到原页面。
		action: uni.navigateTo,
		alias: ['to', 'push']
	},
	redirectTo: {
		// 关闭当前页面，跳转到应用内的某个页面。 跳转到 tabBar 页面只能使用 switchTab 跳转
		action: uni.redirectTo,
		alias: ['replace']
	},
	reLaunch: {
		// 关闭所有页面，打开到应用内的某个页面。
		action: uni.reLaunch,
		alias: []
	},
	switchTab: {
		// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
		action: uni.switchTab,
		alias: []
	},
	navigateBack: {
		// 返回页面
		action: uni.navigateBack,
		alias: ['back']
	}
}

function _nav({
	type = 'navigateTo',
	url = '',
	delta = '',
	query = {},
	params = {},
	conf = {},
	encode
}) {
	let queryUrl
	if (encode * 1 === 1) {
		const queryStr = Base64.encode(JSON.stringify(query)) //encodeURIComponent(JSON.stringify(query))
		//跳转tab页不能携带参数，只能纯路径
		queryUrl = Check.isPlainObject(query) ? url :
			`${url}${url.includes('?') ? '&' : '?'}qryStr=${queryStr}`
	} else {
		//跳转tab页不能携带参数，只能纯路径
		queryUrl = Check.isPlainObject(query) ? url :
			`${url}${url.includes('?') ? '&' : '?'}encode=0&${paramsToUrl(query)}`
	}
	const arg = arguments[0]
	return new Promise((resolve, reject) => {
		let config = {
			...conf,
			success(res) {
				resolve({
					config: arg,
					...res
				})
			},
			fail(err) {
				resolve({
					config: arg,
					errCode: 400,
					...err
				})
			}
		}
		delta ? (config.delta = delta) : (config.url = queryUrl)
		UNI_NAV_ACTION[type]['action'](config)
	})
}

/**
 * @param {String} fullPath 全路径 pages/home/index
 * @param {String} relative 相对路径./index2 
 * @return {String} 根据全路径返回当前相对路径的完整路径 输入../index2  返回类似 /pages/home/index2 
 */
function getFullPath(relative, fullPath) {
	if (relative.startsWith('/')) return relative
	if (!relative.startsWith('.')) return '/' + relative

	const stack = fullPath.split('/'),
		parts = relative.split('/')
	stack.pop() // 移除当前项 (或者空字符)
	for (let i = 0; i < parts.length; i++) {
		if (parts[i] == '.')
			continue
		if (parts[i] == '..')
			stack.pop()
		else
			stack.push(parts[i])
	}
	return '/' + stack.join('/')
}


class Router {
	constructor(pages = []) {
		this.isLock = false
		this.isEncode = true
		this.pageParams = new Map()
		this.beforeInterceptor = new InterceptorManager()
		this.afterInterceptor = new InterceptorManager()
		this.errInterceptor = new InterceptorManager()
		this.before = (arg) => this.beforeInterceptor.use(arg)
		this.after = (arg) => this.afterInterceptor.use(arg)
		this.errMiddleware = (arg) => arg

		Object.keys(UNI_NAV_ACTION).forEach(method => {
			const func = (args, conf = {}) => {
				return this._push.apply(this, [args, conf, method])
			}
			Router.prototype[method] = func
			UNI_NAV_ACTION[method]['alias'].forEach(alia => {
				Router.prototype[alia] = func
			})
		})
	}

	_getCurrent(current = 1) {
		const routers = this.curPage()
		if (routers.length > 0) {
			return routers[
				routers.length - current < 0 ? 0 : routers.length - current
			]
		}
		throw new Error('未发现页面堆栈')
	}
	/**
	 * @param { Object|Number|Sting } user_conf 传url,query,params 路径和参数,query类似get，params类似post。刷新丢失
	 * @param {Object} uni_conf 额外配置，配置同uni原生跳转的其它参数
	 * @return {promise}
	 */
	_push(user_conf, uni_conf = {}, type) {
		if (this.isLock) return
		this.isLock = true
		let queryObj = {},
			paramsObj = {},
			url,
			name,
			deltaNums;
		switch (true) {
			case Check.isObject(user_conf):

				const {
					params = {}, query = {}, delta, encode = false
				} = user_conf
				this.isEncode = encode || this.isEncode
				name = user_conf.name
				if (!Check.isObject(params) || !Check.isObject(query)) {
					throw new Error('params数据必须是Object')
				}
				if (!delta) {
					url = user_conf.url
					queryObj = query
					paramsObj = params
				} else {
					let {
						route
					} = this._getCurrent(delta + 1)
					url = route
					deltaNums = delta
					paramsObj = params
				}

				break
			case Check.isString(user_conf):
				url = user_conf
				break
			case Check.isNumber(user_conf):
				let {
					route
				} = this._getCurrent(user_conf + 1)
				url = route
				deltaNums = user_conf || 1
				break
			default:
				throw new Error('参数必须是对象，字符串')
		}

		const { route: fromPath } = this._getCurrent()
		url = getFullPath(url, fromPath) //根据当前路径的全路径自动补全，将 ./或../或pages开头统一转为/pages/home
		const toPath = url.split('?')[0]

		const arg = {
			name,
			url,
			delta: deltaNums,
			toPath,
			type,
			fromPath,
			encode: this.isEncode ? '1' : '0',
			query: queryObj,
			params: paramsObj,
			conf: uni_conf
		}

		this.pageParams.set(toPath, paramsObj)

		let chain = [_nav, this.errMiddleware]
		let promise = Promise.resolve(arg)

		this.beforeInterceptor.reverseForEach(function unshiftRequestInterceptors(interceptor) {
			chain.unshift((arg) => {
				return new Promise((resolveOuter) => {
					new Promise((resolve) => {
						interceptor.fulfilled(arg, resolve)
					}).then(function(result) {
						if (typeof result === 'string') {
							arg.url = getFullPath(result, fromPath)
							arg.toPath = arg.url.split('?')[0]
						} else if (typeof result === 'object') {
							Object.keys(arg).forEach(key => {
								if (result[key]) {
									if (key === 'url') {
										arg.url = getFullPath(result.url, fromPath)
										arg.toPath = arg.url.split('?')[0]
									} else {
										arg[key] = result[key]
									}
								}
							})
						}
						resolveOuter(arg)
					})
				})
			})
		})

		this.afterInterceptor.forEach(function pushResponseInterceptors(interceptor) {
			chain.push(interceptor.fulfilled)
		})

		while (chain.length) {
			promise = promise.then(chain.shift())
		}
		this.isLock = false
		return promise
	}
	onError(fun) {
		if (fun && typeof fun !== 'function') throw new Error('传入必须为函数')
		this.errMiddleware = function(arg) {
			if (arg.errCode === 400) {
				fun(arg)
				return Promise.reject(arg)
			}
			return Promise.resolve(arg)
		}
	}

	get params() { // 获取params		
		let {
			route: curPath
		} = this._getCurrent()
		curPath = '/' + curPath
		return this.pageParams.get(curPath) || {}
	}

	set encode(val) {
		this.isEncode = !!val
	}

	curPage() {
		return getCurrentPages()
	}

	get query() {
		const routers = this.curPage()
		const currentRoute = routers[routers.length - 1]

		if (routers.length > 0) {
			// #ifdef VUE2
			const {
				options = {}
			} = currentRoute
			// #endif
			// #ifdef VUE3
			// #ifdef MP-WEIXIN
			const {
				options = {}
			} = currentRoute
			// #endif
			// #ifndef MP-WEIXIN
			const {
				$page = {}
			} = currentRoute
			const options = $page.options || {}
			// #endif
			// #endif
			const {
				qryStr = '{}',
					encode
			} = options
			if (encode === '0') {
				const newOptions = Object.assign({}, options)
				delete newOptions.encode
				delete newOptions.qryStr
				return paramsToObj(newOptions)
			} else {
				if (qryStr === '{}') {
					return options
				}
				try {
					const decodeParse = JSON.parse(Base64.decode(qryStr)) //JSON.parse(decodeURIComponent(qryStr))
					const newOptions = Object.assign({}, options)
					delete newOptions.qryStr
					return Object.assign({}, newOptions, decodeParse)
				} catch (e) {
					console.warn('queryStr使用JSON.parse解析错误，返回原值，注意数据类型解析')
					return options
					//TODO handle the exception
				}
			}
		}
		return {}
	}

	reloadPage(isTabBar = false) {
		let currPage = this._getCurrent() // curpage instance
		isTabBar = currPage?.$page?.meta?.isTabBar || isTabBar // 小程序路由信息中获取不到是否是tabbar需用户自动传入
		let path = currPage.route // pages/test/test
		if (!path) return
		let action = isTabBar ? 'reLaunch' : 'redirectTo'
		this[action]({
			url: path,
			query: this.query,
			params: this.params
		}, {
			animationType: 'fade-in',
			animationDuration: 200
		})
	}
}

let instance = null
export default function createRouter(arg) {
	if (instance) return instance
	instance = new Router(arg)
	instance.Router = Router
	instance.UNI_NAV_ACTION = UNI_NAV_ACTION

	return instance
}