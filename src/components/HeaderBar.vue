<template>
  <div class="hello">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: "HeaderBar",
  props: {
    title: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../styles/variables.scss";

.hello {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $primary-color;
  width: 100%;
  height: 50px;
}
</style>
