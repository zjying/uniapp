## 1.6.1（2023-06-04）
修改拦截器一些问题
## 1.6.0（2023-06-03）
修复上个版本拦截器某些特殊情况下会导致可能的bug
## 1.5.9（2023-06-03）
优化拦截器使用方式，增加next方便做弹窗处理，query和params参数获取方式优化，将原来方法改为对象,
## 1.5.8（2022-11-22）
优化参数编码方式
## 1.5.7（2022-11-21）
修复vue3打包后跳转无效，修改query编码方式减少url长度
## 1.5.6（2022-11-15）
更新使用文档和示例代码
## 1.5.5（2022-11-11）
加锁避免快速点击跳转多次
## 1.5.4（2022-11-11）
新增刷新当前页面方法reloadPage
## 1.5.2（2022-11-06）
修改引入方式，增加错误拦截器
## 1.5.1（2022-11-06）
- 修改引入方式，增加错误拦截器
- 
## 1.5.1（2022-08-04）
- 兼容url拼接参数，可完全兼容官方路由，路由获取的query参数会合并url参数，但是url传参会丢失数据类型

## 1.5（2022-07-24）
- 修复vue3获取不到参数的bug，参数命名更加规范，传参分为query参数和params参数，params 参数支持任意官方的跳转方式传参并且无入侵代码，兼容性强

## 1.4（2022-03-18）
- 修改query参数导出方式，query包含在router对象中，修改使用说明

## 1.3（2022-03-17）
- 简化拦截器调用方式 router.before((from) => { console.log(from); console.log('l am inter 2222 -----------------') // from.path = "pages/login/forget" return from }) router.after((to) => { return to })

## 1.2（2022-03-07）
- 简化路由拦截器调用，修复参数获取

## 1.1（2021-12-24）
- 修改query()获取参数方法，可以解析自己在链接上拼接的参数，比如其它APP打开uni APP所携带的参数，但是会丢失数据类型