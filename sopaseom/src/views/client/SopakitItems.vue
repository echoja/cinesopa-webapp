<template>
  <div class="sopakit-items">
    <!-- <div class="page-header-wrapper"> -->
    <page-header>
      <div class="mobile">
        <div class="page-header-inner-wrapper">
          <h1>소파킷</h1>
          <span class="seperator">|</span>
          <b-link class="emp header-link"> 키워드 </b-link>
          <b-link class="header-link" :to="{ name: 'SopakitAllItems' }">
            상품 목록
          </b-link>
        </div>
      </div>
      <div class="desktop">
        <div class="page-header-inner-wrapper">
          <h1>소파킷</h1>
          <span class="seperator">|</span>
          <b-link class="emp header-link"> 키워드 </b-link>
          <b-link class="header-link" :to="{ name: 'SopakitAllItems' }">
            상품 목록
          </b-link>
          <div class="search-box">
            <b-form-input
              @keyup.enter="searchEnterKeyupped"
              class="search-input"
              placeholder="검색"
              v-model="search"
            ></b-form-input>
            <b-button class="search-button" @click="searchButtonClicked">
              <font-awesome-icon class="search-icon" :icon="['fas', 'search']">
              </font-awesome-icon>
            </b-button>
          </div>
        </div>
      </div>
    </page-header>
    <!-- <div v-for="index in 100" :key="index">소파킷 아이템 {{ index }}</div> -->
    <!-- </div> -->
    <div class="content-wrapper">
      <div class="content">
        <div class="summary">
          <p>
            영화배달서비스<br class="desktop" />
            소파킷은 <br class="desktop" />새로운 만남의<br class="desktop" />
            시도로, 대안적 배급 <br class="desktop" />서비스입니다.<br
              class="desktop"
            />
            매년 하나의 키워드로 <br class="desktop" />영화를 선정하여<br
              class="desktop"
            />
            소개합니다.
          </p>
          <!-- <p class="go-detail">
            <b-link>자세히 보기 <svg-next></svg-next></b-link>
          </p> -->
        </div>
        <div class="items flex-fill">
          <div class="items-inner-wrapper">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide"
                  v-for="(keyword, index) in keywords"
                  :key="index"
                >
                  <div class="swiper-slide-inner-wrapper">
                    <!-- <pre class="test">{{keyword}}</pre> -->

                    <div class="mobile-main-mock">
                      <div class="image-resizer">
                        <div
                          class="inner"
                          :style="{
                            'background-image': `url('${keyword.image_url}')`,
                          }"
                        ></div>
                      </div>
                    </div>
                    <div class="title-section">
                      <div class="title-number">{{ keyword.num }}</div>
                      <div class="title-seperator">
                        <!-- | -->
                      </div>
                      <div class="title-text">{{ keyword.title }}</div>
                      <div class="title-products">
                        {{
                          keyword.products
                            .map((product) =>
                              product.related_film
                                ? product.related_film.title
                                : null,
                            )
                            .join(', ')
                        }}
                      </div>
                      <div class="title-year">{{ keyword.year }}.</div>
                    </div>
                    <div class="mobile-title-products">
                      {{
                        keyword.products
                          .map((product) =>
                            product.related_film
                              ? product.related_film.title
                              : null,
                          )
                          .join(', ')
                      }}
                    </div>
                    <div class="content-section">
                      <div class="content-main">
                        <div class="main-mock">
                          <b-img :src="keyword.image_url"></b-img>
                        </div>
                        <div
                          class="main-text"
                          v-html="keyword.description.replace(/\n/g, '<br />')"
                        ></div>
                      </div>
                      <div class="content-product">
                        <div class="product-title">상품 보기</div>
                        <div class="product-items">
                          <div
                            class="product-item"
                            v-for="(product, productIndex) in keyword.products"
                            :key="productIndex"
                          >
                            <b-link
                              class="product-img-link"
                              :to="{
                                name: 'SopakitDetail',
                                params: { id: product.id },
                              }"
                            >
                              <div
                                class="product-img"
                                :style="{
                                  'background-image': `url(${product.featured_image_url})`,
                                }"
                              ></div>
                            </b-link>
                            <!-- <b-img :src="film.image_url"></b-img> -->
                            <div class="product-film-title">
                              <b-link
                                :to="{
                                  name: 'SopakitDetail',
                                  params: { id: product.id },
                                }"
                              >
                                {{ product.name }}</b-link
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class="swiper-slide">ho</div> -->
                <div class="swiper-slide">
                  <div class="last-page">
                    <div class="no-keyword-products-wrapper">
                      <div class="no-keyword-header">SPECIALS</div>
                      <div class="no-keyword-products">
                        <div
                          class="no-keyword-product"
                          v-for="product in noKeywordProducts"
                          :key="product.id"
                        >
                          <div class="no-keyword-featured-image">
                            <b-link
                              :to="{
                                name: 'SopakitDetail',
                                params: { id: product.id },
                              }"
                            >
                              <b-img
                                :src="`${product.featured_image_url}?size=common`"
                                :alt="product.featured_image_alt"
                              ></b-img>
                            </b-link>
                          </div>
                          <div class="no-keyword-text">
                            <div class="no-keyword-title">
                              <b-link
                                :to="{
                                  name: 'SopakitDetail',
                                  params: { id: product.id },
                                }"
                              >
                                {{ product.name }}
                              </b-link>
                            </div>
                            <div class="no-keyword-meta">
                              {{ product.c_date }} {{ product.side_phrase }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="footer-box">
                      <sopakit-list-footer-info
                        right
                        class="footer-box-content"
                      >
                      </sopakit-list-footer-info>
                    </div>
                  </div>
                </div>
              </div>
              <!-- If we need pagination -->
              <div class="swiper-pagination"></div>

              <!-- If we need navigation buttons -->
              <div class="swiper-button-prev">
                <left-big-arrow></left-big-arrow>
              </div>
              <div class="swiper-button-next">
                <right-big-arrow></right-big-arrow>
              </div>

              <!-- If we need scrollbar -->
              <!-- <div class="swiper-scrollbar"></div> -->
            </div>
          </div>
        </div>
        <div class="fixed-wave-container-wrapper lg:Thidden">
          <div class="fixed-wave-container">
            <b-img
              :style="{ transform: `translateX(${waveTranslateX}px)` }"
              src="@/assets/wave.png"
              :class="{ 'swiper-touching': swiperTouching }"
            ></b-img>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BLink, BImg, BButton, BFormInput } from 'bootstrap-vue';
import SwiperCore, { Navigation, A11y, Mousewheel } from 'swiper';
import LeftBigArrow from '@/components/LeftBigArrow.vue';
import RightBigArrow from '@/components/RightBigArrow.vue';
import SopakitListFooterInfo from '@/components/SopakitListFooterInfo.vue';

// import 'swiper/swiper.scss';
// import 'swiper/components/navigation/navigation.scss';
// import 'swiper/components/pagination/pagination.scss';
// import 'swiper/components/scrollbar/scrollbar.scss';

import { makeSimpleQuery } from '@/api/graphql-client';

SwiperCore.use([Navigation, A11y, Mousewheel]);
const sopakitsShownReq = makeSimpleQuery('sopakitsShown');

export default {
  components: {
    PageHeader: () => import('@/components/PageHeader.vue'),
    // SvgNext: () => import('@/components/SvgNext'),
    SopakitListFooterInfo,
    BLink,
    BImg,
    BButton,
    BFormInput,
    LeftBigArrow,
    RightBigArrow,
    // SwiperSlide,
    // Swiper,
    // BodyFixedFooter: () => import('@/views/layout/BodyFixedFooter.vue'),
  },
  data() {
    return {
      vuePageTitle: '',
      swiper: null,
      noKeywordProducts: [],
      keywords: [
        // {
        //   num: '01',
        //   title: '고독',
        //   products: [
        //     {
        //       film_title: '여름날',
        //       link: 'https://naver.com',
        //       id: '1',
        //       // eslint-disable-next-line global-require
        //       featured_image_url:
        //         'https://sopaseom.com/upload/e9e865dfb901fbc11709df8d1511ca3d',
        //     },
        //     {
        //       film_title: '기억할만한 지나침',
        //       link: 'https://naver.com',
        //       id: '1',
        //       // eslint-disable-next-line global-require
        //       featured_image_url:
        //         'https://sopaseom.com/upload/a206886e8633c12caf7a795a842d7f65',
        //     },
        //   ],
        //   description:
        //     '‘고독’에 숨겨진 뜻이\n‘만남’이라고 제안하고 싶습니다.\n외로
        // 운 사람만이 만남의 진정한\n가치를 알 수 있듯\n고독할 때에야 비로소
        // 나와\n타인을 생각하게 되니까요.',
        //   year: 2020,
        //   // eslint-disable-next-line global-require
        //   image_url:
        //     'https://sopaseom.com/upload/b3e7a3fc69f30216ff55049e5c61eba8',
        // },
        // {
        //   num: '01',
        //   title: '고독',
        //   products: [
        //     {
        //       film_title: '여름날',
        //       link: 'https://naver.com',
        //       // eslint-disable-next-line global-require
        //       featured_image_url:
        //         'https://sopaseom.com/upload/e9e865dfb901fbc11709df8d1511ca3d',
        //     },
        //     {
        //       film_title: '기억할만한 지나침',
        //       link: 'https://naver.com',
        //       // eslint-disable-next-line global-require
        //       featured_image_url:
        //         'https://sopaseom.com/upload/a206886e8633c12caf7a795a842d7f65',
        //     },
        //   ],
        //   description:
        //     '‘고독’에 숨겨진 뜻이\n‘만남’이라고 제안하고 싶
        // 습니다.\n외로운 사람만이 만남의 진정한\n가치를 알 수
        // 있듯\n고독할 때에야 비로소 나와\n타인을 생각하게 되니까요.',
        //   year: 2020,
        //   // eslint-disable-next-line global-require
        //   image_url:
        //     'https://sopaseom.com/upload/b3e7a3fc69f30216ff55049e5c61eba8',
        // },
      ],
      search: '',
      waveWidth: 221,
      contentWidth: 700,
      slideTranslate: 0,
      swiperWidth: 100,
      swiperLength: 2,
      swiperTouching: false,
    };
  },
  computed: {
    // 파도의 translateX 계산.
    /** @returns {number} */
    waveTranslateX() {
      const maxWaveTranslate = this.contentWidth - this.waveWidth;
      let maxSliderWidth = this.swiperWidth * (this.swiperLength - 1);
      if (maxSliderWidth < 0) maxSliderWidth = 0;
      const slideCurrentTranslate = this.slideTranslate * -1;
      const calc = (slideCurrentTranslate / maxSliderWidth) * maxWaveTranslate;
      if (calc < 0) return 0;
      if (calc > maxWaveTranslate) return maxWaveTranslate;
      return calc;
    },
  },
  created() {
    window.addEventListener('resize', this.onResize);
  },
  async mounted() {
    this.vuePageTitle = '소파킷';
    await this.fetchData();
    this.$nextTick(() => {
      this.swiper = new SwiperCore('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        freeMode: true,
        freeModeSticky: true,
        // loop: true,

        // If we need pagination
        // pagination: {
        //   el: '.swiper-pagination',
        // },

        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // cssMode: true,
        mousewheel: true,
        on: {
          // sliderMove: (slider, event) => {
          //   console.log('# SoakitItems sliderMove event');
          //   console.log({ slider, event });
          // },
          init: (swiper) => {
            // console.log('# SoakitItems setTranslate event');
            // console.log(
              `total width: ${swiper.width * swiper.slides.length}px,  width: ${
                swiper.width
              }`,
            );
            this.swiperWidth = swiper.width;
            this.swiperLength = swiper.slides.length;
            this.recalculateContentWidth();
          },
          resize: (swiper) => {
            setTimeout(() => {
              this.swiperWidth = swiper.width;
            }, 50);
          },
          setTranslate: (slider, translate) => {
            // console.log('# SoakitItems setTranslate event');
            // console.log({ slider, translate, width: slider.width });
            this.slideTranslate = translate;
          },
          touchStart: () => {
            this.swiperTouching = true;
          },
          touchEnd: () => {
            this.swiperTouching = false;
          },
          // setTransition: (slider, event) => {
          //   console.log('# SoakitItems setTransition event');
          //   console.log({ slider, event });
          // },
        },

        // And if we need scrollbar
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        // },
      });
    });
  },
  beforeMount() {
    window.removeEventListener('reisze', this.onResize);
  },
  methods: {
    onSwiper(swiper) {
      // console.log(swiper);
    },
    onSlideChange() {
      // console.log('slide change');
    },
    async fetchData() {
      const res = await sopakitsShownReq(
        {},
        `{
          sopakitsShownItems {
            sopakit { id title num description year image_url }
            products {
              id name featured_image_url related_film {
                title
              }
            }
          }
          noKeywordProducts {
            id name featured_image_url side_phrase related_film {
              title
            }
          }
        }`,
      );
      // console.log('# SopakitItems fetchData res');
      // console.log(res);
      this.keywords = res.sopakitsShownItems.map((item) => ({
        ...item.sopakit,
        products: item.products,
      }));
      this.noKeywordProducts = res.noKeywordProducts;
      // this.keywords = res.sopakitsshownItems;
    },
    searchEnterKeyupped() {
      this.searchProcess();
    },
    searchButtonClicked() {
      this.searchProcess();
    },
    async searchProcess() {
      try {
        this.$router
          .push({
            name: 'SopakitAllItems',
            query: {
              search: this.search,
            },
          })
          .catch((err) => {
            // console.log('ho');
            console.dir(err);
            this.fetchData();
          });
      } catch (e) {
        console.dir(e);
        // console.log('error!!');
      }
    },
    onResize() {
      this.recalculateContentWidth();
    },
    recalculateContentWidth() {
      this.contentWidth =
        document.querySelector('.fixed-wave-container-wrapper')?.offsetWidth ?? 700;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../style/common';
@use '../../style/breakpoint';

.content-wrapper {
  // margin-top: 50px;
  margin-top: common.$dt-sopakit-content-wrapper-mt;
  flex: 1;
  display: flex;
  flex-direction: column;
}

@include breakpoint.max-with(lg) {
  .content-wrapper {
    margin-top: 20px;
  }
}

@include breakpoint.max-with(md) {
  .content-wrapper {
    height: auto;
  }
}

.content {
  display: flex;
  align-items: stretch;
  flex: 1;
}

@include breakpoint.max-with(lg) {
  .content {
    flex-direction: column;
  }
}

@include breakpoint.max-with(md) {
  .content {
    height: auto;
  }
}

.sopakit-items {
  display: flex;
  flex-direction: column;
  flex: 1;
}

@include breakpoint.max-with(md) {
  .sopakit-items {
    height: auto;
  }
}

.summary {
  flex-shrink: 0;
  padding-right: 60px;
  border-right: 2px solid #000;
  p {
    font-size: min(3vw, 21px);
    font-weight: 500;
    margin: 0;
  }
}

@include breakpoint.max-with(lg) {
  .summary {
    width: 100%;
    border: 0;
    padding: 0;
    /* padding: 0 common.$mobile-sopakit-slide-padding; */
    margin-bottom: 50px;
    p {
      font-size: 18px;
    }
  }

  br.desktop {
    display: none;
  }
}

.go-detail a {
  color: #565656;
  font-size: 14px;
  line-height: 1;
  svg {
    width: 6px;
    margin-top: -2px;
    margin-left: 5px;
  }
}

@include breakpoint.max-with(sm) {
  .summary p {
    font-size: 14px;
  }
}

.search-box {
  margin-left: auto;
  height: 100%;
  border-left: 2px solid #000;
  display: flex;
  align-items: center;
}

.search-button.btn-secondary {
  display: inline-block;
  border: 0;
  height: 100%;
}

.search-input.form-control {
  max-width: 300px;
  height: 100%;
  display: inline-block;
  border: 0;
}

.search-icon {
}
.seperator {
  padding: 0 18px;
  font-size: 20px;
}

// .mobile {
//   border-top: 2px solid #000;
// }

.mobile,
.desktop {
  height: 100%;
}

@include breakpoint.max-with(md) {
  .desktop {
    display: none;
  }
}
@include breakpoint.min-with(md) {
  .mobile {
    display: none;
  }
}

@include breakpoint.max-with(md) {
  .page-header-inner-wrapper.desktop {
    display: none;
  }
}

@include breakpoint.min-with(md) {
  .page-header-inner-wrapper.mobile {
    display: none;
  }
}

.header-link {
  font-size: 18px;
  color: #999;
  margin-right: 20px;
  font-weight: bold;
  &.emp {
    color: #000;
    font-weight: bold;
  }
}

@include breakpoint.max-with(md) {
  .header-link {
    font-size: 16px;
  }
}

// swiper
.items-inner-wrapper {
  width: 100%;
  height: 100%;
}

.swiper-container {
  height: 100%;
}

.items {
  flex: 1;
  margin-left: 20px;
  overflow: hidden;
  .swiper-button-prev:after,
  .swiper-button-next:after {
    display: none;
  }
  .swiper-button-prev svg,
  .swiper-button-next svg {
    width: 16.46px;
  }
}

@include breakpoint.max-with(lg) {
  .items {
    margin-left: -1 * common.$mobile-min-x-margin;
    margin-right: -1 * common.$mobile-min-x-margin;
    /* margin-left: 0; */
  /* width: 100%; */
  }
}

.swiper-button-prev,
.swiper-button-next {
  height: 100%;
  margin-top: 0;
  top: 0;
  padding: 0 calc(12% - 100px);
  width: auto;
  color: #000;
}
.swiper-button-prev {
  left: 0;
}
.swiper-button-next {
  right: 0;
}

.swiper-slide {
  padding: 0 calc(20% - 120px);
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

@include breakpoint.max-with(xl) {
  .swiper-slide {
    padding: 0 common.$mobile-sopakit-slide-padding;
  }

  .swiper-button-prev,
  .swiper-button-next {
    padding: 0 20px;
  }
}

.swiper-slide-inner-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.title-section {
  display: flex;
  height: 60px;
  align-items: flex-end;
  padding-bottom: 25px;
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
  line-height: 1;
  box-sizing: border-box;
}

@include breakpoint.max-with(md) {
  .title-section {
    height: 35px;
    margin-bottom: 0;
    border-bottom-width: 1px;
    padding-bottom: 10px;
  }
}

.title-number,
.title-text {
  font-size: 33px;
  font-weight: 500;
}

@include breakpoint.max-with(md) {
  .title-number,
  .title-text {
    font-size: 22px;
    font-weight: 500;
  }
}

.title-seperator {
  width: 3px;
  background-color: #000;
  height: 90%;
  margin: 0 14px;
}
@include breakpoint.max-with(md) {
  .title-seperator {
    width: 2px;
  }
}

.title-products {
  margin-left: 21px;
  font-size: 21px;
  font-weight: 500;
}

.mobile-title-products {
  display: none;
  font-size: 14px;
  padding: 5px 0;
  border-bottom: 1px solid #000;
  margin-bottom: 15px;
}

@include breakpoint.max-with(md) {
  .title-products,
  .title-year {
    display: none;
  }
  .mobile-title-products {
    display: block;
  }
}

.title-year {
  margin-left: 21px;
  font-size: 21px;
}

.title-year {
  margin-left: auto;
}

.content-section {
  flex: 1;
  display: flex;
  align-items: center;
}

@include breakpoint.max-with(xl) {
  .content-section {
    display: block;
  }
}
.content-main {
  display: flex;
  min-width: 500px;
  flex: 1 0 0;
}

.main-mock {
  position: relative;
  width: 177px;
  height: 174px;
  margin-right: 20px;
  margin-top: 2px;
  pointer-events: none;
  z-index: -1;
}

@include breakpoint.max-with(md) {
  .main-mock {
    display: none;
  }
}

.main-mock img {
  position: absolute;
  transform: translate(-34.7%, -28.5%) scale(0.7);
}

.mobile-main-mock {
  display: none;
  width: 100%;
  padding-bottom: 100%;
  position: relative;

  .image-resizer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .inner {
    position: absolute;
    background-size: 100%;
    transform: translate(-22%, -16%);
    width: 155%;
    height: 120%;
  }
}

@include breakpoint.max-with(md) {
  .mobile-main-mock {
    display: block;
    // display: none;
    width: 100%;
    margin-right: 20px;
    margin-top: 2px;
  }
}

.main-text {
  font-size: 18px;
  font-weight: 500;
  margin-left: 20px;
  margin-right: 30px;
}

@include breakpoint.max-with(md) {
  .main-text {
    font-size: 14px;
    margin: 0;
    width: 100%;
  }
}

.content-product {
  flex: 1;
  border-left: 1px solid #000;
  padding: 10px 0 30px 30px;
  max-width: 350px;
}

@include breakpoint.max-with(xl) {
  .content-product {
    margin-top: 30px;
    border: none;
    padding: 0;
  }
}

@include breakpoint.max-with(lg) {
  .product-item {
    display: inline-block;
  }

  .product-film-title a::after {
    content: ' >';
    // padding-left: 5px;
    padding-right: 20px;
  }

  .product-img-link {
    display: none;
  }
}
.product-img {
  width: 100%;
  background-position: center;
  background-size: cover;
  height: 0;
  padding-bottom: 30%;
}

.product-img img {
  width: 100px;
}

.product-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-film-title {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
}

// 마지막 페이지

.last-page {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: stretch;
}

@include breakpoint.max-with(md) {
  .last-page {
    display: block;
    width: 100%;
    height: auto;
  }
}

.no-keyword-products-wrapper {
  padding-right: 30px;
  border-right: 1px solid #000;
  margin-right: 30px;
  // height: calc(100vh - #{$dt-sopakit-last-page-neg});
  overflow: auto;
  flex: 1;
}

@include breakpoint.max-with(md) {
  .no-keyword-products-wrapper {
    padding-right: 0;
    border-right: 0;
    margin-right: 0;
    height: auto;
  }
}

.no-keyword-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
}

.no-keyword-product {
  display: flex;
  padding-bottom: 30px;
  border-bottom: 1px solid #000;
  margin-bottom: 30px;
}

.no-keyword-featured-image {
  height: 100px;
  margin-right: 20px;
  flex: 0 0 auto;
  width: 150px;
  border: 1px solid #ddd;
  box-sizing: border-box;

  a {
    width: 100%;
    height: 100%;
    display: block;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.no-keyword-text {
  flex: 1;
}
.no-keyword-meta {
  font-size: 14px;
  color: #585858;
}

.footer-box {
  margin-left: auto;
  margin-bottom: 30px;
  display: flex;
  width: 300px;
}
@include breakpoint.max-with(md) {
  .footer-box {
    margin-left: 0;
  }
}

.footer-box-content {
  margin-top: auto;
}

// fixed wave container
.fixed-wave-container-wrapper {
  margin: 0 -1 * common.$desktop-min-x-margin;
}
@include breakpoint.max-with(sm) {
  .fixed-wave-container-wrapper {
    margin: 0 -1 * common.$mobile-min-x-margin;
  }
}
.fixed-wave-container {
  position: fixed;
  bottom: common.$simple-footer-height - 2;
  z-index: 22;
  img:not(.swiper-touching) {
    transition: 0.5s;
  }
}
@include common.when-page-translating('.fixed-wave-container img') {
  opacity: 0;
}

@include breakpoint.max-with(sm) {
  .fixed-wave-container {
    position: absolute;
  }
}
</style>

<style scoped></style>

<style></style>
