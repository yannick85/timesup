<template>
  <div id="app">
    <div id="header">
      <div id="appName">Times Up</div>
      <div id="nav">
        <router-link to="/"><faicon icon="home" /></router-link>
        <router-link to="/about"><faicon icon="info" /></router-link>
      </div>
    </div>
    <div id="content">
      <div id="content-inside">
        <router-view/>
      </div>
    </div>
    <div id="footer">
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    customEmit: function (data) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
      console.log(data)
    },
    welcomeInGame: function (data) {
      this.$store.commit('setGame', data)
      this.$router.push({name: 'game'})
    }
  }
}
</script>