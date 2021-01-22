<template>
  <div>
    <div id="conversation">
      <h3>Pinned notes</h3>
      <div>You can pin notes to the home screen of the smart display below</div>
      <ul>
        <li v-for="note in notes" :key="note.id">
          <div>{{note}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotesScreen",
  data() {
    return {
      notes: [
        {
          id: 1,
          text: "text note",
          image: null
        }
      ]
    }
  },
  sockets: {
    new_message: function (messageData) {
      this.messages.push(messageData);
    },
    clear_messages: function () {
      this.messages = [];
    }
  },
  methods: {
    sendMessage: function () {
      this.$socket.emit("send_message", {timestamp: new Date().getUTCMilliseconds(), content: this.currentMessage, selfMessage: true});
      this.currentMessage = "";
    },
    clearMessages: function () {
      this.$socket.emit("clear_messages");
    }
  }
}
</script>

<style scoped>

</style>
