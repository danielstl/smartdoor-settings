<template>
  <div id="calendar-root">
    <h3>Calendar integrations</h3>
    <div>You can link your calendar by providing an iCalendar link</div>
    <label for="calendar-url">Calendar URL</label>
    <input type="text" id="calendar-url" v-model="calendarUrl" placeholder="webcal://calendar.ics">
    <button @click="saveCalendar">
      Save calendar
    </button>
  </div>
</template>

<script>
export default {
  name: "CalendarIntegrationsScreen",
  data() {
    return {
      calendarUrl: null
    }
  },
  sockets: {
    calendar_update: function (update) {
      this.calendarUrl = !update ? null : update.url;
    }
  },
  mounted() {
    this.$socket.emit("get_calendar");
  },
  methods: {
    saveCalendar: function () {
      this.$socket.emit("update_calendar", this.calendarUrl.replaceAll("webcal://", "http://"));
    }
  }
}
</script>

<style scoped>
#calendar-root {
  display: flex;
  flex-direction: column;
}

#calendar-root > * {
  flex: 1;
}
</style>
