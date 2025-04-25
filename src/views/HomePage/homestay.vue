<template>
  <div style="padding-top: 20px">
    <div style="width: 1200px; margin: 0 auto">

      <div class="sort">
        <span>排序方式:</span>
        <el-radio-group v-model="sortOption" @change="handleSortChange">
          <el-radio-button label="default">默认</el-radio-button>
          <el-radio-button label="price-asc">价格从低到高</el-radio-button>
          <el-radio-button label="price-desc">价格从高到低</el-radio-button>
        </el-radio-group>
      </div>

      <div style="margin-top: 20px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" v-for="homestay in homestayList" :key="homestay.homestayId">
            <el-card class="homestay-card" shadow="hover" @click.native="goToDetail(homestay.homestayId)">
              <div class="card-image" :style="{ backgroundImage: `url(${homestay.image})` }">
                <div class="price-tag">¥{{ homestay.price }}<span>/晚</span></div>
              </div>
              <div style="padding: 15px">
                <h3 class="homestay-title">{{ homestay.title }}</h3>
              </div>
              <div class="location">
                <i class="el-icon-location"></i>
                <span>{{ homestay.location }}</span>
              </div>
              <div class="tags">
                <el-tag size="mini" v-for="(tags, i) in homestay.homestayTagsList" :key="i">{{ tags.tag }}</el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

    </div>

    <!-- 民宿详情 -->
    <RoomReservation ref="roomReservation"/>
  </div>
</template>

<script>
import {selectHomestayOrTagsList} from "@/api/huacai/homestay";
import RoomReservation from "@/views/components/RoomReservation/index.vue";

export default {
  name: "homestay",
  components: {RoomReservation},
  data() {
    return {
      homestayList: [], //景点列表
      sortOption: 'default',

    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      selectHomestayOrTagsList().then(res => {
        this.homestayList = res.data
        this.homestayList.forEach(item => {
          item.image = process.env.VUE_APP_BASE_API + item.image
        })
      })
    },
    handleSortChange(val) {
      switch (val) {
        case 'price-asc':
          this.homestayList.sort((a,b) => a.price - b.price);
          break;
        case 'price-desc':
          this.homestayList.sort((a,b) => b.price - a.price);
          break;
        default:
          this.getList();
      }
    },
    //打开民宿详情
    goToDetail(homestayId) {
      this.$refs.roomReservation.handleOpen(homestayId)
    }
  }
}
</script>

<style scoped>
.homestay-card {
  margin-bottom: 20px;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.homestay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.price-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 18px;
  font-weight: bold;
}

.price-tag span {
  font-size: 14px;
  font-weight: normal;
}

.homestay-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: bold;
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
}

.tags {
  margin: 10px 0;
}

.tags .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.sort {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.sort span {
  margin-right: 15px;
  font-size: 14px;
  color: #666;
}
</style>
