<template>
  <div id="modal-overlay">
    <div id="modal-main-content">
      <div id="modal-header">Create new note</div>
      <div id="note-container">
        <div id="note-type">
          <button @click="addImage">Add image</button>
          <button @click="addDoodle">Add doodle</button>
        </div>
        <div id="note">
          <NoteDoodleWhiteboard ref="doodle" @doodle-complete="doodleUploadComplete" v-if="creatingDoodle && !note.image && !uploading"/>
          <DynamicImage v-if="note.image" :src="note.image" alt="Note image"></DynamicImage>
          <div id="uploading-note" v-if="uploading">Image uploading</div>
          <textarea id="note-text-input" v-model="note.text" placeholder="Enter your note here..."
                    oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea>
        </div>
      </div>
    </div>
    <div id="save-options">
      <button :disabled="this.uploading" @click="save">Save</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import DynamicImage from "@/components/DynamicImage";
import NoteDoodleWhiteboard from "@/components/settings/NoteDoodleWhiteboard";
export default {
  name: "CreateNoteScreen",
  components: {NoteDoodleWhiteboard, DynamicImage},
  data() {
    return {
      note: {
        text: "",
        image: null
      },
      creatingDoodle: false,
      uploading: false
    }
  },
  methods: {
    save() {
      if (this.creatingDoodle) {
        this.$refs.doodle.send();
        return;
      }

      if (this.note.text === "" && this.note.image === null) {
        this.cancel();
        return;
      }

      this.$emit("save", this.note);
    },
    cancel() {
      this.$emit("cancel");
    },
    doodleUploadComplete(url) {
      this.creatingDoodle = false;
      this.note.image = url;
      this.save();
    },
    addImage() {
      let dlg = document.createElement("input");
      dlg.type = "file";
      dlg.accept = "image/*";

      dlg.onchange = ev => {
        if (ev.target.files.length === 0) {
          return;
        }

        let data = new FormData();

        data.append("image", ev.target.files[0]);

        this.uploading = true;

        fetch("https://doorlink.xyz/upload/note-image/" + this.$global.roomId, {
          method: "POST",
          body: data
        })
            .then(res => res.json())
            .then(res => this.note.image = res.url)
            .catch(ex => alert("Error uploading file: " + ex.message))
            .finally(() => this.uploading = false);

        //alert(file);
      };

      dlg.click();
    },
    addDoodle() {
      this.note.image = null;
      this.creatingDoodle = true;
    }
  }
}
</script>

<style scoped>
#modal-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  top: 0;
  left: 0;

  display: flex;

  flex-direction: column;
  align-items: center;

  overflow-y: auto;
}

#modal-main-content {
  display: flex;

  flex-direction: column;
  align-items: center;

  flex: 1;
}

#modal-header {
  font-weight: 600;
  color: white;
  text-align: center;
  font-size: xx-large;

  padding: 0.75em;
}

#note-type {
  display: flex;
  width: 100%;
  margin-bottom: 0.6em;

  border-radius: 2px;
  overflow: hidden;
  gap: 2px;
}

#note-type > button {
  flex: 1;
  border: none;
  outline: none;

  border-radius: 0;

  transition: all 0.2s ease-in-out;
}

#note-type > button:hover {
  background-color: #e7e7e7;
}

#note-container {
  width: 80vw;
  max-width: 650px;
}

#note {
  background-color: #ffff88;
  border-radius: 2px;

  height: auto;

  padding: 0.4em;
}

#note > textarea {
  height: 100%;
}

#note > img {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}

#note-text-input {
  background-color: transparent;
  border: none;
  width: 100%;
  height: 100%;
  resize: none;
  outline: none;
  font-family: "Roboto", "Segoe UI", "sans-serif";
}

#save-options {
  width: 100%;
  display: flex;

  gap: 2px;
  margin: 2px;
}

#save-options > button {
  flex: 1;
  height: 35px;
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

#uploading-note {
  text-align: center;
  margin-top: 0.5em;
  margin-bottom: 0.5em;

  animation: uploading-pulse 1.25s infinite;
}
</style>
