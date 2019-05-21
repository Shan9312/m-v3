<template>
  <div class="continer">
    <div class="blank"></div>
    <div class="lodge">
      <div class="headImg">
        <img src="../../assets/images/personalCenter/complaint/succ.png"/>
      </div>
      <div class="content">
        <span>您的</span>
        <span style="color:#FB7F82;">申诉提交成功</span>
        <span>，我们将在1-2个</span><br>
        <span>工作日内为您处理，您可以在我的</span><br>
        <span>申诉查看申诉进度！</span>
      </div>
      <div class="btn_div">
        <span class="times">3</span><span>秒后自动关闭，</span><a href="javascript:void(0);" @click="goBackPersonalCenter()" style="">立即返回</a>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/assets/js/api.js';
    export default {
        name: "saveSuccesss",
      beforeCreate(){
        document.body.style.backgroundColor="#F3F1F2";
      },
      beforeDestroy(){
        document.body.style.backgroundColor="";
      },
      created(){
        initTitle('申诉成功','')
      },
      mounted(){
        let t = setTimeout(() => {
          this.goBackPersonalCenter();
          clearTimeout(t);
        }, 3000);
      },
      methods:{
        goBackPersonalCenter:function () {
          this.$router.push({path:'/complaint/'});
        }
      },
    }
</script>

<style scoped>
  .blank{height: 70px}
  .headImg{
    text-align: center;
  }
  .headImg img{width: 70px; height: 70px}
  .content{margin-top: 30px;text-align: center; font-size: 0}
  .content span{font-size: 16px;line-height: 1.6; color: #757575;}
  .btn_div{margin-top: 30px; text-align: center;}
  .btn_div span{display: inline-block;font-size: 16px;line-height: 1.6; color: #757575;vertical-align: middle}
  .btn_div .times{font-size:35px; color:#639EFB;height: 65px;}
  .btn_div a{color:#FEA62B; font-size:16px;vertical-align: middle}
</style>
