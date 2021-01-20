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
            >시놉시스</b-link
          >
          <b-link
            href="#people"
            class="scrollactive-item"
            v-if="filmPeople.length !== 0"
            >배우/제작진</b-link
          >
          <b-link
            href="#awards"
            class="scrollactive-item"
            v-if="film.awards.length !== 0"
            >수상내역</b-link
          >
          <b-link
            href="#steel"
            class="scrollactive-item"
            v-if="film.photos.length !== 0"
            >포토</b-link
          >
          <b-link
            href="#reviews"
            class="scrollactive-item"
            v-if="film.reviews.length !== 0"
            >리뷰</b-link
          >
          <b-link href="#note" class="scrollactive-item" v-if="film.note"
            >제작노트</b-link
          >
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
import { filmDetailQuery, graphql } from '../graphql-client';
import { parseUploadLink } from '../util';
/**
 * @param {any[]} array
 * @param {string} key
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
  title: (context) => context.film.title,
  data() {
    return {
      vuePageTitle: '',
      film: {
        title: '',
        title_en: '',
        people: [],
        reviews: [],
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
        // title: '여름날',
        // title_en: 'Days in a Summer',
        // open_year: '2020',
        // people: [
        //   {
        //     role_type: 'director',
        //     name: '김여름',
        //   },
        //   {
        //     role_type: 'actor',
        //     name: '정유라',
        //     role: '승희',
        //   },
        //   {
        //     role_type: 'actor',
        //     name: '김록경',
        //     role: '거제청년',
        //   },
        //   {
        //     role_type: 'staff',
        //     name: '김여름',
        //     role: '촬영',
        //   },
        // ],
        // reviews: [
        //   {
        //     title: '그 뒤에는 아무 것도 없었다.',
        //     url: 'http://naver.com',
        //     source: '네이버 블로그',
        //     author: '아이린',
        //   },
        //   {
        //     title: '아름답지만 슬픈 이야기',
        //     url: 'http://naver.com',
        //     source: '티스토리 블로그',
        //     author: '제시',
        //   },
        //   {
        //     title: '고독 속에서 피어나는 한 송이 꽃',
        //     url: 'http://naver.com',
        //     source: '완경일보',
        //     author: '아무개',
        //   },
        // ],
        // awards: [
        //   {
        //     festival_name: '제 8회 무주산골영화제',
        //     year: 2020,
        //     person_name: '오정석',
        //     award_name: '영화 창(窓)',
        //     award_type: '후보',
        //   },
        //   {
        //     festival_name: '제 24회 인디포럼',
        //     year: 2020,
        //     person_name: '오정석',
        //     award_name: '폐막작',
        //     award_type: '초청',
        //   },
        //   {
        //     festival_name: '제 24회 인디포럼',
        //     year: 2020,
        //     person_name: '오정석',
        //     award_name: '배회하는 시네마의 주체들',
        //     award_type: '초청',
        //   },

        //   {
        //     festival_name: '제 45회 서울독립영화제',
        //     year: 2019,
        //     person_name: '오정석',
        //     award_name: '경쟁부문_장편',
        //     award_type: '후보',
        //   },
        // ],
        // photos: [
        //   // eslint-disable-next-line global-require
        //   require('../assets/test/steel2.jpg'),
        //   // eslint-disable-next-line global-require
        //   require('../assets/test/steel23.jpg'),
        //   // eslint-disable-next-line global-require
        //   // require('../assets/test/test-poster.jpg'),
        // ],
        // // eslint-disable-next-line global-require
        // poster_url: require('../assets/test/test-poster.jpg'),
        // watch_grade: '전체관람가',
        // show_time: 6491,
        // genres: ['드라마'],
        // open_date: new Date('2020-08-20'),
        // synopsis: `<p>‘승희’(김유라)는 서울 생활을 정리하고 고향
        // 거제도에 내려왔지만<br> 남겨진 것은 엄마의 빈 자리 뿐이다.<br>
        // 의지할 곳 없이 마을을 서성이던 ‘승희’는 ‘거제 청년(김록경)’과
        // 우연히 만난다.</p><p> 그들은 평범한 일상 속에서 자신처럼 고립되어 있는
        // 폐왕성에 도착하고,<br>그곳에서 누구나 언젠가 지나쳐야만 하는 유배된
        // 시간과 만난다.</p>`,
        // youtubeIframeCode: `<iframe width="1280" height="691"
        // src="https://www.youtube.com/embed/OeuIAQnrbZo"
        // frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // allowfullscreen></iframe>`,
      },
      trailerRatio: 0,
      filmSummary: [],
    };
  },
  computed: {
    filmDirector() {
      return this.film.people
        .filter((person) => person.role_type === 'director')
        .map((person) => person.name)
        .join(', ');
    },
    filmOpenYear() {
      // console.log(this.film.open_date);
      if (this.film.open_date.getTime() > 0) {
        return this.film.open_date.getFullYear();
      }
      return null;
    },
    filmProdYear() {
      if (this.film.prod_date.getTime() > 0) {
        return this.film.prod_date.getFullYear();
      }
      return null;
    },
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
    filmActors() {
      return this.film.people
        .filter((person) => person.role_type === 'actor')
        .map((person) => `${person.name}(${person.role})`)
        .join(', ');
    },
    filmGenres() {
      return this.film.genres.join(', ');
    },
    filmShowMinutes() {
      return Math.floor(this.film.show_time / 60);
    },
    filmOpenDate() {
      if (this.film.open_date.getTime() === 0) {
        return null;
      }
      return moment(this.film.open_date).format('yyyy.MM.DD');
    },
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
    filmSynopsis() {
      // if (this.film.synopsis) {
      //   return this.film.synopsis.replace(/\n/gi, '<br>');
      // }
      return this.film.synopsis;
      // return null;
    },
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
    filmAwards() {
      const result = groupBy(this.film.awards, (item) => item.year);
      // eslint-disable-next-line no-restricted-syntax
      Object.keys(result).forEach((year) => {
        result[year] = groupBy(result[year], (item) => item.festival_name);
      });
      // console.log(result);
      return result;
    },
    // filmAwardsKeys() {
    //   const filmAwards = this.filmAwards;
    //   return Object.keys(filmAwards).sort()
    // }
  },

  created() {},
  async mounted() {
    // this.film = [];
    // console.dir(this.$refs.trailer);
    /** @type {HTMLDivElement} */

    const res = await graphql(filmDetailQuery, {
      id: parseInt(this.$route.params.id, 10),
    });
    const film = res?.data?.film;
    if (!film || film.status === 'private') {
      this.$router.push({ name: '404' });
      return;
    }

    // console.log(film);

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
      const iframe = trailerDiv.querySelector('iframe');
      if (iframe) {
        this.trailerRatio = iframe.height / iframe.width;
        iframe.setAttribute('title', `${this.film.title} 메인 예고편`);
      }
    });

    // 제목 (vuePageTitle) 설정
    this.vuePageTitle = `${this.film.title}`;

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

      // console.log('# Film.vue onScrollactiveItemChanged');
      // console.log(currentItem);
      // console.log(event);
      // 클릭으로 넘어간 경우는 그냥 event 가 null 이더라.
      // 클릭이 아닌 경우는, scroll 등이 있다.
      if (event === null) {
        const selector = currentItem.attributes?.href?.value;
        // console.log(selector);
        const id = selector.slice(1);
        document.getElementById(id).focus();
        // currentItem.
      }
    },
    onScrollactiveClicked(event, a, b, c) {
      // console.log('# Film.vue onScrollactiveClicked');
      // console.log(event);
      // console.log(a);
      // console.log(b);
      // console.log(c);
    },
    parseUploadLink,
    steelSlidingStart(slide) {
      if (!this.film.photos[slide].loaded) {
        this.film.photos[slide].loaded = true;
      }
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

#people th {
  width: 110px;
}
</style>
