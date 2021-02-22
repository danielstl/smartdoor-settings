<template>
  <div id="root">
    <Notification/>
    <RegistrationScreen v-if="registering"/>
    <template v-else>
      <header>
        <div id="logo">
          <img alt="DoorLink logo" src="https://doorlink.xyz/manage/icons/256.png"/> <span>DoorLink Management</span>
        </div>
        <div id="account">
          <div id="account-name" @click="showingAccountSettings = !showingAccountSettings">{{ username }}<span
              :class="{'material-icons': true, 'transform-animate': true, 'rotate-180': showingAccountSettings}">expand_more</span>
          </div>
          <transition name="fade">
            <div id="account-settings-popup" v-if="showingAccountSettings">
              <ul>
                <li @click="logOut"><span class="material-icons">logout</span>Log out</li>
              </ul>
            </div>
          </transition>
        </div>
      </header>
      <div id="content">
        <nav>
          <ul>
            <li v-for="c in this.$router.options.routes" :key="c.path">
              <router-link class="menu-link" :to="c.path"><span class="material-icons">{{ c.meta.icon }}</span><span
                  class="link-name">{{
                  c.name
                }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <main>
          <!--<div id="current-route"> {{ this.$router.currentRoute.name }}</div>-->
          <router-view></router-view>
        </main>
      </div>
    </template>
  </div>
</template>

<script>
//import MainScreen from "@/components/settings/MainScreen";
//import DateTime from "@/components/DateTime";

import RegistrationScreen from "@/components/registration/RegistrationScreen";
import Notification from "@/components/Notification";

export default {
  name: "Screen",
  components: {Notification, RegistrationScreen},
  //components: {DateTime},
  data() {
    return {
      registering: true,
      showingAccountSettings: false,
      username: ""
    }
  },
  sockets: {
    room_joined(code) {
      this.registering = false;
      this.saveRoomCode(code);
    },
    room_id(code) {
      this.saveRoomCode(code);
    },
    login_success(data) {
      console.log("Login success");
      let sessionId = data[0];
      let username = data[1];
      let isRegistration = data[2];

      if (this.$router.currentRoute.fullPath !== "/") {
        this.$router.push("/");
      }

      if (!localStorage.session) {
        let notif;

        if (isRegistration) {
          notif = {
            header: "Registration successful",
            caption: "Welcome to DoorLink! Customise your display settings here, and visit the Device tab to link a display device"
          }
        } else {
          notif = {
            header: "Log-in successful",
            caption: "Welcome to DoorLink!"
          }
        }

        this.$global.pushNotification(notif);
      }

      this.$global.username = username;
      this.username = username;

      localStorage.session = sessionId;
    },
    new_device_joined() {
      this.$global.pushNotification(
          {
            header: "New device",
            caption: "A new device has been paired"
          }
      );
    },
    doodles_update: function (doodles) {
      if (this.$router.currentRoute.name === "Doodles" || (!doodles || doodles.length === 0)) {
        return;
      }

      const ctx = this;

      this.$global.pushNotification(
          {
            header: "New doodle",
            caption: "A new doodle has been received",
            clickHandler: function () {
              ctx.$router.push("/doodles");
            }
          }
      );
    },
    new_message: function (messageData) {
      if (this.$router.currentRoute.name === "Messaging") {
        return;
      }

      this.$global.messages.push(messageData);

      if (!messageData.fromSystem && messageData.fromSystem) { //TODO re-add
        return;
      }

      const ctx = this;

      this.$global.pushNotification(
          {
            header: "New message",
            caption: messageData.content,
            clickHandler: function () {
              ctx.$router.push("/messaging");
            }
          }
      );
    }
  },
  methods: {
    saveRoomCode(code) {
      this.$global.roomId = code;
    },
    logOut() {
      this.registering = true;
      this.showingAccountSettings = false;
      this.$socket.emit("logout", localStorage.session);
      this.$global.username = "";
      this.username = "";
      delete localStorage.session;
    }
  },
  beforeMount() {
    if (localStorage.session) {
      this.$socket.emit("login_from_session", localStorage.session);
      //TODO!!!!
      //this.$socket.emit("join_room", localStorage.roomCode);
    } else {
      //this.$socket.emit("temp_join");
    }
  }
}
</script>

<style>
body, html {
  margin: 0;
  top: 0;
  left: 0;
  height: 100%;
  --user-select: none;

  background: #f8f8f8;
}

header {
  display: flex;
  background: #1d1d1d;

  color: white;
  height: 4em;
  min-height: 4em;
  padding: 0 1em;

  align-items: center;
}

.menu-link > .material-icons {
  padding-right: 0.3em;
}

#current-route {
  font-size: x-large;
  font-weight: 500;
}

#account {
  position: relative;
  font-weight: 500;
}

#account-settings-popup {
  right: 0;
  width: 10em;
  position: absolute;
  background-color: #ffffff;
  color: black;
  margin-top: 0.3em;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
}

#account-settings-popup ul {
  list-style: none;
  margin: 0.2em 0;
  padding: 0;
}

#account-settings-popup li {
  margin: 0;
  padding: 0.3em;
  cursor: pointer;
  transition: all 0.2s;
}

#account-settings-popup li:hover {
  background-color: #e0e0e0;
}

#account-name {
  user-select: none;
  cursor: pointer;
}

nav {
  background: #efefef;

  width: 100%;
}

main {
  flex: 1 1 auto;

  padding: 1em;

  overflow: auto;
}

#logo > span {
  font-size: x-large;
  font-weight: 500;
}

#logo {
  flex: 1;
  display: flex;
}

#logo > img {
  height: 32px;
  max-height: 32px;
  margin-right: 0.6em;
}

#root {
  display: flex;
  height: 100%;

  flex-direction: column;
}

#content {
  display: flex;

  flex-direction: column;
}

#logo span {
  display: none;
}

@media screen and (min-width: 600px) {
  #content {
    height: 100%;
    max-height: 100%;
    overflow: auto;

    flex-direction: row;
  }

  nav {
    width: 18em;
    min-width: 18em;

    overflow: auto;
  }

  #logo span {
    display: inline-block;
  }
}

#root > div {
  flex: 0 1 auto;
}

#root {
  font-family: "Roboto", "Segoe UI", "Helvetica", "sans-serif";

  height: 100%;
}

nav > ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-link {
  display: block;
  border-bottom: 1px solid #d0d0d0;
  padding: 0.8em;
  color: black;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
}

.menu-link:hover {
  background: #e0e0e0;
}

.menu-link.router-link-active {
  background: #d6d6d6;
}

.material-icons {
  vertical-align: -6px;
}

.selected-item > span {
  border-top: 3px solid #6c6cff;
  transform: scale(1.8, 1.8);
  color: white;
}

input[type=text], input[type=password], select, button, input[type=submit], input[type="file"]::-webkit-file-upload-button {
  background-color: white;
  border: 1px solid #333;
  border-radius: 2px;
  padding: 0.4em;
  color: black;
  font-family: "Roboto", "Segoe UI", "sans-serif";
}

input, select, button :active {
  outline: none;
}

label {
  padding: 0.4em 0;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0.8em;
  margin-bottom: 0.8em;
}

.context {
  border-left: 3px solid #888888;
  padding-left: 0.4em;
  color: #323232;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  font-weight: 500;
}

.material-icons {
  user-select: none;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.fade-enter-to {
  opacity: 1;
}

.transform-animate {
  transition: transform 0.2s ease-in-out;
}

.rotate-180 {
  transform: scale(-1);
}
</style>
