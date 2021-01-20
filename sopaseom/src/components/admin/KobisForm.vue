<!-- emits @selected-->

<template>
  <div class="kovis-form">
    <div class="search-box">
      <b-form-input
        class="search-input"
        v-model="search"
        @keydown.enter="searchClicked"
      ></b-form-input>
      <loading-button @click="searchClicked" :loading="fetchingList">
        검색
      </loading-button>
    </div>
    <p class="description">상위 20개까지 검색됩니다.</p>
    <b-list-group>
      <b-list-group-item
        v-for="(film, filmIndex) in films"
        :key="film.movieCd"
        @click="filmClicked(filmIndex)"
        button
      >
        <!-- {
  "movieCd": "20202688",
  "movieNm": "코끼리와 나비",
  "movieNmEn": "The Elephant and the Butterfly",
  "prdtYear": "2017",
  "openDt": "",
  "typeNm": "장편",
  "prdtStatNm": "기타",
  "nationAlt": "벨기에",
  "genreAlt": "드라마,가족",
  "repNationNm": "벨기에",
  "repGenreNm": "드라마",
  "directors": [],
  "companys": []
} -->
        <h2 class="title">
          {{ film.movieNm }}
          <span class="meta"
            >{{ film.movieNmEn }} | 감독
            {{ film.directors.map((director) => director.peopleNm).join(', ') }}
            | {{ film.prdtYear }} 제작</span
          >
        </h2>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { BButton, BFormInput, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { getMovieInfo, getMovieList } from '@/util';
import { mapActions } from 'vuex';

export default {
  components: {
    BListGroup,
    BListGroupItem,
    BFormInput,
    LoadingButton: () => import('@/components/LoadingButton'),
  },
  data() {
    return {
      fetchingList: false,
      search: '',
      films: [],
    };
  },
  methods: {
    ...mapActions(['pushMessage']),
    async searchClicked() {
      this.fetchingList = true;
      const { success, code, list } = await getMovieList(this.search);
      console.log('# KobisForm searchClicked results');
      console.log({ success, code, list });
      if (success) {
        this.films = list.map((film) => ({
          ...film,
        }));
      } else {
        this.pushMessage({
          msg: `영화 검색 도중 실패했습니다. >> ${code}`,
          type: 'danger',
          id: 'getMovieListFailed',
        });
      }

      this.fetchingList = false;
    },
    async filmClicked(index) {
      this.fetchingList = true;
      console.log('# KobisForm filmClicked!');
      const { movieCd } = this.films[index];
      const { success, code, info } = await getMovieInfo(movieCd);
      if (success) {
        this.$emit('selected', info);
      } else {
        this.pushMessage({
          msg: `영화 상세 정보를 가져오는 도중 실패했습니다. >> ${code}`,
          type: 'danger',
          id: 'getMovieInfoFailed',
        });
      }
      this.fetchingList = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  margin-bottom: 30px;
}

.description {
  margin: 0;
}
.search-input {
  width: auto;
  flex: 1;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.title,
p {
  margin: 0;
}
.meta {
  font-size: 14px;
  color: #767676;
  font-weight: normal;
}
</style>
<style>
</style>
