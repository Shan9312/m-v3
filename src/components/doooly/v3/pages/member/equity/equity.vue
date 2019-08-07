<template>
  <div>
    <ul class="table" v-if="!previewId">
      <li v-for="(item,index) in equityList" :key="index" :class="{check:listCheck == index}" @click="check(index)">
        <img :src="item.adEquityLogo">
        <div class="tag">{{item.adEquityName}}</div>
        <div class="icon"></div>
      </li>
    </ul>
    <div class="view" v-if="equityList.length > 0">
      <div v-html="equityList[listCheck].equityDesc || ''"></div>
      <div v-html="equityList[listCheck].userService || ''"></div>
      <div v-html="equityList[listCheck].instructions || ''"></div>
    </div>
  </div>
</template>

<script>
  import {
    getGroupEquity,
    getEquityByEquityId
  } from 'v3/services';
  export default {
    name: 'equity',
    props: {

    },
    data() {
      return {
        equityList:[

        ],
        listCheck:0,
        previewId:this.$route.params.id || ''
      };
    },
    computed: {

    },
    created() {
      dooolyAPP.initTitle('权益说明', '');
      this.getEquityList();
    },
    mounted() {

    },
    methods: {
      async check(index){
        this.listCheck = index;
      },
      async getEquityList(){
        if(this.previewId){
          const {
            data
          } = await getEquityByEquityId({
            equityId:this.previewId
          });
          if(data.code == 1000 && data.data){
            this.equityList.push(data.data);
          }
        }else{
          const {
            data
          } = await getGroupEquity();
          if(data.code == 1000 && data.data){
            this.equityList = data.data;
          }
        } 
      }
    },
    watch: {

    },
    components: {

    },
  };
</script>

<style scoped lang="scss">
  .table{
    background: url('../../../../../../assets/images/home/home_v3_header.png') no-repeat left top;
    background-size: 100%;
    height: 1.75rem;
    display: flex;
    li{
      padding: 0 0.3rem;
      text-align: center;
      img{
        margin-top: 0.3rem;
        width: 0.68rem;
      }
      .tag{
        margin-top: -0.46rem;
        font-size: 0.24rem;
        color: #fff;
      }
      &.check{
        position: relative;
        .icon{
          position: absolute;
          left: 50%;
          margin-left: -0.14rem;
          bottom:0;
          width:0;
          height:0;
          border-left:0.14rem solid transparent;
          border-right:0.14rem solid transparent;
          border-bottom:0.14rem solid #fff;
        }
        img{
          width: 0.8rem;
        }
      }
    }
  }
  .view{
    font-size: 0;
  }
</style>
