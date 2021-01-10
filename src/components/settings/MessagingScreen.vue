<template>
<div>
  <div id="conversation">
    <div>Active conversation</div>
    <ul>
      <li>Hi</li>
      <li>Hello</li>
      <li>Can I come in?</li>
    </ul>
    <div id="input">
      <button>+</button>
      <input type="text" id="input-message" placeholder="Type a message..."/>
      <button>Send</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
name: "MessagingScreen"
}
</script>

<style scoped>

</style>
