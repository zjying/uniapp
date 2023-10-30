"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_chat_socket = require("./socket.js");
const configs_index = require("../../configs/index.js");
const message = () => "./message.js";
const _sfc_main = {
  components: {
    message
  },
  data() {
    return {
      cont: "",
      messageList: [],
      inputHeight: "",
      msg: "",
      token: "1",
      avatarUrl: "",
      userId: "",
      nickName: "",
      ws: null,
      scrollTop: 0,
      oldScrollTop: 0,
      wsStatus: false
    };
  },
  computed: {
    heightStyle() {
      const height = this.inputHeight ? `${this.inputHeight}px` : "3vh";
      return `bottom: ${height}`;
    }
  },
  mounted() {
    console.log(configs_index.configs);
    common_vendor.wx$1.onKeyboardHeightChange((res) => {
      this.inputHeight = res.height;
    });
    common_vendor.index.login({
      "provider": "weixin",
      "onlyAuthorize": true,
      // 微信登录仅请求授权认证
      success: (event) => {
        common_vendor.index.request({
          url: `${configs_index.configs.api_location}/login`,
          //仅为示例，并非真实接口地址。
          data: {
            code: event.code
          },
          success: (res) => {
            if (!res.data || !res.data.data || !res.data.data.token) {
              common_vendor.index.showToast({
                title: "登录失败",
                icon: "error",
                duration: 2e3
              });
              return;
            }
            this.token = res.data.data.token;
            this.avatarUrl = res.data.data.photoPath || "";
            this.userId = res.data.data.id;
            this.nickName = res.data.data.name || "";
            common_vendor.index.setStorageSync("token", res.data.data.token);
            common_vendor.index.setStorageSync("userId", res.data.data.id);
            this.initWs();
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
  },
  methods: {
    getHistory() {
      common_vendor.index.request({
        url: `${configs_index.configs.api_location}/chat/history`,
        //仅为示例，并非真实接口地址。
        method: "POST",
        data: {
          roomId: 123
        },
        success: (res) => {
          this.messageList = res.data.data;
          setTimeout(() => {
            this.goTop();
          }, 0);
        },
        fail: (err) => {
          this.msg = `history：${JSON.stringify(err)}`;
        }
      });
    },
    initWs() {
      this.ws = new pages_chat_socket.UniappWebSocket(`${configs_index.configs.ws_location}/ws?room=123&id=${this.userId}`);
      this.ws.on("open", () => {
        console.log("WebSocket连接已打开");
      });
      this.ws.on("message", (jsonData) => {
        console.log("收到消息:", jsonData);
        const { data, event } = JSON.parse(jsonData);
        if (event === "prompt") {
          common_vendor.index.showToast({
            title: data.content,
            icon: "success",
            duration: 2e3
          });
          this.wsStatus = true;
        } else if (event === "sendMessage") {
          this.messageList.push(data);
          this.goTop();
        }
      });
      this.ws.on("close", (error) => {
        console.log("发生错误:", error);
        this.wsStatus = false;
        this.$refs.alertDialog.open();
      });
      this.ws.on("error", (error) => {
        console.log("发生错误:", error);
        this.wsStatus = false;
      });
    },
    sendClick() {
      if (!this.cont)
        return;
      if (!this.wsStatus) {
        this.$refs.alertDialog.open();
        return;
      }
      this.ws.sendMessage({
        roomId: 123,
        senderId: this.userId,
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
        url: `${configs_index.configs.api_location}/upload`,
        filePath: this.avatarUrl,
        name: "file",
        header: {
          token: this.token
        },
        formData: {
          userId: this.userId,
          nickname: this.nickName
        },
        success: (uploadRes) => {
          console.log("上传成功", uploadRes);
        },
        fail: (error) => {
          console.error("上传失败", error);
        }
      });
    },
    scroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
    },
    goTop(e) {
      this.scrollTop = this.oldScrollTop;
      this.$nextTick(() => {
        this.scrollTop = 1e4;
      });
    },
    onUnload() {
      console.log("111beforeDestroy");
      this.ws.close();
    },
    dialogConfirm() {
      this.$refs.alertDialog.close();
      this.initWs();
    },
    dialogClose() {
      this.$refs.alertDialog.close();
    }
  }
};
if (!Array) {
  const _component_message = common_vendor.resolveComponent("message");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_component_message + _easycom_uni_icons2 + _easycom_uni_popup2 + _easycom_uni_popup_dialog2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup + _easycom_uni_popup_dialog)();
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
    b: $data.scrollTop,
    c: common_vendor.o((...args) => $options.scroll && $options.scroll(...args)),
    d: common_vendor.o((...args) => $options.confirmClick && $options.confirmClick(...args)),
    e: $data.cont,
    f: common_vendor.o(($event) => $data.cont = $event.detail.value),
    g: common_vendor.n($data.cont.length ? "active" : ""),
    h: common_vendor.o($options.sendClick),
    i: common_vendor.p({
      type: "paperplane-filled",
      size: "28"
    }),
    j: common_vendor.s($options.heightStyle),
    k: !!$data.avatarUrl,
    l: common_vendor.o((...args) => $options.joinPopup && $options.joinPopup(...args)),
    m: !$data.avatarUrl,
    n: $data.avatarUrl,
    o: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    p: $data.nickName,
    q: common_vendor.o((...args) => $options.formsubmit && $options.formsubmit(...args)),
    r: common_vendor.sr("popup", "5a559478-2"),
    s: common_vendor.p({
      type: "bottom"
    }),
    t: common_vendor.o($options.dialogConfirm),
    v: common_vendor.o($options.dialogClose),
    w: common_vendor.p({
      type: "error",
      cancelText: "不要",
      confirmText: "要",
      title: "通知",
      content: "断开了，要重连么～"
    }),
    x: common_vendor.sr("alertDialog", "5a559478-3"),
    y: common_vendor.p({
      type: "dialog"
    }),
    z: $data.userId
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a559478"], ["__file", "/Users/ajin/Documents/test/uniapp/mygame/pages/chat/index.vue"]]);
wx.createPage(MiniProgramPage);
