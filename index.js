var App = /** @class */ (function () {
    function App() {
        this.stageWidth = 300;
        this.stageHeight = 300;
        this.balls = [];
        // canvas를 생성해주고
        this.canvas = document.createElement("canvas");
        // body에 추가한다.
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        // 디바이스에 따라 선명도를 올려주기 위해 사용
        this.paint();
        // 움직이는 공을 위한 애니메이션 함수
        this.ball = [
            new Ball(this.stageWidth, this.stageHeight, 15, 7),
            new Ball(this.stageWidth, this.stageHeight, 15, 9),
            new Ball(this.stageWidth, this.stageHeight, 15, 5),
        ];
        this.balls.push(this.ball[0].getThisBall(), this.ball[1].getThisBall());
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
    App.prototype.animate = function () {
        var _this = this;
        window.requestAnimationFrame(this.animate.bind(this));
        // 애니메이션 함수 호출시 캔버스 clear
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.block.draw(this.ctx);
        this.ball.forEach(function (element) {
            element.draw(_this.ctx, _this.stageWidth, _this.stageHeight);
        });
        this.ball.forEach(function (item, index) {
            var filterBall = _this.ball.filter(function (tem, idx) {
                return index != idx;
            });
            filterBall.forEach(function (ele) {
                ele.bounceBall(item);
            });
        });
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
        this.vx = speed;
        this.vy = speed;
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
        this.movingBall();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };
    Ball.prototype.movingBall = function () {
        this.top = this.y + this.radius;
        this.bottom = this.y - this.radius;
        this.right = this.x + this.radius;
        this.left = this.x - this.radius;
    };
    Ball.prototype.getThisBall = function () {
        return {
            top: this.top,
            left: this.left,
            right: this.right,
            botton: this.bottom
        };
    };
    Ball.prototype.xChange = function () {
        this.vx *= -1;
        this.x += this.vx;
    };
    Ball.prototype.yChange = function () {
        this.vy *= -1;
        this.y += this.vy;
    };
    Ball.prototype.bounceBall = function (ab) {
        var distancX = Math.pow(this.x - ab.x, 2);
        var distancY = Math.pow(this.y - ab.y, 2);
        var After = {
            MoveBetween: Math.sqrt(distancX + distancY),
            Between: ab.radius + this.radius
        };
        if (After.MoveBetween < After.Between) {
            this.vx = -this.vx;
            this.vy = -this.vy;
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
