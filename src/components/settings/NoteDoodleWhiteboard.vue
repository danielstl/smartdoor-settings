<template>
  <div class="note-whiteboard-base">
    <div id="whiteboard-title">Draw a doodle below...</div>
    <div id="canvas-wrapper">
      <canvas id="whiteboard" @touchmove.prevent="moveDraw" @mousemove.prevent="moveDraw" @touchend.prevent="stopDraw"
              @mouseup.prevent="stopDraw"
              @touchstart.prevent="draw" @mouseenter.prevent="draw" @mousedown.prevent="draw" :class="{sent: this.recentlySent}"/>
    </div>
    <div id="whiteboard-options">
      <ul>
        <li>
          <button @click.prevent="clearCanvas" :disabled="recentlySent" class="colour">
            <span class="material-icons">delete</span>
          </button>
        </li>
        <li class="colour-item" v-for="(c, i) in colours" :key="c">
          <button @click.prevent="selectColour(i)" :style="{'background-color': c}"
                  :class="{'colour': 1, 'selected': i === selectedColour}"></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteDoodleWhiteboard",
  data() {
    return {
      canvas: null,
      context: null,
      pos: [0, 0],
      colours: [
        "#000000",
        "#ff0000",
        "#ff600a",
        "#4acd00",
        "#0000ff",
        "#00ffff",
        "#ff00ff",
      ],
      selectedColour: 0,
      uploading: false,
      emptyCanvas: true,
      recentlySent: false
    }
  },
  mounted() {
    this.canvas = document.getElementById("whiteboard");
    this.context = this.canvas.getContext("2d");

    setTimeout(this.resize, 1000);

    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    draw: function (e) { //setPosition
      //alert("draw " + JSON.stringify(e));
      this.pos = [(e.touches ? e.touches[0].clientX : e.clientX) - this.canvas.offsetLeft, (e.touches ? e.touches[0].clientY : e.clientY) - this.canvas.offsetTop];
    },
    resize() {
      console.log("resize");

      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;

      let rect = this.canvas.getBoundingClientRect();

      this.canvas.width = rect.width * devicePixelRatio;
      this.canvas.height = rect.height * devicePixelRatio;

      this.context.scale(devicePixelRatio, devicePixelRatio);

      //this.canvas.style.width = rect.width + 'px';
      //this.canvas.style.height = rect.height + 'px';
    },
    moveDraw: function (e) { //draw
      //alert("move" + JSON.stringify(e));
      if (e.buttons !== undefined && e.buttons !== 1 || this.uploading || this.recentlySent) return;

      let ctx = this.context;

      ctx.beginPath(); // begin

      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = this.colours[this.selectedColour];

      ctx.moveTo(this.pos[0], this.pos[1]); // from
      this.draw(e);
      ctx.lineTo(this.pos[0], this.pos[1]); // to

      ctx.stroke(); // draw it!

      this.emptyCanvas = false;
    },
    stopDraw: function () {

    },
    selectColour: function (index) {
      this.selectedColour = index;
    },
    clearCanvas: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.emptyCanvas = true;
    },
    send() {
      if (this.emptyCanvas) {
        this.$emit("doodle-complete", null);
        return;
      }

      this.uploading = true;

      this.canvas.toBlob(blob => {

        let form = new FormData();
        form.append("image", new File([blob], "doodle.png", {type: "image/png"}));

        fetch("https://doorlink.xyz/upload/note-image/" + this.$global.roomId, {
          method: "POST",
          body: form
        })
            .then(res => res.json())
            .then(res => {
              this.$emit("doodle-complete", res.url);
            })
            .finally(() => this.uploading = false);
      }, "image/png");
    }
  }
}
</script>

<style scoped>

#whiteboard-title {
  font-weight: 500;
}

#canvas-wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
}

#whiteboard {
  width: 100%;
  height: 300px;
}

#uploading-overlay {
  position: relative;
  top: 0;
  left: 0;
}

#whiteboard-options > ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  justify-content: space-evenly;
}

.colour {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  border: 2px solid transparent;
  transition: all 0.1s;
  padding: 0;
  text-align: center;
  background-color: #666;
  color: white;
}

.selected {
  border: 2px solid white;
  box-shadow: 0 0 0 2px #303030;
}

.sent {
  animation: doodle-send 1s cubic-bezier(.17,.67,.12,1);
}

@keyframes doodle-send {

  0% {
    opacity: 1;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
  }

  90% {
    fill: blue;
    opacity: 0;
    background-color: #868686;
    transform: scale(0.8);
  }
}

.note-whiteboard-base {
  overflow: auto;
  border-bottom: 1px solid #9d9d9d;
  padding-bottom: 0.5em;
}

button:focus {
  outline: none;
}
</style>
