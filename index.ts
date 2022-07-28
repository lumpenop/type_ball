class App {
  canvas;
  ctx;
  pixelRatio;
  stageWidth = 300;
  stageHeight = 300;
  ball;
  constructor() {
    // canvas를 생성해주고
    this.canvas = document.createElement("canvas");
    // body에 추가한다.
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    // 디바이스에 따라 선명도를 올려주기 위해 사용

    this.paint();

    // 움직이는 공을 위한 애니메이션 함수
    this.ball = new Ball(this.stageWidth, this.stageHeight, 15, 5);
    window.requestAnimationFrame(this.animate.bind(this));
  }

  paint() {
    // resize때마다 canvas의 width, height를 창 사이즈로 만들어 주기 위함.
    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;
    // 선명도를 좋게 해주기 위함
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    // 애니메이션 함수 호출시 캔버스 clear
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.ball.draw(this.ctx, this.stageWidth, this.stageHeight);
  }
}
// 캔버스 실행
class Ball {
  radius;
  vx;
  vy;
  x: 10;
  y: 10;
  // 처음 공의 위치를 화면 내에 랜덤하게 줄 예정이기에, 현재화면의 width와 height를 가져온다.
  constructor(stageWidth, stageHeight, radius, speed) {
    this.radius = radius;
    // 공이 움직이는 속도
    this.vx = speed;
    this.vy = speed;

    // 우선 공의 지름을 잡는다.
    const diameter = this.radius * 2;
    // 공이 화면 밖에 생성되면 안되기 때문에 원의 중앙(x, y)을 잡아준다.
    this.x = this.radius + Math.random() * (stageWidth - diameter);
    this.y = this.radius + Math.random() * (stageHeight - diameter);
  }
  draw(ctx, stageWidth, stageHeight) {
    // 지속적으로 값이 증가함으로써 공이 움직이는 것처럼 보일 예정
    this.x += this.vx;
    this.y += this.vy;
    // 공이 화면에 닿으면 튀게끔 함수를 만듦
    this.bounceWindow(stageWidth, stageHeight);

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  bounceWindow(stageWidth, stageHeight) {
    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;
    // 창 끝에 닿으면
    if (this.x <= minX || this.x >= maxX) {
      // 증가 값을 음수로 만들어 반대로 이동하게 한다.
      this.vx *= -1;
      this.x += this.vx;
    }
    if (this.y <= minY || this.y >= maxY) {
      this.vy *= -1;
      this.y += this.vy;
    }
  }
}

window.onload = () => {
  new App();
};
