<template>
  <div class="homepage-wrapper">
    <!--头部-->
   <div class="header-container">
    <div class="header">
      <div class="header-left animate__animated animate__fadeInLeft">
        <img src="@/assets/logo/logo.png" alt="" class="logo-pulse">
        <div class="titles" @click="$router.push('/index/home')">悦享—民宿</div>
      </div>
      <div class="header-center">
        <div class="front-header-nav animate__animated animate__fadeInDown">
          <el-menu :default-active="$route.path" mode="horizontal" router>
            <el-menu-item index="/index/home" class="menu-item-animated">首页</el-menu-item>
            <el-menu-item index="/index/scenicSpots" class="menu-item-animated">特色景点</el-menu-item>
            <el-menu-item index="/index/homestay" class="menu-item-animated">特色民宿</el-menu-item>
            <el-menu-item index="/index/booking" class="menu-item-animated">民宿订单</el-menu-item>
            <el-menu-item index="/index/recharge" class="menu-item-animated">账户充值</el-menu-item>
            <el-menu-item index="/index/games" class="menu-item-animated">休闲娱乐</el-menu-item>
            <el-menu-item index="/index/profile" class="menu-item-animated">个人中心</el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="header-right animate__animated animate__fadeInRight">
        <div v-if="!nickName">
          <el-button @click="$router.push('/login')" class="login-btn">登录</el-button>
          <el-button @click="$router.push('/register')" class="register-btn">注册</el-button>
        </div>
        <div v-else>
          <el-dropdown>
            <div class="header-dropdown">
              <img :src="avatar" alt="" class="avatar-pulse">
              <div style="margin-left: 10px; color: #fff">
                <span>{{ nickName }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div style="text-decoration: none" @click="logout">退出</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <div class="main-view-container animate__animated animate__fadeIn">
      <transition name="fade-transform" mode="out-in">
        <router-view/>
      </transition>
    </div>

    <!-- 回到顶部按钮 -->
    <el-backtop :right="20" :bottom="20" class="custom-backtop">
      <div class="backtop-inner">
        <i class="el-icon-arrow-up"></i>
      </div>
    </el-backtop>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getUser} from "@/api/system/user";

export default {
  name: "homePage",
  data() {
    return {
      nickName: null,
      top: '',
      notice: [],
      user: JSON.parse(localStorage.getItem("xm-user") || '{}'),
      title: this.$route.query.title,
      loading: true
    }
  },
  created() {
    this.getList();
    this.addAnimation();
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
  },
  methods: {
    getList() {
      getUser(this.$store.state.user.id).then(res => {
        this.nickName = res.data.nickName
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    },
    addAnimation() {
      // 为菜单项添加延迟动画效果
      const menuItems = document.querySelectorAll('.menu-item-animated');
      menuItems.forEach((item, index) => {
        item.style.animationDelay = `${0.1 + index * 0.1}s`;
      });
    }
  }
}
</script>

<style scoped>
/* 导入Animate.css */
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

.homepage-wrapper {
  min-height: 100vh;
  position: relative;
}

.header-container {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.main-view-container {
  min-height: calc(100vh - 70px);
  animation-duration: 0.8s;
}

/* 页面过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.fade-transform-enter {
  opacity: 0;
  transform: translateY(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 菜单项动画 */
.menu-item-animated {
  animation: fadeInDown 0.5s both;
  transform-origin: top center;
}

/* Logo 脉冲效果 */
.logo-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 按钮样式 */
.login-btn, .register-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.login-btn:hover, .register-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.login-btn::after, .register-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.login-btn:hover::after, .register-btn:hover::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(30, 30);
    opacity: 0;
  }
}

/* 用户头像动画 */
.avatar-pulse {
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.avatar-pulse:hover {
  transform: scale(1.05);
  border-color: #fff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
}

/* 自定义返回顶部按钮 */
.custom-backtop {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.backtop-inner {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563EB, #1C56BA);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 2px 12px rgba(28, 86, 186, 0.3);
  transition: all 0.3s ease;
}

.custom-backtop:hover .backtop-inner {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(28, 86, 186, 0.4);
}

/* 标题动画 */
.titles {
  position: relative;
  transition: all 0.3s ease;
}

.titles:hover {
  transform: scale(1.05);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.titles::after {
  content: '';
  position: absolute;
  bottom: 15px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #fff;
  transition: width 0.3s ease;
}

.titles:hover::after {
  width: 100%;
}
</style>
