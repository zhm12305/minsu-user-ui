<template>
<div style="padding: 20px 0">

  <!-- 景点列表 -->
  <div style="width: 1200px; margin: 0 auto">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(spot, spotsId) in spots" :key="spotsId">
        <el-card class="spot-card" shadow="hover">
          <div class="spot-image" :style="{ backgroundImage: `url(${spot.image})` }"/>
          <div style="padding: 15px">
            <h3 style="margin: 0 0 10px; font-size: 18px; font-weight: 500">{{ spot.name }}</h3>
            <div class="location">
              <i style="margin-right: 5px" class="el-icon-location"></i>
              <span>{{ spot.location }}</span>
            </div>
            <p class="brief">{{ spot.description }}</p>
            <div class="tags">
              <el-tag size="mini" v-for="(tags, i) in spot.spotsTagsList" :key="i">{{ tags.tag }}</el-tag>
            </div>
            <el-button style="width: 100%;" type="primary" @click="viewDetail(spot.spotsId)">查看详情</el-button>
          </div>
        </el-card>

      </el-col>
    </el-row>
  </div>

  <!-- 景点详情弹窗 -->
  <vxe-modal v-model="detailVisible" :title="currentSpot.name" width="70%" style="z-index: 2000 !important; margin-top: 110px !important;" show-footer esc-closable show-zoom resize>
    <div style="padding: 10px">
      <el-row :gutter="20">
        <el-col :span="16">
          <img :src="currentSpot.image" alt="" style="width: 100%; height: 100%">
        </el-col>
        <el-col span="8">
          <div style="padding: 0 15px">
            <div style="font-size: 24px; margin-top: 0">{{ currentSpot.name }}</div>
            <div class="location">
              <i style="margin-right: 5px;" class="el-icon-location"></i>
              <span>{{ currentSpot.location }}</span>
            </div>
            <div style="margin: 20px 0; color: #666; line-height: 1.6">
              <p> {{ currentSpot.description }} </p>
            </div>
            <div>
              <div style="margin: 20px 0 10px; font-size: 18px">开放时间</div>
              <p> {{ currentSpot.openingHours }} </p>
            </div>
            <div>
              <div style="margin: 20px 0 10px; font-size: 18px">附近民宿</div>
              <div style="margin-top: 10px">
                <div class="homestay-item" v-for="(homestay, homestayId) in nearByHomestays" :key="homestayId"
                @click="goToDetail(homestay.homestayId)">
                  <img :src="homestay.image" alt="">
                  <div style="flex: 1;">
                    <p style="margin: 5px 0"> {{ homestay.location }} </p>
                    <p style="color: #ff6600; font-weight: bold"> {{ homestay.price }}起 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </vxe-modal>

  <!-- 民宿详情 -->
  <RoomReservation ref="roomReservation"/>

</div>
</template>

<script>
import {selectSpotsOrTagList} from "@/api/huacai/spots";
import {selectHomestayBySpotsId} from "@/api/huacai/homestay";
import RoomReservation from "@/views/components/RoomReservation/index.vue";

export default {
  name: "scenicSpots",
  components: {RoomReservation},
 //特色景点页面
  data() {
    return {
      spots: [], //景点列表
      currentSpot: [], //景点详情数据
      detailVisible: false, //景点详情弹窗是否打开
      nearByHomestays: [], //附近民宿列表
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      selectSpotsOrTagList().then(res => {
        this.spots = res.data
        this.spots.forEach(item => {
          item.image = process.env.VUE_APP_BASE_API + item.image
        })
      })
    },
    //打开景点详情
    viewDetail(spotsId) {
      this.currentSpot = this.spots.find(spot => spot.spotsId === spotsId)
      selectHomestayBySpotsId(spotsId).then(res => {
        this.nearByHomestays = res.data
        this.nearByHomestays.forEach(item => {
          item.image = process.env.VUE_APP_BASE_API + item.image
        })
        this.detailVisible = true
      })
    },
    //打开民宿详情
    goToDetail(homestayId) {
      this.$refs.roomReservation.handleOpen(homestayId)
    },
  }
}
</script>

<style scoped>
.spot-card {
  margin-bottom: 20px;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s;
}

.spot-card:hover {
  transform: translateY(-5px);
}

.spot-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.location {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.brief {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags {
  margin-bottom: 10px;
}

.tags .el-tag {
  margin-right: 5px;
}

.homestay-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.homestay-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 3px;
  margin-right: 10px;
}
</style>
