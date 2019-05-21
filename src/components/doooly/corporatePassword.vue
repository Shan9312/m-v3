<template>
  <div>
    <header>
      <div v-bind:class="{'headerImg': outFoucs, 'headerImgSmall': isFoucs}"><img :src="headerImgSrc" /></div>
      <span>您选择了企业口令</span>
    </header>
    <form @focusin="focusinMethod" @focusout="focusoutMethod">
      <section>
        <div class="secretKey_div">
          <span class="question">请问您所在的企业简称是什么</span>
          <ul>
            <li>
              <span>口令</span>
              <input v-model="secretKey" type="text" placeholder="请输入企业口令（必填）">
            </li>
          </ul>
        </div>
        <ul>
          <li class="clearfix" @click="selectBusiness()">
            <span>公司</span>
            <div class="selectBusiness">
              <input id="company" type="text" readonly="readonly" v-model="selectCompany" placeholder="请选择所在公司单位（必填）">
              <img class="right_icon" src="../../assets/images/personalCenter/myOrder/right_arrow.png">
            </div>
          </li>
          <li>
            <span>手机号码</span>
            <input v-model="phone" type="text" value="" placeholder="请输入手机号（必填）">
          </li>
          <li>
            <span>姓名</span>
            <input v-model="userName" type="text"  placeholder="请输入姓名（必填）">
          </li>
          <li>
            <span>工号</span>
            <input type="text" v-model="workNumber" placeholder="请输入工号">
          </li>
        </ul>
        <div class="btn_div">
          <input id="loginBtn" type="button" :disabled="loginDisable" value="登录" @click="login()" :class="classObj">
        </div>
      </section>
    </form>
    <div v-if="popupVisible" class="result">
      <div class="model_div_bot">
        <div class="resultTxt_bot">
          <div class="company_title clearfix" @click="close_img()">
            <span>选择公司</span>
            <span class="close_a"><img src="../../../static/images/accessCatagory/icon_close.png" /></span>
          </div>
          <div class="company_title2">请选择</div>
          <ul class="company_div_ul">
            <li v-for="(item,index) in listData" :key="index" class="clearfix" @click="chooseCompany(item.companyId,item.companyName)">{{item.companyName}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {checkMobile} from '@/assets/js/verify.js';
    export default {
        name: "corporatePassword",
      data(){
          return{
            isFoucs: false,
            outFoucs: true,
            headerImgSrc: '../../../static/images/accessCatagory/logo.png',
            selectCompany:"",
            selectCompanyId:"",
            secretKey:"",
            phone:"",
            userName:"",
            workNumber:"",
            isLoading:false,
            listData:[
              {
                companyName:"test1",
                companyId:"1"
              },
              {
                companyName:"test2",
                companyId:"2"
              }
            ],
            popupVisible:false
          }
      },
      mounted:function(){
        this.phone=this.$route.params.phone;
      },
      computed:{
        //登录样式控制
        classObj:function () {
          if ((this.secretKey == "" || this.selectCompanyId == "" || this.phone == "" || this.userName == "") || this.isLoading) {
            return {
              dis_btn: true,
              click_btn: false
            }
          }
          else {
            return {
              dis_btn: false,
              click_btn: true
            }
          }
        },
        //登录状态控制
        loginDisable:function () {
          if ((this.secretKey == "" || this.selectCompanyId == "" || this.phone == "" || this.userName == "") || this.isLoading) {
            return true
          }
          else {
            return false
          }
        }
      },
      methods:{
        focusinMethod:function(){
          this.headerImgSrc='../../../static/images/accessCatagory/logo_small.png';
          this.isFoucs=true;
          this.outFoucs=false;
        },
        focusoutMethod:function () {
          this.headerImgSrc='../../../static/images/accessCatagory/logo.png';
          this.isFoucs=false;
          this.outFoucs=true;
        },
        selectBusiness:function () {
          this.popupVisible=true;
        },
        //校验手机号
        checkMobile() {
          let re = /^1[3|4|5|7|8][0-9]{9}$/;
          if (this.phone == "") {
            this.$toast("手机号不能为空");
            return false;
          }
          else if (checkMobile(this.phone)) {
            this.$toast("手机号格式错误！");
            return false;
          }
          else {
            return true;
          }
        },
        login:function () {
          if (this.checkMobile() == false) {
            return false;
          }
        },
        close_img:function () {
          this.popupVisible=false;
        },
        chooseCompany:function (id,name) {
          this.selectCompanyId=id;
          this.selectCompany=name;
          this.popupVisible=false;
        }
      }
    }
</script>

<style scoped>
  body{background-color: #f5f5f5}
  header{
    text-align: center;
    padding-top: 1rem;
    font-size: 0;
  }
  header .headerImg{
    width: 1.48rem;
    height: 1.48rem;
    margin: auto;
  }
  header .headerImgSmall{
    width: 0.88rem;
    height: 0.88rem;
    margin: auto;
  }
  header img{width: 100%}
  header span{
    display: inline-block;
    margin-top: 0.6rem;
    font-size: 0.28rem;
    color: #999999;
  }
  section {
    margin-top: 1rem;
  }
  .secretKey_div {
    font-size: 0;
  }
  .secretKey_div .question{
    font-size: 0.32rem;
    font-weight: bold;
    margin-left: 0.3rem;
  }
  .secretKey_div ul{margin-top: 0.3rem;}
  section ul{
    font-size: 0;
    background-color: #fff;
    padding: 0 0.3rem;
    margin-top: 0.2rem;
  }
  section ul li{
    line-height: 0.98rem;
    height: 0.98rem;
    border-bottom: 1px solid #ececec;
  }
  .secretKey_div ul li:last-child{
    border: none;
  }
  section ul li span{
    display: inline-block;
    width: 1.97rem;
    font-size: 0.28rem;
    vertical-align: middle;
    color: #333;
  }
  section ul li input[type=text]{
    width: 4rem;
    font-size: 0.28rem;
    height: 0.98rem;
    vertical-align: middle;
    outline: none;
  }
  section ul li .selectBusiness {
    float: right;
    height: 0.98rem;
    vertical-align: middle;
    font-size: 0;
    text-align: right;
  }
  section ul li .selectBusiness input{text-align: right;margin-right: 0.3rem}
  section ul li .selectBusiness img{vertical-align: middle;width: 0.16rem;}

  .btn_div{
    margin: 0.4rem auto 0 auto;
    width:6.3rem;
    font-size: 0;
  }
  .btn_div input[type=button]{
    text-align: center;
    line-height:0.82rem;
    width:100%;
    height: 0.84rem;
    border: none;
    display: block;
    font-size: 0.36rem;
    border-radius: 0 0 5px 5px;
  }
  .btn_div .dis_btn{background: #f58c8f;color: #f9c5c6;}
  .btn_div .click_btn{
    background: #ee3f44;
    color: #fff;
  }

  /* 弹出框-选择公司 */
  .result {position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1050;overflow: hidden;-webkit-overflow-scrolling: touch;outline: 0; background-color: rgba(0,0,0,0.75); filter: alpha(opacity=90);}
  .company_div_ul{height:7rem; overflow-y:auto;}
  .model_div_bot{background: #fff;position: fixed;bottom: 0;width: 100%;}
  .resultTxt_bot .company_title{text-align: center;font-size:0.26rem; color:#666;margin-top:0.26rem;}
  .resultTxt_bot .company_title2{text-align: left;font-size:0.28rem; color:#ee3f44;margin-top:0.48rem;padding-left: 0.2rem;margin-bottom: 0.3rem;}
  .resultTxt_bot ul li{border-top:1px solid #ececec;height:1rem; line-height:1rem;padding:0 0.2rem;font-size:0.28rem;color:#333;display: block;}
  .resultTxt_bot ul li:last-child{margin-bottom:0.6rem;}

  .close_a{float: right;margin-right: 0.2rem;width: 0.6rem;}
  .close_a img{width: 0.2rem;height: 0.2rem;}
</style>
