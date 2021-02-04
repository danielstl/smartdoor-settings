<template>
  <div id="root">
    <Notification/>
    <RegistrationScreen v-if="false"/>
    <header>
      <h2>DoorLink Management</h2>
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
    return {}
  },
  sockets: {
    room_joined: function (code) {
      this.saveRoomCode(code);
    },
    room_id: function (code) {
      this.saveRoomCode(code);
    },
    new_device_joined: function () {
      this.$global.pushNotification(
          {
            header: "New device",
            caption: "A new device has been paired"
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
      localStorage.roomCode = code;
    }
  },
  beforeMount() {
    if (!localStorage.roomCode && localStorage.roomCode) {
      //TODO!!!!
      this.$socket.emit("join_room", localStorage.roomCode);
    } else {
      this.$socket.emit("temp_join");
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
  padding: 0.2em 1.6em;
}

.menu-link > .material-icons {
  padding-right: 0.3em;
}

#current-route {
  font-size: x-large;
  font-weight: 500;
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

header > div {
  flex: 1;
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
}

#root > div {
  flex: 0 1 auto;
}

#root {
  font-family: "Roboto", "Segoe UI", "sans-serif";

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

input[type=text], select, button, input[type=submit], input[type="file"]::-webkit-file-upload-button {
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
</style>
