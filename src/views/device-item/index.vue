<template>
  <div class="app-container">
    {{ id }}
  </div>
</template>

<script>

export default {
  data() {
    return {
      id: null
    }
  },
  created() {
    this.id = this.$route.path.substring(this.$route.path.indexOf('_') + 1)
  },
  methods: {
  }
}
</script>
