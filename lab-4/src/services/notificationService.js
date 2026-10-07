export const notificationEvent = "notification"

export const notificationsBus = {
  listeners: {},

  subscribe(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = []
    }
    this.listeners[eventName].push(callback)

    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (cb) => cb !== callback,
      )
    }
  },

  publish(eventName, data) {
    if (!this.listeners[eventName]) return
    this.listeners[eventName].forEach((callback) => callback(data))
  },
}
