<template>
    <div>这是个人中心

      <!--<dyfooter></dyfooter>-->
    </div>
</template>

<script>
  import dyfooter from '@/components/common/dyfooter';
    export default {
        name: "user-info",
        components:{dyfooter},
      created(){
        document.title = '个人中心';
        dooolyAPP.initTitle('个人中心',1);


      }


    }
</script>

<style scoped>

</style>
