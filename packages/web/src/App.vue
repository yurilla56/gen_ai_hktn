<template>
  <router-view/>
</template>

<style lang="scss">

body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  min-height: 412px;
  overflow: auto;
  font-family: Montserrat, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
