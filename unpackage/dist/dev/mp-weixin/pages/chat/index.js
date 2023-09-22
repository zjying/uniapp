"use strict";
const common_vendor = require("../../common/vendor.js");
const message = () => "./message.js";
const _sfc_main = {
  components: {
    message
  },
  data() {
    return {
      context: "",
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
      }]
    };
  },
  mounted() {
    common_vendor.wx$1.login({
      success(res) {
        console.log(111, res);
        if (res.code) {
          console.log(res.code);
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
  },
  methods: {
    sendClick() {
      this.messageList.push({
        name: "张三2",
        avater: "rel_1.png",
        content: this.context,
        id: 3
      });
      this.context = "";
    }
  }
};
if (!Array) {
  const _component_message = common_vendor.resolveComponent("message");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_component_message + _easycom_uni_easyinput2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
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
    b: common_vendor.n($data.context ? "cansend" : ""),
    c: common_vendor.o($options.sendClick),
    d: common_vendor.o(($event) => $data.context = $event),
    e: common_vendor.p({
      focus: true,
      placeholder: "请输入内容",
      suffixIcon: "paperplane-filled",
      modelValue: $data.context
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a559478"], ["__file", "/Users/ajin/Documents/test/uniapp/mygame/pages/chat/index.vue"]]);
wx.createPage(MiniProgramPage);
