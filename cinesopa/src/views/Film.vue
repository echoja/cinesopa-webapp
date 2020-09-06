<template>
  <div class="container-fluid">
    <!-- 메인 포스터 -->
    <div class="main-poster d-flex justify-content-center row-fullwidth">
      <b-link class="zoom-link" alt="포스터 확대하기">
        <b-img :alt="`${film.title} 포스터`" :src="film.posterLink" class="shadow"></b-img>
      </b-link>
    </div>
    <!-- 각종 신청 -->
    <div class="application text-center my-5">
      <b-button pill>공동체상영 신청하기</b-button>
    </div>
    <!-- 기본 정보 -->
    <div class="basic-info">
      <div class="head">
        <h1>{{ film.title }}</h1>
        <p class="title-en">{{ film.title_en }}, {{ film.open_year }}</p>
      </div>
      <div class="body" role="table" aria-colcount="2">
        <div role="rowgroup">
          <div class="basic-body-row d-flex" role="row">
            <span class="title" role="rowheader">
              개요
            </span>
            <span class="content" role="cell"
              >{{ filmGenres }}
              <span class="seperator" role="separator">|</span>
              {{ filmShowMinutes }}분
              <span class="seperator" role="separator">|</span>
              {{ filmOpenDate }} 개봉
            </span>
          </div>
          <div class="basic-body-row d-flex" role="row">
            <span class="title" role="rowheader">
              감독
            </span>
            <span class="content" role="cell">
              {{ filmDirector }}
            </span>
          </div>
          <div class="basic-body-row d-flex" role="row">
            <span class="title" role="rowheader">
              출연
            </span>
            <span class="content" role="cell">
              {{ filmActors }}
            </span>
          </div>
          <div class="basic-body-row d-flex" role="row">
            <span class="title" role="rowheader">
              등급
            </span>
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
      v-html="film.youtubeIframeCode"
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
        >
          <b-link href="#synopsis" class="scrollactive-item first">시놉시스</b-link>
          <b-link href="#people" class="scrollactive-item">배우/제작진</b-link>
          <b-link href="#awards" class="scrollactive-item">수상내역</b-link>
          <b-link href="#steel" class="scrollactive-item">스틸컷</b-link>
          <b-link href="#reviews" class="scrollactive-item">리뷰</b-link>
          <b-link href="#note" class="scrollactive-item" v-if="film.note">제작노트</b-link>
        </scrollactive>
      </affix>
    </div>
    <!-- 상세정보 -->
    <div id="detailed-info" class="detailed-info">
      <!-- 시놉시스 -->
      <div class="detailed-info-item" id="synopsis">
        <h2>시놉시스</h2>
        <div v-html="film.synopsis"></div>
      </div>
      <!-- 배우/제작진 -->
      <div class="detailed-info-item" id="people">
        <h2>배우/제작진</h2>
        <b-table
          :fields="filmPeopleFields"
          :items="filmPeople"
          borderless
          small
          thead-class="table-no-header"
        >
          <!-- <template #cell(role)="row">
            <div class="text-right">
              {{ row.item.role }}
            </div>
          </template> -->
        </b-table>
      </div>

      <!-- 수상내역 -->
      <div class="detailed-info-item" id="awards">
        <h2>
          수상내역
        </h2>
        <div class="awards-table">
          <div
            v-for="(year, index) in Object.keys(filmAwards).sort((a, b) => b - a)"
            :key="index"
            class="d-flex"
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
      <!-- 스틸컷 -->
      <div class="detailed-info-item" id="steel">
        <h2 class="no-divider">
          스틸컷
        </h2>
        <b-carousel
          class="row-fullwidth"
          id="carousel"
          label-prev="다음으로 이동"
          label-next="이전으로 이동"
          label-goto-slide="특정 슬라이드로 이동: "
          label-indicators="슬라이드를 클릭하여 화면에 띄우세요"
          controls
          indicators
        >
          <b-carousel-slide v-for="(image, index) in film.photos" :key="index" :img-src="image">
          </b-carousel-slide>
        </b-carousel>
      </div>
      <!-- 리뷰 -->
      <div class="detailed-info-item" id="reviews">
        <h2>
          리뷰
        </h2>
        <div class="row">
          <div
            class="col-12 col-md-6 col-lg-4 review-card"
            v-for="(review, index) in film.reviews"
            :key="index"
          >
            <p class="review-title">
              <b-link target="_blank" rel="external" :href="review.url">{{ review.title }}</b-link>
            </p>
            <p class="review-source">{{ review.source }}, {{ review.author }}</p>
          </div>
        </div>
      </div>
      <!-- 제작노트 -->
      <div v-if="film.note" class="detailed-info-item" style="height: 10000px" id="note">
        <h2>
          제작노트
        </h2>
        <div v-html="film.note"></div>
      </div>
    </div>
  </div>
  <!-- <b-nav>
    <b-nav-item :to="{name:}"></b-nav-item>
  </b-nav> -->
</template>

<script>
import moment from 'moment';

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
      film: {
        title: '여름날',
        title_en: 'Days in a Summer',
        open_year: '2020',
        people: [
          {
            role_type: 'director',
            name: '김여름',
          },
          {
            role_type: 'actor',
            name: '정유라',
            role: '승희',
          },
          {
            role_type: 'actor',
            name: '김록경',
            role: '거제청년',
          },
          {
            role_type: 'staff',
            name: '김여름',
            role: '촬영',
          },
        ],
        reviews: [
          {
            title: '그 뒤에는 아무 것도 없었다.',
            url: 'http://naver.com',
            source: '네이버 블로그',
            author: '아이린',
          },
          {
            title: '아름답지만 슬픈 이야기',
            url: 'http://naver.com',
            source: '티스토리 블로그',
            author: '제시',
          },
          {
            title: '고독 속에서 피어나는 한 송이 꽃',
            url: 'http://naver.com',
            source: '완경일보',
            author: '아무개',
          },
        ],
        awards: [
          {
            festival_name: '24회 인디포럼',
            year: 2020,
            person_name: '오정석',
            award_name: '폐막작',
            award_type: '초청',
          },
          {
            festival_name: '24회 인디포럼',
            year: 2020,
            person_name: '오정석',
            award_name: '배회하는 시네마의 주체들',
            award_type: '초청',
          },
          {
            festival_name: '8회 무주산골영화제',
            year: 2020,
            person_name: '오정석',
            award_name: '영화 창(窓)',
            award_type: '후보',
          },
          {
            festival_name: '45회 서울독립영화제',
            year: 2019,
            person_name: '오정석',
            award_name: '경쟁부문_장편',
            award_type: '후보',
          },
        ],
        photos: [
          // eslint-disable-next-line global-require
          require('../assets/test/steel2.jpg'),
          // eslint-disable-next-line global-require
          require('../assets/test/steel23.jpg'),
          // eslint-disable-next-line global-require
          // require('../assets/test/test-poster.jpg'),
        ],
        // eslint-disable-next-line global-require
        posterLink: require('../assets/test/test-poster.jpg'),
        watch_grade: '전체관람가',
        show_time: 6491,
        genres: ['드라마'],
        open_date: new Date('2020-08-20'),
        synopsis: `<p>‘승희’(김유라)는 서울 생활을 정리하고 고향
        거제도에 내려왔지만 남겨진 것은 엄마의 빈 자리 뿐이다.
        의지할 곳 없이 마을을 서성이던 ‘승희’는 ‘거제 청년(김록경)’과
        우연히 만난다. 그들은 평범한 일상 속에서 자신처럼 고립되어 있는
        폐왕성에 도착하고, 그곳에서 누구나 언젠가 지나쳐야만 하는 유배된
        시간과 만난다.</p>`,
        youtubeIframeCode: `<iframe
        width="1245"
        height="672"
        src="https://www.youtube.com/embed/OeuIAQnrbZo"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>`,
      },
      trailerRatio: 0,
    };
  },
  computed: {
    filmDirector() {
      return this.film.people
        .filter((person) => person.role_type === 'director')
        .map((person) => person.name)
        .join(', ');
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
    filmPeopleFields() {
      return [
        {
          key: 'role',
          isRowHeader: true,
        },
        {
          key: 'name',
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
  mounted() {
    console.dir(this.$refs.trailer);
    /** @type {HTMLDivElement} */
    const trailerDiv = this.$refs.trailer;
    const iframe = trailerDiv.querySelector('iframe');
    this.trailerRatio = iframe.height / iframe.width;
  },
};
</script>

<style lang="scss" scoped>
// 메인 포스터

.main-poster {
  position: relative;

  // & .zoom-link {
  //   overflow:hidden;
  // }
  & img {
    max-width: 500px;
    min-width: 1px;
    width: 100%;
  }
  // & .zoom-link:hover img {
  //   transform: scale(1.1);
  // }

  & div.blank {
    margin-top: 10px;
    background-color: #ddd;
    min-height: 500px;
    border-top: 1px solid #aaa;
  }
}

.application {
  & button {
    background-color: transparent;
    color: var(--link-color);
    border-color: var(--link-color);
    &:hover {
      color: #fff;
      background-color: var(--link-color);
    }
  }
}

.basic-info {
  margin-bottom: 60px;
  & .head {
    margin-bottom: 50px;

    & h1 {
      color: var(--link-color);
      font-size: 60px;
    }
    & p {
      margin-top: -5px;
      color: var(--secondary-text-color);
      font-weight: 600;
    }
  }
  & .basic-body-row {
    margin: 7px 0;
    font-size: 22px;
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
    font-size: 18px;
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
  height: 55px;
  border-bottom: 2px solid #eee;
  background-color: rgba(255, 255, 255, 1);
}
.scrollactive-item {
  color: var(--secondary-text-color);
  font-size: 24px;
  border: 20px solid transparent;
  border-radius: 500px;
  transition: 0.5s;
  transition-property: color;

  &:hover {
    color: #222;
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
    max-width: var(--max-content-size);
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
  color: var(--link-color);
  font-weight: 700;
}

.detailed-info-item {
  padding-top: 70px;
  & > h2 {
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    margin-bottom: 30px;
  }
  & > h2.no-divider {
    border: 0;
    margin-bottom: 10px;
  }
}

.row-fullwidth {
  margin-left: -15px;
  margin-right: -15px;
}

// actor, people

#people table {
  max-width: 300px;
  min-width: 1px;
}

// 수상 실적

.awards-table .year {
  width: 40px;
  margin: 0px 20px 0 0;
  font-size: 120%;
}
.awards-table .festival {
  width: 160px;
}
.awards-table .festival-box {
  margin: 0px 20px 10px 0px;
  display: flex;
}
.award-type {
  font-weight: 600;
  padding-right: 10px;
}

// review

.review-card {
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
}

.review-title,
.review-source {
  margin: 0;
}

.review-title {
  text-decoration: underline;
  & a {
    color: var(--link-color);
  }
  & a:hover {
    color: var(--text-color);
  }
}

.review-source {
  font-size: 80%;
  color: var(--secondary-text-color);
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

.table-no-header {
  display: none;
}
</style>
