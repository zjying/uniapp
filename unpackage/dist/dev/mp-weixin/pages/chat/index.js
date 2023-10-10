"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_chat_socket = require("./socket.js");
const message = () => "./message.js";
const _sfc_main = {
  components: {
    message
  },
  data() {
    return {
      cont: "",
      messageList: [{
        name: "张三12345",
        avater: "../../static/rel_1.png",
        content: "张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试",
        self: 0,
        id: 1
      }, {
        name: "张三1",
        avater: "../../static/rel_1.png",
        content: "张三测试333333",
        self: 0,
        id: 2
      }],
      inputHeight: "",
      msg: "",
      token: "1",
      avatarUrl: "",
      userId: "",
      nickName: "",
      ws: null
    };
  },
  computed: {
    heightStyle() {
      const height = this.inputHeight ? `${this.inputHeight}px` : "10vh";
      return `bottom: ${height}`;
    }
  },
  mounted() {
    common_vendor.wx$1.onKeyboardHeightChange((res) => {
      this.inputHeight = res.height;
    });
    common_vendor.index.login({
      "provider": "weixin",
      "onlyAuthorize": true,
      // 微信登录仅请求授权认证
      success: (event) => {
        common_vendor.index.request({
          url: "https://mying.vip/eps/login",
          //仅为示例，并非真实接口地址。
          data: {
            code: event.code
          },
          success: (res) => {
            this.token = res.data.data.token;
            this.avatarUrl = res.data.data.avatarUrl || "";
            this.userId = res.data.data.id;
            common_vendor.index.setStorageSync("token", res.data.data.token);
            common_vendor.index.setStorageSync("userId", res.data.data.id);
          },
          fail: (err) => {
            this.msg = `serve-login：${JSON.stringify(err)}`;
          }
        });
      },
      fail: function(err) {
        this.msg = `wx-login：${err}`;
      }
    });
    this.getHistory();
    this.initWs();
  },
  methods: {
    getHistory() {
      common_vendor.index.request({
        url: "https://mying.vip/eps/chat/history",
        //仅为示例，并非真实接口地址。
        method: "POST",
        data: {
          roomId: 123
        },
        success: (res) => {
          this.messageList = res.data.data;
        },
        fail: (err) => {
          this.msg = `history：${JSON.stringify(err)}`;
        }
      });
    },
    initWs() {
      this.ws = new pages_chat_socket.UniappWebSocket(`ws://mying.vip/eps/ws?room=123`);
      this.ws.on("open", () => {
        console.log("WebSocket连接已打开");
      });
      this.ws.on("message", (data) => {
        console.log("收到消息:", data);
        this.messageList.push({
          name: this.nickName,
          avater: this.avatarUrl,
          content: data,
          self: 1,
          id: 1
        });
      });
      this.ws.on("error", (error) => {
        console.log("发生错误:", error);
      });
    },
    sendClick() {
      if (!this.cont)
        return;
      this.ws.sendMessage({
        roomId: 123,
        senderId: 1,
        content: this.cont
      });
      this.cont = "";
    },
    // 输入法的确认发送
    confirmClick() {
      this.sendClick();
    },
    // 首次进入，系统无昵称头像时，进行获取
    joinPopup() {
      this.$refs.popup.open();
    },
    // 选择头像
    chooseAvatar(e) {
      const { avatarUrl } = e.detail;
      this.avatarUrl = avatarUrl;
    },
    // 获取昵称
    formsubmit(e) {
      this.nickName = e.detail.value.nickName;
      if (!this.nickName || !this.avatarUrl) {
        common_vendor.index.showToast({
          title: "请填信息",
          icon: "error",
          duration: 2e3
        });
        return;
      }
      this.uploadAvatar();
      common_vendor.index.showToast({
        title: this.nickName,
        icon: "success",
        duration: 2e3
      });
      console.log({
        avatarUrl: this.avatarUrl,
        nickName: this.nickName
      });
      this.$refs.popup.close();
    },
    toNext() {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    },
    uploadAvatar() {
      common_vendor.index.uploadFile({
        url: "https://mying.vip/eps/upload",
        filePath: this.avatarUrl,
        name: "file",
        formData: {
          token: this.token,
          userId: this.userId
        },
        success: (uploadRes) => {
          console.log("上传成功", uploadRes);
        },
        fail: (error) => {
          console.error("上传失败", error);
        }
      });
    },
    onUnload() {
      console.log("111beforeDestroy");
      this.ws.close();
    }
  }
};
if (!Array) {
  const _component_message = common_vendor.resolveComponent("message");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_message + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.messageList, (item, k0, i0) => {
      return {
        a: "5a559478-0-" + i0,
        b: common_vendor.p({
          message: item
        })
      };
    }),
    b: common_vendor.t($data.token),
    c: common_vendor.t($data.msg),
    d: common_vendor.t($data.nickName),
    e: common_vendor.t($data.avatarUrl),
    f: common_vendor.o((...args) => $options.confirmClick && $options.confirmClick(...args)),
    g: $data.cont,
    h: common_vendor.o(($event) => $data.cont = $event.detail.value),
    i: common_vendor.n($data.cont.length ? "active" : ""),
    j: common_vendor.o($options.sendClick),
    k: common_vendor.p({
      type: "paperplane-filled",
      size: "28"
    }),
    l: common_vendor.s($options.heightStyle),
    m: !!$data.nickName,
    n: common_vendor.o((...args) => $options.joinPopup && $options.joinPopup(...args)),
    o: !$data.nickName,
    p: $data.avatarUrl,
    q: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    r: $data.nickName,
    s: common_vendor.o((...args) => $options.formsubmit && $options.formsubmit(...args)),
    t: common_vendor.sr("popup", "5a559478-2"),
    v: common_vendor.p({
      type: "bottom"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a559478"], ["__file", "/Users/ajin/Documents/test/uniapp/mygame/pages/chat/index.vue"]]);
wx.createPage(MiniProgramPage);
