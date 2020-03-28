<template>
  <div id="app">
    <div id="header">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
    </div>
    <div id="content">
      <router-view/>
    </div>
    <div id="footer">
    </div>
  </div>
</template>