<template>
  <div class="booking-container">
    <div style="max-width: 1200px; margin: 0 auto">

      <!-- 顶部搜索 -->
      <div style="margin-top: 15px; display: flex; justify-content: flex-end">
        <el-input
          style="width: 300px;"
          v-model="queryParams.title"
          placeholder="请输入民宿名称"
          clearable
          @keydown.enter.native="handleQuery"
          @clear="handleQuery"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleQuery"/>
        </el-input>
      </div>

      <!-- 订单列表 -->
      <div
        style="margin: 10px 0; background-color: rgba(255, 255, 255, 0.7); padding: 20px;border-radius: 12px;box-shadow: 0 1px 4px rgba(0,0,0,0.08)">
        <div v-if="loading" style="padding: 20px 0">
          <el-skeleton :rows="5" animated/>
        </div>

        <el-empty v-if="orders.length === 0" description="暂无订单"/>

        <div v-else>
          <div v-for="order in orders" :key="order.orderId" class="order-card">
            <div class="order-header">
              <div style="display: flex; align-items: center; flex-wrap: wrap">
                <span style="font-size: 14px; color: #474849; margin-right: 20px">订单号:{{ order.orderId }}</span>
                <span style="font-size: 13px; color: #474849">下单时间:{{ order.createTime }}</span>
              </div>
              <dict-tag :options="dict.type.orders_status" :value="order.status"/>
            </div>

            <div style="display: flex; padding: 20px;flex-wrap: wrap">
              <div style="display: flex; margin-top: 15px;flex-wrap: wrap">

                <div style="flex: 1">
                  <h4
                    style="margin: 0 0 10px; color: #303133; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;max-width: 200px">
                    {{ order.title }}
                  </h4>
                  <div class="homestay-location">
                    <i class="el-icon-location"></i>
                    <span>{{ order.location }}</span>
                  </div>
                  <div style="font-size: 14px;color: #727377">
                    <span>入住: {{ order.checkInDate }}</span>
                    <span style="margin: 0 10px">-</span>
                    <span>退房: {{ order.checkOutDate }}</span>
                  </div>
                </div>
              </div>

              <div class="order-price">
                <div class="price-item">
                  <span>单价:</span>
                  <span>¥{{ order.price }}/晚</span>
                </div>
                <div class="price-item">
                  <span>天数:</span>
                  <span>¥{{ order.days }}/晚</span>
                </div>
                <div class="price-item total">
                  <span>总价:</span>
                  <span style="font-weight: bold;color: #e75252">¥{{ order.totalAmount }}</span>
                </div>
              </div>

              <div class="order-actions">
                <el-button v-if="order.status === '待支付'" type="primary" size="small" @click="payOrder(order.orderId)">立即支付</el-button>
                <el-button v-if="order.status === '已完成'" type="success" size="small" @click="handleReview(order)">评价</el-button>
              </div>

            </div>
          </div>

          <!-- 分页  -->
          <div style="margin-top: 20px; text-align: center">
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>

        </div>
      </div>
    </div>

    <!-- 评价对话框 -->
    <vxe-modal title="评价民宿" v-model="open" width="40%" esc-closable showFooter show-zoom resize>
      <el-form ref="formDialog" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="form.rating"/>
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input :rows="4" v-model="form.content" type="textarea" placeholder="请写下您的入住体验, 分享给其他用户参考"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="open = false">取 消</el-button>
      </span>
    </vxe-modal>

  </div>
</template>

<script>
import {listOrders, payOrder} from "@/api/huacai/orders";
import {addEvaluate} from "@/api/huacai/evaluate";

export default {
  name: "booking", //民宿订单
  dicts: ['orders_status'],
  data() {
    return {
      loading: false,
      // 民宿订单数据
      orders: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        homestayId: null,
        title: null,
      },
      form: {},
      open: false,
      // 表单校验
      rules: {
        rating: [
          {required: true, message: "请选择评分", trigger: "blur"}
        ],
        content: [
          {required: true, message: "请输入评价内容", trigger: "blur"}
        ],
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs["formDialog"].validate(valid => {
        if (valid) {
          addEvaluate(this.form).then(response => {
            this.$modal.msgSuccess("评价提交成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    //评价按钮
    handleReview(order) {
      this.form = {
        homestayId: order.homestayId,
        rating: null,
        content: null
      };
      this.open = true;
    },
    //搜索按钮
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList();
    },
    getList() {
      this.loading = true;
      listOrders(this.queryParams).then(response => {
        this.orders = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //立即支付
    payOrder(orderId) {
      this.$confirm('确认支付该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        payOrder(orderId).then(res => {
          if (res.code === 200) {
            this.getList();
            this.$message({type: 'success', message: '支付成功!'});
          } else {
            this.$message({type: 'error', message: res.msg || '支付失败，请确保账户余额充足!'});
          }
        }).catch(err => {
          this.$message({type: 'error', message: err.message || '支付失败，请稍后再试!'});
        });
      }).catch(() => {
        this.$message({type: 'info', message: '已取消支付'});
      });
    }
  }
}
</script>

<style scoped>
.booking-container {
  padding: 20px;
  min-height: calc(100vh - 60px);
  position: relative;
}

.order-card {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.85);
  overflow: hidden;
}

.order-card:hover {
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(to right, rgba(58, 123, 213, 0.1), rgba(0, 210, 255, 0.05));
  border-bottom: 1px solid rgba(235, 238, 245, 0.5);
}

.homestay-location {
  font-size: 13px;
  color: #7e7a7a;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.homestay-location i {
  margin-right: 5px;
}

.order-price {
  flex: 1;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 20px;
  margin-bottom: 15px;
}

.price-item {
  margin-bottom: 8px;
  font-size: 14px;
  color: #888e91;
  white-space: nowrap;
}

.price-item.total {
  font-size: 16px;
  margin-top: 10px;
}

.order-actions {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.order-actions .el-button{
  margin-bottom: 8px;
}
</style>
