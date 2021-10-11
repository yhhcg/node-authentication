import get from 'lodash/get'
import intersection from 'lodash/intersection'

/**
 * 事件管理器
 * 默认等待1s建立连接，如果连接未成功，则事件未空对象
 * 接收初始化数据，创建事件函数列表
 */
export default class IframeBridgeManager {
  constructor(options) {
    const {
      customizeEventList = [], // 自定义事件列表
      waitingTimeForCreating = 1 // 建立通信，初始化数据等待时间，单位：s
    } = options || {}

    this.options = {
      customizeEventList,
      waitingTimeForCreating
    }

    this.isIframe = window.top !== window.self
    this.init = false
    this.initMessageData = undefined // 初始化消息数据
    this.iframeOrigin = undefined // iframe源
    window.addEventListener('message', this.receiveMessage, false)
    this.initData()
  }

  // iframe嵌入的情况下，可开启通信
  receiveMessage = (event) => {
    if (this.isIframe) {
      // 握手成功，接受通信的初始化数据，成功连接后，通知外层初始化参数成功
      if (!this.init && get(event, 'data.name') === 'IFRAME_BRIDGE_CREATE') {
        this.init = true
        clearInterval(this.intervalId)

        this.initMessageData = {
          customizeEvents: intersection(this.options.customizeEventList, get(event, 'data.data.customizeEvents', []))
        }
        this.iframeOrigin = event.origin
        try {
          window.parent.postMessage({
            name: 'IFRAME_BRIDGE_CREATE_SUCCESS'
          }, this.iframeOrigin)
        } catch (errors) {
          console.error('IFRAME_BRIDGE: receiveMessage', errors)
        }
      }
    }
  }

  // 未嵌入iframe或者等待数秒，还未返回初始数据，则使用默认值初始化
  initData = () => {
    if (!this.isIframe) {
      this.initMessageData = {
        customizeEvents: []
      }
      return
    }
    const startTime = Date.now()

    this.intervalId = setInterval(() => {
      if (Date.now() - startTime >= this.options.waitingTimeForCreating * 1000) {
        clearInterval(this.intervalId)
        this.initMessageData = {
          customizeEvents: []
        }
      }
    }, 10)
  }

  // 初始化事件列表
  initIframeEvent = (customizeEvents = []) => customizeEvents.reduce((accumulator, eventName) => {
    accumulator[eventName] = (...args) => {
      try {
        window.parent.postMessage({
          name: eventName,
          data: {
            ...args
          }
        }, this.iframeOrigin)
      } catch (errors) {
        console.error('IFRAME_BRIDGE: initIframeEvent', errors)
      }
    }
    return accumulator
  }, {})

  // 获取事件函数
  getIframeCustomizeEvents = () => new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (this.initMessageData !== undefined) {
        clearInterval(intervalId)
        resolve(this.initIframeEvent(this.initMessageData.customizeEvents))
      }
    }, 10)
  })

  destory = () => {
    window.removeEventListener('message', this.receiveMessage, false)
  }
}
