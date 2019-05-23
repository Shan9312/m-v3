<template>
    <div class="view">
        <!-- 话费充值 -->
        <div class="charge tab_list">
            <!-- <div class="input input_view">
                <input data-role="none" type="tel" placeholder="请输入集享卡账号" v-model="mobile" maxlength="13">
                <div class="operator">
                    {{operator}}
                </div>
                <div @click="mobile = ''" class="input_delete" v-show="mobile"><img src="../../../assets/images/recharge/input_delete.png"></div>
            </div> -->
            <!-- div  -->
            <div class="header-title">兑换集享积分<span>（在兜礼兑换集享卡积分比例为：1:100）</span></div>
            <ul>
                <li v-for="(item,index) in list.sku_list" :class="{check:newMobile.length == 11,click:click == index && newMobile.length == 11}" @click="checklist(index,item.price)">
                    {{item.specification}}
                </li>
            </ul> 
            <div class="hint">
                <div class="title">兑换使用说明</div>
                1、首次兑换时需要绑定集享卡账号；<br>
                2、绑定的集享卡账号将从兜礼会员账号中扣减兜礼积分；<br>
                3、兑换的集享卡积分有效期至次年12月31日。
            </div>
        </div>
        <div class="toast footer_toast" >
            <span @click="first_card_show = !first_card_show">使用流程</span>&nbsp;&nbsp;&nbsp;&nbsp;<span @click="helpCenter">常见问题</span>
        </div>
        <div class="first_card" v-show="first_card_show">
            <div class="close" @click="first_card_show = !first_card_show"></div>
            <img src="../../../assets/images/activity/family.png">
            <div class="first_card_button" @click="first_card_show = !first_card_show"></div>
        </div>
        <div class="footer_bg"></div>
        <footer>
            <div class="integral"> 合计：<span style="color:#ee3f44;">{{integral}}</span></div>
            <div class="button" :class="{check:newMobile.length == 11 && click != -1}" @click="recharge_refer()">立即兑换</div>
        </footer>
    </div>
</template>
<script>
import api from '@/assets/js/api.js';
import http from '@/http/http.js';
import {checkMobile,checkOperator} from '@/assets/js/verify.js';
export default{
    name:'family-recharge',
    components:{
        api,
    },
    data (){
        return {
            mobile:localStorage.mobile.substring(0,3)+' '+ localStorage.mobile.substring(3,7)+' '+localStorage.mobile.substring(7,11),//手机号展示
            newMobile:localStorage.mobile,//手机号去空格
            operator:'',//运营商
            list:{
            },
            click:-1,
            integral: 0.00,
            first_card_show:false,
            orderNum:'',
            firstBindQuery:false
        }
    },
    created(){
        document.body.style.backgroundColor="";
        initTitle('集享积分兑换','');
        this.getList();
        http({
            method: 'post',
            url: api.nexusBindQuery,
            data:{
                userId:localStorage.userId
            }
        }).then((data) => {
            if(data.data.code == 1000){
                this.firstBindQuery = true;
                this.first_card_show = true;
            }else{
                this.firstBindQuery = false;
            }
        })
    },
    watch :{
        mobile(newValue, oldValue) {
            if (newValue.length > oldValue.length) {
             if (newValue.length == 3 || newValue.length == 8) {
                this.mobile += ' '
             }
            } else {
             if (newValue.length == 9 || newValue.length == 4) {
                this.mobile = this.mobile.trim()
             }
            }
            this.newMobile = this.mobile.replace(/\s+/g,"");
            if(this.newMobile.length == 11){

            }else{
                this.operator = '';
                this.discountsDateshow = true;
                this.click = -1;
                this.integral = 0;
            };
        },
        first_card_show(newValue, oldValue){
          if(browserName=='Chrome WebView'){
            if(newValue){
              RHNativeJS.visablePtrFrame("false");
            }else{
              RHNativeJS.visablePtrFrame("true");
            }
          }
        }
    },
    mounted (){
    },
    methods:{
        getList(){
            http({
                method: 'post',
                url: api.nexusProductInfo,
                data:{
                    userId:localStorage.userId
                }
            }).then((data) => {
                this.list = data.data;
            })
        },
        checklist(index,price){
            if(this.newMobile.length != 11){
                return;
            }
            this.click = index;
            this.integral = price;
        },
        helpCenter(){
            dooolyAPP.gotoJumpVue.call(this,'/familyHelpCenter');
        },
        recharge_refer(id){
            if(this.newMobile.length != 11 || this.click == -1){
                return;
            }
            if(checkMobile(this.newMobile)){
                this.$toast('请输入正确手机号码');
                return;
            }
            http({
                method: 'post',
                url: api.createOrder_v2_2,
                notNeedTransfer:true,
                // data:{
                //     'phoneNumber':this.newMobile,
                //     'cardno':"",
                //     'merchantId':this.list.merchant_id,
                //     'productId':this.list.product_id,
                //     'skuId':this.list.sku_list[this.click].id,
                //     'productType':9
                // },
                data: {
                    'userId': localStorage.userId,
                    'groupId': localStorage.groupId,
                    'merchantProduct': [
                        {
                            'merchantId': this.list.merchant_id,
                            'remarks': '',
                            'productSku':[{
                                'productId': this.list.product_id,
                                'skuId': this.list.sku_list[this.click].id,
                                'buyNum': 1
                            }],
                        }
                    ],
                    'consigneeMobile': this.newMobile,
                    'cardno': '',
                    'productType': 9
                }
            }).then((data) => {
                this.orderNum = data.data.data.orderNum;
                if(data.data.code == 1000){
                    if(this.firstBindQuery){
                        if(window.location.href.indexOf('pre_dist') > 0 ||window.location.href.indexOf('pro_dist') > 0){
                            dooolyAPP.gotoJumpJq.call(this,'http://api.maxxipoint.com/NexusService/auth.do?response_type=token&client_id=74D33C18BF3811B2&redirect_uri='+encodeURIComponent(api.baseURL)+'dist%2f%23%2ffamilyTo%2f'+this.orderNum+'&status=199210219');
                        }else{
                            dooolyAPP.gotoJumpJq.call(this,'http://app-uat.maxxipoint.com/NexusService/auth.do?response_type=token&client_id=844AB181D6878FF9&redirect_uri='+encodeURIComponent(api.baseURL)+'dist%2f%23%2ffamilyTo%2f'+this.orderNum+'&status=199210219');
                        }
                    }else{
                        dooolyAPP.redirectPay(this.orderNum)
                    }
                }else if(data.data.code == 3003){
                    this.$toast(data.data.msg);
                }else if(data.data.code == 3001){
                    this.$toast(data.data.msg);
                }else{
                    this.$toast('小兜兜正忙,请稍候重试!');
                }
            }).catch(err => {
                this.click = -1;
            })
        },
    },
}
</script>
<style scoped>
/*头部*/
.header-title{
   font-size: 0.28rem;
   color: #333;
   text-align: center; 
   padding-top: 0.4rem;
   font-family: 'PingFangSC-Regular';
}
.header-title >span{
  color: #999;
}
.input_delete img {
  height: 100%!important;
  width: 100%!important;
}
input{
  outline: none;
}
ul{
  font-size: 0;
}
/*list公用*/
.tab_list{
  background: #fff;
}
.tab_list .input{
  height: 1.2rem;
  padding: 0 0.3rem;
  font-size: 0;
  border-bottom: 1px solid #ececec;
}
.tab_list .input input{
  height: 100%;
  width: 100%;
  color: #333;
  font-size: 0.4rem;
}
.tab_list .input .operator{
  position: absolute;
  left: 0.3rem;
  top: 0.84rem;
  font-size: 0.24rem;
  color: #ee3f44;
}
.tab_list ul{
  padding: 0.4rem 0.12rem;
}
.tab_list ul li{
  display: inline-block;
  width: 2.15rem;
  height: 1.2rem;
  line-height: 1.2rem;
  border: 1px solid #ccc;
  -webkit-border-radius: 0.1rem;
  border-radius: 0.1rem;
  margin: 0.11rem;
  font-size: 0.32rem;
  color: #999;
  text-align: center;
}
.tab_list ul li.check{
  color: #ee3f44;
  border-color: #ee3f44;
}
.tab_list ul li.click{
  color: #fff;
  background: #ee3f44;
}
.tab_list ul li span{
  display: inline-block;
  line-height: 100%;
}
.tab_list .hint{
  padding: 0.3rem;
}
.quota_div {
  background: #fcf6d4;
  color: #ff6600;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  font-size: 0.24rem;
  line-height: 0.6rem;
}
footer{
    position: fixed;
    left: 0;
    bottom: 0;
    text-align: center;
    width: 100%;
    line-height: 1rem;
    font-size: 0.3rem;
    z-index: 100;
    display: flex;
    box-shadow: 1px 0px 1px 0px #CCCCCC;
    background: #fff;
}
.integral{
    width: 60%;
    text-indent: 0.3rem;
    text-align: left;
}
.integral span{
    color: #ee3f44;
}
.button{
    width: 40%;
    text-align: center;
    background: #ccc;
    color: #fff;
}
.button.check{
    background: #ee3f44;
    color: #fff;
}
.footer_bg{
    width: 100%;
    height: 1rem;
}
/*话费充值*/
.charge{
    display: block;
}
.charge .hint{
    font-size: 0.24rem;
    line-height: 0.4rem;
    color: #999;
    background: #fff;
}
.charge .hint .title{
    font-size: 0.24rem;
    color: #666;
    margin-bottom: 0.1rem;
}
.charge ul li span:first-child{
    font-size: 0.32rem;
    margin-top: 0.24rem;
}
.charge ul li span:last-child{
    font-size: 0.24rem;
}

/*更改公用样式*/
.tab_list .input_view .input_delete{
    height: 0.4rem!important;
    width: 0.4rem!important;
    right: 0.3rem;
}
.toast{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 0.26rem;
    color: #ee3f44;
    padding: 0.1rem 0;
    padding-bottom: 1.2rem;
    font-size: 0.24rem;
}
/*使用流程*/
.first_card{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width:100%;
    font-size: 0;
    background: rgba(0,0,0,0.5);
    overflow: scroll;
    z-index: 9999;
}
.first_card .close{
    position: absolute;
    top: 1.4rem;
    right: 0.8rem;
    width: 0.6rem;
    height: 0.6rem;
}
.first_card img{
    width: 100%;
}
.first_card_button{
    position: absolute;
    left: 25%;
    top: 25.5rem;
    width: 50%;
    height: 1.2rem;
    text-align: center;
    z-index: 102;
    font-size: 0;
}
</style>
