<template>
  <div>
    <div>You can link your calendar by providing an iCalendar link</div>
    <input type="text" v-model="calendarUrl" placeholder="webcal://calendar.ics">
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
      this.$socket.emit("update_calendar", this.calendarUrl);
    }
  }
}
</script>

<style scoped>

</style>
