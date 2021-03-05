<template>
  <div class="container-fluid">
    <!-- 메인 포스터 -->
    <div class="main-poster d-flex justify-content-center row-fullwidth">
      <b-link
        class="zoom-link"
        alt="포스터 자세히 보기 (새 창으로 이동)"
        target="_blank"
        :href="parseUploadLink(film.poster_url)"
      >
        <!-- :alt="`${film.title} 포스터`" -->
        <b-img
          v-if="film.poster_url"
          :alt="film.poster_alt"
          :src="parseUploadLink(film.poster_url)"
          class="shadow"
        ></b-img>
        <div v-else>메인 포스터를 준비 중입니다.</div>
        <font-awesome-icon
          class="zoom-icon"
          :icon="['fas', 'search-plus']"
        ></font-awesome-icon>
      </b-link>
    </div>
    <!-- 각종 신청 -->
    <div class="application text-center my-5">
      <b-button pill @click="gotoCommunity">상영 신청하기</b-button>
    </div>
    <!-- 기본 정보 -->
    <div class="basic-info">
      <div class="head">
        <h1>{{ film.title }}</h1>
        <p class="title-en">
          <span> {{ film.title_en }}</span
          ><span class="head-seperator" v-if="film.title_en && filmProdYear"
            >, </span
          ><span v-if="filmProdYear">
            {{ filmProdYear }}
          </span>
        </p>
      </div>
      <p id="basic-info-table-summary" class="sr-only">
        영화 {{ film.title }}의 장르, 상영시간, 감독, 출연진 등의 기본
        정보입니다.
      </p>
      <div
        class="body"
        role="table"
        aria-colcount="2"
        :aria-label="`${film.title} 기본 정보`"
        aria-describedby="basic-info-table-summary"
      >
        <div role="rowgroup" class="sr-only">
          <div class="basic-body-row d-flex" role="row">
            <span role="columnheader">구분</span>
            <span role="columnheader">내용</span>
          </div>
        </div>
        <div role="rowgroup">
          <div
            v-if="filmSummary.length > 0"
            class="basic-body-row d-flex"
            role="row"
          >
            <span class="title" role="rowheader"> 개요 </span>
            <span class="content" role="cell">
              <template v-for="(output, index) in filmSummary">
                <span :key="`${index}0`">{{ output }}</span>
                <span
                  v-if="index !== filmSummary.length - 1"
                  class="seperator"
                  role="separator"
                  :key="`${index}1`"
                  >|</span
                >
              </template>
              <!-- <span v-if="filmGenres">{{ filmGenres }}</span>
              <span v-if="filmGenres && filmShowMinutes" class="seperator" role="separator">|</span>
              <span v-if="filmShowMinutes > 0">{{ filmShowMinutes }}분</span>
              <span v-if="filmShowMinutes && film.is_opened" class="seperator" role="separator"
                >|</span
              >
              <span v-if="film.is_opened">{{ filmOpenDate }} 개봉</span> -->
            </span>
          </div>
          <div v-if="filmDirector" class="basic-body-row d-flex" role="row">
            <span class="title" role="rowheader"> 감독 </span>
            <span class="content" role="cell">
              {{ filmDirector }}
            </span>
          </div>
          <div
            v-if="filmActors.length > 0"
            class="basic-body-row d-flex"
            role="row"
          >
            <span class="title" role="rowheader"> 출연 </span>
            <span class="content" role="cell">
              {{ filmActors }}
            </span>
          </div>
          <div v-if="film.watch_grade" class="basic-body-row d-flex" role="row">
            <span class="title" role="rowheader"> 등급 </span>
            <span class="content" role="cell">
              {{ film.watch_grade }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 예고편 -->
    <div
      class="trailer row-fullwidth"
      :style="{ 'padding-bottom': `${trailerRatio * 100}%` }"
      ref="trailer"
      v-html="mainTrailerIframe"
    >
      <!-- <iframe
        width="1245"
        height="672"
        src="https://www.youtube.com/embed/OeuIAQnrbZo"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe> -->
    </div>
    <!-- 상세 정보 네비게이션 -->
    <div class="affix-wrapper row-fullwidth">
      <affix
        relative-element-selector="#detailed-info"
        style="width: 100%"
        :offset="{ top: $store.state.isMobile ? 135 : 155, bottom: 0 }"
      >
        <scrollactive
          active-class="active"
          :offset="$store.state.isMobile ? 135 : 155"
          :duration="500"
          bezier-easing-value=".5,0,.35,1"
          class="scrollactive d-flex justify-content-start align-items-center"
          @itemchanged="onScrollactiveItemChanged"
          @click="onScrollactiveClicked"
        >
          <b-link
            href="#synopsis"
            class="scrollactive-item first"
            v-if="filmSynopsis"
          >
            시놉시스
          </b-link>
          <b-link
            href="#people"
            class="scrollactive-item"
            v-if="filmPeople.length !== 0"
          >
            배우/제작진
          </b-link>
          <b-link
            href="#awards"
            class="scrollactive-item"
            v-if="film.awards.length !== 0"
          >
            수상내역
          </b-link>
          <b-link
            href="#steel"
            class="scrollactive-item"
            v-if="film.photos.length !== 0"
          >
            포토
          </b-link>
          <b-link
            href="#videos"
            class="scrollactive-item"
            v-if="film.videos.length !== 0"
          >
            비디오
          </b-link>
          <b-link
            href="#reviews"
            class="scrollactive-item"
            v-if="film.reviews.length !== 0"
          >
            리뷰
          </b-link>
          <b-link href="#note" class="scrollactive-item" v-if="film.note">
            제작노트
          </b-link>
        </scrollactive>
      </affix>
    </div>
    <!-- 상세정보 -->
    <div id="detailed-info" class="detailed-info">
      <!-- 시놉시스 -->
      <div
        v-if="filmSynopsis"
        class="detailed-info-item"
        id="synopsis"
        tabindex="-1"
      >
        <h2>시놉시스</h2>
        <div v-html="filmSynopsis"></div>
      </div>
      <!-- 배우/제작진 -->
      <div
        class="detailed-info-item"
        id="people"
        tabindex="-1"
        v-if="filmPeople.length !== 0"
      >
        <h2 id="people-caption">배우/제작진</h2>
        <p id="people-summar" class="sr-only">
          역할이나 직무에 따른 사람들을 소개합니다.
        </p>
        <b-table
          :fields="filmPeopleFields"
          :items="filmPeople"
          borderless
          small
          thead-class="sr-only"
          aria-describedby="people-summary"
          aria-labelledby="people-caption"
        >
          <template #table-caption> 배우 및 제작진 정보 </template>
          <!-- <template #cell(role)="row">
            <div class="text-right">
              {{ row.item.role }}
            </div>
          </template> -->
        </b-table>
      </div>

      <!-- 수상내역 -->
      <div
        class="detailed-info-item"
        id="awards"
        tabindex="-1"
        v-if="film.awards.length !== 0"
      >
        <h2>수상내역</h2>
        <div class="awards-table">
          <div
            v-for="(year, index) in Object.keys(filmAwards).sort(
              (a, b) => b - a,
            )"
            :key="index"
            class="year-block d-flex flex-column"
          >
            <div class="year">
              {{ year }}
            </div>
            <div class="w-100">
              <div
                v-for="(perFestival, festival) in filmAwards[year]"
                :key="festival"
                class="festival-box"
              >
                <div class="festival flex-shrink-0">
                  {{ festival }}
                </div>
                <div>
                  <div v-for="(award, index) in perFestival" :key="index">
                    <span class="award-type">{{ award.award_type }}</span>
                    {{ award.award_name }} ({{ award.person_name }})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row"></div>
      </div>
      <!-- 포토 -->
      <div
        class="detailed-info-item"
        id="steel"
        tabindex="-1"
        v-if="film.photos.length !== 0"
      >
        <h2 class="no-divider">포토</h2>
        <b-carousel
          class="row-fullwidth film-photos-wrapper"
          id="carousel"
          :interval="0"
          label-prev="이전으로 이동"
          label-next="다음으로 이동"
          label-goto-slide="특정 슬라이드로 이동: "
          label-indicators="클릭하여 해당하는 슬라이드를 화면에 띄우세요"
          controls
          indicators
          @sliding-start="steelSlidingStart"
        >
          <b-carousel-slide v-for="(image, index) in film.photos" :key="index">
            <!-- :img-src="`${image.preview_url}?size=common`"
            :img-alt="image.alt" -->

            <template #img>
              <b-img
                class="d-block img-fluid w-100"
                :src="image.loaded ? `${image.preview_url}?size=common` : ''"
                :alt="image.alt"
              >
                <!-- height="500" -->
              </b-img>
            </template>
            <!-- :img-src="parseUploadLink(image.preview_url)" -->
          </b-carousel-slide>
        </b-carousel>
      </div>
      <!-- 비디오 -->
      <div
        class="detailed-info-item"
        id="videos"
        tabindex="-1"
        v-if="film.videos.length !== 0"
      >
        <h2>비디오</h2>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="video in commonVideos"
              :key="video.youtube_iframe"
            >
              <div
                class="iframe-wrapper"
                :data-title="video.title"
                :id="video.wrapperId"
                v-html="video.youtube_iframe"
                :style="{ 'padding-bottom': `${video.ratio * 100}%` }"
              ></div>
            </div>
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
      </div>
      <!-- 리뷰 -->
      <div
        class="detailed-info-item"
        id="reviews"
        tabindex="-1"
        v-if="film.reviews.length !== 0"
      >
        <h2>리뷰</h2>
        <div class="row">
          <div
            class="col-12 review-row"
            v-for="(review, index) in film.reviews"
            :key="index"
          >
            <p class="review-title">
              <b-link target="_blank" rel="external" :href="review.url">{{
                review.title
              }}</b-link>
            </p>
            <p class="review-source">
              {{ review.source }}, {{ review.author }}
            </p>
          </div>
        </div>
      </div>

      <!-- 제작노트 -->
      <div v-if="film.note" class="detailed-info-item" tabindex="-1" id="note">
        <h2>제작노트</h2>
        <div v-html="film.note"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Swiper, { Navigation } from 'swiper';

import { filmDetailQuery, graphql } from '../graphql-client';
import { parseUploadLink } from '../util';
import DistributionVue from './Distribution.vue';

Swiper.use([Navigation]);
/**
 * @param {any[]} array
 * @param {function(number):object} keyFinder
 */
const groupBy = (array, keyFinder) => {
  const result = {};
  array.forEach((item) => {
    const key = keyFinder(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  });
  return result;
};

export default {
  name: 'Film',
  data() {
    return {
      /** @type {import('swiper').Swiper} */
      videoSwiper: null,
      videoPlayer: {},
      film: {
        title: '',
        title_en: '',
        people: [],
        reviews: [],

        /**
         * @typedef {object} Video
         * @property {boolean} is_main_trailer
         * @property {string} title
         * @property {string} youtube_iframe
         * @property {number} ratio
         * @property {string} wrapperId
         */

        /** @type {Array<Video>} */
        videos: [],
        awards: [],
        photos: [
          {
            mongo_file_id: '',
            filename: '',
            preview_url: '',
            title: '',
          },
        ],
        poster_url: '',
        poster_alt: '',
        watch_grade: '전체관람가',
        show_time: 6491,
        genres: [],
        open_date: new Date('2020-08-20'),
        prod_date: new Date('2020-05-11'),
        synopsis: '',
        youtubeIframeCode: '',
      },
      trailerRatio: 0,
      filmSummary: [],
    };
  },
  computed: {
    /** @returns {string} */
    vuePageTitle() {
      return this.film.title;
    },

    /** @returns {string} */
    filmDirector() {
      return this.film.people
        .filter((person) => person.role_type === 'director')
        .map((person) => person.name)
        .join(', ');
    },
    /** @returns {number} */
    filmOpenYear() {
      // console.log(this.film.open_date);
      if (this.film.open_date.getTime() > 0) {
        return this.film.open_date.getFullYear();
      }
      return null;
    },
    /** @returns {number} */
    filmProdYear() {
      if (this.film.prod_date.getTime() > 0) {
        return this.film.prod_date.getFullYear();
      }
      return null;
    },
    /** @returns {string} */
    mainTrailerIframe() {
      const main = this.film.videos.find(
        (video) => video.is_main_trailer === true,
      );
      // console.log(main);
      if (main) {
        return main.youtube_iframe;
      }
      return '';
    },
    /** @returns {Array<Video>} */
    commonVideos() {
      return this.film.videos
        .filter((video) => !video.is_main_trailer)
        .map((video) => video);
    },
    /** @returns {string} */
    filmActors() {
      return this.film.people
        .filter((person) => person.role_type === 'actor')
        .map((person) => `${person.name}(${person.role})`)
        .join(', ');
    },
    /** @returns {string} */
    filmGenres() {
      return this.film.genres.join(', ');
    },
    /** @returns {number} */
    filmShowMinutes() {
      return Math.floor(this.film.show_time / 60);
    },
    /** @returns {string} */
    filmOpenDate() {
      if (this.film.open_date.getTime() === 0) {
        return '';
      }
      return moment(this.film.open_date).format('yyyy.MM.DD');
    },
    /** @returns {Array<*>} */
    filmPeople() {
      const result = [];
      const refined = {
        director: [],
        actor: [],
        staff: [],
      };
      this.film.people.forEach((person) => {
        let role = person.role_type === 'director' ? '감독' : person.role;
        if (person.role_type === 'actor') role += ' 역';

        refined[person.role_type].push({
          role,
          name: person.name,
        });
      });
      result.push(...refined.director);
      result.push(...refined.actor);
      result.push(...refined.staff);

      return result;
    },
    /** @returns {string} */
    filmSynopsis() {
      // if (this.film.synopsis) {
      //   return this.film.synopsis.replace(/\n/gi, '<br>');
      // }
      return this.film.synopsis;
      // return null;
    },
    /** @returns {Array<*>} */
    filmPeopleFields() {
      return [
        {
          key: 'role',
          label: '역할',
          isRowHeader: true,
        },
        {
          key: 'name',
          label: '이름',
        },
      ];
    },
    /** @returns {object} */
    filmAwards() {
      const result = groupBy(this.film.awards, (item) => item.year);
      // eslint-disable-next-line no-restricted-syntax
      Object.keys(result).forEach((year) => {
        result[year] = groupBy(result[year], (item) => item.festival_name);
      });
      // console.log(result);
      return result;
    },
    /** @returns {Array<string>} */
    videoIds() {
      return this.film.videos.map((video) => {
        return video.youtube_iframe.match('(?<=embed/).+?(?=")')[0];
      });
    },
    // filmAwardsKeys() {
    //   const filmAwards = this.filmAwards;
    //   return Object.keys(filmAwards).sort()
    // }
  },

  created() {},
  async mounted() {
    const res = await graphql(filmDetailQuery, {
      id: parseInt(this.$route.params.id, 10),
    });
    const film = res?.data?.film;
    if (!film || film.status === 'private') {
      this.$router.push({ name: '404' });
      return;
    }

    // 영화 개봉일 설정
    const newFilm = { ...film };
    newFilm.open_date = new Date(newFilm.open_date);
    newFilm.prod_date = new Date(newFilm.prod_date);
    this.film = newFilm;

    // 영화 개요 만들기
    if (this.filmGenres) {
      this.filmSummary.push(this.filmGenres);
    }
    if (this.filmShowMinutes > 0) {
      this.filmSummary.push(`${this.filmShowMinutes}분`);
    }
    if (this.film.is_opened && this.filmOpenDate) {
      this.filmSummary.push(`${this.filmOpenDate} 개봉`);
    }

    // 영화 포토가 있을 때 첫번째 것을 자동으로 로딩하기.
    if (this.film.photos) {
      this.film.photos = this.film.photos.map((photo) => ({
        ...photo,
        loaded: false,
      }));
      const photoLength = this.film?.photos?.length;
      if (photoLength > 0) {
        this.film.photos[0].loaded = true;
      }
    }

    // 메인예고편 높이 계산 및 iframe title 속성 추가해주기
    this.$nextTick(() => {
      const trailerDiv = this.$refs.trailer;
      let iframe = null;
      if (trailerDiv instanceof Element) {
        iframe = trailerDiv.querySelector('iframe');
      }
      if (iframe) {
        this.trailerRatio =
          parseInt(iframe.height, 10) / parseInt(iframe.width, 10);
        iframe.setAttribute('title', `${this.film.title} 메인 예고편`);
      }
    });

    // 비디오가 있을 경우 wrapper id 를 설정해놓기.
    if (Array.isArray(this.film.videos)) {
      this.film.videos = this.film.videos.map((video) => ({
        ...video,
        wrapperId: this.getVideoWrapperId(video.youtube_iframe),
        ratio: this.getRatio(video.youtube_iframe),
      }));
    }

    // 비디오 swiper 초기화하기
    // this.$loadScript('https://www.youtube.com/iframe_api')
    //   .then((/** @type {HTMLScriptElement} */ result) => {
    //     const onPlayerReady = (event) => {
    //       event.target.playVideo();
    //     };
    //     const makeYoutube = async (id, link) => {
    //       // @ts-ignore
    //       this.videoPlayer[id] = new YT.Player(id, {
    //         height: '300',
    //         width: '480',
    //         playerVars: { autoplay: 1, controls: 0 },
    //         videoId: link,
    //         events: {
    //           onReady: onPlayerReady,
    //         },
    //       });
    //     };
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
    // console.log('Film.vue mounted videoIds');
    // console.log(this.videoIds);

    // 비디오 목록 Swiper 초기화 및 리사이즈
    // $nextTick 해줘야 실제로 데이터 테이블이 html 로 적용된 상태에서 swiper 가 동작함.
    this.$nextTick(() => {
      this.videoSwiper = new Swiper('.swiper-container', {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });

      // 어차피 100% 이므로 width 속성과 height 속성 삭제
      this.film.videos.forEach((video) => {
        const wrapper = document.getElementById(video.wrapperId);
        const iframe = wrapper.querySelector('iframe');
        iframe.setAttribute('title', video.title);
        iframe.style.width = '100%';
        iframe.style.height = `${video.ratio * 100}%`;
        iframe.removeAttribute('width');
        iframe.removeAttribute('height');
      });
    });

    // 다른 비디오들 title 속성 추가해주기
    // this.$nextTick();
    // console.log(this.videoSwiper);

    // console.log(`iframe.height: ${iframe.height}`);
    // console.log(`iframe.width: ${iframe.width}`);
    // console.log(`this.trailerRatio: ${this.trailerRatio}`);
  },
  methods: {
    gotoCommunity() {
      this.$router.push({
        name: 'Community',
        query: { name: this.film.title },
      });
    },
    onScrollactiveItemChanged(event, currentItem, lastActiveItem) {
      // /** @type {Element} */
      // let a;

      console.log('# Film.vue onScrollactiveItemChanged');
      console.log(currentItem);
      console.log(event);
      // 클릭으로 넘어간 경우는 그냥 event 가 null 이더라.
      // 클릭이 아닌 경우는, scroll 등이 있다.
      if (event === null) {
        const selector = currentItem.attributes?.href?.value;
        const id = selector.slice(1);
        document.getElementById(id).focus({
          preventScroll: true,
        });
      }
    },
    onScrollactiveClicked() {
      // ?
    },
    parseUploadLink,
    steelSlidingStart(slide) {
      if (!this.film.photos[slide].loaded) {
        this.film.photos[slide].loaded = true;
      }
    },
    getVideoWrapperId(iframeHtml) {
      return `${iframeHtml.match('(?<=embed/).+?(?=")')[0]}-wrapper`;
    },
    getRatio(iframeHtml) {
      const width = parseInt(iframeHtml.match('width="(\\d+?)"')?.[1], 10);
      const height = parseInt(iframeHtml.match('height="(\\d+?)"')?.[1], 10);
      console.log('# Film getRatio');
      console.log(width);
      console.log(height);
      return height / width || 9 / 16;
    },
  },
};
</script>

<style lang="scss" scoped>
// 메인 포스터
@use '../util';

.main-poster {
  position: relative;

  img {
    max-width: 500px;
    min-width: 1px;
    width: 100%;
  }
  .zoom-link {
    position: relative;
    transition: 0.7s;
  }
  .zoom-link:hover {
    transform: scale(1.07);
    .zoom-icon {
      opacity: 1;
      transition: 0.5s;
    }
  }

  div.blank {
    margin-top: 10px;
    background-color: #ddd;
    min-height: 500px;
    border-top: 1px solid #aaa;
  }
}

.zoom-icon {
  opacity: 0;
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: util.$text-color;
  font-size: 22px;
}

.application {
  & button {
    background-color: transparent;
    color: #009eda;
    border-color: #009eda;
    font-size: 19px;
    font-weight: bold;
    &:hover {
      color: #fff;
      background-color: #009eda;
    }
  }
}

.basic-info {
  margin-bottom: 60px;
  & .head {
    margin-bottom: 50px;

    & h1 {
      margin-left: -5px;
      color: #009eda;
      font-size: 60px;
    }
    & .title-en {
      margin-top: -5px;
      color: #767676;
      font-weight: 600;
      word-spacing: -1px;
    }
  }
  & .basic-body-row {
    margin: 7px 0;
    font-size: 17px;

    & .title {
      font-weight: 700;
      margin-right: 25px;
      min-width: 40px;
    }

    & .content {
    }

    & .seperator {
      padding: 0 10px;
    }
  }
}

.mobile .basic-info {
  & .head h1 {
    font-size: 36px;
  }
  & .basic-body-row {
    font-size: 14px;
  }
}

// 예고편
.trailer {
  position: relative;
  height: 0;
  overflow: hidden;
  margin-bottom: 30px;
}

.scrollactive {
  border-bottom: 2px solid #eee;
  background-color: rgba(255, 255, 255, 1);
}
.scrollactive-item {
  color: #767676;
  font-size: 18px;
  padding: 11px 20px;
  margin: 4px 0;
  transition: 1s;
  transition-property: color;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  &:hover {
    color: #009eda;
    transition: none;
    // background-color:#eee;
    text-decoration: none;
  }
}
.mobile .scrollactive-item {
  font-size: 16px;
  border-width: 10px;
}
.affix-wrapper {
  height: 55px;
}
.mobile .affix-wrapper {
  display: none;
}

.vue-affix {
  display: absolute;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 888;

  &.affix {
    max-width: 1260px;
    top: 100px !important;
    left: auto;
    right: auto;
    // margin-left:-50%;
    // & .scrollactive {
    //   height: 55px;
    // }
    // & .scrollactive-item {
    //   font-size: 24px;
    // }
  }
}

.scrollactive-item.active,
.vue-affix.affix-top .scrollactive-item.first {
  color: #009eda;
  font-weight: 700;
  border-color: #009eda;
}

// 상세 정보

.detailed-info-item {
  margin-bottom: 30px;
  padding-top: 40px;
  & > h2 {
    font-size: 24px;
    padding-bottom: 20px;
    // border-bottom: 1px solid #eee;
    margin-bottom: 0px;
  }
  & > h2.no-divider {
    border: 0;
    margin-bottom: 10px;
  }
}

.mobile .row-fullwidth {
  margin-left: -15px;
  margin-right: -15px;
}

// synopsis

// #synopsis {
//   max-width: 600px;
// }

// actor, people

#people table {
  max-width: 300px;
  min-width: 1px;
}

// 수상 실적

.awards-table .year {
  width: 40px;
  margin: 0px 20px 0 0;
  color: #fff;
  color: #767676;
  font-weight: 600;
  // font-size: 120%;
}

.awards-table .year-block {
  margin-bottom: 25px;
}
.awards-table .festival {
  width: 180px;
  font-weight: 600;
}
.awards-table .festival-box {
  margin: 0px 20px 10px 0px;
  display: flex;
}
.award-type {
  color: #767676;
  padding-right: 10px;
}

// carousel

.carousel-item img {
  object-fit: contain;
}

// review

.review-card {
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
}

.review-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 20px 10px;
  margin-top: -1px;
}

.review-title,
.review-source {
  margin: 0;
}

.review-title {
  text-decoration: underline;
  padding-right: 10px;
  text-overflow: ellipsis;

  & a {
    color: #2b3e4a;
  }
  & a:hover {
    color: #009eda;
  }
}

.review-source {
  // width: 100px;
  font-size: 80%;
  color: #767676;
}

.swiper-button-next,
.swiper-button-prev {
  border: 7px solid transparent;
  border-color: transparent;
  border-width: 15px 10px;
  box-sizing: content-box;
  background-color: rgb(34 58 86 / 20%);
  border-radius: 3px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  transform: scale(1.5);
}

.swiper-button-next {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50.51 98.2'%3E%3Cpolygon fill='%23fff' points='1.41 98.2 0 96.79 47.69 49.1 0 1.41 1.41 0 50.52 49.1 1.41 98.2' /%3E%3C/svg%3E");
}
.swiper-button-prev {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50.3 97.78'%3E%3Cpolygon fill='%23fff' points='48.89 0 50.3 1.41 2.82 48.89 50.3 96.37 48.89 97.78 0 48.89 48.89 0' /%3E%3C/svg%3E");
}

.swiper-button-prev::after,
.swiper-button-next::after {
  content: '';
}

.iframe-wrapper {
  height: 0;
  position: relative;
}
</style>

<style lang="scss">
// v-html 삽입 때문에 scoped css 가 먹히지 않음
.trailer iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.iframe-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#people th {
  width: 110px;
}
</style>
