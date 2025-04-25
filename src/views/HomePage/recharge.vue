<template>
  <div class="recharge-page">
    <div class="container">
      <div class="recharge-card">
        <h2 class="title">账户充值</h2>

        <!-- 当前余额 -->
        <div class="balance-section">
          <div class="balance-label">当前余额</div>
          <div class="balance-amount">¥ {{ balance !== null ? balance.toFixed(2) : '0.00' }}</div>
        </div>

        <!-- 充值金额选择 -->
        <div class="amount-section">
          <h3 class="section-title">选择充值金额</h3>
          <div class="amount-options">
            <div
              v-for="amount in amountOptions"
              :key="amount"
              class="amount-option"
              :class="{ 'active': selectedAmount === amount }"
              @click="selectAmount(amount)">
              ¥{{ amount }}
            </div>
            <div
              class="amount-option custom"
              :class="{ 'active': isCustomAmount }">
              <el-input
                v-model="customAmount"
                placeholder="自定义金额"
                size="small"
                @focus="selectCustomAmount"
                @blur="validateCustomAmount">
                <template slot="prepend">¥</template>
              </el-input>
            </div>
          </div>
        </div>

        <!-- 充值按钮 -->
        <div class="action-section">
          <el-button
            type="primary"
            size="small"
            :disabled="!canSubmit || loading"
            :loading="loading"
            @click="confirmPayment">
            立即充值 ¥{{ rechargeAmount !== null ? rechargeAmount.toFixed(2) : '0.00' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 支付结果对话框 -->
    <vxe-modal
      :title="paymentResult.title"
      v-model="showResultDialog"
      width="400px"
      showFooter esc-closable show-zoom resize>
      <div class="result-dialog">
        <div class="result-icon" :class="paymentResult.status">
          <i :class="paymentResult.icon"></i>
        </div>
        <div class="result-message">{{ paymentResult.message }}</div>
        <div class="result-detail" v-if="paymentResult.detail">
          {{ paymentResult.detail }}
        </div>
      </div>
      <span slot="footer" style="display: flex; justify-content: center">
        <el-button type="primary" @click="closeResultDialog">确 定</el-button>
      </span>
    </vxe-modal>
  </div>
</template>

<script>
import {getUser} from "@/api/system/user";
import {updateUserAmount} from "@/api/huacai/homestay";

export default {
  name: 'RechargePage',
  data() {
    return {
      balance: null, // 当前余额
      amountOptions: [50, 100, 200, 500, 1000], // 充值金额选项
      selectedAmount: 100, // 选中的金额
      customAmount: '', // 自定义金额
      isCustomAmount: false, // 是否选择自定义金额
      showResultDialog: false, // 是否显示支付结果对话框
      paymentResult: {}, // 支付结果
      loading: false, // 加载状态
    }
  },
  computed: {
    // 计算充值金额
    rechargeAmount() {
      return this.isCustomAmount ? parseFloat(this.customAmount) || 0 : this.selectedAmount
    },
    // 是否可以提交
    canSubmit() {
      return this.rechargeAmount > 0
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true
      getUser(this.$store.state.user.id).then(res => {
        this.balance = res.data.balance
        this.loading = false
      }).catch(error => {
        console.error('获取用户信息失败:', error)
        this.balance = 0
        this.loading = false
      })
    },
    // 选择充值金额
    selectAmount(amount) {
      this.selectedAmount = amount
      this.isCustomAmount = false
      this.customAmount = ''
    },
    // 选择自定义金额
    selectCustomAmount() {
      this.isCustomAmount = true
      this.selectedAmount = 0
    },
    // 验证自定义金额
    validateCustomAmount() {
      if (this.customAmount === '' || parseFloat(this.customAmount) <= 0) {
        this.isCustomAmount = false
        this.customAmount = ''
        this.selectedAmount = 100
      }
    },
    // 确认支付
    confirmPayment() {
      this.loading = true
      //支付成功
      updateUserAmount(this.rechargeAmount).then(res => {
        console.log(res.data, '充值后的金额')
        this.paymentResult = {
          status: 'success',
          title: '支付成功',
          icon: 'el-icon-success',
          message: '充值成功！',
          detail: `充值金额: ¥${this.rechargeAmount.toFixed(2)}，账户余额: ¥${res.data ? res.data.toFixed(2) : '0.00'}`
        }
        this.showResultDialog = true
        this.getList();
        this.loading = false
      }).catch(error => {
        console.error('充值失败:', error)
        this.paymentResult = {
          status: 'error',
          title: '支付失败',
          icon: 'el-icon-error',
          message: '充值失败，请重试！',
          detail: '请检查网络连接或联系客服'
        }
        this.showResultDialog = true
        this.loading = false
      })
    },
    // 关闭结果对话框
    closeResultDialog() {
      this.showResultDialog = false
    }
  }
}
</script>

<style scoped>
.recharge-page {
  padding: 40px 0;
  min-height: calc(100vh - 80px);
  position: relative;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.recharge-card {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.recharge-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.title {
  margin: 0 0 30px;
  font-size: 24px;
  color: #303133;
  text-align: center;
}

.balance-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(245, 247, 250, 0.5);
  border-radius: 8px;
  margin-bottom: 30px;
}

.balance-label {
  font-size: 16px;
  color: #606266;
}

.balance-amount {
  font-size: 24px;
  font-weight: bold;
  color: #ff4d4f;
}

.section-title {
  margin: 0 0 15px;
  font-size: 18px;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.amount-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.amount-option {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
}

.amount-option:hover {
  border-color: #c0c4cc;
}

.amount-option.active {
  border-color: #409eff;
  background-color: rgba(236, 245, 255, 0.7);
  color: #409eff;
}

.amount-option.custom {
  padding: 0 10px;
  grid-column: span 1;
}

.action-section {
  text-align: center;
}

.action-section .el-button {
  width: 100%;
  max-width: 300px;
  height: 50px;
  font-size: 18px;
}

.result-dialog {
  text-align: center;
  padding: 0 20px 20px;
}

.result-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.result-icon.success {
  color: #67c23a;
}

.result-icon.error {
  color: #f56c6c;
}

.result-message {
  font-size: 18px;
  margin-bottom: 10px;
  color: #303133;
}

.result-detail {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
</style>
