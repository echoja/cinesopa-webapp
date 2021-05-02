<template>
  <div
    :style="style"
    class="privacy"
    v-html="privacy"
    aria-label="개인정보처리방침"
    tabindex="0"
  ></div>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';

const siteOptionReq = makeSimpleQuery('siteOption');

export default {
  name: 'PrivacyComponent',
  props: ['height'],
  data() {
    return {
      privacy: '',
    };
  },
  computed: {
    /** @returns {object} */
    style() {
      if (!this.height) return {};
      return {
        height: `${this.height}px`,
        overflowY: 'scroll',
        border: '1px solid #ddd',
      };
    },
  },
  async mounted() {
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

<style>

.privacy h2 {
  @apply Ttext-xl Tfont-bold Tmt-5 Tmb-3;
}

.privacy h3 {
  @apply Ttext-lg Tfont-bold Tmt-4 Tmb-2;
}

.privacy ol {
  @apply Tlist-decimal Tpl-5 Tmb-2;
}

.privacy ul {
  @apply Tlist-disc Tpl-5 Tmb-2;
}

.privacy p {
  @apply Tpb-2;
}

</style>
