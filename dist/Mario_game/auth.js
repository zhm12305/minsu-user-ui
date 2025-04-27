// 用户认证相关功能

// 用户数据存储在localStorage中
const AUTH_KEY = 'mario_game_users';

// 初始化用户数据
function initUserData() {
    if (!localStorage.getItem(AUTH_KEY)) {
        localStorage.setItem(AUTH_KEY, JSON.stringify([]));
    }
}

// 获取所有用户
function getUsers() {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
}

// 保存用户数据
function saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

// 注册新用户
function registerUser(username, password) {
    // 初始化用户数据
    initUserData();
    
    // 获取现有用户
    const users = getUsers();
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
        return {
            success: false,
            message: '用户名已存在'
        };
    }
    
    // 创建新用户
    const newUser = {
        username,
        password, // 实际应用中应该对密码进行加密
        highScore: 0,
        registeredAt: new Date().toISOString()
    };
    
    // 添加新用户
    users.push(newUser);
    
    // 保存用户数据
    saveUsers(users);
    
    return {
        success: true,
        message: '注册成功'
    };
}

// 用户登录
function loginUser(username, password) {
    // 初始化用户数据
    initUserData();
    
    // 获取现有用户
    const users = getUsers();
    
    // 查找用户
    const user = users.find(user => user.username === username);
    
    // 检查用户是否存在
    if (!user) {
        return {
            success: false,
            message: '用户名不存在'
        };
    }
    
    // 检查密码是否正确
    if (user.password !== password) {
        return {
            success: false,
            message: '密码错误'
        };
    }
    
    // 登录成功，保存当前用户信息
    sessionStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        highScore: user.highScore
    }));
    
    return {
        success: true,
        message: '登录成功',
        user: {
            username: user.username,
            highScore: user.highScore
        }
    };
}

// 获取当前登录用户
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// 检查用户是否已登录
function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

// 更新用户高分
function updateHighScore(score) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        return false;
    }
    
    // 获取所有用户
    const users = getUsers();
    
    // 查找当前用户
    const userIndex = users.findIndex(user => user.username === currentUser.username);
    
    if (userIndex === -1) {
        return false;
    }
    
    // 只有当新分数高于现有高分时才更新
    if (score > users[userIndex].highScore) {
        users[userIndex].highScore = score;
        saveUsers(users);
        
        // 更新会话存储中的用户信息
        currentUser.highScore = score;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        return true;
    }
    
    return false;
}

// 用户登出
function logoutUser() {
    sessionStorage.removeItem('currentUser');
}

// 显示登录表单
function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
}

// 显示注册表单
function showRegisterForm() {
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
}

// 隐藏认证表单
function hideAuthForms() {
    document.getElementById('auth-container').classList.add('hidden');
}

// 更新开始按钮状态
function updateStartButtonState() {
    const startButton = document.getElementById('start-button');
    const loginMessage = document.getElementById('login-message');
    
    if (isUserLoggedIn()) {
        startButton.disabled = false;
        startButton.style.opacity = '1';
        startButton.style.cursor = 'pointer';
        if (loginMessage) {
            loginMessage.classList.add('hidden');
        }
    } else {
        startButton.disabled = true;
        startButton.style.opacity = '0.7';
        startButton.style.cursor = 'not-allowed';
        if (loginMessage) {
            loginMessage.classList.remove('hidden');
        }
    }
}

// 初始化认证相关事件
function initAuth() {
    // 登录按钮点击事件
    document.getElementById('login-button').addEventListener('click', () => {
        showLoginForm();
    });
    
    // 注册按钮点击事件
    document.getElementById('register-button').addEventListener('click', () => {
        showRegisterForm();
    });
    
    // 切换到注册表单
    document.getElementById('to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    
    // 切换到登录表单
    document.getElementById('to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // 关闭认证表单
    document.querySelectorAll('.close-auth').forEach(button => {
        button.addEventListener('click', () => {
            hideAuthForms();
        });
    });
    
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        const result = loginUser(username, password);
        
        if (result.success) {
            // 显示欢迎消息
            const userInfo = document.getElementById('user-info');
            userInfo.textContent = `欢迎回来，${result.user.username}！`;
            userInfo.classList.remove('hidden');
            
            // 显示登出按钮
            const logoutButton = document.getElementById('logout-button');
            logoutButton.classList.remove('hidden');
            logoutButton.style.display = 'inline-block';
            
            // 隐藏登录和注册按钮
            document.getElementById('login-button').classList.add('hidden');
            document.getElementById('register-button').classList.add('hidden');
            
            // 隐藏认证表单
            hideAuthForms();
            
            // 显示高分
            if (result.user.highScore > 0) {
                document.getElementById('high-score').textContent = `最高分: ${result.user.highScore}`;
                document.getElementById('high-score').classList.remove('hidden');
            }
            
            // 更新开始按钮状态
            updateStartButtonState();
        } else {
            // 显示错误消息
            alert(result.message);
        }
    });
    
    // 注册表单提交
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // 检查密码是否匹配
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        const result = registerUser(username, password);
        
        if (result.success) {
            alert(result.message);
            
            // 自动登录
            loginUser(username, password);
            
            // 显示欢迎消息
            const userInfo = document.getElementById('user-info');
            userInfo.textContent = `欢迎，${username}！`;
            userInfo.classList.remove('hidden');
            
            // 显示登出按钮
            document.getElementById('logout-button').classList.remove('hidden');
            
            // 隐藏登录和注册按钮
            document.getElementById('login-button').classList.add('hidden');
            document.getElementById('register-button').classList.add('hidden');
            
            // 隐藏认证表单
            hideAuthForms();
            
            // 更新开始按钮状态
            updateStartButtonState();
        } else {
            alert(result.message);
        }
    });
    
    // 登出按钮点击事件
    document.getElementById('logout-button').addEventListener('click', () => {
        logoutUser();
        
        // 隐藏欢迎消息和高分
        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('high-score').classList.add('hidden');
        
        // 隐藏登出按钮
        document.getElementById('logout-button').classList.add('hidden');
        
        // 显示登录和注册按钮
        document.getElementById('login-button').classList.remove('hidden');
        document.getElementById('register-button').classList.remove('hidden');
        
        // 更新开始按钮状态
        updateStartButtonState();
        
        // 如果游戏正在进行，则返回开始界面
        const gameScreen = document.getElementById('game-screen');
        const startScreen = document.getElementById('start-screen');
        
        if (!gameScreen.classList.contains('hidden')) {
            gameScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            
            // 通知游戏停止
            if (window.gameState && window.gameState.isRunning) {
                window.gameState.isRunning = false;
            }
        }
    });
    
    // 检查是否已登录
    const currentUser = getCurrentUser();
    if (currentUser) {
        // 显示欢迎消息
        const userInfo = document.getElementById('user-info');
        userInfo.textContent = `欢迎回来，${currentUser.username}！`;
        userInfo.classList.remove('hidden');
        
        // 显示登出按钮
        const logoutButton = document.getElementById('logout-button');
        logoutButton.classList.remove('hidden');
        logoutButton.style.display = 'inline-block';
        
        // 隐藏登录和注册按钮
        document.getElementById('login-button').classList.add('hidden');
        document.getElementById('register-button').classList.add('hidden');
        
        // 显示高分
        if (currentUser.highScore > 0) {
            document.getElementById('high-score').textContent = `最高分: ${currentUser.highScore}`;
            document.getElementById('high-score').classList.remove('hidden');
        }
    }
    
    // 初始化时更新开始按钮状态
    updateStartButtonState();
}

// 在游戏结束时更新高分
function updateScoreOnGameEnd(score) {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        if (updateHighScore(score)) {
            // 更新高分显示
            document.getElementById('high-score').textContent = `最高分: ${score}`;
            document.getElementById('high-score').classList.remove('hidden');
            
            return true;
        }
    }
    
    return false;
}

// 在页面加载完成后初始化认证功能
document.addEventListener('DOMContentLoaded', initAuth); 