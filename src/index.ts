import { Ball } from "./Ball";
class App {
  canvas;
  ctx;
  pixelRatio: number;
  stageWidth = 1000;
  stageHeight = 500;
  ball: Ball[] = [];
  ballCount;

  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.paint();

    this.ballCount = Math.random() * 10 + 10;

    for (let i = 0; i < this.ballCount; i++) {
      const radius = Math.random() * 10 + 10;
      const speed = Number(
        ((Math.random() * (400 - 200) + 200) / 60).toFixed(2)
      );
      this.ball.push(
        new Ball(this.stageWidth, this.stageHeight, radius, speed)
      );
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  paint() {
    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  createBall() {
    this.ball.forEach((item, index) => {
      const filterBall = this.ball.filter((tem, idx) => {
        return index != idx;
      });
      filterBall.forEach((ele) => {
        ele.bounceBall(item);
      });
    });
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.ball.forEach((element) => {
      element.draw(this.ctx, this.stageWidth, this.stageHeight);
    });

    this.createBall();
  }
}

window.onload = () => {
  new App();
};
