<template>
  <div id="calendar-root">
    <h3>Calendar integrations</h3>
    <div>You can link your calendars by providing iCalendar links</div>
    <h4>Calendars</h4>
    <div id="calendars">
      <div class="calendar" v-for="(cal, ix) in calendars" :key="ix">
        <label :for="'calendar-url-' + ix">URL</label>
        <input type="text" :id="'calendar-url-' + ix" v-model="cal.url" placeholder="http://calendar.ics">
        <label :for="'calendar-colour-' + ix">Colour</label>
        <input type="color" :id="'calendar-colour-' + ix" v-model="cal.colour"/>
        <button @click="deleteCalendar(ix)">Delete</button>
      </div>
    </div>
    <div id="save-options">
      <button v-if="changesMade" @click="saveCalendar">
        Save
      </button>
      <button v-if="changesMade" @click="cancelChanges">
        Cancel
      </button>
      <button @click="newCalendar">
        New calendar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalendarIntegrationsScreen",
  data() {
    return {
      calendars: [],
      prevCalendars: [],
      changesMade: false
    }
  },
  sockets: {
    calendar_update: function (update) {
      console.log(JSON.stringify(update));
      this.prevCalendars = update.map(c => new Object({url: c.url, colour: c.colour}));

      if (!this.changesMade) {
        this.calendars = this.prevCalendars.slice();
        this.changesMade = false;
      }
    }
  },
  mounted() {
    this.$socket.emit("get_calendar");
  },
  watch: {
    urls: {
      sync: true,
      handler() {
        this.changesMade = true;
      }
    },
    colours: {
      sync: true,
      handler() {
        this.changesMade = true;
      }
    }
  },
  computed: {
    urls() {
      return this.calendars.map(c => c.url);
    },
    colours() {
      return this.calendars.map(c => c.colour);
    }
  },
  methods: {
    saveCalendar() {
      this.calendars = this.calendars.filter(c => c.url);
      this.$socket.emit("update_calendar", this.calendars);

      this.changesMade = false;
    },
    deleteCalendar(index) {
      this.calendars.splice(index, 1);

      this.changesMade = true;
    },
    newCalendar() {
      this.calendars.push({url: "", color: "#0000ff"});

      this.changesMade = true;
    },
    cancelChanges() {
      this.calendars = this.prevCalendars.slice();

      this.changesMade = false;
    }
  }
}
</script>

<style scoped>
#calendar-root {
  display: flex;
  flex-direction: column;
}

#save-options {
  margin-top: 0.8em;
  gap: 0.2em;

  display: flex;

  height: 2.2em;
}

#save-options > button {
  flex: 1;
}

#calendar-root > * {
  flex: 1;
}

#calendars {
  display: flex;
  flex-direction: column;

  gap: 0.3em;
}

.calendar {
  display: flex;
  flex-direction: column;

  background-color: #e9e9e9;
  border: 1px solid #9f9f9f;

  padding: 0.4em;

  gap: 0.3em;

  border-radius: 2px;
}
</style>
