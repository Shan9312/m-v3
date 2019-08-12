<template>
  <div class="view">

    <div class="top"></div>
    <header v-if="userDeliveryList.length <=0"  @click="link()" class="add clearfix">
      <div class="fl">
        点击添加收货地址
      </div>
      <div class="fr">
        <img src="../../assets/images/userDelivery/right.png">
      </div>
    </header>
    <!-- 收货地址 -->
    <header v-else @click="link()" class="clearfix">
      <div v-if="haveSotrageData==0">
        <div  v-for="(item,index) in userDeliveryList" :key="index" v-show="index == 0">
          <div class="fl clearfix">
            <span class="name">收货人：{{item.receiverName}}</span>
            <span class="fr tel">{{item.receiverTelephone}}</span>
            <br>
            <span class="address">收货地址：{{item.province + item.city + item.area + item.address}}</span>
          </div>
          <div class="fr">
            <img src="../../assets/images/userDelivery/right.png">
          </div>
        </div>
      </div>
      <div v-else-if="haveSotrageData == 1">
        <div class="fl clearfix">
          <span class="name">收货人：{{deliveryAddressData.receiverName}}</span>
          <span class="fr tel">{{deliveryAddressData.receiverTel}}</span>
          <br>
          <span class="address">收货地址：{{deliveryAddressData.province + deliveryAddressData.city + deliveryAddressData.area + deliveryAddressData.address}}</span>
        </div>
        <div class="fr">
          <img src="../../assets/images/userDelivery/right.png">
        </div>
      </div>
    </header>
    <div class="line_bold"></div>
    <div class="main">
      <!-- 办卡区域 -->
      <div class="list_li list_li_minute option clearfix store1" @click="distpicker(1)">
          <div class="fr">
              <img src="../../assets/images/userDelivery/right.png">
          </div>
          <div class="center fr">
            <span v-if="area1==''" id="distpicker1">请选择办卡区域</span>
            <span v-else>{{area1}}</span>
          </div>
          <div class="fl">
              所在区域
          </div>
      </div>

      <!-- 办卡门店 -->
      <div class="list_li list_li_minute option clearfix store1" @click="store_list(1)">
          <div class="fr">
              <img src="../../assets/images/userDelivery/right.png">
          </div>
          <div class="center fr">
            <span v-if="store1==''" id="store_name1">请选择门店</span>
            <span v-else>{{store1}}</span>
          </div>
          <div class="fl">
              办卡门店
          </div>
      </div>

      <!-- 办卡区域 -->
      <div class="list_li list_li_minute option clearfix store2" @click="distpicker(2)" v-if="this.postDataSpecification.indexOf('两店') > 0">
          <div class="fr">
              <img src="../../assets/images/userDelivery/right.png">
          </div>
          <div class="center fr">
            <span v-if="area2==''" id="distpicker2">请选择办卡区域</span>
            <span v-else>{{area2}}</span>
          </div>
          <div class="fl">
              所在区域
          </div>
      </div>

      <!-- 办卡门店 -->
      <div class="list_li list_li_minute option clearfix store2" @click="store_list(2)" v-if="this.postDataSpecification.indexOf('两店') > 0">
          <div class="fr">
              <img src="../../assets/images/userDelivery/right.png">
          </div>
          <div class="center fr">
            <span v-if="store2==''" id="store_name2">请选择门店</span>
            <span v-else>{{store2}}</span>
          </div>
          <div class="fl">
              办卡门店
          </div>
      </div>

      <!-- 姓名 -->
      <div class="list_li list_li_minute clearfix">
          <div class="fl">
              办卡人姓名
          </div>
          <div class="center fl">
              <input v-model="name" id="name" type="text" maxlength="10" placeholder="请输入姓名">
          </div>
      </div>

      <!-- 手机号 -->
      <div class="list_li list_li_minute clearfix">
          <div class="fl">
              办卡人手机
          </div>
          <div class="center fl">
              <input v-model="tel" id="tel" type="text" maxlength="11" placeholder="请输入手机号" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
          </div>
      </div>

      <!-- 身份证号 -->
      <div class="list_li list_li_minute clearfix">
          <div class="fl">
              身份证号
          </div>
          <div class="center fl">
              <input v-model="card" id="card" type="text" maxlength="18" placeholder="请输入居民身份证号码">
          </div>
      </div>

      <!-- 身份证照片 -->
      <div class="list_li list_li_minute clearfix picture">
        <div class="fl">
              身份证照片
        </div>

        <div class="center fl" @click="chooseImage(1)" v-if="browserName == 'WebKit'|| browserName == 'Chrome WebView' || browserName == 'otherAPPAndroid' || browserName == 'otherAPPIos'">
          <img v-if="cardImg==null" src="../../assets/images/userDelivery/idDefaultImg.png">
          <img v-else :src="cardImg">
        </div>
        <div class="selectImgDiv" v-else>
          <div class="showImgDiv">
            <img v-if="cardImg==null" style="" src="../../assets/images/userDelivery/idDefaultImg.png">
            <img v-else :src="cardImg"/>
          </div>
          <input class="pictureUpload" type="file" accept="image/*" @change="chooseIDImg($event)">
        </div>
      </div>

      <!-- 办卡人照片 -->
      <div class="list_li list_li_minute clearfix picture">
        <div class="fl">
            办卡人照片
        </div>
        <div id="picture_view" class="center fl" v-if="browserName == 'WebKit'|| browserName == 'Chrome WebView' || browserName == 'otherAPPAndroid' || browserName == 'otherAPPIos'" @click="chooseImage(2)">
          <img v-if="headPhoto==null" src="../../assets/images/userDelivery/addDefaultImg.png">
          <img v-else :src="headPhoto">
        </div>
        <div class="selectImgDiv" v-else>
          <div class="showImgDiv">
            <img v-if="headPhoto==null" style="" src="../../assets/images/userDelivery/addDefaultImg.png">
            <img v-else :src="headPhoto"/>
          </div>
          <input class="pictureUpload" type="file" accept="image/*"  @change="chooseHeadImg($event)" >
        </div>
      </div>

      <!-- 工作证照片 -->
      <div class="list_li list_li_minute clearfix picture">
        <div class="fl">
            工作证照片 <span> (请上传工作证正面照片，工号需清晰可见)</span>
        </div>
        <div id="empCard_view" class="center fl" @click="chooseImage(3)" v-if="browserName == 'WebKit'|| browserName == 'Chrome WebView' || browserName == 'otherAPPAndroid' || browserName == 'otherAPPIos'">
          <img v-if="workCardPhoto==null" src="../../assets/images/userDelivery/addDefaultImg.png">
          <img v-else :src="workCardPhoto"/>
        </div>
        <div class="selectImgDiv" v-else>
          <div class="showImgDiv">
            <img v-if="workCardPhoto==null" style="" src="../../assets/images/userDelivery/addDefaultImg.png">
            <img v-else :src="workCardPhoto"/>
          </div>
          <input class="pictureUpload" type="file" accept="image/*" @change="chooseWorkCardImg($event)">
        </div>
      </div>
    </div>
    <div class="company">
        <div class="title"><span>﹡</span>在健身卡有效期内，持卡人在同一家门店只能拥有一张卡</div>
        <div class="clearfix picture_view">
            <div class="fl picture">
                <img :src="postData.img">
            </div>
            <div class="fl price">
                <span class="name">{{postData.name}}</span><br>
                <span class="type">规格：{{postData.specification}}</span><br>
                <span><span style="font-size:0.24rem;margin: 0;padding: 0;color:#ee3f44;">￥</span><span style="display: inline;margin: 0;padding: 0;" class="sellPrice">{{postData.sellPrice}}</span></span>
            </div>
        </div>
        <div class="freight clearfix">
            <div class="fl">
                运费
            </div>
            <div class="fr">
                ￥0.00
            </div>
        </div>
    </div>
    <div class="line_bold"></div>
    <div class="footer_bg"></div>
    <footer>
        <div class="fl">
            应付金额：<span><span style="font-size:0.24rem;margin: 0;padding: 0;">￥</span><span class="sellPrice">{{postData.sellPrice}}</span></span>
        </div>
        <div class="fr" @click="refer()" :disabled="referDisable" :class="classObj">
            确认提交
        </div>
    </footer>
    <div v-if="storePopVisible" class="store_list_bg">
        <div class="store_list">
            <div @click="hidde()" class="close"><img src="../../assets/images/userDelivery/address_close.png"></div>
            <div class="title">请选择门店</div>
            <ul>
              <li v-for="(item,index) in deliveryStoreList" @click="selectStore(item.id,item.storeName)">{{item.storeName}}</li>
              <li v-if="noStores">暂无门店</li>
            </ul>
        </div>
    </div>
    <!--<distpicker></distpicker>-->
    <div v-if="distPopVisible" class="data_bg">
      <div class="data">
        <div @click="hidde()" class="close">
          <img src="../../assets/images/userDelivery/address_close.png">
        </div>
        <div class="title">所在地区</div>
        <div class="address">
          <span @click="deleProvince()">{{province}}</span>
          <b v-if="provinceBorder"></b>
          <span @click="deleCity()">{{city}}</span>
          <b v-if="cityBorder"></b>
          <span>{{district}}</span>
          <span class="check">请选择</span>
        </div>
        <ul>
          <li v-for="(item,index) in districtData" @click="selectCity(index,item)">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http';
  import ChineseDistricts from '@/assets/js/address.js';
  import api from '@/assets/js/api.js';
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex';
  import {checkMobile} from '@/assets/js/verify.js';

  let globalVue;
  window["APP_chooseImage"] = function(img) {
    if(globalVue.chooseImg == 1){
      globalVue.cardImg="data:image/jpeg;base64,"+img;
      globalVue.APP_chooseImage_uploading(globalVue.cardImg);
    }else if(globalVue.chooseImg == 2){
      globalVue.headPhoto= "data:image/jpeg;base64,"+img;
      globalVue.APP_chooseImage_uploading(globalVue.headPhoto);
    }else if(globalVue.chooseImg == 3){
      globalVue.workCardPhoto="data:image/jpeg;base64,"+ img;
      globalVue.APP_chooseImage_uploading(globalVue.workCardPhoto);
    }
  };
export default {
  data(){
    return{
      showDeliverList:"",
      userDeliveryList:[],
      deliveryAddressId:"",
      deliveryName:"",
      deliveryPhone:"",
      deliveryAddr:"",
      postData:{},
      deliveryAddressData:{},
      haveSotrageData:"",
      storePopVisible:false,
      area1:"",
      province1:"",
      city1:"",
      district1:"",
      storeId1:"",
      store1:"",
      area2:"",
      province2:"",
      city2:"",
      district2:"",
      storeId2:"",
      store2:"",
      province:"",
      city:"",
      district:"",
      distPopVisible:false,
      districtData:[],
      provinceBorder:false,
      cityBorder:false,
      type:1,
      businessId:"",
      doubleList:"",
      deliveryStoreList:[],
      noStores:false,
      images:{
        localId: [],
        serverId: [],
        urls:[]
      },
      str:{
        localId: [],
      },
      name:"",
      tel:"",
      card:"",
      postDataSpecification:"",
      cardImg:this.$cookies.get("cardIDImg"), //身份证照片
      headPhoto:this.$cookies.get("headPhotoImg"),
      workCardPhoto:this.$cookies.get("workCardPhotoImg"),
      chooseImg:0,
      card_picture_url:this.$cookies.get("cardIDImg"),
      card_picture_mediaIds:"",
      picture_url:this.$cookies.get("headPhotoImg"),
      picture_mediaIds:"",
      empCard_url:this.$cookies.get("workCardPhotoImg"),
      empCard_mediaIds:"",
      isRefering:false,
      isloading:false,
      browserName:this.$browserName,
    }
  },
  created(){
    dooolyAPP.initTitle('确认订单');
    this.getUserDelivery();
    globalVue = this;
  },
  beforeDestroy(){
    this.$cookies.remove("addressDataList");
  },
  computed:{
    ...mapState(["cardbuy"]),
    ...mapState(["deliveryAddress"]),
    referDisable: function () {
      if( this.postDataSpecification.indexOf("两店") > 0){
        if(this.province2 == "" || this.store2 == "" || this.province1 == ""|| this.store1 == "" || this.name == "" || this.tel == "" || this.card == ""  || this.card_picture_url == null || this.picture_url == null || this.empCard_url == null||this.isRefering){
          return false;
        }else {
          return true;
        }
      }
      else{
        if(this.province1 == ""|| this.store1 == "" || this.name == "" || this.tel == "" || this.card == "" || this.card_picture_url == null || this.picture_url == null || this.empCard_url == null || this.isRefering){
          return false
        }else {
          return true;
        }
      }
    },
    classObj: function () {
      if( this.postDataSpecification.indexOf("两店") > 0){
        if(this.province2 != "" && this.store2 != ""&& this.province1 != ""&& this.store1 != ""&& this.name != ""&& this.tel != ""&& this.card != ""&& this.card_picture_url != null && this.picture_url !=  null && this.empCard_url != null && !this.isRefering){
          return {
            dis_btn: false,
            click_btn: true
          }
        }else {
          return {
            dis_btn: true,
            click_btn: false
          }
        }
      }else{
        if(this.province1 != ""&& this.store1 != ""&& this.name != ""&& this.tel != ""&& this.card != ""&& this.card_picture_url != null && this.picture_url != null && this.empCard_url != null && !this.isRefering){
          return {
            dis_btn: false,
            click_btn: true
          }
        }else {
          return {
            dis_btn: true,
            click_btn: false
          }
        }
      }
    }
  },
  mounted(){
    this.postData=this.cardbuy;
    this.businessId=this.postData.merchantProduct[0].merchantId;
    this.postDataSpecification=this.postData.specification;
    this.deliveryAddressData=this.deliveryAddress;
    this.haveSotrageData=0;
    this.getUserDelivery();
  },
  methods:{
    getUserDelivery(){
      http({
          method: 'get',
          url: api.getUserDelivery,
      }).then((data) => {
        if(this.$cookies.get("addressDataList")){
          this.userDeliveryList.push(data.data.userDeliveryList[this.$cookies.get("addressDataList")]);
          this.deliveryAddressId=data.data.userDeliveryList[this.$cookies.get("addressDataList")].id;
          this.deliveryName=data.data.userDeliveryList[this.$cookies.get("addressDataList")].receiverName;
          this.deliveryPhone=data.data.userDeliveryList[this.$cookies.get("addressDataList")].receiverTelephone;
          this.deliveryAddr=data.data.userDeliveryList[this.$cookies.get("addressDataList")].province + data.data.userDeliveryList[this.$cookies.get("addressDataList")].city+ data.data.userDeliveryList[this.$cookies.get("addressDataList")].area+data.data.userDeliveryList[this.$cookies.get("addressDataList")].address;
        }else{
          this.userDeliveryList = data.data.userDeliveryList;
          this.deliveryAddressId=data.data.userDeliveryList[0].id;
          this.deliveryName=data.data.userDeliveryList[0].receiverName;
          this.deliveryPhone=data.data.userDeliveryList[0].receiverTelephone;
          this.deliveryAddr=data.data.userDeliveryList[0].province + data.data.userDeliveryList[0].city+ data.data.userDeliveryList[0].area+data.data.userDeliveryList[0].address;
        }
      });
    },
    link() {
      dooolyAPP.gotoJumpVue(this.$router,'/userDeliveryList');
    },
    //地区选择
    distpicker(disType){
      this.distPopVisible=true;
      this.districtData=ChineseDistricts[86];
      this.province="";
      this.city="";
      this.district="";
      this.provinceBorder=false;
      this.cityBorder=false;
      this.type=1;
      this.doubleList=disType;
      if(this.$browserName=='Chrome WebView'){
        RHNativeJS.visablePtrFrame(false);
      }
    },
    //选择门店
    store_list(doubleListType){
      this.doubleList=doubleListType;
      if(doubleListType==1 && this.area1==''){
        this.$toast("请先选择所在区域");
        return;
      }
      else if(doubleListType==2 && this.area2==''){
        this.$toast("请先选择所在区域");
        return;
      }
      let data={};
      data.businessId=this.businessId;
      if(doubleListType==1){
        data.province=this.province1;
        data.city=this.city1;
        data.area=this.district1;
      }
      else if(doubleListType==2){
        data.province=this.province2;
        data.city=this.city2;
        data.area=this.district2;
      }
      http({
        method: 'post',
        url: api.getDeliveryStoreList,
        data:data
      }).then((res) => {
        if(res.data.code=="1000"){
          this.deliveryStoreList=res.data.storeList;
          if(this.deliveryStoreList.length==0){
            this.noStores=true;
          }
          else{
            this.noStores=false;
          }
          this.storePopVisible=true;
          if(this.$browserName=='Chrome WebView'){
            RHNativeJS.visablePtrFrame(false);
          }
        }
        else{
          this.$toast("网络异常，请重试！");
        }
      });
    },
    hidde(){
      this.distPopVisible=false;
      this.storePopVisible=false;
      if(this.$browserName=='Chrome WebView'){
        RHNativeJS.visablePtrFrame(true);
      }
    },
    deleProvince(){
      this.province="";
      this.city="";
      this.provinceBorder=false;
      this.cityBorder=false;
      this.districtData=ChineseDistricts[86];
      this.type=1
    },
    deleCity(){
      this.city="";
      this.cityBorder=false;
      this.type=2;
    },
    selectCity(index,value){
      if(this.type==1){
        this.province=value;
        if(this.doubleList==1){
          this.province1=value;
        }
        else if(this.doubleList==2){
          this.province2=value;
        }
        if(this.province != ""){
          this.provinceBorder=true
        }
        this.type=2;
        this.districtData=ChineseDistricts[index];
      }
      else if(this.type==2){
        this.city=value;
        if(this.doubleList==1){
          this.city1=value;
        }
        else if(this.doubleList==2){
          this.city2=value;
        }
        if(this.city != ""){
          this.cityBorder=true
        }
        this.type=3;
        this.districtData=ChineseDistricts[index];
      }
      else if(this.type==3){
        this.district=value;
        if(this.doubleList==1){
          this.district1=value;
          this.area1=this.province+"、"+this.city+"、"+this.district;
        }
        else if(this.doubleList==2){
          this.district2=value;
          this.area2=this.province+"、"+this.city+"、"+this.district;
        }
        this.distPopVisible=false;
      }
    },
    //选择门店
    selectStore:function (storeId,storeName) {
      if(this.doubleList==1){
        this.store1=storeName;
        this.storeId1=storeId;
      }else if(this.doubleList==2){
        this.store2=storeName;
        this.storeId2=storeId;
      }
      this.storePopVisible=false;
    },
    //照片转二进制
    dataURLtoBlob:function(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    },
    //浏览器选择Id照片
    chooseIDImg(e) {
      let img=e.target.files[0];
      this.chooseImg=1;
      this.browserGetImgUrl(img);
    },
    //浏览器选择正面照
    chooseHeadImg(e) {
      let img=e.target.files[0];
      this.chooseImg=2;
      this.browserGetImgUrl(img);
    },
    //浏览器选择工作证照片
    chooseWorkCardImg(e) {
      let img=e.target.files[0];
      this.chooseImg=3;
      this.browserGetImgUrl(img);
    },
    browserGetImgUrl:function (img) {
      let reader =new FileReader();//创建读取文件的方法
      reader.readAsDataURL(img);//将文件已url的形式读入页面
      let that=this;
      reader.onload=function(e){
        let imgUrl=that.dataURLtoBlob(e.target.result);
        let formData = new FormData();
        formData.append("blobBin", imgUrl);
        http({
          method: 'post',
          url:api.appUploadImg+ "?token="+localStorage.token,
          data:formData,
          dataType: "text",
          type:'post',
          async: false,
          cache: false,
          contentType: false,
          processData: false,
        }).then((res) => {
          if(res.data.code==1000){
            if(that.chooseImg ==1){
              that.$cookies.set("cardIDImg",res.data.imageViewPath,"30MIN");
              that.cardImg=that.$cookies.get("cardIDImg");
              that.card_picture_url=that.$cookies.get("cardIDImg");
            }
            else if(that.chooseImg ==2){
              that.$cookies.set("headPhotoImg",res.data.imageViewPath,"30MIN");
              that.headPhoto=that.$cookies.get("headPhotoImg");
              that.picture_url=that.$cookies.get("headPhotoImg");
            }
            else if(that.chooseImg ==3){
              that.$cookies.set("workCardPhotoImg",res.data.imageViewPath,"30MIN");
              that.workCardPhoto=that.$cookies.get("workCardPhotoImg");
              that.empCard_url=that.$cookies.get("workCardPhotoImg");
            }
          }
        });
      };
    },
    //微信/app选择上传照片
    chooseImage:function (pictureView) {
      this.chooseImg=pictureView;
      dooolyAPP.photographNative('APP_chooseImage');
    },

    APP_chooseImage_uploading:function (img) {
        let blobBin = this.dataURLtoBlob(img);
        let formData = new FormData();
        formData.append("blobBin", blobBin);
        http({
          method: 'post',
          url:api.appUploadImg+ "?token="+localStorage.token,
          data:formData,
          dataType: "text",
          type:'post',
          async: false,
          cache: false,
          contentType: false,
          processData: false,
        }).then((res) => {
          if(res.data.code==1000){
            if(this.chooseImg ==1){
              this.$cookies.set("cardIDImg",res.data.imageViewPath,"30MIN");
              this.cardImg=this.$cookies.get("cardIDImg");
              this.card_picture_url=this.$cookies.get("cardIDImg");
            }
            else if(this.chooseImg ==2){
              this.$cookies.set("headPhotoImg",res.data.imageViewPath,"30MIN");
              this.headPhoto=this.$cookies.get("headPhotoImg");
              this.picture_url=this.$cookies.get("headPhotoImg");
            }
            else if(this.chooseImg ==3){
              this.$cookies.set("workCardPhotoImg",res.data.imageViewPath,"30MIN");
              this.workCardPhoto=this.$cookies.get("workCardPhotoImg");
              this.empCard_url=this.$cookies.get("workCardPhotoImg");
            }
          }
        });
      // }
    },

    //提交订单
    refer:function () {
      if(this.deliveryAddressId == ""){
        this.$toast("请选择收货地址");
        return;
      }
      let rg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
      if(!rg.test(this.name)){
        this.$toast("姓名只能输入数字、中文或字母");
        return;
      }
      if(checkMobile(this.tel)){
        this.$toast("手机号格式错误");
        return;
      }
      let pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(!pattern.test(this.card)){
        this.$toast("身份证号格式错误");
        return;
      }
      let distpicker2="";
      let store_name2="";

      if( this.postDataSpecification.indexOf("两店") > 0 ){
        distpicker2 = this.area2;
        store_name2 = this.store2;
      }else{
        distpicker2 = '';
        store_name2 = '';
      }
      if(this.card_picture_url==null){
        this.$toast("请选择身份证照片");
        return
      }
      if(this.picture_url==null){
        this.$toast("请选择正面照片");
        return
      }
      if(this.empCard_url==null){
        this.$toast("请选择工作证照片");
        return
      }
      let data = {
        'token':localStorage.token,
        'userId': localStorage.userId,
        'groupId': localStorage.groupId,
        'consigneeName':this.deliveryName,
        'consigneeMobile':this.deliveryPhone,
        'consigneeAddr':this.deliveryAddr,
        'productType':this.postData.productType,
        'orderExt':{
          'type':this.postData.productType,
          'applyCardArea1':this.area1,
          'applyCardStore1':this.store1,
          'applyCardArea2':distpicker2,
          'applyCardStore2':store_name2,
          'deliveryName':this.name,
          'deliveryTelephone':this.tel,
          'identityCard':this.card,
          'identityCardImage':this.card_picture_url,
          'applyCardImage':this.picture_url,
          'empCard':this.empCard_url
        },
        'merchantProduct':[{
          'merchantId':this.postData.merchantProduct[0].merchantId,
          'remarks':'',
          'productSku':[{
            'productType':this.postData.productType,
            'productId':this.postData.merchantProduct[0].productSku[0].productId,
            'skuId':this.postData.merchantProduct[0].productSku[0].skuId,
            'buyNum':1
          }],
        }],
        'redirectUrl': this.$allConfig.jumpDomain.cashier + 'cardBuyPayResult/'
      };
      this.isRefering=true;
      http({
        method: 'post',
        url:api.createOrder_v2_2,
        notNeedTransfer:true,
        data:data,
      }).then((res) => {
        this.isRefering=false;
        if(res.data.code==1000){
          let url='/cardBuyPay/'+res.data.data.orderNum;
          dooolyAPP.redirectPay(res.data.data.orderNum,'',res.data.data.zeroOrderFlag)
        }
        else if(res.data.code==2001){
          this.$toast("您有笔相同订单尚未支付，请勿重复提交，立即前往支付吧");
        }
        else if(data.code == 2002){
          this.$toast("您的身份证已在该门店购买过，请勿重复下单");
        }else{
          this.$toast("订单提交失败，请重试");
        }
      }).catch((error) => {
        this.isRefering=false;
      });
    },
  },
}
</script>

<style scoped>
.line_bold{
    width: 100%;
    height: 0.2rem;
    background: #f5f5f5;
}
.line_minute{
    width: 100%;
    height: 1px;
    background: #ececec;
}
input[type='button']{
    line-height: 100%;
}
a{
    text-decoration: none;
    color: #333;
}
#distpicker1.gray,#store_name1.gray,#distpicker2.gray,#store_name2.gray{
  color:#999;
}
/*地址*/
.top{
    width: 100%;
    height: 0.12rem;
    background: url(../../assets/images/userDelivery/order_top.png) 0 0;
    background-size: 100%;
}
header{
    background: #fff;
    padding: 0.4rem 0.3rem 0.3rem 0.3rem;
}
header .fl{
    font-size: 0.28rem;
    color:#333;
    width: 6.5rem;
}
header.add .fl{
    line-height: 0.78rem;
}
header .fr{
    font-size: 0;
    padding-top: 0.26rem;
}
header .fr img{
    width: 0.16rem;
}
header .fl span{
    display: inline-block;
    line-height: 100%;
}
header .fl .name{
    margin-bottom: 0.15rem;
}
header .fl .address{
    line-height: 120%;
}
header .fl .tel{
    font-size: 0.28rem;
    margin: 0;
    padding: 0;
}


/*主体表单部分*/
.main{
    background: #fff;
    padding:0 0.3rem;
}
.main .list_li{
    border-top: 1px solid #ececec;
    font-size: 0.28rem;
    color: #333;
}
.main .list_li:first-child{
    border: 0;
}
.main .list_li_minute{
    line-height: 0.97rem;
}
.main .option .fr{
    font-size: 0;
    line-height: 0;
    padding-top: 0.36rem;
}
.main .option .fr img{
    width: 0.16rem;
}
.main .list_li .center input{
    background: transparent;
    text-align: left;
    width: 5.44rem;
    outline: none;
    text-indent: 0.6rem;
    font-size: 0.28rem;
}
.main .option .center input{
    background: transparent;
    text-align: right;
    margin:0;
    margin-right: 0.3rem;
    width: 4.5rem;
}
.main .option .center span{
    display: inline-block;
    text-align: right;
    margin:0;
    margin-right: 0.3rem;
    width: 4.5rem;
    line-height: 120%;
    font-size: 0.28rem;
    overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:1;
}
.main .list_li_minute .fl:first-child{
    width: 1.42rem;
}
.main .picture{
    line-height: 100%;
}
.main .picture .fl:first-child{
    float:none;
    margin:0.38rem 0 0.3rem 0;
    width: auto;
}
.main .picture .fl:first-child span{
    font-size: 0.24rem;
    color: #999;
}
.main .picture .center{
    margin-bottom:0.3rem;
    width: 1.6rem;
    height: 1.6rem;
    background: #f5f5f5;
  font-size: 0;
}

.main .picture .center span{
    display: inline-block;
    width: 100%;
    font-size: 0.24rem;
    color: #999;
    margin-top: 0.93rem;
    text-align: center;
    line-height: 100%;
}
.main .picture .center img{
    width: 100%;
    height:100%;
}
.selectImgDiv{
  width: 100%; height: 100%; overflow: hidden; position: relative; margin-bottom: 0.3rem;
}
.showImgDiv{
  width: 1.6rem;height: 1.6rem
}
.pictureUpload{
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  z-index: 100;
  opacity: 0;
  left: 0;
  top: 0;
}


/*底部商品信息*/
.company{
    background: #fff;
}
.company .title{
    font-size: 0.24rem;
    color: #666;
    padding: 0.16rem 0.3rem 0.24rem 0.3rem;
    line-height: 100%;
    background: #f5f5f5;
}
.company .title span{
    display: inline-block;
    color: #ee3f44;
}
.company .picture_view{
    margin: 0 0.3rem;
    padding: 0.3rem 0;

}
.company .picture_view .picture{
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.2rem;
}
.company .picture_view .picture img{
    width: 100%;
    height: 100%;
}
.company .price{
    font-size: 0;
}
.company .price span{
    display: inline-block;
    line-height: 100%;
    color: #999;
    font-size: 0.24rem;
    margin-top: 0.2rem;
}
.company .price span:first-child{
    color: #333;
    font-size: 0.28rem;
    margin-top: 0.1rem;
}
.company .price span:last-child{
    color: #ee3f44;
    font-size: 0.28rem;
    margin-top: 0.46rem;
}
.company .freight{
    border-top: 1px solid #ececec;
    margin: 0 0.3rem;
}
.company .freight div{
    line-height: 0.98rem;
    font-size: 0.28rem;
    color: #333;
}

/*底部提交按钮*/
.footer_bg{
    width: 100%;
    height: 1rem;
}
footer{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 1rem;
    line-height: 1rem;
    border-top: 1px solid #ececec;
    font-size: 0.3rem;
    width: 100%;
    background: #fff;
}
footer div{
    height: 100%;
}
footer .fl{
    color: #333;
    padding-left: 0.3rem;
}
footer .fl span{
    color: #ee3f44;
}
footer .fr{
  width: 3rem;
  text-align: center;
  color: #fff;
}
footer .dis_btn{background: #999;}
footer .click_btn{
  background: #ee3f44;
}

/*门店选择列表*/
.store_list_bg{
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
}
.store_list_bg .store_list{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 8.9rem;
    width: 100%;
    background: #fff;
    font-size: 0.28rem;
    color: #333;
}
.store_list_bg .store_list .close{
    position: absolute;
    right: 0.4rem;
    top: 0.3rem;
    width: 0.2rem;
    height: 0.2rem;
}
.store_list_bg .store_list .close img{
    width: 100%;
}
.store_list_bg .store_list .title{
    text-align: center;
    margin-top: 0.26rem;
    line-height: 100%;
    margin-bottom: 0.48rem;
}
.store_list_bg .store_list .address{
    margin-bottom: 0.3rem;
    padding: 0 0.2rem;
    font-size: 0;
}
.store_list_bg .store_list .address span{
    font-size: 0.28rem;
}
.store_list_bg .store_list .address .check{
    color: #ee3f44;
}
.store_list_bg .store_list .address b{
    display: inline-block;
    height: 0.2rem;
    width: 0.02rem;
    background: #ccc;
    margin: 0 0.2rem;
}
.store_list_bg .store_list ul{
    height: 7.33rem;
    overflow: scroll;
}
.store_list_bg .store_list ul li{
    height: 1rem;
    line-height: 1rem;
    padding: 0 0.2rem;
    border-bottom: 1px solid #ececec;
}



.hidden{
  overflow: hidden;
  width:100%;
  height:100%;
}
.input_view{
  position: relative;
}
.input_view .input_delete{
  position: absolute;
  right: 0;
  top: 50%;
  height: 0.32rem!important;
  width: 0.32rem!important;
  font-size: 0!important;
  margin: 0!important;
  margin-top: -0.16rem!important;
  padding: 0!important;
  line-height: 100%!important;
}
.input_view .input_delete.lod{
  display: block;
}
.input_delete img{
  height: 100%!important;
  width: 100%!important;
}

.data_bg{
  z-index: 9999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}
.data_bg .data{
  position: fixed;
  left: 0;
  bottom: 0;
  height: 8.9rem;
  width: 100%;
  background: #fff;
  font-size: 0.28rem;
  color: #333;
}
.data_bg .data .close{
  position: absolute;
  right: 0.4rem;
  top: 0.3rem;
  width: 0.2rem;
  height: 0.2rem;
}
.data_bg .data .close img{
  width: 100%;
}
.data_bg .data .title{
  text-align: center;
  margin-top: 0.26rem;
  line-height: 100%;
  margin-bottom: 0.48rem;
}
.data_bg .data .address{
  margin-bottom: 0.3rem;
  padding: 0 0.2rem;
  font-size: 0;
}
.data_bg .data .address span{
  font-size: 0.28rem;
}
.data_bg .data .address .check{
  color: #ee3f44;
}
.data_bg .data .address b{
  display: inline-block;
  height: 0.2rem;
  width: 1px;
  background: #ccc;
  margin: 0 0.2rem;
}
.data_bg .data ul{
  height: 7.33rem;
  overflow: scroll;
}
.data_bg .data ul li{
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.2rem;
  border-top: 1px solid #ececec;
}
  .loading-div{
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.5);
    text-align: center;
    width: 2.9rem;
    height: 2.5rem;
    margin-top: 50%;
    margin-left: 30%;
    border-radius: 0.2rem;
  }
  .loading-div img{
    width: 1.35rem;
    margin-top: 0.6rem;
  }
</style>
