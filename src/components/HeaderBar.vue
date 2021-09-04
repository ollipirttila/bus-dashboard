<template>
  <div class="header-bar">
    <font-awesome-icon class="header-icon" icon="bus" size="2x" />
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: "HeaderBar",
  props: {
    title: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../styles/variables.scss";

.header-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $primary-color;
  height: 60px;
  margin: 0 auto;
  .header-icon {
    margin: 0 20px 0 20px;
  }
}
</style>
