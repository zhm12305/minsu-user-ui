// 游戏资源和SVG定义
const ASSETS = {
    // 马里奥SVG - 更精美的版本
    mario: {
        standing: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
            <!-- 帽子 -->
            <rect x="8" y="0" width="17" height="3" fill="#ff0000" />
            <rect x="5" y="3" width="23" height="7" fill="#ff0000" />
            
            <!-- 脸部 -->
            <rect x="8" y="10" width="17" height="10" fill="#ffcc99" />
            
            <!-- 眼睛 -->
            <rect x="10" y="12" width="3" height="3" fill="#000000" />
            <rect x="20" y="12" width="3" height="3" fill="#000000" />
            
            <!-- 胡子 -->
            <rect x="12" y="17" width="9" height="2" fill="#000000" />
            <rect x="10" y="15" width="2" height="4" fill="#000000" />
            <rect x="21" y="15" width="2" height="4" fill="#000000" />
            
            <!-- 衣服 -->
            <rect x="8" y="20" width="17" height="10" fill="#0000ff" />
            <rect x="11" y="20" width="11" height="5" fill="#ff0000" />
            <rect x="13" y="25" width="7" height="5" fill="#ff0000" />
            
            <!-- 手臂 -->
            <rect x="3" y="20" width="5" height="5" fill="#ffcc99" />
            <rect x="25" y="20" width="5" height="5" fill="#ffcc99" />
            
            <!-- 裤子 -->
            <rect x="11" y="30" width="11" height="5" fill="#0000ff" />
            
            <!-- 腿部 -->
            <rect x="8" y="35" width="5" height="5" fill="#ffcc99" />
            <rect x="20" y="35" width="5" height="5" fill="#ffcc99" />
            
            <!-- 鞋子 -->
            <rect x="5" y="38" width="8" height="2" fill="#964b00" />
            <rect x="20" y="38" width="8" height="2" fill="#964b00" />
            
            <!-- 按钮 -->
            <circle cx="14" cy="23" r="1.5" fill="#ffff00" />
            <circle cx="19" cy="23" r="1.5" fill="#ffff00" />
        </svg>`,
        
        jumping: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
            <!-- 帽子 -->
            <rect x="8" y="0" width="17" height="3" fill="#ff0000" />
            <rect x="5" y="3" width="23" height="7" fill="#ff0000" />
            
            <!-- 脸部 -->
            <rect x="8" y="10" width="17" height="10" fill="#ffcc99" />
            
            <!-- 眼睛 -->
            <rect x="10" y="12" width="3" height="3" fill="#000000" />
            <rect x="20" y="12" width="3" height="3" fill="#000000" />
            
            <!-- 胡子 -->
            <rect x="12" y="17" width="9" height="2" fill="#000000" />
            <rect x="10" y="15" width="2" height="4" fill="#000000" />
            <rect x="21" y="15" width="2" height="4" fill="#000000" />
            
            <!-- 衣服 -->
            <rect x="8" y="20" width="17" height="10" fill="#0000ff" />
            <rect x="11" y="20" width="11" height="5" fill="#ff0000" />
            <rect x="13" y="25" width="7" height="5" fill="#ff0000" />
            
            <!-- 手臂 - 跳跃姿势 -->
            <rect x="3" y="15" width="5" height="5" fill="#ffcc99" />
            <rect x="25" y="15" width="5" height="5" fill="#ffcc99" />
            
            <!-- 裤子 -->
            <rect x="11" y="30" width="11" height="5" fill="#0000ff" />
            
            <!-- 腿部 - 跳跃姿势 -->
            <rect x="8" y="35" width="5" height="5" fill="#ffcc99" />
            <rect x="20" y="35" width="5" height="5" fill="#ffcc99" />
            
            <!-- 鞋子 - 跳跃姿势 -->
            <rect x="5" y="38" width="8" height="2" fill="#964b00" />
            <rect x="20" y="38" width="8" height="2" fill="#964b00" />
            
            <!-- 按钮 -->
            <circle cx="14" cy="23" r="1.5" fill="#ffff00" />
            <circle cx="19" cy="23" r="1.5" fill="#ffff00" />
        </svg>`,
        
        running1: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
            <!-- 帽子 -->
            <rect x="8" y="0" width="17" height="3" fill="#ff0000" />
            <rect x="5" y="3" width="23" height="7" fill="#ff0000" />
            
            <!-- 脸部 -->
            <rect x="8" y="10" width="17" height="10" fill="#ffcc99" />
            
            <!-- 眼睛 -->
            <rect x="10" y="12" width="3" height="3" fill="#000000" />
            <rect x="20" y="12" width="3" height="3" fill="#000000" />
            
            <!-- 胡子 -->
            <rect x="12" y="17" width="9" height="2" fill="#000000" />
            <rect x="10" y="15" width="2" height="4" fill="#000000" />
            <rect x="21" y="15" width="2" height="4" fill="#000000" />
            
            <!-- 衣服 -->
            <rect x="8" y="20" width="17" height="10" fill="#0000ff" />
            <rect x="11" y="20" width="11" height="5" fill="#ff0000" />
            <rect x="13" y="25" width="7" height="5" fill="#ff0000" />
            
            <!-- 手臂 - 跑步姿势1 -->
            <rect x="5" y="18" width="5" height="5" fill="#ffcc99" />
            <rect x="23" y="18" width="5" height="5" fill="#ffcc99" />
            
            <!-- 裤子 -->
            <rect x="11" y="30" width="11" height="5" fill="#0000ff" />
            
            <!-- 腿部 - 跑步姿势1 -->
            <rect x="6" y="35" width="5" height="5" fill="#ffcc99" />
            <rect x="22" y="35" width="5" height="5" fill="#ffcc99" />
            
            <!-- 鞋子 - 跑步姿势1 -->
            <rect x="3" y="38" width="8" height="2" fill="#964b00" />
            <rect x="22" y="38" width="8" height="2" fill="#964b00" />
            
            <!-- 按钮 -->
            <circle cx="14" cy="23" r="1.5" fill="#ffff00" />
            <circle cx="19" cy="23" r="1.5" fill="#ffff00" />
        </svg>`,
        
        running2: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
            <!-- 帽子 -->
            <rect x="8" y="0" width="17" height="3" fill="#ff0000" />
            <rect x="5" y="3" width="23" height="7" fill="#ff0000" />
            
            <!-- 脸部 -->
            <rect x="8" y="10" width="17" height="10" fill="#ffcc99" />
            
            <!-- 眼睛 -->
            <rect x="10" y="12" width="3" height="3" fill="#000000" />
            <rect x="20" y="12" width="3" height="3" fill="#000000" />
            
            <!-- 胡子 -->
            <rect x="12" y="17" width="9" height="2" fill="#000000" />
            <rect x="10" y="15" width="2" height="4" fill="#000000" />
            <rect x="21" y="15" width="2" height="4" fill="#000000" />
            
            <!-- 衣服 -->
            <rect x="8" y="20" width="17" height="10" fill="#0000ff" />
            <rect x="11" y="20" width="11" height="5" fill="#ff0000" />
            <rect x="13" y="25" width="7" height="5" fill="#ff0000" />
            
            <!-- 手臂 - 跑步姿势2 -->
            <rect x="3" y="22" width="5" height="5" fill="#ffcc99" />
            <rect x="25" y="22" width="5" height="5" fill="#ffcc99" />
            
            <!-- 裤子 -->
            <rect x="11" y="30" width="11" height="5" fill="#0000ff" />
            
            <!-- 腿部 - 跑步姿势2 -->
            <rect x="10" y="35" width="5" height="5" fill="#ffcc99" />
            <rect x="18" y="35" width="5" height="5" fill="#ffcc99" />
            
            <!-- 鞋子 - 跑步姿势2 -->
            <rect x="7" y="38" width="8" height="2" fill="#964b00" />
            <rect x="18" y="38" width="8" height="2" fill="#964b00" />
            
            <!-- 按钮 -->
            <circle cx="14" cy="23" r="1.5" fill="#ffff00" />
            <circle cx="19" cy="23" r="1.5" fill="#ffff00" />
        </svg>`
    },
    
    // 敌人SVG
    enemy: {
        mushroom: `<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <!-- 蘑菇头 -->
            <rect x="5" y="0" width="20" height="20" fill="#ff0000" />
            
            <!-- 蘑菇斑点 -->
            <rect x="8" y="3" width="5" height="5" fill="#ffffff" />
            <rect x="17" y="3" width="5" height="5" fill="#ffffff" />
            <rect x="12" y="10" width="6" height="6" fill="#ffffff" />
            
            <!-- 蘑菇身体 -->
            <rect x="5" y="20" width="20" height="10" fill="#ffffff" />
            
            <!-- 眼睛 -->
            <rect x="8" y="22" width="4" height="4" fill="#000000" />
            <rect x="18" y="22" width="4" height="4" fill="#000000" />
            
            <!-- 腿部 -->
            <rect x="5" y="27" width="5" height="3" fill="#000000" />
            <rect x="20" y="27" width="5" height="3" fill="#000000" />
        </svg>`
    },
    
    // 金币SVG
    coin: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" fill="#ffd700" />
        <circle cx="10" cy="10" r="6" fill="#ffff00" />
        <text x="10" y="14" font-size="10" text-anchor="middle" fill="#ff8c00">$</text>
    </svg>`,
    
    // 平台SVG
    platform: {
        left: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="40" height="40" fill="#8b4513" />
            <rect x="5" y="5" width="30" height="5" fill="#a0522d" />
            <rect x="5" y="15" width="30" height="5" fill="#a0522d" />
            <rect x="5" y="25" width="30" height="5" fill="#a0522d" />
            <rect x="0" y="0" width="5" height="40" fill="#6b8e23" />
            <rect x="0" y="0" width="40" height="5" fill="#6b8e23" />
        </svg>`,
        
        middle: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="40" height="40" fill="#8b4513" />
            <rect x="5" y="5" width="30" height="5" fill="#a0522d" />
            <rect x="5" y="15" width="30" height="5" fill="#a0522d" />
            <rect x="5" y="25" width="30" height="5" fill="#a0522d" />
            <rect x="0" y="0" width="40" height="5" fill="#6b8e23" />
        </svg>`,
        
        right: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="40" height="40" fill="#8b4513" />
            <rect x="5" y="5" width="30" height="5" fill="#a0522d" />
            <rect x="5" y="15" width="30" height="5" fill="#a0522d" />
            <rect x="5" y="25" width="30" height="5" fill="#a0522d" />
            <rect x="35" y="0" width="5" height="40" fill="#6b8e23" />
            <rect x="0" y="0" width="40" height="5" fill="#6b8e23" />
        </svg>`,
        
        floating: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="40" height="20" fill="#8b4513" />
            <rect x="5" y="5" width="30" height="5" fill="#a0522d" />
            <rect x="5" y="15" width="30" height="5" fill="#a0522d" />
            <rect x="0" y="0" width="40" height="5" fill="#6b8e23" />
        </svg>`
    },
    
    // 装饰元素SVG
    decoration: {
        cloud: `<svg width="80" height="40" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="30" cy="20" rx="20" ry="15" fill="white" />
            <ellipse cx="50" cy="20" rx="25" ry="18" fill="white" />
            <ellipse cx="20" cy="25" rx="15" ry="10" fill="white" />
            <ellipse cx="60" cy="25" rx="15" ry="10" fill="white" />
        </svg>`,
        
        mountain: `<svg width="100" height="60" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,60 50,0 100,60" fill="#a0522d" />
            <polygon points="20,60 50,20 80,60" fill="#8b4513" />
        </svg>`,
        
        pipe: `<svg width="40" height="80" viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="40" height="20" fill="#00aa00" />
            <rect x="5" y="0" width="30" height="5" fill="#00cc00" />
            <rect x="5" y="20" width="30" height="60" fill="#00aa00" />
            <rect x="10" y="20" width="20" height="60" fill="#00cc00" />
        </svg>`,
        
        flag: `<svg width="40" height="160" viewBox="0 0 40 160" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="0" width="4" height="160" fill="#8B4513"/>
            <polygon points="22,10 22,50 40,30" fill="#FF0000"/>
        </svg>`
    }
};

// 关卡设计
const LEVEL_DESIGN = {
    // 平台位置和宽度 [x, y, width, type]
    platforms: [
        [0, 560, 20, 'ground'], // 地面
        [200, 480, 3, 'floating'],
        [300, 420, 2, 'floating'],
        [400, 370, 3, 'floating'],
        [550, 320, 4, 'floating'],
        [700, 420, 3, 'floating'],
        [850, 480, 2, 'floating'],
        [950, 420, 3, 'floating'],
        [1100, 370, 4, 'floating'],
        [1250, 320, 3, 'floating'],
        [1400, 370, 2, 'floating'],
        [1500, 420, 3, 'floating'],
        [1650, 480, 4, 'floating'],
        [1800, 560, 20, 'ground'] // 结束地面
    ],
    
    // 金币位置 [x, y]
    coins: [
        [220, 440],
        [260, 440],
        [320, 380],
        [420, 330],
        [460, 330],
        [500, 330],
        [570, 280],
        [610, 280],
        [650, 280],
        [720, 380],
        [760, 380],
        [870, 440],
        [970, 380],
        [1010, 380],
        [1050, 380],
        [1120, 330],
        [1160, 330],
        [1200, 330],
        [1270, 280],
        [1310, 280],
        [1420, 330],
        [1520, 380],
        [1560, 380],
        [1600, 380],
        [1670, 440],
        [1710, 440],
        [1750, 440]
    ],
    
    // 敌人位置和移动范围 [x, y, minX, maxX]
    enemies: [
        [300, 530, 200, 400],
        [600, 530, 500, 700],
        [450, 370, 400, 500],
        [650, 320, 550, 700],
        [900, 530, 800, 1000],
        [1050, 320, 1000, 1100],
        [1300, 320, 1250, 1350],
        [1550, 420, 1500, 1600],
        [1700, 530, 1650, 1750]
    ],
    
    // 装饰元素 [type, x, y]
    decorations: [
        ['cloud', 100, 80],
        ['cloud', 300, 50],
        ['cloud', 600, 70],
        ['cloud', 900, 60],
        ['cloud', 1200, 80],
        ['cloud', 1500, 50],
        ['mountain', 150, 500],
        ['mountain', 500, 500],
        ['mountain', 850, 500],
        ['mountain', 1200, 500],
        ['mountain', 1600, 500],
        ['pipe', 350, 480],
        ['pipe', 750, 480],
        ['pipe', 1150, 480],
        ['pipe', 1550, 480]
    ]
};

// 资源预加载系统
const RESOURCE_LOADER = {
    // 存储所有需要加载的资源
    resources: {
        images: {
            mario_standing: ASSETS.mario.standing,
            mario_running1: ASSETS.mario.running1,
            mario_running2: ASSETS.mario.running2,
            mario_jumping: ASSETS.mario.jumping,
            enemy_mushroom: ASSETS.enemy.mushroom,
            coin: ASSETS.coin,
            platform_middle: ASSETS.platform.middle,
            platform_left: ASSETS.platform.left,
            platform_right: ASSETS.platform.right,
            platform_floating: ASSETS.platform.floating,
            decoration_cloud: ASSETS.decoration.cloud,
            decoration_mountain: ASSETS.decoration.mountain,
            decoration_pipe: ASSETS.decoration.pipe,
            decoration_flag: ASSETS.decoration.flag
        },
        audio: {
            // 暂时移除音频资源，后续会添加
        }
    },

    // 存储加载完成的资源
    loadedResources: {
        images: {},
        audio: {}
    },

    // 加载进度
    progress: 0,
    totalResources: 0,
    loadedCount: 0,

    // 初始化加载
    init() {
        // 直接使用SVG资源
        this.totalResources = Object.keys(this.resources.images).length;
        return this.loadAllResources();
    },

    // 加载所有资源
    loadAllResources() {
        return new Promise((resolve) => {
            // 直接将SVG字符串存储到loadedResources中
            Object.entries(this.resources.images).forEach(([key, svg]) => {
                this.loadedResources.images[key] = svg;
                this.updateProgress();
            });
            
            console.log('所有资源加载完成');
            resolve();
        });
    },

    // 更新加载进度
    updateProgress() {
        this.loadedCount++;
        this.progress = (this.loadedCount / this.totalResources) * 100;
        // 触发进度更新事件
        const event = new CustomEvent('resourceLoadProgress', {
            detail: { progress: this.progress }
        });
        document.dispatchEvent(event);
    },

    // 获取已加载的资源
    getImage(key) {
        return this.loadedResources.images[key];
    },

    getAudio(key) {
        return this.loadedResources.audio[key];
    }
};

// 导出资源加载器
window.RESOURCE_LOADER = RESOURCE_LOADER; 