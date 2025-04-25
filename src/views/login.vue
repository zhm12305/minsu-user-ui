<template>
  <div class="login">
    <!-- 背景视频或图片 -->
    <div class="bg-container">
      <video autoplay muted loop id="bg-video">
        <source src="../assets/media/index-back.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="overlay"></div>
    </div>

    <!-- 登录表单 -->
    <div class="form-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <h3 class="title">悦享—民宿</h3>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
          >
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="请输入密码"
            @keyup.enter.native="handleLogin"
            prefix-icon="el-icon-lock"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>

        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>

        <div class="remember-container">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
        </div>

        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>

        <div class="options-container" v-if="register">
          <router-link class="register-link" :to="'/register'">还没有账号？立即注册</router-link>
        </div>
      </el-form>
    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2024-20xx 悦享—民宿.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: false,
      // 注册开关
      register: true,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
    // 禁止代码调试
    // (() => {
    //   function block() {
    //     if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
    //       document.body.innerHTML = "检测到非法调试,请关闭后刷新重试!";
    //     }
    //     setInterval(() => {
    //       (function () {
    //         return false;
    //       }
    //         ['constructor']('debugger')
    //         ['call']());
    //     }, 50);
    //   }
    //
    //   try {
    //     block();
    //   } catch (err) {
    //   }
    // })();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 全局样式 */
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 背景视频容器 */
.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}

/* 背景视频 */
#bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%) translateY(-50%);
  object-fit: cover;
  /* 添加额外的缩放控制 */
  max-width: 100%;
  max-height: 100%;
  /* 确保视频固定在中心点 */
  object-position: center;
}

/* 背景叠加层 - 增加视频上的深色覆盖以提高对比度 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

/* 表单容器 */
.form-container {
  width: 420px;
  position: relative;
  z-index: 1;
}

/* 登录表单 */
.login-form {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15px);
  padding: 40px 45px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transition: all 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: all 0.8s;
  }

  &:hover {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    transform: translateY(-8px);

    &::before {
      left: 100%;
      transition: all 0.8s;
    }
  }
}

/* 标题 */
.title {
  margin: 0 0 35px 0;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #1C56BA;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;
  animation: fadeInDown 0.8s ease-out;
  background: linear-gradient(to right, #1C56BA, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 输入框样式 */
.el-input {
  margin-bottom: 15px;
  transform: translateY(30px);
  opacity: 0;
  animation: slideUp 0.5s forwards;
  animation-delay: calc(var(--i, 0) * 0.1s);

  @for $i from 1 through 5 {
    &:nth-child(#{$i}) {
      --i: #{$i};
    }
  }

  .el-input__inner {
    height: 50px;
    line-height: 50px;
    border-radius: 10px;
    border: 1px solid rgba(216, 220, 229, 0.5);
    background-color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    padding-left: 45px;
    transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000);

    &:focus {
      border-color: #1C56BA;
      background-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 0 4px rgba(28, 86, 186, 0.15);
      transform: translateY(-2px);
    }
  }

  .input-icon {
    height: 50px;
    width: 20px;
    margin-left: 15px;
    color: #1C56BA;
    opacity: 0.7;
    transition: all 0.3s ease;
  }

  &:focus-within .input-icon {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 记住密码容器 */
.remember-container {
  margin: 15px 0 30px;
  animation: fadeIn 0.8s forwards;
  animation-delay: 0.4s;
  opacity: 0;

  .el-checkbox {
    color: #5d7b9d;
    font-size: 15px;

    .el-checkbox__inner {
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1C56BA;
      }
    }
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #1C56BA;
    border-color: #1C56BA;
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #1C56BA;
  }
}

/* 登录按钮 */
.login-button {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563EB, #1C56BA);
  border: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(28, 86, 186, 0.3);
  transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s forwards;
  animation-delay: 0.5s;
  opacity: 0;

  &::after {
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

  &:hover, &:focus {
    background: linear-gradient(135deg, #1d4ed8, #1a4aa6);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(28, 86, 186, 0.4);

    &::after {
      animation: ripple 1s ease-out;
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 8px rgba(28, 86, 186, 0.4);
  }
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

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 验证码样式 */
.login-code {
  width: 34%;
  height: 46px;
  float: right;

  .login-code-img {
    height: 100%;
    border-radius: 8px;
    cursor: pointer;
    display: block;
    width: 100%;
    object-fit: cover;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
}

/* 注册链接容器 */
.options-container {
  margin-top: 25px;
  text-align: center;
  animation: fadeIn 0.8s forwards;
  animation-delay: 0.6s;
  opacity: 0;

  .register-link {
    color: #1C56BA;
    font-size: 15px;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    padding: 5px 0;
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      transform: scaleX(0);
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #1C56BA;
      transform-origin: bottom right;
      transition: transform 0.3s ease-out;
    }

    &:hover {
      color: #2563EB;

      &::after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
    }
  }
}

/* 页脚 */
.el-login-footer {
  height: 60px;
  line-height: 60px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #ffffff;
  font-family: Arial, sans-serif;
  font-size: 14px;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  animation: fadeIn 1s forwards;
  animation-delay: 0.8s;
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .form-container {
    width: 90%;
    max-width: 360px;
  }

  .login-form {
    padding: 25px 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 25px;
  }
}
</style>
