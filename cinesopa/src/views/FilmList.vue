<template>
  <div>
    <!-- placeholder -->
    <div class="featured-wrapper position-relative fullwidth">
      <div class="featured-height"></div>
      <div
        class="featured featured-height d-flex
        align-items-center justify-content-center text-center"
      >
        <!-- indicators -->

        <!-- style="text-shadow: 1px 1px 2px #333;" -->
        <!-- @sliding-start="onSlideStart" -->
        <!-- @sliding-end="onSlideEnd" -->
        <!-- background="#ababab" -->
        <b-carousel
          id="carousel"
          v-model="slide"
          :interval="10000"
          controls
          indicators
          fade
          label-prev="다음으로 이동"
          label-next="이전으로 이동"
          label-goto-slide="특정 슬라이드로 이동: "
          label-indicators="슬라이드를 클릭하여 화면에 띄우세요"
        >
          <!-- <b-carousel-slide
            caption="First slide"
            text="Nulla vitae elit libero, a pharetra augue mollis interdum."
            img-src="https://picsum.photos/1024/480/?image=52"
          ></b-carousel-slide> -->

          <b-carousel-slide img-blank img-alt="Blank image">
            <template #img>
              <div
                class="carousel-item-content h-100"
                :style="{ 'background-color': testBackgroundColor, color: testTextColor }"
              >
                <b-row class="mx-auto">
                  <b-col
                    class="featured-poster d-flex align-items-center justify-content-center"
                    md="6"
                  >
                    <b-img
                      class="mw-100 mh-100"
                      :src="require('../assets/test/test-poster.jpg')"
                    ></b-img>
                  </b-col>
                  <b-col
                    class="featured-description text-left d-flex flex-column justify-content-center"
                    md="6"
                  >
                    <p class="m-0"><b-badge pill variant="light">개봉예정</b-badge></p>

                    <h2 class="display-3">여름날</h2>
                    <p>Days in a Summer, 2020</p>
                    <p>
                      그들은 평범한 일상 속에서 자신처럼 고립되어 있는 폐왕성에 도착하고, 그곳에서
                      누구나 언젠가 지나쳐야만 하는 유배된 시간과 만난다.
                    </p>
                    <p>
                      <b-link :to="{ name: 'IndividualFilm', params: { id: 1 } }">더보기</b-link>
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
          <!-- <b-carousel-slide img-blank :style="{ 'background-color': 'var(--secondary-text-color)' }">
            fdfdf
          </b-carousel-slide> -->
        </b-carousel>
      </div>
    </div>
    <div class="filter">
      <!-- 개봉되었는지의 여부 필터링 -->
      <div class="opened text-center m-1 pt-5 pb-2 d-flex justify-content-center">
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
      </div>

      <!-- 검색창 -->
      <div class="search text-center mx-auto my-2 position-relative d-flex align-items-center">
        <div class="search-icon mr-3 d-flex align-items-center">
          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
        </div>
        <label class="w-100 m-0" for="keywords" title="영화제목, 감독, 배우 검색">
          <b-form-input
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

      <!-- 태그 설정 -->
      <div
        class="tags d-flex justify-content-center"
        aria-hidden="false"
        role="group"
        aria-label="태그를 선택하여 영화 필터"
      >
        <template v-for="tag in tags">
          <b-button
            class="tag m-2"
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
      </div>

      <!-- 영화 목록 -->
      <b-row class="filmlist">
        <b-col
          lg="4"
          md="6"
          cols="12"
          v-for="(film, index) in films"
          :key="index"
          class="film-wrapper text-center"
        >
          <b-badge pill class="film-badge" v-if="film.badge">{{ film.badge }}</b-badge>
          <!-- {{ film }} -->
          <!-- <b-link :style="{'background-image': `url(${film.posterLink})`}"
           class="poster-link w-100" href=""></b-link> -->
          <div class="poster-wrapper d-flex align-items-center justify-content-center">
            <b-link
              :title="`${film.title}`"
              :to="{ name: 'IndividualFilm', params: { id: film.id } }"
              class="poster-link"
            >
              <img :src="film.posterLink" :alt="`${film.title} 포스터`" />
            </b-link>
          </div>

          <h2 class="m-0">
            <b-link
              :title="`${film.title}`"
              :to="{ name: 'IndividualFilm', params: { id: film.id } }"
              class="poster-link"
            >
              {{ film.title }}
            </b-link>
          </h2>
          <p class="film-description">
            <span class="small">{{ film.title_en }}</span>
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
          :number-of-pages="10"
          use-router
          class="film-pagination"
          hide-goto-end-buttons
          label-first-page="첫 페이지로 이동"
          label-prev-page="이전 페이지로 이동"
          label-next-page="다음 페이지로 이동"
          label-last-page="마지막 페이지로 이동"
          exact-active-class="exact"
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
  </div>
</template>

<script>
export default {
  name: 'FilmList',
  title: '영화 리스트',
  data() {
    return {
      currentPage: 3,
      slide: null,
      selected: null,
      testBackgroundColor: '#40B5BB',
      testTextColor: '#fff',
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
        {
          id: 1,
          title: '여름날',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster.jpg'),
          title_en: 'Days in a Summer, 2020',
          badge: '개봉예정',
        },
        {
          id: 2,
          title: '마담B',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster2.png'),
          title_en: 'Madame B, 2018',
          badge: null,
        },
        {
          id: 3,
          title: '여름날',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster.jpg'),
          title_en: 'Days in a Summer, 2020',
          badge: '개봉예정',
        },
        {
          id: 4,
          title: '마담B',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster2.png'),
          title_en: 'Madame B, 2018',
          badge: null,
        },
        {
          id: 5,
          title: '여름날',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster.jpg'),
          title_en: 'Days in a Summer, 2020',
          badge: '개봉예정',
        },
        {
          id: 6,
          title: '마담B',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster2.png'),
          title_en: 'Madame B, 2018',
          badge: null,
        },
        {
          id: 7,
          title: '여름날',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster.jpg'),
          title_en: 'Days in a Summer, 2020',
          badge: '개봉예정',
        },
        {
          id: 8,
          title: '마담B',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster2.png'),
          title_en: 'Madame B, 2018',
          badge: null,
        },
        {
          id: 9,
          title: '여름날',
          // eslint-disable-next-line global-require
          posterLink: require('../assets/test/test-poster.jpg'),
          title_en: 'Days in a Summer, 2020',
          badge: '개봉예정',
        },
      ],
      checked: false,
    };
  },

  methods: {
    async toggleTag(tag) {
      // eslint-disable-next-line no-param-reassign
      tag.checked = !tag.checked;
      console.log(tag);
    },
    async setOpened(option) {
      this.openedOptions.forEach((o) => {
        // eslint-disable-next-line no-param-reassign
        o.selected = false;
      });
      // eslint-disable-next-line no-param-reassign
      option.selected = true;
    },
  },
};
</script>

<style lang="scss">
.fullwidth {
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
}

.desktop {
  & .featured-height {
    height: 600px;
  }
  & .featured-poster {
    max-height: 600px;
    padding: 70px 0;
  }
  & .carousel-item-content > div {
    height: 100%;
  }
  & .featured-description {
    padding: 48px;
  }
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

  & .carousel-indicators li {
    width: 10px;
    height: 10px;
    border-radius: 30px;
    border: 10px solid transparent;
  }
  & .carousel-item-content > div {
    width: 70%;
    max-width: var(--max-content-size);
  }
  & img {
    min-width: 1px;
  }
}

// .featured-poster {
//   text-align: center;
// }

/* opened */
.opened {
  & .opened-options-wrapper {
    padding: 20px 0 0;
    // border-bottom: 2px solid #ddd;
  }
  & a {
    transition: 0.3s;
    color: var(--secondary-text-color);
    border: 2px solid transparent;
    padding: 6px 15px;
  }
  & a:hover {
    color: #000;
    text-decoration: none;
    background-color: #eee;
    // border-color: #000;
  }

  & a.selected {
    border-color: var(--link-color);
    color: #111;
    // color: #fff;
    // background-color: var(--link-color);
  }
}

/* search */
.search {
  max-width: 740px;
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

button.tag {
  border: 2px solid #ddd;

  &,
  &:focus,
  &:active,
  &:hover {
    background-color: transparent;
    color: var(--text-color);
  }

  &.checked,
  &.checked:focus,
  &.checked:active,
  &.checked:hover {
    // background-color: var(--link-color);
    // border-color: var(--link-color);
    color: #fff;
    border-color: transparent;
    background-color: #555;
  }
}

/* film */

.filmlist {
  & .film-wrapper {
    position: relative;
    margin-top: 150px;
  }

  & .film-badge {
    position: absolute;
    left: 15px;
    top: -5px;
    z-index: 1;
    font-size: 14px;
    padding: 5px 8px;
    background-color: var(--link-color);
  }

  & .poster-link {
    transition: 0.5s;
  }
  & .poster-link:hover img {
    transform: scale(1.2);
    opacity: 0.7;
  }

  & .poster-wrapper {
    max-height: 500px;
    overflow: hidden;
    margin-bottom: 30px;
  }

  & img {
    transition: 0.5s;
    max-width: 100%;
    max-height: 500px;
    border: 1px solid #ddd;
  }
  & h2 a {
    font-size: 36px;
    color: var(--link-color);
  }
  & h2 a:hover {
    color: var(--text-color);
    transition: none;
    text-decoration: none;
  }

  & p {
    color: var(--secondary-text-color);
  }
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

<style lang="scss"></style>
