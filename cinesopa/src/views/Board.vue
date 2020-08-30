<template>
  <div>
    {{ permalink }}
  </div>
</template>

<script>
export default {
  name: 'Board',

  computed: {
    permalink() {
      return this.$route.params.permalink;
    },
    key() {
      return this.$route.params.permalink;
    },
  },
};
</script>

<style></style>
