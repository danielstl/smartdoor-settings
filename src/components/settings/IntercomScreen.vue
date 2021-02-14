<template>
  <div id="intercom-root">
    <Modal v-if="false"/>
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
    <div id="cam-containers" v-show="callInProgress">
      <div id="received-camera">
        <video autoplay id="received-cam-feed">

        </video>
      </div>
      <div id="self-camera">
        <video autoplay muted id="cam-feed">

        </video>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "IntercomScreen",
  components: {Modal},
  data() {
    return {
      callInProgress: false,
      callRequestId: null
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

    this.rtc.onaddstream = this.onAddStream;

  },
  sockets: {
    intercom_call_request(id) {
      if (this.callRequestId === null) { //if we're not already in a call
        this.callRequestId = id;
        navigator.vibrate([1000, 1000, 1000, 1000, 1000, 1000]);
      } else {
        //this.$socket.emit("decline_call_request", id);
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

      this.$socket.emit("end_intercom_call", this.callRequestId);

      this.callInProgress = false;
      this.callRequestId = null;

      document.getElementById("cam-feed").srcObject = null;
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
        this.$socket.emit("intercom_call_signalling", {id: this.callRequestId, message: "candidate", candidate: event.candidate});
      }
    },
    onAddStream(event) {
      console.log("ADD STREAM!!");
      console.log(event);

      this.attachMediaStream(event.stream);

      this.callInProgress = true;

      document.getElementById("cam-containers").requestFullscreen({navigationUI: "hide"});
    }
  }
}
</script>

<style scoped>
#received-cam-feed {
  background: red;
  flex: 2;
}

#cam-feed {
  background: blue;
  flex: 1;
}

video {
  width: 100%;
  height: 100%;
}

#cam-containers {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  gap: 0.2em;
}

#cam-containers > div {
  height: 100%;

  border-radius: 8px;
  overflow: hidden;

  margin: 0.8em;
}

#call-request {
  background-color: green;
  border-radius: 2px;
  display: flex;
  padding: 0.3em;

  max-width: 450px;
}

#call-request-title {
  flex: 1;
}
</style>
