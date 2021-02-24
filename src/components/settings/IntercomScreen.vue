<template>
  <div id="intercom-root">
    <h3>Intercom</h3>
    <div class="context">When a user uses the Intercom feature on the display, incoming call requests will be displayed
      here.
    </div>
    <div id="call-request" v-if="callRequestId !== null && !callInProgress">
      <span class="material-icons">phone</span>
      <div id="call-request-title">Incoming call</div>
      <div id="call-responses">
        <button @click="acceptCall">Accept</button>
        <button @click="declineCall">Decline</button>
      </div>
    </div>
    <div id="call" v-show="callInProgress">
      <div id="cam-containers">
        <div id="received-camera">
          <video autoplay id="received-cam-feed" class="widget-base">

          </video>
          <div id="self-camera">
            <video autoplay muted id="cam-feed" class="widget-base">

            </video>
          </div>
        </div>
      </div>
      <div id="call-controls" v-if="callInProgress">
        <button id="end-call-button" @click="endCall">End call</button>
        <button id="fullscreen-button" @click="enterFullscreen">{{ fullscreen ? "Exit fullscreen" : "Fullscreen" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IntercomScreen",
  data() {
    return {
      callInProgress: false,
      callRequestId: null,
      fullscreen: false
    }
  },
  async mounted() {
    const config = {iceServers: [{urls: "stun:stun.l.google.com:19305"}]};

    this.rtc = new RTCPeerConnection(config);

    this.rtc.onicecandidate = this.onIceCandidate;

    let camFeed = document.getElementById("cam-feed");
    let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

    camFeed.srcObject = stream;
    this.rtc.addStream(stream);

    console.log(this.rtc);

    this.callRequestId = this.$global.callRequestId;

    this.rtc.onaddstream = this.onAddStream;

  },
  watch: {
    callRequestId(value) {
      this.$global.callRequestId = value;
    }
  },
  sockets: {
    intercom_call_request(id) {
      if (this.callRequestId === null) { //if we're not already in a call
        this.callRequestId = id;

        setTimeout(() => { //clear call request ID after 30s
          if (this.callRequestId === id) {
            this.callRequestId = null;
          }
        }, 30 * 1000);
      }
    },
    cancel_call_request(id) {
      if (this.callRequestId === id) {
        this.callRequestId = null;
      }
    },
    async intercom_call_signalling(data) {
      if (data.id !== this.callRequestId) {
        return;
      }

      console.log("recieved signal", data);
      if (data.message === "candidate") {
        await this.rtc.addIceCandidate(new RTCIceCandidate(data.candidate));

      } else if (data.message === "sdp") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        let answer = await this.rtc.createAnswer();
        await this.rtc.setLocalDescription(answer);

        this.$socket.emit("intercom_call_signalling", {id: this.callRequestId, message: "sdp_remote", sdp: answer});

      } else if (data.message === "sdp_remote") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    },
    end_intercom_call(id) {
      if (id === this.callRequestId) {
        this.endCall();
      }
    }
  },
  beforeDestroy() {
    this.endCall();
  },
  methods: {
    async acceptCall() {
      let description = await this.rtc.createOffer();
      await this.rtc.setLocalDescription(description);

      this.$socket.emit("intercom_call_signalling", {id: this.callRequestId, message: "sdp", sdp: description});
    },
    declineCall() {
      this.$socket.emit("decline_call_request", this.callRequestId);

      this.callRequestId = null;
    },
    endCall() {
      this.rtc.close();

      if (this.callInProgress) {
        this.$socket.emit("end_intercom_call", this.callRequestId);

        this.callInProgress = false;
        this.callRequestId = null;

        this.$global.pushNotification({
          header: "Intercom",
          caption: "Call has been ended"
        });
      }

      document.exitFullscreen();
      this.fullscreen = false;

      let camObj = document.getElementById("cam-feed");

      if (camObj.srcObject) {
        camObj.srcObject.end();
        camObj.srcObject = null;
      }

      document.getElementById("received-cam-feed").srcObject = null;
    },
    attachMediaStream(stream) {
      let camFeed = document.getElementById("received-cam-feed");

      camFeed.srcObject = stream;
    },
    onIceCandidate(event) {
      console.log(event.candidate);

      if (event.candidate !== undefined) {
        console.log("emitting candidate", this);
        this.$socket.emit("intercom_call_signalling", {
          id: this.callRequestId,
          message: "candidate",
          candidate: event.candidate
        });
      }
    },
    onAddStream(event) {
      console.log("ADD STREAM!!");
      console.log(event);

      this.attachMediaStream(event.stream);

      this.callInProgress = true;
      //document.getElementById("cam-containers").requestFullscreen({navigationUI: "hide"});
    },
    enterFullscreen() {
      if (document.fullscreenElement !== null) {
        document.exitFullscreen();
        this.fullscreen = false;
      } else {
        document.getElementById("call").requestFullscreen({navigationUI: "hide"});
        this.fullscreen = true;
      }
    }
  }
}
</script>

<style scoped>
#self-camera {
  position: absolute;
  display: inline-block;
  width: 30vw;
  height: 16.125vw;
  right: 1em;
  bottom: 1em;
}

video {
  background-color: #292929;
  border-radius: 8px;
}

#self-camera video {
  border: 2px solid white;
}

#received-camera {
  position: relative;
  width: 100%;
  height: 100%;

  overflow: hidden;

  flex: 1;
}

#received-camera video {
  width: 100%;
  height: 100%;
}

#cam-containers {
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  flex: 1;
  overflow: auto;
}

#call {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#call-request {
  border-radius: 2px;
  display: flex;
  padding: 0.6em;

  color: white;
  align-items: center;

  max-width: 450px;

  animation: call-pulse 2s infinite;
}

@keyframes call-pulse {
  0% {
    background-color: green;
  }

  50% {
    background-color: #00b001;
  }

  100% {
    background-color: green;
  }
}

#call-responses {
  display: flex;
  gap: 0.2em;
}

#call-request-title {
  flex: 1;
  margin-left: 0.5em;
}

#call-controls {
  display: flex;
  gap: 0.2em;
}

#call-controls > button {
  flex: 1;
  padding: 1em;
}

/*#end-call-button {
  padding: 0.4em;
  background-color: #ff1e1e;
  color: white;
  font-weight: 600;
  font-size: large;
  border-radius: 2px;
  border: none;
  cursor: pointer;
}*/

</style>
