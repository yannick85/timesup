<template>
  <div id="app">
    <div id="header">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
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
    }
  },
}
</script>