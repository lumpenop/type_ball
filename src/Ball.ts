export class Ball {
  radius;
  vx;
  vy;
  x;
  y;
  top: number;
  bottom: number;
  right: number;
  left: number;
  speed;
  time: number;

  constructor(
    stageWidth: number,
    stageHeight: number,
    radius: number,
    speed: number
  ) {
    this.radius = radius;
    const randX = Math.floor(Math.random() * 3 - 1);
    const randY = Math.floor(Math.random() * 3 - 1);
    this.vx = randX * speed;
    this.vy = randY * speed;
    if (this.vx + this.vy === 0) {
      Math.floor(Math.random() * 2) ? (this.vx = speed) : (this.vy = speed);
    }
    this.speed = speed;

    const diameter = this.radius * 2;

    this.x = this.radius + Math.random() * (stageWidth - diameter);
    this.y = this.radius + Math.random() * (stageHeight - diameter);
  }
  draw(ctx: CanvasRenderingContext2D, stageWidth: number, stageHeight: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.bounceWindow(stageWidth, stageHeight);

    ctx.fillStyle = "#393939";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  xChange() {
    this.vx *= -1;
    this.x += this.vx;
  }

  yChange() {
    this.vy *= -1;
    this.y += this.vy;
  }

  ballAngle(ball: Ball) {
    const thisX = ball.x - (ball.x + ball.vx);
    const thisY = ball.y - (ball.y + ball.vy);
    const radian = Math.atan2(thisY, thisX);
    const degree = (radian * 180) / Math.PI;

    return degree;
  }

  checkAngleRange(ang: number) {
    if (ang >= 360) {
      ang -= 360;
    } else if (ang < 0) {
      ang += 360;
    }
    return ang;
  }

  calcualateDistance(aa: Ball, ab: Ball) {
    const distancX = Math.pow(aa.x - ab.x, 2);
    const distancY = Math.pow(aa.y - ab.y, 2);

    const After = {
      MoveBetween: Math.sqrt(distancX + distancY),
      Between: ab.radius + this.radius,
    };

    return { After };
  }

  calculateAngle(thisAngle: number, abAngle: number) {
    let angle = abAngle + Math.abs(thisAngle - abAngle) + 180;

    angle = this.checkAngleRange(angle);

    const newX = Math.cos(angle) * this.speed;
    const newY = Math.sin(angle) * this.speed;
    return { newX, newY };
  }

  reverseAngle(ang: number) {
    if (ang <= 180) {
      ang += 180;
    } else {
      ang -= 180;
    }
    return ang;
  }

  bounceBall(ab: Ball) {
    const { After } = this.calcualateDistance(this, ab);

    const thisAngle = this.ballAngle(this);
    const abAngle = this.ballAngle(ab);

    if (
      After.MoveBetween <= After.Between + 4 &&
      After.MoveBetween - After.Between > -4
    ) {
      const { newX, newY } = this.calculateAngle(thisAngle, abAngle);

      const ifX = this.x + newX;
      const ifY = this.y + newY;
      const distancX = Math.pow(ifX - ab.x, 2);
      const distancY = Math.pow(ifY - ab.y, 2);
      const MoveBetween = Math.sqrt(distancX + distancY);

      if (After.MoveBetween > MoveBetween) {
        const thisX = ifX - (ifX + this.vx);
        const thisY = ifY - (ifY + this.vy);
        const radian = Math.atan2(thisY, thisX);
        const degree = (radian * 180) / Math.PI;

        const newDeg = this.reverseAngle(degree);
        const { newX, newY } = this.calculateAngle(newDeg, abAngle);
        this.vx = newX;
        this.vy = newY;
      } else {
        this.vx = newX;
        this.vy = newY;
      }
    }
  }

  bounceWindow(stageWidth: number, stageHeight: number) {
    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;
    if (this.x <= minX || this.x >= maxX) {
      this.xChange();
    }
    if (this.y <= minY || this.y >= maxY) {
      this.yChange();
    }
  }
}
