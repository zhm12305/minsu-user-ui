<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card user-profile-card">
          <div slot="header" class="clearfix">
            <span class="card-header-title">个人信息</span>
          </div>
          <div class="text-center">
            <userAvatar />
          </div>
          <el-descriptions class="margin-top user-info" :column="1" border>
            <el-descriptions-item>
              <template slot="label">
                <svg-icon icon-class="user" />
                用户名称
              </template>
              {{ user.userName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <svg-icon icon-class="phone" />
                用户昵称
              </template>
              {{ user.nickName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <svg-icon icon-class="phone" />
                手机号码
              </template>
              {{ user.phonenumber }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card class="basic-info-card">
          <div slot="header" class="clearfix">
            <span class="card-header-title">基本资料</span>
          </div>
          <el-tabs v-model="activeTab" class="custom-tabs">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.box-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.user-profile-card {
  background-color: #f5f7fa;
}

.basic-info-card {
  background-color: #f5f7fa;
}

.card-header-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.user-info {
  margin-top: 20px;
}

.custom-tabs {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}

.margin-top {
  margin-top: 20px;
}
</style>
