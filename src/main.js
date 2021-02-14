import Vue from 'vue';
import Screen from "@/components/Screen";
import VueSocketio from "vue-socket.io";
import SocketIO from "socket.io-client";
import VueRouter from "vue-router";

import ProfileSettingsScreen from "@/components/settings/ProfileSettingsScreen";
import CustomiseSettingsScreen from "@/components/settings/CustomiseSettingsScreen";
import CalendarIntegrationsScreen from "@/components/settings/CalendarIntegrationsScreen";
import MessagingScreen from "@/components/settings/MessagingScreen";
import IntercomScreen from "@/components/settings/IntercomScreen";
import NotesScreen from "@/components/settings/NotesScreen";
import DeviceSettingsScreen from "@/components/settings/DeviceSettingsScreen";
import WhiteboardScreen from "@/components/settings/WhiteboardScreen";

Vue.config.productionTip = false;

Vue.use(new VueSocketio({
    debug: true,
    connection: new SocketIO("https://doorlink.xyz/")
}));

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: '/manage',
    routes: [
        {path: '/profile', component: ProfileSettingsScreen, name: "Profile", meta: {icon: "account_circle"}},
        {path: '/customise', component: CustomiseSettingsScreen, name: "Customise", meta: {icon: "palette"}},
        {
            path: '/calendar-integrations',
            component: CalendarIntegrationsScreen,
            name: "Calendar integrations",
            meta: {icon: "calendar_today"}
        },
        {path: '/messaging', component: MessagingScreen, name: "Messaging", meta: {icon: "chat"}},
        {path: '/notes', component: NotesScreen, name: "Notes", meta: {icon: "push_pin"}},
        {path: '/doodles', component: WhiteboardScreen, name: "Doodles", meta: {icon: "gesture"}},
        {path: '/intercom', component: IntercomScreen, name: "Intercom", meta: {icon: "videocam"}},
        {path: '/device', component: DeviceSettingsScreen, name: "Device", meta: {icon: "tablet"}},
    ]
});

Vue.prototype.$global = {
    messages: []
};

new Vue({
    render: h => h(Screen),
    router
}).$mount('#app')
