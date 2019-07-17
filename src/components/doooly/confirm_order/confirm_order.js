import http from '@/http/http'
import api from '@/assets/js/api.js'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

const confirmOrder = {
  data () {
    return {
      activityName: (!this.$route.params.activityName || this.$route.params.activityName == 0 ? '' : this.$route.params.activityName),
      userDeliveryList: [],
      postData: [],
      confirmClassObj: { click_btn: false },
      viewShow: false,
      isBankNumber: false, // 是否需要银行卡号
      cardNumber: '', // 银行卡号
      mobile: '', // 手机号码
      bankError: '', // 银行卡错误
      mobileError: '', // 手机号错误
      formData: null, // 提交数据
      disabled: false // 按钮控制
    }
  },
  created () {
    initTitle('确认订单')
    if (this.$route.params.productId) {
      const { productId, skuId, productTypeId, activityName } = this.$route.params
      this.loadCardBuyDetailList(productId, skuId, productTypeId, activityName)
      this.ccbLoadCardBuyDetailList()
    } else {
      this.getUserDelivery()
      this.postData = this.cardbuy
    }
    if (location.hash === '#/' || location.hash === '#') {
      window.history.go(-1)
    }
  },
  computed: {
    ...mapState(['cardbuy'])
  },
  filters: {
    formatPrice (value) {
      let total = 0
      if (value.length > 0) {
        if (value[0]) {
          total = value[0].sellPrice
        }
        if (value[0] && value[1]) {
          total = (parseInt(value[0].sellPrice) + parseInt(value[1].sellPrice)).toFixed(2)
        }
      }
      return total
    }
  },
  methods: {
    // 建行一元购
    ccbLoadCardBuyDetailList () {
      const { productId, skuId, productTypeId } = this.$route.query
      if (productId && skuId && productTypeId) {
        this.loadCardBuyDetailList(productId, skuId, productTypeId)
      }
    },
    loadCardBuyDetailList (productId, skuId, productTypeId, activityName = false) {
      if (activityName === 'pickUpGoods') activityName = ''; // TODO 如果是东航提货券活动，不需要传activityName，这里的activityName只是用于在收银台判断跳哪个支付结果页
      http({
        method: 'post',
        url: api.detailForAjax,
        data: {
          userId: localStorage.userId,
          productId: productId,
          activityName: activityName,
          token: localStorage.token
        }
      }).then((res) => {
        let checkindex = 0
        if (res.data.code == 1000) {
          res.data.data.skuList.forEach((item, index) => {
            if (item.id == skuId) {
              checkindex = index
            }
          })
          let postData = {
            productType: productTypeId,
            merchantProduct: [{
              merchantId: res.data.data.selfProduct.businessId,
              remarks: '',
              productSku: [{
                'productId': res.data.data.selfProduct.id,
                'skuId': skuId,
                'buyNum': 1
              }]
            }],
            img: res.data.data.imagesList[0],
            name: res.data.data.selfProduct.name,
            specification: res.data.data.skuList.length > 0 ? res.data.data.skuList[checkindex].specification : '',
            sellPrice: res.data.data.skuList.length > 0 ? res.data.data.skuList[checkindex].sellPrice : '',
            giftBagId: (!this.$route.params.giftBagId || this.$route.params.giftBagId == 0 ? '' : this.$route.params.giftBagId),
            orderType: res.data.data.selfProduct.productAttr
          }
          this.postData = [...this.postData, postData]
          this.getUserDelivery()
        }
      })
    },
    getUserDelivery () {
      http({
        method: 'get',
        url: api.getUserDelivery
      }).then((data) => {
        if (data.data.userDeliveryList) {
          if (this.$cookies.get('addressDataList')) {
            this.userDeliveryList = data.data.userDeliveryList[this.$cookies.get('addressDataList')]
          } else {
            this.userDeliveryList = data.data.userDeliveryList[0]
          }
          this.confirmClassObj = { click_btn: true }
        } else {

        }
        this.viewShow = true
      })
    },
    link () {
      dooolyAPP.gotoJumpVue.call(this, '/userDeliveryList')
    },

    // 提交订单
    async refer () {
      if (!this.userDeliveryList || this.userDeliveryList.length <= 0) {
        this.$toast('请选择收货地址')
        return
      }
      // 建行一元购活动存在两个商品
      if (this.postData[1]) {
        http({
          method: 'post',
          url: api.getOrderBuy,
          data: { businessId: this.$route.query.businessId }
        }).then((res) => {
          if (res.data.code == 1000) {
            if (res.data.data) {
              this.$toast('活动名额已满！')
            } else {
              this.isBankNumber = true
            }
          } else {
            this.$toast(res.data.mess || '参数错误')
          }
        })
      } else {
        this.formData = {
          'token': localStorage.token,
          'userId': localStorage.userId,
          'groupId': localStorage.groupId,
          'consigneeName': this.userDeliveryList.receiverName,
          'consigneeMobile': this.userDeliveryList.receiverTelephone,
          'consigneeAddr': this.userDeliveryList.province + this.userDeliveryList.city + this.userDeliveryList.area + this.userDeliveryList.address,
          'productType': this.$route.params.productTypeId,
          'giftBagId': this.postData[0].giftBagId,
          'orderType': this.postData[0].orderType,
          'orderExt': {
            'type': this.postData[0].productType
          },
          'merchantProduct': [{
            'merchantId': this.postData[0].merchantProduct[0].merchantId,
            'remarks': '',
            'orderType': this.postData[0].orderType,
            'productSku': [{
              'productId': this.postData[0].merchantProduct[0].productSku[0].productId,
              'skuId': this.postData[0].merchantProduct[0].productSku[0].skuId,
              'buyNum': 1
            }],
            'subProductType': parseInt(this.postData[0].productType)
          }]
        }
        http({
          method: 'post',
          url: api.createOrder_v2_2,
          notNeedTransfer: true,
          data: this.formData
        }).then((res) => {
          if (res.data.code == 1000) {
            let orderNum = res.data.data.orderNum
            let url = '/cardBuyPay/' + orderNum
            if (this.activityName && this.activityName !== '0' && this.activityName !== 'false') {
              let activityObj = {}
              activityObj[orderNum] = this.activityName
              localStorage.activity = JSON.stringify(activityObj)
            }
            dooolyAPP.redirectPay(orderNum)
          } else if (res.data.code == 2001) {
            this.$toast('您有笔相同订单尚未支付，请勿重复提交，立即前往支付吧')
          } else if (res.data.code == 2002) {
            this.$toast('您的身份证已在该门店购买过，请勿重复下单')
          } else {
            if (res.data.msg) {
              this.$toast(res.data.msg)
            } else {
              this.$toast('订单提交失败，请重试')
            }
          }
        })
      }
      this.$baiduStats('提交订单页面-提交订单-确认提交')
    },
    // 验证银行卡号
    cardBlur () {
      const { cardNumber } = this
      const myreg = /^[1-9]\d{10,19}$/
      if (cardNumber) {
        if (!myreg.test(cardNumber)) {
          this.bankError = '请输入正确的银行卡号'
        } else {
          this.bankError = ''
        }
      } else {
        this.bankError = '请输入银行卡号'
      }
    },
    // 验证手机号码
    mobileBlur () {
      const { mobile } = this
      const myreg = /^1[3456789]\d{9}$/
      if (mobile) {
        if (!myreg.test(mobile)) {
          this.mobileError = '请输入正确的手机号'
        } else {
          this.mobileError = ''
        }
      } else {
        this.mobileError = '请输入手机号'
      }
    },
    // 确定提交
    handlBankSub () {
      const { mobile, cardNumber, mobileError, bankError, postData } = this
      if (mobile && cardNumber && postData[1]) {
        if (!mobileError && !bankError) {
          this.disabled = true
          this.formData = {
            'token': localStorage.token,
            'userId': localStorage.userId,
            'groupId': localStorage.groupId,
            'businessId': this.$route.query.businessId || '',
            'cardNumber': cardNumber,
            'mobile': mobile,
            'consigneeName': this.userDeliveryList.receiverName,
            'consigneeMobile': this.userDeliveryList.receiverTelephone,
            'consigneeAddr': this.userDeliveryList.province + this.userDeliveryList.city + this.userDeliveryList.area + this.userDeliveryList.address,
            'productType': this.$route.params.productTypeId,
            'giftBagId': this.postData[0].giftBagId,
            'orderType': this.postData[0].orderType,
            'orderExt': {
              'type': this.postData[0].productType
            },
            'merchantProduct': [{
              'merchantId': this.postData[0].merchantProduct[0].merchantId,
              'remarks': '',
              'orderType': this.postData[0].orderType,
              'productSku': [{
                'productId': this.postData[0].merchantProduct[0].productSku[0].productId,
                'skuId': this.postData[0].merchantProduct[0].productSku[0].skuId,
                'buyNum': 1
              }],
              'subProductType': parseInt(this.postData[0].productType)
            }, {
              'merchantId': this.postData[1].merchantProduct[0].merchantId,
              'remarks': '',
              'orderType': this.postData[1].orderType,
              'productSku': [{
                'productId': this.postData[1].merchantProduct[0].productSku[0].productId,
                'skuId': this.postData[1].merchantProduct[0].productSku[0].skuId,
                'buyNum': 1
              }],
              'subProductType': parseInt(this.postData[1].productType)
            }]
          }
          http({
            method: 'post',
            url: api.createOrder_CCB,
            notNeedTransfer: true,
            data: this.formData
          }).then((res) => {
            this.disabled = false
            if (res.data.code == 1000) {
              let orderNum = res.data.data.orderNum
              let url = '/cardBuyPay/' + orderNum
              if (this.activityName && this.activityName !== '0' && this.activityName !== 'false') {
                let activityObj = {}
                activityObj[orderNum] = this.activityName
                localStorage.activity = JSON.stringify(activityObj)
              }
              dooolyAPP.redirectPay(orderNum)
            } else if (res.data.code == 2016 && res.data.data) {
              window.scrollTo(0, 0) // IOS弹出键盘将页面顶走
              this.$messageBox({
                title: '提醒',
                message: '您有一笔订单尚未支付',
                confirmButtonText: '立即支付',
                confirmButtonClass: 'confirm-order',
                closeOnClickModal: false
              }).then(action => {
                dooolyAPP.redirectPay(res.data.data.orderNumber)
              })
            } else {
              if (res.data.msg) {
                this.$toast(res.data.msg)
              } else {
                this.$toast('订单提交失败，请重试')
              }
            }
          })
        }
      } else {
        this.$toast('请将信息填写完整')
      }
    }
  }
}

export default confirmOrder
