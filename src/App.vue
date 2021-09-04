<template>
  <div id="app">
    <HeaderBar class="header-bar" title="Bus Dashboard" />
    <router-view />
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar.vue";
export default {
  name: "Home",
  components: { HeaderBar },
};
</script>

<style lang="scss">
@import "./styles/variables.scss";
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
