import io from 'socket.io-client';

class Websocket {
  constructor() {
    let socketUri = 'wss://ts.2ncai.com/';
    if (process.env.RUNTIME_ENV === 'sit') {
      socketUri = 'wss://sitts.2ncai.com/';
    } else if (process.env.RUNTIME_ENV === 'uat') {
      socketUri = 'wss://uatts.2ncai.com/';
    } else if (process.env.RUNTIME_ENV === 'dev') {
      socketUri = 'ws://192.168.74.166:19092/';
    }
    this.socket = io.connect(socketUri, {
      reconnectionAttempts: 10
    });
    this.socket.on('connect', () => {
      console.log(`socket ${socketUri} connected`);
    });
  }

  subscribe(eventName, handle) {
    return new Promise((resolve, reject) => {
      this.socket.on(eventName, data => {
        const jsonData = JSON.parse(decodeURIComponent(data));
        resolve(jsonData);
      });
      this.socket.on('connect_error', reject);
    });
  }
}

export default new Websocket();
