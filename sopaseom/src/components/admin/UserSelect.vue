<template>
  <div>
    <div class="Tborder Tflex">
      <b-form-input
        class="Tmin-w-max"
        size="sm"
        v-model="search"
        placeholder="이메일 입력"
        @keydown.enter="onEnterDown"
      ></b-form-input>
      <loading-button :loading="loading" size="sm" @click="userSearchClicked">
        <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
      </loading-button>
    </div>
    <p class="Ttext-sm" v-if="hasSearched && options.length === 0">
      검색된 이메일이 없습니다.
    </p>
    <b-link
      v-for="(option, index) in options"
      :key="option.value"
      class="Tw-full hover:Tno-underline Tblock Tborder Tborder-gray-400 last:T-border-b Tp-4 Ttransition-colors hover:Tbg-gray-100 focus:Tbg-gray-100"
      :style="{ marginTop: '-1px' }"
      :class="option.value === selected ? ['Tbg-gray-200', 'Tfont-bold'] : []"
      @click="selectOption(option.value, index)"
    >
      {{ option.text }}
    </b-link>
  </div>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';
import { BFormInput, BLink } from 'bootstrap-vue';

const usersReq = makeSimpleQuery('users');

export default {
  name: 'UserSelect',
  components: {
    BFormInput,
    LoadingButton: () => import('@/components/LoadingButton'),
    BLink,
  },
  props: {
    value: String,
  },
  data() {
    return {
      loading: false,
      search: '',
      options: [],
      selected: '',
      hasSearched: false,
    };
  },
  computed: {
    /** @returns {boolean} */
    selectDisabled() {
      return this.options.length === 1 && this.options[0].value === '';
    },
    /** @returns {string[]} */
  },
  mounted() {
    // console.log('# UserSelect.vue value');
    // console.log(this.value);
  },
  methods: {
    selectOption(value, index) {
      this.$emit('input', value);
      this.$emit('change', value);
      this.selected = value;
    },
    onEnterDown(event) {
      event.target.blur();
      this.userSearchClicked();
    },
    async fetchUserData() {
      this.loading = true;
      this.hasSearched = true;
      const { total, list } = await usersReq(
        { condition: { email: this.search } },
        '{total list {email role}}',
      );
      // console.log('# UserSelect.vue userSearchClicked');
      // console.log({ total, list });
      this.options = list.map((user) => ({
        value: user.email,
        text: user.email,
        selected: false,
      }));
      this.loading = false;
      this.prevIndex = null;
    },
    async userSearchClicked() {
      await this.fetchUserData();
      // this.options.unshift({ value: null, text: '선택' });
    },
  },
};
</script>
