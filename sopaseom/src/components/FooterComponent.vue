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
          <div></div>
          <div>
            <div class="right-block">통신판매업신고 : 면제대상사업자</div>
            <div class="right-block">개인정보관리책임자 : 성송이</div>
          </div>
          <div>
            <div class="right-block">상호 : 영화배급협동조합 씨네소파</div>
            <div class="right-block">대표 : 성송이</div>

            <div class="right-block">사업자번호 : 159-87-00749</div>
            <div class="right-block">전화번호 : 070-3577-4970</div>
          </div>
          <div>
            <div class="right-block">
              {{ address }}
              <!-- 부산광역시 해운대구 재반로103번길 5, 3층 -->
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
import { getOptionsFromServer } from '@/util';

export default {
  props: ['simple'],
  components: {
    BLink,
    CinesopaLogo: () => import('../components/CinesopaLogo.vue'),
  },
  data() {
    return {
      address: '',
      phone: '',
      contact_email: '',
    };
  },
  computed: {
    ...mapState(['additionalFooterPaddingBottom']),
    isSimple() {
      return this.simple === '' || this.simple === true;
    },
  },
  async mounted() {
    // console.log({ msg: 'Footer-simple!!', simple: this.simple });
    const options = await getOptionsFromServer(
      'address',
      'phone',
      'contact_email',
    );
    this.address = options[0].value;
    this.phone = options[1].value;
    this.contact_email = options[2].value;
  },
};
</script>

<style lang="scss" scoped>
@use '../style/common';
@use '../style/breakpoint';

$gray-c1: #585858;
$gray-c2: #7a7a7a;

.site-footer-wrapper {
  padding: 0 common.$desktop-min-x-margin;
  position: relative;
  background-color: #fff;
}

@include breakpoint.max-with(sm) {
  .site-footer-wrapper {
    padding: 0 common.$mobile-min-x-margin;
  }
}

// @include  breakpoint.max-with(md) {
//   .site-footer-wrapper {
//     margin-bottom: 30px;
//   }
// }

.site-footer {
  z-index: 1;
  position: relative;
  width: 100%;
  height: common.$desktop-footer-height;
  border-top: 2px solid black;
  padding: 30px 0 0;
  color: $gray-c1;
}

.simple .site-footer {
  height: 100px;
}

@include breakpoint.max-with(md) {
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

@include breakpoint.max-with(lg) {
  .center-wrapper {
    position: relative;
    padding-bottom: 30px;
  }
}

.center {
  display: flex;
  align-items: flex-end;
  color: common.$cinesopa-logo-color;
  transform: translateY(-20px);
}

@include breakpoint.max-with(md) {
  .right {
    margin-top: 10px;
    text-align: left;
  }
  .right-block {
    margin-left: 0;
    margin-right: 10px;
  }
  .center {
    transform: none;
    margin-top: 20px;
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
