<template>
  <b-overlay :show="loading" variant="white">
    <div class="privacy Tmax-w-4xl Tmx-auto Tmt-10">
      <h1 class="Ttext-2xl Tfont-bold">영화향유플랫폼 소파섬 개인정보처리방침</h1>
      <privacy></privacy>
    </div>
  </b-overlay>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';
import { BOverlay } from 'bootstrap-vue';

const siteOptionReq = makeSimpleQuery('siteOption');

export default {
  name: 'PrivacyView',
  components: {
    BOverlay,
    Privacy: () => import('@/components/Privacy'),
  },
  data() {
    return {
      vuePageTitle: '',
      privacy: '',
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
        { name: 'option_privacy' },
        '{name value success code}',
      );
      if (res.success) {
        this.privacy = res.value;
      }
      this.loading = false;
    },
  },
};
</script>
