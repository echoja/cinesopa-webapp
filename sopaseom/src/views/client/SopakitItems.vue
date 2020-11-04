<template>
  <div class="sopakit-items">
    <div class="page-header-wrapper">
      <page-header>
        <div class="page-header-inner-wrapper mobile">
          <h1>소파킷</h1>
          <span class="seperator">|</span>
          <b-link class="list" :to="{ name: 'SopakitAllItems' }">
            상품 목록
          </b-link>
        </div>
        <div class="page-header-inner-wrapper desktop">
          <h1>소파킷</h1>
          <span class="seperator">|</span>
          <b-link class="list" :to="{ name: 'SopakitAllItems' }">
            상품 목록
          </b-link>
          <div class="search-box"></div>
        </div>
      </page-header>
      <!-- <div v-for="index in 100" :key="index">소파킷 아이템 {{ index }}</div> -->
    </div>
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
        </div>
        <div class="items">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(keyword, index) in keywords"
                :key="index"
              >
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
                        <div class="product-img">
                          <b-img :src="film.img_url"></b-img>
                        </div>
                        <div class="product-film-title">{{ film.title }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        loop: true,

        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

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

.page-header {
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
}

.content-wrapper {
  margin: auto 0;
}

.content {
  display: flex;
  align-items: flex-start;
}

.sopakit-items {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.summary {
  padding-right: 20px;
  p {
    font-size: min(3vw, 28px);
    font-weight: 500;
    margin: 0;
  }
}

@include max-with(sm) {
  .page-header h1 {
    font-size: 20x;
  }

  .summary p {
    font-size: 14px;
  }
}

.page-header .page-header-inner-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
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

.mobile {
  border-top: 2px solid #000;
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
  height: 500px;
}

.items {
  flex: 1 0 0;
  padding-left: 20px;
  border-left: 2px solid #000;
  width: 50vw;
}

.swiper-button-prev,
.swiper-button-next {
  height: 100%;
  margin-top: 0;
  top: 0;
  padding: 0 18px;
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
  padding: 0 100px;
  display: flex;
  flex-direction: column;
}

.title-section {
  display: flex;
  align-items: flex-end;
  padding-bottom: 25px;
  border-bottom: 2px solid #000;
  margin-bottom: 10px;
  line-height: 1;
}

.title-number,
.title-text {
  font-size: 48px;
  font-weight: 500;
}

.title-seperator {
  width: 4px;
  background-color: #000;
  height: 42px;
  margin: 0 14px;
  // font-size: 38px;
  // font-weight: bold;
  // display: flex;
  // align-items: center;
  // padding: 0 10px;
}

.title-films {
  margin-left: 30px;
  font-size: 30px;
  font-weight: 500;
}

.mobile-title-films {
  display: none;
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
  margin-left: 30px;
  font-size: 30px;
}

@include max-with(xl) {
  .title-number,
  .title-text {
    font-size: 36px;
  }
  .title-year,
  .title-films {
    font-size: 22.5px;
  }
  .title-seperator {
    height: 31.5px;
    width: 3px;
  }
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
}

.main-mock img {
  margin: -80px -102px -71px -143px;
}

.main-text {
  font-size: 26px;
  font-weight: 500;
  width: 400px;
  margin-left: 40px;
}

.product-img img {
  width: 100px;
}
</style>

<style scoped></style>

<style></style>
