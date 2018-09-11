export class LimitBallError extends Error {
  constructor(message, balls) {
    super(message);
    this.balls = balls;
  }
}
