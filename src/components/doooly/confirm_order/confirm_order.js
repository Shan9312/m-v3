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
      viewShow: false
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
          total = (Number(value[0].sellPrice) + Number(value[1].sellPrice)).toFixed(2)
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
            specification: res.data.data.skuList[checkindex].specification,
            sellPrice: res.data.data.skuList[checkindex].sellPrice,
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
      let data = {
        'token': localStorage.token,
        'userId': localStorage.userId,
        'groupId': localStorage.groupId,
        'consigneeName': this.userDeliveryList.receiverName,
        'consigneeMobile': this.userDeliveryList.receiverTelephone,
        'consigneeAddr': this.userDeliveryList.province + this.userDeliveryList.city + this.userDeliveryList.area + this.userDeliveryList.address,
        'productType': this.postData[0].productType,
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

          }]
        }]
      }
      // 建行一元购活动存在两个商品
      if (this.postData[1]) {
        data.merchantProduct.push({
          'merchantId': this.postData[1].merchantProduct[0].merchantId,
          'remarks': '',
          'orderType': this.postData[1].orderType,
          'productSku': [{
            'productId': this.postData[1].merchantProduct[0].productSku[0].productId,
            'skuId': this.postData[1].merchantProduct[0].productSku[0].skuId,
            'buyNum': 1
          }]
        })
        if (this.postData[1].productType !== '11') { // 不为虚拟商品
          Object.assign(data, {
            productType: this.postData[1].productType,
            giftBagId: this.postData[1].giftBagId,
            orderType: this.postData[1].orderType,
            orderExt: {
              type: this.postData[1].productType
            }
          })
        }
      }
      http({
        method: 'post',
        url: api.createOrder_v2_2,
        notNeedTransfer: true,
        data: data
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
      this.$baiduStats('提交订单页面-提交订单-确认提交')
    }
  }
}

export default confirmOrder
