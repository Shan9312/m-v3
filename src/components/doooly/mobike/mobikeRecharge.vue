<template>
    <div class="view">
        <!-- 话费充值 -->
        <div class="charge tab_list">
            <div class="banner" v-show="click != -1">
                <div class="title">摩拜单车<span></span>{{click == 0 ? '次' : '天'}}卡</div>
                <div class="mumber">{{(click == 0 ? '1' : click == 1 ? '7' : '30')}}</div>
                <div class="mumbers">{{click == 0 ? '次' : '天'}}</div>
                <!-- <div class="time">{{(click == 0 ? '有效期30天' : click == 1 ? '有效期7天' : '有效期30天')}}</div> -->
            </div>
            <div class="input input_view">
                <input data-role="none" type="tel" placeholder="请输入摩拜绑定的手机号" v-model="mobile" maxlength="13">
                <div class="operator">
                    {{operator}}
                </div>
                <div @click="mobile = ''" class="input_delete" v-show="mobile"><img src="../../../assets/images/recharge/input_delete.png"></div>
            </div>
            <ul>
                <li v-for="(list,index) in list.mobike_sku_list" :key="index" class="check" :class="{click:click == index}" @click="checklist(index)" v-show="list.specification != '1次骑行券' ">
                    <span>{{Number(list.price)}}元</span><br>
                    <span>{{list.specification}}</span>
                </li>
            </ul>
            <div class="hint" v-show="click == -1">
                <div class="title">充值使用说明</div>
                1、请填写摩拜APP绑定的手机号。<br>
                2、直接充值到手机号绑定的摩拜账号内，每次骑行抵扣，如果券提前消费完毕，则需要再次充值。<br>
                3、如遇到充值失败，我们将自动进行退款处理。<br>
                4、充值的骑行抵扣券只能在摩拜APP中使用。
            </div>
            <div class="hint" v-show="click != -1">
                <div class="title">充值使用说明</div>
                <span v-show="click == 0">1、1张1元骑行券充入账户，骑行券从充入之时算起需要在30天内使用完。<br></span>
                <span v-show="click == 1">1、7张1元骑行券充入账户，骑行券从充入之时算起需要在7天内使用完。<br></span>
                <span v-show="click == 2">1、30张1元骑行券充入账户，骑行券从充入之时算起需要在30天内使用完。<br></span>
                2、骑行券使用完或过期，均视为失效。<br>
                3、每次行程只能用一张骑行券，免费时长参照摩拜单车当地的计费规则，超出部分按照正常计费规则计费。同一用户每天使用骑行券的次数不设定上限。<br>
                4、仅限中国境内使用。<br>
                5、购买成功后，相应费用不予退还。<br>
                6、如果客户目前有正在激活期的月卡、季卡、半年卡、年卡等产品，本产品充入后和已有产品的有效期不延续计算。<br>
                7、部分地区车辆仅限使用美团APP扫码。
            </div>
            <!-- <div class="hint" v-show="click == 0">
                <div class="title">充值使用说明</div>
                1、1张1元骑行券充入账户，骑行券从充入之时算起需要在30天内使用完。<br>
                2、骑行券使用完或过期，均视为失效。<br>
                3、每次行程只能用一张骑行券，免费时长参照摩拜单车当地的计费规则，超出部分按照正常计费规则计费。同一用户每天使用骑行券的次数不设定上限。<br>
                4、仅限中国境内使用。<br>
                5、购买成功后，相应费用不予退还。<br>
                6、如果客户目前有正在激活期的月卡、季卡、半年卡、年卡等产品，本产品充入后和已有产品的有效期不延续计算。
            </div>
            <div class="hint" v-show="click == 1">
                <div class="title">充值使用说明</div>
                1、7张1元骑行券充入账户，骑行券从充入之时算起需要在7天内使用完。<br>
                2、骑行券使用完或过期，均视为失效。<br>
                3、每次行程只能用一张骑行券，免费时长参照摩拜单车当地的计费规则，超出部分按照正常计费规则计费。同一用户每天使用骑行券的次数不设定上限。<br>
                4、仅限中国境内使用。<br>
                5、购买成功后，相应费用不予退还。<br>
                6、如果客户目前有正在激活期的月卡、季卡、半年卡、年卡等产品，本产品充入后和已有产品的有效期不延续计算。
            </div>
            <div class="hint" v-show="click == 2">
                <div class="title">充值使用说明</div>
                1、30张1元骑行券充入账户，骑行券从充入之时算起需要在30天内使用完。<br>
                2、骑行券使用完或过期，均视为失效。<br>
                3、每次行程只能用一张骑行券，免费时长参照摩拜单车当地的计费规则，超出部分按照正常计费规则计费。同一用户每天使用骑行券的次数不设定上限。<br>
                4、仅限中国境内使用。<br>
                5、购买成功后，相应费用不予退还。<br>
                6、如果客户目前有正在激活期的月卡、季卡、半年卡、年卡等产品，本产品充入后和已有产品的有效期不延续计算。
            </div> -->
        </div>
        <div class="footer_bg"></div>
        <footer>
            <div class="integral"> 可用积分：<span>{{list.integral.toFixed(2)}}</span></div>
            <div class="button" :class="{check:newMobile.length == 11 && click != -1}" @click="recharge_refer()">立即充值</div>
        </footer>
    </div>
</template>
<script>
import api from '@/assets/js/api.js';
import http from '@/http/http.js';
import {checkMobile,checkOperator} from '@/assets/js/verify.js';
export default{
    name:'mobike-recharge',
    components:{
        api,
    },
    data (){
        return {
            mobile:localStorage.mobile.substring(0,3)+' '+ localStorage.mobile.substring(3,7)+' '+localStorage.mobile.substring(7,11),//手机号展示
            newMobile:localStorage.mobile,//手机号去空格
            operator:'',//运营商
            list:{
                integral: 0,
            },
            click:1,
        }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#fff";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
        initTitle('摩拜骑行券充值','');
        this.getList();
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
                this.showOperator(checkOperator(this.newMobile));
            }else{
                this.operator = '';
                this.discountsDateshow = true;
            };
        },
    },
    mounted (){
    },
    methods:{
        getList(){
            http({
                method: 'post',
                url: api.mobikeProductInfo,
                data:{
                    userId:localStorage.userId
                }
            }).then((data) => {
                this.list = data.data;
            })
        },
        checklist(index){
            if(this.newMobile.length != 11){
                return;
            }
            this.click = index;
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
                //     'merchantId':this.list.mobike_merchant_id,
                //     'productId':this.list.mobike_product_id,
                //     'skuId':this.list.mobike_sku_list[this.click].id,
                //     'productType':8
                // },
                data: {
                    'userId': localStorage.userId,
                    'groupId': localStorage.groupId,
                    'merchantProduct': [
                        {
                            'merchantId': this.list.mobike_merchant_id,
                            'remarks': '',
                            'productSku':[{
                                'productId': this.list.mobike_product_id,
                                'skuId': this.list.mobike_sku_list[this.click].id,
                                'buyNum': 1
                            }],
                        }
                    ],
                    'consigneeMobile': this.newMobile,
                    'cardno': '',
                    'productType': 8
                }
            }).then((data) => {
                if(data.data.code == 1000){
                    dooolyAPP.redirectPay(data.data.data.orderNum)
                }else if(data.data.code == 3003){
                    this.$toast(data.data.msg);
                }else if(data.data.code == 3001){
                    this.$toast(data.data.msg);
                }else{
                    this.$toast('小兜兜正忙,请稍候重试!!');
                }
            })
        },
    },
}
</script>
<style scoped>
.banner{
    width: 6.7rem;
    height: 4rem;
    margin: 0 auto;
    padding: 0.2rem 0;
    background: url(../../../assets/images/recharge/mobikeCard.png) 0 0.2rem no-repeat;
    background-size: 100%;
    color: #fff;
    position: relative;
}
.banner .title{
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;
    font-size: 0.4rem;
    line-height: 100%;
}
.banner .title span{
    display: inline-block;
    width: 0.06rem;
    height: 0.06rem;
    background: #fff;
    border-radius: 100%;
    margin: 0 0.1rem;
    vertical-align: bottom;
    margin-bottom: 0.16rem;
}
.banner .mumber{
    position: absolute;
    top: 1.2rem;
    right: 0.96rem;
    font-size: 1.2rem;
    line-height: 1.3rem;
}
.banner .mumbers{
    position: absolute;
    top: 1.42rem;
    right: 0.5rem;
    font-size: 0.36rem;
    line-height: 100%;
}
.banner .time{
    position: absolute;
    top: 2.6rem;
    right: 0.5rem;
    font-size: 0.28rem;
    line-height: 100%;
    color: #FB8F67;
}
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
    width: 3.34rem;
    height: 1.16rem;
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
    line-height: normal;
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
    line-height: 0.32rem;
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
</style>
