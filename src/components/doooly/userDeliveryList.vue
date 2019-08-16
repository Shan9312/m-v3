<template>
  <div>
    <ul>
      <li v-for="(item,index) in addressList" :key="index">
        <div class="line_bold"></div>
        <div class="details">
          <div class="clearfix msg" @click="refer(index)">
            <span class="name">{{item.receiverName}}</span>
            <span class="fr tel">{{item.receiverTelephone}}</span>
            <br>
            <span class="address">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</span>
          </div>
          <div class="edit clearfix">
            <div v-if="item.isDefault== 1" class="fl pitchOn pitchOn_red">
              <span class='pitch'><img src="../../assets/images/userDelivery/pitchOn_red.png"></span><span class='character'>默认地址</span>
            </div>
            <div v-else>
              <div class="fl pitchOn" @click="setDefaultAddress(index,item.id)">
                <span class='pitch'><img src="../../assets/images/userDelivery/pitchOut.png"></span><span class='character'>设为默认地址</span>
              </div>
            </div>
            <div class="fr">
            <span @click="link(index)">
                <img src="../../assets/images/userDelivery/address_edit.png">编辑
            </span>
              <span @click="delet(index,item.id)">
              <img src="../../assets/images/userDelivery/address_delete.png">删除
            </span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="footer_bg"></div>
    <footer @click="link('add')">
      添加新地址
    </footer>
  </div>
</template>

<script>
  import http from '@/http/http'
  import api from '@/assets/js/api.js';
    export default {
        name: "userDeliveryList",
      data(){
          return{
            addressList:[],
          }
      },
      beforeCreate(){
        document.body.style.backgroundColor="#f5f5f5";
      },
      beforeDestroy(){
        document.body.style.backgroundColor="";
      },
      created(){
        dooolyAPP.initTitle('选择收货地址');
        this.loadList();
      },
      methods:{
        loadList:function () {
          http({
            method: 'get',
            url: api.userDeliveryList+"?token="+localStorage.token
          }).then((res) => {
            this.addressList=res.data.userDeliveryList;
          });
        },
        //选择收货地址
        refer(index) {
          this.$cookies.set("addressDataList",index,"30min");
          dooolyAPP.goBackPageIndex(1);
        },
        //设置默认收货地址
        setDefaultAddress:function (index,id) {
          http({
            method: 'post',
            url: api.setDefaultAddr+"?id="+id+"&token="+localStorage.token
          }).then((res) => {
            if(res.data.code=='1000'){
              let newArr=[];
              for(let i=0;i<this.addressList.length;i++){
                if(i==index){
                  this.addressList[i].isDefault=1;
                  newArr=this.addressList[i];
                }
                else {
                  this.addressList[i].isDefault=0;
                }
              }
              this.addressList.splice(index,1);
              this.addressList.unshift(newArr);
            }
          });
        },
        //删除收货地址
        delet:function (index,id) {
          http({
            method: 'post',
            url: api.deleAddr+"?id="+id+"&token="+localStorage.token
          }).then((res) => {
            if(res.data.code=='1000'){
              this.addressList.splice(index,1);
            }
          });
        },
        //新增/编辑收货地址
        link(type) {
          dooolyAPP.gotoJumpVue(this.$router,"/userDeliveryAdd/" + type);
        },
      }
    }
</script>

<style scoped>
  .line_bold{
    width: 100%;
    height: 0.2rem;
    background: #f5f5f5;
  }
  .line_minute{
    width: 100%;
    height: 1px;
    background: #ececec;
  }
  a{
    text-decoration: none;
    color: #333;
  }

  ul{
    background: #fff;
  }
  li .details{
    margin: 0 0.3rem;
  }
  .msg{
    font-size: 0.28rem;
    color:#333;
    padding: 0.3rem 0;
    border-bottom: 1px solid #ececec;
  }
  .msg .name{
    margin-bottom: 0.26rem;
  }
  .msg .address{
    display: inline-block;
    margin-top: 0.15rem;
  }
  .edit{
    font-size: 0.28rem;
    overflow: hidden;
  }
  .edit .fl{
    line-height: 0.8rem;
    color: #666;
  }
  .edit .pitchOn{
    font-size: 0;
  }
  .edit .fl .pitch{
    display: inline-block;
    width: 0.36rem;
    height: 0.36rem;
    box-sizing: border-box;
    font-size: 0;
    vertical-align: middle;
    margin-right: 0.2rem;
  }
  .edit .fl .pitch img{
    vertical-align: top;
  }
  .edit .pitchOn_red{
    color: #ee3f44;
  }
  .edit .pitchOn_red .pitch{
    border: 0;
  }
  .edit .pitchOn .character{
    font-size: 0.28rem;
    vertical-align: middle;
  }
  .edit .fr{
    line-height: 100%;
    padding: 0.26rem 0;
  }
  .edit .fr span{
    margin-left: 0.52rem;
  }
  .edit .fr img{
    width: 0.28rem;
    height: 0.28rem;
    vertical-align: bottom;
    margin-right: 0.1rem;
  }

  /*底部提交按钮*/
  .footer_bg{
    width: 100%;
    height: 0.98rem;
  }
  footer{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 0.98rem;
    line-height: 0.98rem;
    font-size: 0.3rem;
    width: 100%;
    background: #ee3f44;
    color: #fff;
    text-align: center;
  }
</style>
