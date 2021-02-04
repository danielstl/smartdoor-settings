<template>
  <div id="messaging-root">
    <h3>Messaging</h3>
    <div class="context">Active conversation</div>
    <div id="conversation">
      <div id="messages-container">
        <ul id="messages">
          <li v-for="message in messages" :key="message.timestamp">
            <ChatMessage :message="message"/>
          </li>
        </ul>
      </div>
    </div>
    <div id="input">
      <input id="message-box" autocomplete="off" type="text" @keydown.enter="sendMessage" :value="this.currentMessage"  @input="m => this.currentMessage = m.target.value" placeholder="Type a message...">
      <button @click.prevent="sendMessage">Send</button>
      <button @click.prevent="clearMessages">Clear messages</button>
    </div>
  </div>
</template>

<script>
import ChatMessage from "@/components/settings/ChatMessage";
import Vue from "vue";

export default {
  name: "MessagingScreen",
  components: {ChatMessage},
  data() {
    return {
      messages: [],
      currentMessage: "" //TODO add 'unread' position
    }
  },
  beforeMount() {
    this.messages = this.$global.messages.slice();
    this.$global.messages = [];
  },
  sockets: {
    new_message: function (messageData) {
      this.messages.push(messageData);
    },
    clear_messages: function () {
      this.messages = [];
    }
  },
  watch: {
    messages: {
      handler() {
        Vue.nextTick().then(() => {
          let box = document.getElementById("conversation");
          box.scrollTop = box.scrollHeight; //scroll to bottom
        });
      }
    }
  },
  methods: {
    sendMessage: function () {
      if (this.currentMessage === "") {
        return;
      }

      this.$socket.emit("send_message", this.currentMessage);
      this.currentMessage = "";
    },
    clearMessages: function () {
      this.$socket.emit("clear_messages");
    }
  }
}
</script>

<style scoped>
#messaging-root {
  display: flex;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  max-height: 100%;
  flex-direction: column;
  flex: 1;
  overflow: auto;
}

#conversation {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}

ul {
  list-style: none;
  padding: 0;
}

li:not(:last-child) {
  border-bottom: 1px solid #e2e2e2;
}

#messages {
  flex: 1;

  overflow: auto;
}

#message-box {
  font-family: "Roboto", "Segoe UI", "sans-serif";
  padding: 0.8em;
  border: 1px solid #a0a0a0;
  border-radius: 2px;
  outline: none;

  flex: 1;
}

#input {
  display: flex;

  gap: 0.2em;
}
</style>
