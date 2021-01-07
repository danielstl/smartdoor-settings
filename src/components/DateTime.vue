<template>
  <div id="time-root">
    <div id="time">{{ time }}</div>
    <div id="date">{{ date }}</div>
  </div>
</template>

<script>
export default {
  name: "DateTime",
  data() {
    return {
      date: "aaa",
      time: "aaa"
    }
  },
  mounted() {
    window.setInterval(() => {
      let now = new Date();

      const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      this.time = now.getHours() + ":" + now.getMinutes();
      this.date = weekdays[now.getDay() - 1] + " " + now.getDay() + " " + months[now.getMonth() - 1];


      }, 1000 * 1);

    document.getElementById("time").onclick = () => {
      document.documentElement.requestFullscreen();
    };
  }
}
</script>

<style scoped>
#time-root {
  text-align: right;
}

#time {
  font-weight: 500;
  font-size: xx-large;
}

#date {
  font-size: 1.3em;
}
</style>