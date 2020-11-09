<template>
  <div class="sopakit-items">
    <!-- <div class="page-header-wrapper"> -->
    <page-header>
      <div class="mobile">
        <div class="page-header-inner-wrapper">
          <h1>소파킷</h1>
          <span class="seperator">|</span>
          <b-link class="list" :to="{ name: 'SopakitAllItems' }">
            상품 목록
          </b-link>
        </div>
      </div>
      <div class="desktop">
        <div class="page-header-inner-wrapper">
          <h1>소파킷</h1>
          <span class="seperator">|</span>
          <b-link class="list" :to="{ name: 'SopakitAllItems' }">
            상품 목록
          </b-link>
          <div class="search-box"></div>
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
          <p class="go-detail">
            <b-link>자세히 보기 <svg-next></svg-next></b-link>
          </p>
        </div>
        <div class="items">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(keyword, index) in keywords"
                :key="index"
              >
                <div class="swiper-slide-inner-wrapper">
                  <div class="mobile-main-mock">
                    <div class="image-resizer">
                      <div
                        class="inner"
                        :style="{
                          'background-image': `url('${keyword.mock_url}')`,
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="title-section">
                    <div class="title-number">{{ keyword.number }}</div>
                    <div class="title-seperator">
                      <!-- | -->
                    </div>
                    <div class="title-text">{{ keyword.title }}</div>
                    <div class="title-films">
                      {{ keyword.films.map((film) => film.title).join(', ') }}
                    </div>
                    <div class="title-year">{{ keyword.year }}.</div>
                  </div>
                  <div class="mobile-title-films">
                    {{ keyword.films.map((film) => film.title).join(', ') }}
                  </div>
                  <div class="content-section">
                    <div class="content-main">
                      <div class="main-mock">
                        <b-img :src="keyword.mock_url"></b-img>
                      </div>
                      <div
                        class="main-text"
                        v-html="keyword.explain.replace(/\n/g, '<br />')"
                      ></div>
                    </div>
                    <div class="content-product">
                      <div class="product-title">상품 보기</div>
                      <div class="product-items">
                        <div
                          class="product-item"
                          v-for="(film, filmIndex) in keyword.films"
                          :key="filmIndex"
                        >
                          <b-link
                            class="product-img-link"
                            :to="{
                              name: 'SopakitDetail',
                              params: { id: '123' },
                            }"
                          >
                            <div
                              class="product-img"
                              :style="{
                                'background-image': `url(${film.img_url})`,
                              }"
                            ></div>
                          </b-link>
                          <!-- <b-img :src="film.img_url"></b-img> -->
                          <div class="product-film-title">
                            <b-link
                              :to="{
                                name: 'SopakitDetail',
                                params: { id: '123' },
                              }"
                            >
                              {{ film.title }}</b-link
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="swiper-slide">ho</div>
            </div>
            <!-- If we need pagination -->
            <div class="swiper-pagination"></div>

            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>

            <!-- If we need scrollbar -->
            <!-- <div class="swiper-scrollbar"></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BLink, BImg } from 'bootstrap-vue';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default {
  title: '소파킷',
  components: {
    PageHeader: () => import('@/components/PageHeader.vue'),
    SvgNext: () => import('@/components/SvgNext'),
    BLink,
    BImg,
    // SwiperSlide,
    // Swiper,
    // BodyFixedFooter: () => import('@/views/layout/BodyFixedFooter.vue'),
  },
  data() {
    return {
      swiper: null,
      keywords: [
        {
          number: '01',
          title: '고독',
          films: [
            {
              title: '여름날',
              link: 'https://naver.com',
              id: '1',
              // eslint-disable-next-line global-require
              img_url: require('@/assets/ex2.jpg'),
            },
            {
              title: '기억할만한 지나침',
              link: 'https://naver.com',
              id: '1',
              // eslint-disable-next-line global-require
              img_url: require('@/assets/ex1.jpg'),
            },
          ],
          explain:
            '‘고독’에 숨겨진 뜻이\n‘만남’이라고 제안하고 싶습니다.\n외로운 사람만이 만남의 진정한\n가치를 알 수 있듯\n고독할 때에야 비로소 나와\n타인을 생각하게 되니까요.',
          year: 2020,
          // eslint-disable-next-line global-require
          mock_url: require('@/assets/ex_mock.png'),
        },
        {
          number: '01',
          title: '고독',
          films: [
            {
              title: '여름날',
              link: 'https://naver.com',
              // eslint-disable-next-line global-require
              img_url: require('@/assets/ex2.jpg'),
            },
            {
              title: '기억할만한 지나침',
              link: 'https://naver.com',
              // eslint-disable-next-line global-require
              img_url: require('@/assets/ex1.jpg'),
            },
          ],
          explain:
            '‘고독’에 숨겨진 뜻이\n‘만남’이라고 제안하고 싶습니다.\n외로운 사람만이 만남의 진정한\n가치를 알 수 있듯\n고독할 때에야 비로소 나와\n타인을 생각하게 되니까요.',
          year: 2020,
          // eslint-disable-next-line global-require
          mock_url: require('@/assets/ex_mock.png'),
        },
      ],
    };
  },
  computed: {},
  async mounted() {
    await this.fetchData();
    this.$nextTick(() => {
      this.swiper = new SwiperCore('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
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
        cssMode: true,

        // And if we need scrollbar
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        // },
      });
    });
  },
  methods: {
    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log('slide change');
    },
    async fetchData() {},
  },
};
</script>

<style lang="scss" scoped>
// h1 {
//   font-size: 24px;
//   font-weight: bold;
//   margin: 0;
// }

@import '@/common';

.content-wrapper {
  margin-top: 50px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

@include max-with(lg) {
  .content-wrapper {
    margin-top: 20px;
  }
}

@include max-with(md) {
  .content-wrapper {
    height: auto;
  }
}

.content {
  display: flex;
  align-items: stretch;
  flex: 1;
  height: 100%;
}

@include max-with(lg) {
  .content {
    flex-direction: column;
  }
}

@include max-with(md) {
  .content {
    height: auto;
  }
}

.sopakit-items {
  display: flex;
  flex-direction: column;
  flex: 1;
}

@include max-with(md) {
  .sopakit-items {
    height: auto;
  }
}

.summary {
  padding-right: 60px;
  border-right: 2px solid #000;
  p {
    font-size: min(3vw, 21px);
    font-weight: 500;
    margin: 0;
  }
}

@include max-with(lg) {
  .summary {
    width: 100%;
    border: 0;
    padding: 0 $mobile-sopakit-slide-padding;
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

@include max-with(sm) {
  .summary p {
    font-size: 14px;
  }
}

.search-box {
  margin-left: auto;
  height: 100%;
  border-left: 2px solid #000;
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

@include max-with(sm) {
  .desktop {
    display: none;
  }
}
@include min-with(sm) {
  .mobile {
    display: none;
  }
}

@include max-with(sm) {
  .page-header-inner-wrapper.desktop {
    display: none;
  }
}

@include min-with(sm) {
  .page-header-inner-wrapper.mobile {
    display: none;
  }
}

// swiper

.swiper-container {
  width: 100%;
  height: 100%;
}

.items {
  flex: 1;
  padding-left: 20px;
  width: 10px;
}

@include max-with(lg) {
  .items {
    padding-left: 0;
    width: 100%;
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
}

@include max-with(xl) {
  .swiper-slide {
    padding: 0 $mobile-sopakit-slide-padding;
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
  border-bottom: 2px solid #000;
  margin-bottom: 30px;
  line-height: 1;
}

@include max-with(md) {
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

@include max-with(md) {
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
@include max-with(md) {
  .title-seperator {
    width: 2px;
  }
}

.title-films {
  margin-left: 21px;
  font-size: 21px;
  font-weight: 500;
}

.mobile-title-films {
  display: none;
  font-size: 14px;
  padding: 5px 0;
  border-bottom: 1px solid #000;
  margin-bottom: 15px;
}

@include max-with(md) {
  .title-films,
  .title-year {
    display: none;
  }
  .mobile-title-films {
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

@include max-with(xl) {
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
}

@include max-with(md) {
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

@include max-with(md) {
  .mobile-main-mock {
    display: block;
    display: none;
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

@include max-with(md) {
  .main-text {
    font-size: 14px;
    margin: 0;
    width: 100%;
  }
}

.content-product {
  flex: 1;
  border-left: 2px solid #000;
  padding: 10px 0 30px 30px;
  max-width: 350px;
}

@include max-with(xl) {
  .content-product {
    margin-top: 30px;
    border: none;
    padding: 0;
  }
}

@include max-with(lg) {
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
</style>

<style scoped></style>

<style></style>
