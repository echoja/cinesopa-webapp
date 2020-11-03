<template>
  <div>
    <h2>환영합니다!</h2>
    <div class="info">
      <p class="s1">회원가입을 축하드립니다.</p>
      <p class="s2">
        이메일로 인증 링크를 보내드렸으니,<br />확인해주시기 바랍니다.
      </p>
    </div>
    <!-- @click="nextButtonClicked" -->
    <b-button class="next-button" :to="{ name: 'Home' }"> 홈으로 </b-button>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue';
import { mapMutations, mapState } from 'vuex';

export default {
  title: '회원가입 - 완료',
  components: {
    BButton,
  },
  mounted() {
    if (this.joinFinished === false) {
      this.$router.push({ name: 'Home' });
    }
    this.setJoinProcessing(false);
  },
  computed: {
    ...mapState(['joinFinished', 'joinProcessing']),
  },
  methods: {
    ...mapMutations(['setJoinProcessing']),
    nextButtonClicked() {},
  },
};
</script>

<style lang="scss" scoped>
h2,
p {
  text-align: center;
}

h2 {
  font-size: 60px;
  font-weight: bold;
  margin-top: 30px;
}

.info {
  margin-top: 30px;
}

.s1 {
  font-size: 28px;
  margin-bottom: 0;
}

.s2 {
  font-size: 18px;
}

.next-button {
  margin-top: 80px;
  display: block;
  width: 100%;
  font-size: 21px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style scoped></style>

<style></style>
