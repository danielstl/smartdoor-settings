<template>
  <div id="modal-overlay">
    <div id="modal-main-content">
      <div id="modal-header">Create new note</div>
      <div id="note-container">
        <div id="note-type">
          <button>Text</button>
          <button>Drawing</button>
          <button>Image</button>
        </div>
        <div id="note">
          <textarea id="note-text-input" v-model="note.text" placeholder="Enter your note here..."></textarea>
        </div>
      </div>
    </div>
    <div id="save-options">
      <button @click="save">Save</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateNoteScreen",
  data() {
    return {
      note: {
        text: "",
        image: null
      }
    }
  },
  methods: {
    save: function () {
      this.$emit("save", this.note);
    },
    cancel: function () {
      this.$emit("cancel")
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
  background-color: yellow;
  width: 80vw;
  height: 80vw;
  max-width: 650px;
  max-height: 650px;
  border-radius: 2px;
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
</style>
