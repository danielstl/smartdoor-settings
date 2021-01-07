import Vue from 'vue'
import Screen from "@/components/Screen";
import VueSocketio from "vue-socket.io";
import SocketIO from "socket.io-client";
import VueRouter from "vue-router";

Vue.config.productionTip = false

Vue.use(new VueSocketio({
  debug: true,
  connection: new SocketIO("http://localhost:3000")
}));

Vue.use(VueRouter);

new Vue({
  render: h => h(Screen),
}).$mount('#app')
