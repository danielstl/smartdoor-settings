<template>
  <div id="root">
    <header>
      <h2>Smart Display Management</h2>
    </header>
    <aside>
      <nav>
        <ul>
          <li v-for="c in this.navigation" :key="c.path">
            <router-link :to="c.path">{{c.name}}</router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <main>
      <router-view></router-view>
    </main>
    <nav>
      <ul>
        <li :class="{'selected-item': this.activeScreen === 'home'}" @click="setScreen('home')"><span
            class="material-icons">home</span></li>
        <li :class="{'selected-item': this.activeScreen === 'intercom'}" @click="setScreen('intercom')"><span
            class="material-icons">videocam</span></li>
        <li :class="{'selected-item': this.activeScreen === 'messages'}" @click="setScreen('messages')"><span
            class="material-icons">chat</span></li>
      </ul>
    </nav>
  </div>
</template>

<script>
//import MainScreen from "@/components/settings/MainScreen";
import DateTime from "@/components/DateTime";

export default {
  name: "Screen",
  components: {DateTime},
  data() {
    return {
      screens: {
        home: "MainScreen"
      },
      navigation: [
        {
          name: "Profile",
          path: "/profile",
          component: DateTime
        }
      ],
      activeScreen: "home"
    }
  },
  computed: {
    activeComponent: function () {
      return this.screens[this.activeScreen];
    }
  },
  methods: {
    setScreen: function (screen) {
      this.activeScreen = screen;
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
  user-select: none;
}

header {
  display: flex;
  height: 4em;
}

header > div {
  flex: 1;
}

nav > ul {
  display: flex;
  text-align: center;
}

nav > ul > li {
  flex: 1;
  list-style: none;
}

nav > ul > li > span {
  padding-top: 0.2em;
  border-top: 3px solid transparent;
  transform: scale(1.6, 1.6);
  color: #d4d4d4;
}

nav > ul > li > span {
  transition: all 0.15s;
}

#root {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  padding: 0.5em;
  font-family: "Roboto", "Segoe UI", "sans-serif";
  display: flex;
  flex-flow: column;
  height: 100%;
  box-sizing: border-box;

  overflow: auto;
  max-height: 100vh;
}

main {
  flex: 1;
}

nav {
  height: 5em;
}

.selected-item > span {
  border-top: 3px solid #6c6cff;
  transform: scale(1.8, 1.8);
  color: white;
}
</style>