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