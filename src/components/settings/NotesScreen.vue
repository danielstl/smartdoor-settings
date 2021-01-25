<template>
  <div>
    <div id="conversation">
      <h3>Notes</h3>
      <div>You can pin notes to the home screen of the smart display below</div>
      <CreateNoteScreen v-if="creatingNote" @save="saveNote" @cancel="cancelNote"/>
      <ul>
        <li v-for="(note, ix) in notes" :key="ix">
          <div>{{ note }}<button @click="deleteNote(ix)">Delete</button></div>
        </li>
      </ul>
      <button @click="createNote">Create new note</button>
    </div>
  </div>
</template>

<script>
import CreateNoteScreen from "@/components/settings/CreateNoteScreen";

export default {
  name: "NotesScreen",
  components: {CreateNoteScreen},
  data() {
    return {
      notes: [
        {
          text: "text note",
          image: null
        }
      ],
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
    deleteNote: function(index) {
      this.notes.splice(index, 1);

      this.$socket.emit("update_notes", this.notes);
    }
  }
}
</script>

<style scoped>

</style>
