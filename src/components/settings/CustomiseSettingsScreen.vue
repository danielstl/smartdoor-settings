<template>
  <div>
    <div id="wallpaper">
      <form method="post" action="https://doorlink.xyz/upload/background-image" enctype="multipart/form-data">
        <img src="aaa"/>
        <input type="file" id="image" name="image"/>
        <input type="submit">
        <button>Remove photo</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomiseSettingsScreen",
  methods: {
    uploadPhoto() {

    }
  }
}
</script>

<style scoped>

</style>
