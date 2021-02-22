<template>
  <div id="login-wrapper">
    <div id="login-root">
      <img alt="DoorLink logo" id="logo" src="https://doorlink.xyz/manage/icons/256.png"/>
      <div id="welcome-header">Welcome to DoorLink</div>
      <p id="welcome-desc">Please {{ isRegistering ? "create a new account below" : "sign in with your account below" }}</p>

      <div id="login-options">
        <button :class="{selected: !isRegistering}" @click="toggleRegistration(false)">Use an existing account</button>
        <button :class="{selected: isRegistering}" @click="toggleRegistration(true)">Register a new account</button>
      </div>

      <transition name="error">
        <div id="login-error" v-if="errorMessage">
          <strong>Error</strong>
          <div>{{ errorMessage }}</div>
        </div>
      </transition>

      <div id="login-form">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" @keydown.enter="login">

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" @keydown.enter="login">

        <label for="password" :class="{'register-hidden': !isRegistering, register: true}">Confirm Password</label>
        <input type="password" :class="{'register-hidden': !isRegistering, register: true}" id="password-confirm"
               v-model="passwordConfirm" @keydown.enter="login">
      </div>

      <button id="login-button" @click="login">{{ isRegistering ? "Register" : "Log in" }}</button>
    </div>
  </div>
</template>

<script>

export default {
  name: "RegistrationScreen",
  data() {
    return {
      username: "",
      password: "",
      passwordConfirm: "",
      isRegistering: false,
      errorMessage: null
    }
  },
  sockets: {
    login_failure(message) {
      this.errorMessage = message;
      this.password = "";
      this.passwordConfirm = "";
      delete localStorage.session;
    }
  },
  methods: {
    toggleRegistration(registering) {
      this.isRegistering = registering;
      this.passwordConfirm = "";
    },
    login() {
      if (!this.isRegistering) {
        this.$socket.emit("login", this.username, this.password);
      } else {
        if (this.passwordConfirm !== this.password) {
          this.errorMessage = "Password and password confirmation do not match";
        } else {
          this.$socket.emit("register", this.username, this.password);
        }
      }
    }
  }
}
</script>

<style scoped>
@keyframes load-fade {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
#login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;

  background-color: #3b3b3b;
  color: white;
}

#login-root {
  text-align: center;

  display: flex;
  align-items: center;
  flex-direction: column;

  width: 22em;

  padding: 2em;

  -background-color: white;
  border-radius: 10px;
  -box-shadow: rgba(0, 0, 0, 0.8) 0 2px 8px;
}

input[type=password], input[type=text] {
  background-color: #5d5d5d;
  padding: 0.6em 0.6em;
  color: white;
  border-radius: 3px;
  margin-bottom: 0.8em;
}

#login-options {
  display: flex;
  gap: 0.2em;
  border-radius: 2px;
  overflow: hidden;
  width: 100%;
  margin-bottom: 0.8em;

  animation: load-fade 0.4s ease-in-out;
  animation-delay: 0.25s;
  animation-fill-mode: both;
}

button {
  flex: 1;
  border: none;
  outline: none;

  background-color: #eeeeee;

  padding: 0.8em;

  border-radius: 0;
  border-bottom: 3px solid transparent;

  transition: all 0.2s ease-in-out;
}

#login-button {
  border-radius: 2px;
  padding: 0.4em 0.8em;
  font-weight: 600;
  margin-top: 1em;
  font-size: 1.1em;

  animation: load-fade 0.4s ease-in-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
}

button:not(.selected):hover {
  background-color: #ffffff;
}

#login-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  width: 100%;

  animation: load-fade 0.4s ease-in-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
}

#login-error {
  background-color: red;
  border-radius: 3px;
  padding: 0.8em;
  width: 100%;
  box-sizing: border-box;
  margin: 0.8em;

  animation: load-fade 0.25s ease-in-out;
  animation-delay: 0.25s;
  animation-fill-mode: both;
}

#logo {
  width: 64px;
  height: 64px;

  animation: load-fade 0.4s ease-in-out;
  animation-delay: 0s;
  animation-fill-mode: both;
}

#welcome-header {
  margin-top: 0.6em;
  font-size: x-large;
  font-weight: 600;

  animation: load-fade 0.4s ease-in-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
}

#welcome-desc {
  animation: load-fade 0.4s ease-in-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

#login-options > button {
  font-weight: 500;
}

.selected {
  background-color: #ffc278;
  border-bottom: 3px solid #e7801d;
}

.register {
  opacity: 1;
  transition: all 0.2s ease-in-out;
}

.register-hidden {
  opacity: 0;
  user-select: none;
  cursor: default !important; /*override input cursor*/
}

.error-enter-active, .error-leave-active {
  transition: all 0.3s ease-out;
}

.error-enter, .error-leave-to {
  opacity: 0;
}

.error-enter-to {
  opacity: 1;
}

@media screen and (max-width: 650px) {
  #login-root {
    width: 100%;
  }

  #login-form {
    width: 100%;
    padding: 0.1em;
  }

  #login-error {
    width: 100%;
  }

  #login-options {
    flex-direction: column;
  }

  #login-options > button {
    margin-bottom: 0.4em;
    border-radius: 2px;
  }
}
</style>
