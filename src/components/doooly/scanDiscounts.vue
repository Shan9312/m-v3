<template>
  <div>
    <div class="main" v-if="scanBusinessList">
      <section class="enjoy">
        <article>
          <img src="../../assets/images/scan/banner.png">
        </article>
      </section>
      <section class="business_list">
        <ul>
          <li v-for="(item,index) in scanDatalist" :key="index" @click='index_click(item.company,index+1);skip(item.dealType,item.id,item.id,item.company,item.miniLogo)'>
            <div class="corner_mark" v-if="item.isSupportIntegral==1">
              <img class="point" src="../../assets/images/scan/point.png" alt="point">
            </div>
            <img class="imgMerchant" :src="item.scanImageUrl" :onerror="defaultImg">
          </li>
          <li v-if="waitingState" class="waiting">
             <img src="../../assets/images/scan/waiting.png">
           </li>
         </ul>
       </section>
       <!--<dyfooter2></dyfooter2>-->
    </div>
    <div class="emptyImg" v-if="emptyPage">
       <img src="../../assets/images/scan/emptyBg.png">
    </div>
  </div>
</template>

<script>
  import bus from '@/components/common/bus';
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex';

  export default {
    name: "scan-discounts",
    data(){
      return{
        scanDatalist: [
        ],
        emitDate:{},
        scanBusinessList:true,
        emptyPage:false,
        defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"'
      }
    },
    computed:{
      waitingState() {
        if (this.scanDatalist.length%2==0) {
          return false;
        }
        else {
          return true;
        }
      }
    },
    activated(){
      initTitle('付款码');
    },
    methods:{
      ...mapActions(['addScanAction','deleteScanAction']),
      index_click(val,index){
        var label = val+"("+index+")";
        this.$baiduStats('付款码-banner-' + label);
      },
      skip(dealType,id,businessId,company,miniLogo,userId,groupShortName){
        this.emitDate={};
        this.emitDate.dealType=dealType;
        this.emitDate.id=id;
        this.emitDate.businessId=businessId;
        this.emitDate.company=company;
        this.emitDate.miniLogo=miniLogo;
        this.emitDate.userId=userId;
        this.emitDate.groupShortName=groupShortName;
        this.$router.push({path:'/scanDetail/'+company});
      },
      loadPageData(){
        http({
          method: 'get',
          url: api.scanList + '?token=' + localStorage.token,
        }).then((res) => {
          if(res.data.businessList){
            this.scanDatalist=res.data.businessList;
          }
          if(res.data.businessList==undefined){
            this.emptyPage=true;
            this.scanBusinessList=false;
          }
          if(res.data.businessList.length == 0 ){
            this.scanBusinessList=false;
            this.emptyPage=true;
          }
        })
      }
    },
    beforeDestroy(){
      this.addScanAction(this.emitDate);
    },

    created(){
      this.loadPageData();
      initTitle('付款码');
    },
    mounted(){

    }

  }
</script>

<style scoped>


  .main {
    width: 100%;
  }

  .main .enjoy {
    width: 100%;
    margin-bottom: 0.6rem
  }

  .main .enjoy article {
    width: 100%;
    font-size: 0;
  }

  .main .enjoy article img {
    width: 100%;
  }

  .main .business_list {
    width: 6.9rem;
    margin: 0 auto;
  }

  .main .business_list ul {
    width: 100%;
    font-size: 0;
    overflow: hidden
  }

  .main .business_list ul li {
    position: relative;
    display: inline-block;
    width: 3.3rem;
    height: 1.94rem;
    text-align: center;
    vertical-align: top;
    margin-right: 0.16rem;
    margin-bottom: 0.2rem;
    float: left
  }

  .corner_mark{
    position: absolute;
    left: 0;
    top: 0;
    font-size: 0;
    width: auto;
    height: auto;
    line-height: 100%;
    z-index: 1;
    border:0;
    border-radius: 0.1rem 0 0 0;
    overflow: hidden;
  }

  .point{
    width:0.3rem;
    height:0.3rem;
  }

  .imgMerchant {
    display: block;
    width: 3.3rem;
    height: 1.94rem;
    border-radius: 0.1rem;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }


  .main .business_list ul li:nth-child(2n) {
    margin-right: 0;
    margin-left: 0;
    float: right
  }
  .emptyImg{width:100%; height:100%; background-color:#fff}
  .emptyImg img{width:100%}
</style>
