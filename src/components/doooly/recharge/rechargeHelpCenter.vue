<template>
  <div class="list">
    <div class="list_view" v-for="(item,index) in list">
      <div class="first_tag" :class="{tag:!item.show,tagDown:item.show}" @click="item.show = !item.show">
        {{item.title}}
      </div>
      <section v-show="item.show" v-html="item.section"></section>
    </div>
    <div class="list_view_bg"></div>
  </div>
</template>

<script>

export default {
  name: "rechargeHelpCenter",
  data(){
    return {
      list:[
        {
          title: '都市旅游卡哪里可以买到？ ',
          section: '详见都市旅游卡官网，提供购卡服务的各服务网点都可以购买。',
          show: false
        },
        {
          title: '都市旅游卡哪里可以充资？',
          section: '详见都市旅游卡官网，提供充资服务的各服务网点进行办理。<br>上海都市旅游卡卡内最高储值额不超过1000元，可充值卡可反复充资，充资金额以10元为最低单位（和交通卡一致）。',
          show: false
        },
        {
          title: '都市旅游卡余额、押金和有效期如何查询？',
          section: '持卡人可在地铁各站点内的CVM自助充资机、交通卡官方网站、各特约商户的POS机具、各服务网点的验卡机、网上充设备、上海交通卡APP中查询。<br>卡片有效期使用期限是指自前一次充值日起五年内，该卡可以正常使用。每次充值延长有效期五年（自充值之日起）。超过五年期限无充值的，须在本公司充值服务网点办理续用手续。',
          show: false
        },
        {
          title: '交易记录如何查询？',
          section: '查询最近10笔交易记录，有以下途径：<br>持卡人可前往地铁各站点内的CVM自助设备、有交通卡、都市旅游卡业务的轨道交通站点服务中心、交通卡地铁自营网点、九江路609号服务中心、陆家浜路1298号服务中心、中山南路28号久事大厦9楼都市旅游卡公司本部、网上充设备进行消费记录查询。<br>如需查询最近10笔之外的交易记录或打印清单的，须在交易发生后30天内前往都市旅游卡公司本部（中山南路28号久事大厦9楼，'+dooolyConfig.serviceTime+'）查询。',
          show: false
        },
        {
          title: '卡不能使用了如何处理？',
          section: '故障卡维修详见都市旅游卡官网，提供维修服务的各服务网点进行维修受理，受理的故障卡必须保证卡面完整，卡号清晰可辨。经检测确属底卡质量问题且在质保期内的，凭办理时的业务凭证在7个工作日内免费予以调换；经检测属人为损坏的，持卡人需依照卡片成本支付维修费用，该费用从卡内扣除，新卡片重置费为15元/张。若卡内余额不足新卡制作成本费，则不予受理。如因持卡人擅自改动本卡导致卡内余额及底卡金损失的，由持卡人自负。',
          show: false
        },{
          title: '都市旅游卡如何退卡？卡内的资金可以退吗？',
          section: '上海都市旅游卡退卡仅限普通卡。卡押金可至指定服务网点办理退卡或在指定特约商户进行底卡抵用消费；详见都市旅游卡官网，提供退卡服务的各服务网点进行办理；另外，目前可底卡抵用消费的特约商户有：良友便利、快客便利。<br>普通卡可在本公司指定服务网点办理退卡，并退还底卡押金。卡内金额不足10元的，可全额退还；卡内金额高于10元（含）的，应凭购卡凭证在扣除5%的手续费后予以退还。一次退卡金额累计大于2000元（含）的须前往指定服务网点办理，凭购卡凭证及本人身份证在扣除卡内金额5%的手续费后予以退还，提前预约的可当场退还，未预约的将在三个工作日内退还。底卡不能使用或卡面、卡体损坏的，不予退卡。卡面、卡体损坏是指出现刻划、弯曲、折叠、断裂、折痕、破损、涂写、粘贴异物、严重污损、印制图案、缺边、缺角、分层、打孔、湿水软化等导致卡受损的情况。',
          show: false
        },{
          title: '可充值卡如何移资？',
          section: '移资业务仅限在可充值卡（卡背编号为U开头的为可充值卡）之间使用“网上充”设备进行移资。没有“网上充”设备的用户可详见都市旅游卡官网，提供移资服务的各服务网点进行办理。<br>都市旅游卡与交通之间不支持互相移资。',
          show: false
        },{
          title: '都市旅游卡内的资金可以挂失吗？',
          section: '不可以。都市旅游卡不记名，不挂失，详见每张卡背面文字。',
          show: false
        },{
          title: '卡过期了如何处理？',
          section: '对于超过使用期限的卡片，可充值卡可通过充资操作延长有效期；非人为损坏的不可充值普通卡免费更换指定的0元押金纪念卡；人为损坏的不可充值普通卡需支付重置制作成本费人民币15元，每次续期延长有效期不小于五年，请至都市旅游卡公司本部（中山南路28号久事大厦9楼，'+dooolyConfig.serviceTime+'）办理。',
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
    dooolyAPP.initTitle('常见问题','')
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
  .list .list_view{
    padding: 0 0.3rem;
    margin-bottom: 0.2rem;
    background: #fff;
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
    padding: 0.2rem 0;
  }
</style>
