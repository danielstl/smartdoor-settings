<template>
  <div>
    <div id="customise-root">
      <h3>Customise</h3>
      <div id="wallpaper">
        <div>You can customise the background image for the display</div>
        <form method="post" action="https://doorlink.xyz/upload/background-image" enctype="multipart/form-data">
          <img src="aaa"/>
          <input type="file" id="image" name="image"/>
          <input type="submit">
          <button>Remove photo</button>
        </form>
      </div>
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
