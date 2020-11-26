<template>
  <div>
    <!-- placeholder -->
    <h1 class="sr-only">작품 소개</h1>
    <div
      class="featured-wrapper position-relative fullwidth"
      v-if="featured.length !== 0"
    >
      <h2 class="sr-only">특집 작품 목록</h2>
      <div class="featured-height"></div>
      <div
        class="featured featured-height d-flex align-items-center justify-content-center text-center"
      >
        <!-- indicators -->

        <!-- style="text-shadow: 1px 1px 2px #333;" -->
        <!-- @sliding-start="onSlideStart" -->
        <!-- @sliding-end="onSlideEnd" -->
        <!-- background="#ababab" -->
        <b-carousel
          id="carousel"
          v-model="slide"
          :interval="0"
          controls
          fade
          indicators
          label-prev="이전으로 이동"
          label-next="다음으로 이동"
          label-goto-slide="특정 슬라이드로 이동: "
          label-indicators="클릭하여 해당하는 슬라이드를 화면에 띄우세요"
        >
          <!-- <b-carousel-slide
            caption="First slide"
            text="Nulla vitae elit libero, a pharetra augue mollis interdum."
            img-src="https://picsum.photos/1024/480/?image=52"
          ></b-carousel-slide> -->

          <b-carousel-slide
            v-for="(film, index) in featured"
            :key="index"
            img-blank
            class="carousel-item"
          >
            <template #img>
              <div
                class="carousel-item-content-bg"
                :style="{
                  'background-image': `url(${parseUploadLink(
                    film.featured_steel,
                  )})`,
                }"
              ></div>
              <div
                class="carousel-item-content h-100"
                :style="{ 'background-color': film.featured_color_blur }"
              >
                <b-row class="mx-auto">
                  <b-col
                    class="featured-poster d-flex align-items-center justify-content-center"
                    md="6"
                  >
                    <b-link
                      class="d-block w-100 h-100"
                      :to="{ name: 'IndividualFilm', params: { id: film.id } }"
                    >
                      <span class="sr-only">{{film.title}} 자세히 보기</span>
                      <b-img
                        class="mw-100 mh-100"
                        :src="parseUploadLink(film.poster_url)"
                        alt=""
                      ></b-img>
                        <!-- :alt="film.poster_alt" -->
                        <!-- :alt="`${film.title} 포스터`" -->
                    </b-link>
                  </b-col>
                  <b-col
                    class="featured-description text-left d-flex flex-column justify-content-center"
                    md="6"
                  >
                    <p class="m-0">
                      <span class="featured-badge">{{ film.badge_text }}</span>
                    </p>

                    <h2 class="featured-title">
                      <b-link
                        :to="{
                          name: 'IndividualFilm',
                          params: { id: film.id },
                        }"
                        >{{ film.title }}</b-link
                      >
                    </h2>
                    <p class="featured-subtitle">
                      {{ film.title_en
                      }}<span
                        v-if="film.title_en && film.open_date.getTime() > 0"
                        >, </span
                      >{{ film.open_date.getFullYear() }}
                    </p>
                    <p class="featured-synopsis">
                      {{ film.featured_excerpt }}
                    </p>
                    <p>
                      <b-link
                        class="d-flex align-items-center featured-more"
                        :to="{
                          name: 'IndividualFilm',
                          params: { id: film.id },
                        }"
                      >
                        <span>더보기</span>
                        <!-- style="enable-background:new 0 0 1920 1080;"
                          xml:space="preserve" -->
                        <svg
                          width="8px"
                          class="ml-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 47.22 81.75"
                        >
                          <polygon
                            class="cls-1"
                            fill="currentColor"
                            points="6.34 81.75 0 75.41 34.54 40.87 0 6.34 6.34 0 47.22 40.87 6.34 81.75"
                          />
                        </svg>
                      </b-link>
                    </p>
                  </b-col>
                </b-row>
              </div>
            </template>
            <!-- <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros felis,
              tincidunt a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.
            </p> -->
          </b-carousel-slide>
          <!-- <b-carousel-slide img-blank :style="{ 'background-color': '#767676' }">
            fdfdf
          </b-carousel-slide> -->
        </b-carousel>
      </div>
    </div>
    <h2 class="sr-only">필터 및 검색창</h2>
    <div class="filter">
      <!-- 모바일 때만 보이는 필터 -->
      <template v-if="$store.state.isMobile">
        <!-- 개봉되었는지의 여부 필터링 -->
        <!-- <div class="opened text-center m-1 pt-5 pb-2 d-flex justify-content-center">
          <div
            class="opened-options-wrapper"
            role="listbox"
            aria-label="개봉되었는지의 여부 필터링"
            aria-orientation="horizontal"
          >
            <b-link
              v-for="option in openedOptions"
              :key="option.key"
              :aria-selected="option.selected"
              class="d-inline-block"
              :class="{ selected: option.selected }"
              role="option"
              @click="setOpened(option)"
            >
              {{ option.label }}
            </b-link>
          </div>
        </div> -->
        <h3 class="sr-only">개봉 상태에 따른 분류</h3>
        <b-form-radio-group
          v-model="opened"
          @change="openedChanged"
          class="isopen-mobile"
        >
          <b-form-radio value="all">모두</b-form-radio>
          <b-form-radio value="opened">개봉작</b-form-radio>
          <b-form-radio value="owned">보유작</b-form-radio>
        </b-form-radio-group>

        <!-- 검색창 -->
        <h3 class="sr-only">검색창</h3>
        <div
          class="search text-center mx-auto my-2 position-relative d-flex align-items-center"
        >
          <div class="search-icon mr-3 d-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
          </div>
          <label
            class="w-100 m-0"
            for="keywords"
            title="영화제목, 감독, 배우 검색"
          >
            <b-form-input
              debounce="500"
              @update="updateSearchString"
              v-model="search"
              class="rounded-pill search-box"
              id="keywords"
              size="lg"
              type="search"
              placeholder="영화제목, 감독, 배우 검색"
              aria-placeholder="영화제목, 감독, 배우 검색"
              contenteditable="true"
              autocomplete="off"
              name="search"
            ></b-form-input>
          </label>
        </div>
      </template>

      <!-- 데스크탑일 때만 보이는 필터 -->
      <div
        v-if="!$store.state.isMobile"
        class="search text-center mx-auto my-2 position-relative d-flex align-items-center"
      >
        <div class="search-icon mr-3 d-flex align-items-center">
          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
        </div>
        <b-form-radio-group
          v-model="opened"
          @change="openedChanged"
          class="isopen-in-search"
        >
          <b-form-radio value="all">모두</b-form-radio>
          <b-form-radio value="opened">개봉작</b-form-radio>
          <b-form-radio value="owned">보유작</b-form-radio>
        </b-form-radio-group>
        <label
          class="w-100 m-0"
          for="keywords"
          title="영화제목, 감독, 배우 검색"
        >
          <b-form-input
            debounce="500"
            @update="updateSearchString"
            v-model="search"
            class="rounded-pill search-box has-inner-button"
            id="keywords"
            size="lg"
            type="search"
            placeholder="영화제목, 감독, 배우 검색"
            aria-placeholder="영화제목, 감독, 배우 검색"
            contenteditable="true"
            autocomplete="off"
            name="search"
          ></b-form-input>
        </label>
      </div>
    </div>

    <!-- 태그 설정 -->
    <!-- <div
        class="tags d-flex justify-content-center"
        aria-hidden="false"
        role="group"
        aria-label="태그를 선택하여 영화 필터"
      >
        <template v-for="tag in tags">
          <b-button
            class="tag"
            role="checkbox"
            :aria-checked="tag.checked"
            :class="{ checked: tag.checked }"
            :acitve="tag.checked"
            pill
            @click="toggleTag(tag)"
            :key="tag.key"
            >{{ tag.value }}</b-button
          >
        </template>
      </div> -->

    <!-- 영화 목록 -->
    <h2 class="sr-only">영화 목록</h2>
    <b-row class="filmlist" ref="filmlist">
      <transition name="filmlist-fade">
        <div
          class="filmlist-loading d-flex justify-content-center align-items-center"
          v-if="loading"
        >
          로딩중입니다.
        </div>
      </transition>
      <div v-if="films.length === 0" class="col-12 film-wrapper text-center">
        영화를 찾을 수 없습니다.
      </div>
      <b-col
        lg="4"
        md="6"
        cols="12"
        v-for="(film, index) in films"
        :key="index"
        class="film-wrapper text-center"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <!-- {{ film }} -->
        <!-- <b-link :style="{'background-image': `url(${film.poster_url})`}"
           class="poster-link w-100" href=""></b-link> -->
        <div
          class="poster-wrapper d-flex align-items-center justify-content-center"
        >
          <b-link
            :title="`${film.title}`"
            :to="{ name: 'IndividualFilm', params: { id: film.id } }"
            class="poster-link"
          >
            <span
              class="film-badge"
              v-if="film.badge_text"
              :style="{ 'background-color': film.badge_color }"
              >{{ film.badge_text }}</span
            >
            <img
              v-if="film.poster_url"
              :src="parseUploadLink(film.poster_url)"
              :alt="film.poster_alt"
            />
              <!-- :alt="`${film.poster_alt} 포스터`" -->
            <span class="no-poster" v-else>포스터<br />준비 중입니다</span>
          </b-link>
        </div>

        <h3 class="m-0">
          <b-link
            :title="`${film.title}`"
            :to="{ name: 'IndividualFilm', params: { id: film.id } }"
            class="poster-link"
          >
            {{ film.title }}
          </b-link>
        </h3>
        <p class="film-description">
          <span v-if="film.title_en !== ''">{{ film.title_en }}</span>
          <span v-if="film.title_en && film.open_date.getTime() > 0">, </span>
          <span v-if="film.open_date.getTime() > 0">{{
            film.open_date.getFullYear()
          }}</span>
        </p>
      </b-col>
    </b-row>

    <!-- 페이지 옮기기 -->
    <div class="d-flex justify-content-center m-5">
      <!-- pills -->
      <b-pagination-nav
        limit="9"
        v-model="currentPage"
        :link-gen="linkGen"
        :number-of-pages="numberOfPages"
        use-router
        class="film-pagination"
        hide-goto-end-buttons
        label-first-page="첫 페이지로 이동"
        label-prev-page="이전 페이지로 이동"
        label-next-page="다음 페이지로 이동"
        label-last-page="마지막 페이지로 이동"
        exact-active-class="exact"
        @change="pageChanged"
      ></b-pagination-nav>
    </div>

    <!-- 테스트용 -->
    <!-- <b-form-checkbox name="check-button" v-model="checked">
        checkbox
      </b-form-checkbox>
      <input type="checkbox" />
      <div class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" id="customSwitch1" />
        <label class="custom-control-label" for="customSwitch1">Toggle this switch element</label>
      </div>
      <div class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" disabled id="customSwitch2" />
        <label class="custom-control-label" for="customSwitch2">Disabled switch element</label>
      </div>
      {{ checked }}
      {{ $route.params }} -->
  </div>
</template>

<script>
import AOS from 'aos';
import hexToRgba from 'hex-to-rgba';
import {
  filmsFeaturedQuery,
  filmsNormalQuery,
  graphql,
} from '../graphql-client';
import { parseUploadLink } from '../util';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  name: 'FilmList',
  title: '작품소개',
  props: {
    type: String,
    page: {
      type: [String, Number],
      default: 1,
    },
  },

  data() {
    return {
      loading: false,
      currentPage: null,
      slide: null,
      total: 0,
      perpage: 9,
      selected: null,
      opened: 'all',
      search: '',
      testBackgroundColor: 'rgb(0 76 80 / 50%)',
      // testBackgroundColor: '#40B5BB',
      // eslint-disable-next-line global-require
      testBackgroundImage: require('../assets/test/steel23.jpg'),
      testTextColor: '#fff',
      currnetPage: 1,
      featured: [
        // {
        //   id: 1,
        //   title: '여름날',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster.jpg'),
        //   featured_excerpt: `그들은 평범한 일상 속에서 자신처럼 고립되어 있는 폐왕성에 도착하고,
        //     그곳에서 누구나 언젠가 지나쳐야만 하는 유배된 시간과 만난다.`,
        //   title_en: 'Days in a Summer',
        //   open_date: new Date('2020-08-11'),
        //   badge_text: '개봉예정',
        // },
      ],
      openedOptionsStringMap: {
        all: '모두',
        opened: '개봉작',
        owned: '보유작',
      },
      vuePageTitle: '',
      tags: [
        {
          key: 1,
          value: '신나는',
          checked: false,
        },
        {
          key: 2,
          value: '잔잔한',
          checked: true,
        },
        {
          key: 3,
          value: '힐링',
          checked: false,
        },
      ],
      openedOptions: [
        {
          key: 1,
          label: '모두',
          selected: true,
        },
        {
          key: 2,
          label: '개봉작',
          selected: false,
        },
        {
          key: 3,
          label: '보유작',
          selected: false,
        },
      ],
      films: [
        // {
        //   id: 1,
        //   title: '여름날',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster.jpg'),
        //   title_en: 'Days in a Summer, 2020',
        //   badge: '개봉예정',
        // },
        // {
        //   id: 2,
        //   title: '마담B',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster2.png'),
        //   title_en: 'Madame B, 2018',
        //   badge: null,
        // },
        // {
        //   id: 3,
        //   title: '여름날',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster.jpg'),
        //   title_en: 'Days in a Summer, 2020',
        //   badge: '개봉예정',
        // },
        // {
        //   id: 4,
        //   title: '마담B',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster2.png'),
        //   title_en: 'Madame B, 2018',
        //   badge: null,
        // },
        // {
        //   id: 5,
        //   title: '여름날',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster.jpg'),
        //   title_en: 'Days in a Summer, 2020',
        //   badge: '개봉예정',
        // },
        // {
        //   id: 6,
        //   title: '마담B',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster2.png'),
        //   title_en: 'Madame B, 2018',
        //   badge: null,
        // },
        // {
        //   id: 7,
        //   title: '여름날',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster.jpg'),
        //   title_en: 'Days in a Summer, 2020',
        //   badge: '개봉예정',
        // },
        // {
        //   id: 8,
        //   title: '마담B',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster2.png'),
        //   title_en: 'Madame B, 2018',
        //   badge: null,
        // },
        // {
        //   id: 9,
        //   title: '여름날',
        //   // eslint-disable-next-line global-require
        //   poster_url: require('../assets/test/test-poster.jpg'),
        //   title_en: 'Days in a Summer, 2020',
        //   badge: '개봉예정',
        // },
      ],
      checked: false,
    };
  },
  computed: {
    selectedTags() {
      return [];
    },
    isOpened() {
      if (this.opened === 'all') return null;
      if (this.opened === 'opened') return true;
      return false;
    },
    numberOfPages() {
      if (this.total === 0) return 1;
      return Math.ceil(this.total / this.perpage);
    },
  },

  async mounted() {
    this.opened = this.type;
    this.vuePageTitle = `${this.openedOptionsStringMap[this.opened]} - 영화소개`;
    this.currnetPage = parseInt(this.page, 10);
    AOS.init();
    this.fetchFeaturedFilms();
    await this.fetchFilms();
  },

  methods: {
    parseUploadLink,
    convertHexToRgba(hex, alpha) {
      return hexToRgba(hex, alpha);
    },
    async toggleTag(tag) {
      // eslint-disable-next-line no-param-reassign
      tag.checked = !tag.checked;
      // console.log(tag);
    },
    async setOpened(option) {
      this.openedOptions.forEach((o) => {
        // eslint-disable-next-line no-param-reassign
        o.selected = false;
      });
      // eslint-disable-next-line no-param-reassign
      option.selected = true;
    },
    linkGen(page) {
      return { name: this.$route.name, params: { type: this.type, page } };
    },
    async pageChanged(page) {
      this.currentPage = page;
      await this.fetchFilms();
      this.$scrollTo(this.$refs.filmlist, 500, {
        offset: -180,
      });
    },
    async openedChanged(value) {
      this.$router.push({ name: 'FilmList', params: { type: value } });
      this.vuePageTitle = `${this.openedOptionsStringMap[value]} - 영화소개`;
      this.opened = value;
      this.currentPage = 1;
      await this.fetchFilms();
    },

    // 슬라이더에 오는 영화들을 가져오는 함수.
    async fetchFeaturedFilms() {
      const res = await graphql(filmsFeaturedQuery);
      // console.log(res);
      const result = res?.data?.filmsFeatured;
      if (!result || result?.total === 0) {
        this.featured = [];
        return;
      }
      this.featured = [
        ...result.list.map((film) => ({
          id: film.id,
          title: film.title,
          title_en: film.title_en,
          poster_url: film.poster_url,
          poster_alt: film.poster_alt,
          featured_excerpt: film.featured_synopsis,
          open_date: new Date(film.open_date),
          badge_text: film.badge_text,
          featured_steel: film.featured_steel,
          featured_color: film.featured_color,
          featured_color_blur: hexToRgba(film.featured_color, 0.5),
        })),
      ];

      //       {
      //   id: 1,
      //   title: '여름날',
      //   // eslint-disable-next-line global-require
      //   poster_url: require('../assets/test/test-poster.jpg'),
      //   featured_excerpt: `그들은 평범한 일상 속에서 자신처럼 고립되어 있는 폐왕성에 도착하고,
      //     그곳에서 누구나 언젠가 지나쳐야만 하는 유배된 시간과 만난다.`,
      //   title_en: 'Days in a Summer',
      //   open_date: new Date('2020-08-11'),
      //   badge_text: '개봉예정',
      // },
    },
    // 영화를 가져오는 함수
    async fetchFilms() {
      this.loading = true;
      const delay = sleep(300);

      // 조건 설정
      const condition = {
        is_opened: this.isOpened,
        search: this.search,
        tags: this.selectedTags,
        page: this.currentPage
          ? this.currentPage - 1
          : parseInt(this.page, 10) - 1,
        perpage: this.perpage,
      };
      // console.log(condition);
      const result = await graphql(filmsNormalQuery, {
        condition,
      });
      await delay;
      // console.log(result);
      if (result?.data?.films) {
        const { list, total } = result.data.films;
        this.total = total;

        this.films = list.map((film) => ({
          id: film.id,
          title: film.title,
          poster_url: film.poster_url,
          poster_alt: film.poster_alt,
          title_en: film.title_en,
          badge_text: film.badge_text,
          badge_color: film.badge_color,
          open_date: new Date(film.open_date),
        }));
      }
      AOS.refresh();
      this.loading = false;
      // this.total = result?.data?.films?.total;
      // result.data.
    },
    async updateSearchString() {
      await this.fetchFilms();
    },
  },
};
</script>

<!-- animation!!!! -->
<style scoped>
.filmlist-fade-enter-active,
.filmlist-fade-leave-active {
  transition: all 0.3s;
}

.filmlist-fade-enter,
.filmlist-fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
@use '../util.scss';

.fullwidth {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
}

.featured-title a {
  color: #fff;
  font-size: 50px;
  // margin-bottom: 0;
  @extend %smooth-hover;
  &:hover {
    color: #009eda;
  }
}

.desktop {
  .featured-height {
    height: 600px;
  }
  .featured-poster {
    max-height: 600px;
    padding: 70px 0;
  }
  .carousel-item-content > div {
    height: 100%;
  }
  .featured-description {
    padding: 48px;
  }
  .featured-badge {
    color: #fff;
    background: transparent;
    padding: 0;
    margin: 0;
    font-weight: 300;
    font-size: 23px;
    margin-bottom: 10px;
  }
  .featured-title {
    margin-bottom: 0;
  }

  .featured-subtitle {
    margin-top: 0px;
    margin-bottom: 25px;
  }
  .featured-synopsis {
    font-weight: 300;
    font-size: 18px;
    max-width: 380px;
  }
}

.featured-more {
  color: #ffffff;
  opacity: 0.6;
}

.mobile {
  & .featured {
    position: relative;
  }
  & .featured-height {
    height: auto;
  }
  & .featured-poster {
    max-width: 260px;
    margin: 40px auto 10px;
  }
  & .featured-description {
    padding: 48px 0;
    height: 500px;
  }
}

// .featured-poster {
//   text-align: center;
// }

/* 모바일 opened */
.opened {
  & .opened-options-wrapper {
    padding: 20px 0 0;
    // border-bottom: 2px solid #ddd;
  }
  & a {
    transition: 0.3s;
    color: #767676;
    border-bottom: 2px solid transparent;
    padding: 6px 15px;
  }
  & a:hover {
    color: #2b3e4a;
    text-decoration: none;
    background-color: #eee;
  }

  & a.selected {
    border-color: #009eda;
    color: #2b3e4a;
    // color: #fff;
    // background-color: #009eda;
  }
}

/* search */
.search {
  max-width: 740px;
}
.has-inner-button {
  // padding-left: 190px;
  height: 50px;
  padding: 13px 10px 16px 190px;
}

.mobile {
  & .search {
    padding: 0 20px;
  }
  & .search-icon {
    right: 20px;
  }
}

/* tags */
.tags {
  margin-top: 15px;
}

.tag {
  color: #767676;
  border: 1px solid #b0b6ba;
  padding: 2px 10px;
  font-weight: 500;
  margin: 5px;

  &,
  &:focus,
  &:active,
  &:hover {
    background-color: transparent;
    // color: #2b3e4a;
  }

  &.checked,
  &.checked:focus,
  &.checked:active,
  &.checked:hover {
    // background-color: #009eda;
    // border-color: #009eda;
    color: #fff;
    border-color: transparent;
    background-color: #767676;
  }
}

/* film */

.filmlist {
  margin-top: 80px;
  position: relative;

  .film-wrapper {
    position: relative;
    margin-bottom: 80px;
  }

  .film-badge {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    font-size: 19px;
    font-weight: bold;
    background-color: #009eda;
    border-radius: 0 0 19px 0;
    padding: 10px;
    padding-right: 13px;
    line-height: 1;
    color: #fff;
  }

  .poster-link {
    transition: 0.5s;
    overflow: hidden;
    position: relative;
  }
  .poster-link:hover img {
    transform: scale(1.2);
    opacity: 0.7;
  }

  .poster-link:focus {
    transition: none;
    outline-offset: -3px;
  }

  .poster-wrapper {
    height: 500px;
    overflow: hidden;
    margin-bottom: 30px;
  }

  .film-description {
    font-size: 14px;
    color: #767676;
    // font-weight:400;
    // letter-spacing: -0.5px;
  }

  img {
    transition: 0.5s;
    max-width: 100%;
    max-height: 500px;
    border: 1px solid #ddd;
  }

  h3 a {
    @extend %smooth-hover;
    font-size: 36px;
    color: #009eda;
    font-weight: bold;
  }
  h3 a:hover {
    color: #2b3e4a;
  }

  p {
    color: #767676;
  }
}

.no-poster {
  border: 1px solid #ddd;
  display: block;
  padding: 20px 30px;
}

.filmlist-loading {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: rgba(255, 255, 255, 1);
  z-index: 1;
}

.mobile .filmlist {
  padding: 0 15px;
  & .film-wrapper {
    margin-top: 50px;
  }
  & .poster-wrapper {
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss">
@use '../util.scss';

.featured {
  width: 100%;
  position: absolute;
  top: 0;
  background-color: beige;

  & .carousel {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  & .carousel-inner,
  .carousel-item {
    height: 100%;
  }

  & .carousel-item {
    background-position: center;
    background-size: cover;
  }

  & .carousel-indicators li {
    width: 10px;
    height: 10px;
    border-radius: 30px;
    border: 10px solid transparent;
  }
  & .carousel-item-content-bg {
    height: 100%;
    width: 100%;
    position: absolute;
    background-position: center;
    background-size: cover;
  }

  & .carousel-item-content {
    color: #fff;
    position: relative;
    background-color: rgba(0, 0, 0, 0.3);
  }
  & .carousel-item-content > div {
    width: 70%;
    max-width: 1260px;
  }
  & img {
    min-width: 1px;
  }
}

// 검색창 안 모두/개봉작/보유작

.desktop .filter {
  margin-top: 50px;
}

.filter .form-control::placeholder {
  color: #ddd;
  font-weight: 400;
}
.isopen-mobile {
  display: flex;
  margin: 20px 0;
  align-items: center;
  justify-content: center;
}

.isopen-in-search {
  position: absolute;
  left: 15px;
  font-weight: 500;
  top: 50%;
  transform: translateY(-50%);

  &:after {
    content: '|';
    color: #aaa;
    padding-left: 10px;
    font-size: 15px;
    display: inline-flex;
    vertical-align: top;
  }

  & .custom-control-label {
    transition: 1s;
    transition-property: color;
    margin-left: 0;
    padding: 0 5px;
    cursor: pointer;
    color: #767676;

    &:after {
      display: none;
    }
    &:before {
      display: none;
    }
    &:hover {
      transition: none;
      color: #009eda;
    }
  }
  & .custom-radio .custom-control-input:checked ~ .custom-control-label {
    /*      background-color: #aaa; */
    // color: #009eda;
    color: #000;
    color: util.$text-color;
    font-weight: bold;
  }
  & .custom-control.custom-control-inline.custom-radio {
    padding-left: 0;
    margin: 0;
  }
}
</style>
