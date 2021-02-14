<template>
  <div>
    <div id="doodles">
      <h3>Doodles</h3>
      <div class="context">Doodles that have been submitted using the display are listed here.</div>
      <div id="doodle-list">
        <div v-for="(doodle, ix) in doodles" :key="ix">
          <div class="pinned-message">
            <DynamicImage :src="doodle"></DynamicImage>
            <button @click="deleteDoodle(ix)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <button id="delete-button" @click="deleteDoodles">Delete all doodles</button>
  </div>
</template>

<script>
import DynamicImage from "@/components/DynamicImage";

export default {
  name: "WhiteboardScreen",
  components: {DynamicImage},
  data() {
    return {
      doodles: []
    }
  },
  sockets: {
    doodles_update: function (doodles) {
      this.doodles = doodles ? doodles : [];
    }
  },
  mounted() {
    this.$socket.emit("get_doodles");
  },
  methods: {
    deleteDoodle(index) {
      let doodleUrl = this.doodles.splice(index, 1);

      this.$socket.emit("remove_doodle", doodleUrl);
    },
    deleteDoodles() {
      this.$socket.emit("delete_doodles");
    }
  }
}
</script>

<style scoped>
.pinned-message {
  background-color: white;
  border: 1px solid #acacac;
  border-radius: 2px;

  padding: 0.4em;

  max-width: 250px;
  height: 350px;

  display: flex;
  flex-direction: column;
}

.pinned-message > button {
  margin-top: 0.3em;
}

.pinned-message img {
  width: 100%;
  object-fit: contain;
  border-radius: 8px;

  max-height: 100%;
  height: 100%;

  overflow: auto;

  flex: 1;
}

#doodles {
  height: 100%;
  overflow: auto;
}

#doodle-list {
  -display: grid;
  -grid-template-columns: 1fr 1fr 1fr;
  gap: 0.2em;

  margin-top: 0.5em;
}

#doodle-list > div {
  display: inline-block;
  margin: 0.2em;
}

#delete-button {
  margin-top: 0.3em;
  width: 100%;
}
</style>
