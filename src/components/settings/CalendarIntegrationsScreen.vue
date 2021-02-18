<template>
  <div id="calendar-root">
    <h3>Calendar integrations</h3>
    <div class="context">
      You can link your calendars by providing iCalendar links.<br>
      <ul id="pre-calendar-list">
        <li v-for="ca in predefinedCalendars" :key="ca.name"><a :href="ca.link" target="_blank">{{ca.name}}</a></li>
      </ul>
    </div>
    <h4>Calendars</h4>
    <div id="calendars">
      <div v-if="loading">Loading...</div>
      <div v-else class="calendar" v-for="(cal, ix) in calendars" :key="ix">
        <label :for="'calendar-url-' + ix">URL</label>
        <input type="text" :id="'calendar-url-' + ix" v-model="cal.url" placeholder="http://calendar.ics">
        <label :for="'calendar-colour-' + ix">Colour</label>
        <input type="color" :id="'calendar-colour-' + ix" v-model="cal.colour"/>
        <button @click="deleteCalendar(ix)">Delete</button>
      </div>
    </div>
    <div id="save-options" v-if="!loading">
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
      changesMade: false,
      loading: true,
      predefinedCalendars: [
        {
          "name": "Google Calendar",
          "link": "https://support.google.com/calendar/answer/37648#zippy=%2Cget-your-calendar-view-only"
        },
        {
          "name": "Outlook Calendar",
          "link": "https://outlook.live.com/owa/?path=/options/calendarpublishing"
        },
      ]
    }
  },
  sockets: {
    calendar_update: function (update) {
      this.loading = false;

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

#pre-calendar-list a {
  color: black;
  text-decoration: none;
  display: block;
  padding: 1em;
}

#pre-calendar-list li {
  list-style: none;
  flex: 1;
  background-color: #ececec;
  border: 1px solid #9d9d9d;
  text-align: center;
  border-radius: 2px;
}

#pre-calendar-list {
  margin-left: 0;
  padding: 0;
  display: flex;
  gap: 0.3em;
}
</style>
