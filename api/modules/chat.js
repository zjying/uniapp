import axios from '../axios'


// 群发助手权限接口
export const getGroupMsgSwitch = (params) => {
  return axios.get('/api/sdb/crm/wechat-social/group/msg/switch', { params })
}