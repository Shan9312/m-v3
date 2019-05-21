const detailContent = {
  props: {
    supplierOrder: Object
  },
  data(){
    return {
      
    }
  },
  created(){
  },
  methods: {
    baidu(){
      window.location.href = "https://www.baidu.com/ssid=a73a65726963383730383232132a/from=844b/s?word="+this.supplierOrder.courierNumber+"&ts=8531622&t_kt=0&ie=utf-8&fm_kl=021394be2f&rsv_iqid=2104279993&rsv_t=a796tZ0bg5ag9%252Bqud%252BR1p8sBlsPI%252BCYgNJupSFoU0UiwGEov9%252F5yNFF9qw&sa=ib&ms=1&rsv_pq=2104279993&rsv_sug4=18470&ss=010&tj=1&inputT=14516";
    }
  }
};
export default detailContent;