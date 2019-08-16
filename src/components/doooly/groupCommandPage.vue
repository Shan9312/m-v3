<template>
  <div>
    <header>
      <div v-bind:class="{'headerImg': outFoucs, 'headerImgSmall': isFoucs}"><img :src="headerImgSrc" /></div>
      <span>您选择了企业口令</span>
    </header>
    <form @focusin="focusinMethod" @focusout="focusoutMethod">
      <section>
        <div class="secretKey_div">
          <span class="question">{{question}}</span>
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
              <input id="company" type="text" disabled="disabled" v-model="selectCompany" placeholder="请选择所在公司单位（必填）">
              <img class="right_icon" src="../../assets/images/active/right_arrow.png">
            </div>
          </li>
          <li>
            <span>手机号码</span>
            <input v-model="phone" id="phone" disabled="disabled" type="text" placeholder="请输入手机号（必填）">
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
          <button @click="login" class="btn" type="button" :disabled="loginDisable"  id="loginBtn" :class="classObj" >{{loginText}}</button>
        </div>
      </section>
    </form>
    <div v-if="popupVisible" class="result">
      <div class="model_div_bot">
        <div class="resultTxt_bot">
          <div class="company_title clearfix" @click="close_img()">
            <span>选择公司</span>
            <span class="close_a"><img src="../../assets/images/active/icon_close.png" /></span>
          </div>
          <div class="company_title2">请选择</div>
          <ul class="company_div_ul">
            <li v-for="(item,index) in listData" :key="index" @click="chooseCompany(item.id,item.groupName)">{{item.groupName}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import http from '@/http/http.js';
    import api from '@/assets/js/api.js';
    import logo from '../../assets/images/active/logo.png';
    import logoSmall from '../../assets/images/active/logo_small.png'
    export default {
      name: "groupCommandPage",
      data(){
        return{
          question:"",
          isFoucs: false,
          outFoucs: true,
          headerImgSrc: logo,
          selectCompany:"",
          selectCompanyId:"",
          secretKey:"",
          phone:"",
          userName:"",
          workNumber:"",
          isLoading:false,
          loginText:"登录",
          listData:[],
          popupVisible:false,
        }
      },
      beforeCreate(){
        document.body.style.backgroundColor="#f5f5f5";
      },
      beforeDestroy(){
        document.body.style.backgroundColor="";
      },
      created(){
        dooolyAPP.initTitle('企业口令','')
      },
      mounted:function(){
        this.phone=localStorage.activateMobile;
        dooolyAPP.getPhoneDeviceId("phoneid");
        this.init();
      },
      computed:{
        loginDisable: function () {
          if (this.secretKey == "" || this.selectCompanyId == ""|| this.userName == "" || this.isLoading) {
            return true
          }
          else {
            return false
          }
        },
        classObj: function () {
          if (this.secretKey != "" && this.selectCompanyId != "" && this.userName != "" && !this.isLoading) {
            return {
              dis_btn: false,
              click_btn: true
            }
          }
          else {
            return {
              dis_btn: true,
              click_btn: false
            }
          }
        }
      },
      methods:{
        init:function () {
          let data={};
          http({
            method: 'post',
            url: api.getSecretQuestion,
            data:data
          }).then(
            (res) => {
              this.question=res.data.data.groupQuestion;
            })
        },
        focusinMethod:function(){
          this.headerImgSrc=logoSmall;
          this.isFoucs=true;
          this.outFoucs=false;
        },
        focusoutMethod:function () {
          this.headerImgSrc=logo;
          this.isFoucs=false;
          this.outFoucs=true;
        },
        selectBusiness:function () {
          if(this.secretKey==''){
            this.$toast("请先输入口令");
            return;
          }
          http({
            method: 'post',
            url: api.getBusiness,
            data: {
              groupCommand: this.secretKey,
            }
          }).then(
            (res) => {
              this.listData=[];
              if (res.data.code == "1000") {
                this.listData=res.data.data.groupList;
                this.popupVisible=true;
                if(this.popupVisible){
                  if(this.$browserName=='Chrome WebView'){
                    RHNativeJS.visablePtrFrame(false);
                  }
                }
              }
              else{
                this.$toast("口令有误");
              }
            }).catch((error) => {
            this.loginText = "登录";
            this.isLoading = false;
          })

        },
        //校验用户姓名
        checkUserName() {
          let reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
          //判断输入框中有内容
          if(!reg.test(this.userName))
          {
            this.$toast("请输入正确的姓名");
            return false;
          }
        },
        checkWorkNumber(){
          let rg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
          if((this.workNumber != "") && rg.test(this.workNumber))
          {
            this.$toast("请输入正确的工号");
            return false;
          }
        },
        login:function () {
          if (this.secretKey.length > 8) {
            this.$toast("口令有误");
            return false;
          }
          if(this.checkUserName() == false){
            return false;
          }
          if(this.checkWorkNumber() == false){
            return false;
          }
          this.loginText = "登录中";
          this.isLoading = true;
          http({
            method: 'post',
            url: api.secretKeyLogin,
            data: {
              groupCommand: this.secretKey,
              groupId: this.selectCompanyId,
              mobile: this.phone,
              name: this.userName,
              workerNumber:this.workNumber
            }
          }).then(
            (res) => {
              localStorage.mobile = this.phone;
              if (res.data.code == "1000") {
                let str=res.data.data;
                dooolyAPP.logIn(str);
              }
              else{
                if (res.data.code == "1003"){
                  this.$toast(res.data.msg);
                }
                else if (res.data.code == "1004"){
                  this.$toast(res.data.msg);
                }
                else{
                  this.$toast(res.data.msg);
                }
                this.loginText = "登录";
                this.isLoading = false;
              }
            }).catch((error) => {
            this.loginText = "登录";
            this.isLoading = false;
          })
        },
        close_img:function () {
          this.popupVisible=false;
        },
        chooseCompany:function (id,name) {
          this.selectCompanyId=id;
          this.selectCompany=name;
          this.popupVisible=false;
          if(this.$browserName=='Chrome WebView'){
            if(!this.popupVisible){
              RHNativeJS.visablePtrFrame(true);
            }
          }
        }
      }
    }
</script>

<style scoped>
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
    line-height: 0.97rem;
    height: 0.97rem;
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
  section ul li .selectCompanyName{width: auto;font-size: 0.28rem;margin-right: 0.3rem}
  section ul li .defaultColor{color:#cccccc}
  section ul li #phone{color:#333;opacity:1;-webkit-text-fill-color:#333;-webkit-opacity:1;background-color: #fff }
  section ul li input[type=text],section ul li input[type=tel]{
    width: 70%;
    font-size: 0.28rem;
    height: 0.97rem;
    vertical-align: middle;
    outline: none;
  }
  ::-webkit-input-placeholder {
       color:#cccccc;
     }
  :-moz-placeholder {
    color:#cccccc;
  }

  ::-moz-placeholder {
    color:#cccccc;
  }
  :-ms-input-placeholder {
    color:#cccccc;
  }
  section ul li input[type=text]{
    width: 4rem;
    font-size: 0.28rem;
    height: 0.97rem;
    vertical-align: middle;
    outline: none;
  }
  section ul li .selectBusiness {
    float: right;
    height: 0.97rem;
    vertical-align: middle;
    font-size: 0;
    text-align: right;
  }
  section ul li .selectBusiness input{
    text-align: right;
    margin-right: 0.3rem;
    background-color: #ffffff; opacity:1;color:#333;font-size: 0.28rem;-webkit-opacity:1;
    text-overflow: ellipsis;
  }
  section ul li .selectBusiness img{vertical-align: middle;width: 0.16rem;}

  .btn_div{
    margin: 0.4rem auto 0 auto;
    width:6.3rem;
    font-size: 0;
  }
  .btn_div .btn{
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
  .result {position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 99999;overflow: hidden;outline: 0; background-color: rgba(0,0,0,0.75); filter: alpha(opacity=90);}
  .company_div_ul{height:7rem; overflow-y:auto;}
  .model_div_bot{background: #fff;position: fixed;bottom: 0;width: 100%;}
  .resultTxt_bot .company_title{text-align: center;font-size:0.26rem; color:#666;height: 0.8rem;line-height: 0.8rem}
  .resultTxt_bot .company_title2{
    text-align: left;font-size:0.28rem; color:#ee3f44;height:0.8rem; line-height:0.8rem;padding-left: 0.2rem;}
  .resultTxt_bot ul li{border-top:1px solid #ececec;height:1rem; line-height:1rem;padding:0 0.2rem;font-size:0.28rem;color:#333;display: block;}

  .close_a{float: right;margin-right: 0.2rem;width: 0.6rem;}
  .close_a img{width: 0.2rem;height: 0.2rem;}
  @media only screen and (device-width: 375px) and (device-height: 812px) and
  (-webkit-device-pixel-ratio: 3) {
    .company_div_ul{height:10rem; overflow-y:auto;}
  }
</style>
