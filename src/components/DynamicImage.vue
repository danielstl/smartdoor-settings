<template>
  <transition name="image-fade">
    <img :src="src" :alt="alt" @load="loaded = true" v-show="loaded">
  </transition>
</template>

<script>
export default {
  name: "DynamicImage",
  props: {
    src: String,
    alt: String
  },
  data() {
    return {
      loaded: false
    }
  }
}
</script>

<style scoped>
.image-fade-enter-active, .image-fade-leave-active {
  transition: all 0.3s ease-out;
}

.image-fade-enter, .image-fade-leave-to {
  opacity: 0;
}

.image-fade-enter-to {
  opacity: 1;
}
</style>
