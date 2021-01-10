<template>
  <div id="root">
    <header>
      <h2>Smart Display Management</h2>
    </header>
    <aside>
      <nav>
        <ul>
          <li v-for="c in this.$router.options.routes" :key="c.path">
            <router-link :to="c.path">{{c.name}}</router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
//import MainScreen from "@/components/settings/MainScreen";
//import DateTime from "@/components/DateTime";

export default {
  name: "Screen",
  //components: {DateTime},
  data() {
    return {}
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
}

header {
  display: flex;
  height: 4em;
  background: blue;
}

aside {
  background: orange;
}

main {
  background: purple;
}

header > div {
  flex: 1;
}

#root {
  font-family: "Roboto", "Segoe UI", "sans-serif";

  height: 100%;
}

.selected-item > span {
  border-top: 3px solid #6c6cff;
  transform: scale(1.8, 1.8);
  color: white;
}
</style>
