<template>
  <div>
    <div id="user-info">
      <img :src="this.icon"/>
      <div id="name">{{ this.name }}</div>
      <select id="online-status" v-model="status" @change="statusUpdate">
        <option value="AVAILABLE">Available</option>
        <option value="DO_NOT_DISTURB">Do not disturb</option>
        <option value="AWAY">Away</option>
      </select>
    </div>
    <div>
      <form>
        <label for="input-name">Name</label>
        <input type="text" id="input-name" v-model="name" @change="nameUpdate" placeholder="Enter your name">

        <label for="input-status">Status</label>
        <input type="text" id="input-status" placeholder="Enter a status">
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileSettingsScreen",
  data() {
    return {
      name: "???",
      icon: null,
      status: "DO_NOT_DISTURB"
    }
  },
  sockets: {
    user_update: function (res) {
      this.name = res.name;
      this.icon = res.icon;
      this.status = res.status;
    }
  },
  mounted() {
    this.$socket.emit("get_user");
  },
  methods: {
    statusUpdate: function (ev) {
      console.log("UPDATE:" + ev.target.value);
      this.$socket.emit("update_status", ev.target.value);
    },
    nameUpdate: function (ev) {
      this.$socket.emit("update_name", ev.target.value);
    }
  }
}
</script>

<style scoped>
#user-info {
  display: flex;
  height: 5rem;
  padding: 1em;
  align-items: center;
  font-size: 1.6em;
}

#user-info > img {
  border-radius: 50%;
  max-height: 80%;
}

#user-info > #name {
  flex: 4;
  font-size: 1.6em;
  font-weight: 500;
  margin-left: 0.5em;
}

#online-status {
  flex: 1;
}

#user-info > * {
  vertical-align: center;
}
</style>
