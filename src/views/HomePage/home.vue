<template>
  <div class="home-page">
    <!-- 页面装饰元素 -->
    <div class="decoration-circle decoration-circle-1"></div>
    <div class="decoration-circle decoration-circle-2"></div>
    <div class="decoration-dot-grid"></div>

    <!-- 加载动画 -->
    <div v-if="loading" class="page-loading-overlay">
      <div class="loading-spinner-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">载入精彩内容中...</div>
      </div>
    </div>

    <div v-else style="padding: 30px 0">
      <!-- 热门景点 -->
      <div class="container">
        <div class="section-header">
          <h2 class="fade-in">热门景点</h2>
          <el-link type="primary" :underline="false" class="view-all-link">
            <router-link to="/index/scenicSpots">查看全部</router-link>
          </el-link>
        </div>
        <el-carousel :interval="5000" arrow="always" height="400px" class="attrs-carousel slide-in">
          <el-carousel-item v-for="(item, index) in spotsList" :key="index" class="carousel-item-animate">
            <div class="attr-item"
                 :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${item.image})` }">
              <div class="attr-content">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>
                <el-button type="primary" size="small" round class="view-detail-btn pulse-effect">查看详情</el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 主题民宿 -->
      <section style="margin: 50px auto" class="homestay-section">
        <div class="container">
          <div class="section-header">
            <h2 class="fade-in">主题民宿</h2>
            <el-link type="primary" :underline="false" class="view-all-link">
              <router-link to="/index/homestay">查看全部</router-link>
            </el-link>
          </div>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(homestay, index) in homestayList" :key="index"
                   :style="{ animationDelay: index * 0.1 + 's' }" class="fade-in">
              <el-card :body-style="{ padding: '0px' }" class="homestay-card" shadow="hover" @click.native="goToHomestay(homestay.homestayId)">
                <div class="card-image" :style="{ backgroundImage: `url(${homestay.image})` }">
                  <div class="price-tag">¥{{ homestay.price }}<span>/晚</span></div>
                </div>
                <div class="card-content">
                  <h3> {{ homestay.title }} </h3>
                  <div class="location">
                    <i class="el-icon-location"></i>
                    <span>{{homestay.location}}</span>
                  </div>
                  <div class="tags">
                    <el-tag v-for="(tag, i) in homestay.tags" :key="i" size="mini">{{ tag }}</el-tag>
                  </div>
                  <div class="card-footer">
                    <div class="rating">
                      <i class="el-icon-star-on"></i>
                      <span>{{ (Math.random() * 2 + 3).toFixed(1) }}</span>
                    </div>
                    <div class="book-now">预订</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </section>
      
      <!-- 推荐景点区域 -->
      <section class="recommendation-section">
        <div class="container">
          <div class="section-header">
            <h2 class="fade-in">精选推荐</h2>
          </div>
          <div class="recommendation-cards">
            <div class="recommendation-card" v-for="(spot, index) in spotsList.slice(0, 3)" :key="'rec-'+index">
              <div class="recommendation-image" :style="{ backgroundImage: `url(${spot.image})` }">
                <div class="overlay"></div>
                <div class="recommendation-content">
                  <h3>{{ spot.name }}</h3>
                  <p>{{ spot.description.substring(0, 50) }}...</p>
                  <el-button type="primary" size="small" class="explore-btn">探索</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 动态效果提示 -->
      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <div class="scroll-text">向下滚动探索更多</div>
      </div>

    </div>

    <RoomReservation ref="roomReservation"/>

  </div>
</template>

<script>
import {listSpots} from "@/api/huacai/spots";
import {listHomestay} from "@/api/huacai/homestay";
import RoomReservation from "@/views/components/RoomReservation/index.vue";

export default {
  components: {RoomReservation},
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 4,
      },
      spotsList: [], //景点列表
      homestayList: [], //民宿列表
      loading: true,
      observer: null
    };
  },
  created() {
    this.getList();
    // 模拟加载
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  mounted() {
    // 设置页面滚动相关的观察器
    this.setupIntersectionObserver();
    // 初始化动画
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    // 清理观察器和事件监听
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    goToHomestay(homestayId) {
      this.$refs.roomReservation.handleOpen(homestayId)
    },
    getList() {
      //查询景点列表
      listSpots(this.queryParams).then(res => {
        this.spotsList = res.rows
        this.spotsList.forEach(item => {
          item.image = process.env.VUE_APP_BASE_API + item.image
          // 添加模拟标签
          item.tags = ['休闲', '自然', '文化'].sort(() => Math.random() - 0.5).slice(0, 2);
        })
      })
      //查询民宿列表
      listHomestay(this.queryParams).then(res => {
        this.homestayList = res.rows
        this.homestayList.forEach(item => {
          item.image = process.env.VUE_APP_BASE_API + item.image
          // 为每个民宿添加标签
          item.tags = ['温馨', '豪华', '特色', '景观', '情侣', '家庭'].sort(() => Math.random() - 0.5).slice(0, 3);
        })
      })
    },
    setupIntersectionObserver() {
      // 创建观察器，用于检测元素进入视口时添加动画
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });

      // 添加所有需要监控的元素
      document.querySelectorAll('.section-header, .homestay-card, .recommendation-card').forEach(el => {
        this.observer.observe(el);
      });
    },
    handleScroll() {
      // 处理滚动事件，可添加滚动相关动画逻辑
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 当滚动超过一定距离时隐藏滚动指示器
      if (scrollTop > 300) {
        document.querySelector('.scroll-indicator').style.opacity = '0';
      } else {
        document.querySelector('.scroll-indicator').style.opacity = '1';
      }
    }
  }
};
</script>

<style scoped>
.home-page {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

/* 加载动画 */
.page-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner-container {
  text-align: center;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(28, 86, 186, 0.1);
  border-radius: 50%;
  border-top-color: #1C56BA;
  animation: spinner 1s linear infinite;
}

.loading-text {
  margin-top: 20px;
  font-size: 18px;
  color: #1C56BA;
  font-weight: 500;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

/* 装饰元素 */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
  z-index: -1;
}

.decoration-circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  background: linear-gradient(135deg, #2563EB, #1C56BA);
}

.decoration-circle-2 {
  width: 500px;
  height: 500px;
  bottom: -250px;
  left: -250px;
  background: linear-gradient(135deg, #1C56BA, #0c4b7c);
}

.decoration-dot-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#1C56BA 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.03;
  z-index: -1;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section h1 {
  font-size: 36px;
  margin-bottom: 30px;
  font-weight: 500;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  transition: all 0.5s ease;
}

.section-header h2 {
  font-size: 28px;
  font-weight: 500;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.section-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 70%;
  width: 4px;
  background: linear-gradient(180deg, #2563EB, #1C56BA);
  border-radius: 4px;
}

.view-all-link {
  transition: all 0.3s ease;
}

.view-all-link:hover {
  transform: translateX(5px);
}

/* 景点轮播图美化 */
.attrs-carousel {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.carousel-item-animate {
  transition: all 0.7s ease;
}

.carousel-item-animate:hover {
  transform: scale(1.02);
}

.attr-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.attr-content {
  padding: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  backdrop-filter: blur(5px);
  max-width: 500px;
  transition: all 0.5s;
}

.attr-content:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-5px);
}

.attr-content h3 {
  font-size: 32px;
  margin-bottom: 15px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.attr-content p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.view-detail-btn {
  padding: 10px 20px;
  font-weight: 500;
}

.pulse-effect {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
  }
}

/* 民宿卡片样式 */
.homestay-section {
  perspective: 1000px;
  margin-top: 80px !important;
}

.homestay-card {
  margin-bottom: 20px;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.5s;
  cursor: pointer;
  transform-style: preserve-3d;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.homestay-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: all 0.5s;
}

.homestay-card:hover .card-image {
  height: 220px;
}

.price-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(28, 86, 186, 0.8);
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.homestay-card:hover .price-tag {
  transform: translateY(-5px);
  background-color: rgba(28, 86, 186, 0.9);
}

.price-tag span {
  font-size: 14px;
  font-weight: normal;
}

.card-content {
  padding: 20px;
  background: white;
}

.card-content h3 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.location {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.location i {
  margin-right: 5px;
  color: #1C56BA;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tags .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
  background-color: rgba(28, 86, 186, 0.05);
  color: #1C56BA;
  border-color: rgba(28, 86, 186, 0.2);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.rating {
  display: flex;
  align-items: center;
  color: #ffa41c;
}

.rating i {
  margin-right: 5px;
}

.book-now {
  background: #1C56BA;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.book-now:hover {
  background: #2563EB;
  transform: translateY(-2px);
}

/* 推荐景点区域 */
.recommendation-section {
  margin: 80px auto;
}

.recommendation-cards {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
}

.recommendation-card {
  flex: 1;
  height: 350px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
}

.recommendation-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.recommendation-image {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 60%);
  transition: all 0.3s;
}

.recommendation-card:hover .overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.2) 60%);
}

.recommendation-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  color: white;
  transform: translateY(20px);
  opacity: 0.9;
  transition: all 0.3s;
}

.recommendation-card:hover .recommendation-content {
  transform: translateY(0);
  opacity: 1;
}

.recommendation-content h3 {
  font-size: 24px;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.recommendation-content p {
  font-size: 14px;
  margin-bottom: 20px;
  opacity: 0.8;
}

.explore-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  transition: all 0.3s;
}

.explore-btn:hover {
  background: white;
  color: #1C56BA;
}

/* 滚动指示器 */
.scroll-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  opacity: 1;
  transition: opacity 0.5s;
  z-index: 10;
}

.mouse {
  width: 30px;
  height: 50px;
  border: 2px solid #333;
  border-radius: 20px;
  margin: 0 auto 10px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background: #333;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  animation: scroll 1.5s infinite;
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
}

.scroll-text {
  font-size: 12px;
  color: #333;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slide-in {
  animation: slideIn 0.8s ease-out;
}

@keyframes slideIn {
  from { 
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 1240px) {
  .container {
    width: 95%;
  }
  
  .recommendation-cards {
    flex-direction: column;
  }
  
  .recommendation-card {
    height: 250px;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 24px;
  }
  
  .attr-content h3 {
    font-size: 26px;
  }
  
  .attr-content p {
    font-size: 14px;
  }
  
  .recommendation-content h3 {
    font-size: 20px;
  }
}

/* 滚动动画触发 */
.animate-on-scroll {
  animation: fadeInUp 0.8s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
