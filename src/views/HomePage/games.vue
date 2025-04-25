<template>
  <div class="games-container">
    <div class="games-title">
      <h2>休闲娱乐</h2>
      <p>在这里享受轻松的休闲时光</p>
    </div>
    
    <div class="games-content">
      <div class="game-frame">
        <iframe 
          id="gameFrame" 
          :src="currentGame.url" 
          frameborder="0" 
          allowfullscreen
        ></iframe>
      </div>
      
      <div class="game-list">
        <div 
          v-for="(game, index) in gameList" 
          :key="index" 
          class="game-item" 
          :class="{ active: currentGame.id === game.id }"
          @click="switchGame(game)"
        >
          <div class="game-icon">
            <i :class="game.icon"></i>
          </div>
          <div class="game-info">
            <h3>{{ game.name }}</h3>
            <p>{{ game.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GamesPage',
  data() {
    return {
      currentGame: {},
      gameList: [
        {
          id: 1,
          name: '超级马里奥',
          description: '经典的超级马里奥冒险游戏',
          icon: 'el-icon-video-play',
          url: '/Mario_game/index.html'
        },
        {
          id: 2,
          name: '贪吃蛇',
          description: '经典的贪吃蛇游戏',
          icon: 'el-icon-connection',
          url: '/games/snake/index.html'
        },
        {
          id: 3,
          name: '俄罗斯方块',
          description: '经典俄罗斯方块',
          icon: 'el-icon-heavy-rain',
          url: '/games/tetris/index.html'
        },
        {
          id: 4,
          name: '记忆力游戏',
          description: '锻炼你的记忆力',
          icon: 'el-icon-magic-stick',
          url: '/games/memory/index.html'
        }
      ]
    }
  },
  created() {
    // 默认加载第一个游戏
    if (this.gameList.length > 0) {
      this.currentGame = this.gameList[0]
    }
  },
  methods: {
    switchGame(game) {
      this.currentGame = game
    }
  }
}
</script>

<style scoped>
.games-container {
  padding: 20px;
  min-height: calc(100vh - 120px);
  position: relative;
}

.games-title {
  text-align: center;
  margin-bottom: 30px;
}

.games-title h2 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.games-title p {
  color: #606266;
}

.games-content {
  display: flex;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.games-content:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.game-frame {
  flex: 3;
  min-height: 600px;
  position: relative;
}

.game-frame iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.game-list {
  flex: 1;
  background-color: rgba(240, 242, 245, 0.5);
  padding: 15px;
  max-width: 300px;
}

.game-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: rgba(255, 255, 255, 0.7);
}

.game-item:hover {
  background-color: #f2f6fc;
  transform: translateY(-2px);
}

.game-item.active {
  background-color: rgba(236, 245, 255, 0.7);
  border-left: 3px solid #409eff;
}

.game-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.game-icon i {
  font-size: 20px;
}

.game-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.game-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

@media screen and (max-width: 768px) {
  .games-content {
    flex-direction: column;
  }
  
  .game-list {
    max-width: 100%;
  }
  
  .game-frame {
    min-height: 400px;
  }
}
</style> 