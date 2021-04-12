<template>
  <div></div>
</template>

<script>
export default {
  name: 'RequestTaxInfoGate',
  async mounted() {
    const { token } = this.$route.query;
    if (typeof token === 'string') {
      this.$store.commit('setTaxLinkToken', token);
    }
    this.$router.push({ name: 'RequestTaxInfo' });
  },
};
</script>

<style>
</style>
