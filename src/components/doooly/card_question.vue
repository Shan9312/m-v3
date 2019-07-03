<template>
  <div class="homeBox">
    <div v-for="(item,index) in questionList" :key="index" >
      <div class="questions">
        <section @click="checkBtn(item.id,index)">
          <div  class="top_div">
            <span>{{item.question}}</span>
            <div  class="rightImg fr" >
              <img :src="item.arrowImg">
            </div>
          </div>
        </section>
        <div class="main_div" v-if="checkAnswer==item.id">
          <div class="answer">
            <span v-html="item.answer"></span>
          </div>
          <div class="btn_div">
            <div class="btn fl">
              <img src="../../assets/images/personalCenter/helpCenter/satisfaction1.png">
              <input type="button" value="回答满意" @click="satisfied (index)"/>
            </div>
            <div class="btn fl btn-last">
              <img src="../../assets/images/personalCenter/helpCenter/satisfaction2.png">
              <input type="button" value="回答不满意" @click="nonSatisfied()"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div  class="coverBg" v-if="popupVisible">
      <div class="alt_nonentity">
        <div class="alt_title">您是否觉得回答没有帮助到你？</div>
        <div class="model_con">有任何问题，可以拨打400-158-2212兜礼客服热线进行询问，{{serviceTime}}</div>
        <div class="model_btn_div">
          <button type="button" @click="closeBtn()" class="cancel">关闭</button>
          <button type="button" @click="dailBtn()" class="active">拨打电话</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  
  import downArrow from "../../assets/images/personalCenter/helpCenter/downArrow.png";
  import upArrow from "../../assets/images/personalCenter/helpCenter/upArrow.png";

    export default {
        name: "helpCenter",
      data(){
          return {
            questionList:[
              {
                id:1,
                question:"关于积分查询",
                arrowImg:downArrow,
                answer:"1.登录“兜礼”-“首页”-“我的”，即可看到您的兜礼积分数量。点击“可用积分”，即可看到您的兜礼积分收入、支出记录。"
              },
              {
                id:2,
                question:"关于积分使用",
                arrowImg:downArrow,
                answer:"2.登录“兜礼”-“首页”-“我的”- “可用积分”，点击“可用积分服务”即可看到您的兜礼积分可兑换的服务。<br>"+
                "3.选择使用兜礼积分结算，确认支付，输入手机验证码后，最终确认抵扣兜礼积分数。 <br>" +
                "4.积分有效期最长为2年，从积分进入会员帐户开始起算。超过有效期仍未及时兑换的，则此部分过期积分将逾期失效并作归零处理。<br>" 
              },
              {
                id:3,
                question:"关于发票",
                arrowImg:downArrow,
                answer:"5.兜礼会员在使用兜礼积分进行兑换时不开具发票。"
              },
              {
                id:4,
                question:"关于服务细则",
                arrowImg:downArrow,
                answer:"6.您可以登录“兜礼”- “我的”- “联系客服”，也可以选择拨打400-1582-212客服电话咨询相关服务信息。<br>"+
                       "咨询时间："+dooolyConfig.serviceTime+"<br>" +
                      "注：<br>"+
                      "(1).兜礼积分不设找零、不兑现、不记名、不挂失、遗失不补。<br>" +
                      "(2).如果使用通过不正当手段获得的积分，兜礼有权利关闭此客户的账户或要求此客户通过其它方式支付。<br>" +
                      "(3).关于积分规则的变更、终止全部或部分规则，请您自行关注兜礼平台页面。<br>" +
                      "(4).无论您的兜礼账户因何种原因被注销,您的兜礼积分将自动丧失,兜礼无须为您的积分损失承担任何责任。<br>" +  
                      "(5).兜礼积分规则以本平台公布的最新版本为准,最终解释权由兜礼所有。" 
              },
            ],
            checkAnswer:"",
            popupVisible:false,
            serviceTime:dooolyConfig.serviceTime,
          }

      },
      created(){
        initTitle('常见问题','')
      },
      mounted(){
      },
      methods:{
        checkBtn:function (id,index) {
          for(let i= 0;i<this.questionList.length;i++){
            this.questionList[i].arrowImg=downArrow;
          }
          if(this.checkAnswer==id){
            this.checkAnswer="";
            this.questionList[index].arrowImg=downArrow
          }
          else{
            this.checkAnswer=id;
            this.questionList[index].arrowImg=upArrow
          }
        },
        satisfied:function (index) {
          this.checkAnswer="";
          this.questionList[index].arrowImg=downArrow
        },
        nonSatisfied:function () {
          this.popupVisible=true;
        },
        closeBtn:function () {
          this.popupVisible=false;
        },
        dailBtn:function () {
          dooolyAPP.callPhone("4001582212");
        }
      }
    }
</script>

<style scoped>
  .homeBox {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: #f5f5f5;
    overflow-y: scroll;
  }
  .questions{margin-top: 0.22rem;}
  .questions span{font-size: 0.28rem}
  .questions section{
    font-size: 0;
    padding: 0 0.3rem;
    background-color: #ffffff;
  }
  .top_div{
    padding: 0.3rem 0 0.28rem 0;
    border-bottom: solid 1px #fafafa;
    overflow: hidden;
  }
  .rightImg{height: 0.4rem; line-height: 0.4rem;}
  .rightImg img{display: inline-block;width: 0.28rem;height: 0.16rem;vertical-align: middle}
  .main_div{background-color: #ffffff;}
  .main_div .answer{
    padding: 0.24rem 0.46rem 0.36rem 0.3rem; font-size: 0;
  }
  .main_div .answer span{color: #999999}
  .btn_div{background-color:#fafafa; font-size: 0;height: 0.9rem;overflow: hidden}
  .btn{width: 49%; text-align: center; border-right: solid 1px #ECECEC;margin-top: 0.26rem}
  .btn img{width: 0.4rem; height: 0.4rem;margin-right: 0.18rem;vertical-align: middle}
  .btn input{background-color: inherit;vertical-align: middle;color: #333333; font-size: 0.28rem}
  .btn-last{border-right: none}
  .fl{float: left}
  .fr{float: right}

  .coverBg{position: fixed;left: 0;top: 0; width: 100%;height: 100%;background:rgba(0,0,0,0.4);z-index: 9999;}
  .alt_title{font-size: 0.32rem; padding-bottom:0.2rem;width:100%;text-align:center;background: #fff!important;margin-top:0.5rem;font-weight:bold}
  .alt_nonentity{position: absolute;width:80%;min-height: 3rem;left:10%;top: 30%;background: #fff;border-radius: 0.2rem;z-index: 100000;}
  .alt_title{margin-top: 0.6rem;font-size: 0.36rem;}
  .model_btn_div{width:100%;display:block;border-top:1px solid #ececec;height:1rem;line-height:1rem;margin-top: 0.3rem;border-radius: 0 0 5px 5px;}
  .model_btn_div .cancel,.model_btn_div .active{float:left;display: inline-block;
    width:49.9%;background: #fff;
    line-height:1rem;font-size: 0.32rem;
    text-align: center;
    border: none;
  }
  .model_btn_div .cancel{color:#333;border-right:1px solid #ececec;border-radius: 0 0 0 0.2rem;}
  .model_btn_div .active{color:#ee3f44;border-radius: 0 0 0.2rem 0;}

  .model_con{line-height: 0.42rem;font-size: 0.3rem;color: #999;text-align: center;padding:0 0.26rem;}
</style>
