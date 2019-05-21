<template>
    <div class="container">
      <header>
        <ul>
          <li v-for="(item,index) in tabs" :key="index" v-bind:class='{l1:item.ifAdd==tab}'  @click="link(item.ifAdd, item.content)">
            <div class="div_bot">{{item.value}}</div>
          </li>
        </ul>
      </header>
      <section>
        <div v-if="firstLoading" class="mint-loadmore-bottom">
          <span class="loading_gif"></span>
        </div>
        <ul>
          <li v-for="(item,index) in listData" :key="index" class="clearfix" @click="detailLink(item.id)">
            <span class="fl">
              <img src="../../assets/images/personalCenter/complaint/myComplaint.png">
            </span>
            <div class="complainDetailList">
              <b v-if="item.type==1">订单申诉</b>
              <b v-else-if="item.type==2">积分申诉</b>
              <b v-else-if="item.type==6">服务申诉</b>
              <b v-else-if="item.type==5">投诉建议</b>
              <br>
              <span>
              <span>{{new Date(item.updateDate).getFullYear()}}</span>-<span>
                <span v-if="new Date(item.updateDate).getMonth()+1<10">0{{new Date(item.updateDate).getMonth()+1}}</span>
                <span v-else>{{new Date(item.updateDate).getMonth()+1}}</span>
              </span>-<span>
                <span v-if="new Date(item.updateDate).getDate()<10">0{{new Date(item.updateDate).getDate()}}</span>
                <span v-else>{{new Date(item.updateDate).getDate()}}</span>
              </span>

              <span>
                <span v-if="new Date(item.updateDate).getHours()<10">0{{new Date(item.updateDate).getHours()}}</span>
                <span v-else>{{new Date(item.updateDate).getHours()}}</span>
              </span>:<span>
                <span v-if="new Date(item.updateDate).getMinutes()<10">0{{new Date(item.updateDate).getMinutes()}}</span>
                <span v-else>{{new Date(item.updateDate).getMinutes()}}</span>
              </span>:<span>
                <span v-if="new Date(item.updateDate).getSeconds()<10">0{{new Date(item.updateDate).getSeconds()}}</span>
                <span v-else>{{new Date(item.updateDate).getSeconds()}}</span>
              </span>
            </span>
            </div>
            <span class="fr">
              <img src="../../assets/images/personalCenter/complaint/rightArrow.png">
            </span>
          </li>
        </ul>
        <div v-if="noRecord" class="noRecord">
          <img src="../../assets/images/personalCenter/complaint/no_j.png">
          <p>您暂时没有{{remindingText}}记录呢</p>
        </div>
      </section>
      <footer>
        <button class="btn btn-primary btn-block" data-baidu-stats="我的-我的申诉-我要申诉" @click="skip()">我要申诉</button>
      </footer>
    </div>
</template>

<script>
  import http from '@/http/http'
  import api from '@/assets/js/api.js';
    export default {
        name: "complaint",
      data(){
          return{
            tabs: [
              {
                value: "已申诉",
                ifAdd: 0,
                content:"申诉"
              },
              {
                value: "已受理",
                ifAdd: 1,
                content:"受理"
              },
              {
                value: "已处理",
                ifAdd: 2,
                content:"处理"
              }
              ,
              {
                value: "已驳回",
                ifAdd: 3,
                content:"驳回"
              }
            ],
            tab:"0",
            listData:[],
            noRecord:false,
            remindingText:"",
            complainStatus:"0",
            firstLoading:true
          }
      },
      beforeCreate(){
        document.body.style.backgroundColor="#f5f5f5";
      },
      beforeDestroy(){
        document.body.style.backgroundColor="";
      },
      created(){
        initTitle('我的申诉','')
      },
      mounted(){
        let complaintTab=localStorage.complaintTab;
        if(complaintTab == undefined){
          this.tab=0;
        }
        else {
          this.tab=complaintTab;
        }
        if(this.tab==0 || this.tab==1){
          this.complainStatus=this.tab;
        }
        else if(this.tab==2){
          this.complainStatus=3;
        }
        else {
          this.complainStatus=2;
        }
        this.getComplainData();
      },
      methods:{
        getComplainData:function () {
          this.firstLoading=true;
          http({
            method: 'post',
            url: api.myComplaint+"?status="+this.complainStatus+"&token="+localStorage.token
          }).then((res) => {
            this.firstLoading=false;
            this.listData=[];
            let code = res.data.code;
            if(code=="0001" ||code=="0002" ||code=="0003"||code=="0004"){
              if(res.data.list != undefined){
                this.listData=res.data.list;
              }
              else{
                this.listData=[];
              }
            }
            else {
              this.listData=[];
            }
            if(this.listData.length==0){
              this.noRecord=true;
            }
          });
        },
        link:function (index, content) {
          localStorage.complaintTab=index;
          this.noRecord=false;
          this.listData=[];
          this.tab = index;
          this.remindingText=content;
          if(index==0 || index==1){
            this.complainStatus=index;
          }
          else if(index==2){
            this.complainStatus=3;
          }
          else {
            this.complainStatus=2;
          }
          this.getComplainData();
        },
        detailLink:function (complainId) {
          let jumpUrl="/complainDetail/"+complainId;
          dooolyAPP.gotoJumpVue.call(this,jumpUrl);
        },
        skip:function () {
          dooolyAPP.AppealAgainst.call(this,{"jumpType":"Native","jumpUrl":"AppealAgainst"},"6");
        }
      },
      beforeRouteLeave(to, from, next) {
        if(to.name==="personalCenter")
        {
          localStorage.removeItem('complaintTab');
        }
        else{
          localStorage.complaintTab=this.tab;
        }
        next();
      },
      beforeRouteEnter(to, from, next) {
        if(from.name=="personalCenter" || !from.name)
        {
          localStorage.removeItem('complaintTab');
        }
        next();
      },
    }

</script>

<style scoped>
  header{text-align: center;border-bottom: 1px solid #ececec;background: #fff;color: #362e2b;margin-bottom: 0.1rem;
    width: 100%;}
  header ul{font-size: 0;}
  header ul li{display: inline-block;line-height: 0.98rem;font-size: 0.28rem;width: 1.8rem;text-align: center;}
  header ul li.l1{color: #ee3f43;}
  header ul li.l1 .div_bot{color: #ee3f43;text-decoration: none;border-bottom: 2px solid #ee3f44;
    display: inline-block;height: 0.95rem;}

  section{padding-bottom:1.5rem}
  section ul{
    font-size: 0;
    background:#fff;
    overflow-y: scroll;
  }
  section ul li {
    height: 1.2rem;
    border-bottom: 1px solid #cacaca;
    overflow: hidden;
  }
  section ul li  b{
    margin-top: 0.2rem;
    display: inline-block;
    font-size: 0.3rem;
    color: #323232;
    font-weight: normal;
  }
  section ul li span{
    font-size: 0.24rem;
    color: #a0a0a0;
  }
  section ul li .fl{
    float: left;
  }
  section ul li .fr{
    float: right;
  }
  section ul li .fl,section ul li .fr{
    font-size: 0;
    line-height: 1.2rem;
    margin:0 0.3rem;
  }
  section ul li .fl img,section ul li .fr img{
    vertical-align: middle;
    width: 100%;
  }
  section ul li .complainDetailList{
    float: left;
    height: 1.2rem;
    display: inline-block;
  }
  section .noRecord{text-align: center;padding-top:2rem;}
  section .noRecord img{width:2.98rem;}
  section .noRecord p{color: #666;font-size: 0.28rem;letter-spacing: 0.02rem;}
  footer {position: fixed; left: 0; bottom: 0; width: 100%; z-index: 1010; background: #fdfdfd; border-top: 1px solid #c9c9c9;}
  .btn-block {display: block; width: 100%;}
  .btn-primary {border: none; background-color: #ee3f44;}
  .btn {height: 1rem; line-height: 1rem; padding: 0; font-size: 0.32rem; color: #fff;}
  button {font-size: 100%;}
  button{font: 12px/1.5 tahoma, arial, \5b8b\4f53, sans-serif;}

</style>
