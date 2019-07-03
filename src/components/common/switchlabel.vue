<template>
  <div>
    <div class="view" :class="[{'check':check},{'view1':state == 1},{'view2':state == 2}]" >
      <div class="point" :class="[{'check':check},{'point1':state == 1},{'point2':state == 2}]"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "nav",
    props:['check'],
    data(){
      return{
        state:0,
        first:false,
      }
    },
    watch:{
      check(){
        if(this.first){
          if(!this.check){
            this.state = 1;
          }else{
            this.state = 2;
          }
        }else{
          this.first = !this.first;
        }
      }
    },
    methods:{
    },
  }
</script>

<style scoped>
  .view{
    position: relative;
    display: inline-block;
    width: 1.04rem;
    height: 0.64rem;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #d9d9d9;
    background: #d9d9d9;
    margin-top: 0.16rem;
  }
  .check.view{
    border: 1px solid #4CD964;
    background: #4CD964;
  }
  .point{
    position: absolute;
    left: 0;
    top: 0;
    width: 0.64rem;
    height: 0.64rem;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .4);
    border-radius: 100%;
  }
  .check.point{
    left: 0.4rem;
  }
  .view1{
    animation:gar 0.3s forwards;
  }
  .view2{
    animation:gree 0.3s forwards;
  }
  @keyframes gree{
    0%{
      border: 1px solid #d9d9d9;
      background: #d9d9d9;
    }
    100%{
      border: 1px solid #4CD964;
      background: #4CD964;
    }
  }
  @keyframes gar{
    0%{
      border: 1px solid #4CD964;
      background: #4CD964;
    }
    100%{
      border: 1px solid #d9d9d9;
      background: #d9d9d9;
    }
  }
  .point1{
    animation:slide_left 0.3s forwards;
  }
  .point2{
    animation:slide_right 0.3s forwards;
  }
  @keyframes slide_right{
    0%{
      left: 0px;
    }
    100%{
      left: 0.4rem;
    }
  }
  @keyframes slide_left{
    0%{
      left: 0.4rem;
    }
    100%{
      left: 0px;
    }
  }
</style>
