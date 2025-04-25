<template>
  <div class="custom-menu-container">
    <!-- 自定义菜单项，不再依赖ElMenu组件 -->
    <div 
      v-for="(item, index) in visibleTopMenus" 
      :key="index"
      class="custom-menu-item"
      :class="{ 'is-active': isActive(item.path) }"
      @mouseenter="handleMouseEnter(item)" 
      @mouseleave="handleMouseLeave(item)"
      @click="directNavigate(item)"
    >
      <div class="menu-item-content">
        <svg-icon :icon-class="item.meta.icon" class="menu-icon" />
        <span>{{ item.meta.title }}</span>
      </div>
    </div>

    <!-- 更多菜单下拉 -->
    <div 
      v-if="hiddenTopMenus.length > 0"
      class="custom-menu-item more-menu"
      :class="{ 'is-active': moreMenuActive }"
      @mouseenter="showMoreMenu = true"
      @mouseleave="hideMoreMenu"
    >
      <div class="menu-item-content">
        <i class="el-icon-more menu-icon"></i>
        <span>更多</span>
      </div>
      
      <!-- 更多菜单下拉内容 -->
      <div class="more-menu-dropdown" v-show="showMoreMenu">
        <div 
          v-for="(item, index) in hiddenTopMenus" 
          :key="index"
          class="dropdown-item"
          :class="{ 'is-active': isActive(item.path) }"
          @click.stop="directNavigate(item)"
        >
          <svg-icon :icon-class="item.meta.icon" class="menu-icon" />
          <span>{{ item.meta.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { constantRoutes } from "@/router";

// 隐藏侧边栏路由
const hideList = ['/index', '/user/profile'];

export default {
  data() {
    return {
      pathName: '', //主目录
      pathChildren: [], //目录下二级菜单列表
      // 顶部栏初始数
      visibleNumber: 6,
      // 当前激活菜单的 index
      currentIndex: undefined,
      // 是否显示更多菜单
      showMoreMenu: false,
      // 鼠标悬停的菜单项
      hoverItem: null,
      // 定时器，防止快速移动鼠标导致的问题
      hoverTimer: null
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    // 顶部显示菜单
    topMenus() {
      let topMenus = [];
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          // 兼容顶部栏一级菜单内部跳转
          if (menu.path === "/") {
            topMenus.push(menu.children[0]);
          } else {
            topMenus.push(menu);
          }
        }
      });
      return topMenus;
    },
    // 可见的顶部菜单
    visibleTopMenus() {
      return this.topMenus.slice(0, this.visibleNumber);
    },
    // 隐藏在更多菜单中的项目
    hiddenTopMenus() {
      return this.topMenus.slice(this.visibleNumber);
    },
    // 所有的路由信息
    routers() {
      return this.$store.state.permission.topbarRouters;
    },
    // 设置子路由
    childrenMenus() {
      var childrenMenus = [];
      this.routers.map((router) => {
        for (var item in router.children) {
          if (router.children[item].parentPath === undefined) {
            if (router.path === "/") {
              router.children[item].path = "/" + router.children[item].path;
            } else {
              if (!this.ishttp(router.children[item].path)) {
                router.children[item].path = router.path + "/" + router.children[item].path;
              }
            }
            router.children[item].parentPath = router.path;
          }
          childrenMenus.push(router.children[item]);
        }
      });
      return constantRoutes.concat(childrenMenus);
    },
    // 判断"更多"菜单是否激活
    moreMenuActive() {
      // 检查所有隐藏菜单中是否有当前激活的菜单
      return this.hiddenTopMenus.some(item => this.isActive(item.path));
    },
    // 默认激活的菜单
    activeMenu() {
      const path = this.$route.path;
      let activePath = path;
      if (path !== undefined && path.lastIndexOf("/") > 0 && hideList.indexOf(path) === -1) {
        const tmpPath = path.substring(1, path.length);
        activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
        if (!this.$route.meta.link) {
          this.$store.dispatch('app/toggleSideBarHide', false);
        }
      } else if (!this.$route.children) {
        activePath = path;
        this.$store.dispatch('app/toggleSideBarHide', true);
      }
      this.activeRoutes(activePath);
      return activePath;
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.setVisibleNumber)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setVisibleNumber);
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
  },
  mounted() {
    this.setVisibleNumber();
    // 初始化激活路径
    this.currentIndex = this.activeMenu;
  },
  methods: {
    // 检查菜单项是否激活
    isActive(path) {
      return this.activeMenu === path;
    },
    
    // 处理鼠标进入
    handleMouseEnter(item) {
      // 清除之前的定时器
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }
      this.hoverItem = item;
    },
    
    // 处理鼠标离开
    handleMouseLeave(item) {
      // 使用定时器避免快速移动鼠标时的问题
      this.hoverTimer = setTimeout(() => {
        if (this.hoverItem === item) {
          this.hoverItem = null;
        }
      }, 50);
    },
    
    // 隐藏更多菜单
    hideMoreMenu() {
      setTimeout(() => {
        this.showMoreMenu = false;
      }, 100);
    },
    
    // 直接导航，完全绕过ElMenu的事件处理
    directNavigate(item) {
      console.log('直接导航到:', item.path);
      this.currentIndex = item.path;
      
      // 立即隐藏更多菜单
      this.showMoreMenu = false;
      
      // 如果是当前已激活的菜单，不再重复导航
      if (this.activeMenu === item.path) {
        return;
      }
      
      // 如果有子菜单
      if (item.children && item.children.length > 0) {
        // 存储当前菜单和子菜单
        this.pathChildren = [...item.children];
        this.pathName = item.path;
        // 显示侧边栏并导航到第一个子菜单
        this.$store.dispatch('app/toggleSideBarHide', false);
        this.$nextTick(() => {
          this.activeRoutes(item.path);
          this.$router.push({ path: item.children[0].path });
        });
      } else {
        // 无子菜单直接导航
        this.$store.dispatch('app/toggleSideBarHide', true);
        if (this.ishttp(item.path)) {
          window.open(item.path, "_blank");
        } else {
          this.$nextTick(() => {
            this.activeRoutes(item.path);
            this.$router.push({ path: item.path })
              .catch(err => {
                console.warn('导航错误:', err);
              });
          });
        }
      }
    },
    
    // 根据宽度计算设置显示栏数
    setVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3;
      this.visibleNumber = Math.max(3, parseInt(width / 20));
    },
    
    // 当前激活的路由
    activeRoutes(key) {
      var routes = [];
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key == item.parentPath || (key == "index" && "" == item.path)) {
            routes.push(item);
          }
        });
      }
      if (routes.length > 0) {
        this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
      } else {
        this.$store.dispatch('app/toggleSideBarHide', true);
      }
    },
    ishttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    }
  },
  watch: {
    // 监听路由变化，更新当前激活的菜单
    '$route': {
      handler(val) {
        this.currentIndex = this.activeMenu;
      },
      immediate: true
    },
    //监听目录
    'pathName': function (newVal) {
      if (this.pathChildren && this.pathChildren.length > 0) {
        this.$router.push({ path: this.pathChildren[0].path });
      }
    },
  },
};
</script>

<style lang="scss">
/* 自定义菜单容器 */
.custom-menu-container {
  display: flex;
  background-color: #1c56ba;
  height: 60px;
  align-items: center;
  user-select: none;
}

/* 自定义菜单项 */
.custom-menu-item {
  height: 60px;
  padding: 0 5px;
  min-width: 80px;
  position: relative;
  color: #fff;
  cursor: pointer;
  text-align: center;
}

.custom-menu-item:hover {
  background-color: #164595;
}

.custom-menu-item.is-active {
  background: linear-gradient(#255bbc, #838dce);
  border-bottom: 1px solid #ff0000;
}

/* 菜单项内容 */
.menu-item-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.custom-menu-item .menu-icon {
  margin-bottom: 4px;
  font-size: 24px;
}

/* 更多菜单样式 */
.more-menu {
  position: relative;
}

.more-menu-dropdown {
  position: absolute;
  top: 60px;
  left: 0;
  min-width: 120px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2001;
}

.dropdown-item {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: #303133;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

.dropdown-item.is-active {
  color: #409EFF;
  font-weight: bold;
}

.dropdown-item .menu-icon {
  margin-right: 10px;
  color: #909399;
}
</style>
