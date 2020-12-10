<template>
  <div class="application">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>상영 신청</h1>
      </div>
    </page-header>
    <div class="search-box">
      <div class="search-box-inner-wrapper">
        <b-form-input
          class="search-input"
          v-model="searchInput"
          @keyup.enter="searchEnterKeyupped"
          placeholder="영화 제목, 감독, 배우 검색"
        ></b-form-input>
        <loading-button
          @click="searchButtonClicked"
          :loading="loading"
          class="search-button"
        >
          <font-awesome-icon class="search-icon" :icon="['fas', 'search']">
          </font-awesome-icon>
        </loading-button>
      </div>
    </div>
    <div class="notice">
      영화를 클릭하여 영화 정보를 확인 후 바로 신청서를 작성하세요.
    </div>
    <!-- <div v-if="loading" key="loading">로딩중입니다.</div> -->
    <div v-if="!loading && films.length === 0" key="notFound">
      영화를 찾을 수 없습니다.
    </div>
    <div class="film-container container-fluid">
      <transition-group name="application-fade" tag="div" class="film-row row">
        <div
          class="film-col col col-md-6 col-lg-4 col-xl-3"
          v-for="film in films"
          :key="film.id"
        >
          <div class="poster-box">
            <b-link @click="openApplicationModal(film)">
              <b-img :src="film.poster_url" :alt="film.poster_alt"></b-img>
            </b-link>
          </div>
          <div class="info-box">
            <div class="film-title">
              <b-link @click="openApplicationModal(film)">
                {{ film.title }}
              </b-link>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="pagination-wrapper">
      <!-- 페이지네이션 -->
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="totalPages"
        align="center"
        :value="page"
        use-router
      ></b-pagination-nav>
    </div>
    <b-modal
      id="application-modal"
      hide-footer
      title="영화 상영 신청폼"
      size="lg"
    >
      <h2>영화 정보</h2>
      <application-form :reqFilm="applicationFilm" @submit="formSubmitted">
      </application-form>
      <!-- <pre>
        {{ applicationFilm }}
      </pre> -->
      <!-- <b-button class="test" @click="formSubmitted">테스트</b-button> -->
    </b-modal>
  </div>
</template>

<script>
import { makeSimpleQuery } from '@/api/graphql-client';
import {
  BFormInput,
  BImg,
  BPaginationNav,
  BButton,
  BModal,
  BLink,
} from 'bootstrap-vue';
import LoadingButton from '@/components/LoadingButton.vue';
import ApplicationForm from '@/components/ApplicationForm.vue';
import { mapActions } from 'vuex';

const filmsReq = makeSimpleQuery('films');

export default {
  title: '상영신청',
  components: {
    PageHeader: () => import('@/components/PageHeader.vue'),
    BImg,
    BFormInput,
    BPaginationNav,
    BButton,
    BModal,
    BLink,
    LoadingButton,
    ApplicationForm,
  },
  data() {
    return {
      films: [],
      loading: false,
      perpage: 20,
      searchInput: '',
      total: 0,
      applicationFilm: {},
      changeUid: 0,
    };
  },
  computed: {
    condition() {
      return {
        page: this.page - 1,
        perpage: this.perpage,
        // prod_gte: DateTime,
        // prod_lte: DateTime,
        // open_gte: DateTime,
        // open_lte: DateTime,
        // tags: [String],
        search: this.search,
        // is_opened: Boolean
      };
    },
    search() {
      return this.$route.query.search ?? null;
    },
    page() {
      const { page } = this.$route.query;
      return page ? parseInt(page, 10) : 1;
    },
    totalPages() {
      const o = Math.ceil(this.total / this.perpage);
      if (o === 0) return 1;
      return o;
    },
  },
  watch: {
    $route() {
      this.fetchData();
      this.changeUid += 1;
    },
  },
  async mounted() {
    this.searchInput = this.condition.search;
    this.fetchData();
  },
  methods: {
    ...mapActions(['pushMessage']),
    async fetchData() {
      this.loading = true;
      const { condition } = this;
      const { total, list } = await filmsReq(
        { condition },
        `
      {
        total, list {
  id title title_en poster poster_url poster_alt kobis_code genres show_time type_name prod_date open_date watch_grade 
  note tags is_featured is_opened featured_steel featured_color featured_synopsis badge_text
  badge_color status synopsis meta 
  people { role_type name name_en role }
  companies { name name_en role }
  reviews { title url source author }
  photos { mongo_file_id filename preview_url alt title }
  # videos { is_main_trailer youtube_iframe title }
  awards { festival_name year person_name award_name award_type }
        }
      }`,
      );
      console.log('# Application fetchData res');
      console.dir({ total, list });
      this.total = total;
      this.films = list;
      this.loading = false;
    },
    searchEnterKeyupped() {
      this.searchProcess();
    },
    searchButtonClicked() {
      this.searchProcess();
    },
    async searchProcess() {
      try {
        this.$router.push({
          name: 'Application',
          query: {
            page: 1,
            search: this.searchInput,
          },
        });
      } catch (e) {
        // console.log('# Application searchProcess catch');
        // console.dir(e);
        this.fetchData();
      }
    },
    linkGen(pageNum) {
      return {
        name: 'Application',
        query: { page: pageNum, search: this.search },
      };
    },
    openApplicationModal(film) {
      this.applicationFilm = { ...film };
      this.$bvModal.show('application-modal');
    },
    formSubmitted() {
      this.$bvModal.hide('application-modal');
      this.pushMessage({
        type: 'success',
        msg: '성공적으로 제출되었습니다.',
        id: 'formSubmitSuccess',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// animations

.application-fade-enter-active,
.application-fade-leave-active {
  transition-property: opacity;
  transition-property: height, opacity, margin, transform;
  transition-timing-function: ease;
  overflow: hidden;
}

.application-fade-enter-active {
  transition-duration: 1s;
  // transition-duration: 10s;
}
.application-fade-leave-active {
  transition-duration: 0.3s;
  // transition-duration: 10s;
}
.application-fade-enter,
.application-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.transition-wrapper {
  width: 100%;
}

// search
.search-box {
  display: flex;
  padding: 70px 0 0;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
}

.search-box-inner-wrapper {
  display: flex;
  padding: 10px;
  border: 1px solid #ddd;
}

.search-input {
  max-width: 300px;
  margin-right: 5px;
  border: 0;
}

.search-button {
  border: 0;
}

.notice {
  text-align: center;
  margin-bottom: 60px;
  font-size: 14px;
  color: #565656;
}

// container, row, col
.film-container.container-fluid {
  margin-left: -30px;
  margin-right: -30px;
}

.film-col.col {
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 50px;
}

.poster-box {
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.poster-box img {
  width: 100%;
}

.film-title {
  text-align: center;
  a {
    font-size: 20px;
    font-weight: bold;
  }
}

// modal
#application-modal {
  h2 {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
<style>
</style>
