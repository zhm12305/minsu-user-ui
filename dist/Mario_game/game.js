// 游戏主要逻辑
document.addEventListener('DOMContentLoaded', () => {
    console.log("游戏脚本开始初始化");
    
    // 初始化认证功能
    initAuth();
    
    // 获取所有屏幕元素
    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const victoryRestartButton = document.getElementById('victory-restart-button');
    const scoreDisplay = document.querySelector('#score span');
    const coinsDisplay = document.querySelector('#coins span');
    const livesDisplay = document.querySelector('#lives span');
    const finalScoreDisplay = document.getElementById('final-score');
    const victoryScoreDisplay = document.getElementById('victory-score');
    const gameWorld = document.getElementById('game-world');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginMessage = document.getElementById('login-message');
    
    // 检查DOM元素
    console.log("检查游戏DOM元素:");
    console.log("gameWorld:", gameWorld);
    console.log("startButton:", startButton);
    console.log("scoreDisplay:", scoreDisplay);
    console.log("finalScoreDisplay:", finalScoreDisplay);
    console.log("victoryScoreDisplay:", victoryScoreDisplay);
    
    // 检查登录状态并更新界面
    function updateLoginState() {
        const isLoggedIn = isUserLoggedIn(); // 这个函数应该在auth.js中定义
        
        if (isLoggedIn) {
            startButton.classList.remove('disabled');
            loginButton.classList.add('hidden');
            registerButton.classList.add('hidden');
            loginMessage.classList.add('hidden');
            startButton.disabled = false;
        } else {
            startButton.classList.add('disabled');
            loginButton.classList.remove('hidden');
            registerButton.classList.remove('hidden');
            loginMessage.classList.remove('hidden');
            startButton.disabled = true;
        }
    }
    
    // 隐藏除加载屏幕外的所有屏幕
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    
    // 模拟加载进度
    let progress = 0;
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    
    const loadingInterval = setInterval(() => {
        progress += 5;
        loadingBar.style.width = `${progress}%`;
        loadingText.textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            // 使用淡出效果隐藏加载屏幕
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                startScreen.classList.remove('hidden');
                // 使用淡入效果显示开始屏幕
                startScreen.style.opacity = '0';
                startScreen.style.transition = 'opacity 0.5s ease-in';
                requestAnimationFrame(() => {
                    startScreen.style.opacity = '1';
                });
                
                // 更新登录状态
                updateLoginState();
            }, 500);
        }
    }, 100);

    // 游戏状态
    const gameState = {
        isRunning: false,
        isPaused: false,
        score: 0,
        coinCount: 0,
        lives: 3,
        gameOver: false,
        victory: false,
        mario: {
            x: 50,
            y: 520,
            width: 30,
            height: 40,
            velocityX: 0,
            velocityY: 0,
            isJumping: false,
            direction: 'right',
            state: 'standing',
            animationFrame: 0,
            isInvincible: false
        },
        enemies: [],
        platforms: [],
        coins: [],
        decorations: [],
        keys: {
            left: false,
            right: false,
            space: false
        },
        camera: {
            x: 0
        },
        levelGeneration: {
            lastPlatformX: 0,
            lastCoinX: 0,
            lastEnemyX: 0,
            lastDecorationX: 0,
            generationThreshold: 800
        },
        lastPlatformX: 0,
        lastPlatformY: 0,
        cameraX: 0,
        victoryFlag: null,
        invincibleTimer: 0,
        flagAdded: false
    };

    // 将游戏状态暴露给全局，以便其他脚本可以访问
    window.gameState = gameState;

    // 游戏参数
    const GRAVITY = 0.5;
    const JUMP_FORCE = -15;
    const MOVEMENT_SPEED = 3;
    const PLATFORM_WIDTH = 40;
    const PLATFORM_HEIGHT = 40;
    const COIN_SIZE = 20;
    const ENEMY_WIDTH = 30;
    const ENEMY_HEIGHT = 30;
    const ENEMY_SPEED = 1;
    const INVINCIBILITY_DURATION = 3000;

    // 初始化游戏
    function initGame() {
        console.log("初始化游戏");
        
        // 重置游戏状态
        gameState.isRunning = true;
        gameState.isPaused = false;
        gameState.score = 0;
        gameState.coinCount = 0;
        gameState.lives = 3;
        gameState.gameOver = false;
        gameState.victory = false;
        gameState.mario.x = 50;
        gameState.mario.y = 520;
        gameState.mario.velocityX = 0;
        gameState.mario.velocityY = 0;
        gameState.mario.isJumping = false;
        gameState.mario.direction = 'right';
        gameState.mario.state = 'standing';
        gameState.mario.animationFrame = 0;
        gameState.mario.isInvincible = false;
        gameState.enemies = [];
        gameState.platforms = [];
        gameState.coins = [];
        gameState.decorations = [];
        gameState.camera.x = 0;
        gameState.levelGeneration.lastPlatformX = 0;
        gameState.levelGeneration.lastCoinX = 0;
        gameState.levelGeneration.lastEnemyX = 0;
        gameState.levelGeneration.lastDecorationX = 0;
        gameState.lastPlatformX = 0;
        gameState.lastPlatformY = 0;
        gameState.cameraX = 0;
        gameState.victoryFlag = null;
        gameState.invincibleTimer = 0;
        gameState.flagAdded = false;

        // 清空游戏世界
        gameWorld.innerHTML = '';

        // 创建马里奥
        const marioElement = document.createElement('div');
        marioElement.className = 'mario';
        marioElement.innerHTML = ASSETS.mario.standing;
        marioElement.style.left = `${gameState.mario.x}px`;
        marioElement.style.top = `${gameState.mario.y}px`;
        gameWorld.appendChild(marioElement);
        gameState.mario.element = marioElement;

        // 生成初始关卡
        generateInitialLevel();

        // 更新显示
        updateDisplay();

        // 开始游戏循环
        gameLoop();

        // 初始化游戏控制
        initGameControls();
        
        // 更新显示
        scoreDisplay.textContent = gameState.score;
        coinsDisplay.textContent = gameState.coinCount;
        livesDisplay.textContent = gameState.lives;
        
        console.log("游戏初始化完成");
    }

    // 生成初始关卡
    function generateInitialLevel() {
        console.log("生成初始关卡");
        
        // 生成地面平台
        for (let x = 0; x < 1000; x += PLATFORM_WIDTH) {
            const platformElement = document.createElement('div');
            platformElement.className = 'platform';
            platformElement.innerHTML = ASSETS.platform.middle;
            platformElement.style.left = `${x}px`;
            platformElement.style.top = `${560}px`;
            platformElement.dataset.x = x;
            platformElement.id = `platform-${x}`;
            gameWorld.appendChild(platformElement);
            
            gameState.platforms.push({
                x: x,
                y: 560,
                width: PLATFORM_WIDTH,
                height: PLATFORM_HEIGHT,
                element: platformElement,
                isGround: true
            });
        }
        
        // 更新最后平台的位置
        gameState.levelGeneration.lastPlatformX = 1000;
        
        // 生成初始浮动平台 - 预设的平台位置
        const initialFloatingPlatforms = [
            {x: 180, y: 420, width: 3},
            {x: 320, y: 380, width: 2},
            {x: 500, y: 450, width: 3},
            {x: 650, y: 400, width: 2},
            {x: 800, y: 420, width: 3}
        ];
        
        initialFloatingPlatforms.forEach(platform => {
            for (let i = 0; i < platform.width; i++) {
                const platformX = platform.x + i * PLATFORM_WIDTH;
                const platformElement = document.createElement('div');
                platformElement.className = 'platform';
                platformElement.innerHTML = ASSETS.platform.floating;
                platformElement.style.left = `${platformX}px`;
                platformElement.style.top = `${platform.y}px`;
                platformElement.dataset.x = platformX;
                gameWorld.appendChild(platformElement);
                
                gameState.platforms.push({
                    x: platformX,
                    y: platform.y,
                    width: PLATFORM_WIDTH,
                    height: 20,
                    element: platformElement,
                    isGround: false
                });
            }
        });

        // 生成初始金币 - 预设的金币位置
        const initialCoins = [
            {x: 220, y: 380},
            {x: 260, y: 380},
            {x: 370, y: 340},
            {x: 520, y: 410},
            {x: 560, y: 410},
            {x: 670, y: 360},
            {x: 820, y: 380}
        ];
        
        initialCoins.forEach(coin => {
            const coinElement = document.createElement('div');
            coinElement.className = 'coin';
            coinElement.innerHTML = ASSETS.coin;
            coinElement.style.left = `${coin.x}px`;
            coinElement.style.top = `${coin.y}px`;
            coinElement.dataset.x = coin.x;
            gameWorld.appendChild(coinElement);
            
            gameState.coins.push({
                x: coin.x,
                y: coin.y,
                width: COIN_SIZE,
                height: COIN_SIZE,
                element: coinElement,
                collected: false
            });
        });

        // 更新最后金币的位置
        gameState.levelGeneration.lastCoinX = 820;
        
        // 生成初始敌人 - 预设的敌人位置
        const initialEnemies = [
            {x: 300, y: 530, minX: 250, maxX: 350},
            {x: 600, y: 530, minX: 550, maxX: 650},
            {x: 850, y: 530, minX: 800, maxX: 900}
        ];
        
        initialEnemies.forEach(enemy => {
            const enemyElement = document.createElement('div');
            enemyElement.className = 'enemy';
            enemyElement.innerHTML = ASSETS.enemy.mushroom;
            enemyElement.style.left = `${enemy.x}px`;
            enemyElement.style.top = `${enemy.y}px`;
            enemyElement.dataset.x = enemy.x;
            gameWorld.appendChild(enemyElement);
            
            gameState.enemies.push({
                x: enemy.x,
                y: enemy.y,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT,
                element: enemyElement,
                direction: Math.random() < 0.5 ? -1 : 1,
                minX: enemy.minX,
                maxX: enemy.maxX
            });
        });

        // 更新最后敌人的位置
        gameState.levelGeneration.lastEnemyX = 850;
        
        // 生成初始装饰元素 - 预设的装饰位置
        const initialDecorations = [
            {type: 'cloud', x: 100, y: 80},
            {type: 'cloud', x: 300, y: 50},
            {type: 'cloud', x: 600, y: 70},
            {type: 'cloud', x: 900, y: 60},
            {type: 'mountain', x: 150, y: 500},
            {type: 'mountain', x: 450, y: 500},
            {type: 'mountain', x: 750, y: 500},
            {type: 'pipe', x: 350, y: 480},
            {type: 'pipe', x: 650, y: 480}
        ];
        
        initialDecorations.forEach(decoration => {
            const decorationElement = document.createElement('div');
            decorationElement.className = 'decoration';
            decorationElement.innerHTML = ASSETS.decoration[decoration.type];
            decorationElement.style.left = `${decoration.x}px`;
            decorationElement.style.top = `${decoration.y}px`;
            decorationElement.style.zIndex = '1';
            decorationElement.dataset.x = decoration.x;
            gameWorld.appendChild(decorationElement);
            
            gameState.decorations.push({
                type: decoration.type,
                x: decoration.x,
                y: decoration.y,
                element: decorationElement
            });
        });
        
        // 更新最后装饰元素的位置
        gameState.levelGeneration.lastDecorationX = 900;
    }

    // 游戏循环
    function gameLoop() {
        if (!gameState.isRunning) return;
        
        // 如果游戏暂停，不更新游戏状态
        if (gameState.isPaused) {
            requestAnimationFrame(gameLoop);
            return;
        }
        
        // 检查并生成新内容
        checkAndGenerateNewContent();
        
        // 更新马里奥
        updateMario();
        
        // 更新敌人
        updateEnemies();
        
        // 检测碰撞
        detectCollisions();
        
        // 更新摄像机
        updateCamera();
        
        // 更新固定元素
        updateFixedElements();
        
        // 检查游戏结束
        checkGameOver();
        
        // 更新显示
        updateDisplay();
        
        // 继续游戏循环
        requestAnimationFrame(gameLoop);
    }

    // 检查并生成新内容
    function checkAndGenerateNewContent() {
        // 检查是否需要添加胜利旗帜
        if (!gameState.flagAdded && gameState.mario.x > 5500) {
            console.log("马里奥到达5500位置，添加胜利旗帜");
            addVictoryFlag();
            gameState.flagAdded = true;
            
            // 确保旗帜已正确添加
            setTimeout(() => {
                const flagDecoration = gameState.decorations.find(d => d.type === 'flag');
                if (flagDecoration && flagDecoration.element) {
                    console.log("旗帜已成功添加，位置:", flagDecoration.x);
                    // 强制更新旗帜位置
                    flagDecoration.element.style.left = `${flagDecoration.x - gameState.camera.x}px`;
                    flagDecoration.element.style.display = 'block';
                } else {
                    console.error("旗帜添加失败");
                }
            }, 100);
        }
        
        // 如果马里奥接近旗帜，不再生成新内容
        if (gameState.flagPosition && gameState.mario.x > gameState.flagPosition - 1000) {
            return;
        }
        
        // 检查是否需要生成新平台
        if (gameState.mario.x > gameState.levelGeneration.lastPlatformX - gameState.levelGeneration.generationThreshold) {
            generateNewPlatforms();
        }
        
        // 检查是否需要生成新金币
        if (gameState.mario.x > gameState.levelGeneration.lastCoinX - gameState.levelGeneration.generationThreshold) {
            generateNewCoins();
        }
        
        // 检查是否需要生成新敌人
        if (gameState.mario.x > gameState.levelGeneration.lastEnemyX - gameState.levelGeneration.generationThreshold) {
            generateNewEnemies();
        }
        
        // 检查是否需要生成新装饰
        if (gameState.mario.x > gameState.levelGeneration.lastDecorationX - gameState.levelGeneration.generationThreshold) {
            generateNewDecorations();
        }
    }

    // 生成新平台
    function generateNewPlatforms() {
        const startX = gameState.levelGeneration.lastPlatformX;
        let endX = startX + 1000;
        
        // 确保不会在旗帜后面生成平台
        if (gameState.flagPosition && endX > gameState.flagPosition) {
            endX = gameState.flagPosition;
        }
        
        // 如果起始位置已经超过旗帜位置，则不生成新平台
        if (gameState.flagPosition && startX >= gameState.flagPosition) {
            return;
        }
        
        // 生成新平台
        for (let x = startX; x < endX; x += PLATFORM_WIDTH) {
            const platformElement = document.createElement('div');
            platformElement.className = 'platform';
            platformElement.innerHTML = ASSETS.platform.middle;
            platformElement.style.left = `${x - gameState.camera.x}px`;
            platformElement.style.top = `${560}px`;
            platformElement.dataset.x = x;
            gameWorld.appendChild(platformElement);
            
            gameState.platforms.push({
                x: x,
                y: 560,
                width: PLATFORM_WIDTH,
                height: PLATFORM_HEIGHT,
                element: platformElement,
                isGround: true
            });
        }
        
        // 生成新浮动平台
        const numFloatingPlatforms = Math.floor(Math.random() * 3) + 3; // 3-5个新平台
        const platformSegmentSize = (endX - startX) / numFloatingPlatforms; // 平台段大小
        
        for (let i = 0; i < numFloatingPlatforms; i++) {
            // 随机生成平台段
            const segmentStart = startX + i * platformSegmentSize;
            const segmentEnd = segmentStart + platformSegmentSize - 250; // 平台段结束
            
            // 确保不会在旗帜后面生成平台
            if (gameState.flagPosition && segmentStart >= gameState.flagPosition) {
                continue;
            }
            
            const platformX = segmentStart + Math.random() * (segmentEnd - segmentStart);
            // 随机生成平台高度
            const platformY = 380 + Math.random() * 70;
            const platformWidth = Math.floor(Math.random() * 3) + 2; // 2-4个新平台
            
            for (let j = 0; j < platformWidth; j++) {
                let platformType = 'middle';
                if (j === 0) platformType = 'left';
                if (j === platformWidth - 1) platformType = 'right';
                
                const currentX = platformX + j * PLATFORM_WIDTH;
                
                // 确保不会在旗帜后面生成平台
                if (gameState.flagPosition && currentX >= gameState.flagPosition) {
                    continue;
                }
                
                const platformElement = document.createElement('div');
                platformElement.className = 'platform';
                platformElement.innerHTML = ASSETS.platform.floating;
                platformElement.style.left = `${currentX - gameState.camera.x}px`;
                platformElement.style.top = `${platformY}px`;
                platformElement.dataset.x = currentX;
                gameWorld.appendChild(platformElement);
                
                gameState.platforms.push({
                    x: currentX,
                    y: platformY,
                    width: PLATFORM_WIDTH,
                    height: 20,
                    element: platformElement,
                    isGround: false
                });
            }
        }
        
        gameState.levelGeneration.lastPlatformX = endX;
    }

    // 生成新金币
    function generateNewCoins() {
        const startX = gameState.levelGeneration.lastCoinX;
        let endX = startX + 1000;
        
        // 确保不会在旗帜后面生成金币
        if (gameState.flagPosition && endX > gameState.flagPosition) {
            endX = gameState.flagPosition;
        }
        
        // 如果起始位置已经超过旗帜位置，则不生成新金币
        if (gameState.flagPosition && startX >= gameState.flagPosition) {
            return;
        }
        
        // 生成新金币 - 更有规律的生成方式
        const numCoins = Math.floor(Math.random() * 6) + 5; // 5-10个新金币
        
        // 找到这个区域内的所有平台
        const platformsInRange = gameState.platforms.filter(platform => 
            platform.x >= startX && platform.x <= endX && platform.type !== 'ground');
        
        // 创建金币组
        for (let i = 0; i < numCoins; i++) {
            // 决定这组金币的类型：平台上的金币或空中的金币阵列
            const coinType = Math.random() > 0.5 ? 'platform' : 'air';
            
            if (coinType === 'platform' && platformsInRange.length > 0) {
                // 在平台上生成金币
                const platform = platformsInRange[Math.floor(Math.random() * platformsInRange.length)];
                const coinCount = Math.floor(Math.random() * 3) + 2; // 每个平台2-4个金币
                
                for (let j = 0; j < coinCount; j++) {
                    const coinX = platform.x + (j * 30) + 10; // 在平台上均匀分布
                    const coinY = platform.y - 30; // 在平台上方放置金币
                    
                    // 确保不会在旗帜后面生成金币
                    if (gameState.flagPosition && coinX >= gameState.flagPosition) {
                        continue;
                    }
                    
                    createCoin(coinX, coinY);
                }
            } else {
                // 在空中生成金币阵列，允许更高的位置
                const baseX = startX + Math.random() * (endX - startX - 200); // 留出空间给金币阵列
                const baseY = 250 + Math.random() * 150; // 允许金币在250-400像素高度范围内
                const pattern = Math.floor(Math.random() * 3); // 0: 水平线, 1: 垂直线, 2: 方块
                
                if (pattern === 0) {
                    // 水平线
                    const coinCount = Math.floor(Math.random() * 3) + 3; // 3-5个金币
                    for (let j = 0; j < coinCount; j++) {
                        const coinX = baseX + (j * 30);
                        const coinY = baseY;
                        
                        // 确保不会在旗帜后面生成金币
                        if (gameState.flagPosition && coinX >= gameState.flagPosition) {
                            continue;
                        }
                        
                        createCoin(coinX, coinY);
                    }
                } else if (pattern === 1) {
                    // 垂直线 - 允许更高的金币，因为跳跃高度增加了
                    const coinCount = Math.min(Math.floor(Math.random() * 3) + 3, 5); // 最多5个金币
                    for (let j = 0; j < coinCount; j++) {
                        const coinX = baseX;
                        const coinY = baseY - (j * 30);
                        
                        // 确保金币不会太高，但允许比之前更高
                        if (coinY < 150) {
                            continue;
                        }
                        
                        createCoin(coinX, coinY);
                    }
                } else {
                    // 方块 - 允许更大的方块，因为跳跃高度增加了
                    const size = Math.min(Math.floor(Math.random() * 2) + 2, 3); // 最大3x3
                    for (let j = 0; j < size; j++) {
                        for (let k = 0; k < size; k++) {
                            const coinX = baseX + (j * 30);
                            const coinY = baseY - (k * 30);
                            
                            // 确保金币不会太高，但允许比之前更高
                            if (coinY < 150) {
                                continue;
                            }
                            
                            // 确保不会在旗帜后面生成金币
                            if (gameState.flagPosition && coinX >= gameState.flagPosition) {
                                continue;
                            }
                            
                            createCoin(coinX, coinY);
                        }
                    }
                }
            }
        }
        
        // 更新最后金币位置
        gameState.levelGeneration.lastCoinX = endX;
    }
    
    // 创建单个金币的辅助函数
    function createCoin(x, y) {
        const coinElement = document.createElement('div');
        coinElement.className = 'coin';
        coinElement.innerHTML = ASSETS.coin;
        coinElement.style.position = 'absolute';
        coinElement.style.left = `${x - gameState.camera.x}px`;
        coinElement.style.top = `${y}px`;
        coinElement.style.width = '20px';
        coinElement.style.height = '20px';
        gameWorld.appendChild(coinElement);
        
        gameState.coins.push({
            x: x,
            y: y,
            width: 20,
            height: 20,
            element: coinElement,
            collected: false
        });
    }

    // 生成新敌人
    function generateNewEnemies() {
        const startX = gameState.levelGeneration.lastEnemyX;
        let endX = startX + 1000;
        
        // 确保不会在旗帜后面生成敌人
        if (gameState.flagPosition && endX > gameState.flagPosition) {
            endX = gameState.flagPosition;
        }
        
        // 如果起始位置已经超过旗帜位置，则不生成新敌人
        if (gameState.flagPosition && startX >= gameState.flagPosition) {
            return;
        }
        
        // 生成新敌人
        const numEnemies = Math.floor(Math.random() * 3) + 2; // 2-4个新敌人
        
        for (let i = 0; i < numEnemies; i++) {
            const enemyX = startX + Math.random() * (endX - startX);
            
            // 确保不会在旗帜后面生成敌人
            if (gameState.flagPosition && enemyX >= gameState.flagPosition) {
                continue;
            }
            
            const enemyElement = document.createElement('div');
            enemyElement.className = 'enemy';
            enemyElement.innerHTML = ASSETS.enemy.mushroom;
            enemyElement.style.position = 'absolute';
            enemyElement.style.left = `${enemyX - gameState.camera.x}px`;
            enemyElement.style.top = `${530}px`; // 敌人在地面上
            gameWorld.appendChild(enemyElement);
            
            // 设置敌人移动范围
            const minX = enemyX - 100;
            const maxX = enemyX + 100;
            
            gameState.enemies.push({
                x: enemyX,
                y: 530,
                width: 30,
                height: 30,
                element: enemyElement,
                velocityX: -1, // 初始向左移动
                minX: minX,
                maxX: maxX,
                isFixed: true // 标记为固定位置的敌人
            });
        }
        
        // 更新最后敌人位置
        gameState.levelGeneration.lastEnemyX = endX;
    }

    // 生成新装饰元素
    function generateNewDecorations() {
        const startX = gameState.levelGeneration.lastDecorationX + 100;
        let endX = startX + 1000;
        
        // 确保不会在旗帜后面生成装饰元素
        if (gameState.flagPosition && endX > gameState.flagPosition) {
            endX = gameState.flagPosition;
        }
        
        // 如果起始位置已经超过旗帜位置，则不生成新装饰元素
        if (gameState.flagPosition && startX >= gameState.flagPosition) {
            return;
        }
        
        // 生成云朵
        const numClouds = Math.floor(Math.random() * 3) + 1; // 1-3朵云
        
        for (let i = 0; i < numClouds; i++) {
            const cloudX = startX + Math.random() * (endX - startX);
            
            // 确保不会在旗帜后面生成云朵
            if (gameState.flagPosition && cloudX >= gameState.flagPosition) {
                continue;
            }
            
            const cloudY = 50 + Math.random() * 100;
            
            const cloudElement = document.createElement('div');
            cloudElement.className = 'decoration';
            cloudElement.innerHTML = ASSETS.decoration.cloud;
            cloudElement.style.left = `${cloudX - gameState.camera.x}px`;
            cloudElement.style.top = `${cloudY}px`;
            cloudElement.style.zIndex = '1';
            gameWorld.appendChild(cloudElement);
            
            gameState.decorations.push({
                x: cloudX,
                y: cloudY,
                element: cloudElement,
                type: 'cloud'
            });
        }
        
        // 生成山脉
        const numMountains = Math.floor(Math.random() * 2) + 1; // 1-2座山
        
        for (let i = 0; i < numMountains; i++) {
            const mountainX = startX + Math.random() * (endX - startX);
            
            // 确保不会在旗帜后面生成山脉
            if (gameState.flagPosition && mountainX >= gameState.flagPosition) {
                continue;
            }
            
            const mountainY = 500;
            
            const mountainElement = document.createElement('div');
            mountainElement.className = 'decoration';
            mountainElement.innerHTML = ASSETS.decoration.mountain;
            mountainElement.style.left = `${mountainX - gameState.camera.x}px`;
            mountainElement.style.top = `${mountainY}px`;
            mountainElement.style.zIndex = '1';
            gameWorld.appendChild(mountainElement);
            
            gameState.decorations.push({
                x: mountainX,
                y: mountainY,
                element: mountainElement,
                type: 'mountain'
            });
        }
        
        // 生成管道
        const numPipes = Math.floor(Math.random() * 2) + 1; // 1-2个管道
        
        for (let i = 0; i < numPipes; i++) {
            const pipeX = startX + Math.random() * (endX - startX);
            
            // 确保不会在旗帜后面生成管道
            if (gameState.flagPosition && pipeX >= gameState.flagPosition) {
                continue;
            }
            
            const pipeY = 480;
            
            const pipeElement = document.createElement('div');
            pipeElement.className = 'decoration';
            pipeElement.innerHTML = ASSETS.decoration.pipe;
            pipeElement.style.left = `${pipeX - gameState.camera.x}px`;
            pipeElement.style.top = `${pipeY}px`;
            pipeElement.style.zIndex = '1';
            gameWorld.appendChild(pipeElement);
            
            gameState.decorations.push({
                x: pipeX,
                y: pipeY,
                element: pipeElement,
                type: 'pipe'
            });
        }
        
        gameState.levelGeneration.lastDecorationX = endX;
    }

    // 更新马里奥
    function updateMario() {
        // 移动马里奥
        if (gameState.keys.left) {
            gameState.mario.velocityX = -MOVEMENT_SPEED;
            gameState.mario.direction = 'left';
            gameState.mario.state = 'running';
        } else if (gameState.keys.right) {
            gameState.mario.velocityX = MOVEMENT_SPEED;
            gameState.mario.direction = 'right';
            gameState.mario.state = 'running';
        } else {
            gameState.mario.velocityX = 0;
            gameState.mario.state = 'standing';
        }

        // 跳跃
        if (gameState.keys.space && !gameState.mario.isJumping) {
            gameState.mario.velocityY = JUMP_FORCE;
            gameState.mario.isJumping = true;
            gameState.mario.state = 'jumping';
        }

        // 重力
        gameState.mario.velocityY += GRAVITY;

        // 更新马里奥位置
        gameState.mario.x += gameState.mario.velocityX;
        gameState.mario.y += gameState.mario.velocityY;

        // 检查马里奥是否着陆
        if (gameState.mario.y > 560 - gameState.mario.height) {
            gameState.mario.y = 560 - gameState.mario.height;
            gameState.mario.velocityY = 0;
            gameState.mario.isJumping = false;
        }

        // 检查马里奥是否超出屏幕左侧
        if (gameState.mario.x < 0) {
            gameState.mario.x = 0;
        }
        
        // 检查马里奥是否到达旗帜
        if (gameState.flagPosition && gameState.mario.x >= gameState.flagPosition - 20) {
            gameState.mario.x = gameState.flagPosition - 20;
            
            // 如果马里奥到达旗帜，显示胜利画面
            if (!gameState.victory) {
                gameState.victory = true;
                setTimeout(showVictoryScreen, 1000);
            }
        }

        // 更新马里奥动画
        updateMarioAnimation();

        // 更新马里奥位置
        if (gameState.mario.element) {
            gameState.mario.element.style.top = `${gameState.mario.y}px`;
            
            // 更新马里奥方向
            if (gameState.mario.direction === 'left') {
                gameState.mario.element.style.transform = 'scaleX(-1)';
            } else {
                gameState.mario.element.style.transform = 'scaleX(1)';
            }
        } else {
            console.error("马里奥元素不存在，无法更新位置");
        }
    }

    // 更新马里奥动画
    function updateMarioAnimation() {
        if (!gameState.mario.element) {
            console.error("马里奥元素不存在，无法更新动画");
            return;
        }
        
        if (gameState.mario.isJumping) {
            gameState.mario.element.innerHTML = ASSETS.mario.jumping;
        } else if (gameState.mario.state === 'running') {
            // 每10帧更新一次马里奥动画
            if (gameState.mario.animationFrame % 10 === 0) {
                if (gameState.mario.element.innerHTML === ASSETS.mario.running1) {
                    gameState.mario.element.innerHTML = ASSETS.mario.running2;
                } else {
                    gameState.mario.element.innerHTML = ASSETS.mario.running1;
                }
            }
            gameState.mario.animationFrame++;
        } else {
            gameState.mario.element.innerHTML = ASSETS.mario.standing;
        }
    }

    // 更新敌人
    function updateEnemies() {
        gameState.enemies.forEach(enemy => {
            // 移动敌人
            enemy.x += enemy.velocityX;
            
            // 检查敌人是否超出边界
            if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
                enemy.velocityX *= -1;
            }
            
            // 更新敌人元素位置（使用绝对位置，不跟随相机）
            if (enemy.element) {
                // 只有在敌人在视野范围内时才更新位置
                const isInView = enemy.x >= gameState.camera.x - 100 && 
                                enemy.x <= gameState.camera.x + 1100;
                
                if (isInView) {
                    enemy.element.style.display = 'block';
                    enemy.element.style.left = `${enemy.x - gameState.camera.x}px`;
                    enemy.element.style.top = `${enemy.y}px`;
                    
                    // 更新敌人方向
                    if (enemy.velocityX < 0) {
                        enemy.element.style.transform = 'scaleX(-1)';
                    } else {
                        enemy.element.style.transform = 'scaleX(1)';
                    }
                } else {
                    // 如果敌人不在视野范围内，隐藏它以提高性能
                    enemy.element.style.display = 'none';
                }
            }
        });
    }

    // 检测碰撞
    function detectCollisions() {
        // 检查马里奥是否站在平台上
        let onPlatform = false;
        gameState.platforms.forEach(platform => {
            // 检查马里奥是否站在平台上
            if (
                gameState.mario.x + gameState.mario.width > platform.x &&
                gameState.mario.x < platform.x + platform.width &&
                gameState.mario.y + gameState.mario.height >= platform.y - 5 &&
                gameState.mario.y + gameState.mario.height <= platform.y + 10 &&
                gameState.mario.velocityY >= 0
            ) {
                gameState.mario.y = platform.y - gameState.mario.height;
                gameState.mario.velocityY = 0;
                gameState.mario.isJumping = false;
                onPlatform = true;
            }
        });

        // 检查马里奥是否在空中
        if (!onPlatform && !gameState.mario.isJumping && gameState.mario.y < 560 - gameState.mario.height) {
            gameState.mario.isJumping = true;
        }

        // 检查马里奥是否收集金币
        gameState.coins.forEach(coin => {
            if (!coin.collected &&
                gameState.mario.x + gameState.mario.width > coin.x &&
                gameState.mario.x < coin.x + coin.width &&
                gameState.mario.y + gameState.mario.height > coin.y &&
                gameState.mario.y < coin.y + coin.height
            ) {
                coin.collected = true;
                if (coin.element) {
                    coin.element.style.display = 'none';
                }
                gameState.coinCount++;
                gameState.score += 100;
                updateDisplay();
            }
        });

        // 检查马里奥是否被敌人攻击
        gameState.enemies.forEach(enemy => {
            if (
                gameState.mario.x + gameState.mario.width > enemy.x &&
                gameState.mario.x < enemy.x + enemy.width &&
                gameState.mario.y + gameState.mario.height > enemy.y &&
                gameState.mario.y < enemy.y + enemy.height
            ) {
                // 检查马里奥是否被敌人攻击
                if (
                    gameState.mario.velocityY > 0 &&
                    gameState.mario.y + gameState.mario.height < enemy.y + enemy.height / 2
                ) {
                    // 马里奥被攻击
                    if (enemy.element) {
                        enemy.element.style.display = 'none';
                    }
                    enemy.x = -1000; // 敌人消失
                    gameState.score += 200;
                    
                    // 马里奥被击飞
                    gameState.mario.velocityY = -6;
                } else {
                    // 马里奥被攻击
                    hurtMario();
                }
            }
        });

        // 检查马里奥是否收集旗帜
        gameState.decorations.forEach(decoration => {
            if (decoration.type === 'flag') {
                if (checkCollision(gameState.mario, decoration)) {
                    if (!gameState.victory) {
                        gameState.victory = true;
                        gameState.score += 1000; // 收集旗帜得分
                        showVictoryScreen();
                    }
                }
            }
        });
    }

    // 检查碰撞
    function checkCollision(obj1, obj2) {
        return (
            obj1.x + obj1.width > obj2.x &&
            obj1.x < obj2.x + obj2.width &&
            obj1.y + obj1.height > obj2.y &&
            obj1.y < obj2.y + obj2.height
        );
    }

    // 马里奥受伤
    function hurtMario() {
        if (gameState.mario.isInvincible) {
            return;
        }
        
        gameState.lives--;
        
        // 确保生命值不会变为负数
        if (gameState.lives < 0) {
            gameState.lives = 0;
        }
        
        updateDisplay();
        
        gameState.mario.isInvincible = true;
        
        if (gameState.mario.element) {
            gameState.mario.element.classList.add('invincible');
            
            setTimeout(() => {
                gameState.mario.isInvincible = false;
                if (gameState.mario.element) {
                    gameState.mario.element.classList.remove('invincible');
                }
            }, INVINCIBILITY_DURATION);
        } else {
            console.error("马里奥元素不存在，无法添加无敌效果");
            setTimeout(() => {
                gameState.mario.isInvincible = false;
            }, INVINCIBILITY_DURATION);
        }
        
        if (gameState.lives <= 0) {
            gameState.gameOver = true;
            // 立即结束游戏，不等待下一帧
            endGame();
        }
    }

    // 更新摄像机
    function updateCamera() {
        // 计算目标位置
        const targetX = gameState.mario.x - 400 + gameState.mario.width / 2;
        
        // 更新摄像机位置
        gameState.camera.x += (targetX - gameState.camera.x) * 0.1;
        
        // 检查摄像机是否超出屏幕左侧
        if (gameState.camera.x < 0) {
            gameState.camera.x = 0;
        }
        
        // 检查摄像机是否超过旗帜位置
        if (gameState.flagPosition && gameState.camera.x > gameState.flagPosition - 800) {
            gameState.camera.x = gameState.flagPosition - 800;
        }
        
        // 更新马里奥位置
        if (gameState.mario.element) {
            gameState.mario.element.style.left = `${gameState.mario.x - gameState.camera.x}px`;
        } else {
            console.error("马里奥元素不存在，无法更新位置");
        }
        
        // 更新平台位置
        gameState.platforms.forEach(platform => {
            if (platform.element) {
                if (!platform.isFixed) {
                    platform.element.style.left = `${platform.x - gameState.camera.x}px`;
                }
            }
        });
        
        gameState.coins.forEach(coin => {
            if (!coin.collected && coin.element) {
                coin.element.style.left = `${coin.x - gameState.camera.x}px`;
            }
        });
        
        gameState.enemies.forEach(enemy => {
            if (enemy.element) {
                enemy.element.style.left = `${enemy.x - gameState.camera.x}px`;
            }
        });
        
        gameState.decorations.forEach(decoration => {
            if (decoration.element) {
                if (!decoration.isFixed) {
                    decoration.element.style.left = `${decoration.x - gameState.camera.x}px`;
                }
            }
        });
        
        // 更新固定元素的位置
        updateFixedElements();
    }

    // 检查游戏结束
    function checkGameOver() {
        if (gameState.gameOver) {
            endGame();
            return;
        }
        
        // 检查马里奥是否超出屏幕底部
        if (gameState.mario.y > 700) {
            gameState.lives = 0;
            gameState.gameOver = true;
            endGame();
            return;
        }
        
        // 检查胜利条件
        if (gameState.victory) {
            return;
        }
        
        // 检查所有金币是否被收集
        const allCoinsCollected = gameState.coins.every(coin => coin.collected);
        if (allCoinsCollected && gameState.coins.length > 0 && !gameState.victory) {
            // 显示游戏胜利消息
            const message = document.createElement('div');
            message.className = 'game-message';
            message.textContent = '收集了所有金币，现在去找旗帜吧！';
            message.style.position = 'absolute';
            message.style.top = '100px';
            message.style.left = '50%';
            message.style.transform = 'translateX(-50%)';
            message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            message.style.color = 'white';
            message.style.padding = '10px 20px';
            message.style.borderRadius = '5px';
            message.style.zIndex = '100';
            gameScreen.appendChild(message);
            
            // 3秒后自动关闭消息
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    }

    // 结束游戏
    function endGame() {
        console.log("游戏结束");
        gameState.isRunning = false;
        gameState.isPaused = false;
        updateDisplay(); // 确保分数更新
        
        // 确保最终分数显示正确
        if (finalScoreDisplay) {
            finalScoreDisplay.textContent = gameState.score;
        } else {
            console.error("找不到最终分数显示元素");
        }
        
        // 更新用户高分
        if (typeof updateScoreOnGameEnd === 'function') {
            updateScoreOnGameEnd(gameState.score);
        }
        
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
    }
    
    // 显示胜利屏幕
    function showVictoryScreen() {
        console.log("显示胜利屏幕");
        gameState.isRunning = false;
        gameState.isPaused = false;
        updateDisplay(); // 确保分数更新
        
        // 确保胜利分数显示正确
        if (victoryScoreDisplay) {
            victoryScoreDisplay.textContent = gameState.score;
        } else {
            console.error("找不到胜利分数显示元素");
        }
        
        // 更新用户高分
        if (typeof updateScoreOnGameEnd === 'function') {
            updateScoreOnGameEnd(gameState.score);
        }
        
        gameScreen.classList.add('hidden');
        victoryScreen.classList.remove('hidden');
    }

    // 更新显示
    function updateDisplay() {
        scoreDisplay.textContent = gameState.score;
        coinsDisplay.textContent = gameState.coinCount;
        livesDisplay.textContent = gameState.lives;
        if (finalScoreDisplay) {
            finalScoreDisplay.textContent = gameState.score;
        }
        if (victoryScoreDisplay) {
            victoryScoreDisplay.textContent = gameState.score;
        }
    }

    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (!gameState.isRunning) return; // 游戏未开始，忽略键盘事件
        
        if (e.key === 'ArrowLeft') {
            gameState.keys.left = true;
        } else if (e.key === 'ArrowRight') {
            gameState.keys.right = true;
        } else if (e.key === ' ') {
            gameState.keys.space = true;
            // 阻止默认跳跃
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') {
            gameState.keys.left = false;
        } else if (e.key === 'ArrowRight') {
            gameState.keys.right = false;
        } else if (e.key === ' ') {
            gameState.keys.space = false;
        }
    });

    // 开始游戏按钮点击事件
    startButton.addEventListener('click', () => {
        if (!isUserLoggedIn()) {
            alert('请先登录后再开始游戏');
            return;
        }
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        initGame();
    });

    restartButton.addEventListener('click', () => {
        gameOverScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        initGame();
    });
    
    victoryRestartButton.addEventListener('click', () => {
        victoryScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        initGame();
    });

    // 添加胜利旗帜
    function addVictoryFlag() {
        console.log("添加胜利旗帜，位置:", 6000);
        
        const flagX = 6000; // 将旗帜位置设置为6000单位
        const flagY = 450; // 旗帜高度
        
        // 保存旗帜位置，用于限制生成和相机移动
        gameState.flagPosition = flagX;
        
        // 不再清除或修改现有平台
        
        // 创建旗帜元素
        const flagElement = document.createElement('div');
        flagElement.className = 'flag';
        flagElement.innerHTML = ASSETS.decoration.flag;
        flagElement.style.position = 'absolute'; // 使用绝对定位
        flagElement.style.top = `${flagY}px`;
        flagElement.style.left = `${flagX - gameState.camera.x}px`; // 确保初始位置正确
        flagElement.style.width = '40px';
        flagElement.style.height = '110px'; // 增加旗帜高度
        flagElement.style.zIndex = '10'; // 增加z-index确保旗帜在最上层
        flagElement.style.display = 'block';
        gameWorld.appendChild(flagElement);
        
        // 添加旗帜到游戏状态
        const flagDecoration = {
            type: 'flag',
            x: flagX,
            y: flagY,
            width: 40,
            height: 110, // 增加旗帜高度
            element: flagElement,
            isFixed: true // 标记为固定元素
        };
        gameState.decorations.push(flagDecoration);
        
        console.log("旗帜已添加，位置:", flagX, "元素:", flagElement);
        
        // 不再添加额外的平台
        
        // 在旗帜位置创建一个边界墙，防止马里奥超过旗帜
        const boundaryX = flagX;
        const boundaryY = 0;
        const boundaryWidth = 10;
        const boundaryHeight = 600;
        
        const boundaryElement = document.createElement('div');
        boundaryElement.className = 'boundary';
        boundaryElement.style.position = 'absolute';
        boundaryElement.style.width = `${boundaryWidth}px`;
        boundaryElement.style.height = `${boundaryHeight}px`;
        boundaryElement.style.top = `${boundaryY}px`;
        boundaryElement.style.backgroundColor = 'transparent'; // 透明边界
        boundaryElement.style.zIndex = '4';
        gameWorld.appendChild(boundaryElement);
        
        // 添加边界到游戏状态
        gameState.boundary = {
            x: boundaryX,
            y: boundaryY,
            width: boundaryWidth,
            height: boundaryHeight,
            element: boundaryElement,
            isFixed: true
        };
        
        // 在旗帜后面创建墙壁，防止玩家看到旗帜后面的区域
        const wallX = flagX + 50; // 墙壁更靠近旗帜
        const wallY = 0;
        const wallWidth = 1000; // 大幅增加墙壁宽度
        const wallHeight = 600;
        
        const wallElement = document.createElement('div');
        wallElement.className = 'decoration wall';
        wallElement.style.position = 'absolute'; // 使用绝对定位
        wallElement.style.width = `${wallWidth}px`;
        wallElement.style.height = `${wallHeight}px`;
        wallElement.style.top = `${wallY}px`;
        wallElement.style.backgroundColor = '#87CEEB'; // 与背景色相同
        wallElement.style.zIndex = '3';
        gameWorld.appendChild(wallElement);
        
        const wall = {
            type: 'wall',
            x: wallX,
            y: wallY,
            width: wallWidth,
            height: wallHeight,
            element: wallElement,
            isFixed: true // 标记为固定元素
        };
        gameState.decorations.push(wall);
        
        // 初始化所有固定元素的位置
        updateFixedElements();
    }

    // 更新固定元素的位置
    function updateFixedElements() {
        // 检查是否有旗帜，如果有，确保它始终可见
        const flagDecoration = gameState.decorations.find(d => d.type === 'flag');
        if (flagDecoration && flagDecoration.element) {
            // 计算旗帜是否应该在视野内
            const isInView = flagDecoration.x >= gameState.camera.x - 100 && 
                            flagDecoration.x <= gameState.camera.x + 1100;
            
            if (isInView) {
                flagDecoration.element.style.display = 'block';
                console.log("旗帜在视野内，位置:", flagDecoration.x, "相机:", gameState.camera.x);
            } else {
                console.log("旗帜不在视野内，位置:", flagDecoration.x, "相机:", gameState.camera.x);
            }
            
            // 无论如何都更新位置，确保当相机移动到旗帜位置时能正确显示
            flagDecoration.element.style.left = `${flagDecoration.x - gameState.camera.x}px`;
        }
        
        // 更新其他固定平台
        gameState.platforms.forEach(platform => {
            if (platform.isFixed && platform.element) {
                // 只有在平台在视野范围内或接近视野时才显示
                const isInView = platform.x + platform.width >= gameState.camera.x - 200 && 
                                platform.x <= gameState.camera.x + 1200;
                
                if (isInView) {
                    platform.element.style.display = 'block';
                    platform.element.style.left = `${platform.x - gameState.camera.x}px`;
                } else {
                    // 如果平台不在视野范围内，隐藏它以提高性能
                    platform.element.style.display = 'none';
                }
            }
        });
        
        // 更新其他固定装饰
        gameState.decorations.forEach(decoration => {
            if (decoration.isFixed && decoration.element && decoration.type !== 'flag') {
                // 只有在装饰在视野范围内或接近视野时才显示
                const isInView = decoration.x + (decoration.width || 0) >= gameState.camera.x - 200 && 
                                decoration.x <= gameState.camera.x + 1200;
                
                if (isInView) {
                    decoration.element.style.display = 'block';
                    decoration.element.style.left = `${decoration.x - gameState.camera.x}px`;
                } else {
                    // 如果装饰不在视野范围内，隐藏它以提高性能
                    decoration.element.style.display = 'none';
                }
            }
        });
    }

    // 初始化游戏控制按钮
    function initGameControls() {
        const pauseButton = document.getElementById('pause-button');
        const exitButton = document.getElementById('exit-button');
        const resumeButton = document.getElementById('resume-button');
        const exitToMenuButton = document.getElementById('exit-to-menu-button');
        const pauseMenu = document.getElementById('pause-menu');
        
        // 暂停按钮点击事件
        pauseButton.addEventListener('click', () => {
            gameState.isPaused = true;
            pauseMenu.classList.remove('hidden');
        });
        
        // 继续游戏按钮点击事件
        resumeButton.addEventListener('click', () => {
            gameState.isPaused = false;
            pauseMenu.classList.add('hidden');
        });
        
        // 退出按钮点击事件
        exitButton.addEventListener('click', () => {
            exitToMainMenu();
        });
        
        // 返回主菜单按钮点击事件
        exitToMenuButton.addEventListener('click', () => {
            exitToMainMenu();
        });
        
        // 添加键盘事件监听器，按ESC键暂停/继续游戏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && gameState.isRunning) {
                if (gameState.isPaused) {
                    gameState.isPaused = false;
                    pauseMenu.classList.add('hidden');
                } else {
                    gameState.isPaused = true;
                    pauseMenu.classList.remove('hidden');
                }
            }
        });
    }

    // 退出到主菜单
    function exitToMainMenu() {
        // 停止游戏
        gameState.isRunning = false;
        gameState.isPaused = false;
        
        // 隐藏暂停菜单
        document.getElementById('pause-menu').classList.add('hidden');
        
        // 隐藏游戏屏幕，显示开始屏幕
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
    }

    // 监听登录状态变化
    document.addEventListener('userLoggedIn', () => {
        updateLoginState();
    });

    document.addEventListener('userLoggedOut', () => {
        updateLoginState();
    });
}); 
