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
      code: "",
      getToken: "1",
      msg: "",
      getUserInfo: {},
      avatarUrl: "",
      nickName: ""
    };
  },
  computed: {
    heightStyle() {
      const height = this.inputHeight ? `${this.inputHeight}px` : "10vh";
      return `bottom: ${height}`;
    }
  },
  mounted() {
    const wxVersion = common_vendor.wx$1.getSystemInfoSync().version;
    console.log(wxVersion);
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
      }
    });
  },
  methods: {
    sendClick() {
      if (!this.cont)
        return;
      this.messageList.push({
        name: this.nickName,
        avater: this.avatarUrl,
        content: this.cont,
        self: 1,
        id: 3
      });
      this.cont = "";
    },
    confirmClick() {
      this.sendClick();
    },
    joinPopup() {
      this.$refs.popup.open();
    },
    chooseAvatar(e) {
      const { avatarUrl } = e.detail;
      this.avatarUrl = avatarUrl;
    },
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
    b: common_vendor.t($data.getToken),
    c: common_vendor.t($data.code),
    d: common_vendor.t($data.msg),
    e: common_vendor.t($data.nickName),
    f: common_vendor.t($data.avatarUrl),
    g: common_vendor.o((...args) => $options.confirmClick && $options.confirmClick(...args)),
    h: $data.cont,
    i: common_vendor.o(($event) => $data.cont = $event.detail.value),
    j: common_vendor.n($data.cont.length ? "active" : ""),
    k: common_vendor.o($options.sendClick),
    l: common_vendor.p({
      type: "paperplane-filled",
      size: "28"
    }),
    m: common_vendor.s($options.heightStyle),
    n: !!$data.nickName,
    o: common_vendor.o((...args) => $options.joinPopup && $options.joinPopup(...args)),
    p: !$data.nickName,
    q: $data.avatarUrl,
    r: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    s: $data.nickName,
    t: common_vendor.o((...args) => $options.formsubmit && $options.formsubmit(...args)),
    v: common_vendor.sr("popup", "5a559478-2"),
    w: common_vendor.p({
      type: "bottom"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a559478"], ["__file", "/Users/ajin/Documents/test/uniapp/mygame/pages/chat/index.vue"]]);
wx.createPage(MiniProgramPage);
