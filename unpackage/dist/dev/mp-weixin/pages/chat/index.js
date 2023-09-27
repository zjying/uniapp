"use strict";
const common_vendor = require("../../common/vendor.js");
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
        avater: "rel_1.png",
        content: "张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试张三测试",
        id: 1
      }, {
        name: "张三1",
        avater: "rel_1.png",
        content: "张三测试333333",
        id: 2
      }],
      inputHeight: "",
      code: "",
      getToken: "1",
      msg: ""
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
        this.code = event.code;
        console.log("111");
        common_vendor.index.request({
          url: "https://mying.vip/eps/login",
          //仅为示例，并非真实接口地址。
          data: {
            code: event.code
          },
          success: (res) => {
            this.getToken = res.data.data.token;
            common_vendor.index.setStorageSync("token", res.data.data.token);
          },
          fail: (err) => {
            this.msg = `1${JSON.stringify(err)}`;
            console.log("3331", err);
          }
        });
      },
      fail: function(err) {
        this.msg = `2${err}`;
        console.log("2222", err);
      }
    });
  },
  methods: {
    sendClick() {
      if (!this.cont)
        return;
      this.messageList.push({
        name: "张三2",
        avater: "rel_1.png",
        content: this.cont + this.getToken,
        id: 3
      });
      this.cont = "";
    },
    confirmClick() {
      this.sendClick();
    },
    keyboardheightchange(event) {
      alert(1);
      alert(event.detail);
    }
  }
};
if (!Array) {
  const _component_message = common_vendor.resolveComponent("message");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_message + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
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
    b: common_vendor.t($data.getToken),
    c: common_vendor.t($data.code),
    d: common_vendor.t($data.msg),
    e: common_vendor.o((...args) => $options.confirmClick && $options.confirmClick(...args)),
    f: $data.cont,
    g: common_vendor.o(($event) => $data.cont = $event.detail.value),
    h: common_vendor.n($data.cont.length ? "active" : ""),
    i: common_vendor.o($options.sendClick),
    j: common_vendor.p({
      type: "paperplane-filled",
      size: "28"
    }),
    k: common_vendor.s($options.heightStyle)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a559478"], ["__file", "/Users/ajin/Documents/test/uniapp/mygame/pages/chat/index.vue"]]);
wx.createPage(MiniProgramPage);
