<template>
  <div id="intercom-root">
    <Modal v-if="false"/>
    <h1>Intercom</h1>
    <div id="cam-containers">
      <div id="received-camera">
        <video autoplay id="received-cam-feed">

        </video>
      </div>
      <div id="self-camera">
        <video autoplay muted id="cam-feed">

        </video>
      </div>
      <button @click="startCall">START CALL!!!</button>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "IntercomScreen",
  components: {Modal},
  async mounted() {
    const config = {iceServers: [{urls: "stun:stun.l.google.com:19305"}]};

    console.log("11");

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
    intercom_call_signalling: async function (data) {
      console.log("recieved signal", data);
      if (data.message === "candidate") {
        await this.rtc.addIceCandidate(new RTCIceCandidate(data.candidate));

      } else if (data.message === "sdp") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        let answer = await this.rtc.createAnswer();
        await this.rtc.setLocalDescription(answer);

        this.$socket.emit("intercom_call_signalling", {message: "sdp_remote", sdp: answer})
      } else if (data.message === "sdp_remote") {
        await this.rtc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    }
  },
  methods: {
    async startCall() {
      console.log("start call!");

      this.description = await this.rtc.createOffer();
      await this.rtc.setLocalDescription(this.description);

      this.$socket.emit("start_intercom_call", this.description);
    },
    attachMediaStream(stream) {
      let camFeed = document.getElementById("received-cam-feed");

      camFeed.srcObject = stream;
    },
    onIceCandidate(event) {
      console.log(event.candidate);

      if (event.candidate !== undefined) {
        console.log("emitting candidate", this);
        this.$socket.emit("intercom_call_signalling", {message: "candidate", candidate: event.candidate});
      }
    },
    onAddStream(event) {
      console.log(event);

      this.attachMediaStream(event.stream);
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

#intercom-root {
  width: 100%;
  height: 100%;
}

#cam-containers {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: row;
}

#cam-containers > div {
  width: 100%;
  height: 100%;
}
</style>
