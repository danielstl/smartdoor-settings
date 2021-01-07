<template>
  <div id="user-root">
    <img id="user-icon" src="https://thispersondoesnotexist.com/image"/>
    <div>
      <div id="user-name">Daniel Stoliar</div>
      <div id="user-status">
        <img/><span>Available</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserStatus"
}
</script>

<style scoped>
#user-root {
  display: flex;
  flex-flow: row;
}

#user-root > div {
  display: flex;
  flex-flow: column;
  align-self: center;
  flex: 1;
}

#user-icon {
  width: 4em;
  height: 4em;
  align-self: center;
  margin-right: 0.6em;
  border-radius: 50%;
}
</style>