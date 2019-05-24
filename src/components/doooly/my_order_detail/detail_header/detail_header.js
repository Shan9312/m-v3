// import img
import noScore from '@/assets/images/personalCenter/myOrder/no_score.png' // 无返积分
import tradeCancel from '@/assets/images/personalCenter/myOrder/trade_cancel.png' // 交易取消
import waitPayment from '@/assets/images/personalCenter/myOrder/wait_payment.png' // 待付款
import { countRebateState } from '@/components/doooly/my_order_list/model/rebate.js'

const detailHeader = {
  props: {
    isUserRebate: null,
    userRebate: null,
    type: null,
    state: '',
    courierNumber: '', // 物流单号
    integrateReturnDate: {
      type: String,
      default: ''
    },
    minutes: Number,
    seconds: Number
  },
  data () {
    return {
      statusCardImg: null,
      userRebateState: 0,
      tipsText: '',
      showContentTitle: '',
      showContentTips: ''
    }
  },
  created () {
    this.computedRebateMsg()
    console.log(this.courierNumber)
  },
  methods: {
    computedRebateMsg () {
      this.userRebateState = countRebateState(this.isUserRebate, this.userRebate, this.type)
      if (this.userRebateState === 1) { // 已完成-已返利
        this.tipsText = '返积分到账'
        this.showContentTitle = '返积分金额'
        this.showContentTips = this.integrateReturnDate + '发放完成'
        this.statusCardImg = noScore
      } else if (this.userRebateState === 2) { // 已完成-预返利
        this.tipsText = '返积分进行中'
        this.showContentTitle = '预计返积分金额'
        this.showContentTips = this.integrateReturnDate + '发放积分'
        this.statusCardImg = noScore
      } else if (this.userRebateState === 3) { // 待支付-预返积分
        this.tipsText = '' // 页面判断
        this.showContentTitle = '预计返积分金额'
        this.showContentTips = '支付完成后计算积分到账时间，否则订单将自动取消'
        this.statusCardImg = waitPayment
      } else if (this.userRebateState === 4) { // 待支付-无返积分
        this.tipsText = '' // 页面判断
        this.showContentTitle = '根据商家规则无返利'
        this.statusCardImg = waitPayment
      } else if (this.userRebateState === 5) { // 已完成-无返积分
        this.tipsText = '无返积分'
        this.showContentTitle = '根据商家规则无返利'
        this.statusCardImg = noScore
      } else if (this.userRebateState === 6) { // 已取消-无返积分
        this.tipsText = '交易取消'
        this.showContentTitle = '未成功交易订单无返利'
        this.statusCardImg = tradeCancel
      } else {
        this.tipsText = '无返积分'
        this.showContentTitle = '根据商家规则无返利'
        this.statusCardImg = noScore
      }
    },
    // 一键回收
    handlRecycling () {
      this.$messageBox({
        title: '发起一键回收',
        message: '请确认是否发起一键回收',
        showCancelButton: true
      }).then(action => {
        if (action === 'cancel') return
        if (this.courierNumber) {
          this.$router.push({path: '/loveRecycling'}) // 有快递信息进入爱回收页面
        } else {
          this.$router.push({path: '/RecyclingConfirm'}) // 无快递信息进入回收确认页
        }
      })
    }
  }
}
export default detailHeader
