"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    message: {
      type: Object,
      default: {}
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.message.avater,
    b: common_vendor.t($props.message.name),
    c: common_vendor.t($props.message.content),
    d: common_vendor.n(!!$props.message.self ? "messagerevise" : "")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c4350369"], ["__file", "/Users/ajin/Documents/test/uniapp/mygame/pages/chat/message.vue"]]);
wx.createComponent(Component);
