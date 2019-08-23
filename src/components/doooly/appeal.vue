<template>
  <div>
    <div data-role="page" style="padding-bottom:1rem;text-align: center;font-size: 0;">
      <form id="save" method="post" enctype="multipart/form-data">
        <div class="formParams">
          <div class="clearfix">
            <div class="fl">姓名</div>
            <input v-model="userName" class="inputText" type="text" name="name" placeholder="请输入姓名">
          </div>
          <div class="clearfix">
            <div class="fl">手机号码</div>
            <input class="inputText" v-model="contactInfo" type="text" name ="contactInfo" placeholder="请输入手机号" maxlength="11" value="${telephone}">
          </div>
          <div class="clearfix">
            <div class="fl">申诉类型</div>
            <div class="fr" @click="appeal()">
              <input class="inputText fillAppealType" disabled="disabled" v-model="appealText">
              <img v-if="arrowImg" src="../../assets/images/personalCenter/customerService/down.png">
              <img v-if="!arrowImg" src="../../assets/images/personalCenter/customerService/up.png">
            </div>
          </div>
          <div class="list_view">
            <div class="title">具体申诉理由</div>
            <div v-if="dataType==1">
              <div v-for="(item,index) in orderAppeal" :key="index" v-bind:class='{check:item.ifSelect==selected}'
                   @click="appealList(item.ifSelect,item.value)" class="list_li">
                <span></span><b>{{item.value}}</b>
              </div>
            </div>

            <div v-else-if="dataType==2">
              <div v-for="(item,index) in pointAppeal" :key="index" v-bind:class='{check:item.ifSelect==selected}'
                   @click="appealList(item.ifSelect,item.value)" class="list_li">
                <span></span><b>{{item.value}}</b>
              </div>
            </div>

            <div v-else-if="dataType==6">
              <div v-for="(item,index) in serviceAppeal" :key="index" v-bind:class='{check:item.ifSelect==selected}'
                   @click="appealList(item.ifSelect,item.value)" class="list_li">
                <span></span><b>{{item.value}}</b>
              </div>
            </div>

            <div v-else-if="dataType==5">
              <div v-for="(item,index) in suggestions" :key="index" v-bind:class='{check:item.ifSelect==selected}'
                   @click="appealList(item.ifSelect,item.value)" class="list_li">
                <span></span><b>{{item.value}}</b>
              </div>
            </div>
            <div class="input" v-if="reasonText">
              <input v-model="otherContent" class="content" name="content" type="text" placeholder="请填写申诉理由">
            </div>
          </div>

          <div class="bottom_line"></div>
          <div>
            <div class="title">上传照片</div>
            <ul>
              <li v-show="newAddImg" v-for="(item,index) in imgList" :key="index">
                <img v-if="item.deleteImg" class="close" src="../../assets/images/personalCenter/customerService/close_complaint.png" @click="delImg(index)">
                <img class="append" :src="item.imgUrl" @click="imgPreview(item.imgUrl)">
              </li>
              <li @click="chooseImgAPP">
                <input type="file" class="pictureUpload"  accept="image/*" @change="chooseImg($event)" multiple ref="avatarInput">
                <div v-if="defaultImg">
                  <img class="append" src="../../assets/images/personalCenter/customerService/append.jpg">
                </div>
              </li>
            </ul>
          </div>
        </div>
      </form>
      <p class="frm_view">
        <span>客服热线</span><a @click="dial_phone()" href="#">400-158-2212</a><br>
        {{serviceTime}}
      </p>
    </div>
    <div class="button_bg">
      <input type="button" id="ref" v-model="submitText" @click="ref()" :disabled="submitDisable" :class="classObj">
    </div>
    <div v-if="popupVisible" class="pickerCover" @touchmove.prevent>
      <div class="picker-div">
        <div> 
          <input type="button" value="取消" class="" @click="cancelAppeal()">
          <input type="button" value="确定" class="" @click="selectAppeal()">
        </div>
        <mt-picker :slots="appealSlots" @change="onAppealChange" :visible-item-count="5" valueKey="appealType"></mt-picker>
      </div>
    </div>
    <div v-if="photoVisible" class="photo" @click="closePhoto()">
      <img id="imgDetail" :src=currentImg @click="closePhoto()">
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js'
  import api from '@/assets/js/api.js';
  import {checkMobile} from '@/assets/js/verify.js';
  let globalVue=[];
  window["APP_chooseImage"] = function(img) {
    globalVue.APP_chooseImage_uploading("data:image/jpeg;base64,"+img);
  };
    export default {
      name: "appeal",
      data(){
          return{
            userName:"",
            contactInfo:"",
            dataType:"1",
            popupVisible:false,
            appealIndex:0,
            appealIndexTemp:"",
            appealText:"",
            appealTextTemp:"",
            appealSlots:[
              {
                values: [
                  {"id":1, "appealType":'订单申诉'},
                  {"id":2, "appealType":'积分申诉'},
                  {"id":6, "appealType":'服务申诉'},
                  {"id":5, "appealType":'投诉建议'}
                ]
              }],
            arrowImg:true,
            orderAppeal:[
              {ifSelect: 0, value:"物流咨询"},
              {ifSelect: 1, value:"订单兑换流程问题"},
              {ifSelect: 2, value:"实体卡办理使用"},
              {ifSelect: 3, value:"其他"}
            ],
            pointAppeal:[
              {ifSelect: 0, value:"积分如何使用"},
              {ifSelect: 1, value:"返利积分到账时间"},
              {ifSelect: 2, value:"活动积分咨询"},
              {ifSelect: 3, value:"其他"}
            ],
            serviceAppeal:[
              {ifSelect: 0, value:"如何成为/激活会员"},
              {ifSelect: 1, value:"如何取消会员"},
              {ifSelect: 2, value:"账号和密码不对"},
              {ifSelect: 3, value:"其他"}
            ],
            suggestions:[
              {ifSelect: 0, value:"页面显示不正常/报错"},
              {ifSelect: 1, value:"商品质量问题"},
              {ifSelect: 2, value:"无法享受兜礼权益"},
              {ifSelect: 3, value:"其他"}
            ],
            selected:"0",
            reasonText:false,
            content:"",
            otherContent:"",
            imgList:[],
            maxImgNum:4,    //最大上传的照片数量
            imgNum:0,//已选择上传照片数量
            selectImgNum:0,//input选择的照片数量
            defaultImg:true,
            newAddImg:false,
            photoVisible:false,
            currentImg:"",
            imgTargetList:[],
            isSubmitting:false,
            submitText:"提交",
            otherAPP:this.$browserName,
            textName:'',
            serviceTime:dooolyConfig.serviceTime,
          }
      },
      beforeCreate(){
        document.body.style.backgroundColor="#f5f5f5";
      },
      beforeDestroy(){
        document.body.style.backgroundColor="";
      },
      created(){
        globalVue = this;
        dooolyAPP.initTitle('联系客服','')
      },
      computed:{
        submitDisable: function () {
          if (this.isSubmitting) {
            return true
          }
          else {
            return false
          }
        },
        classObj: function () {
          if (!this.isSubmitting) {
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
      mounted:function(){
        this.appealIndex=this.$route.params.dataType;
        this.dataType=this.$route.params.dataType;
        if(this.appealIndex == 1){
          this.appealText="订单申诉";
          this.appealSlots[0].defaultIndex = this.appealIndex-1;
        }
        else if(this.appealIndex == 2){
          this.appealText="积分申诉";
          this.appealSlots[0].defaultIndex = this.appealIndex-1;
        }
        else if(this.appealIndex == 6){
          this.appealText="服务申诉";
          this.appealSlots[0].defaultIndex = 2;
        }
        else if(this.appealIndex == 5){
          this.appealText="投诉建议";
          this.appealSlots[0].defaultIndex = 3;
        }
        if(this.dataType==1){
          this.content='物流咨询';
        }
        else if(this.dataType==2){
          this.content='积分如何使用';
        }
        else if(this.dataType==6){
          this.content='如何成为/激活会员';
        }
        else if(this.dataType==5){
          this.content='页面显示不正常/报错';
        }
        this.init();
      },
      methods:{
        dataURLtoBlob(dataurl) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], {type:mime});
        },
        APP_chooseImage_uploading(img){
          let blobBin = this.dataURLtoBlob(img);
          let formData = new FormData();
          formData.append("blobBin", blobBin);
          http({
            method: 'post',
            url:api.appUploadImg,
            data:formData,
            dataType: "text",
            type:'post',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
          }).then((res) => {
            if(res.data.code==1000){
              let imgObj={};
              imgObj.deleteImg=true;
              imgObj.imgUrl=res.data.imageViewPath;
              this.imgList.push(imgObj);
              this.newAddImg=true;
            }
          });
        },
        dial_phone(){
          dooolyAPP.callPhone('4001582212');
        },
        init() {
          http({
            method: 'get',
            url: api.appealDetail+"?type="+this.appealIndex+"&token="+localStorage.token,
          }).then((res) => {
            this.contactInfo=res.data.telephone;
          });
        },
        appeal() {
          this.popupVisible=true;
          this.arrowImg=false;
        },
        onAppealChange(picker, values){
          this.appealTextTemp=values[0].appealType;
          this.appealIndexTemp=values[0].id;
        },
        cancelAppeal(){
          this.popupVisible = false;
          this.arrowImg=true;
        },
        selectAppeal() {
          this.popupVisible = false;
          this.arrowImg=true;
          this.appealIndex=this.appealIndexTemp;
          this.appealText=this.appealTextTemp;
          this.dataType=this.appealIndexTemp;
          if(this.appealIndex==1||this.appealIndex==2){
            this.appealSlots[0].defaultIndex = this.appealIndex-1;
            if(this.appealIndex==1){
              this.content='物流咨询';
            }else {
              this.content='积分如何使用';
            }
          }
          else if(this.appealIndex==6){
            this.appealSlots[0].defaultIndex = 2;
            this.content='如何成为/激活会员';
          }else if(this.appealIndex==5){
            this.appealSlots[0].defaultIndex = 3;
            this.content='页面显示不正常/报错';
          }
          this.otherContent="";
          this.selected = 0;
          this.reasonText=false;
        },
        appealList(index,value) {
          this.selected = index;
          this.reasonText=false;
          this.content=value;
          if(index==3){
            return this.reasonText=true;
          }
        },
        //app选择照片
        chooseImgAPP(){
          if(this.$browserName == 'otherAPPAndroid' || this.$browserName == 'Chrome WebView'){ 
            dooolyAPP.photographNative('APP_chooseImage');
          }
        },
        //选择照片
        chooseImg(e) {
          let inputDOM = this.$refs.inputer;
          this.file = e.target.files;
          let img=e.target.files;
          this.selectImgNum=img.length;
          if(this.selectImgNum+this.imgNum>this.maxImgNum){
            this.$toast("最多选择4张图片");
          }
          else if(this.selectImgNum+this.imgNum<=this.maxImgNum &&this.selectImgNum+this.imgNum>0 ){
            let previewUrl=this.getFileUrl(e.srcElement);
            for(let i=0;i<previewUrl.length;i++ ){
              let imgObj={};
              imgObj.deleteImg=true;
              imgObj.imgUrl=previewUrl[i];
              this.imgList.push(imgObj);
            }
            this.newAddImg=true;
            if( this.selectImgNum+this.imgNum==this.maxImgNum){
              this.defaultImg=false;
            }
            this.imgNum=this.imgList.length;
            if(this.selectImgNum>0){
              for(let i=0; i<this.selectImgNum;i++){
                let file=img[i];
                this.imgTargetList.push(file);
              }
            
            }
          }
        },
        getFileUrl(obj) {
          let url;
          let preViewimgUrl=[];
          for(let i=0;i<this.selectImgNum;i++){
            url = window.URL.createObjectURL(obj.files.item(i));
            preViewimgUrl.push(url);
          }
          return preViewimgUrl;
        },
        //照片预览
        imgPreview (imageSrc) {
          this.photoVisible=true;
          this.currentImg=imageSrc;
        },
        delImg(index){
          this.imgList.splice(index,1);
          this.imgTargetList.splice(index,1);
          this.imgNum =this.imgList.length;
          if(this.imgNum <this.maxImgNum){
            this.defaultImg=true;
          }
        },
        closePhoto:function () {
          this.photoVisible=false;
        },
        //提交
        ref() {
          if( this.userName == ""){
            this.$toast("请输入姓名");
            return;
          }
          if( this.contactInfo == ""){
            this.$toast("请输入手机号");
            return;
          }
          if (checkMobile(this.contactInfo)){
            this.$toast("手机号格式不正确");
            return;
          }
          if(this.$browserName == 'otherAPPAndroid'  || this.$browserName == 'Chrome WebView'){
            this.appRef();
            return;
          }
          let formData=new FormData();
          for (let i=0;i<this.imgTargetList.length;i++){
            formData.append("img", this.imgTargetList[i]);
          }
          formData.append("userId", localStorage.userId);
          formData.append("name", this.userName);
          formData.append("contactInfo", this.contactInfo);
          formData.append("type", this.appealIndex);
          if(this.reasonText==false){
            formData.append("content", this.content);
          }
          else {
            formData.append("content", this.otherContent);
          }
          this.submitText = "提交中";
          this.isSubmitting = true;
          http({
            method: 'post',
            url: api.appealSubmit,
            headers: {
              "Content-Type": "multipart/form-data"
            },
            //不可缺
            processData: false,
            //不可缺
            data:formData
          }).then((res) => {
            if(res.data.code=="1000"){
              this.$router.push({path:"/saveSuccess"});
            }else {
              this.$router.push({path:"/saveFailed"});
            }
          }).catch((err) => {
              this.$router.push({path:"/saveFailed"});
          });

        },
        appRef(){
          var images = '';
          for (let i=0;i<this.imgList.length;i++){
            var a = this.imgList[i];
            images += a.imgUrl + ';';
          }
          http({
            method: 'post',
            url: api.saveForAppTwo,
            data: {
              userId:localStorage.userId,
              name:this.userName,
              contactInfo:this.contactInfo,
              type:this.appealIndex,
              img:images
            },
          }).then((res) => {
            if(res.data.code=="1000"){
              this.$router.push({path:"/saveSuccess"});
            }else {
              this.$router.push({path:"/saveFailed"});
            }
          }).catch((err) => {
              this.$router.push({path:"/saveFailed"});
          });
        }
      }
    }
</script>

<style scoped>
  .bottom_line{
    width: 7.5rem;
    margin-left: -0.3rem;
    height: 0.2rem;
    background: #f5f5f5;
  }
  textarea{
    width: 6.5rem;
    height: 2.8rem;
    border: 1px solid #d4d4d4;
    display:block;
    margin: 0 auto;
    resize:none;
    padding: 0.2rem;
    font-size: 0.28rem;
    line-height: 0.36rem;
    outline: none;
  }
  .title{
    font-size: 0.28rem;
    color: #333;
    line-height:100%;
    margin-top: 0.36rem;
    margin-bottom: 0.3rem;
    text-align: left;
  }
  ul{
    font-size: 0;
    text-align: left;
    white-space: nowrap;
  }
  ul li{
    font-size:0;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.3rem;
    background-color: #fff;
    position: relative;
    line-height: 1.6rem;
  }
  ul li:last-child{
    margin-right: 0;
  }
  ul li div{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .pictureUpload{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 100;
    opacity: 0;
  }
  ul li img{
    width: 100%;
    height: 100%;
  }
  ul li .close{
    width: 0.36rem;
    height: 0.36rem;
    position: absolute;
    top: -0.06rem;
    right: -0.06rem;
  }


  form{
    width: 100%;
    font-size: 0;
    background: #fff;
  }
  .formParams{
    padding: 0.2rem 0.3rem;
  }
  form .clearfix{
    height: 0.98rem;
    line-height: 0.98rem;
    border-bottom: 1px solid #ececec;
    font-size: 0;
    text-align: left;
  }
  form .clearfix .fl{
    display: inline-block;
    width: 1.97rem;
    font-size: 0.28rem;
    color: #333;
  }
  form input.inputText{
    background: #fff;
    width: 4.5rem;
    color: #333;
    font-size: 0.28rem;
    outline: none;
    height: 0.98rem;
  }
  form input.fillAppealType{
    opacity:1;
    -webkit-text-fill-color:#333;
    -webkit-opacity:1;
  }
  form .clearfix .fr{
    font-size: 0;
  }
  form .clearfix .fr input{
    color: #333;
    font-size: 0.28rem;
    outline: none;
    text-align: right;
    margin-right: 0.19rem;
    height: 0.98rem;
    width: 4rem;
  }
  form .clearfix .fr img{
    width: 0.28rem;
    height: 0.16rem;
  }
  form .list_view{
    margin: 0.36rem 0 0.4rem 0;
    font-size: 0.28rem;
    color: #333;
    line-height: 100%;
    text-align: left;
  }
  form .list_view .title{
    margin-bottom: 0.4rem;
  }
  form .list_view .list_li{
    margin-bottom: 0.4rem;
    position: relative;
    padding-left: 0.48rem;
  }
  form .list_view .list_li span{
    position: absolute;
    left: 0;
    top: -1px;
    width: 0.28rem;
    height: 0.28rem;
    border-radius: 100%;
    border:1px solid #dddddd;
  }
  form .list_view .list_li b{
    font-weight: normal;
  }
  form .list_view .check span{
    background: url(../../assets/images/personalCenter/customerService/check.png) no-repeat 0 0;
    background-size: 100%;
    width: 0.3rem;
    height: 0.3rem;
    border:0;
  }
  form .list_view .input{
    padding-left: 0.48rem;
  }
  form .list_view .input input{
    background: #fff;
    width: 4.5rem;
    color: #333;
    font-size: 0.28rem;
    outline: none;
  }
  form textarea{
    border-radius: 0.1rem;
  }
  .frm_view{
    font-size: 0.27rem;
    line-height: 0.34rem;
    color: #000000;
    text-align: left;
    padding:  0.1rem 0.4rem;
  }
  .frm_view{
    padding: 0 0.3rem;
    font-size: 0.3rem;
    color: #000;
  }

  .frm_view{
    margin: 0.4rem 0;
    padding: 0;
    text-align: center;
    line-height: 0.4rem;
    font-size: 0.28rem;
    color: #999;
  }
  .frm_view span{
    color: #333;
  }
  .frm_view a{
    color: #4891fe;
    text-decoration: none;
  }
  .button_bg{
    width: 100%;
    height: 1rem;
    position: fixed;
    left:0;
    bottom: 0;
    font-size: 0;
  }
  .button_bg input[type="button"]{
    width: 100%;
    height: 1rem;
    border: 0;
    font-size: 0.36rem;
  }
  .button_bg .dis_btn{background: #f58c8f;color: #f9c5c6;}
  .button_bg .click_btn{
    background: #ee3f44;
    color: #fff;
  }
  .pickerCover{
    position: fixed;left: 0;top: 0; width: 100%;height: 100%;background:rgba(0,0,0,0.4);z-index: 1000;
  }
  .picker-div{
    width: 100%;
    background-color: #fff;
    position: fixed;
    bottom:0;
    z-index: 2002;
    font-size: 0;
  }
  .picker-div input[type=button]{
    height: 40px;
    padding: 10px;
    width: 50%;
    background-color: #fff;
    font-size:0.3rem;
    color:#1971c8;
  }
  .photo{position: absolute;left: 0;top: 0; width: 100%;height: 100%;background:rgba(0,0,0,1);z-index: 9999;}
  .photo img{position:absolute;width:100%;top:0;bottom:0;margin:auto 0;}
</style>
