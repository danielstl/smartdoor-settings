<template>
  <div id="device-root">
    <h3>Device</h3>
    <h4>Door ID</h4>
    <div class="context">Use this to pair a new display. At any time, you can reset the Door ID, which will disconnect
      all connected displays.
    </div>
    <template v-if="!retrievedRoomId">
      <div>Loading...</div>
    </template>
    <template v-else>
      <div>Door ID: {{ roomId }}</div>
      <button id="reset-button" @click="resetDoorId">Reset Door ID</button>

      <qrcode-vue id="qr-code" size="130" :value="roomId"></qrcode-vue>
    </template>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
  name: "DeviceSettingsScreen",
  components: {
    QrcodeVue
  },
  data() {
    return {
      retrievedRoomId: false,
      roomId: null
    }
  },
  beforeMount() {
    this.$socket.emit("get_room_id");
  },
  sockets: {
    room_id: function (code) {
      this.retrievedRoomId = true;
      this.roomId = code;
    }
  },
  methods: {
    resetDoorId() {
      this.$socket.emit("reset_room_id");
    }
  }
}
</script>

<style scoped>
#reset-button {
  margin: 1em 0;
}
</style>
