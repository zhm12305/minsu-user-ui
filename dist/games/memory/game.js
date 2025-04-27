// 游戏配置
const config = {
  // 不同难度的卡片数量
  difficulty: {
    easy: { rows: 4, cols: 4, cardClass: 'card-easy' },
    medium: { rows: 4, cols: 6, cardClass: 'card-medium' },
    hard: { rows: 6, cols: 6, cardClass: 'card-hard' }
  },
  // 翻牌延迟（毫秒）
  flipDelay: 1000,
  // 游戏图标
  icons: [
    '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦄', '🐝', '🦋', '🐢', '🦎', '🐙', '🦑', '🦐',
    '🦞', '🦀', '🐠', '🐬', '🐳', '🦓', '🦒', '🦘',
    '🦝', '🦡', '🐘', '🦏', '🦛', '🦔', '🐿️', '🦇'
  ]
};

// 游戏状态
class MemoryGame {
  constructor() {
    // 游戏元素
    this.gameBoard = document.getElementById('game-board');
    this.timerElement = document.getElementById('timer');
    this.movesElement = document.getElementById('moves');
    this.resultTimeElement = document.getElementById('result-time');
    this.resultMovesElement = document.getElementById('result-moves');
    this.gameMessageElement = document.getElementById('game-message');
    
    // 游戏状态
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 0;
    this.moves = 0;
    this.gameStarted = false;
    this.timerInterval = null;
    this.startTime = 0;
    this.currentTime = 0;
    this.difficulty = 'medium';
    
    // 设置事件监听
    this.setupEventListeners();
    
    // 初始化游戏
    this.startNewGame();
  }
  
  // 设置事件监听
  setupEventListeners() {
    // 难度选择
    document.getElementById('difficulty-select').addEventListener('change', (e) => {
      this.difficulty = e.target.value;
      this.startNewGame();
    });
    
    // 新游戏按钮
    document.getElementById('new-game-button').addEventListener('click', () => {
      this.startNewGame();
    });
    
    // 再玩一次按钮
    document.getElementById('play-again-button').addEventListener('click', () => {
      this.startNewGame();
      this.hideGameMessage();
    });
  }
  
  // 开始新游戏
  startNewGame() {
    // 重置游戏状态
    this.resetGame();
    
    // 创建并洗牌
    this.createCards();
    
    // 渲染游戏面板
    this.renderGameBoard();
  }
  
  // 重置游戏状态
  resetGame() {
    // 清除计时器
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // 重置游戏状态
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameStarted = false;
    this.startTime = 0;
    this.currentTime = 0;
    
    // 更新显示
    this.updateMovesDisplay();
    this.updateTimerDisplay();
    
    // 清空游戏面板
    this.gameBoard.innerHTML = '';
  }
  
  // 创建卡片
  createCards() {
    const difficultyConfig = config.difficulty[this.difficulty];
    const rows = difficultyConfig.rows;
    const cols = difficultyConfig.cols;
    
    // 计算需要的对数
    this.totalPairs = Math.floor(rows * cols / 2);
    
    // 创建卡片配对
    const cardValues = [];
    for (let i = 0; i < this.totalPairs; i++) {
      const iconIndex = i % config.icons.length;
      const icon = config.icons[iconIndex];
      
      // 添加一对相同的卡片
      cardValues.push(icon);
      cardValues.push(icon);
    }
    
    // 洗牌
    this.shuffle(cardValues);
    
    // 创建卡片对象
    this.cards = cardValues.map((value, index) => ({
      id: index,
      value: value,
      flipped: false,
      matched: false
    }));
  }
  
  // 洗牌算法（Fisher-Yates）
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // 渲染游戏面板
  renderGameBoard() {
    const difficultyConfig = config.difficulty[this.difficulty];
    
    // 设置游戏板网格布局
    this.gameBoard.className = `game-board ${this.difficulty}`;
    
    // 添加卡片到游戏板
    this.cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = `card ${difficultyConfig.cardClass}`;
      cardElement.dataset.id = card.id;
      
      // 创建卡片正面
      const frontFace = document.createElement('div');
      frontFace.className = 'card-face card-front';
      
      // 创建卡片背面
      const backFace = document.createElement('div');
      backFace.className = 'card-face card-back';
      backFace.textContent = card.value;
      
      // 添加点击事件
      cardElement.addEventListener('click', () => {
        this.flipCard(card.id);
      });
      
      // 将正反面添加到卡片
      cardElement.appendChild(frontFace);
      cardElement.appendChild(backFace);
      
      // 将卡片添加到游戏板
      this.gameBoard.appendChild(cardElement);
    });
  }
  
  // 翻转卡片
  flipCard(cardId) {
    // 查找卡片
    const card = this.cards.find(c => c.id === cardId);
    
    // 如果卡片已翻转或已匹配，则忽略
    if (!card || card.flipped || card.matched) return;
    
    // 如果已经翻转了两张卡片并且正在检查是否匹配，则忽略
    if (this.flippedCards.length === 2) return;
    
    // 如果游戏尚未开始，则启动计时器
    if (!this.gameStarted) {
      this.startGame();
    }
    
    // 翻转卡片
    card.flipped = true;
    this.flippedCards.push(card);
    
    // 更新卡片显示
    this.updateCardDisplay(card);
    
    // 如果翻转了两张卡片，检查是否匹配
    if (this.flippedCards.length === 2) {
      // 增加移动次数
      this.moves++;
      this.updateMovesDisplay();
      
      // 检查是否匹配
      this.checkForMatch();
    }
  }
  
  // 检查翻转的卡片是否匹配
  checkForMatch() {
    const [firstCard, secondCard] = this.flippedCards;
    
    if (firstCard.value === secondCard.value) {
      // 匹配成功
      firstCard.matched = true;
      secondCard.matched = true;
      this.matchedPairs++;
      
      // 更新卡片显示
      this.updateCardDisplay(firstCard);
      this.updateCardDisplay(secondCard);
      
      // 重置翻转的卡片
      this.flippedCards = [];
      
      // 检查游戏是否结束
      if (this.matchedPairs === this.totalPairs) {
        this.endGame();
      }
    } else {
      // 匹配失败，延迟翻回
      setTimeout(() => {
        firstCard.flipped = false;
        secondCard.flipped = false;
        
        // 更新卡片显示
        this.updateCardDisplay(firstCard);
        this.updateCardDisplay(secondCard);
        
        // 重置翻转的卡片
        this.flippedCards = [];
      }, config.flipDelay);
    }
  }
  
  // 更新卡片显示
  updateCardDisplay(card) {
    const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
    
    if (card.flipped) {
      cardElement.classList.add('flipped');
    } else {
      cardElement.classList.remove('flipped');
    }
    
    if (card.matched) {
      cardElement.classList.add('matched');
    }
  }
  
  // 开始游戏
  startGame() {
    this.gameStarted = true;
    this.startTime = Date.now();
    
    // 启动计时器
    this.timerInterval = setInterval(() => {
      this.currentTime = Date.now();
      const elapsedSeconds = Math.floor((this.currentTime - this.startTime) / 1000);
      this.updateTimerDisplay(elapsedSeconds);
    }, 1000);
  }
  
  // 结束游戏
  endGame() {
    // 停止计时器
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // 计算总时间
    const totalTime = Math.floor((this.currentTime - this.startTime) / 1000);
    
    // 更新结果显示
    this.resultTimeElement.textContent = this.formatTime(totalTime);
    this.resultMovesElement.textContent = this.moves;
    
    // 显示游戏结束消息
    this.showGameMessage();
  }
  
  // 更新移动次数显示
  updateMovesDisplay() {
    this.movesElement.textContent = this.moves;
  }
  
  // 更新计时器显示
  updateTimerDisplay(seconds = 0) {
    this.timerElement.textContent = this.formatTime(seconds);
  }
  
  // 格式化时间
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // 显示游戏结束消息
  showGameMessage() {
    this.gameMessageElement.style.display = 'flex';
  }
  
  // 隐藏游戏结束消息
  hideGameMessage() {
    this.gameMessageElement.style.display = 'none';
  }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  const game = new MemoryGame();
}); 