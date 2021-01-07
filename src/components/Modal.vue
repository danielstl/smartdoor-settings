<template>
  <div v-if="visible" id="modal-overlay">
    <div id="modal">
      <div id="modal-content">
        <div id="temp" style="height: 100%; text-align: center; display: flex; flex-flow: column; align-items: center; justify-content: center;">
          <img src="https://thispersondoesnotexist.com/image" style="height: 100px; width: 100px; border-radius: 50%;"/>
          <p style="font-size: 24pt; font-weight: 500;">Do you want to call Daniel?</p>
        </div>
        <slot></slot>
      </div>
      <div id="modal-buttons">
        <button class="button negative" @click="visible = false;">Cancel</button>
        <button class="button positive">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      visible: true
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
}

#modal {
  width: 65%;
  position: fixed;
  height: 58%;
  background-color: white;
  border-radius: 8px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
}

#modal-buttons {
  width: 100%;
  display: flex;
}

#modal-content {
  flex: 1;
}

.button {
  flex: 1;
  height: 3.5em;
  color: white;
  font-size: 1.4em;
  font-weight: 500;
  border: none;
}

.button :focus {
  outline: none;
  box-shadow: none;
  border: none;
}

.positive {
  background-color: #7575ff;
}

.negative {
  background-color: #ff3f3f;
}
</style>