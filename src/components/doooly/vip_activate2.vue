<template>
  <div data-role="page">
    <header>
      <div v-bind:class="{'headerImg': outFoucs, 'headerImgSmall': isFoucs}"><img :src="headerImgSrc" /></div>
    </header>
    <div class="title_div">此号码未被激活，填写激活码验证激活</div>
    <div class="maintab" @focusin="focusinMethod" @focusout="focusoutMethod">
      <form style="padding: 0 0.6rem;" action="">
        <div class="index_div workNum-div">
          <input type="tel" class="form-control" maxlength="8" v-model="vWorkerNum" name="vWorkerNum" id="vWorkerNum" placeholder="请输入工号（必填）">
        </div>
        <div class="btn_div">
          <button class="btn" type="button" @click="activeBtn" :disabled="activeDisable" :class="classObj" >激活并登录</button>
        </div>
      </form>
    </div>
    <div class="isSuccess_bg approve" v-show="popupVisible">
        <div class="isSuccess">
            <div class="title">专属码已被激活</div>
            <p class="min">是否返回登录</p>
            <div class="input_view">
                <div @click="noBtn()">否</div>
                <div @click="yesBtn()" class="right">是</div>
                <div class="line"></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  
  import logoImg from '../../assets/images/active/logo.png';
  import logoSmall from '../../assets/images/active/logo_small.png';
    export default {
        name: "activate",
      data(){
          return{
            isFoucs: false,
            outFoucs: true,
            headerImgSrc:logoImg,
            activateMobile:"",
            vActivate:this.$route.params.code,
            vWorkerNum:"",
            isLoading:false,
            popupVisible:false
          }
      },
      computed:{
        activeDisable: function () {
          if (this.vWorkerNum == ""|| this.isLoading) {
            return true
          }
          else {
            return false
          }
        },
        classObj: function () {
          if (this.vWorkerNum != "" && !this.isLoading) {
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
      mounted:function(){
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
          //验证工号
          if (this.vWorkerNum==''){
            this.$toast('请输入正确的工号');
            return false;
          }else{
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
                dooolyAPP.logIn(res.data.data);
              }else{
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
                  this.$toast("出现异常了");
                }
              }
            }).catch((error) => {
            this.isLoading = false;
          })
         }
        },
        //专属码已被激活
        noBtn:function () {
          this.popupVisible=false;
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
.title_div{font-size: 0.34rem;
    color: #999;
    text-align: center;
    margin-top: 0.2rem;}
  header{
    text-align: center;
    padding-top: 1rem;
    font-size: 0;
  }
  header div{
    width: 1.48rem;
    height: 1.48rem;
    margin: auto;
  }
  header .headerImg img{
    width: 1.48rem;
  }
  header .headerImgSmall img{
    width: 0.88rem;
  }
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
    text-align: center;
  }
  .index_div .form-control::-webkit-input-placeholder { /* WebKit browsers */
    font-size:0.32rem;color:#ccc;border: 0;
  }
  .index_div .form-control:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size:0.32rem;color:#ccc;border: 0;
  }
  .index_div .form-control::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size:0.32rem;color:#ccc;border: 0;
  }
  .index_div .form-control:-ms-input-placeholder { /* Internet Explorer 10+ */
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
/*    border-radius: 0.08rem;*/
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
  /*确认弹出框*/
.isSuccess_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.8);
    text-align: right;
    z-index: 9999;
}
.isSuccess{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5.4rem;
    min-height: 3.2rem;
    background: #fff;
    margin-left: -2.75rem;
    margin-top: -1.5rem;
    border-radius: 0.2rem;
}
.isSuccess .title{
    padding-top: 0.3rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.36rem;
    color: #333;
    font-weight: bold;
}
.isSuccess p{
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.8rem;
    padding: 0 0.2rem;
    color:#333;
}
.isSuccess p.min{
    margin-top: 0;
    font-size: 0.28rem;
    padding: 0 0.5rem;
    color: #999;
}
.isSuccess p span{
    font-size: 0.26rem;
    margin-top: 0.1rem;
    color:#9c9c9c;
}
.isSuccess .input_view{
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1rem;
    width: 100%;
    font-size: 0;
    border-top:1px solid #ececec;
    text-align: center;
}
.isSuccess .input_view div{
    font-size: 0.36rem;
    text-align: center;
    display: inline-block;
    line-height: 1rem;
    width:50%;
}
.isSuccess .input_view .line{
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    background: #ececec;
}
.isSuccess .input_view .right{
    color:#ee3f44;
}
.novice{
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:101;
}
.novice img{
    width: 100%;
    height: 100%;
}
.span_red{color: #ee3f44 !important;padding: 0 0.2rem;font-size: 0.32rem !important;}
</style>
