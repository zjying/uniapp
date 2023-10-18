"use strict";
const common_vendor = require("../../common/vendor.js");
class UniappWebSocket {
  constructor(url) {
    if (UniappWebSocket.instance) {
      return UniappWebSocket.instance;
    }
    this.url = url;
    this.socket = null;
    this.listeners = {};
    this.isOpen = false;
    this.init();
    UniappWebSocket.instance = this;
  }
  init() {
    this.socket = common_vendor.index.connectSocket({
      url: this.url,
      complete: () => {
        this.emit("connect");
      }
    });
    console.log(this.socket);
    this.socket.onOpen(() => {
      this.isOpen = true;
      this.emit("open");
    });
    this.socket.onMessage((res) => {
      this.emit("message", res.data);
    });
    this.socket.onClose(() => {
      console.log("断开了");
      this.isOpen = false;
      this.emit("close");
      this.listeners = {};
      UniappWebSocket.instance = null;
    });
    this.socket.onError((error) => {
      console.log("error了");
      this.emit("error", error);
    });
  }
  sendMessage(message) {
    if (this.socket && this.isOpen) {
      this.socket.send({
        data: JSON.stringify(message)
      });
    }
  }
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  off(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index !== -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        if (typeof callback === "function") {
          callback(data);
        }
      });
    }
  }
  close() {
    if (this.socket && this.isOpen) {
      this.socket.close();
    }
  }
}
exports.UniappWebSocket = UniappWebSocket;
