<template>
  <b-overlay :show="loading" variant="white">
    <div class="policy Tmax-w-4xl Tmx-auto Tmt-10">
      <h1 class="Ttext-2xl Tfont-bold">영화향유플랫폼 소파섬 이용약관</h1>
      <div class="Tmb-10" v-html="policy"></div>
    </div>
  </b-overlay>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';
import { BOverlay } from 'bootstrap-vue';

const siteOptionReq = makeSimpleQuery('siteOption');

export default {
  name: 'Policy',
  components: {
    BOverlay,
  },
  data() {
    return {
      vuePageTitle: '',
      policy: '',
      loading: true,
    };
  },
  async mounted() {
    this.vuePageTitle = '이용약관';
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await siteOptionReq(
        { name: 'option_policy' },
        '{name value success code}',
      );
      if (res.success) {
        this.policy = res.value;
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

<style scoped></style>

<style>
.policy h2 {
  @apply Ttext-xl Tfont-bold Tmt-5 Tmb-3;
}

.policy h3 {
  @apply Ttext-lg Tfont-bold Tmt-4 Tmb-2;
}

.policy ol {
  @apply Tlist-decimal Tpl-5 Tmb-2;
}
.policy ul {
  @apply Tlist-disc Tpl-5 Tmb-2;
}
.policy p {
  @apply Tpb-2
}
</style>
