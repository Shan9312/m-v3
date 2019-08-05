<template>
  <div>
    <div class="detail">
      <div class="sub-tc" v-html="adBusiness.businessIntroduce"></div>
      <div class="footer_bg" :class="{'fix-iphonex-bottom': isIphoneX}"></div>
      <!-- 网易严选特殊处理 -->
      <footer
        class="yanxuan"
        :class="{'fix-iphonex-bottom': isIphoneX}"
        v-show="adBusiness.company === '网易严选'"
      >
        <div class="btn-wrap btn-wrap-left" :class="{'full': isWeChat}" @click="judge(1)">
          <div class="word-wrap">
            立即前往网页版
            <span class="footer_tips single_btn">（即兜礼身份认证）</span>
          </div>
        </div>
        <!-- 2 -->
        <div class="btn-wrap btn-wrap-right" v-if="!isWeChat" @click="judge(2)">
          <div class="word-wrap">
            使用APP
            <!-- <span class="footer_tips single_btn">（即兜礼身份认证）</span> -->
          </div>
        </div>
      </footer>
      <!-- 网易严选end -->
      <footer v-show="footer_type_show == 1 && adBusiness.company !== '网易严选'">
        <div class="fl" @click="judge(1)">
          {{footer_fl}}
          <span
            class="footer_tips"
            v-if="adBusiness.isSupportIntegral !== '1'"
          >(该商户暂不可用兜礼积分)</span>
        </div>
        <div class="fr" @click="judge(2)">{{footer_fr}}</div>
      </footer>
      <footer v-show="footer_type_show == 2 && adBusiness.company !== '网易严选'" @click="judge(1)">
        {{footer_fl}}
        <span
          class="footer_tips single_btn"
          v-if="adBusiness.isSupportIntegral !== '1'"
        >(该商户暂不可用兜礼积分)</span>
      </footer>
      <footer v-show="footer_type_show == 3 && adBusiness.company !== '网易严选'" @click="judge(2)">
        {{footer_fr}}
        <span
          class="footer_tips single_btn"
          v-if="adBusiness.isSupportIntegral !== '1'"
        >(该商户暂不可用兜礼积分)</span>
      </footer>
    </div>
    <dialogBox
      :businessId="adBusiness.id"
      v-on:chaildChangeState="chaildDialogState"
      :dialogState="dialogState"
      :detailUrl="dialogBoxData.detailUrl"
      :company="dialogBoxData.company"
      :logo="dialogBoxData.logo"
      :openOneNnumber="dialogBoxData.openOneNnumber"
      :activityType="dialogBoxData.activityType"
    ></dialogBox>
    <toast
      v-if="toastState == 1"
      :toastData="toastData"
      :firstShow="firstShow"
      v-on:child-say="listenToMyBoy"
    ></toast>

    <div class="JDK_alr_bg" v-show="lod_logo_show == '1'">
      <div class="JDK_alr">
        <div class="img">
          <span>
            <img class="logo" src="../../assets/images/equities/logo.png" />
          </span>
          <span>
            <img class="JDK_lod" src="../../assets/images/equities/JDK_lod.gif" />
          </span>
          <span>
            <img class="JDK_logo" :src="toastData.miniLogo" :onerror="defaultImg" />
          </span>
        </div>
        <div class="txt">
          <span class="gray">即将前往</span>
          <br />
          <span class="block">{{toastData.discount}} {{toastData.maxUserRebate}}</span>
          <br />
          <!-- <span class="red" @click="href()">查看此商户介绍</span><br> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from "@/http/http";
import dialogBox from "@/components/common/dialogBox";
import { Wechatshare, shareWithFriendsWX } from "@/assets/js/wechatShare2.js";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import api from "@/assets/js/api.js";
import toast from "@/components/common/toast";

export default {
  name: "businessDetail",
  components: {
    dialogBox,
    toast
  },
  data() {
    return {
      isWeChat: false,
      isIphoneX: false,
      adBusiness: "",
      dealType: this.$route.params.dealType,
      channel: "",
      didi: false,
      id: this.$route.params.id,
      productId: "",
      emitDate: {},
      integral: "***",
      dialogState: false,
      dialogBoxData: {
        detailUrl: "",
        company: "",
        logo: "",
        openOneNnumber: 0
      },
      toastData: {
        miniLogo: "",
        discount: "",
        maxUserRebate: "",
        dealType: "",
        id: "",
        url: ""
      },
      toastState: 0,
      lod_logo_show: 0,
      firstShow: 0,
      footer_type: 0,
      footer_type_show: 0,
      footer_fl: "",
      footer_fr: "",
      diditaost: 0,
      defaultImg:
        'this.src="' +
        require("../../assets/images/shoppingGuide/goods.png") +
        '"',
      bizAccountId: ""
    };
  },
  created() {
    this.judgeIsIphoneX(); // 兼容iphoneX
    http({
      method: "post",
      url: api.userBizRelation,
      data: {
        businessId: this.id
      }
    }).then(res => {
      if (
        res.data.code == 1000 &&
        res.data.data &&
        res.data.data.bizAccountId
      ) {
        this.bizAccountId = res.data.data.bizAccountId;
      }
      http({
        method: "get",
        url:
          api.businessInfoForAjax +
          "?token=" +
          localStorage.token +
          "&dealType=" +
          this.dealType +
          "&id=" +
          this.id
      }).then(res => {
        if (res.data) {
          this.adBusiness = res.data.data.adBusiness;
          this.productId = res.data.productId;
        }
      });
    });
    //区分APP与安卓
    if (
      browserName == "WebKit" ||
      browserName == "Chrome WebView" ||
      browserName == "otherAPPAndroid" ||
      browserName == "otherAPPIos"
    ) {
      this.channel = 0;
    } else {
      this.channel = 1;
    }
  },
  watch: {
    //详情信息处理
    adBusiness() {
      initTitle(this.adBusiness.company);
      if (this.adBusiness.company === "网易严选") {
        this.getBrowser();
        // 第一次进入弹窗提示
        if (!localStorage.yanxuanFirst) {
          this.$messageBox({
            title: "温馨提示",
            message: "初次使用网易严选的用户，请先进行身份认证再使用兜礼积分",
            confirmButtonText: "立即进行身份认证 >"
          }).then(action => {
            this.judge(1);
          });
        }
        localStorage.yanxuanFirst = 1;
      } else if (this.adBusiness.company === "盒马鲜生" && !this.bizAccountId) {
        // 第一次进入弹窗提示
        this.$messageBox({
          title: "温馨提示",
          message: "初次使用盒马的用户，请先进行盒马账户绑定",
          confirmButtonText: "立即前往"
        }).then(action => {
          this.judge(1);
        });
      }
      //微信端威尔士开启分享
      if (browserName == "WeChat") {
        if (this.adBusiness.company == "威尔士") {
          Wechatshare("hotbusiness", [
            this.adBusiness.id,
            this.adBusiness.dealType
          ]);
        }
      }
      //滴滴出行积分验证
      if (this.adBusiness.company == "滴滴出行") {
        http({
          method: "post",
          url: api.getDiDiIntegral,
          data: {
            businessId: this.adBusiness.id,
            userId: localStorage.userId
          }
        }).then(res => {
          if (res.data.code == 1000) {
            this.diditaost = 1000;
            this.didi = true;
            this.integral = res.data.data.businessIntegral;
          } else if (res.data.code == 1001) {
            this.diditaost = 1;
          } else {
            this.didi = false;
          }
        });
      } else {
        this.diditaost = 1000;
      }
      //弹框信息加载
      this.toastData.miniLogo = this.adBusiness.miniLogo;
      this.toastData.dealType = this.adBusiness.dealType;
      this.toastData.discount = this.adBusiness.discount;
      this.toastData.maxUserRebate = this.adBusiness.maxUserRebate;
      this.toastData.id = this.adBusiness.id;
      this.toastData.url = this.adBusiness.url;
      if (this.toastData.discount == "" || this.toastData.discount == "0") {
        this.toastData.discount = "";
      } else {
        this.toastData.discount = "购物享" + this.toastData.discount + "折";
      }
      if (
        this.toastData.maxUserRebate == "" ||
        this.toastData.maxUserRebate == "0"
      ) {
        this.toastData.maxUserRebate = "";
      } else {
        this.toastData.maxUserRebate =
          "最高返" + this.toastData.maxUserRebate + "%";
      }
      //判断底部按钮显示类型
      this.checkButtonType();
    },
    integral() {
      this.footer_fr = "滴滴余额：" + this.integral + " >";
      //判断底部按钮显示类型
      this.checkButtonType();
    }
  },
  methods: {
    ...mapActions(["addScanAction", "deleteScanAction"]),
    //判断底部按钮显示类型
    checkButtonType() {
      //判断底部按钮显示类型
      if (this.adBusiness.dealType == 0) {
        //线上
        if (this.channel == 0) {
          //线上app端
          if (this.productId > 0) {
            this.footer_type = 1; //线上app(有商品)
            this.footer_type_show = 1;
            this.footer_fl = "立即前往";
            this.footer_fr = "立即订购";
          } else {
            if (this.didi) {
              this.footer_type = 2; //线上app(滴滴)
              this.footer_type_show = 1;
              this.footer_fl = "使用APP";
              this.footer_fr = "滴滴余额：" + this.integral + " >";
            } else if (this.adBusiness.appJumpStyle == 0) {
              this.footer_type = 3; //线上app(跳转类型1)
              this.footer_type_show = 2;
              this.footer_fl = "立即前往";
            } else if (this.adBusiness.appJumpStyle == 1) {
              this.footer_type = 4; //线上app(跳转类型2)
              this.footer_type_show = 2;
              this.footer_fl = "使用APP";
            } else if (this.adBusiness.appJumpStyle == 2) {
              this.footer_type = 5; //线上app(跳转类型3)
              this.footer_type_show = 1;
              this.footer_fl = "立即前往";
              this.footer_fr = "使用APP";
            }
          }
        } else if (this.channel == 1) {
          //线上h5端
          if (this.productId > 0) {
            this.footer_type = 6; //线上h5(有商品)
            this.footer_type_show = 1;
            this.footer_fl = "立即前往";
            this.footer_fr = "立即订购";
          } else {
            if (this.didi) {
              this.footer_type = 7; //线上h5(滴滴)
              this.footer_type_show = 1;
              this.footer_fl = "使用APP";
              this.footer_fr = "滴滴余额：" + this.integral + " >";
            } else if (this.adBusiness.wechatJumpStyle == 0) {
              this.footer_type = 8; //线上h5(跳转类型1)
              this.footer_type_show = 2;
              this.footer_fl = "立即前往";
            } else if (this.adBusiness.wechatJumpStyle == 1) {
              this.footer_type = 9; //线上h5(跳转类型2)
              this.footer_type_show = 2;
              this.footer_fl = "使用APP";
            } else if (this.adBusiness.wechatJumpStyle == 2) {
              this.footer_type = 10; //线上h5(跳转类型3)
              this.footer_type_show = 1;
              this.footer_fl = "立即前往";
              this.footer_fr = "使用APP";
            }
          }
        }
      } else if (this.adBusiness.dealType == 1) {
        //线下
        if (this.productId > 0) {
          this.footer_type = 11; //线下(有商品)
          this.footer_type_show = 1;
          this.footer_fl = "附近商户";
          this.footer_fr = "立即订购";
        } else if (this.adBusiness.openOffLineScan == 1) {
          this.footer_type = 12; //线下(有扫码优惠)
          this.footer_type_show = 1;
          this.footer_fl = "附近商户";
          this.footer_fr = "付款码";
        } else {
          this.footer_type = 13; //线下
          this.footer_type_show = 2;
          this.footer_fl = "附近商户";
        }
      }
      //进行url非空校验
      if (
        this.footer_type == 1 ||
        this.footer_type == 3 ||
        this.footer_type == 5 ||
        this.footer_type == 6 ||
        this.footer_type == 8 ||
        this.footer_type == 10
      ) {
        if (!this.toastData.url) {
          if (this.footer_type_show == 1) {
            this.footer_type_show = 3;
          } else if (this.footer_type_show == 2) {
            this.footer_type_show = 0;
          }
        }
      }
      if (
        this.footer_type == 2 ||
        this.footer_type == 4 ||
        this.footer_type == 7 ||
        this.footer_type == 9 ||
        this.footer_type == 5 ||
        this.footer_type == 10
      ) {
        if (!this.adBusiness.appUrl) {
          if (this.footer_type_show == 1) {
            this.footer_type_show = 2;
          } else if (this.footer_type_show == 2 || this.footer_type_show == 3) {
            this.footer_type_show = 0;
          }
        }
      }
    },
    judge(type) {
      if (this.adBusiness.upGradeState == 2) {
        if (this.adBusiness.company == "唯品会") {
          this.$messageBox({
            title: this.adBusiness.company + "会员权益正在开通中",
            message:
              this.adBusiness.company +
              "会员权益正在开通中,将在1-2个工作日内开通完成",
            confirmButtonText: "我知道了"
          });
        } else {
          this.$messageBox({
            title: this.adBusiness.company + "会员权益正在开通中",
            message: "",
            confirmButtonText: "我知道了"
          });
        }
        return;
      } else if (
        this.adBusiness.upGradeState == 1 ||
        this.adBusiness.upGradeState == 3
      ) {
        this.$messageBox({
          title: this.adBusiness.company + "会员权益升级失败",
          message: "",
          confirmButtonText: "联系客服",
          cancelButtonText: "取消",
          showCancelButton: true
        }).then(action => {
          if (action == "confirm") {
            dooolyAPP.callPhone("4001582212");
          }
        });
        return;
      }
      if (this.diditaost == 0) {
        return;
      }
      if (this.diditaost == 1) {
        this.$messageBox({
          title: "无法享受会员权益",
          message:
            "由于您已加入其他企业享受企业用车服务，无法与兜礼企业用车服务同享。请在滴滴出行企业版APP中修改企业用车权限。",
          confirmButtonText: "我知道了"
        });
        return;
      }
      if (type == 1) {
        //左边按键点击事件
        if (
          this.footer_type == 1 ||
          this.footer_type == 3 ||
          this.footer_type == 5 ||
          this.footer_type == 6 ||
          this.footer_type == 8 ||
          this.footer_type == 10
        ) {
          this.business();
        } else if (
          this.footer_type == 2 ||
          this.footer_type == 4 ||
          this.footer_type == 7 ||
          this.footer_type == 9
        ) {
          this.link(this.adBusiness.appUrl, 1);
        } else if (
          this.footer_type == 11 ||
          this.footer_type == 12 ||
          this.footer_type == 13
        ) {
          this.businessDetail();
        }
        let btnName = this.footer_fl;
        if (!this.footer_fl) {
          btnName = "前往h5";
        }
        this.$baiduStats(
          "商户中心-" + this.adBusiness.company + "-" + btnName,
          this.adBusiness.company
        );
      } else if (type == 2) {
        //右边按键点击事件
        if (
          this.footer_type == 1 ||
          this.footer_type == 6 ||
          this.footer_type == 11
        ) {
          this.link("", "", this.productId);
        } else if (this.footer_type == 2 || this.footer_type == 7) {
          dooolyAPP.gotoJumpVue.call(
            this,
            "/didi_integral/" + this.toastData.id
          );
        } else if (this.footer_type == 5 || this.footer_type == 10) {
          this.link(this.adBusiness.appUrl, 1);
        } else if (this.footer_type == 12) {
          this.linkscan();
        }
        let btnName = this.footer_fl;
        if (!this.footer_fl) {
          btnName = "使用APP";
        }
        this.$baiduStats(
          "商户中心-" + this.adBusiness.company + "-" + btnName,
          this.adBusiness.company
        );
      }
    },
    business() {
      if (this.adBusiness.openOneNnumber == 1) {
        this.toastData.openOneNnumberId = this.toastData.id;
        this.toastData.openOneNnumberUrl = this.toastData.url;
        this.toastData.openOneNnumber = 1;
        this.toastState = 1;
        this.firstShow = 1;
      } else {
        if (document.title == "京东返利") {
          if (
            this.toastData.discount != "" &&
            this.toastData.discount != "0" &&
            this.toastData.maxUserRebate != "" &&
            this.toastData.maxUserRebate != "0"
          ) {
            this.toastData.discount = this.toastData.discount + ",";
          }
          this.lod_logo_show = 1;
          this.timeOut = setTimeout(() => {
            this.gotoJumpJq1(this.toastData.url);
          }, 2000);
        } else {
          this.toastState = 1;
          this.firstShow = 1;
        }
      }
    },
    listenToMyBoy(data) {
      this.firstShow = 0;
      this.toastState = 0;
    },
    gotoJumpJq1(url) {
      this.lod_logo_show = 0;
      clearTimeout(this.timeOut);
      if (
        browserName == "WebKit" ||
        browserName == "otherAPPIos" ||
        browserName == "Chrome WebView" ||
        browserName == "otherAPPAndroid"
      ) {
        dooolyAPP.openJDHome();
      } else {
        window.location.href = url + "&mopenbp5=" + localStorage.mobile;
      }
    },
    href() {
      this.lod_logo_show = 0;
      clearTimeout(this.timeOut);
      dooolyAPP.gotoJumpVue.call(
        this,
        "/businessinfo/" + this.toastData.dealType + "/" + this.toastData.id
      );
    },
    chaildDialogState(data) {
      this.dialogState = false;
    },
    //link是vue和jquery混用
    link(link, type, id) {
      // 跳转线上app特殊处理2\4\5
      if (
        this.footer_type === 2 ||
        this.footer_type === 4 ||
        this.footer_type === 5
      ) {
        dooolyAPP.androidGoMerchantApp(
          this.adBusiness.company,
          this.adBusiness.appUrl
        );
        return false;
      } else {
        if (type == 1) {
          dooolyAPP.gotoJumpJq.call(this, link);
        } else {
          dooolyAPP.gotoJumpVue.call(this, "/cardBuyDetail/" + id);
        }
      }
    },
    businessDetail() {
      dooolyAPP.openMapView.call(
        this,
        this.adBusiness.company,
        this.adBusiness.id
      );
    },
    linkscan() {
      dooolyAPP.openScanDiscount.call(this);
    },
    judgeIsIphoneX() {
      let isIphoneX =
        window.devicePixelRatio &&
        window.devicePixelRatio === 3 &&
        window.screen.width === 375 &&
        testUA("iPhone");
      this.isIphoneX = isIphoneX;
      function testUA(str) {
        return navigator.userAgent.indexOf(str) > -1;
      }
    },
    getBrowser() {
      let parser = new UAParser();
      let result = parser.getResult();
      let name = result.browser.name;
      this.isWeChat = name === "WeChat";
    }
  }
};
</script>
<style>
img {
  width: 100%;
}
</style>
<style scoped>
.footer_bg {
  width: 100%;
  height: 1rem;
}
.detail {
  position: relative;
  width: 100%;
}
.sub-tc {
  width: 100%;
  font-size: 18px;
  position: relative;
}
.sub-tc img {
  width: 100%;
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  text-align: center;
  width: 100%;
  font-size: 0.34rem;
  background: #ee3f44;
  line-height: 1rem;
  color: #fff;
}
footer div {
  width: 50%;
  font-size: 0.32rem;
  line-height: 1rem;
  text-align: center;
}
footer .fl {
  background: #fff;
  color: #333;
  border-top: 1px solid #ececec;
}
footer .fr {
  background: #ee3f44;
  color: #fff;
}
footer .footer_tips {
  width: 50%;
  position: absolute;
  bottom: 0;
  left: 0;
  line-height: normal;
  font-size: 0.24rem;
  color: #ccc;
}
footer .footer_tips.single_btn {
  width: 100%;
  color: #f9c5c7;
}
/* 网易严选 */
.yanxuan {
  background: #fff;
}
.yanxuan .btn-wrap-left {
  float: left;
  padding-bottom: 0.2rem;
  background: #ee3f44;
}
.yanxuan .btn-wrap-left.full {
  width: 100%;
}
.yanxuan .btn-wrap-right {
  float: left;
  height: 1.2rem;
  line-height: 1.2rem;
  background: #fff;
  color: #333;
  border-top: 1px solid #ececec;
}
.yanxuan .btn-wrap .word-wrap {
  position: relative;
  width: 100%;
}
.yanxuan .btn-wrap-right .word-wrap {
  height: 100%;
  line-height: 1.2rem;
}
.yanxuan.fix-iphonex-bottom {
  padding-bottom: 0.68rem;
}
.footer_bg.fix-iphonex-bottom {
  height: 1.68rem;
}
/* end */
.novice {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.novice img {
  width: 100%;
  height: 100%;
}
/*跳转弹出框*/
.JDK_alr_bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
}
.JDK_alr {
  position: fixed;
  width: 5.2rem;
  height: 3.56rem;
  left: 50%;
  top: 50%;
  margin-left: -2.6rem;
  margin-top: -1.78rem;
  background: #ffffff;
  border-radius: 0.2rem;
  z-index: 10000;
  font-size: 0;
  text-align: center;
}
.JDK_alr .img {
  margin-top: 0.6rem;
}
.JDK_alr .img span {
  display: inline-block;
  vertical-align: top;
}
.JDK_alr .img span img {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 100%;
}
.JDK_alr .img span .JDK_lod {
  width: 1.4rem;
  height: auto;
  margin: 0 0.28rem;
  margin-top: 0.38rem;
}
.JDK_alr .txt {
  margin-top: -0.08rem;
}
.JDK_alr .txt span {
  display: inline-block;
}
.JDK_alr .txt .gray {
  font-size: 0.24rem;
  color: #999;
  line-height: 100%;
}
.JDK_alr .txt .block {
  font-size: 0.32rem;
  color: #333;
  margin-top: 0.5rem;
  line-height: 100%;
}
.JDK_alr .txt .red {
  margin-top: 0.3rem;
  font-size: 0.24rem;
  line-height: 100%;
  color: #ee3f44;
  padding-right: 0.2rem;
  background: url(../../assets/images/equities/enter.png) no-repeat top right;
  background-size: 0.12rem 0.2rem;
}
</style>
