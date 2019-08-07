<template>
  <div data-role="page">
    <header>
      <div v-bind:class="{'headerImg': outFoucs, 'headerImgSmall': isFoucs}"><img :src="headerImgSrc" /></div>
    </header>
    <div class="maintab" @focusin="focusinMethod" @focusout="focusoutMethod">
      <form style="padding: 0 0.6rem;" action="">
        <!-- 激活手机号 -->
        <div class="index_div">
          <input type="tel" class="form-control" maxlength="6" v-model="vActivate" name="vActivate" id="vActivate" placeholder="请输入个人专属码">
        </div>
        <div class="index_div workNum-div">
          <input type="tel" class="form-control" maxlength="6" v-model="vWorkerNum" name="vWorkerNum" id="vWorkerNum" placeholder="请输入工号">
        </div>
        <div class="btn_div">
          <button class="btn" type="button" @click="activeBtn" :disabled="activeDisable" :class="classObj" >激活并登录</button>
        </div>
        <div class="deal_div">
          <a href="javascript:void(0)" @click="gotoProtocal()">
            <span style="color:#999; font-size:0.24rem;">用户登录即代表同意<span style="color:#666;font-size:0.24rem;">《用户协议》</span></span>
          </a>
        </div>
      </form>
    </div>
    <div class="model_bg" v-if="popupVisible">
      <div class="model_div">
        <div class="model_title">专属码已被激活</div>
        <p class="model_p_txt">是否返回登录</p>
        <div class="model_div_btn">
          <input type="button" id="cancel" class="model_btn_no" value="否" @click="noBtn()"/>
          <input type="submit" id="confirm" class="model_btn" value="是" @click="yesBtn()"/>
        </div>
      </div>
    </div>
    <div class="model_bg1" v-if="popupVisible1">
      <div class="model_div1">
        <p class="model_p_txt" id="error_mess">操作错误</p>
        <div class="model_div_btn">
          <input type="submit" id="confirm1" class="model_btn" value="确认" @click="noBtn()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import logoImg from '../../assets/images/active/logo.png';
  import logoSmall from '../../assets/images/active/logo_small.png'

    export default {
        name: "activate",
      data(){
          return{
            isFoucs: false,
            outFoucs: true,
            headerImgSrc:logoImg,
            activateMobile:"",
            vActivate:"",
            vWorkerNum:"",
            isLoading:false,
            popupVisible:false,
            popupVisible1:false
          }
      },
      computed:{
        activeDisable: function () {
          if (this.vActivate == "" || this.vWorkerNum == ""|| this.isLoading) {
            return true
          }
          else {
            return false
          }
        },
        classObj: function () {
          if (this.vActivate != "" && this.vWorkerNum != "" && !this.isLoading) {
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
      created(){
        dooolyAPP.initTitle('会员激活','')
      },
      mounted(){
        localStorage.removeItem('userId');
        this.activateMobile=localStorage.activateMobile;
        dooolyAPP.getPhoneDeviceId("phoneid");
      },
      methods:{
        focusinMethod:function(){
          this.headerImgSrc=logoSmall;
          this.isFoucs=true;
          this.outFoucs=false;
        },
        focusoutMethod:function () {
          this.headerImgSrc=logoImg;
          this.isFoucs=false;
          this.outFoucs=true;
        },
        //操作错误
        altError:function () {
          this.$messageBox('操作错误');
        },
        activeBtn:function () {
          //验证手机号
          if (this.activateMobile == ''){
            this.$toast('手机号有误，请返回上一页重试');
            return false;
          }
          //验证激活码
          if (this.vActivate == '' || this.vActivate.length != 6){
            this.$toast('请输入正确的专属码');
            return false;
          }
          if(isNaN(this.vActivate))
          {
            this.$toast('请输入正确的专属码');
            return false;
          }
          //验证工号
          if (this.vWorkerNum == '' || this.vWorkerNum.length != 6){
            this.$toast('请输入正确的工号');
            return false;
          }
          if(isNaN(this.vWorkerNum))
          {
            this.$toast('请输入正确的工号');
            return false;
          }
          this.isLoading=true;
          http({
            method: 'post',
            url: api.validateAndActive,
            data: {
              vActivate: this.vActivate,
              vWorkerNum: this.vWorkerNum,
              mobile: this.activateMobile,
            }
          }).then(
            (res) => {
              if (res.data.code == "1000") {
                localStorage.mobile = this.activateMobile;
                var str=res.data.data;
                dooolyAPP.logIn(str);
              }
              else{
                this.isLoading = false;
                if (res.data.code == "1004"){
                  this.popupVisible=true;
                }
                else if(res.data.code == "1003"){
                  this.$toast("请输入正确的专属码");
                }
                else if(res.data.code == "1006"){
                  this.$toast("专属码已使用");
                }
                else if(res.data.code == "1007"){
                  this.$toast("请输入正确的工号");
                }
                else {
                  this.popupVisible1=true;
                }
              }
            }).catch((error) => {
            this.isLoading = false;
          })
        },
        //专属码已被激活
        noBtn:function () {
          this.popupVisible=false;
          this.popupVisible1=false;
        },
        yesBtn:function () {
          this.popupVisible=false;
          dooolyAPP.forceLoginOut(this.$router);
        },
        //用户协议
        gotoProtocal:function () {
          this.$router.push('/userProtocol');
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

  form .workNum-div{margin-top: 0.3rem;}
  .container{background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }
  .maintab{margin-top: 1.52rem}
  .title{font-size:0.3rem; margin-top:0.15rem;color:#000000}
  .index_div{border: 0;border-bottom: 1px solid #ECECEC;margin-top: 0.4rem;height: 0.77rem;width:100%;}
  .index_div .form-control{
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: 0.32rem;
    display: block;
    text-indent: 0.1rem;
    outline: none;
    border-radius: 0.1rem;
  }
  .index_div .form-control::-webkit-input-placeholder {
    font-size:0.32rem;color:#ccc;border: 0;
  }
  .index_div .form-control:-moz-placeholder {
    font-size:0.32rem;color:#ccc;border: 0;
  }
  .index_div .form-control::-moz-placeholder {
    font-size:0.32rem;color:#ccc;border: 0;
  }
  .index_div .form-control:-ms-input-placeholder {
    font-size:0.32rem;color:#ccc;border: 0;
  }
  .btn_div {
    margin-top: 0.4rem;
    background: #fff;
    color: #ee3f44;
    border: none;
    width: 100%;
    line-height: 0.82rem;
    font-size: 0.36rem;
    border-radius: 0 0 5px 5px;
  }

  .btn_div .btn {
    text-align: center;
    line-height: 0.82rem;
    width: 100%;
    height: 0.82rem;
    margin: 0 auto;
    border: 0;
    border-radius: 0.08rem;
    display: block;
    font-size: 0.32rem;
  }

  .btn_div .dis_btn {
    color: #f9c5c6;
    background: #f58c8f;
  }

  .btn_div .click_btn {
    color: #fff;
    background: #ee3f44;
  }

  .deal_div {
    margin-top: 0.3rem;
    font-size: 0.24rem;
    color: #999;
  }
  .model_bg{position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 9999;
  }
  .model_div{position: absolute;
    width: 70%;
    min-height: 3rem;
    left: 15%;
    top: 30%;
    background: #fff;
    border-radius: 0.2rem;
    padding-bottom: 0.2rem;
    z-index: 100000;}
  .model_title{font-size: 0.36rem;
    padding-bottom: 0.2rem;
    width: 100%;
    text-align: center;
    background: #fff!important;
    margin-top: 0.6rem;
    font-weight: bold;}
  .model_p_txt{
    line-height: 0.42rem;
    font-size: 0.3rem;
    color: #999;
    text-align: center;
    padding: 0 0.26rem;
  }
  .model_div_btn{padding: 0;
    width: 100%;
    text-align: center;
    background: #fff!important;
    margin-top: 0.5rem;}
  .model_btn{line-height: 0.5rem;
    width: 1.6rem;
    text-align: center;
    border-radius: 0.1rem;
    font-size: 0.24rem;
    color: #fff;
    background: #ee3f43;
    border: 0;}
  .model_btn_no{line-height: 0.5rem;
    width: 1.6rem;
    text-align: center;
    border-radius: 0.1rem;
    font-size: 0.24rem;
    color: #fff;
    background: #868686;
    border: 0;}
  .model_bg1{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1050;overflow: hidden;
    -webkit-overflow-scrolling: touch;outline: 0;background: rgba(0,0,0,0.4);}
  .model_div1{
    position: fixed;width: 6rem;min-height: 3rem;left: 50%;top: 50%;margin-left: -3rem;margin-top: -2rem;
    background: #fff;border-radius: 0.2rem;z-index: 100000;}
</style>
