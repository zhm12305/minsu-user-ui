// 游戏配置
const config = {
  gridSize: 20, // 格子大小
  gameSpeed: 120, // 游戏速度（毫秒）
  initialSnakeLength: 3 // 初始蛇的长度
};

// 方向常量
const Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

// 游戏状态
const GameState = {
  READY: 'ready',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver'
};

// 贪吃蛇游戏类
class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreElement = document.getElementById('score');
    this.finalScoreElement = document.getElementById('final-score');
    this.gameMessageElement = document.getElementById('game-message');
    
    // 设置游戏区域大小
    this.boardWidth = Math.floor(this.canvas.width / config.gridSize);
    this.boardHeight = Math.floor(this.canvas.height / config.gridSize);
    
    // 游戏状态
    this.gameState = GameState.READY;
    this.score = 0;
    
    // 蛇的初始状态
    this.snake = [];
    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    
    // 食物
    this.food = null;
    
    // 游戏循环
    this.gameLoop = null;
    
    // 设置事件监听
    this.setupEventListeners();
  }
  
  // 设置事件监听
  setupEventListeners() {
    // 键盘控制
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // 触摸按钮控制
    document.getElementById('up-button').addEventListener('click', () => {
      this.setDirection(Direction.UP);
    });
    document.getElementById('down-button').addEventListener('click', () => {
      this.setDirection(Direction.DOWN);
    });
    document.getElementById('left-button').addEventListener('click', () => {
      this.setDirection(Direction.LEFT);
    });
    document.getElementById('right-button').addEventListener('click', () => {
      this.setDirection(Direction.RIGHT);
    });
    
    // 游戏控制按钮
    document.getElementById('start-button').addEventListener('click', () => {
      this.startGame();
    });
    document.getElementById('retry-button').addEventListener('click', () => {
      this.resetGame();
      this.startGame();
    });
  }
  
  // 处理键盘事件
  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.setDirection(Direction.UP);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.setDirection(Direction.DOWN);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.setDirection(Direction.LEFT);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.setDirection(Direction.RIGHT);
        break;
      case ' ':
        if (this.gameState === GameState.READY) {
          this.startGame();
        } else if (this.gameState === GameState.GAME_OVER) {
          this.resetGame();
          this.startGame();
        }
        break;
      default:
        return;
    }
    
    // 阻止方向键滚动页面
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }
  }
  
  // 设置方向
  setDirection(direction) {
    // 防止反向移动
    if (this.gameState !== GameState.PLAYING) return;
    
    if (
      (direction === Direction.UP && this.direction !== Direction.DOWN) ||
      (direction === Direction.DOWN && this.direction !== Direction.UP) ||
      (direction === Direction.LEFT && this.direction !== Direction.RIGHT) ||
      (direction === Direction.RIGHT && this.direction !== Direction.LEFT)
    ) {
      this.nextDirection = direction;
    }
  }
  
  // 初始化游戏
  initGame() {
    // 创建蛇
    this.snake = [];
    const startX = Math.floor(this.boardWidth / 4);
    const startY = Math.floor(this.boardHeight / 2);
    
    for (let i = 0; i < config.initialSnakeLength; i++) {
      this.snake.push({ x: startX - i, y: startY });
    }
    
    // 设置初始方向
    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    
    // 生成食物
    this.generateFood();
    
    // 重置分数
    this.score = 0;
    this.updateScore();
    
    // 渲染初始状态
    this.render();
  }
  
  // 开始游戏
  startGame() {
    if (this.gameState === GameState.PLAYING) return;
    
    this.gameState = GameState.PLAYING;
    this.initGame();
    
    // 启动游戏循环
    this.gameLoop = setInterval(() => {
      this.update();
    }, config.gameSpeed);
  }
  
  // 重置游戏
  resetGame() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    this.gameState = GameState.READY;
    this.hideGameMessage();
  }
  
  // 更新游戏状态
  update() {
    if (this.gameState !== GameState.PLAYING) return;
    
    // 更新方向
    this.direction = this.nextDirection;
    
    // 计算新头部位置
    const head = { ...this.snake[0] };
    
    switch (this.direction) {
      case Direction.UP:
        head.y--;
        break;
      case Direction.DOWN:
        head.y++;
        break;
      case Direction.LEFT:
        head.x--;
        break;
      case Direction.RIGHT:
        head.x++;
        break;
    }
    
    // 检查是否撞墙
    if (
      head.x < 0 || 
      head.x >= this.boardWidth || 
      head.y < 0 || 
      head.y >= this.boardHeight
    ) {
      this.endGame();
      return;
    }
    
    // 检查是否撞到自己
    for (let i = 0; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.endGame();
        return;
      }
    }
    
    // 检查是否吃到食物
    if (head.x === this.food.x && head.y === this.food.y) {
      // 增加分数
      this.score += 10;
      this.updateScore();
      
      // 生成新食物
      this.generateFood();
    } else {
      // 如果没吃到食物，移除尾部
      this.snake.pop();
    }
    
    // 添加新头部
    this.snake.unshift(head);
    
    // 渲染游戏
    this.render();
  }
  
  // 生成食物
  generateFood() {
    let foodX, foodY;
    let isFoodOnSnake;
    
    do {
      foodX = Math.floor(Math.random() * this.boardWidth);
      foodY = Math.floor(Math.random() * this.boardHeight);
      
      // 检查食物是否生成在蛇身上
      isFoodOnSnake = false;
      for (let segment of this.snake) {
        if (segment.x === foodX && segment.y === foodY) {
          isFoodOnSnake = true;
          break;
        }
      }
    } while (isFoodOnSnake);
    
    this.food = { x: foodX, y: foodY };
  }
  
  // 结束游戏
  endGame() {
    this.gameState = GameState.GAME_OVER;
    
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    // 显示游戏结束消息
    this.finalScoreElement.textContent = this.score;
    this.showGameMessage();
  }
  
  // 显示游戏结束消息
  showGameMessage() {
    this.gameMessageElement.style.display = 'flex';
  }
  
  // 隐藏游戏结束消息
  hideGameMessage() {
    this.gameMessageElement.style.display = 'none';
  }
  
  // 更新分数显示
  updateScore() {
    this.scoreElement.textContent = this.score;
  }
  
  // 渲染游戏
  render() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制网格背景
    this.drawGrid();
    
    // 绘制蛇
    this.drawSnake();
    
    // 绘制食物
    this.drawFood();
  }
  
  // 绘制网格
  drawGrid() {
    this.ctx.strokeStyle = '#eee';
    this.ctx.lineWidth = 1;
    
    for (let x = 0; x <= this.boardWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * config.gridSize, 0);
      this.ctx.lineTo(x * config.gridSize, this.canvas.height);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= this.boardHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * config.gridSize);
      this.ctx.lineTo(this.canvas.width, y * config.gridSize);
      this.ctx.stroke();
    }
  }
  
  // 绘制蛇
  drawSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      const segment = this.snake[i];
      
      // 头部使用不同颜色
      if (i === 0) {
        this.ctx.fillStyle = '#3955b2';
      } else {
        this.ctx.fillStyle = '#4a6bd6';
      }
      
      // 给蛇身体添加圆角
      const x = segment.x * config.gridSize;
      const y = segment.y * config.gridSize;
      const size = config.gridSize - 2; // 留一点间隙使蛇身分开
      
      this.roundRect(
        this.ctx,
        x + 1,
        y + 1,
        size,
        size,
        5
      );
    }
  }
  
  // 绘制食物
  drawFood() {
    this.ctx.fillStyle = '#e74c3c';
    
    const x = this.food.x * config.gridSize;
    const y = this.food.y * config.gridSize;
    const size = config.gridSize - 2;
    
    // 绘制圆形食物
    this.ctx.beginPath();
    this.ctx.arc(
      x + config.gridSize / 2,
      y + config.gridSize / 2,
      size / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }
  
  // 绘制圆角矩形
  roundRect(ctx, x, y, width, height, radius) {
    radius = Math.min(radius, width / 2, height / 2);
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
  }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  const game = new SnakeGame();
  
  // 初始化游戏界面
  game.initGame();
}); 