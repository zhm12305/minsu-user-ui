// 游戏配置
const config = {
  cols: 10,        // 游戏区域列数
  rows: 20,        // 游戏区域行数
  blockSize: 24,   // 方块大小(像素)
  speed: 700,      // 初始下落速度（毫秒）
  speedFactor: 0.8 // 每升一级速度增加因子
};

// 方块形状和颜色
const tetrominoes = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'piece-I'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'piece-J'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'piece-L'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'piece-O'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 'piece-S'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'piece-T'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'piece-Z'
  }
};

// 游戏状态常量
const GameState = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

// 主游戏类
class TetrisGame {
  constructor() {
    // 游戏画布
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // 预览下一个方块的画布
    this.nextCanvas = document.getElementById('next-canvas');
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    // 游戏数据
    this.board = [];        // 游戏区域
    this.currentPiece = null; // 当前方块
    this.nextPiece = null;  // 下一个方块
    this.score = 0;         // 分数
    this.lines = 0;         // 消除的行数
    this.level = 1;         // 游戏等级
    
    // 游戏状态
    this.gameState = GameState.READY;
    this.gameLoop = null;   // 游戏循环计时器
    
    // 初始化游戏区域
    this.initBoard();
    
    // 设置事件监听
    this.setupEventListeners();
    
    // 首次渲染游戏界面
    this.render();
  }
  
  // 初始化游戏区域
  initBoard() {
    this.board = Array(config.rows).fill().map(() => Array(config.cols).fill(null));
  }
  
  // 设置事件监听
  setupEventListeners() {
    // 键盘控制
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // 触摸按钮控制
    document.getElementById('left-button').addEventListener('click', () => {
      this.movePiece(-1, 0);
    });
    document.getElementById('right-button').addEventListener('click', () => {
      this.movePiece(1, 0);
    });
    document.getElementById('down-button').addEventListener('click', () => {
      this.movePiece(0, 1);
    });
    document.getElementById('rotate-button').addEventListener('click', () => {
      this.rotatePiece();
    });
    document.getElementById('drop-button').addEventListener('click', () => {
      this.dropPiece();
    });
    
    // 游戏控制按钮
    document.getElementById('start-button').addEventListener('click', () => {
      if (this.gameState === GameState.READY || this.gameState === GameState.GAME_OVER) {
        this.startGame();
      } else if (this.gameState === GameState.PAUSED) {
        this.resumeGame();
      }
    });
    document.getElementById('pause-button').addEventListener('click', () => {
      if (this.gameState === GameState.PLAYING) {
        this.pauseGame();
      } else if (this.gameState === GameState.PAUSED) {
        this.resumeGame();
      }
    });
    document.getElementById('retry-button').addEventListener('click', () => {
      this.resetGame();
      this.startGame();
    });
  }
  
  // 处理键盘事件
  handleKeyDown(event) {
    if (this.gameState !== GameState.PLAYING) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        this.movePiece(-1, 0);
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.movePiece(1, 0);
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.movePiece(0, 1);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.rotatePiece();
        event.preventDefault();
        break;
      case ' ':
        this.dropPiece();
        event.preventDefault();
        break;
      case 'p':
      case 'P':
        this.pauseGame();
        break;
    }
  }
  
  // 开始游戏
  startGame() {
    this.resetGame();
    this.gameState = GameState.PLAYING;
    
    // 生成第一个方块和下一个方块
    this.currentPiece = this.createRandomPiece();
    this.nextPiece = this.createRandomPiece();
    
    // 更新按钮文字
    document.getElementById('start-button').textContent = '继续';
    document.getElementById('pause-button').textContent = '暂停';
    
    // 设置游戏循环
    this.startGameLoop();
  }
  
  // 重置游戏
  resetGame() {
    // 停止游戏循环
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    // 重置游戏状态
    this.initBoard();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.updateStats();
    
    // 隐藏游戏结束消息
    document.getElementById('game-message').style.display = 'none';
    
    // 重置按钮文字
    document.getElementById('start-button').textContent = '开始游戏';
    document.getElementById('pause-button').textContent = '暂停';
    
    // 重新渲染
    this.render();
  }
  
  // 暂停游戏
  pauseGame() {
    if (this.gameState === GameState.PLAYING) {
      this.gameState = GameState.PAUSED;
      clearInterval(this.gameLoop);
      this.gameLoop = null;
      
      // 更新按钮文字
      document.getElementById('pause-button').textContent = '继续';
      
      // 显示暂停消息
      const messageElement = document.getElementById('game-message');
      const messageText = document.getElementById('message-text');
      messageText.textContent = '游戏暂停';
      messageElement.style.display = 'flex';
    }
  }
  
  // 继续游戏
  resumeGame() {
    if (this.gameState === GameState.PAUSED) {
      this.gameState = GameState.PLAYING;
      
      // 更新按钮文字
      document.getElementById('pause-button').textContent = '暂停';
      
      // 隐藏暂停消息
      document.getElementById('game-message').style.display = 'none';
      
      // 重新启动游戏循环
      this.startGameLoop();
    }
  }
  
  // 结束游戏
  gameOver() {
    this.gameState = GameState.GAME_OVER;
    
    // 停止游戏循环
    clearInterval(this.gameLoop);
    this.gameLoop = null;
    
    // 重置按钮文字
    document.getElementById('start-button').textContent = '开始游戏';
    
    // 显示游戏结束消息
    const messageElement = document.getElementById('game-message');
    const messageText = document.getElementById('message-text');
    const finalScoreElement = document.getElementById('final-score');
    
    messageText.textContent = '游戏结束';
    finalScoreElement.textContent = this.score;
    messageElement.style.display = 'flex';
  }
  
  // 启动游戏循环
  startGameLoop() {
    const speed = config.speed * Math.pow(config.speedFactor, this.level - 1);
    this.gameLoop = setInterval(() => {
      this.update();
    }, speed);
  }
  
  // 更新游戏状态 - 每个循环调用
  update() {
    // 尝试向下移动当前方块
    const moved = this.movePiece(0, 1);
    
    // 如果不能移动，说明方块已经到底
    if (!moved) {
      // 将当前方块固定到游戏区域
      this.lockPiece();
      
      // 检查是否有可以消除的行
      const clearedLines = this.clearLines();
      if (clearedLines > 0) {
        // 更新分数和消除行数
        this.updateScore(clearedLines);
      }
      
      // 生成新的方块
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.createRandomPiece();
      
      // 检查游戏是否结束
      if (this.checkCollision(this.currentPiece)) {
        this.gameOver();
        return;
      }
    }
    
    // 更新游戏显示
    this.render();
  }
  
  // 创建随机方块
  createRandomPiece() {
    const types = Object.keys(tetrominoes);
    const type = types[Math.floor(Math.random() * types.length)];
    const tetromino = tetrominoes[type];
    
    return {
      shape: JSON.parse(JSON.stringify(tetromino.shape)), // 深拷贝
      color: tetromino.color,
      x: Math.floor(config.cols / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0
    };
  }
  
  // 移动当前方块
  movePiece(dx, dy) {
    if (!this.currentPiece || this.gameState !== GameState.PLAYING) return false;
    
    // 尝试移动
    this.currentPiece.x += dx;
    this.currentPiece.y += dy;
    
    // 检查是否发生碰撞
    if (this.checkCollision(this.currentPiece)) {
      // 如果发生碰撞，撤销移动
      this.currentPiece.x -= dx;
      this.currentPiece.y -= dy;
      return false;
    }
    
    // 渲染游戏
    this.render();
    return true;
  }
  
  // 旋转当前方块
  rotatePiece() {
    if (!this.currentPiece || this.gameState !== GameState.PLAYING) return false;
    
    // 保存原形状和位置
    const originalShape = JSON.parse(JSON.stringify(this.currentPiece.shape));
    const originalX = this.currentPiece.x;
    const originalY = this.currentPiece.y;
    
    // 执行旋转 - 顺时针旋转90度
    const size = this.currentPiece.shape.length;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        this.currentPiece.shape[y][x] = originalShape[size - 1 - x][y];
      }
    }
    
    // 检查旋转后是否发生碰撞
    if (this.checkCollision(this.currentPiece)) {
      // 尝试左移一格
      this.currentPiece.x -= 1;
      if (!this.checkCollision(this.currentPiece)) {
        // 左移成功，保留旋转
        this.render();
        return true;
      }
      
      // 恢复位置，尝试右移一格
      this.currentPiece.x = originalX + 1;
      if (!this.checkCollision(this.currentPiece)) {
        // 右移成功，保留旋转
        this.render();
        return true;
      }
      
      // 如果都失败，恢复原形状和位置
      this.currentPiece.shape = originalShape;
      this.currentPiece.x = originalX;
      this.currentPiece.y = originalY;
      return false;
    }
    
    // 渲染游戏
    this.render();
    return true;
  }
  
  // 一键下落到底部
  dropPiece() {
    if (!this.currentPiece || this.gameState !== GameState.PLAYING) return;
    
    // 一直向下移动，直到不能再移动
    while (this.movePiece(0, 1)) {
      // 继续移动
    }
    
    // 触发一次更新，锁定方块
    this.update();
  }
  
  // 检查碰撞
  checkCollision(piece) {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          // 检查是否超出边界
          if (boardX < 0 || boardX >= config.cols || boardY < 0 || boardY >= config.rows) {
            return true;
          }
          
          // 检查是否与已有方块重叠
          if (boardY >= 0 && this.board[boardY] && this.board[boardY][boardX]) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
  // 锁定当前方块到游戏区域
  lockPiece() {
    if (!this.currentPiece) return;
    
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x]) {
          const boardX = this.currentPiece.x + x;
          const boardY = this.currentPiece.y + y;
          
          if (boardY >= 0 && boardY < config.rows && boardX >= 0 && boardX < config.cols) {
            this.board[boardY][boardX] = {
              color: this.currentPiece.color
            };
          }
        }
      }
    }
  }
  
  // 清除已填满的行
  clearLines() {
    let linesCleared = 0;
    
    for (let y = config.rows - 1; y >= 0; y--) {
      // 检查当前行是否已填满
      const isRowFull = this.board[y].every(cell => cell !== null);
      
      if (isRowFull) {
        // 清除该行，并在顶部添加一行空白
        this.board.splice(y, 1);
        this.board.unshift(Array(config.cols).fill(null));
        
        // 因为删除了一行，需要重新检查当前索引
        y++;
        linesCleared++;
      }
    }
    
    return linesCleared;
  }
  
  // 更新分数和等级
  updateScore(linesCleared) {
    if (linesCleared === 0) return;
    
    // 更新分数 - 消除的行数越多，得分越高
    const points = [0, 100, 300, 500, 800];
    this.score += points[linesCleared] * this.level;
    
    // 更新消除的行数
    this.lines += linesCleared;
    
    // 每消除10行升一级
    const newLevel = Math.floor(this.lines / 10) + 1;
    
    if (newLevel > this.level) {
      this.level = newLevel;
      
      // 升级后重新设置游戏速度
      if (this.gameLoop) {
        clearInterval(this.gameLoop);
        this.startGameLoop();
      }
    }
    
    // 更新显示
    this.updateStats();
  }
  
  // 更新统计信息显示
  updateStats() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('lines').textContent = this.lines;
    document.getElementById('level').textContent = this.level;
  }
  
  // 渲染游戏
  render() {
    // 清空主画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制游戏区域
    this.renderBoard();
    
    // 绘制当前方块
    if (this.currentPiece) {
      this.renderPiece(this.ctx, this.currentPiece, config.blockSize);
    }
    
    // 清空预览画布
    this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    
    // 绘制下一个方块
    if (this.nextPiece) {
      // 将下一个方块居中显示在预览区域
      const centerX = Math.floor((this.nextCanvas.width / config.blockSize - this.nextPiece.shape[0].length) / 2);
      const centerY = Math.floor((this.nextCanvas.height / config.blockSize - this.nextPiece.shape.length) / 2);
      
      const centeredPiece = {
        ...this.nextPiece,
        x: centerX,
        y: centerY
      };
      
      this.renderPiece(this.nextCtx, centeredPiece, config.blockSize);
    }
  }
  
  // 渲染游戏区域
  renderBoard() {
    for (let y = 0; y < config.rows; y++) {
      for (let x = 0; x < config.cols; x++) {
        const cell = this.board[y][x];
        
        if (cell) {
          // 绘制有颜色的方块
          this.drawBlock(this.ctx, x, y, cell.color);
        } else {
          // 绘制空白方块
          this.drawEmptyBlock(this.ctx, x, y);
        }
      }
    }
  }
  
  // 渲染一个方块
  renderPiece(ctx, piece, blockSize) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          this.drawBlock(ctx, boardX, boardY, piece.color);
        }
      }
    }
  }
  
  // 绘制一个方块
  drawBlock(ctx, x, y, colorClass) {
    const blockSize = config.blockSize;
    
    // 设置方块样式
    let color;
    switch (colorClass) {
      case 'piece-I': color = '#00f0f0'; break;
      case 'piece-O': color = '#f0f000'; break;
      case 'piece-T': color = '#a000f0'; break;
      case 'piece-S': color = '#00f000'; break;
      case 'piece-Z': color = '#f00000'; break;
      case 'piece-J': color = '#0000f0'; break;
      case 'piece-L': color = '#f0a000'; break;
      default: color = '#888888';
    }
    
    // 绘制主体
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    
    // 绘制高光边缘
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, 1);
    ctx.fillRect(x * blockSize, y * blockSize, 1, blockSize);
    
    // 绘制阴影边缘
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x * blockSize + blockSize - 1, y * blockSize, 1, blockSize);
    ctx.fillRect(x * blockSize, y * blockSize + blockSize - 1, blockSize, 1);
  }
  
  // 绘制空方块
  drawEmptyBlock(ctx, x, y) {
    const blockSize = config.blockSize;
    
    // 绘制网格线
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    
    // 绘制边框
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
  }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  const game = new TetrisGame();
}); 