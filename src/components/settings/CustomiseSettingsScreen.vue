<template>
  <div>
    <div id="customise-root">
      <h3>Customise</h3>
      <div class="context">You can customise elements of your display below.</div>
      <div id="wallpaper">
        <h4>Wallpaper</h4>
        <div id="settings-form">
          <div id="wallpaper-preview">
            <div v-if="uploading" class="uploading">Uploading...</div>
            <div v-else-if="backgroundUrl === null">No background image</div>
            <DynamicImage v-else :src="backgroundUrl"></DynamicImage>
          </div>

          <div id="wallpaper-options">
            <input type="file" id="image" accept="image/*">

            <button @click="uploadPhoto">Upload photo</button>
            <button @click="removePhoto">Remove photo</button>
          </div>
        </div>
      </div>
      <div id="widgets">
        <h4>Widgets</h4>
        <div class="context widget-help">Drag and drop the widget types below to adjust their order on the display.</div>
        <div>Selected</div>
        <div class="widgets-container">
          <div :class="{'widget': true, 'available': !widget}" :draggable="widget"
               @dragstart="widgetDragStart(widget.internal, ...arguments)"
               @dragover="widgetDragOver" @drop="widgetDrop(ix, ...arguments)" v-for="(widget, ix) in widgetInfo"
               :key="ix">
            <div v-if="!widget">
              <div class="widget-title">Available slot</div>
              <div class="widget-desc">Drag a widget here to move to this slot</div>
            </div>
            <div v-else>
              <span class="material-icons widget-delete" @click="deleteWidget(ix)">close</span>
              <span class="widget-info">
                <div class="widget-icon"><span class="material-icons">{{ widget.icon }}</span></div>
                <div class="widget-title">{{ widget.name }}</div>
                <div class="widget-desc">{{ widget.description }}</div>
              </span>
            </div>
          </div>
        </div>

        <div>Available</div>
        <div class="widgets-container">
          <div class="widget" draggable="true" @dragstart="widgetDragStart(widget.internal, ...arguments)"
               v-for="(widget, ix) in availableWidgets" :key="ix">
            <div class="widget-info">
              <div class="widget-icon"><span class="material-icons">{{ widget.icon }}</span></div>
              <div class="widget-title">{{ widget.name }}</div>
              <div class="widget-desc">{{ widget.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DynamicImage from "@/components/DynamicImage";

export default {
  name: "CustomiseSettingsScreen",
  components: {DynamicImage},
  sockets: {
    background_update(url) {
      this.backgroundUrl = url;
    },
    widgets_update(widgets) {
      this.widgets = !widgets ? [null, null, null] : widgets;
    }
  },
  data() {
    return {
      backgroundUrl: null,
      uploading: false,
      widgets: [null, null, null],
      widgetTypes: [
        {
          name: "Schedule",
          icon: "calendar_today",
          description: "Upcoming events listed from your calendar",
          internal: "ScheduleWidget"
        },
        {
          name: "Whiteboard",
          icon: "create",
          description: "A space for users to write quick messages",
          internal: "WhiteboardWidget"
        },
        {
          name: "Noticeboard",
          icon: "push_pin",
          description: "A list of notes which you can pin at any time",
          internal: "PinnedMessagesWidget"
        }
      ]
    }
  },
  computed: {
    widgetInfo() {
      return this.widgets.map(w => this.widgetTypes.find(wt => wt.internal === w) || null);
    },
    availableWidgets() {
      let widgets = this.widgets;
      return this.widgetTypes.filter(w => widgets.indexOf(w.internal) === -1);
    }
  },
  beforeMount() {
    this.$socket.emit("get_background");
    this.$socket.emit("get_widgets");
  },
  methods: {
    uploadPhoto() {
      let elem = document.getElementById("image");

      console.log(elem);

      let files = elem.files;

      if (!files || files.length === 0) {
        return; //no files!
      }

      let data = new FormData();

      data.append("image", files[0]);

      this.uploading = true;

      fetch("https://doorlink.xyz/upload/background-image/" + this.$global.roomId, {
        method: "POST",
        body: data
      }).catch(ex => alert("Error uploading file: " + ex.message))
          .finally(() => this.uploading = false);

      elem.value = "";
    },
    removePhoto() {
      this.$socket.emit("remove_background_image");
    },
    widgetDragStart(type, event) {
      //this.widgets = this.widgets.map(elem => (elem === type) ? null : elem);

      event.dataTransfer.setData('text/plain', type);
    },
    widgetDragOver(event) {
      event.preventDefault();
    },
    widgetDrop(index, event) {
      const type = event.dataTransfer.getData('text/plain');
      const currentWidget = this.widgets[index];
      this.widgets[index] = type;

      this.widgets = this.widgets.map((elem, ix) => (ix !== index && elem === type) ? currentWidget : elem);

      event.dataTransfer.clearData();

      this.updateWidgets();
    },
    updateWidgets() {
      this.$socket.emit("update_widgets", this.widgets);
    },
    deleteWidget(index) {
      this.$set(this.widgets, index, null);

      this.updateWidgets();
    }
  }
}
</script>

<style scoped>
#settings-form {
  display: flex;
  flex-direction: row;
  gap: 0.2em;

  width: 100%;
  max-width: 100%;
}

#wallpaper-options {
  display: flex;
  flex: 1;
  flex-direction: column;

  gap: 0.2em;
}

#wallpaper-preview {
  flex: 2;

  background-color: #333333;
  border-radius: 2px;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

#wallpaper-preview > div {
  text-align: center;
  margin: 5em;

  color: white;
}

#wallpaper-preview img {
  max-width: 100%;
}

@media screen and (max-width: 850px) {
  #settings-form {
    flex-direction: column;
  }
}

@keyframes uploading-pulse {
  0% {
    opacity: 40%;
  }

  50% {
    opacity: 100%;
  }

  100% {
    opacity: 40%;
  }
}

.uploading {
  animation: uploading-pulse 1.25s infinite;
}

.widgets-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  gap: 0.3em;

  margin-top: 0.6em;
  margin-bottom: 0.6em;

  flex-wrap: wrap;
}

.widget {
  background-color: #e3e3e3;
  border-radius: 2px;
  border: 1px solid #bfbfbf;
  padding: 0.7em;

  display: flex;

  align-items: center;

  cursor: all-scroll;

  height: 6.5em;

  transition: all 0.5s;
}

.widget > div {
  width: 100%;
}

.available {
  background-color: #d2d2d2;
  text-align: center;

  cursor: not-allowed;
}

.widget-info {
  text-align: center;
  width: 100%;
}

.widget-title {
  font-weight: 500;
}

.widget-desc {
  font-size: 0.8em;
}

.widget-delete {
  cursor: pointer;
}

.widget-help {
  margin-bottom: 0.8em;
}
</style>
