<template>
    <div class="view">
        <div class="novice" @click="finish" @touchmove.prevent v-show="novice == 1">
          <img src="../../../assets/images/equities/novice3.png" >
        </div>
        <header v-show="!first_card_show">
            <ul>
                <li v-for="(data,index) in tab_list" :key="index" @click="tab_change(index)" :class="{check: index == tab_number}">{{data.title}}</li>
            </ul>
        </header>

        <!-- 话费充值 -->
        <div class="charge tab_list" v-show="tab_number == '0'">
            <div class="input input_view">
                <input data-role="none" type="tel" placeholder="请输入手机号码" v-model="mobile" maxlength="13">
                <div class="operator">
                    {{operator}}
                </div>
                <div @click="mobile = ''" class="input_delete" v-show="mobile"><img src="../../../assets/images/recharge/input_delete.png"></div>
            </div>
            <ul>
                <li v-for="(list,index) in charge_list" class="check" @click="pirce_check(list.id,list.price,1)" v-show="operator !=''">
                    <span>{{list.specification}}</span><br>
                    <span>售价{{list.price}}元</span>
                </li>
                <li v-for="(list,index) in charge_list" @click="pirce_check(list.id,list.price,1)" v-show="operator ==''">
                    {{list.specification}}
                </li>
            </ul>
            <div class="coupon_div_bg" v-show="isCoupon">
            <div class="coupon_div">
              <div class="coupon_fl">抵扣券</div>
              <div class="coupon_fr" v-show="isCoupon_yes" @click="jumpMyCoupon()"><span>{{couponNum}}</span>张可用<div class="img_div"><img src="../../../../src/assets/images/personalCenter/rightArrow.png"></div></div>
              <div class="coupon_fr isCoupon_no_color" v-show="isCoupon_no">暂无可用<div class="img_div"></div></div>
            </div> 
            </div><!-- 显示抵扣券张数 end -->
            <div class="coupon_div_bg" v-show="isCoupon_Num">
            <div class="coupon_div">
              <div class="coupon_fl">抵扣券<span>(已选1张)</span></div>
              <div class="coupon_fr" v-show="isCoupon_yes" @click="jumpMyCoupon()">￥<span>{{couponMoney}}</span><div class="img_div"></div></div>
              <div class="coupon_fr isCoupon_no_color" v-show="isCoupon_no">暂无可用<div class="img_div"></div></div>
            </div>
            </div><!-- 显示抵扣券张数 end -->
            <div class="hint">
                <div class="title">充值使用说明</div>
                1、话费充值到账时间为5-20分钟<br>
                2、月初月末为充值高峰，话费到账可能会延迟或者失败，建议错时充值<br>
                3、{{charge_text}}
            </div>
        </div>
        <!-- 流量充值 -->
        <div class="rateOfFlow tab_list" v-show="tab_number == '1'">
            <div class="input input_view">
                <input data-role="none" type="tel" placeholder="请输入手机号码" v-model="mobile"  maxlength="13">
                <div class="operator">
                    {{operator}}
                </div>
                <div @click="mobile = ''" class="input_delete" v-show="mobile"><img src="../../../assets/images/recharge/input_delete.png"></div>
            </div>
            <ul>
                <li v-for="(list,index) in rateOfFlow_list" class="check" @click="pirce_check(list.id,list.price,2)" v-show="operator !=''">
                    <span>{{list.specification}}</span><br>
                    <span>售价{{list.price}}元</span><br>
                    <span>全国当月有效</span>
                </li>
                <li v-for="(list,index) in rateOfFlow_list"  @click="pirce_check(list.id,list.price,2)" v-show="operator ==''">
                    {{list.specification}}
                </li>
            </ul>
            <!-- <div class="hint" v-show="link_mobile == 0">
                <div class="title">{{rateOfFlow_pirce_check}}</div>
                <span>全国</span>当月有效，当月无限次，到账后立即生效{{rateOfFlow_text}}
            </div>
            <div class="hint" v-show="link_mobile == 1">
                <div class="title">{{rateOfFlow_pirce_check}}</div>
                <span>全国</span>当月有效，同一号码同一档位限充5次/月，到账后立即生效 {{rateOfFlow_text}}
            </div> -->
            <div class="hint">
                <div class="title">充值使用说明</div>
                1、根据相关规定，对于部分如非3G号码/欠费/非实名制/运营商黑名单用户，暂时不能使用流量充值服务。对于实名制等业务的办理方法，建议联系归属地运营商。<br>
                2、充值流量当月有效，月底失效，到账后立即生效。请以短信通知及在运营商处查询的信息为准。<br>
                3、由于联通存在每个面额每个月充值次的限制，充值超过5次，将会出现失败退款。建议您充值其他面额的流量。另外，号码欠费、套餐互斥、非实名认证、运营商黑名单等原因也会导致充值失败退款。<br>
                4、充值失败时我们会立即为您办理退款，如果您使用微信支付，退款会退回微信钱包。信用卡退款时间可能会较长，您可以直接致电银行或登录网银查看退款情况。<!-- <br> -->
                <!-- 5、{{rateOfFlow_text}} -->
            </div>
        </div>
        <!-- 旅游卡充值(没有充值记录) -->
        <div class="card tab_list" v-show="tab_number == '2' && recharge == 0 && !first_card_show">
            <div class="input input_view">
                <input data-role="none" type="text" placeholder="请输入旅游卡号" maxlength="12" v-model="cardno" >
                <div class="flow_icon" @click="flow_bg_show = !flow_bg_show" v-show="!cardno"><img src="../../../assets/images/recharge/flow.png">
                </div>
                <div @click="cardno = ''" class="input_delete" v-show="cardno"><img src="../../../assets/images/recharge/input_delete.png"></div>
            </div>
            <ul>
                <li v-for="(list,index) in card_list"  @click="pirce_check(list.id,list.price,3)" :class="{'check':cardno.length == 12}">{{list.price}}</li>
            </ul>
            <div class="hint">
                温馨提示：充值完成后请到线下进行圈存
            </div>
        </div>
        <!-- 旅游卡充值(有充值记录) -->
        <div class="recordCard" v-show="tab_number == '2' && recharge == 1 && !first_card_show">
            <div class="title"><span>提示：</span>由于数据传输到系统存在一定延时，卡面余额仅作参考。</div>
            <div class="card_list" @click="swipeRight" :class="{height1:sctcdAccount.length == 1,height2:sctcdAccount.length == 2,height3:sctcdAccount.length > 2}">

                <v-touch tag="div" v-on:swipeleft="swipeLeft()" v-on:swiperight="swipeRight()" class="list" :class="{left:index==sctcdAccount.length-1 && swipe_left == 1,right:index==sctcdAccount.length-1 && swipe_right == 1}" data-id="1" data-password="456789" v-for="(list,index) in sctcdAccount" :key="index">
                    <div class="cardNumber">
                        <span>都市旅游卡</span><br>
                        {{list.cardno}}
                    </div>
                    <div class="balance">
                        卡号余额：{{list.cardBalance}}
                    </div>
                    <div class="load">
                        账号余额：{{list.accountBalance}}
                    </div>
                    <div class="mark">{{list.index}}/{{sctcdAccount.length}}</div>
                </v-touch>
            </div>
            <ul>
                <li class="clearfix password_view" v-show="password_show">
                    <div class="fl">
                        圈存密码
                    </div>
                    <div class="fr password">
                        {{password}}
                    </div>
                </li>
                <li  class="clearfix" @click="rechargeAddress">
                    <div class="fl">
                        自助充值机地址
                    </div>
                </li>
                <li  class="clearfix" @click="rechargeRule">
                    <div class="fl">
                        圈存流程
                    </div>
                </li>
                <li  class="clearfix binding_view" v-show="password_show" @click="binding_view">
                    <div class="fl">
                        我的绑定信息
                    </div>
                </li>
                <li  class="clearfix" @click="rechargeList">
                    <div class="fl">
                        充值记录
                    </div>
                </li>
                <li  class="clearfix" @click="rechargeHelpCenter">
                    <div class="fl">
                        常见问题
                    </div>
                </li>
                <li class="clearfix password_view">
                    <div class="fl">
                        客服电话
                    </div>
                    <div class="fr password" @click="dial_phone('12319')">
                        12319
                    </div>
                </li>
            </ul>
            <div class="hint">
                <span @click="add_card">添加卡片</span>｜<span @click="delete_card_show = true">删除卡片</span>
            </div>
            <!-- //立即充值 -->
            <div class="alrCard_bg" v-show="alrCard_bg_show">
                <div class="alrCard">
                    <div class="alrCard_title">温馨提示：充值完成后请到线下自助充值机进行圈存</div>
                    <img src="../../../assets/images/recharge/input_delete.png" @click="alrCard_bg_show = false">
                    <div class="list" v-for="(list,index) in card_list" @click="pirce_check(list.id,list.price,4)">{{list.price}}</div>
                </div>
            </div>
        </div>
        <!-- banner周五活动 -->
        <div class="recharge_activity" data-baidu-stats="话费充值-周五充值活动" @click="gotoActivity()" v-if="activityImgUrl && tab_number == 0 && isStartActivity">
            <img :src="activityImgUrl" alt="" onerror="this.style.display = 'none'">
        </div>
        <!-- 底部按钮 -->
        <div class="quota_div" v-show="quota_div_show">您已超出限额</div>
        <div class="footer_bg" v-show="!first_card_show && tab_number == '2'"></div>
        <footer v-show="tab_number == '2' && recharge == 1 && !first_card_show">
            <div class="integral"> 可用积分：<span>{{toRecharge.availablePoint? toRecharge.availablePoint.toFixed(2) : '0.00'}}</span></div>
            <div class="button" @click="recharge_refer()">立即充值</div>
        </footer>

        <!-- 第一次充值旅游卡 -->
        <div class="first_card" v-show="first_card_show">
            <img src="../../../assets/images/recharge/first_card.jpg">
        </div>
        <div class="first_card_button" v-show="first_card_show">
            <span @click="first_card_show = false">立即充值</span>
        </div>
        <!-- 充值流程 -->
        <div class="flow_bg" v-show="flow_bg_show">
            <div class="flow">
                <div class="title">旅游卡充值流程</div>
                <span>1、输入卡号</span><br>
                <img src="../../../assets/images/recharge/flow_card.png"><br>
                <span>2、选择金额，完成支付</span><br>
                <span>3、前往线下充资机圈存完成充值</span>
                <div class="button" @click="flow_bg_show = !flow_bg_show">我知道了</div>
            </div>
        </div>
        <!-- 确认弹出框 -->
        <div class="isSuccess_bg delete_card" v-show="delete_card_show">
            <div class="isSuccess">
                <p>是否确认删除</p>
                <div class="input_view">
                    <div @click="delete_card_show = !delete_card_show">关闭</div>
                    <div @click="delete_card_affirm" class="right">确定</div>
                    <div class="line"></div>
                </div>
            </div>
        </div>
        <!-- 认证弹出框 -->
        <div class="isSuccess_bg approve" v-show="approve_show">
            <div class="isSuccess">
                <div class="title">你还未认证会员哦</div>
                <p class="min">你的卡尚未实名认证，认证后的旅游卡可以实时查询余额和挂失哦</p>
                <div class="input_view">
                    <div @click="approve_show = false">取消</div>
                    <div @click="verify_link" class="right">去认证</div>
                    <div class="line"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/assets/js/api.js';
import http from '@/http/http.js';
import {checkMobile,checkOperator} from '@/assets/js/verify.js';
export default{
    name:'recharge',
    data (){
        return {
            tab_number:this.$route.params.index,//tab切换
            novice:0,//新手指引
            mobile:localStorage.mobile.substring(0,3)+' '+ localStorage.mobile.substring(3,7)+' '+localStorage.mobile.substring(7,11),//手机号展示
            newMobile:localStorage.mobile,//手机号去空格
            operator:'',//运营商
            cardno:'',
            tab_list:[
                {
                    title:'话费充值'
                },
                {
                    title:'流量充值'
                },
            ],
            charge_list_sku_id:'',
            charge_list:[
            ],
            rateOfFlow_list_sku_id:'',
            rateOfFlow_list:[
            ],
            rateOfFlow_pirce_check:'',
            card_list_sku_id:'',
            card_list:[
            ],
            sctcdAccount:[
            ],
            toRecharge:{
                availablePoint:0
            },
            sctcdAccount_length:'',
            flow_bg_show:false,
            first_card_show:false,
            delete_card_show:false,
            approve_show:false,
            alrCard_bg_show:false,
            quota_div_show:false,
            daily_limit:'',
            charge_text:'',
            rateOfFlow_text:'',
            password:'',
            password_show:false,
            swipe_left:0,
            swipe_right:0,
            first:0,
            recharge:'',//旅游卡是否有充值记录
            recharge_add:'0',
            recharge_data:'',
            isCoupon:true, //是否显示抵扣券
            isCoupon_Num:false,//是否选择了抵扣券
            couponNum:"", //抵扣券数量
            couponCodeId:this.$route.query.couponCodeId,
            couponMoney:this.$route.query.couponValue,
            isCoupon_yes:true,
            isCoupon_no:false,
            groupShortName:localStorage.groupShortName,
            mobile_product_id:'',
            mobile_merchant_id:'',
            flow_merchant_id:'',
            flow_product_id:'',
            sctcd_merchant_id:'',
            sctcd_product_id:'',
            discountsDateshow:true,
            otherAPP:browserName,
            activityName: '',
            activityImgUrl: '',
            isStartActivity: false,
            activityUrl: '',
        }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#fff";
    },
    destroy(){
      document.body.style.backgroundColor="";
    },
    created(){
        this.title();
        if(localStorage.rechargeTab){
            this.tab_number=parseInt(localStorage.rechargeTab);
            localStorage.removeItem('rechargeTab');
        }
        this.getCouponNum_method();//获取抵扣券
        this.getCouponMoney();//使用抵扣券
        this.queryActivityByType(); // 查询充值活动信息
    },
    watch :{
        cardno(){
            this.cardno = this.cardno.toUpperCase();
        },
        tab_number () {
           this.title();
        },
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
                this.showOperator(checkOperator(this.newMobile));
            }else{
                this.operator = '';
                this.discountsDateshow = true;
            };
        },
        sctcdAccount(){
            if(this.sctcdAccount[0].pwd == "" || this.sctcdAccount[0].pwd == null){
                this.password_show = false;
            }else{
                this.password_show = true;
                this.password = this.sctcdAccount[0].pwd;
            }
            if(this.sctcdAccount[0].cardno != "" || this.sctcdAccount[0].cardno != null){
                this.cardno = this.sctcdAccount[0].cardno
            }
        },
        novice (){
            if(browserName == "WebKit"){
                window.webkit.messageHandlers.hideNavgationBar.postMessage("false");
            }else if(browserName == "Chrome WebView"){
                RHNativeJS.setTopDialog(false);
                RHNativeJS.visablePtrFrame(true);
            }
            if(this.novice == 1){
                if(browserName == "WebKit"){
                  window.webkit.messageHandlers.hideNavgationBar.postMessage("true");
                }else if(browserName == "Chrome WebView"){
                  RHNativeJS.setTopDialog(true);
                  RHNativeJS.visablePtrFrame(false);
                }
            }
        },
        toRecharge(){
            if(!this.toRecharge.sctcd_default_sku_id){
                return;
            };
            this.showOperator(checkOperator(this.newMobile));
            this.card_list_sku_id = this.toRecharge.sctcd_default_sku_id;
            this.card_list = this.toRecharge.sctcd_list;
            this.sctcd_product_id = this.toRecharge.sctcd_product_id;
            this.sctcd_merchant_id = this.toRecharge.sctcd_merchant_id;
            //缓存校验
            if(localStorage.chargeListSkuId){
                this.charge_list_sku_id = parseInt(localStorage.chargeListSkuId);
                localStorage.removeItem('charge_list_sku_id');
            };
            if(localStorage.inputnewMobile){
                this.newMobile = parseInt(localStorage.inputnewMobile);
                localStorage.removeItem('inputnewMobile');
            };
        }
    },
    mounted (){
        if(this.newMobile.length == 11){
            this.showOperator(checkOperator(this.newMobile));
        }else{
            this.operator = '';
        }
        http({
            method: 'post',
            url: api.rechargeIndex,
            notNeedTransfer:true
        }).then((data) => {
            if(data.data.display == "N"){
                if( data.data.sctcdAccountList.length != 0){
                    this.recharge = 1;
                    this.sctcdAccount = data.data.sctcdAccountList;
                    this.sctcdAccount_length = data.data.sctcdAccountList.length;
                    for(var i = 0; i <  this.sctcdAccount.length; i++){
                        this.queryBalance(i);
                        this.sctcdAccount[i].index = (i+1);
                    }
                }else{
                    this.recharge = 0;
                }
            }else{
                this.recharge = 0;
                this.first = 1;
                if(this.recharge == 0 && this.first == 1 && this.tab_number == 2){
                    this.first_card_show =true;
                    this.first = 0;
                }

            }
        });
        http({
            method: 'get',
            url: api.toRecharge,
            notNeedTransfer:true
        }).then((data) => {
            this.toRecharge = data.data;
        })
    },
    methods:{
        dial_phone(tel){
          dooolyAPP.callPhone(tel);
        },
        queryActivityByType(){
            let params = {
                type: 11,
                groupId: localStorage.groupId
            };
            http({
                method: 'post',
                url: api.getRechargeActivityByType,
                data: params
            }).then(res => {
                if (res.data.code === "1000") {
                    let data = res.data.data;
                    this.activityName = data.activityName;
                    this.activityImgUrl = data.imgUrl;
                    this.activityUrl = data.linkUrl;
                    this.isStartActivity = true;
                } else {
                    this.activityName = '';
                    this.activityImgUrl = '';
                    this.activityUrl = '';
                    this.isStartActivity = false;
                }
            })
        },
        //根据运营商显示不同价格
        showOperator(item){
            if(!this.toRecharge.sctcd_default_sku_id){
                return;
            };
            if(item == 'cmcc'){
                this.operator = '中国移动';
                this.charge_list_sku_id = this.toRecharge.cmcc_tel_default_sku_id;
                this.charge_list = this.toRecharge.cmcc_tel_list;
                this.rateOfFlow_list_sku_id = this.toRecharge.cmcc_flow_default_sku_id;
                this.rateOfFlow_list = this.toRecharge.cmcc_flow_list;
                this.mobile_product_id = this.toRecharge.cmcc_tel_product_id;
                this.mobile_merchant_id = this.toRecharge.cmcc_tel_merchant_id;
                this.flow_merchant_id = this.toRecharge.cmcc_flow_merchant_id;
                this.flow_product_id = this.toRecharge.cmcc_flow_product_id;
                if(this.toRecharge.cmccCharges){
                    this.toRecharge.charges = this.toRecharge.cmccCharges;
                    this.discountsDateshow = true;
                }else{
                    this.discountsDateshow = false;
                }
                
            }else if(item == 'cucc'){
                this.operator = '中国联通';
                this.charge_list_sku_id = this.toRecharge.cucc_tel_default_sku_id;
                this.charge_list = this.toRecharge.cucc_tel_list;
                this.rateOfFlow_list_sku_id = this.toRecharge.cucc_flow_default_sku_id;
                this.rateOfFlow_list =this.toRecharge.cucc_flow_list;
                this.mobile_product_id = this.toRecharge.cucc_tel_product_id;
                this.mobile_merchant_id = this.toRecharge.cucc_tel_merchant_id;
                this.flow_merchant_id = this.toRecharge.cucc_flow_merchant_id;
                this.flow_product_id = this.toRecharge.cucc_flow_product_id;
                if(this.toRecharge.chuCharges){
                    this.toRecharge.charges = this.toRecharge.chuCharges;
                    this.discountsDateshow = true;
                }else{
                    this.discountsDateshow = false;
                }
            }else if(item == 'ctcc'){
                this.operator = '中国电信';
                this.charge_list_sku_id = this.toRecharge.ctc_tel_default_sku_id;
                this.charge_list = this.toRecharge.ctc_tel_list;
                this.rateOfFlow_list_sku_id = this.toRecharge.ctc_flow_default_sku_id;
                this.rateOfFlow_list =this.toRecharge.ctc_flow_list;
                this.mobile_product_id = this.toRecharge.ctc_tel_product_id;
                this.mobile_merchant_id = this.toRecharge.ctc_tel_merchant_id;
                this.flow_merchant_id = this.toRecharge.ctc_flow_merchant_id;
                this.flow_product_id = this.toRecharge.ctc_flow_product_id;
                if(this.toRecharge.chaCharges){
                    this.toRecharge.charges = this.toRecharge.chaCharges;
                    this.discountsDateshow = true;
                }else{
                    this.discountsDateshow = false;
                }
            }else{
                this.operator = '';
                this.charge_list_sku_id = this.toRecharge.ctcc_tel_default_sku_id;
                this.charge_list = this.toRecharge.ctcc_tel_list;
                this.rateOfFlow_list_sku_id = this.toRecharge.ctcc_flow_default_sku_id;
                this.rateOfFlow_list =this.toRecharge.ctcc_flow_list;
            };
            this.daily_limit = this.toRecharge.daily_limit;
            if(this.toRecharge.charges){
                this.charge_text = '兜礼积分充值将收取'+this.toRecharge.charges+'%手续费，';
                if(this.toRecharge.daily_limit){
                    this.charge_text += '每月积分最多兑换'+this.toRecharge.daily_limit+'元话费';
                }else{
                    this.charge_text = this.charge_text.substring(0,this.charge_text.length-1);
                }
            }else if(this.toRecharge.daily_limit){
                this.charge_text = '每月积分最多兑换'+this.toRecharge.daily_limit+'元话费';
            };
            if(this.toRecharge.discounts_month_limit){
                this.charge_text = '兜礼积分每月兑换'+this.toRecharge.discounts_month_limit+'元免手续费，超过'+this.toRecharge.discounts_month_limit+'元的部分，' +this.charge_text;
            };
        },
        title(){
            if(this.tab_number == 0){
                if(localStorage.groupShortName){
                    initTitle(localStorage.groupShortName + '专享-话费充值','')
                }else{
                    initTitle('话费充值','')
                }
            }else if(this.tab_number == 1){
                if(localStorage.groupShortName){
                    initTitle(localStorage.groupShortName + '专享-流量充值','')
                }else{
                    initTitle('流量充值','')
                }
            }else if(this.tab_number == 2){
                if(localStorage.groupShortName){
                    initTitle(localStorage.groupShortName + '专享-旅游卡充值','')
                }else{
                    initTitle('旅游卡充值','')
                }
            }
        },
        verify_link(){
            dooolyAPP.gotoJumpVue.call(this,'/travelCard_add/'+this.cardno);
        },
        // 充值活动跳转
        gotoActivity(){
            // this.$baiduStats('话费充值-周五充值活动');
            let jumpUrl = this.activityUrl || '/rechargeActivity/';
            jumpUrl += this.activityName;
            dooolyAPP.gotoJumpVue.call(this, jumpUrl);
        },
        pirce_check(id,price,index){
            this.quota_div_show = false;
            if(index == 1){
                this.charge_list_sku_id = id;
                this.rateOfFlow_pirce_check = price;
                if(price=="30元"){
                  this.isCoupon_yes=false;
                  this.isCoupon_no=true;
                }else if(this.couponNum=='0'){
                  this.isCoupon_yes=false;
                  this.isCoupon_no=true;
                }else{
                  this.isCoupon_yes=true;
                  this.isCoupon_no=false;
                }
            }else if(index == 2){
                this.rateOfFlow_list_sku_id = id;
                this.rateOfFlow_pirce_check = price;
            }else if(index == 3){
                this.card_list_sku_id = id;
                this.rateOfFlow_pirce_check = price
            }else if(index == 4){
                this.card_list_sku_id = id;
                this.rateOfFlow_pirce_check = price;
            }
            this.recharge_refer();
        },
        finish(){
        },
        delete_card_affirm(){
            http({
                method: 'post',
                url: api.abandonedSctcdAccount,
                notNeedTransfer:true,
                data:{
                    "id":this.sctcdAccount[0].id
                }
            }).then((data) => {
                this.delete_card_show = false;
                if(data.data.resultCode == "success"){
                    this.sctcdAccount.shift();
                    this.delete_card_show = false;
                    if( this.sctcdAccount.length > 0){
                        for(var i = 0; i <  this.sctcdAccount.length; i++){
                            this.sctcdAccount[i].index = (i+1);
                        }
                    }

                 }else{
                    this.$toast("网络异常，请重试！");
                }
            });
        },
        binding_view(){
            dooolyAPP.gotoJumpVue.call(this,'/travelCard_details/'+this.sctcdAccount[0].idCard+'/'+this.sctcdAccount[0].userName+'/'+this.sctcdAccount[0].phoneno);
        },
        rechargeList(){
            dooolyAPP.gotoJumpVue.call(this,'/rechargeList/'+this.sctcdAccount[0].cardno);
        },
        rechargeHelpCenter(){
            dooolyAPP.gotoJumpVue.call(this,'/rechargeHelpCenter');
        },
        rechargeAddress(){
            dooolyAPP.gotoJumpVue.call(this,'/rechargeAddress');
        },
        rechargeRule(){
            dooolyAPP.gotoJumpVue.call(this,'/rechargeRule');
        },
        tab_change(index){
            this.tab_number = index;
            this.quota_div_show = false;
            if(this.sctcdAccount.length > 0){
                this.recharge = 1;
            }
            if(this.recharge == 0 && this.first == 1 && this.tab_number == 2){
                this.first_card_show =true;
                this.first = 0;
            }
        },
        recharge_refer(){
            if(this.tab_number == 0){
               if(this.couponCodeId){ //使用抵扣券
                // this.recharge_data = {
                //     'phoneNumber':this.newMobile,
                //     'cardno':"",
                //     'merchantId':this.mobile_merchant_id,
                //     'productId':this.mobile_product_id,
                //     'skuId':this.charge_list_sku_id,
                //     'productType':3,
                //     'couponId':this.couponCodeId, //使用抵扣券
                // };
                this.recharge_data = {
                    'userId': localStorage.userId,
                    'groupId': localStorage.groupId,
                    'merchantProduct': [
                        {
                            'merchantId':this.mobile_merchant_id,
                            'remarks':'',
                            'productSku':[{
                                'productType':3,
                                'productId':this.mobile_product_id,
                                'skuId':this.charge_list_sku_id,
                                'buyNum':1
                            }],
                            'couponId': this.couponCodeId, //使用抵扣券
                        }
                    ],
                    'consigneeMobile':this.newMobile,
                    'cardno':"",
                    'productType':3
                };
               }else{ //没有选择使用抵扣券
                //  this.recharge_data = { 
                //     'phoneNumber':this.newMobile,
                //     'cardno':"",
                //     'merchantId':this.mobile_merchant_id,
                //     'productId':this.mobile_product_id,
                //     'skuId':this.charge_list_sku_id,
                //     'productType':3
                // };
                this.recharge_data = {
                    'userId': localStorage.userId,
                    'groupId': localStorage.groupId,
                    'merchantProduct': [
                        {
                            'merchantId':this.mobile_merchant_id,
                            'remarks':'',
                            'productSku':[{
                                'productType':3,
                                'productId':this.mobile_product_id,
                                'skuId':this.charge_list_sku_id,
                                'buyNum':1
                            }],
                        }
                    ],
                    'consigneeMobile':this.newMobile,
                    'cardno':"",
                    'productType':3
                };
               }
                
                if(checkMobile(this.newMobile)){
                    this.$toast('请输入正确手机号码');
                    return;
                }
            }else if(this.tab_number == 1){
                // this.recharge_data = {
                //     'phoneNumber':this.newMobile,
                //     'cardno':"",
                //     'merchantId':this.flow_merchant_id,
                //     'productId':this.flow_product_id,
                //     'skuId':this.rateOfFlow_list_sku_id,
                //     'productType':4
                // };
                this.recharge_data = {
                    'userId': localStorage.userId,
                    'groupId': localStorage.groupId,
                    'merchantProduct': [
                        {
                            'merchantId':this.flow_merchant_id,
                            'remarks':'',
                            'productSku':[{
                                'productType': 4,
                                'productId':this.flow_product_id,
                                'skuId':this.rateOfFlow_list_sku_id,
                                'buyNum':1
                            }],
                        }
                    ],
                    'consigneeMobile': this.newMobile,
                    'cardno':"",
                    'productType': 4
                };
                if(checkMobile(this.newMobile)){
                    this.$toast('请输入正确手机号码');
                    return;
                }
            }else{
                if(this.recharge == 1 && this.recharge_add == 0 && this.alrCard_bg_show == false){
                    this.alrCard_bg_show = true;
                    return;
                }
                // this.recharge_data = {
                //     'phoneNumber':'',
                //     'cardno':this.cardno,
                //     'merchantId':this.sctcd_merchant_id,
                //     'productId':this.sctcd_product_id,
                //     'skuId':this.card_list_sku_id,
                //     'productType':5
                // };
                this.recharge_data = {
                    'userId': localStorage.userId,
                    'groupId': localStorage.groupId,
                    'merchantProduct': [
                        {
                            'merchantId': this.sctcd_merchant_id,
                            'remarks': '',
                            'productSku':[{
                                'cardno': this.cardno,
                                'productType': 5,
                                'productId': this.sctcd_product_id,
                                'skuId': this.card_list_sku_id,
                                'buyNum': 1
                            }],
                        }
                    ],
                    'consigneeMobile': '',
                    'cardno': this.cardno,
                    'productType': 5
                };
                if(this.cardno == ""){
                    this.$toast('请输入旅游卡号码');
                    return;
                }
                if(this.cardno.length < 11 ){
                    this.$toast("旅游卡号有误");
                    return;
                }
                this.verify(this.cardno);
                return;
            }
            http({
                method: 'post',
                url: api.createOrder_v2_2,
                notNeedTransfer:true,
                data:this.recharge_data
            }).then((data) => {
                if(data.data.code == 1000){
                    dooolyAPP.redirectPay(data.data.data.orderNum)
                }else if(data.data.msg){
                    this.$toast(data.data.msg);
                }else{
                    this.$toast('小兜兜正忙,请稍候重试!');
                }
            })
        },
        queryBalance(index){
            http({
                method: 'post',
                url: api.queryBalance,
                notNeedTransfer:true,
                data:{
                    cardno:this.sctcdAccount[index].cardno
                }
            }).then((data) => {
                if(data.data.cardBalance != "" && data.data.cardBalance != null){
                    this.sctcdAccount[index].cardBalance = data.data.cardBalance;
                }else{
                    this.sctcdAccount[index].cardBalance = '***';
                }
                if(data.data.accountBalance != "" && data.data.accountBalance != null){
                    this.sctcdAccount[index].accountBalance = data.data.accountBalance;
                }else{
                    this.sctcdAccount[index].accountBalance = '***';
                }
                var a = this.sctcdAccount.shift();
                this.sctcdAccount.unshift(a);
            });
        },
        swipeLeft(){
            if(this.swipe_left == 1 || this.sctcdAccount.length < 2){
              return;
            }
            var a = this.sctcdAccount.shift();
            this.sctcdAccount.push(a);
            this.swipe_left = 1;
            this.timeOut = setTimeout(() => {
              this.swipe_left = 0;
            }, 1000);
        },
        swipeRight(){
            if(this.swipe_right == 1 || this.sctcdAccount.length < 2){
              return;
            }
            var a = this.sctcdAccount.shift();
            this.sctcdAccount.push(a);
            this.swipe_right = 1;
            this.timeOut = setTimeout(() => {
              this.swipe_right = 0;
            }, 1000);
        },
        //验证旅游卡号是否绑定接口
        verify(card){
            http({
                method: 'post',
                url: api.verifyCardNo,
                notNeedTransfer:true,
                data:{
                    cardno:card
                }
            }).then((data) => {
                var res = data.data;
                if(res.resultCode == "success"){
                    http({
                        method: 'post',
                        url: api.createOrder_v2_2,
                        notNeedTransfer:true,
                        data:this.recharge_data
                    }).then((data) => {
                        if(data.data.code == 1000){
                            dooolyAPP.redirectPay(data.data.data.orderNum)
                        }else{
                            this.$toast('小兜兜正忙,请稍候重试!');
                        }
                    })
                }else if(res.resultCode == "newAccount"){
                    this.approve_show = true;
                }else if(res.resultCode == "fail"){
                    this.$toast("旅游卡卡号错误");
                }else{
                    this.$toast("网络异常，请重试！");
                }
            });
        },
        add_card(){
            this.cardno = '';
            this.recharge = 0;
        },
       jumpMyCoupon: function () { //跳转我的福利抵扣券
        this.$router.push({
          path: '/coupon_r/' + 0
        });
      },
      getCouponNum_method(){
          http({
            method: 'get',
             url: api.listRestful+"?couponType=unuse&couponCategory=19"
          }).then((res) => {
            if(res.data.code == '1000'){
                this.couponNum=res.data.actConnList.length;
                if(res.data.actConnList.length > 0){
                    if(!this.couponCodeId){
                        this.couponCodeId = res.data.actConnList[0].couponCodeId;
                        this.couponMoney = res.data.actConnList[0].coupon.couponValue;
                    }
                    this.getCouponMoney();
                    if(this.couponNum==0){
                      this.isCoupon_yes=false;
                      this.isCoupon_no=true;
                    }else{
                      this.isCoupon_yes=true;
                      this.isCoupon_no=false;
                    }
                }
            }
          })
      },
      getCouponMoney(){ //判断是否选择抵扣券
        if(this.couponMoney!=undefined){
         this.isCoupon=false;
         this.isCoupon_Num=true;
        }else{
         this.isCoupon=true;
         this.isCoupon_Num=false;
        }
      }
    },
  beforeRouteLeave(to, from, next) {
    if(to.name=="cardBuyPay"||to.name=="coupon_r")
    {
       localStorage.rechargeTab=this.tab_number;
       localStorage.chargeListSkuId = this.charge_list_sku_id;
    }
    else{
      localStorage.removeItem('rechargeTab');
      localStorage.removeItem('chargeListSkuId');
    }
    next();
  },

  beforeRouteEnter(to, from, next) {
    if (from.name == "pointsService" || !from.name) {
      localStorage.rechargeTab = "";
      localStorage.chargeListSkuId = "";
    };
    next();
  }

}
</script>
<style scoped>
.input_view {
    position: relative;
}
.input_view .input_delete {
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
/*头部tab*/
header{
    background: #fff;
    height: 1rem;
    border-bottom: 1px solid #ececec;
}
header ul{
    text-align: center;
}
header ul li{
    display: inline-block;
    font-size: 0.28rem;
    color:#333333;
    line-height: 1rem;
    height: 1rem;
    margin: 0 0.62rem;
}
header ul li.check{
    border-bottom: 0.04rem solid #ee3f44;
    box-sizing: border-box;
    color:#ee3f44;
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
    padding-bottom: 0.16rem;
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
    width: 100%;
    text-align: left;
    padding: 0.4rem 0.14rem;
    box-sizing: border-box;
}
.tab_list ul li{
    text-align: center;
    display: inline-block;
    width: 2.16rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border:1px solid #ccc;
    border-radius: 0.1rem;
    margin: 0.1rem;
    font-size: 0.32rem;
    color: #999;
}
.tab_list ul li.check{
    color: #ee3f44;
    border-color: #ee3f44;
    line-height: normal;
}
.tab_list ul li.check span{
    display: inline-block;
    line-height: 100%;
}
.tab_list .hint{
    padding: 0.3rem;
}
/* 充值活动 */
.recharge_activity{
    padding: 0 0.3rem;
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
footer .integral{
    width: 60%;
    text-indent: 0.3rem;
    text-align: left;
}
footer .integral span{
    color: #ee3f44;
}
footer .button{
    width: 40%;
    text-align: center;
    background: #ee3f44;
    color: #fff;
}
.footer_bg{
    width: 100%;
    height: 2rem;
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
    font-size: 0.32rem;
    color: #666;
    margin-bottom: 0.1rem;
}
.charge ul li.check span:first-child{
    font-size: 0.32rem;
    margin-top: 0.24rem;
}
.charge ul li.check span:last-child{
    font-size: 0.24rem;
}
/*流量充值*/
.rateOfFlow ul li{
    line-height: normal;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 0.32rem;
}
.rateOfFlow ul li.check{
    font-size: 0;
    line-height: normal;
}
.rateOfFlow ul li span{
    display: inline-block;
    line-height: 100%;
}
.rateOfFlow ul li span:nth-child(1){
    margin-top: 0.14rem;
    font-size: 0.32rem;
}
.rateOfFlow ul li span:nth-child(3){
    margin-top: 0.08rem;
    font-size: 0.24rem;
}
.rateOfFlow ul li span:nth-child(5){
    margin-top: 0.08rem;
    font-size: 0.24rem;
    color: #ccc;
}
.rateOfFlow .hint{
    font-size: 0.24rem;
    color: #999;
    line-height: 0.4rem;
}
.rateOfFlow .hint .title{
    font-size: 0.32rem;
    color: #333;
    margin-bottom: 0.1rem;
}
.rateOfFlow .hint span{
    display: inline-block;
    background: #ee3f44;
    color: #fff;
    font-size: 0.2rem;
    padding: 0 0.03rem;
    margin-right: 0.1rem;
}
/*旅游卡充值(没有充值记录)*/
.card .hint{
    font-size: 0.24rem;
    color: #666;
}
.card ul li.check{
    line-height: 1.2rem;
}
/*旅游卡充值(有充值记录)*/
.recordCard{
    background: #fff;
}
.recordCard .title{
    font-size: 0.24rem;
    color: #ff6600;
    line-height: 100%;
    padding: 0.2rem 0;
    text-align: center;
    background: #fcf6d4;
    margin-bottom: 0.2rem;
}
.recordCard .title span{
}
.recordCard .card_list{
    margin-bottom: 0.15rem;
    position: relative;
}
.recordCard .card_list.height1{
     height: 2.5rem;
}
.recordCard .card_list.height2{
     height: 3.7rem;
}
.recordCard .card_list.height3{
     height: 4.9rem;
}
.recordCard .card_list .list{
    width: 6.9rem;
    height: 2.5rem;
    background: url(../../../assets/images/recharge/card_bg.png) no-repeat 0 0;
    background-size: 100%;
    margin: 0 auto;
    color: #fff;
    position: relative;
    margin-top: -1.3rem;
    border-radius: 0.2rem;
    box-shadow: 0 4px 7px 2px #00000038;
    transform: scale(0.95);
    display: none;
}
.recordCard .card_list .list .cardNumber{
    position: absolute;
    left: 0.32rem;
    bottom: 0.2rem;
    line-height: 100%;
    font-size: 0.5rem;
}
.recordCard .card_list .list .cardNumber span{
    line-height: 100%;
    font-size: 0.24rem;
}
.recordCard .card_list .list .balance{
    position: absolute;
    line-height: 100%;
    font-size: 0.28rem;
}
.recordCard .card_list .list .load{
    position: absolute;
    line-height: 100%;
    font-size: 0.28rem;
}
.recordCard .card_list .list .mark{
    position: absolute;
    right: 0.24rem;
    bottom: 0.2rem;
    line-height: 100%;
    font-size: 0.28rem;
}
.recordCard .card_list .list:nth-child(1),.recordCard .card_list .list:nth-child(2),.recordCard .card_list .list:nth-child(3){
    display: block;
}
.recordCard .card_list .list:nth-child(1){
    margin-top: 0;
    z-index: 9;
    transform: scale(1);
}
.recordCard .card_list .list:nth-child(1) .cardNumber{
    left: 0.32rem;
    top: 0.2rem;
}
.recordCard .card_list .list:nth-child(1) .balance{
    display: block;
    left: 0.32rem;
    bottom: 0.56rem;
}
.recordCard .card_list .list:nth-child(1) .load{
    display: block;
    left: 0.32rem;
    bottom: 0.2rem;
    color:#faf559;
}
.recordCard .card_list .list:nth-child(2){
    z-index: 8;
}
.recordCard .card_list .list:nth-child(3){
    z-index: 7;
}
.recordCard .card_list .list.right{
    animation:slide_right 1s;
    position: absolute;
    left: 0.3rem;
    top: 0;
    margin: 0;
    z-index: 50;
    display: block;
}
.recordCard .card_list .list.left{
    animation:slide_left 1s;
    position: absolute;
    left: 0.3rem;
    top: 0;
    margin: 0;
    z-index: 50;
    display: block;
}

@keyframes slide_right
{
0%   {transform: rotate(0deg);left: 0px;top:0px;opacity:1;}

100% {transform: rotate(30deg);left: 100px;top:-25px;opacity:0;}
}
@keyframes slide_left
{
0%   {transform: rotate(360deg);left: 0px;top:0px;opacity:1;}

100% {transform: rotate(330deg);left: -100px;top:-25px;opacity:0;}
}

.recordCard ul{
    padding: 0 0.26rem;
}
.recordCard ul li{
    height: 0.98rem;
    line-height: 0.98rem;
    width: 100%;
    border-bottom: 1px solid #ececec;
    background: url(../../../assets/images/recharge/right.png) no-repeat right 0.32rem;
    background-size: 0.2rem auto;
}
.recordCard ul li:last-child{
    border:0;
}
.recordCard ul li .fl{
    font-size: 0.28rem;
    color: #333333;
    text-indent: 0.02rem;
}
.recordCard ul li .fr{
    font-size: 0.28rem;
    color: #acacac;
    margin-right: 0.36rem;
}
.recordCard ul li .fr a{
    color: #acacac;
}

.recordCard .hint{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    width: 100%;
    text-align: center;
    font-size: 0.26rem;
    color: #333;
    padding: 0.1rem 0;
    padding-bottom: 1.2rem;
}
.alrCard_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 101;
}
.alrCard{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3rem;
    font-size: 0;
    background: #fff;
    text-align: center;
    padding-top: 0.88rem;
}
.alrCard .alrCard_title{
    position: absolute;
    left: 0.33rem;
    top: 0.3rem;
    font-size: 0.24rem;
}
.alrCard img{
    position: absolute;
    right: 0.33rem;
    top: 0.3rem;
    width: 0.36rem;
}
.alrCard .list{
    display: inline-block;
    width: 2.16rem;
    line-height: 1.16rem;
    border-radius: 0.1rem;
    border:1px solid #ccc;
    font-size: 0.32rem;
    color: #333;
    text-align: center;
    margin: 0.1rem;
}

/*第一次充值旅游卡*/
.first_card{
    width:100%;
    font-size: 0;
}
.first_card img{
    width: 100%;
}
.first_card_button{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height:1.2rem;
    background: #49c99b;
    text-align: center;
    z-index: 102;
    font-size: 0;
}
.first_card_button span{
    display: inline-block;
    margin: 0.18rem 0;
    width: 7.08rem;
    line-height: 0.88rem;
    background: #f8e24b;
    font-size: 0.34rem;
    color: #2f9376;
    border-radius: 1rem;
}
/*充值流程*/
.flow_icon{
    position: absolute;
    right: 0.3rem;
    top: 50%;
    height: 0.4rem;
    width: 0.4rem;
    font-size: 0;
    margin: 0;
    margin-top: -0.16rem;
    padding: 0;
    line-height: 100%;
}
.flow_icon img{
    height: 100%;
    width: 100%;
}
.flow_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 101;
}
.flow{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -2.7rem;
    margin-top: -3.4rem;
    width: 5.4rem;
    height: 6.8rem;
    font-size: 0;
    background: #fff;
    border-radius: 0.2rem;
}
.flow .title{
    font-size: 0.36rem;
    color: #333;
    margin: 0.5rem 0;
    text-align: center;
}
.flow span{
    display: inline-block;
    font-size: 0.28rem;
    color: #999;
    margin-left: 0.53rem;
    margin-bottom: 0.05rem;
}
.flow img{
    width: 3.68rem;
    height: 2.22rem;
    margin: 0.2rem 0;
    margin-left: 0.87rem;
}
.flow .button{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: 1rem;
    text-align: center;
    font-size: 0.38rem;
    color: #ee3f44;
    border-top: 1px solid #ececec;
}
/*更改公用样式*/
.tab_list .input_view .input_delete{
    height: 0.4rem!important;
    width: 0.4rem!important;
    right: 0.3rem;
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
/* 抵扣券 */
.coupon_div_bg{
    border-bottom: 1px solid #ececec;
    margin: 0 0.3rem;
}
.coupon_div{font-size: 0.28rem;color: #333; height: 1rem;background: #fff;}
.coupon_div .coupon_fl{font-size: 0.28rem;height: 1rem;float: left;line-height: 1rem;}
.coupon_div .coupon_fr{float: right; height: 1rem;line-height: 1rem;color: #ee3f44;}
.coupon_div .coupon_fr .img_div{
    float: right;
    margin-left: 0.2rem;
}
.coupon_div .coupon_fr img{width: 0.16rem;height: 0.28rem;vertical-align: middle;}
.isCoupon_no_color{color:#999 !important;}
</style>
