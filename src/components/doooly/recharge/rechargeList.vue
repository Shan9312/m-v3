<template>
  <div class="view">
    <ul v-for="(item,index) in ul_list">
      <div class="title">{{item}}</div>
      <li v-for="(item2,index) in li_list" v-if="item2.li_time == item">
        <div class="fl left">
          {{item2.mouth}}-{{item2.day}}<br>
          {{item2.hour}}
          </div>
        <div class="fl center">{{item2.rechargeAmount}}元</div>
        <div class="fr right">{{item2.result}}</div>
      </li>

    </ul>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  export default {
    components: {
      api
    },
    data() {
      return {
        cardno:this.$route.params.cardno,
        ul_list:[],
        li_list:[],
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#f5f5f5";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      dooolyAPP.initTitle('充值记录','')
    },
    mounted (){
      http({
          method: 'post',
          url: api.findRechargeHistory+'?token='+localStorage.token,
          notNeedTransfer:true,
          data:{
            "cardno" : this.cardno
          }
      }).then((data) => {
          var list = data.data.rechargeHistoryList;
          for(var i = 0; i <  list.length; i++){
              var year = list[i].createDate.substr(0,4);
              var mouth = list[i].createDate.substr(5,2);
              var day = list[i].createDate.substr(8,2);
              var hour = list[i].createDate.substr(11,5);
              var ul_time = year+'年'+mouth+'月';
              var data = {
                li_time : year+'年'+mouth+'月',
                mouth : mouth,
                day : day,
                hour : hour,
                rechargeAmount : list[i].rechargeAmount,
                result : list[i].result,
              }
              if(this.ul_list[this.ul_list.length - 1] != ul_time){
                this.ul_list.push(ul_time);
              }
              this.li_list.push(data);
          }
          for(var a= 0; i <  this.ul_list.length; a++){
            for (var b= 0; i <  this.li_list.length; b++) {

            };
          }

      })
    },

  }
</script>
<style scoped>
ul{
    background: #fff;
}
ul .title{
    padding: 0 0.3rem;
    line-height: 0.86rem;
    font-size: 0.3rem;
    color: #333;
    border-top: #ececec;
    background: #f5f5f5;
}
ul li{
    margin: 0 0.3rem;
    background: #fff;
    height: 1.5rem;
    border-bottom: 1px solid #ececec;
}
ul li:last-child{
    border:0;
}
ul li .left{
    font-size: 0.22rem;
    color: #999;
    padding-top: 0.48rem;
    width: 1.15rem;
}
ul li .center{
    line-height: 1.5rem;
    font-size: 0.4rem;
    color: #333;
}
ul li .right{
    line-height: 1.5rem;
    font-size: 0.26rem;
    color:#acacac;
}

</style>
