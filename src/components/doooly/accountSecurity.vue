<template>
  <div class="personalInfo">
    <section>
      <div class="info_header">
        <div v-if="userType==0">
          <img v-if="displayUrl=='' || displayUrl==undefined" src="../../../src/assets/images/personalCenter/accountSecurity/no_infor.png" />
          <img v-else :src="displayUrl">
        </div>
        <div v-if="userType==1">
          <img v-if="backgroundUrl==''|| backgroundUrl==undefined" src="../../../src/assets/images/personalCenter/accountSecurity/no_infor.png" />
          <img v-else :src="backgroundUrl">
        </div>
      </div>
    </section>
    <div class="list">
      <ul style="padding: 0 0.3rem;">
        <li class="header_div">
          <span>头像</span>
          <div class="fr">
            <img v-if="appHeadImageUrl==''|| appHeadImageUrl==undefined" :src="logoUrl" />
            <img v-else :src="appHeadImageUrl" />
          </div>
        </li>
        <li @click="dial_phone()">
          <span>姓名</span>
          <span class="fr right">
            <span>{{name}}</span>
          </span>
        </li>
        <li @click='moble_phone()'>
          <span>手机号</span>
          <span class="fr right">
            <span>{{telephone}}</span>
          </span>
        </li>
        <li v-if="userType==1" @click="relation()">
          <span>亲友关系</span>
          <span class="fr right">
            <input id="selectFamilyType" type="text" disabled="disabled" v-model="relationText">
          </span>
        </li>
        <li @click="dial_phone()">
          <span>所属企业</span>
          <span class="fr right">
            <span>{{groupName}}</span>
          </span>
        </li>
        <li @click="dial_phone()">
          <span>企业部门</span>
          <span class="fr right">
            <span>{{departmentName}}</span>
          </span>
        </li>
        <li @click="sexBtn()">
          <span>性别</span>
          <span class="fr right">
            <span>{{sexText}}</span>
          </span>
        </li>
        <li @click="open('datePicker')">
          <span>生日</span>
          <span class="fr right">
            <input id="selectBirthday" type="text" disabled="disabled" v-model="birthday">
          </span>
        </li>
      </ul>
    </div>
    <div class="footer_div">
      <input type="button" v-show="dahuaShow" value="退出登录" @click='quitBtn()'>
    </div>
    <div v-if="popupVisible" class="pickerCover">
      <div v-if="relationVisible" class="picker-div">
        <div>
          <input type="button" value="取消" class="" @click="cancelRelation()">
          <input type="button" value="确定" class="" @click="selectRelation()">
        </div>
        <mt-picker :slots="relationSlots" @change="onRelationChange" :visible-item-count="5" valueKey="relationType"></mt-picker>
      </div>
      <div v-if="genderVisible" class="gender_div">
        <div class="chooseGender">
          <input type="button" value="男" @click="selectMan()">
          <input type="button" value="女" @click="selectWoman()">
        </div>
        <input class="cancel" type="button" value="取消" @click="cancelSex()">
      </div>
    </div>
    <div  v-if="resetInfoVisible" class="dailResult">
      <div class="model_div">
        <div class="resultTxt">
          <p>信息修改需要工会审核。你可以拨打客服电话400-158-2212({{serviceTime}})</p>
        </div>
        <div class="button_div">
          <button type="button" class="btn_primary" @click="close_btn()">取消</button>
          <a href="tel:400-158-2212" class="btn_primary" id="btn_yes">立即拨打</a>
        </div>
      </div>
    </div>
    <div  v-if="resetInfoVisibleAPP" class="dailResult">
      <div class="model_div">
        <div class="resultTxt">
          <p>信息修改需要工会审核。你可以拨打客服电话400-158-2212({{serviceTime}})</p>
        </div>
        <div class="button_div">
          <button type="button" class="btn_primary" @click="resetInfoVisibleAPP = false">取消</button>
          <button class="btn_primary" @click="dial_phone_app()" id="btn_yes">立即拨打</button>
        </div>
      </div>
    </div>
    <div @touchmove.prevent>
      <mt-datetime-picker
        ref="datePicker"
        type="date"
        :startDate="startDate"
        :endDate="endDate"
        @confirm="handleChange"
      >
      </mt-datetime-picker>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js'
  import api from '@/assets/js/api.js';
  export default {
    name: "accountSecurity",
    data (){
      return {
        userType:"",
        displayUrl:"",
        backgroundUrl:"",
        appHeadImageUrl:"",
        logoUrl:"",
        name:"",
        telephone:"",
        popupVisible: false,
        genderVisible:false,
        relationVisible:false,
        resetInfoVisibleAPP:false,
        relationPicker:"",
        familyRelation:0,
        familyRelationTemp:"",
        relationText:"",
        relationTextTemp:"",
        relationSlots:[
          {
            values: [
              {"id":1, "relationType":'夫妻'},
              {"id":2, "relationType":'子女'},
              {"id":3, "relationType":'父母'},
              {"id":4, "relationType":'亲戚'},
              {"id":5, "relationType":'朋友'},
              {"id":6, "relationType":'其他'}
            ]
          }],
        groupName:"",
        departmentName:"",
        birthday: '',
        birthDateValue:"",
        startDate: new Date('1950-01-01'),
        endDate: new Date(),
        sex:"",
        sexText:"",
        resetInfoVisible:false,
        companyType:"",
        serviceTime:dooolyConfig.serviceTime,
        dahuaShow:(localStorage.thirdUserToken && browserName != 'WeChat'? false : true ),
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#f5f5f5";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      initTitle('个人信息','')
    },
    mounted:function(){
      const userId=this.$route.params.userid;
      http({
        method: 'get',
        url: api.accountSecurityPage+"?member="+userId,
      }).then((res) => {
        var adUserConn=res.data.adUserConn;
        if(adUserConn != undefined){
          this.userType=res.data.adUserConn.userType;
          this.displayUrl=res.data.adUserConn.displayUrl;
          this.backgroundUrl=res.data.adUserConn.backgroundUrl;
          this.appHeadImageUrl=res.data.adUserConn.appHeadImageUrl;
          this.logoUrl=res.data.adUserConn.logoUrl;
          this.name=res.data.adUserConn.name;
          if(this.name=="" ||this.name==undefined ){this.name="未填"}
          this.telephone=res.data.adUserConn.telephone;
          if(this.telephone==""||this.telephone==undefined){this.telephone="未填"}
          this.familyRelation=res.data.adUserConn.familyRelation;
          if(this.familyRelation==""||this.familyRelation==undefined){
            this.relationText="未选择";
            this.relationSlots[0].defaultIndex=0;
          }
          else{
            this.relationText=this.relationSlots[0].values[this.familyRelation-1].relationType;
            this.relationSlots[0].defaultIndex=this.familyRelation-1;
          }
          this.groupName=res.data.adUserConn.groupName;
          if(this.groupName=="" || this.groupName==undefined){this.groupName="未填"}
          this.departmentName=res.data.adUserConn.departmentName;
          if(this.departmentName==""|| this.departmentName==undefined){
            this.departmentName="未填"
          }
          this.sex=res.data.adUserConn.sex;
          this.sexText=this.sex=="0"?"男":(this.sex=="1"?"女":"未填");
          this.birthday=res.data.adUserConn.birthday;
          this.birthDateValue=this.birthday;
          if(this.birthday==""||this.birthday==undefined){this.birthday="未填";this.birthDateValue=""}
          this.companyType=res.data.type;
        }
      });
    },
    methods: {
      //家属关系
      relation:function () {
        this.popupVisible=true;
        this.relationVisible=true;
      },
      onRelationChange:function(picker, values){
        this.relationTextTemp=values[0].relationType;
        this.familyRelationTemp=values[0].id;
      },
      cancelRelation(){
        this.popupVisible = false;
        this.relationVisible=false;
      },
      selectRelation: function () {
        this.popupVisible = false;
        this.relationVisible=false;
        http({
          method: 'post',
          url: api.updatePersonalData+"?familyRelation="+this.familyRelationTemp,
        }).then((res) => {
          if(res.data.code == "1000"){
            this.familyRelation=this.familyRelationTemp;
            this.relationText=this.relationTextTemp;
            this.relationSlots[0].defaultIndex = this.familyRelation-1;
          } else {
            this.$toast("出错了");
          }
        })

      },
      //拨打电话修改个人信息
      dial_phone(){
        if(browserName == "otherAPPAndroid"){
          RHNativeJS.callPhone('4001582212');
        }else if(browserName == "otherAPPIos"){
          this.resetInfoVisibleAPP=true;
        }else{
          this.resetInfoVisible=true;
        }
      },
      //app拨打电话
      dial_phone_app(){
        if(browserName == "otherAPPIos"){
          window.webkit.messageHandlers.callPhone.postMessage('400-158-2212');
        }
      },
      //取消按钮
      close_btn(){
        this.resetInfoVisible=false;
      },
      //修改手机号
      moble_phone(){
        this.$router.push({path:"/modifyMobile"});
      },
      //选择性别
      sexBtn(){
        this.popupVisible=true;
        this.genderVisible=true;
      },
      selectMan: function () {
        http({
          method: 'post',
          url: api.updatePersonalData+"?sex=0",
        }).then((res) => {
          this.cancelSex();
          if(res.data.code == "1000"){
            this.sex = '0';
            this.sexText = '男';
          } else {
            this.$toast("出错了");
          }
        }).catch((error) => {
          this.cancelSex();
        });
      },
      selectWoman: function () {
        http({
          method: 'post',
          url: api.updatePersonalData+"?sex=1",
        }).then((res) => {
          this.cancelSex();
          if(res.data.code == "1000"){
            this.sex = '1';
            this.sexText = '女';
          } else {
            this.$toast("出错了");
          }
        }).catch((error) => {
          this.cancelSex();
        });
      }
      ,
      cancelSex(){
        this.popupVisible=false;
        this.genderVisible=false;
      }
      ,
      add0(m) {
        return m<10?'0'+m:m
      },
      //选择生日
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        let birth = value.getFullYear()+"-"+this.add0(value.getMonth()+1)+"-"+this.add0(value.getDate());
        http({
          method: 'post',
          url: api.updatePersonalData+"?birthday="+birth,
        }).then((res) => {
          if(res.data.code == "1000"){
            this.birthday = birth;
          } else {
            this.$toast("出错了");
          }
        }).catch((error) => {
          this.cancelSex();
        });
      },
      //退出登录
      quitBtn(){
        http({
          method: 'post',
          url: api.logout,
          headers: {
            appSource: 'H5',//渠道
            deviceId: getDeviceId() == 'undefined' ? getDeviceId() : localStorage.userId,//设备id
            userId:localStorage.userId,
          }
        }).then((res) => {
          var code=res.data.code;
          if(code=="1000"){
            dooolyAPP.logOut();
          }
        })
      }
    }
  }
</script>

<style scoped>
  .personalInfo{background: #f7f7f8; padding-bottom:1rem}
  /* 完善个人资料头部 */
  .info_header{width: 100%;height:3.6rem; position: relative; text-align: center;font-size:0.3rem;color: #323232;}
  .head_top{width: 100%;height: 1rem; position: absolute;top:0; left:0; right:0; bottom:0; margin: auto}
  .head_top p{color: white; font-size: 0.3rem}
  .head_top p span{color: white; font-size: 0.4rem}
  .info_header img{width: 100%;height:3.6rem; }

  /* 完善个人资料列表 */
  .list{width:100%; background: #fff; text-align: left;margin-top:0.1rem;overflow: hidden;}
  .list li{text-decoration: none;width:100%;height:1.2rem;line-height:1.2rem;color: #a0a0a0;
    border-bottom:1px solid #ececec;font-size:0.3rem;overflow: hidden;}
  .list .header_div{height:1.4rem;line-height:1.4rem;}
  .list .header_div img{width:1.03rem; height:1.03rem; border-radius: 50%;border:0.01rem solid #a0a0a0;}
  .list li:last-child{border-bottom: none;}
  .list li span{color: #323232;font-size:0.3rem; vertical-align: middle;line-height:1.2rem;}
  .list li img{width:0.45rem;vertical-align: middle;line-height:1.2rem;}
  .list li input{text-align: right;font-size: 0.3rem;vertical-align: middle; line-height: 1.1rem;color:#999;}
  .list li .fr{float:right}
  .list li .right{ text-align:right}
  .list li .right #selectFamilyType,.list li .right #selectBirthday{
    color:#999;opacity:1;-webkit-text-fill-color:#999;-webkit-opacity:1;background-color: #fff
  }
  .list li .right span{
    color:#999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 4rem;
    display: inline-block;
  }
  .list li .right img{width:0.22rem;}
  .footer_div{position: fixed;left: 0;bottom: 0;width: 100%;z-index: 1010;background: #ee3f44;
    font-size: 0.3rem;color: #fff;}
  .footer_div input[type=button]{width: 100%;height:0.98rem;background: #ee3f44;color: #fff;font-size: 0.32rem;}
  /*性别*/
  .pickerCover{position: fixed;left: 0;top: 0; width: 100%;height: 100%;background:rgba(0,0,0,0.4);z-index: 9999;}
  .gender_div,.picker-div{position: fixed;bottom:0; z-index: 10000;font-size: 0;}
  .gender_div{width: 7.1rem;left:0;right: 0; margin:0 auto; padding-bottom: 0.2rem;}
  .gender_div input[type=button]{width: 100%; height:1.14rem; font-size: 0.4rem; color:#157efb;}
  .chooseGender{background-color: #fff; border-radius: 0.3rem}
  .chooseGender input[type=button]{border-bottom: solid 1px #a0a0a0; background-color: transparent}
  .cancel{margin-top: 0.16rem; border-radius: 0.3rem; background-color: #fff}
  .picker-div{width: 100%;background-color: #fff}
  .picker-div input[type=button]{height: 40px; padding: 10px;width: 50%; background-color: #fff;font-size:0.3rem;color:#1971c8;}

  .dailResult {position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 1050;overflow: hidden;
    -webkit-overflow-scrolling: touch;outline: 0;background-color: rgba(0,0,0,0.75);filter: alpha(opacity=90);
  }
  .model_div{width: 6rem; text-align: center;background: #fff; position: absolute;
    z-index: 1060;border-radius: 0.1rem;top: 20%;left: 50%;margin-left: -3rem;}
  .resultTxt{margin: 0 0.3rem;}
  .resultTxt p{color: #000;font-size: 0.3rem;margin: 0.3rem 0;text-align: left;word-break: break-all;}
  .button_div{width:100%;}
  .button_div .btn_primary{width:50%;float:left; font-size:0.3rem;padding:0.3rem 0; color:#1971c8;
    border:none; border-top:1px solid #ddd;background-color: #fff;
    border-bottom-left-radius: 0.1rem;
    border-bottom-right-radius: 0.1rem;}
  .button_div .btn_primary:first-child{border-right:1px solid #ddd;}
</style>
