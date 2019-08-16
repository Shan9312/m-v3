<template>
  <div class="view">
    <header>
      <div id="card">{{cardno}}</div>
    </header>
    <ul>
        <li class="clearfix">
            <div class="fl left">姓名</div>
            <div class="fl">
                <input type="text" id="name" placeholder="请输入姓名" maxlength="11" v-model="name">
            </div>
        </li>
        <li class="clearfix">
            <div class="fl left">手机号码</div>
            <div class="fl">
                <input type="number" id="mobile" placeholder="请输入手机号码" maxlength="11" v-model="mobile" >
            </div>
        </li>
        <li class="clearfix">
            <div class="fl left">身份证号码</div>
            <div class="fl">
                <input type="text" id="identityCard" placeholder="请输入身份证号码" maxlength="18" v-model="card" onkeyup="value=value.replace(/[\W]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))">
            </div>
        </li>
        <li class="clearfix">
            <div class="fl left">设置圈存密码</div>
            <div class="fl">
                <input type="password" id="password1" placeholder="6位数字圈存密码" maxlength="6" v-model="password1">
            </div>
        </li>
        <li class="clearfix">
            <div class="fl left">确认圈存密码</div>
            <div class="fl">
                <input type="password" id="password2" placeholder="再次输入密码" maxlength="6" v-model="password2">
            </div>
        </li>
    </ul>
    <div class="hint">
        可关注“上海都市旅游卡”微信公众号，查询账户余额
    </div>
    <div class="footer_bg"></div>
    <footer @click="submit">确认绑定</footer>
  </div>
</template>
<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import {checkMobile,isChinaName,isCardNo,isNumber} from '@/assets/js/verify.js';
export default {
  components: {
    api
  },
  data() {
    return {
      cardno:this.$route.params.cardno,
      name:localStorage.userName,
      mobile:localStorage.mobile,
      card:'',
      password1:'',
      password2:'',
    }
  },
  created(){
    dooolyAPP.initTitle('新开户绑定','')
  },
  methods:{
    submit(){
        if(this.name == ""){
            this.$toast("请输入姓名");
            return;
        }
        if(!isChinaName(this.name)){
            this.$toast("姓名有误");
            return;
        }
        if(this.mobile == ""){
            this.$toast("请输入手机号码");
            return;
        }
        if(checkMobile(this.mobile)){
            this.$toast("手机号码有误");
            return;
        }
        if(this.card == ""){
            this.$toast("请输入身份证号码");
            return;
        }
        if(!isCardNo(this.card)){
            this.$toast("身份证号码有误");
            return;
        }
        if(this.password1.length < 6 || this.password2.length < 6 || !isNumber(this.password1) || !isNumber(this.password2)){
            this.$toast("请输入6位数字圈存密码");
            return;
        }
        if(this.password1 != this.password2){
            this.$toast("2次圈存密码不一致");
            return;
        }
        http({
            method: 'post',
            url: api.bindNewAccount,
            data:{
              "cardno" : this.cardno,
              "phoneno" : this.mobile,
              "pwd" : this.password1,
              "userName" : this.name,
              "idCard" : this.card
            },
            notNeedTransfer:true
        }).then((data) => {
            if(data.data.resultCode == "success"){
                this.$toast("恭喜您绑定成功！");
                this.timeOut = setTimeout(() => {
                  dooolyAPP.gotoJumpVue(this.$router,'/recharge/2/0');
                }, 1500);
            }else{
                this.$toast("网络异常，请重试！");
            }
        });


    },
  }
}
</script>
<style scoped>
.view{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
}
input{
  outline: none;
}
header{
    border-bottom: 1px solid #ececec;
    padding: 0.2rem 0.3rem;
    font-size: 0;
    background: #fff;
}
header div{
    line-height: 0.98rem;
    font-size: 0.36rem;
    color: #666;
}
ul{
    background: #fff;
    padding: 0 0.3rem;
}
ul li{
    height: 0.98rem;
    line-height: 0.98rem;
    width: 100%;
    font-size: 0.3rem;
    color: #666;
    border-bottom: 1px solid #ececec;
}
ul li:last-child{
    border:0;
}
ul li div{
    width: 60%;
}
ul li .left{
    width: 36%;
    width: 2.4rem;
    font-size: 0.28rem;
    color: #333;
}
.hint{
    padding: 0.3rem 0.3rem;
    font-size: 0.24rem;
    color: #6b6b6b;
}
.footer_bg{
    width: 100%;
    height: 1rem;
}
footer{
    position: fixed;
    left:0;
    bottom: 0;
    width: 100%;
    line-height:1rem;
    text-align: center;
    background: #ee3f44;
    color: #fff;
    font-size: 0.3rem;
}
</style>
