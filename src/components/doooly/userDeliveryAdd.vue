<template>
  <div v-if="loding">
    <form action="" method = 'post'>
      <div class="line_bold"></div>
      <div class="main">
        <!-- 姓名 -->
        <div class="list_li list_li_minute clearfix">
          <div class="fl">
            收件人
          </div>
          <div class="center fl input_view">
            <input v-model="addressDta.name" id="name" type="text" name="name" maxlength="10" placeholder="请输入姓名">
            <div v-if="cleanName" class="input_delete" @click="addressDta.name = ''"><img src="../../assets/images/userDelivery/input_delete.png"></div>
          </div>
        </div>

        <!-- 手机号 -->
        <div class="list_li list_li_minute clearfix">
          <div class="fl">
            手机号码
          </div>
          <div class="center fl input_view">
            <input v-model="addressDta.telephone" id="tel" type="text" name="telephone" maxlength="11" placeholder="请输入手机号">
            <div v-if="cleanMobile" class="input_delete" @click="addressDta.telephone=''"><img src="../../assets/images/userDelivery/input_delete.png"></div>
          </div>
        </div>

        <!-- 收货地址 -->
        <div class="list_li list_li_minute option clearfix" @click="distpicker()">
          <div class="fr">
            <img src="../../assets/images/userDelivery/right.png" alt="">
          </div>
          <div class="center fr">
            <span class="gray" v-if="receiverAddress ==''" id="distpicker">请选择区域</span>
            <span v-else>{{receiverAddress}}</span>
          </div>
          <div class="fl">
            省、市、区
          </div>
        </div>

        <!-- 详细地址 -->
        <div class="list_li list_li_minute clearfix">
          <div class="address fl">
            <textarea v-model="addressDta.address" @blur="fixTop()" id="address" name="address" cols="30" maxlength="50" rows="4" placeholder="请填写详细地址"></textarea>
          </div>
        </div>
      </div>

      <div class="footer_bg"></div>
      <footer  :class="classObj"  @click="refer()">确认保存</footer>
    </form>
    <div v-if="distPopVisible" class="data_bg">
      <div class="data">
        <div @click="hidde()" class="close">
          <img src="../../assets/images/userDelivery/address_close.png">
        </div>
        <div class="title">所在地区</div>
        <div class="address">
          <span @click="deleProvince()">{{selectedProvince}}</span>
          <b v-if="provinceBorder"></b>
          <span @click="deleCity()">{{selectedCity}}</span>
          <b v-if="cityBorder"></b>
          <span>{{selectedDistrict}}</span>
          <span class="check">请选择</span>
        </div>
        <ul>
          <li v-for="(item,index) in districtData" :key="index" @click="selectCity(index,item)">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/http/http'
import api from '@/assets/js/api.js';
import ChineseDistricts from '@/assets/js/address.js';
import {checkMobile} from '@/assets/js/verify.js';
export default {
  name: "userDeliveryAdd",
  data(){
    return{
      Addtype:this.$route.params.type,
      addressDta:{
        name:"",
        telephone:'',
        province:"",
        city:"",
        area:"",
        address:"",
        isDefault:'',
      },
      receiverAddress:"",
      distPopVisible:false,
      selectedProvince:"",
      selectedCity:"",
      selectedDistrict:"",
      districtData:[],
      provinceBorder:false,
      cityBorder:false,
      type:1,
      cityIndex:"",
      loding:false,
    }
  },
  beforeCreate(){
    document.body.style.backgroundColor="#f5f5f5";
  },
  beforeDestroy(){
    document.body.style.backgroundColor="";
  },
  created(){
    if(this.Addtype=="add"){
      initTitle('新增收货地址');
      this.loding = true;
    }else {
      initTitle('编辑收货地址');
      this.loadList();
    }
  },
  computed:{
    cleanName(){
      if(this.addressDta.name){
        return true;
      }else {
        return false;
      }
    },
    cleanMobile(){
      if(this.addressDta.telephone){
        return true;
      }else {
        return false;
      }
    },
    classObj(){
      if (this.addressDta.name && this.addressDta.telephone && this.receiverAddress && this.addressDta.address){
        return {
          refer: true
        }
      }else{
        return {
          refer: false
        }
      }
    }
  },
  methods:{
    fixTop(){
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    },
    //选择地址
    distpicker(){
      this.distPopVisible=true;
      this.districtData = ChineseDistricts[86];
      this.selectedProvince="";
      this.selectedCity="";
      this.selectedDistrict="";
      this.provinceBorder=false;
      this.cityBorder=false;
      this.type=1;
      if(browserName=='Chrome WebView'){
        RHNativeJS.visablePtrFrame(false);
      }
    },
    hidde(){
      this.distPopVisible=false;
      if(browserName=='Chrome WebView'){
        RHNativeJS.visablePtrFrame(false);
      }
    },
    deleProvince(){
      this.selectedProvince="";
      this.selectedCity="";
      this.provinceBorder=false;
      this.cityBorder=false;
      this.districtData=ChineseDistricts[86];
      this.type=1
    },
    deleCity(){
      this.selectedCity="";
      this.cityBorder=false;
      this.type=2;
      this.districtData=ChineseDistricts[this.cityIndex];
    },
    selectCity(index,value){
      if(this.type==1){
        this.selectedProvince=value;
        if(this.selectedProvince != ""){
          this.provinceBorder=true
        }
        this.type=2;
        this.cityIndex=index;
        this.districtData=ChineseDistricts[index];
      }
      else if(this.type==2){
        this.selectedCity=value;
        if(this.selectedCity != ""){
          this.cityBorder=true
        }
        this.type=3;
        this.districtData=ChineseDistricts[index];
      }
      else if(this.type==3){
        this.selectedDistrict=value;
        this.addressDta.province=this.selectedProvince;
        this.addressDta.city=this.selectedCity;
        this.addressDta.area=this.selectedDistrict;
        this.receiverAddress=this.selectedProvince+"、"+this.selectedCity+"、"+this.selectedDistrict;
        this.distPopVisible=false;
      }
    },
    loadList(){
      http({
        method: 'get',
        url: api.userDeliveryList+"?token="+localStorage.token
      }).then((res) => {
        this.loding = true;
        let data = res.data.userDeliveryList[this.Addtype];
        this.addressDta = {
          name:data.receiverName,
          telephone:data.receiverTelephone,
          province:data.province,
          city:data.city,
          area:data.area,
          address:data.address,
          isDefault:data.isDefault,
          id:data.id,
        };
        this.receiverAddress=data.province+"、"+data.city+"、"+data.area;
      })
    },
    //保存地址
    refer(){
      if (!this.addressDta.name) {
        this.$toast("请输入姓名");
        return;
      }
      if (!this.receiverAddress) {
        this.$toast("请选择收货区域");
        return;
      }
      if(checkMobile(this.addressDta.telephone)){
        this.$toast("手机号格式错误");
        return;
      }
      if (!this.receiverAddress) {
        this.$toast("请选择收货区域");
        return;
      }
      if (!this.addressDta.address) {
        this.$toast("请输入收货地址");
        return;
      }
      http({
        method: 'post',
        url: api.saveDeliveryAddr+"?token="+localStorage.token,
        data:this.addressDta,
      }).then((res) => {
        if(res.data.code=="1000"){
          this.$toast("保存成功");
          dooolyAPP.goBackPageIndex(1);
        }
      });
    },
  }
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
  #distpicker.gray{
    color:#999;
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
    margin-left: 0.6rem;
    width:  4.84rem;
    outline: none;
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
  .main .list_li .address{
    width: 100%!important;
    padding: 0.36rem 0;
  }
  .main .list_li .address textarea{
    width: 100%;
    border: 0;
    height: 0.88rem;
    line-height: normal;
    resize:none;
    outline: none;
    font-size: 0.28rem;
  }

  /*底部提交按钮*/
  .footer_bg{
    width: 100%;
    height: 0.98rem;
  }
  footer{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 0.98rem;
    line-height: 0.98rem;
    font-size: 0.3rem;
    width: 100%;
    background: #ccc;
    color: #fff;
    text-align: center;
  }
  footer.refer{
    background: #ee3f44;
    color: #fff;
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
</style>
