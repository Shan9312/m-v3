// import img
import noScore from '@/assets/images/personalCenter/myOrder/no_score.png' // 无返积分
import tradeCancel from '@/assets/images/personalCenter/myOrder/trade_cancel.png' // 交易取消
import waitPayment from '@/assets/images/personalCenter/myOrder/wait_payment.png' // 待付款
import { countRebateState } from '@/components/doooly/my_order_list/model/rebate.js'
// 兼容所有浏览器
// ios 使用 new Date("2010-03-15 10:30:00").getTime() 获取时间戳报错
// @time "2010-03-15 10:30:00"
const getTs = time => {
  let arr = time.split(/[- :]/),
    _date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]),
    timeStr = Date.parse(_date)
  return timeStr
}
const detailHeader = {
  props: {
    orderDetail: null,
    isUserRebate: null,
    userRebate: null,
    type: null,
    state: '',
    courierNumber: '', // 物流单号
    integrateReturnDate: {
      type: String,
      default: ''
    },
    minutes: 0,
    seconds: 0
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
          // 有快递信息进入爱回收页面
          dooolyAPP.redirectActivity(`loveRecycling?orderNumber=${this.orderDetail.orderNumber}`)
        } else {
          // 无快递信息进入回收确认页
          dooolyAPP.redirectActivity(`RecyclingConfirm?orderNumber=${this.orderDetail.orderNumber}`)
        }
      })
    },
    // 查看回收进度
    handlProgress () {
      const { after2Date, recoveryState } = this.orderDetail
      if (after2Date) { // 确认回收后未超过48小时点击按钮提示弹框，超过48小时，after2Date自动为空值
        this.$messageBox({
          title: '您的商品还在估价中',
          message: `预计${after2Date}完成估价`
        })
      } else {
        // 此时未填写支付宝信息，recoveryState的值为2，填写支付宝信息值为3
        if (recoveryState && recoveryState == 2) {
          dooolyAPP.redirectActivity(`Alipay?orderNumber=${this.orderDetail.orderNumber}`)
        } else {
          dooolyAPP.redirectActivity('RecyclingProgress')
        }
      }
    },

    // 回收完成
    handlConfirm () {
      this.$messageBox({
        title: '提示信息',
        message: '您的商品已经回收完成'
      })
    }
  }
}
export default detailHeader
