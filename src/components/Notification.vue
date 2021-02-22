<template>
  <div id="notifications-container">
    <transition-group name="slide">
      <div class="notification-root" v-for="notif in notifications" :key="notif.id" @click="handleClick(notif)">
        <span class="material-icons">notification_important</span>
        <div class="notification-content">
          <div class="notification-header">{{ notif.header }}</div>
          <div class="notification-body">{{ notif.caption }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "Notification",
  data() {
    return {
      notifications: [
        //{id: Math.random(), header: 'Intercom', caption: 'Somebody is calling the intercom', clickHandler: () => {console.log('hello')}}
      ]
    }
  },
  beforeMount() {
    this.$global.pushNotification = this.pushNotification;
  },
  methods: {
    scheduleRemoval(notification) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, 5000);
    },
    removeNotification(notification) {
      this.notifications.splice(this.notifications.indexOf(notification), 1);
    },
    pushNotification(notification) {
      if (!notification.id) {
        notification.id = Math.random().toString();
      }
      this.notifications.push(notification);
      this.scheduleRemoval(notification);
    },
    handleClick(notification) {
      notification.clickHandler();
      this.removeNotification(notification);
    }
  }
}
</script>

<style scoped>
#notifications-container {
  position: fixed;

  display: flex;

  flex-direction: column;

  width: 100%;

  z-index: 99;
}

.notification-root {
  top: 0;
  right: 0;
  left: 0;
}

@media screen and (min-width: 750px) {

  #notifications-container {
    max-width: 750px;
    right: 0;
  }
}

.notification-root {
  background-color: #292929;
  border-radius: 8px;

  padding: 1.2em 1em;
  margin: 0.2em;

  flex: 1 0 0;

  display: flex;

  flex-direction: row;
  color: white;

  align-items: center;

  gap: 1em;
}

.material-icons {
  font-size: 36px;
}

.notification-content {
  flex: 1;

  display: flex;

  flex-direction: column;
}

.notification-header {
  font-weight: 600;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter, .slide-leave-to {
  transform: translateY(-80px);
  opacity: 0;
}

.slide-leave-active {
  position: absolute;
}

.slide-move {
  transition: all 0.8s;
}
</style>
