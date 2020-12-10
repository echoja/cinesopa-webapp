<template>
  <footer
    class="site-footer-wrapper"
    :class="{ simple: isSimple }"
    :style="{ 'padding-bottom': `${additionalFooterPaddingBottom}px` }"
  >
    <div class="site-footer container-fluid">
      <div v-if="!isSimple" class="row">
        <div class="left col-12 col-md-6">
          <div class="name">영화배급협동조합 씨네소파</div>
          <div class="copyright">
            Copyright © 2020 Cinesopa All Rights Reserved
          </div>
          <div class="links">
            <span>
              <b-link :to="{ name: 'Policy' }">이용약관</b-link>
            </span>
            <span class="links-seperator">|</span>
            <span>
              <b-link :to="{ name: 'Privacy' }">개인정보처리방침</b-link>
            </span>
            <!-- <span class="links-seperator">|</span> -->
            <!-- <span> -->
            <!-- <b-link :to="{ name: 'Policy' }">이메일무단수집거부</b-link> -->
            <!-- </span> -->
            <span class="links-seperator">|</span>
            <span>
              <b-link :to="{ name: 'Sitemap' }">사이트맵</b-link>
            </span>
          </div>
        </div>
        <div v-if="!isSimple" class="right col-12 col-md-6">
          <div>
            <div class="right-block">개인정보관리책임자 : 성송이</div>
            <div class="right-block">사업자번호 : 159-87-00749</div>
          </div>
          <div>
            <div class="right-block">
              통신판매업신고 : 제2020-부산해운대-4727호
            </div>
          </div>
          <div>
            <div class="right-block">
              부산광역시 해운대구 재반로103번길 5, 3층
            </div>
            <div class="right-block">coop.cinesopa@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
    <div class="center-wrapper">
      <div class="center">
        <span class="by"> by. </span
        ><cinesopa-logo class="cineesopa-logo"></cinesopa-logo>
      </div>
    </div>
  </footer>
</template>

<script>
import { BLink } from 'bootstrap-vue';
import { mapState } from 'vuex';

export default {
  props: ['simple'],
  components: {
    BLink,
    CinesopaLogo: () => import('../components/CinesopaLogo.vue'),
  },
  computed: {
    ...mapState(['additionalFooterPaddingBottom']),
    isSimple() {
      return this.simple === '' || this.simple === true;
    },
  },
  mounted() {
    console.log({ msg: 'Footer-simple!!', simple: this.simple });
  },
};
</script>

<style lang="scss" scoped>
@import '../common';

$gray-c1: #585858;
$gray-c2: #7a7a7a;

.site-footer-wrapper {
  padding: 0 $desktop-min-x-margin;
  position: relative;
  background-color: #fff;
}

@include max-with(sm) {
  .site-footer-wrapper {
    padding: 0 $mobile-min-x-margin;
  }
}

// @include max-with(md) {
//   .site-footer-wrapper {
//     margin-bottom: 30px;
//   }
// }

.site-footer {
  z-index: 1;
  position: relative;
  width: 100%;
  height: $desktop-footer-height;
  border-top: 2px solid black;
  padding: 30px 0 0;
  color: $gray-c1;
}

.simple .site-footer {
  height: 100px;
}

@include max-with(md) {
  .site-footer {
    height: auto;
  }
}

.flex-items {
  display: flex;
  justify-content: space-between;
}

.name {
  font-weight: bold;
  font-size: 16px;
}

.copyright {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.links a,
.links {
  color: $gray-c2;
}

.links {
  font-size: 13px;
}

.links-seperator {
  padding: 0 7px;
}

.right {
  text-align: right;
  font-size: 13px;
}

.right-block {
  display: inline-block;
  margin: 0 5px;
  :last-child {
    margin: 0;
  }
}

.center-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

@include max-with(lg) {
  .center-wrapper {
    position: relative;
    padding-bottom: 30px;
  }
}

.center {
  display: flex;
  align-items: flex-end;
  color: $cinesopa-logo-color;
  transform: translateY(-20px);
}

@include max-with(md) {
  .right {
    margin-top: 10px;
    text-align: left;
  }
  .right-block {
    margin-left: 0;
    margin-right: 10px;
  }
}

.by {
  display: block;
  font-size: 16px;
  font-weight: 400;
  margin-right: 4px;
}

.cineesopa-logo {
  width: 70px;
  display: block;
  transform: translateY(-3px);
}
</style>

<style>
</style>
