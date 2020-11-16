<template>
  <b-button :disabled="disabled" @click="buttonClicked"><slot></slot></b-button>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  components: {
    BButton,
  },
  data() {
    return {
      mapLoader: null,
    };
  },
  computed: {
    disabled() {
      return this.mapLoader === null;
    },
  },
  async mounted() {
    const o = await this.$loadScript(
      'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
    );
    // eslint-disable-next-line no-undef
    console.log('# FindingAddressButton');
    console.log(o);
    const self = this;
    this.mapLoader = new daum.Postcode({
      oncomplete(data) {
        // console.log(data);
        self.$emit('address-loaded', data);
        // console.log(this);
        // console.log(data);
        // console.log(self);
        // self.addressNew = `${data.roadAddress} (${data.bname})`;
        // self.addressOld = data.jibunAddress;
        // self.form.addressDetailed = data.buildingName;
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        // 예제를 참고하여 다양한 활용법을 확인해 보세요.
      },
    });
  },
  methods: {
    buttonClicked() {
      if (this.mapLoader) {
        this.mapLoader.open();
      }
    },
  },
};
</script>

<style>
</style>