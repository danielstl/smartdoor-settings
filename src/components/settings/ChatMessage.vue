<template>
  <div :class="{message: true, 'self-message': message.fromSystem}">
    <div class="message-timestamp">{{formattedTime}}</div>
    <div>
      <div class="message-author">{{ message.fromSystem ? "owner" : "you" }}</div>
      <div class="message-content">{{message.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatMessage",
  props: {
    message: Object
  },
  computed: {
    formattedTime: function () {
      let date = new Date();
      date.setTime(this.message.timestamp);
      return date.toLocaleTimeString("en-GB", {hour:"2-digit", minute: "2-digit", hour12: false});
    }
  }
}
</script>

<style scoped>
.message {
  display: flex;
  padding: 0.4em 0;
  word-wrap: anywhere;
}

.self-message {
  -flex-direction: row-reverse;
}

.message-timestamp {
  min-width: 50px;
}

.message-content {
  font-size: larger;
  flex: 1;
}
</style>
