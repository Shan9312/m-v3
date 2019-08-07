<template>
  <div class="homeBox">
    <div v-for="(item,index) in questionList" :key="index" >
      <div class="questions">
        <section @click="checkBtn(item.id,index)">
          <div  class="top_div">
            <span>{{item.question}}</span>
            <div  class="rightImg fr" >
              <img :src="item.arrowImg || downArrow">
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
    <div class="button_bg" style="width:100%;height:0.9rem;"></div>
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
    export default {
      name: "helpCenter",
      data(){
        return {
          questionList:dooolyConfig.questionList,
          checkAnswer:"",
          popupVisible:false,
          downArrow:require("../../assets/images/personalCenter/helpCenter/downArrow.png"),
          upArrow:require("../../assets/images/personalCenter/helpCenter/upArrow.png"),
          serviceTime:dooolyConfig.serviceTime,
        }
      },
      created(){
        dooolyAPP.initTitle('帮助中心','')
      },
      mounted(){
      },
      methods:{
        checkBtn:function (id,index) {
          for(let i= 0;i<this.questionList.length;i++){
            this.questionList[i].arrowImg=this.downArrow;
          }
          if(this.checkAnswer==id){
            this.checkAnswer="";
            this.questionList[index].arrowImg=this.downArrow
          }
          else{
            this.checkAnswer=id;
            this.questionList[index].arrowImg=this.upArrow
          }
        },
        satisfied:function (index) {
          this.checkAnswer="";
          this.questionList[index].arrowImg=this.downArrow
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
