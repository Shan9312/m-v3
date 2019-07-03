<template>
  <div>
    <div v-if="photoVisible" class="photo" @click="closePhoto()">
      <img id="imgDetail" :src=currentImg @click="closePhoto()">
    </div>
    <div class="frm_bottom"></div>
    <div class="frm_bg clearfix">
      <div class="fl">申诉编号</div>
      <div class="fr">{{complaintSn}}</div>
    </div>
    <div class="li_bottom"></div>
    <div class="frm_bg clearfix">
      <div class="fl">审核状态</div>
      <div class="fr" style="color: #ee3f44;">
        <span v-if="status == 0">申诉中</span>
        <span v-else-if="status == 1" >已受理</span>
        <span v-else-if="status == 2" >已驳回</span>
        <span v-else-if="status == 3" >已处理</span>
        <span v-else-if="status == 4" >积分返还中</span>
        <span v-else-if="status == 5" >已完成</span>
      </div>
    </div>
    <div class="li_bottom"></div>
    <div class="frm_bg clearfix">
      <div class="fl">申诉时间</div>
      <div class="fr time">{{updateDate}}</div>
    </div>
    <div class="li_bottom"></div>

    <div class="frm_bg clearfix">
      <div>申诉内容</div>
      <div class="content">{{content}}</div>
    </div>
    <div class="frm_bottom"></div>
    <div class="frm_bg clearfix">
      图片证据
    </div>
    <div class="frm_bg clearfix">
      <ul>
        <li v-for="(item,index) in imagePaths" :key="index">
          <img :src=item @click="previewImage(item)">
        </li>
      </ul>
    </div>
    <div class="frm_bottom"></div>
    <div class="frm_bg clearfix">
      客服反馈
    </div>
    <div class="li_bottom"></div>
    <div class="frm_bg clearfix complaint">
      <span v-if="reply !=''">
        {{reply}}
        <span v-if="status ==0"></span>
        <span v-else-if="status ==1"></span>
        <span v-else-if="status ==2"></span>
        <span v-else-if="status ==3"></span>
        <span v-else-if="status ==4"></span>
        <span v-else-if="status ==5">
          您好，经过调查，您提供的证据属实，我们将在5个工作日内将您的返利充值至您的积分中户中，请注意查看！
        </span>
      </span>
    </div>
  </div>
</template>

<script>
    import http from '@/http/http'
    import api from '@/assets/js/api.js';
    export default {
      name: "complainDetail",
      data(){
          return{
            photoVisible:false,
            complaintSn:"",
            status:"",
            updateDate:"",
            content:"",
            imagePaths:[],
            reply:"",
            currentImg:"",
            isOwnApp:""
          }
      },
      created(){
        initTitle('申诉详情','')
      },
      mounted:function () {
        this.isOwnApp=localStorage.ownApp;
        this.getComplainDetail();
      },
      methods:{
        add0:function (m) {
          return m<10?'0'+m:m
        },
        getComplainDetail:function () {
          http({
            method: 'post',
            url: api.myComplaintDetail+"?id="+this.$route.params.complainId+"&token="+localStorage.token,
            data:{
              id:this.$route.params.complainId,
              token:localStorage.token
            }
          }).then((res) => {
            if (res.data.complaint != undefined) {
              this.complaintSn=res.data.complaint.complaintSn;
              this.status=res.data.complaint.status;
              let time = new Date(res.data.complaint.updateDate);
              let year = time.getFullYear();
              let month = time.getMonth()+1;
              let date = time.getDate();
              let hours = time.getHours();
              let minutes = time.getMinutes();
              let seconds = time.getSeconds();
              this.updateDate= year+'-'+this.add0(month)+'-'+this.add0(date)+' '+this.add0(hours)+':'+this.add0(minutes)+':'+this.add0(seconds);
              this.content=res.data.complaint.content;
              this.imagePaths=res.data.imagespath;
              this.reply=res.data.complaint.reply;
            }
          });
        },
        previewImage:function (imageSrc) {
          if(browserName == "WeChat"){
            wx.previewImage({
              current: imageSrc, // 当前显示图片的http链接
              urls: this.imagePaths // 需要预览的图片http链接列表
            });
          }
          else{
            this.currentImg=imageSrc;
            this.photoVisible=true;
          }
        },
        closePhoto:function () {
          this.photoVisible=false;
        }
      }
    }
</script>

<style scoped>
  .frm_bg{width: 6.9rem;margin: 0 auto;padding:0 0.3rem;font-size:0.3rem;line-height:0.7rem;background:#fff;}
  .frm_bottom{width: 7.5rem;height: 0.1rem;margin: 0 auto;background: #f7f7f8;}
  .li_bottom{width: 7.5rem;height: 1px;background: #cacaca;margin: 0 auto;}

  .frm_bg .fl{color:#323232;}
  .frm_bg .fr{color:#959595;}
  .frm_bg .content{
    line-height: initial;
    font-size: 0.28rem;
    color: #959595;
    padding-bottom: 0.3rem;
  }
  .complaint{
    line-height: initial;
    font-size: 0.28rem;
    color: #ee3f44;
    padding: 0.3rem;
  }
  .frm_bg ul{
    font-size: 0;
    padding-bottom: 0.3rem;
    line-height: normal;
  }
  .frm_bg ul li{
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    margin-right: 0.3rem;
    margin-bottom:0.1rem;
  }
  .frm_bg ul li:last-child{
    margin-right: 0;
  }
  .frm_bg ul li img{
    width:100%;
    height:100%;
  }
  .photo{position: absolute;left: 0;top: 0; width: 100%;height: 100%;background:rgba(0,0,0,1);z-index: 9999;}
  .photo img{position:absolute;width:100%;top:0;bottom:0;margin:auto 0;}
</style>
