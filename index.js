var App = /** @class */ (function () {
    function App() {
        this.stageWidth = 1000;
        this.stageHeight = 500;
        this.ball = [];
        this.balls = [];
        // canvas를 생성해주고
        this.canvas = document.createElement("canvas");
        // body에 추가한다.
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        // 디바이스에 따라 선명도를 올려주기 위해 사용
        this.paint();
        // 움직이는 공을 위한 애니메이션 함수
        this.ballCount = Math.random() * 10 + 10;
        for (var i = 0; i < this.ballCount; i++) {
            var radius = Math.random() * 10 + 10;
            var speed = ((Math.random() * (400 - 200) + 200) / 60).toFixed(2);
            console.log(speed);
            this.ball.push(new Ball(this.stageWidth, this.stageHeight, radius, speed));
        }
        this.block = new Block(0, 0, this.stageWidth, this.stageHeight);
        window.requestAnimationFrame(this.animate.bind(this));
    }
    App.prototype.paint = function () {
        // resize때마다 canvas의 width, height를 창 사이즈로 만들어 주기 위함.
        this.canvas.width = this.stageWidth;
        this.canvas.height = this.stageHeight;
        // 선명도를 좋게 해주기 위함
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
    };
    App.prototype.createBall = function (timestamp) {
        var _this = this;
        this.ball.forEach(function (item, index) {
            var forStamp = 0;
            var filterBall = _this.ball.filter(function (tem, idx) {
                return index != idx;
            });
            filterBall.forEach(function (ele) {
                ele.bounceBall(item, timestamp);
            });
        });
    };
    App.prototype.animate = function (timestamp) {
        var _this = this;
        window.requestAnimationFrame(this.animate.bind(this));
        // 애니메이션 함수 호출시 캔버스 clear
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.block.draw(this.ctx);
        this.ball.forEach(function (element) {
            element.draw(_this.ctx, _this.stageWidth, _this.stageHeight);
        });
        this.createBall(timestamp);
    };
    return App;
}());
// 캔버스 실행
window.onload = function () {
    new App();
};
var Block = /** @class */ (function () {
    function Block(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Block.prototype.draw = function (ctx) {
        ctx.fillStyle = "tomato";
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    };
    return Block;
}());
var Ball = /** @class */ (function () {
    // 처음 공의 위치를 화면 내에 랜덤하게 줄 예정이기에, 현재화면의 width와 height를 가져온다.
    function Ball(stageWidth, stageHeight, radius, speed) {
        this.radius = radius;
        // 공이 움직이는 속도
        var randX = Math.floor(Math.random() * 3 - 1);
        var randY = Math.floor(Math.random() * 3 - 1);
        this.vx = randX * speed;
        this.vy = randY * speed;
        if (this.vx + this.vy === 0) {
            Math.floor(Math.random() * 2) ? (this.vx = speed) : (this.vy = speed);
        }
        this.speed = speed;
        // 우선 공의 지름을 잡는다.
        var diameter = this.radius * 2;
        // 공이 화면 밖에 생성되면 안되기 때문에 원의 중앙(x, y)을 잡아준다.
        this.x = this.radius + Math.random() * (stageWidth - diameter);
        this.y = this.radius + Math.random() * (stageHeight - diameter);
    }
    Ball.prototype.draw = function (ctx, stageWidth, stageHeight) {
        // 지속적으로 값이 증가함으로써 공이 움직이는 것처럼 보일 예정
        this.x += this.vx;
        this.y += this.vy;
        // 공이 화면에 닿으면 튀게끔 함수를 만듦
        this.bounceWindow(stageWidth, stageHeight);
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };
    Ball.prototype.xChange = function () {
        this.vx *= -1;
        this.x += this.vx;
    };
    Ball.prototype.yChange = function () {
        this.vy *= -1;
        this.y += this.vy;
    };
    Ball.prototype.ballAngle = function (ball) {
        var thisX = ball.x - (ball.x + ball.vx);
        var thisY = ball.y - (ball.y + ball.vy);
        var radian = Math.atan2(thisY, thisX);
        var degree = (radian * 180) / Math.PI;
        return degree;
    };
    Ball.prototype.checkAngleRange = function (ang) {
        if (ang >= 360) {
            ang -= 360;
        }
        else if (ang < 0) {
            ang += 360;
        }
        return ang;
    };
    Ball.prototype.flag = function () {
        var flag = false;
        return function () {
            return !flag;
        };
    };
    Ball.prototype.bounceBall = function (ab, timestamp) {
        this.time = timestamp;
        var distancX = Math.pow(this.x - ab.x, 2);
        var distancY = Math.pow(this.y - ab.y, 2);
        var After = {
            MoveBetween: Math.sqrt(distancX + distancY),
            Between: ab.radius + this.radius
        };
        var thisAngle = this.ballAngle(this);
        var abAngle = this.ballAngle(ab);
        if (After.MoveBetween <= After.Between + 4 &&
            After.MoveBetween - After.Between > -4) {
            var angle = abAngle + (thisAngle - abAngle) + 180;
            angle = this.checkAngleRange(angle);
            var newX = Math.cos(angle) * this.speed;
            var newY = Math.sin(angle) * this.speed;
            this.vx = newX;
            this.vy = newY;
        }
    };
    Ball.prototype.bounceWindow = function (stageWidth, stageHeight) {
        var minX = this.radius;
        var maxX = stageWidth - this.radius;
        var minY = this.radius;
        var maxY = stageHeight - this.radius;
        // 창 끝에 닿으면
        if (this.x <= minX || this.x >= maxX) {
            // 증가 값을 음수로 만들어 반대로 이동하게 한다.
            this.xChange();
        }
        if (this.y <= minY || this.y >= maxY) {
            this.yChange();
        }
    };
    return Ball;
}());
