<template>
  <div>
    <header class="p-3">
      <h1>
        영화 편집
        <b-button size="sm" @click="importFrom">영진위로부터 가져오기</b-button>
      </h1>
    </header>
    <b-form @submit.stop.prevent="confirm" v-if="show">
      <b-row class="action"> </b-row>
      <b-row>
        <b-col lg>
          <!----- form group start --->
          <b-form-group
            id="input-title-group"
            label="영화 제목 (한글)"
            label-for="input-title"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
          >
            <b-form-input
              type="text"
              id="input-title"
              name="input-title"
              v-model="film.title"
            ></b-form-input>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-title_en-group"
            label="영화 제목 (영문)"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-title_en"
          >
            <b-form-input
              type="text"
              id="input-title_en"
              name="input-title_en"
              v-model="film.title_en"
              :disabled="state.processing"
            ></b-form-input>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-kobis_code-group"
            label="영진위 코드"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-kobis_code"
          >
            <b-form-input
              type="text"
              id="input-kobis_code"
              name="input-kobis_code"
              v-model="film.kobis_code"
              :disabled="state.processing"
            ></b-form-input>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-show_time-group"
            label="상영 시간"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-show_time"
          >
            <div class="d-flex align-items-center">
              <b-form-input
                number
                type="number"
                id="input-show_time"
                name="input-show_time"
                v-model="input.show_time_minutes"
                :disabled="state.processing"
              ></b-form-input>
              <span class="after-input">분</span>
              <b-form-input v-model="input.show_time_seconds" type="number" number></b-form-input>
              <span class="after-input">초</span>
            </div>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-type_name-group"
            label="영화 구분"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-type_name"
          >
            <b-form-radio-group
              v-model="film.type_name"
              id="input-type_name"
              name="input-type_name"
              :disabled="state.processing"
            >
              <b-form-radio value="극영화">극영화</b-form-radio>
              <b-form-radio value="실험영화">실험영화</b-form-radio>
              <b-form-radio value="다큐멘터리">다큐멘터리</b-form-radio>
              <b-form-radio value="애니메이션">애니메이션</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-prod_date-group"
            label="제작 날짜"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-prod_date"
          >
            <!-- value-as-date -->
            <b-form-datepicker
              id="input-prod_date"
              name="input-prod_date"
              v-model="film.prod_date"
              :disabled="state.processing"
              locale="ko"
            ></b-form-datepicker>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-open_date-group"
            label="개봉 날짜"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-open_date"
          >
            <b-form-datepicker
              id="input-open_date"
              name="input-open_date"
              v-model="film.open_date"
              :disabled="state.processing"
              locale="ko"
            ></b-form-datepicker>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-watch_grade-group"
            label="상영등급"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-watch_grade"
          >
            <b-form-radio-group
              v-model="film.watch_grade"
              id="input-watch_grade"
              name="input-watch_grade"
              :disabled="state.processing"
            >
              <b-form-radio value="전체관람가">전체관람가</b-form-radio>
              <b-form-radio value="12세관람가">12세관람가</b-form-radio>
              <b-form-radio value="15세관람가">15세관람가</b-form-radio>
              <b-form-radio value="청소년관람불가">청소년관람불가</b-form-radio>
              <b-form-radio value="제한상영가">제한상영가</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-synopsis-group"
            label="시놉시스"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-synopsis"
          >
            <b-form-textarea
              size="sm"
              id="input-synopsis"
              name="input-synopsis"
              v-model="film.synopsis"
              :disabled="state.processing"
            ></b-form-textarea>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-note-group"
            label="제작노트"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-note"
          >
            <b-form-textarea
              size="sm"
              id="input-note"
              name="input-note"
              v-model="film.note"
              :disabled="state.processing"
            ></b-form-textarea>
          </b-form-group>
          <h2>보기 설정</h2>

          <!----- form group start --->
          <b-form-group
            id="input-view_settings-group"
            label="분류"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
          >
            <b-form-checkbox v-model="film.is_featured" :value="true" :unchecked-value="false"
              >특집(영화 목록 페이지 상단)에 걸어놓습니다.</b-form-checkbox
            >
            <b-form-checkbox v-model="film.is_opened" :value="true" :unchecked-value="false"
              >개봉한 영화입니다. (필터 적용시 작동)</b-form-checkbox
            >
          </b-form-group>
          <b-form-group
            id="input-note-group"
            label="뱃지 텍스트"
            description="영화 목록 페이지에서 포스토 왼쪽 상단에 보이는 텍스트 설정. (예: 개봉예정)"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-note"
          >
            <b-form-input
              type="text"
              size="sm"
              id="input-note"
              name="input-note"
              v-model="film.note"
              :disabled="state.processing"
            ></b-form-input>
          </b-form-group>

          <!-- 마지막! -->
          <b-form-group id="input-email-group" label="이메일 주소" label-for="input-email">
            <b-form-input type="text" v-model="film.title"></b-form-input>
          </b-form-group>
        </b-col>

        <b-col lg>
          <!-- 사람들 
              role_type: { type: String, enum: enumPeopleRoleType.raw_str_list },
    name: String,
    name_en: String,
    role: String,
          -->
          <div id="edit-people">
            <h2>
              사람들
              <b-button size="sm" @click="addPerson">
                새로 추가
              </b-button>
            </h2>

            <!-- const enumPeopleRoleType = makeEnum(['director', 'actor', 'staff']); -->
            <table class="w-100">
              <tr>
                <th>구분</th>
                <th>이름</th>
                <th>영어 이름</th>
                <th>역할</th>
                <th>삭제</th>
              </tr>

              <tr v-for="(person, index) in film.people" :key="index">
                <td>
                  <b-form-select size="sm" v-model="person.role_type">
                    <b-form-select-option value="director">감독</b-form-select-option>
                    <b-form-select-option value="actor">배우</b-form-select-option>
                    <b-form-select-option value="staff">스태프</b-form-select-option>
                  </b-form-select>
                </td>
                <td><b-form-input size="sm" v-model="person.name"></b-form-input></td>
                <td><b-form-input size="sm" v-model="person.name_en"></b-form-input></td>
                <td><b-form-input size="sm" v-model="person.role"></b-form-input></td>
                <td><b-button-close @click="removePerson(index)"></b-button-close></td>
              </tr>
            </table>
          </div>
          <!-- 회사들 -->
          <div id="edit-companies">
            <h2>
              영화사
              <b-button size="sm" @click="addCompany">
                새로 추가
              </b-button>
            </h2>
            <table class="w-100">
              <tr>
                <th>이름</th>
                <th>영어 이름</th>
                <th>역할</th>
                <th>삭제</th>
              </tr>

              <tr v-for="(company, index) in film.companies" :key="index">
                <td><b-form-input size="sm" v-model="company.name"></b-form-input></td>
                <td><b-form-input size="sm" v-model="company.name_en"></b-form-input></td>
                <td><b-form-input size="sm" v-model="company.role"></b-form-input></td>
                <td><b-button-close @click="removeCompany(index)"></b-button-close></td>
              </tr>
            </table>
          </div>
          <!-- 스틸컷 및 사진 -->
          <div id="edit-photos">
            <h2>
              스틸컷 및 사진
              <b-button size="sm" @click="addPhoto">
                새로 추가
              </b-button>
            </h2>
            <table class="w-100">
              <tr>
                <th>미리보기</th>
                <th>제목</th>
                <th>삭제</th>
              </tr>

              <tr v-for="(photo, index) in photosView" :key="index">
                <td class="text-center">
                  <img class="preview" :src="photo.src" alt="" />
                </td>
                <td><b-form-input size="sm" v-model="photo.title"></b-form-input></td>
                <td><b-button-close @click="removeReview(index)"></b-button-close></td>
              </tr>
            </table>
          </div>
          <!-- 비디오들 -->
          <div id="edit-videos">
            <h2>
              영상 자료
              <b-button size="sm" @click="importVideoByLink">
                Youtube 링크로 가져오기
              </b-button>
            </h2>
            <p>메인 예고편을 가장 위에 위치시키세요.</p>
            <table class="w-100">
              <tr>
                <th>Youtube 고유번호</th>
                <th>제목</th>
                <th>삭제</th>
              </tr>

              <tr v-for="(video, index) in film.videos" :key="index">
                <td><b-form-input size="sm" v-model="video.youtube_id"></b-form-input></td>
                <td><b-form-input size="sm" v-model="video.title"></b-form-input></td>
                <td><b-button-close @click="removeReview(index)"></b-button-close></td>
              </tr>
            </table>
          </div>
          <!-- 리뷰들 -->
          <div id="edit-reviews">
            <h2>
              리뷰
              <b-button size="sm" @click="addReview">
                새로 추가
              </b-button>
              <b-button size="sm" @click="importReviewByLink">
                링크로 가져오기
              </b-button>
            </h2>
            <table class="w-100">
              <tr>
                <th>제목</th>
                <th>url</th>
                <th>출처</th>
                <th>글쓴이</th>
                <th>-</th>
              </tr>

              <tr v-for="(review, index) in film.reviews" :key="index">
                <td><b-form-input size="sm" v-model="review.title"></b-form-input></td>
                <td><b-form-input size="sm" v-model="review.url" type="url"></b-form-input></td>
                <td><b-form-input size="sm" v-model="review.source"></b-form-input></td>
                <td><b-form-input size="sm" v-model="review.author"></b-form-input></td>
                <td><b-button-close @click="removeReview(index)"></b-button-close></td>
              </tr>
            </table>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-button type="submit">적용</b-button>
      </b-row>
    </b-form>
    <p>모드: {{ mode }}</p>
    <div>{{ film }}</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  graphql,
  filmQuery,
  updateFilmMutation,
  createFilmMutation,
} from '../../api/graphql-client';
import router from '../../router';
import moment from 'moment';

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
      input: {
        show_time_minutes: 0,
        show_time_seconds: 0,
      },
      film: {
        title: '',
        title_en: '',
        kobis_code: '', // kobis 코드
        genres: [], // [string] 장르
        show_time: 0, // 초
        type_name: null,
        prod_date: null,
        open_date: null,
        people: [], // person
        companies: [], // company
        watch_grade: null,
        reviews: [], // review
        star_naver: null,
        star_daum: null,
        star_cine21: null,
        poster: null, // File에 대한 id
        photos: [], // File에 대한 ObjectId의 배열
        videos: [], // video
        synopsis: '',
        note: '',
        tags: [],
        is_featured: false,
        is_opened: false,
        badge: '',
        meta: {}, // Mixed
      },
    };
  },
  computed: {
    photosView() {
      return [
        {
          // eslint-disable-next-line global-require
          src: require('../../../../cinesopa/src/assets/test/test-poster.jpg'),
          title: '여름날 포스터',
        },
      ];
    },
    // openDateFormatted() {
    //   return moment(this.film.open_date).format('yyyy-MM-DD');
    // },
  },
  methods: {
    ...mapActions(['pushMessage']),
    // 이미 존재하는 영화에 대해서 정보를 채워넣습니다.
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

      if (film.show_time) {
        this.input.show_time_minutes = Math.floor(film.show_time / 60);
        this.input.show_time_seconds = film.show_time % 60;
      }
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
    async addPerson() {
      this.film.people.push({
        role_type: null,
        name: '',
        name_en: '',
        role: '',
      });
    },
    async removePerson(index) {
      this.film.people.splice(index, 1);
    },
    async addCompany() {
      this.film.companies.push({
        name: '',
        name_en: '',
        role: '',
      });
    },
    async removeCompany(index) {
      this.film.companies.splice(index, 1);
    },
    async addReview() {
      this.film.reviews.push({
        title: '',
        url: '',
        source: '',
        author: '',
      });
    },
    async importReviewByLink() {},
    async removeReview(index) {
      this.film.reviews.splice(index, 1);
    },
    async importVideoByLink() {
      this.film.videos.push({
        youtube_id: '',
        title: '',
      });
    },
    async addPhoto() {
      this.film.photos.push({
        youtube_id: '',
        title: '',
      });
    },
    // 확인 버튼을 눌렀을 때.
    async confirm() {
      // 결과값을 한번 처리합니다.
      this.film.prod_date = new Date(this.film.prod_date);
      this.film.open_date = new Date(this.film.open_date);
      const minutes = this.input.show_time_minutes;
      const seconds = this.input.show_time_seconds;
      this.film.show_time = parseInt(minutes * 60 + seconds, 10);
      try {
        if (this.mode === 'new') {
          return this.confirmNew();
        }
        return this.confirmUpdate();
      } catch (e) {
        this.handleError(e);
      }
      return null;
    },
    async confirmNew() {
      const input = await this.buildInput();
      const result = await graphql(createFilmMutation, {
        input,
      });
      // console.log(result);
      this.pushMessage({
        type: 'success',
        msg: '영화가 성공적으로 생성되었습니다.',
        id: 'filmUpdateSuccess',
      });
    },
    async confirmUpdate() {
      const input = await this.buildInput();
      const result = await graphql(updateFilmMutation, {
        id: this.id,
        input,
      });
      // console.log(result);
      this.pushMessage({
        type: 'success',
        msg: '영화가 성공적으로 수정되었습니다.',
        id: 'filmUpdateSuccess',
      });
    },
    handleError() {
      this.pushMessage({
        type: 'error',
        msg: '에러가 발생했습니다.',
        id: 'filmUpdateFailed',
      });
    },
  },
};
</script>

<style></style>

<style lang="scss" scoped>
#edit-people,
#edit-companies,
#edit-reviews,
#edit-videos {
  margin-bottom: 30px;
}

button.close {
  padding: 0 10px;
}

span.after-input {
  margin-right: 30px;
  margin-left: 5px;
}

img.preview {
  width: 200px;
}
</style>
