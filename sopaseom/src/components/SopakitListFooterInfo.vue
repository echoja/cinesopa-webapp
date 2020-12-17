<template>
  <div
    class="sopakit-list-footer-info"
    :class="{ right: right === '' || right === true }"
  >
    <div class="name">영화배급협동조합 씨네소파</div>
    <div class="copyright">
      Copyright © 2020 Cinesopa<br />All Rights Reserved
    </div>
    <div class="links">
      <span>
        <b-link :to="{ name: 'Policy' }">이용약관</b-link>
      </span>
      <span class="links-seperator">|</span>
      <!-- <br /> -->
      <span>
        <b-link :to="{ name: 'Privacy' }">개인정보처리방침</b-link>
      </span>
      <span class="links-seperator">|</span>
      <!-- <br /> -->
      <!-- <span> -->
      <!-- <b-link :to="{ name: 'Policy' }">이메일무단수집거부</b-link> -->
      <!-- </span> -->
      <!-- <span class="links-seperator">|</span> -->
      <span>
        <b-link :to="{ name: 'Sitemap' }">사이트맵</b-link>
      </span>
    </div>
    <div class="footer-line">
      <div>개인정보관리책임자 : 성송이</div>
      <div>전화번호 : 070-3577-4970</div>
      <div>사업자번호 : 159-87-00749</div>
    </div>
    <div class="footer-line">
      <div>통신판매업신고 : 면제대상사업자</div>
    </div>
    <div class="footer-line">
      <div>부산광역시 해운대구 재반로103번길 5, 3층</div>
      <div>coop.cinesopa@gmail.com</div>
    </div>
  </div>
</template>

<script>
import { BLink } from 'bootstrap-vue';

export default {
  props: ['right'],
  components: {
    BLink,
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

.sopakit-list-footer-info {
  font-size: 14px;
  color: #585858;
  text-align: right;
}
@include max-with(md) {
  .sopakit-list-footer-info {
    text-align: left;
  }
}

.name {
  font-size: 16px;
  font-weight: bold;
}

.copyright {
  margin-bottom: 20px;
}

.links a,
.links {
  color: #888;
}

.links {
  font-size: 13px;
  margin-bottom: 15px;
}

// @include max-with(md) {
//   .links br {
//     display: none;
//   }
// }

.links-seperator {
  padding: 0 7px;
}

// @include min-with(md) {
//   .links-seperator {
//     display: none;
//   }
// }

.footer-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  > div {
    padding-left: 15px;
    padding-right: 0;
  }
}
@include max-with(md) {
  .footer-line {
    justify-content: flex-start;
    > div {
      padding-left: 0;
      padding-right: 15px;
    }
  }
}
</style>
<style>
</style>