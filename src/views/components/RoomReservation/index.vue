<template>
  <vxe-modal
    v-model="detailVisible"
    :title="currentHomestay.title"
    width="60%"
    style="border-radius: 8px; overflow: hidden; z-index: 2000 !important; margin-top: 110px !important;"
    @close="handleClose" height="80vh"
    showFooter esc-closable show-zoom resize>

    <!-- 图片轮播区域 -->
    <div style="position: relative; margin-bottom: 20px;">
      <img style="width: 100%;height: 400px;background-size: cover; background-position: center;"
           :src="currentHomestay.image" alt="">
      <div class="price-box">
        <div style="font-size: 24px;font-weight: bold;color: #ff4d4f;">¥{{ currentHomestay.price }}
          <span style="font-size: 14px; font-weight: normal;">/晚</span>
        </div>
        <el-button type="primary" size="medium" @click="scrollToBooking">立即预订</el-button>
      </div>
    </div>

    <!-- 基本信息区域 -->
    <div style="display: flex;margin-top: 20px;">
      <div style="flex: 3; padding-right: 30px;">
        <h3 style="margin: 0 0 10px;font-size: 24px;color: #333;">{{ currentHomestay.title }}</h3>
        <div style="color: #666;margin-bottom: 15px;display: flex;align-items: center;">
          <i style="margin-right: 5px;color: #ff4d4f;" class="el-icon-location"></i>
          <span>{{ currentHomestay.location }}</span>
        </div>

        <div class="tags">
          <el-tag
            v-for="(tag, index) in currentHomestay.tags"
            :key="index"
            size="small">
            {{ tag }}
          </el-tag>
        </div>

        <div class="divider"></div>

        <!-- 民宿描述 -->
        <div class="description">
          <h4 style="font-size: 18px;margin: 15px 0;color: #333;">民宿介绍</h4>
          <p style="line-height: 1.8;color: #666;">{{ currentHomestay.description }}</p>
        </div>

        <!-- 设施服务 -->
        <div class="facilities">
          <h4 style="font-size: 18px;margin: 15px 0;color: #333;">设施服务</h4>
          <el-row :gutter="20">
            <el-col :span="6" v-for="(facility, index) in currentHomestay.facilities" :key="index">
              <div style="display: flex;align-items: center;margin-bottom: 10px;">
                <i :class="facilityIconMap[facility.trim()]" style="color: #409EFF;margin-right: 8px;font-size: 18px;"></i>
                <span>{{ facility }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 预订表单 -->
      <div class="booking-form" ref="form">
        <h4>预订信息</h4>
        <el-form :model="form" :rules="bookingRules" ref="formRef" label-width="80px">
          <el-form-item label="入住日期" prop="checkInDate">
            <el-date-picker
              v-model="form.checkInDate"
              type="date"
              placeholder="选择日期"
              :picker-options="checkInPickerOptions"
              @change="handleCheckInChange">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="退房日期" prop="checkOutDate">
            <el-date-picker
              v-model="form.checkOutDate"
              type="date"
              placeholder="选择日期"
              :picker-options="checkOutPickerOptions"
              :disabled="!form.checkInDate">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="总价">
            <div style="font-size: 20px;color: #ff4d4f;font-weight: bold;">¥{{ calculateTotalPrice() }}</div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitBooking" style="width: 100%">立即预订</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 评价区域 -->
    <div class="reviews-section">
      <h3>房客评价 ({{ reviews.length || 0 }})</h3>
      <div class="review-item" v-for="review in reviews" :key="review.id">
        <div class="review-header">
          <div style="display: flex; align-items: center;">
            <img :src="review.image" class="user-avatar">
            <span class="user-name">{{ review.nickName }}</span>
          </div>
          <div class="review-rating">
            <el-rate v-model="review.rating" disabled></el-rate>
            <span class="review-date">{{ review.createTime }}</span>
          </div>
        </div>
        <div class="review-content">
          {{ review.content }}
        </div>
      </div>
    </div>

  </vxe-modal>
</template>

<script>
import {getHomestay} from "@/api/huacai/homestay";
import {addOrders} from "@/api/huacai/orders";
import {selectEvaluateByHomestayId} from "@/api/huacai/evaluate";

export default {
  name: "RoomReservation",
  data() {
    return {
      detailVisible: false,
      currentHomestay: [],
      form: {
        orderId: null,
        checkInDate: null,
        checkOutDate: null,
        days: null,
        status: null,
        homestayId: null,
        userId: null,
        totalAmount: null,
        createTime: null
      },
      bookingRules: {
        checkInDate: [
          { required: true, message: '请选择入住日期', trigger: 'change' }
        ],
        checkOutDate: [
          { required: true, message: '请选择退房日期', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (new Date(value) <= new Date(this.form.checkInDate)) {
                callback(new Error('退房日期必须晚于入住日期'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ]
      },
      facilityIconMap: {
        '无线网络': 'el-icon-connection',
        '空调': 'el-icon-cold-drink',
        '厨房': 'el-icon-knife-fork',
        '洗衣机': 'el-icon-basketball',
        '电视': 'el-icon-video-camera',
        '热水': 'el-icon-water-cup',
        '停车位': 'el-icon-bicycle',
        '早餐': 'el-icon-food'
      },
      reviews: [],
      // 日期选择器配置
      checkInPickerOptions: {
        disabledDate(time) {
          // 禁用今天之前的日期
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      checkOutPickerOptions: {
        disabledDate: (time) => {
          // 如果没有选择入住日期，禁用所有日期
          if (!this.form.checkInDate) {
            return true;
          }
          // 退房日期必须大于入住日期
          const checkInDate = new Date(this.form.checkInDate);
          return time.getTime() <= checkInDate.getTime();
        }
      },

    }
  },
  methods: {
    handleCheckInChange() {
      // 当入住日期改变时，清空退房日期
      this.form.checkOutDate = '';
    },
    handleOpen(homestayId) {
      getHomestay(homestayId).then(res => {
        this.currentHomestay = res.data;
        this.currentHomestay.image = process.env.VUE_APP_BASE_API + this.currentHomestay.image
        this.currentHomestay.facilities = this.currentHomestay.facilities.split(",");
        this.detailVisible = true;

        this.form.homestayId = res.data.homestayId
      })
      selectEvaluateByHomestayId(homestayId).then(res => {
        this.reviews = res.data
        this.reviews.forEach(item => {
          item.image = process.env.VUE_APP_BASE_API + item.image
        })
      })
    },
    handleClose() {
      this.$refs.formRef.resetFields();
    },

    scrollToBooking() {
      this.$nextTick(() => {
        const el = this.$refs.form;
        if (el) {
          el.scrollIntoView({behavior: 'smooth'});
        }
      });
    },

    calculateTotalPrice() {
      if (!this.form.checkInDate || !this.form.checkOutDate) {
        return this.currentHomestay.price;
      }

      const diffTime = Math.abs(new Date(this.form.checkOutDate) - new Date(this.form.checkInDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return this.currentHomestay.price * diffDays;
    },

    submitBooking() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          addOrders(this.form).then(res => {
            this.$message.success('预订成功！');
            this.detailVisible = false;
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.price-box {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.booking-form {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
  position: sticky;
  top: 20px;
}

.tags {
  margin: 15px 0;
}

.tags .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 20px 0;
}

/* 评价区域 */
.reviews-section {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.reviews-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
}

.review-item {
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-weight: 500;
}

.review-rating {
  display: flex;
  align-items: center;
}

.review-date {
  margin-left: 10px;
  color: #999;
  font-size: 13px;
}

.review-content {
  color: #666;
  line-height: 1.6;
}
</style>
