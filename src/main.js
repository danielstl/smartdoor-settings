import Vue from 'vue';
import Screen from "@/components/Screen";
import VueSocketio from "vue-socket.io";
import SocketIO from "socket.io-client";
import VueRouter from "vue-router";
import DateTime from "@/components/DateTime";
import ProfileSettingsScreen from "@/components/settings/ProfileSettingsScreen";
import CustomiseSettingsScreen from "@/components/settings/CustomiseSettingsScreen";
import CalendarIntegrationsScreen from "@/components/settings/CalendarIntegrationsScreen";
import MessagingScreen from "@/components/settings/MessagingScreen";

Vue.config.productionTip = false;

Vue.use(new VueSocketio({
  debug: true,
  connection: new SocketIO("http://192.168.1.53:3000")
}));

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes:[
    { path: '/profile', component: ProfileSettingsScreen, name: "Profile"},
    { path: '/customise', component: CustomiseSettingsScreen, name: "Customise"},
    { path: '/calendar-integrations', component: CalendarIntegrationsScreen, name: "Calendar integrations"},
    { path: '/messaging', component: MessagingScreen, name: "Messaging"},
    { path: '/camera', component: DateTime, name: "Camera"},
    { path: '/device', component: DateTime, name: "Device"},
  ]
});

new Vue({
  render: h => h(Screen),
  router
}).$mount('#app')
