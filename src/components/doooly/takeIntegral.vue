<template>
  <div class="home">
    <div class="point">
      <div>
        {{myPoints.isReturnPoints}}<span>积分</span>
      </div>
      <div>
        可抵扣人民币{{myPoints.isReturnPoints}}元
      </div>
      <div >
        您有{{myPoints.doingReturnPoints}}积分即将到账
      </div>
    </div>
    <newHmoeModules v-for="(item,index) in list" :origin="'花积分'" :key="index" :type="item.type" :list="item.list" :name="item.mainTitle" :index="item.listindex" :online="item.isOnline"></newHmoeModules>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import newHmoeModules from '@/components/common/newHmoeModules';
  import bus from '@/components/common/bus';
  import {getAddress} from '@/assets/js/wechatShare2.js';
  export default {
    name: "take-integral",
    data(){
      return{
        integral:"",
        isShow:false,
        list:[],
        myPoints:{
          doingReturnPoints: "*******",
          isReturnPoints: "*****",
          notReturnPoints: "*****",
        },
        myPointsGet:false,
        conponShow:false,
      }
    },
    components: {
      newHmoeModules,
    },
    methods: {
      getList(){
        http({
          method: 'post',
          url: api.spendIntegral,
          data: {
            address: (localStorage.address?localStorage.address:"全国"),
          }
        }).then((res) => {
          if(res.data.code == 1000){
            let _list = res.data.data.floors;
            if(_list.length){
              this.list = [];
              setTimeout(()=>{ //数组视图不更新BUG
                if(_list.length){
                  this.list = _list;
                  var a = 1;
                  for(var i=0;i<_list.length;i++){
                    if(this.list[i].type == 2 || this.list[i].type == 13){
                      this.list[i].listindex = a-1;
                      a++;
                    }else{
                      this.list[i].listindex = 0;
                    }
                  }
                }
              },10)
            }else {
              this.list = [];
            }
          }
        });
        http({
          method: 'post',
          url: api.profilev2_2,
          data: {
            userId: localStorage.userId
          }
        }).then((res) => {
          this.myPoints.isReturnPoints = res.data.data.availablePoints;
          this.myPoints.doingReturnPoints = res.data.data.returnPoints;
        });
      },
      getPoints(){
        http({
          method: 'post',
          url: api.receiveUserReturnPoints,
          data: {
            userId: localStorage.userId,
          }
        }).then((res) => {
          if(res.data.code == 1000){
            this.myPointsGet = true;
            this.myPoints = res.data.data;
            this.$toast("您的积分45天内到账");
          }
        });
        this.$baiduStats('首页-积分返利按钮-点击领取');
      }
    },
    mounted(){
      getAddress.call(this);
      this.getList();//获取商户列表数据
      bus.$on('mapStore',(function(data){}).bind(this));
      dooolyAPP.initTitle('花积分');
    },
    activated(){
      this.getList();
      dooolyAPP.initTitle('花积分');
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    beforeCreate(){
      document.body.style.backgroundColor="#fff";
      if ( window.__wxjs_is_wkwebview === true && !localStorloadPrivilegeDataage.latitude) {
        if(!localStorage.reload){
          localStorage.reload=1;
          location.reload();
        }
      }
    },
    destroyed(){
      localStorage.removeItem('reload');
    },
  }
</script>

<style scoped>
.adBannerSwipe{
  width: 100%;
  height: 3rem;
}



/* 弹出框新手礼 */
.model_bg{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  display: block;
}
.new_model{
  position: fixed;
  width: 80%;
  left: 50%;
  top: 50%;
  margin-left: -45%;
  margin-top: -45%;
  background-size: 100%;
  display: block;
  z-index: 100000;
  text-align: center;
  overflow: hidden;
}
.model_btn_div{
  position: absolute;
  bottom: 10%;
  width: 70%;
  height: 0.9rem;
  margin-left: 20%;
}
.model_money1{
  position: absolute;
  width: 70%;
  margin-left: 20%;
  top: 20%;
  color: #d8c37f;
  font-size: 1.4rem;
  font-weight: bold;
}
.model_money2{
  position: absolute;
  width: 70%;
  margin-left: 20%;
  color: #f0d8b4;
  font-size: 0.7rem;
  font-weight: bold;
  bottom: 26%;
}
/* 新增积分模块 */
.point{
  width: 100%;
  height: 4.2rem;
  background: url(../../assets/images/home/takeBanner.jpg) no-repeat 0 0;
  background-size: 100%;
}
.point div{
  text-align: center;
}
.point div:nth-child(1){
  font-size: 0.8rem;
  color: #000;
  padding-top: 1.28rem;
}
.point div:nth-child(1) span{
  font-size: 0.3rem;
}
.point div:nth-child(2){
  font-size: 0.24rem;
  color: #947838;
  padding-top: 0.26rem;
  line-height: 100%;
}
.point div:nth-child(3){
  font-size: 0.24rem;
  color: #000;
  padding-top: 0.1rem;
  transform: scale(0.75);
}
</style>
