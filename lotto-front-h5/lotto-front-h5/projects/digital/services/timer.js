export default class Timer {
  constructor() {
    this.countdown = undefined;
  }

  start(remaining) {
    if (typeof this.countdown !== 'undefined') {
      clearInterval(this.countdown);
    }
    return new Promise((resolve) => {
      let timeRemaining = remaining;
      this.countDown = setInterval(() => {
        if (timeRemaining < 1) {
          this.stop();
          resolve();
          return undefined;
        }
        timeRemaining -= 1;
      }, 1000);
    });
  }

  stop() {
    if (typeof this.countDown !== 'undefined') clearInterval(this.countDown);
    this.countDown = undefined;
  }
}
