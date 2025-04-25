<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {

    }
  },
  methods: {
    toIndex() {
      this.$router.push({
        path:"/adminIndex/index"
      })
    }
  }
}
</script>

<style scoped>

</style>
