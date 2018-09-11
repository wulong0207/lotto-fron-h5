/**
 * 用于批量执行 setState, 因为 react setState 为异步，所以在同一时间触发多次 setState 时可能会出现数据丢失的情况
 * 这个时候使用队列记录每次 setState 的数据，然后在 50 毫秒后统一执行一次 setState, 如果在 50 毫秒内再次触发则会触发再次等待
 */

class Queue {
  constructor() {
    this.queue = [];
    this.delay = undefined;
    this.handle = undefined;
  }

  dispatch(data) {
    this.queue.push(data);
    if (typeof this.delay !== undefined) {
      clearTimeout(this.delay);
    }
    this.delay = setTimeout(() => {
      this.handle(this.queue);
      this.queue = [];
      clearTimeout(this.delay);
      this.delay = undefined;
    }, 50);
  }

  subscribe(handle) {
    this.handle = handle;
  }

  unsubscribe() {
    clearTimeout(this.delay);
    this.delay = undefined;
    this.queue = [];
  }
}

export default new Queue;