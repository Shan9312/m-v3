import {
  Toast,
  MessageBox,
  InfiniteScroll,
  Swipe,
  SwipeItem,
  Picker,
  DatetimePicker,
  Loadmore,
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem
} from 'mint-ui';

const mint_Arr = [Swipe, SwipeItem, Picker, DatetimePicker, Loadmore, Navbar, TabItem, TabContainer, TabContainerItem];

export default (Vue) => {
  Vue.prototype.$toast = Toast;
  Vue.prototype.$messageBox = MessageBox;
  Vue.use(InfiniteScroll);

  mint_Arr.map((item) => {
    Vue.component(item.name, item);
  });
}
