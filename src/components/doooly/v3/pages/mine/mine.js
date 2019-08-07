import { getUserProfile } from 'v3/services'
import v0Img from 'v3/assets/images/mine/v0.png'
import v1Img from 'v3/assets/images/mine/v1.png'
import v2Img from 'v3/assets/images/mine/v2.png'
import v3Img from 'v3/assets/images/mine/v3.png'
import v4Img from 'v3/assets/images/mine/v4.png'
import v5Img from 'v3/assets/images/mine/v5.png'
import v6Img from 'v3/assets/images/mine/v6.png'

export default {
  name: 'mine',
  data () {
    return {
      // newCancelFlag: false,
      // newFinishFlag: false,
      // newOrderFlag: false,
      browserName: browserName,

      availablePoints: 0,
      memberName: '',
      giftBagCount: 0,
      couponNum: 0,
      levelArr: [v0Img, v1Img, v2Img, v3Img, v4Img, v5Img, v6Img],
      groupLevel: 0,
      groupName: '',
      miniLogoUrl: '',
      equityLogoUrlArr: [],
      hasMoreEquity:false,
      pendingPaymentFlag: false, // 待支付订单
      recentArrivalFlag: false, // 最近到账
      recentlyPlacedOrderFlag: false, // 最近下单
      imminentArrivalFlag: false // 即将到账
    }
  },
  created () {
    dooolyAPP.initTitle('我的', 6)
  },
  mounted () {
    this.getUserProfile()
  },
  methods: {
    async getUserProfile () {
      let { data } = await getUserProfile(localStorage.userId)
      let resData = data && data.data
      if(resData){
        this.availablePoints = resData.availablePoints
        this.memberName = resData.memberName
        this.groupLevel = resData.groupLevel
        this.giftBagCount = resData.giftBagCount
        this.couponNum = resData.couponNum
        this.pendingPaymentFlag = resData.pendingPaymentFlag
        this.recentArrivalFlag = resData.recentArrivalFlag
        this.recentlyPlacedOrderFlag = resData.recentlyPlacedOrderFlag
        this.imminentArrivalFlag = resData.imminentArrivalFlag

        this.miniLogoUrl = resData.adGroup && resData.adGroup.miniLogoUrl
        this.groupName = resData.adGroup && resData.adGroup.groupName
        this.hasMoreEquity = resData.hasMoreEquity
        resData.groupEquitys && resData.groupEquitys.forEach(equitys => {
          equitys.equityLogo && this.equityLogoUrlArr.push(equitys.equityLogo)
        })
        if (resData.isPayPassword) {
          localStorage.isPayPassword = resData.isPayPassword
          localStorage.isSetPayPassword = resData.isSetPayPassword
        }
      }
    },
    jump (direct, urlStr) {
      if ([4, 5, 6].indexOf(direct) !== -1) {
        // this.newOrderFlag = false;
        // this.newFinishFlag = false;
        // this.newCancelFlag = false;
      }
      dooolyAPP.gotoJumpVue(this.$router, urlStr)
      // baiduStatsMsgObj[direct] && this.$baiduStats(baiduStatsMsgObj[direct])
    },
    jumpGiftList () {
      dooolyAPP.redirectActivity('giftList?type=0')
    },
    jumpPersonalInfo () {
      let jsonObj = {
        jumpType: 'Native',
        jumpUrl: 'AccountSecurity'
      }
      if (browserName == 'WebKit') {
        window.webkit.messageHandlers.gotoNativeJump.postMessage(
          JSON.stringify(jsonObj)
        )
      } else if (browserName == 'Chrome WebView') {
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj))
      } else {
        this.$router.push({
          name: 'accountSecurity',
          params: { userid: localStorage.userId }
        })
      }
    }
  }
}
