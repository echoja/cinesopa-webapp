<template>
  <div>
    <b-form @submit.stop.prevent="confirm" v-if="show">
      <b-row class="action">
        <b-button @click="importFrom">영진위로부터 가져오기</b-button>
      </b-row>
      <b-row>
        <b-col md>
          <b-form-group id="input-title-group" label="영화 제목 (한글)" label-for="input-title">
            <b-form-input
              type="text"
              id="input-title"
              name="input-title"
              v-model="film.title"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-title_en-group" label="영화 제목 (영문)" label-for="input-title_en">
            <b-form-input
              type="text"
              id="input-title_en"
              name="input-title_en"
              v-model="film.title_en"
              :disabled="state.processing"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-email-group" label="이메일 주소" label-for="input-email">
            <b-form-input type="text" v-model="film.title"></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md>123</b-col>
      </b-row>
      <b-row>
        <b-button type="submit">적용</b-button>
      </b-row>
    </b-form>
    <p>{{ mode }}</p>
    <div>{{ film }}</div>
  </div>
</template>

<script>
import {
  graphql, filmQuery, updateFilmMutation, createFilmMutation,
} from '../../api/graphql-client';
import router from '../../router';

export default {
  name: 'FilmEdit',
  props: ['mode'],
  async created() {
    if (this.mode !== 'new') {
      const { id } = router.currentRoute.params;
      this.id = parseInt(id, 10);
      await this.initExist(this.id);
    }
  },
  data() {
    return {
      show: true,
      state: {
        processing: false,
      },
      id: null,
      film: {
        title: '',
        title_en: '',
        kobis_code: '',
        genres: [], // string
        show_time: 0, // 초
        type_name: null,
        prod_date: new Date(),
        open_date: new Date(),
        people: [], // person
        companies: [], // company
        watch_grade: null,
        reviews: [], // review
        star_naver: null,
        star_daum: null,
        star_cine21: null,
        poster: null, // File에 대한 id
        photos: null, // File에 대한 ObjectId의 배열
        videos: [], // video
        synopsis: '',
        note: '',
        tags: [],
        meta: {}, // Mixed
      },
    };
  },
  methods: {
    /**
     * @param {number} id
     */
    async initExist(id) {
      const result = await graphql(filmQuery, { id });
      const { film } = result.data;
      console.log(film);
      Object.keys(this.film).forEach((key) => {
        this.film[key] = film[key] ? film[key] : this.film[key];
      });
    },
    async importFrom() {
      // TODO
    },
    async buildInput() {
      const input = {};
      Object.keys(this.film).forEach((key) => {
        if (this.film[key]) input[key] = this.film[key];
      });
      return input;
    },
    async confirm() {
      if (this.mode === 'new') {
        return this.confirmNew();
      }
      return this.confirmUpdate();
    },
    async confirmNew() {
      const input = await this.buildInput();
      const result = await graphql(createFilmMutation, {
        input,
      });
      console.log(result);
    },
    async confirmUpdate() {
      const input = await this.buildInput();
      const result = await graphql(updateFilmMutation, {
        id: this.id,
        input,
      });
      console.log(result);
    },
  },
};
</script>

<style></style>
