<template>
  <div class="list">
    <div class="list_view">
      <div class="first_tag" :class="{tag:!first_tag_show.first_tag_show1,tagDown:first_tag_show.first_tag_show1}" @click="first_tag_show.first_tag_show1 = !first_tag_show.first_tag_show1">
        集享商户说明
      </div>
      <ul v-show="first_tag_show.first_tag_show1">
        <li v-for="(item,index) in tag_list1">
          <div class="tag_title" :class="{tag:!item.show,tagDown:item.show}" @click="item.show = !item.show">{{item.title}}</div>
          <section v-show="item.show" v-html="item.section"></section>
        </li>
      </ul>
    </div>
    <div class="list_view_bg"></div>
    <div class="list_view">
      <div class="first_tag" :class="{tag:!first_tag_show.first_tag_show2,tagDown:first_tag_show.first_tag_show2}" @click="first_tag_show.first_tag_show2 = !first_tag_show.first_tag_show2">
        卡片功能说明
      </div>
      <ul v-show="first_tag_show.first_tag_show2">
        <li v-for="(item,index) in tag_list2">
          <div class="tag_title" :class="{tag:!item.show,tagDown:item.show}" @click="item.show = !item.show">{{item.title}}</div>
          <section v-show="item.show" v-html="item.section"></section>
        </li>
      </ul>
    </div>
    <div class="list_view_bg"></div>
    <div class="list_view">
      <div class="first_tag" :class="{tag:!first_tag_show.first_tag_show3,tagDown:first_tag_show.first_tag_show3}" @click="first_tag_show.first_tag_show3 = !first_tag_show.first_tag_show3">
        储值相关说明
      </div>
      <ul v-show="first_tag_show.first_tag_show3">
        <li v-for="(item,index) in tag_list3">
          <div class="tag_title" :class="{tag:!item.show,tagDown:item.show}" @click="item.show = !item.show">{{item.title}}</div>
          <section v-show="item.show" v-html="item.section"></section>
        </li>
      </ul>
    </div>
    <div class="list_view_bg"></div>
    <div class="list_view">
      <div class="first_tag" :class="{tag:!first_tag_show.first_tag_show4,tagDown:first_tag_show.first_tag_show4}" @click="first_tag_show.first_tag_show4 = !first_tag_show.first_tag_show4">
        余额查询说明
      </div>
      <ul v-show="first_tag_show.first_tag_show4">
        <li v-for="(item,index) in tag_list4" :key='index'>
          <div class="tag_title" :class="{tag:!item.show,tagDown:item.show}" @click="item.show = !item.show">{{item.title}}</div>
          <section v-show="item.show" v-html="item.section"></section>
        </li>
      </ul>
    </div>
    <div class="list_view_bg"></div>
  </div>
</template>

<script>
export default {
  name: "helpCenter",
  data(){
    return {
      first_tag_show:{
        first_tag_show1:false,
        first_tag_show2:false,
        first_tag_show3:false,
        first_tag_show4:false,
      },
      tag_list1:[
        {
          title: '集享卡有什么用？',
          section: '集享卡是一张集储值、专属折扣、累计积分、积分兑换为一体的会员卡。可在特约商户使用，部分优惠活动同享。',
          show: false
        },
        {
          title: '有哪些商户可以使用集享卡？',
          section: '目前支持使用商户有：全家便利店、德克士、康师傅私房牛肉面、康师傅大牌饭、那不乐思比萨等。您可以通过官网、APP查询集享商户及商户门店地址，也可拨打各个商户客服热线查询。<br>目前支持使用商户有：全家便利店、德克士、康师傅私房牛肉面、康师傅大牌饭、那不乐思比萨等。您可以通过官网、APP查询集享商户及商户门店地址，也可拨打各个商户客服热线查询。',
          show: false
        },
        {
          title: '如何查看集享卡活动资讯？',
          section: '您可以通过集享联盟官网、APP、或关注集享卡微信微博获得我们不定期的优惠活动资讯。',
          show: false
        },
        {
          title: '集享卡是否可以跨地区使用？',
          section: '集享卡全国通用哦。积分使用规则：全国已开通集享卡业务的门店均累计积分和使用积分。储值金使用规则：储值金的使用限同一商户同一地区使用。<br>【享享提醒】已开通集享卡业务的门店可以使用，部分封闭通路餐厅除外，详细情况请咨询当地商户门店。',
          show: false
        },
        {
          title: '怎么联系集享卡？',
          section: '您可以通过以下两种方式联系我们：<br>1.打开微信，搜索公众号“集享联盟”，点击关注，进入公众号，联系微信客服。<br>2.拨打客户服务热线：400-1555-365。<br>3.登录集享联盟APP首页上方点击 “客服”，联系APP在线客服。<br>4.登录集享卡官网右侧菜单栏——“在线客服”。<br>【享享提醒】客服中心的服务时间：08:00-21:00。',
          show: false
        }
      ],
      tag_list2:[
        {
          title: '集享卡有哪些功能呢？',
          section: '1、集享卡：一卡通用，持集享卡至各特约商户消费，同时具有消费累分、积分兑换、功能。<br>2、积分通兑：积分可于任一集享卡商户消费时充抵现金或换购产品时使用（兑换规则详见各商户公示）。<br>3、电子券：卡内储存集享卡赠送的电子电子券，可用于兑换商品或抵扣现金。<br>4、优惠折扣：持卡可享集享卡特约商户提供的专属折扣。<br>5、储值功能：目前仅只有全家普通集享卡及康师傅私房牛肉面集享卡有储值功能，其他商户集享卡无储值功能。储值金不可跨商户、跨区域使用。<br>【享享提醒】已开通集享卡业务的门店可以使用，部分封闭通路餐厅除外，详细情况请咨询当地商户门店。',
          show: false
        },
        {
          title: '可以和别人共用一张集享卡吗？',
          section: '集享卡为实名制卡片，限本人使用，不可转让他人。<br>请妥善保存您的卡片及密码，以免造成您的资产损失。',
          show: false
        },
        {
          title: '集享卡购买后是否可以退卡？',
          section: '集享卡一旦进行了绑卡、消费、储值、拆封包装、刮开支付密码涂层等操作后即不得办理退卡。',
          show: false
        },
        {
          title: '全家尊享卡是什么？',
          section: '全家尊享会员是集享卡与全家便利沟通推出的年费制会员，可在集享卡各联盟商户德克士、康师傅牛肉面、康师傅大排饭享受集享卡会员权益，并在全家便利独享尊享会员权益，及独享集享【甄会选】商城购物消费。',
          show: false
        },
        {
          title: '全家尊享权益有哪些？',
          section: '1.全家消费1元额外加赠1分（全国）<br>2.生日当天全家消费1元累10分（全国）<br>3.尊享会员期间积分不清零（不过期）<br>4.独享【甄会选】商城购物权益<br>5.获得价值超过百元的全家年费礼包（5张买拿铁送一券、1张商品券、两次单笔满40送2000积分权益）<br>6.全家活动商品更多积分回馈集享甄会选APP同步上线，全球精选商品，正品低价带回家，快去手机端应用商店下载！',
          show: false
        },
        {
          title: '全家尊享卡可以储值吗？',
          section: '【享享提醒】目前全家尊享卡暂未开通储值功能哦，如需储值，您可以领取一张普通全家集享卡进行充值使用哦',
          show: false
        },
        {
          title: '全家尊享卡收费嘛？',
          section: '【享享提醒】全家门店尊享卡片，办理需要进行尊享年费缴费，费用：年费100元/年',
          show: false
        },
        {
          title: '全家尊享卡有有效期吗？',
          section: '【享享提醒】全家尊享卡有有效期的呢，自办卡之日起一年之内有效',
          show: false
        },
        {
          title: '办理全家尊享卡片之后赠送的年费礼包有有效期吗？',
          section: '办卡之后将获得超值尊享礼包：（5张买拿铁送一券、1张商品券、等各地区指定商品兑换券）及两次单笔满40送2000积分权益。<br>【享享提醒】礼包内电子券限有效期内使用，还请及时登陆集享联盟APP查看电子券有效期哦',
          show: false
        },
        {
          title: '办理全家尊享卡片之后赠送的年费礼包电子券如何使用？',
          section: '【享享提醒】百元的全家年费礼包内商品兑换券需下载集享联盟APP，进行兑换使用哦~',
          show: false
        },
        {
          title: '全家尊享卡消费积分规则是怎样？',
          section: '全家尊享卡享受双倍基本积分服务哦 （消费1元集2个积分），此外，生日当天还有10倍积分呢！<br>【享享提醒】更多尊享会员加赠积分活动已在各全家门店上线，尊享卡权益细节请以全家门店为准，敬请莅临垂询。',
          show: false
        }
      ],
      tag_list3:[
        {
          title: '集享卡如何充值？',
          section: '您可前往全家、康师傅牛肉面集享卡特约商户以【现金】的方式充值。卡内的储值金仅限于在充值地区门店使用。<br>【享享提醒】德克士暂不提供储值服务。',
          show: false
        },
        {
          title: '集享卡充值有优惠吗？',
          section: '我们会不定期的推出储值优惠活动，您可以通过官网、APP、微信了解最新充值活动和规则，或至门店咨询。同时也可联系集享联盟客服中心了解相关内容。',
          show: false
        },
        {
          title: '集享卡充值、使用储值消费时遇到困难怎么办？',
          section: '请您保留门店充值/消费小票,联系集享联盟客服中心, 由客服人员协助您处理。',
          show: false
        },
        {
          title: '集享卡储值金可以在不同城市的全家、德克士、康师傅牛肉面消费吗？',
          section: '集享卡储值金只能在办卡的城市及商户使用，不能跨地区、跨商户使用哦。',
          show: false
        },
        {
          title: '集享卡充值后可以开发票吗？',
          section: '全家：储值金充值时由充值门店提供发票，储值金消费时就不在开发票了哟；康师傅私房牛肉面：储值金消费时，由消费门店提供发票。',
          show: false
        },
        {
          title: '储值金、现金消费获得的积分数量会有不同吗？',
          section: '各商户储值消费累分规则略有不同，具体请查询官网、APP、微信活动页面或垂询商户门店。<br>【享享提醒】部分地区的商户暂未开通积分、兑分功能，但仍可享受会员专属折扣。详细情况请咨询当地商户门店。',
          show: false
        }
      ],
      tag_list4:[
        {
          title: '哪里可以查看卡内余额？',
          section: '您可以通过以下几种方式获取卡内余额信息：<br>1.可登录官网、APP，点击“会员中心”，即可查询卡内储值金、积分、电子券等信息。<br>2.关注微信公众号，点击“我的集享”——“账户查询”进行自助查询。<br>3.联系集享联盟客服中心，请客服协助查询。',
          show: false
        }
      ],
    }
  },
  beforeCreate(){
    document.body.style.backgroundColor="#f5f5f5";
  },
  destroy(){
    document.body.style.backgroundColor="";
  },
  created(){
    initTitle('常见问题','')
  },
  methods:{
  }
}
</script>

<style scoped>
  .tag{
    background: url("../../../assets/images/userDelivery/right.png") center right no-repeat;
    background-size: 0.16rem;
  }
  .tagDown{
    background: url("../../../assets/images/down.png") center right no-repeat;
    background-size: 0.28rem;
  }
  .list{
    background: #fff;
    
  }
  .list .list_view{
    padding: 0 0.3rem;
  }
  .list .list_view_bg{
    width: 100%;
    height: 0.2rem;
    background: #f5f5f5;
  }
  .list .list_view:last-child{
    border-bottom: 0;
  }
  .first_tag{
    font-size: 0.28rem;
    line-height: 100%;
    padding: 0.3rem 0;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
  }
  ul{
    padding: 0 0.3rem;
  }
  .tag_title{
    font-size: 0.28rem;
    line-height: 100%;
    padding: 0.3rem 0;
    color: #666;
  }
  section{
    font-size: 0.28rem;
    line-height: 0.4rem;
    color: #999;
    padding-bottom: 0.2rem;
  }
</style>
