<template>
  <div>
    <div id="user-info">
      <div id="icon-container">
        <img id="user-icon" :src="this.icon"/>
      </div>
      <div id="name">{{ this.name }}</div>
      <select id="online-status" v-model="status" @change="statusUpdate">
        <option value="AVAILABLE">Available</option>
        <option value="DO_NOT_DISTURB">Do not disturb</option>
        <option value="AWAY">Away</option>
      </select>
    </div>
    <div id="settings-form">
      <label for="input-name">Name</label>
      <input type="text" id="input-name" v-model="name" @change="nameUpdate" placeholder="Enter your name">

      <form method="post" action="https://doorlink.xyz/upload/user-icon" enctype="multipart/form-data">
        <label for="image">Profile picture</label>
        <input type="file" id="image" name="image">
        <input type="submit">
        <button>Remove photo</button>
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
      this.icon = res.profileImage;
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
  padding: 0;
  align-items: center;
  font-size: 1.6em;
}

#user-info > #name {
  flex: 4;
  font-size: 1.6em;
  font-weight: 500;
  margin-left: 0.3em;
}

#icon-container {
  height: 2em;
  width: 2em;
}

#user-icon {
  object-fit: scale-down;
  background-color: #333;
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

#online-status {
  flex: 1;
}

#user-info > * {
  vertical-align: center;
}

#settings-form {
  display: flex;
  flex-direction: column;
}
</style>
