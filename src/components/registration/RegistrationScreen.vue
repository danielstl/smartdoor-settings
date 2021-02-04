<template>
  <div id="login-wrapper">
    <div id="login-root">
      <h2>Welcome to DoorLink</h2>
      <p>Please sign in with a Door ID and password</p>

      <form id="login-form">
        <label for="door-id">Door ID</label>
        <input name="door-id" type="text" id="door-id">

        <label for="password">Password</label>
        <input name="password" type="password" id="password">

        <input type="submit">
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: "RegistrationScreen"
}
</script>

<style scoped>
#login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;

  background-color: #303030;
}

#login-root {
  text-align: center;

  display: flex;
  justify-content: center;
  flex-direction: column;

  padding: 2em;

  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.8) 0 2px 8px;
}

#login-form {
  display: flex;
  flex-direction: column;
}
</style>
