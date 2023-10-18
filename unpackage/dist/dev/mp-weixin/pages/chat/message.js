"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    message: {
      type: Object,
      default: {}
    }
  },
  computed: {
    userId() {
      return common_vendor.index.getStorageSync("userId") || "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.message.photoPath,
    b: common_vendor.t($props.message.nickname),
    c: common_vendor.t($props.message.timestamp.replace(/.\d{3}Z/, "").replace("T0", " ")),
    d: common_vendor.t($props.message.content),
    e: common_vendor.n(+$props.message.senderId === +$options.userId ? "messagerevise" : "")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c4350369"], ["__file", "/Users/ajin/Documents/test/uniapp/mygame/pages/chat/message.vue"]]);
wx.createComponent(Component);
