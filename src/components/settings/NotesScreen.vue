<template>
  <div>
    <div id="notes">
      <h3>Notes</h3>
      <div>You can pin notes to the home screen of the smart display below</div>
      <CreateNoteScreen v-if="creatingNote" @save="saveNote" @cancel="cancelNote"/>
      <div id="notes-list">
        <div v-for="(note, ix) in notes" :key="ix">
          <div class="pinned-message">
            <DynamicImage v-if="note.image" :src="note.image"></DynamicImage>
            <div>{{ note.text }}</div>
            <button @click="deleteNote(ix)">Delete</button>
          </div>
        </div>
      </div>
      <button id="create-note-button" @click="createNote">Create new note</button>
    </div>
  </div>
</template>

<script>
import CreateNoteScreen from "@/components/settings/CreateNoteScreen";
import DynamicImage from "@/components/DynamicImage";

export default {
  name: "NotesScreen",
  components: {DynamicImage, CreateNoteScreen},
  data() {
    return {
      notes: [],
      creatingNote: false
    }
  },
  sockets: {
    notes_update: function (notes) {
      this.notes = notes ? notes : [];
    }
  },
  mounted() {
    this.$socket.emit("get_notes");
  },
  methods: {
    saveNote: function (note) {
      //todo push to server
      this.notes.push(note);
      this.creatingNote = false;

      this.$socket.emit("update_notes", this.notes)
    },
    cancelNote: function () {
      this.creatingNote = false;
    },
    createNote: function () {
      this.creatingNote = true;
    },
    deleteNote: function (index) {
      this.notes.splice(index, 1);

      this.$socket.emit("update_notes", this.notes);
    }
  }
}
</script>

<style scoped>
.pinned-message {
  background-color: yellow;
  border: 1px solid #acacac;
  border-radius: 2px;

  height: auto;

  padding: 0.4em;

  width: auto;
  max-width: 650px;
}

.pinned-message > button {
  margin-top: 0.3em;
}

.pinned-message > img {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}

#notes {
  height: 100%;
  overflow: auto;
}

#notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.2em;

  margin-top: 0.5em;
}

#create-note-button {
  margin-top: 0.3em;
}
</style>
