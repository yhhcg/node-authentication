import get from 'lodash/get'

/**
 * 页面被嵌入到iframe之后，可通过该方法和页面建立通信
 * 每隔10ms给页面发送一个初始化消息，直到接收到初始化成功消息后，结束发送
 * @param {Node} iframeElement - Iframe元素
 * @param {Object} initOptions - 初始化参数
 * @param {Function} eventCallback - 通信回调
 */
export default class CreateIframeBridge {
  constructor(iframeElement, initOptions = {}, eventCallback) {
    const {
      initMessage, // 初始化消息参数
      sendDelay = 10, // 默认每隔10ms发送一次初始化消息，单位ms
      targetOrigin, // 指定接收消息的窗口
      waitingTimeForCreating = 3 // 建立通信，初始化数据等待时间，单位：s
    } = initOptions

    this.initOptions = {
      initMessage,
      sendDelay,
      targetOrigin,
      waitingTimeForCreating
    }

    if (!iframeElement || !this.isDOM(iframeElement)) {
      throw new Error('util/IFRAME_BRIDGE: iframe dom必传')
    }
    if (!this.initOptions.targetOrigin) {
      throw new Error('util/IFRAME_BRIDGE: 接收消息的窗口源targetOrigin必传')
    }
    if (this.initOptions.targetOrigin === '*') {
      throw new Error('util/IFRAME_BRIDGE: 接收消息的窗口源应为站点地址，以保证通信成功')
    }

    this.iframeElement = iframeElement
    this.eventCallback = eventCallback
    this.intervalId = undefined
  }

  isDOM = (obj) => (typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement
    : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string')

  receiveMessage = (event) => {
    if (event.origin === this.initOptions.targetOrigin) {
      if (get(event, 'data.name') === 'IFRAME_BRIDGE_CREATE_SUCCESS') {
        clearInterval(this.intervalId)
      }
      if (this.eventCallback) this.eventCallback(event)
    }
  }

  create = () => {
    window.addEventListener('message', this.receiveMessage, false)

    const startTime = Date.now()

    this.intervalId = setInterval(() => {
      // 等待数秒，还未建立通信，则断开
      if (Date.now() - startTime >= this.initOptions.waitingTimeForCreating * 1000) {
        clearInterval(this.intervalId)
      }

      if (this.iframeElement.contentWindow && this.iframeElement.contentWindow.postMessage) {
        this.iframeElement.contentWindow.postMessage({
          name: 'IFRAME_BRIDGE_CREATE',
          data: this.initOptions.initMessage
        }, this.initOptions.targetOrigin)
      }
    }, this.initOptions.sendDelay)
  }

  destory = () => {
    window.removeEventListener('message', this.receiveMessage, false)
  }
}
