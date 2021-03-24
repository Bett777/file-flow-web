<template>
  <div class="home-wrapper">
    <div class="date-row">
      <div v-for="(item, index) in cardInfoData" :key="index" class="data-col">
        <el-card shadow="always" :body-style="{padding: '0px'}">
          <div class="date-block">
            <i :class="[ item.icon ]" :style="{ background: item.color }" class="icon-box" />
            <div class="date-cont">
              <CountTo class="count" :start-val="0" :end-val="item.count" :duration="3000" />
              <p class="title">{{ item.title }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  name: 'Home',
  components: { CountTo },
  data() {
    return {
      text: '用户访问来源',
      title: '近七天用户访问量条形图',
      langsData: [
        { name: 'VUE', value: 45, color: '#2d8cf0' },
        { name: 'ES6', value: 32, color: '#19be6b' },
        { name: 'TS', value: 4, color: '#ff9900' },
        { name: 'LESS', value: 13, color: '#e46cbb' },
        { name: 'HTML', value: 6, color: '#9a66e4' }
      ],
      cardInfoData: [
        { title: '今日点击', icon: 'vue-dsn-icon-dianji', count: 682, color: '#2d8cf0' },
        { title: '新增用户', icon: 'vue-dsn-icon-xinzeng', count: 259, color: '#19be6b' },
        { title: '信息发送', icon: 'vue-dsn-icon-xinfeng', count: 1262, color: '#ff9900' },
        { title: '点赞统计', icon: 'vue-dsn-icon-dianzan', count: 508, color: '#e46cbb' },
        { title: '累计收藏', icon: 'vue-dsn-icon-heart', count: 379, color: '#9a66e4' }
      ],
      chartsPieData: [
        { value: 1920, name: '直接访问' },
        { value: 1169, name: '邮件营销' },
        { value: 986, name: '联盟广告' },
        { value: 621, name: '视频广告' },
        { value: 3256, name: '搜索引擎' }
      ],
      commonChartsData: {
        Mon: 782,
        Tue: 925,
        Wed: 1196,
        Thu: 812,
        Fri: 328,
        Sat: 222,
        Sun: 1080
      }
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/home";
</style>
