<template>
  <div class="view">
    <img src="../../../assets/images/activity/invitation/1.jpg">
    <img src="../../../assets/images/activity/invitation/2.jpg">
    <img src="../../../assets/images/activity/invitation/3.jpg">
    <img src="../../../assets/images/activity/invitation/4.jpg">
    <img src="../../../assets/images/activity/invitation/5.jpg">
    <img src="../../../assets/images/activity/invitation/6.jpg">
    <img src="../../../assets/images/activity/invitation/7.jpg">
    <div class="input_view">
      <div class="title">参与方式</div>
      <input type="text" maxlength="50" placeholder="请输入您的姓名" v-model="name" >
      <input type="tel" maxlength="11" placeholder="请输入您的手机" v-model="phone">
      <input type="text" maxlength="50" placeholder="请输入您的公司名称" v-model="group">
      <input type="button" value="报名参加" @click="submit">
    </div>
    <footer>
      <img src="../../../assets/images/activity/invitation/footer.png">
    </footer>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {checkMobile,isNmae} from '@/assets/js/verify.js';
  import {shareWithFriendsWX,shareWithFriendsAPP} from '@/assets/js/wechatShare2.js';
    export default {
      name: "activity_invitation",
      data(){
        return{
          name:'',
          phone:'',
          group:'',
          inter_name:this.$route.query.name,
        }
      },
      methods: {
        submit(){
          if(!this.name){
            this.$toast('请输入您的姓名');
            return;
          };
          if(isNmae(this.name)){
            this.$toast('姓名不能包含特殊字符');
            return;
          }
          if(!this.phone){
            this.$toast('请输入您的手机号码');
            return;
          };
          if(checkMobile(this.phone)){
            this.$toast('请输入正确的手机号码');
            return;
          };
          if(!this.group){
            this.$toast('请输入您的公司名称');
            return;
          };
          if(isNmae(this.group)) {
            this.$toast('公司名称不能包含特殊字符');
            return;
          }
          http({
              method: 'post',
              url: api.registerForum,
              data:{
                name:this.name,
                phone:this.phone,
                companyName:this.group,
                inviter:this.inter_name,
              }
          }).then((data) => {
              if(data.data.code == 1000){
                  this.$toast('提交成功!');
                  this.name = '';
                  this.phone = '';
                  this.group = '';
              }else if(data.data.msg){
                  this.$toast(data.data.msg);
              }else{
                  this.$toast('小兜兜正忙,请稍候重试!');
              }
          })
        },
        Wechatshare(){
          var client = 'doooly';
          var ua = window.navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            client = 'wechat';//是微信
          } else {
            client = 'doooly';//不是微信
          }
          this.$jsonp(api.commonShareJSONPConfig+"?client="+client+"&prefix=forumInvitation&params="+this.inter_name+"&url="+encodeURIComponent(window.location.href),{callbackName: 'jsonpCallback',}).then((res) => {
              if(res.code == 4001){
                shareWithFriendsWX(res.data);//40001微信配置
              }else if(res.code == 4002){
                shareWithFriendsAPP(res);//40002兜里配置
              }
          });
        }
      },
      mounted() {
        this.Wechatshare();
      },
    }

</script>

<style scoped>
  .view{
    font-size: 0;
  }
  .input_view{
    text-align: center;
    margin-top: -1.7rem;
  }
  .title{
    font-size: 0.4rem;
    color: #000;
    margin-bottom: 0.6rem;
  }
  input[type='text'],input[type='tel']{
    width: 5.2rem;
    height: 0.8rem;
    text-indent: 0.2rem;
    border-radius: 0.1rem;
    border:1px solid #ccc;
    font-size: 0.3rem;
    color: #333;
    margin-bottom: 0.2rem;
  }
  input[type='button']{
    width: 5.2rem;
    height: 0.96rem;
    text-align: center;
    background-color: rgb( 216, 12, 57 );
    box-shadow: 0px 11px 10px 0px rgba(216, 12, 57, 0.51);
    border-radius: 0.1rem;
    font-size: 0.4rem;
    color: #fff;
    margin: 0.5rem 0 0.9rem 0;
  }
  footer img{
    width: 3.17rem;
  }
  footer{
    padding-bottom: 0.6rem;
    text-align: center;
  }
</style>
