<template>
  <div class="film-edit">
    <header class="p-3">
      <h1 class="form-h2">
        영화 편집
        <span class="header-suffix">
          <info class="ml-1 mr-3">
            최하단 <code>변경 사항을 적용합니다.</code> 버튼을 눌러야
            저장됩니다.
          </info>
          <b-button size="sm" @click="$bvModal.show('kobis-form-modal')">
            영진위로부터 가져오기 ...
          </b-button>
          <info class="ml-1">
            영화진흥위원회 데이터베이스로부터 정보를 가져옵니다. 영진위의 데이터
            자체가 일부 누락되어 있을 수도 있고, 정확하지 않을 수 있으므로
            추가적인 검수가 필요합니다.
          </info>
          <b-modal
            hide-footer
            size="xl"
            id="kobis-form-modal"
            title="영화 검색 및 선택"
          >
            <kobis-form @selected="importFilmSelected"></kobis-form>
          </b-modal>
        </span>
      </h1>
    </header>
    <b-form class="container-fluid" @submit.stop.prevent="confirm" v-if="show">
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
            description="영화진흥위원회에서 데이터를 불러올 때 자동으로 채워지는 코드입니다."
          >
            <b-form-input
              type="text"
              id="input-kobis_code"
              name="input-kobis_code"
              v-model="film.kobis_code"
              :disabled="true"
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
                class="input-flexitem-auto"
              ></b-form-input>
              <span class="after-input">분</span>
              <b-form-input
                v-model="input.show_time_seconds"
                type="number"
                number
                class="input-flexitem-auto"
              ></b-form-input>
              <span class="after-input">초</span>
            </div>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
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
            label="태그"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-tags"
          >
            <b-form-tags
              v-model="film.tags"
              id="input-tags"
              name="input-tags"
              :disabled="state.processing"
              placeholder="태그 입력 후 Enter"
              add-button-text="추가"
            >
            </b-form-tags>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            label="장르"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-genres"
          >
            <b-form-tags
              v-model="film.genres"
              id="input-genres"
              name="input-genres"
              :disabled="state.processing"
              placeholder="장르 입력 후 Enter"
              add-button-text="추가"
            >
            </b-form-tags>
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
              value-as-date
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
              value-as-date
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
              <b-form-radio :value="null">등급미심의</b-form-radio>
              <b-form-radio value="전체관람가">전체관람가</b-form-radio>
              <b-form-radio value="12세관람가">12세관람가</b-form-radio>
              <b-form-radio value="15세관람가">15세관람가</b-form-radio>
              <b-form-radio value="청소년관람불가">청소년관람불가</b-form-radio>
              <b-form-radio value="제한상영가">제한상영가</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <!----- form group start --->
          <b-form-group
            id="input-available_subtitles-group"
            label="지원 자막 (공동체상영용)"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-available_subtitles"
          >
            <b-form-checkbox-group
              v-model="film.available_subtitles"
              id="input-available_subtitles"
              name="input-available_subtitles"
              :disabled="state.processing"
            >
              <b-form-checkbox
                v-for="(value, index) in available_subtitles_list"
                :key="index"
                :value="value"
                >{{ value }}</b-form-checkbox
              >
            </b-form-checkbox-group>
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
            <common-editor v-model="film.synopsis" height="600"></common-editor>
            <!-- <b-form-textarea
              size="sm"
              id="input-synopsis"
              name="input-synopsis"
              v-model="film.synopsis"
              :disabled="state.processing"
              rows="6"
            ></b-form-textarea> -->
            <!-- <p v-html="film.synopsis.replaceAll('\n','<br>')">
               {{ film.synopsis }}
            </p> -->
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
            <common-editor v-model="film.note" height="600"></common-editor>
            <!-- <b-form-textarea
              size="sm"
              id="input-note"
              name="input-note"
              v-model="film.note"
              :disabled="state.processing"
              rows="6"
            ></b-form-textarea> -->
          </b-form-group>

          <h2>영화 리스트 보기 설정</h2>

          <!----- form group start --->
          <b-form-group
            id="input-view_settings-group"
            label="분류"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
          >
            <b-form-checkbox
              v-model="film.is_featured"
              :value="true"
              :unchecked-value="false"
              >영화 리스트의 상단 슬라이더에 노출시킵니다.</b-form-checkbox
            >
            <b-form-checkbox
              v-model="film.is_opened"
              :value="true"
              :unchecked-value="false"
              >개봉한 영화입니다. (필터 적용시 작동)</b-form-checkbox
            >
          </b-form-group>
          <b-form-group
            label="뱃지 텍스트"
            description="영화 목록 페이지에서 포스터 왼쪽 상단에 보이는 텍스트 설정. (예: 개봉예정)"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-badge_text"
          >
            <b-form-input
              type="text"
              size="sm"
              id="input-badge_text"
              name="input-badge_text"
              v-model="film.badge_text"
              :disabled="state.processing"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="뱃지 색상"
            description="뱃지의 색깔"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-badge_color"
          >
            <ColorPicker
              id="input-badge_color"
              v-model="input.badge_color"
            ></ColorPicker>
          </b-form-group>
          <b-form-group
            label="상단 노출 스틸컷"
            description="영화 리스트에서 상단에 노출되었을 때 배경 스틸컷을 설정합니다"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-featured_steel"
          >
            <b-button
              size="sm"
              @click="$bvModal.show('set-featured-steel-modal')"
              variant="outline-secondary"
            >
              설정
            </b-button>
            <div class="preview-wrapper">
              <b-img class="preview" :src="film.featured_steel"></b-img>
            </div>
            <b-modal size="xl" hide-footer id="set-featured-steel-modal">
              <file-manager
                @file-manager-selected="setFeaturedSteel"
                :modalId="'set-featured-steel-modal'"
                :selectOnlyOne="true"
              ></file-manager>
            </b-modal>
          </b-form-group>
          <b-form-group
            label="상단 노출 시놉시스"
            description="영화 리스트에서 상단에 노출되었을 때 시놉시스를 설정합니다"
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-featured_synopsis"
          >
            <b-form-textarea
              type="text"
              size="sm"
              id="input-featured_synopsis"
              name="input-featured_synopsis"
              v-model="film.featured_synopsis"
              :disabled="state.processing"
              rows="5"
            ></b-form-textarea>
          </b-form-group>
          <b-form-group
            label="상단 노출 배경 색상"
            description="영화 리스트에서 상단에 노출되었을 때 옅게 깔리는 색깔을 정합니다."
            label-cols-md="3"
            label-align-md="left"
            label-size="md"
            label-for="input-featured_color"
          >
            <ColorPicker
              id="input-featured_color"
              v-model="input.featured_color"
            ></ColorPicker>
          </b-form-group>

          <!-- 마지막! -->
          <!-- <b-form-group id="input-email-group" label="이메일 주소" label-for="input-email">
            <b-form-input type="text" v-model="film.title"></b-form-input>
          </b-form-group> -->
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
              배우/제작진
              <b-button
                size="sm"
                @click="addPerson"
                variant="outline-secondary"
              >
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
                <th></th>
              </tr>

              <tr v-for="(person, index) in film.people" :key="index">
                <td>
                  <b-form-select size="sm" v-model="person.role_type">
                    <b-form-select-option value="director"
                      >감독</b-form-select-option
                    >
                    <b-form-select-option value="actor"
                      >배우</b-form-select-option
                    >
                    <b-form-select-option value="staff"
                      >스태프</b-form-select-option
                    >
                  </b-form-select>
                </td>
                <td>
                  <b-form-input size="sm" v-model="person.name"></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="person.name_en"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input size="sm" v-model="person.role"></b-form-input>
                </td>
                <td>
                  <b-button-close @click="removePerson(index)"></b-button-close>
                </td>
              </tr>
            </table>
          </div>
          <!-- 수상내역
    role_type: { type: String, enum: enumPeopleRoleType.raw_str_list },
    name: String,
    name_en: String,
    role: String,
          -->
          <div id="edit-awards">
            <h2>
              수상내역
              <b-button size="sm" @click="addAward" variant="outline-secondary">
                새로 추가
              </b-button>
            </h2>
            <!-- festival_name: '제 8회 무주산골영화제',
        //     year: 2020,
        //     person_name: '오정석',
        //     award_name: '영화 창(窓)',
        //     award_type: '후보', -->
            <table class="w-100">
              <tr>
                <th>연도</th>
                <th>행사(영화제) 이름</th>
                <th>수상자 이름</th>
                <th>수상 부문</th>
                <th>수상 결과</th>
                <th></th>
              </tr>

              <tr v-for="(award, index) in film.awards" :key="index">
                <td>
                  <b-form-input
                    size="sm"
                    type="number"
                    v-model="award.year"
                    number
                  >
                  </b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="award.festival_name"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="award.person_name"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="award.award_name"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="award.award_type"
                  ></b-form-input>
                </td>
                <td>
                  <b-button-close @click="removeAward(index)"></b-button-close>
                </td>
              </tr>
            </table>
          </div>
          <!-- 회사들 -->
          <div id="edit-companies">
            <h2>
              영화사
              <b-button
                size="sm"
                @click="addCompany"
                variant="outline-secondary"
              >
                새로 추가
              </b-button>
            </h2>
            <table class="w-100">
              <tr>
                <th>이름</th>
                <th>영어 이름</th>
                <th>역할</th>
                <th></th>
              </tr>

              <tr v-for="(company, index) in film.companies" :key="index">
                <td>
                  <b-form-input size="sm" v-model="company.name"></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="company.name_en"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input size="sm" v-model="company.role"></b-form-input>
                </td>
                <td>
                  <b-button-close
                    @click="removeCompany(index)"
                  ></b-button-close>
                </td>
              </tr>
            </table>
          </div>
          <!-- 메인 포스터 -->
          <div id="edit-poster">
            <h2>
              메인 포스터

              <b-button
                size="sm"
                @click="$bvModal.show('set-poster-modal')"
                variant="outline-secondary"
              >
                설정
              </b-button>
            </h2>
            <div class="main-poster-wrapper">
              <b-img class="main-poster" :src="film.poster_url"></b-img>
            </div>
            <!-- <p>
              {{ film.poster }}
            </p> -->

            <b-modal size="xl" hide-footer id="set-poster-modal">
              <file-manager
                @file-manager-selected="setPoster"
                :modalId="'set-poster-modal'"
                :selectOnlyOne="true"
              ></file-manager>
            </b-modal>
          </div>
          <!-- 포토 및 사진 -->
          <div id="edit-photos">
            <h2>
              포토
              <b-button
                size="sm"
                @click="$bvModal.show('add-photo-modal')"
                variant="outline-secondary"
              >
                새로 추가
              </b-button>
            </h2>
            <b-modal size="xl" hide-footer id="add-photo-modal">
              <file-manager
                @file-manager-selected="addPhoto"
                :modalId="'add-photo-modal'"
              ></file-manager>
            </b-modal>
            <table class="w-100">
              <tr>
                <th>미리보기</th>
                <th>제목</th>
                <th>대체텍스트 <small>(접근성 필수)</small></th>
                <th></th>
              </tr>

              <tr v-for="(photo, index) in film.photos" :key="index">
                <td class="text-center">
                  <img class="photo-preview" :src="photo.preview_url" alt="" />
                </td>
                <td>
                  <b-form-input size="sm" v-model="photo.title"></b-form-input>
                </td>
                <td>
                  <b-form-input size="sm" v-model="photo.alt"></b-form-input>
                </td>
                <td>
                  <b-button-close @click="removePhoto(index)"></b-button-close>
                </td>
              </tr>
            </table>
          </div>
          <!-- 비디오들 -->
          <div id="edit-videos">
            <h2>
              비디오
              <b-button size="sm" @click="addVideo" variant="outline-secondary">
                새로 추가
              </b-button>
            </h2>
            <p>
              메인 예고편은 <code>메인 에고편 여부</code>에 체크하세요. (영화
              상세 페이지에서 우선 노출)
            </p>
            <table class="w-100">
              <tr>
                <th>
                  메인<br />예고편<br />
                  여부
                </th>
                <th>제목</th>
                <th>Youtube 소스코드</th>
                <th></th>
              </tr>

              <tr v-for="(video, index) in film.videos" :key="index">
                <td>
                  <b-form-checkbox
                    v-model="video.is_main_trailer"
                  ></b-form-checkbox>
                </td>
                <td>
                  <b-form-input size="sm" v-model="video.title"></b-form-input>
                </td>
                <td>
                  <b-form-textarea
                    size="sm"
                    v-model="video.youtube_iframe"
                  ></b-form-textarea>
                </td>
                <td>
                  <b-button-close @click="removeVideo(index)"></b-button-close>
                </td>
              </tr>
            </table>
          </div>
          <!-- 리뷰들 -->
          <div id="edit-reviews">
            <h2>
              리뷰
              <b-button
                size="sm"
                @click="addReview"
                variant="outline-secondary"
              >
                새로 추가
              </b-button>
              <!-- <b-button size="sm" @click="importReviewByLink">
                링크로 가져오기
              </b-button> -->
            </h2>
            <table class="w-100">
              <tr>
                <th>제목</th>
                <th>url (링크)</th>
                <th>출처</th>
                <th>글쓴이</th>
                <th></th>
              </tr>

              <tr v-for="(review, index) in film.reviews" :key="index">
                <td>
                  <b-form-input size="sm" v-model="review.title"></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="review.url"
                    type="url"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="review.source"
                  ></b-form-input>
                </td>
                <td>
                  <b-form-input
                    size="sm"
                    v-model="review.author"
                  ></b-form-input>
                </td>
                <td>
                  <b-button-close @click="removeReview(index)"></b-button-close>
                </td>
              </tr>
            </table>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <div class="d-flex align-items-center">
          <b-button type="submit" variant="primary"
            >변경 사항을 적용합니다.</b-button
          >
          <b-form-checkbox
            class="ml-4"
            v-model="film.status"
            value="public"
            unchecked-value="private"
            >공개합니다.</b-form-checkbox
          >
        </div>
      </b-row>
    </b-form>
    <!-- <p>모드: {{ mode }}</p>
    <div>{{ film }}</div>
    <div>{{ input }}</div> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Chrome } from 'vue-color';
import {
  BButton,
  BFormCheckbox,
  BFormCheckboxGroup,
  BFormInput,
  BFormGroup,
  BButtonClose,
  BRow,
  BCol,
  BFormRadio,
  BFormRadioGroup,
  BFormTags,
  BFormDatepicker,
  BFormTextarea,
  BModal,
  BFormSelect,
  BFormSelectOption,
  BImg,
  BForm,
} from 'bootstrap-vue';
// import moment from 'moment';
import {
  graphql,
  filmQuery,
  updateFilmMutation,
  createFilmMutation,
  makeSimpleQuery,
} from '@/api/graphql-client';
import FileManager from '@/components/FileManager.vue';
import Info from '@/components/admin/Info.vue';

export default {
  name: 'FilmEdit',
  components: {
    BFormCheckboxGroup,
    BFormSelect,
    BFormSelectOption,
    BImg,
    BForm,
    ColorPicker: Chrome,
    FileManager,
    BButton,
    BFormCheckbox,
    BFormInput,
    BFormGroup,
    BButtonClose,
    BRow,
    BCol,
    BFormRadio,
    BFormRadioGroup,
    BFormTags,
    BFormDatepicker,
    BFormTextarea,
    BModal,
    KobisForm: () => import('@/components/admin/KobisForm'),
    CommonEditor: () => import('@/components/admin/CommonEditor'),
    Info,
  },
  props: ['mode'],

  data() {
    return {
      available_subtitles_list: [],
      show: true,
      state: {
        processing: false,
      },
      input: {
        show_time_minutes: 0,
        show_time_seconds: 0,
        featured_color: {},
        badge_color: {},
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
        awards: [],
        companies: [], // company
        watch_grade: null,
        reviews: [], // review
        star_naver: null,
        star_daum: null,
        star_cine21: null,
        poster: null, // File에 대한 id
        poster_url: '',
        poster_alt: '',
        photos: [], // File에 대한 ObjectId의 배열
        videos: [], // video
        synopsis: '',
        note: '',
        tags: [],
        is_featured: false,
        is_opened: false,
        featured_steel: '',
        featured_color: {},
        featured_synopsis: '',
        badge_text: '',
        badge_color: {},
        available_subtitles: [],
        status: 'public',
        meta: {}, // Mixed
      },
    };
  },

  computed: {
    /** @returns {array} */
    photosView() {
      return [
        {
          // eslint-disable-next-line global-require
          // src: require('@/@/cinesopa/src/assets/test/test-poster.jpg'),
          src: '',
          title: '여름날 포스터',
        },
      ];
    },
    /** @returns {number} */
    id() {
      const { id } = this.$route.params;
      if (id) return parseInt(id, 10);
      return null;
    },
    // openDateFormatted() {
    //   return moment(this.film.open_date).format('yyyy-MM-DD');
    // },
  },

  async mounted() {
    makeSimpleQuery('availableSubtitle')().then((result) => {
      this.available_subtitles_list = result;
    });
    if (typeof this.id === 'number') {
    // if (this.mode !== 'new') {
      await this.initExist(this.id);
    }
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
      // console.log(this.film);
      // this.film = Object.assign(this.film, film);
      Object.keys(this.film).forEach((key) => {
        // console.log(`key: ${key}`);
        if (film[key] !== undefined && film[key] !== null) {
          this.film[key] = film[key];
        }
        // this.film[key] = film[key] !== undefined ? film[key];
        // this.film[key] = film[key] ? film[key] : this.film[key];
      });
      await this.adaptToInput(film);
    },

    // 정보들을 input에 맞게 가공합니다.
    async adaptToInput(film) {
      if (film.show_time) {
        this.input.show_time_minutes = Math.floor(film.show_time / 60);
        this.input.show_time_seconds = film.show_time % 60;
      }
      // 상단 슬라이더 노출 시 배경 컬러
      if (film.featured_color) {
        this.input.featured_color = { hex: film.featured_color };
      }
      // 뱃지 컬러
      if (film.badge_color) {
        this.input.badge_color = { hex: film.badge_color };
      }

      // 태그 목록 설정
      if (this.film.tags) {
        this.film.tags = this.film.tags.map((tag) => tag?.name ?? '');
      }
    },
    // async importFrom(event, a, b, c) {
    //   console.log('# FilmEdit importFrom');
    //   console.log(event);
    //   console.log(a);
    //   console.log(b);
    //   console.log(c);
    //   // TODO
    // },
    // 영진위로부터 가져오는 영화가 선택되었을 때.
    /*
    actors: Array(47) [ {…}, {…}, {…}, … ]
      cast: "면정학"
      castEn: ""
      peopleNm: "김윤석"
      peopleNmEn: "KIM Yun-seok"
    audits: Array [ {…} ] { auditNo: "2010-F511 ", watchGradeNm: "청소년관람불가" }
    companys: Array(10) [ {…}, {…}, {…}, … ]
      companyCd: "20100103"
      companyNm: "(주)쇼박스"
      companyNmEn: "Showbox Corp"
      companyPartNm: "배급사"
    directors: Array [ {…} ] { peopleNm: "나홍진", peopleNmEn: "NA Hong-jin" }
    genres: Array(3) [ {…}, {…}, {…} ] { genreNm: "스릴러" }
    movieCd: "20101222"
    movieNm: "황해"
    movieNmEn: "The Yellow Sea"
    movieNmOg: ""
    nations: Array(3) [ {…}, {…}, {…} ]
    openDt: "20101222"
    prdtStatNm: "개봉"
    prdtYear: "2010"
    showTm: "156"
    showTypes: Array [ {…}, {…} ]
    staffs: Array(467) [ {…}, {…}, {…}, … ]
      peopleNm: "유정훈",
      peopleNmEn: "YOU Jeong-hun",
      staffRoleNm: "투자"
    typeNm: "장편" */
    async importFilmSelected(info) {
      // console.log('# FilmEdit importFilmSelected');
      // console.log(info);
      this.$bvModal.hide('kobis-form-modal');
      this.film.kobis_code = info.movieCd;
      this.film.title = info.movieNm;
      this.film.title_en = info.movieNmEn;
      this.film.genres = info.genres.map(({ genreNm }) => genreNm);
      this.film.watch_grade = info.audits?.[0]?.watchGradeNm ?? null;
      this.input.show_time_minutes = parseInt(info.showTm, 10);
      this.input.show_time_seconds = 0;
      this.film.people = [];
      this.film.people.push(
        ...info.directors.map((director) => ({
          role_type: 'director',
          name: director.peopleNm,
          name_en: director.peopleNmEn,
        })),
      );
      this.film.people.push(
        ...info.actors.map(({ cast, peopleNm, peopleNmEn }) => ({
          role_type: 'actor',
          name: peopleNm,
          name_en: peopleNmEn,
          role: cast,
        })),
      );
      this.film.people.push(
        ...info.staffs.map(({ peopleNm, peopleNmEn, staffRoleNm }) => ({
          role_type: 'staff',
          name: peopleNm,
          name_en: peopleNmEn,
          role: staffRoleNm,
        })),
      );
      this.film.companies = [];
      this.film.companies.push(
        ...info.companys.map(({ companyNm, companyNmEn, companyPartNm }) => ({
          name: companyNm,
          name_en: companyNmEn,
          role: companyPartNm,
        })),
      );
      if (info.openDt) {
        this.film.is_opened = true;
        this.film.open_date = new Date(
          parseInt(info.openDt.slice(0, 4), 10),
          parseInt(info.openDt.slice(4, 6), 10) - 1,
          parseInt(info.openDt.slice(6, 8), 10),
        );
      }
    },
    async buildInput() {
      const input = {};
      Object.keys(this.film).forEach((key) => {
        if (this.film[key] !== null) input[key] = this.film[key];
      });
      // console.log(input);
      return input;
    },
    async addPerson() {
      this.film.people.push({
        role_type: 'staff',
        name: '',
        name_en: '',
        role: '',
      });
    },
    async removePerson(index) {
      this.film.people.splice(index, 1);
    },
    // 수상내역
    async addAward() {
      this.film.awards.push({
        year: 2020,
        festival_name: '',
        person_name: '',
        award_name: '',
        award_type: '',
      });
    },
    async removeAward(index) {
      this.film.awards.splice(index, 1);
    },
    // 회사
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
    async removePhoto(index) {
      this.film.photos.splice(index, 1);
    },
    async removeVideo(index) {
      this.film.videos.splice(index, 1);
    },
    // 리뷰
    async addReview() {
      this.film.reviews.push({
        title: '',
        url: '',
        source: '',
        author: '',
      });
    },
    async importReviewByLink() {
      // todo
    },
    async removeReview(index) {
      this.film.reviews.splice(index, 1);
    },
    async addVideo() {
      this.film.videos.push({
        youtube_iframe: '',
        is_main_trailer: false,
        title: '',
      });
    },
    async addPhoto(files) {
      files.forEach((image) => {
        this.film.photos.push({
          // eslint-disable-next-line no-underscore-dangle
          mongo_file_id: image._id,
          filename: image.filename,
          preview_url: image.fileurl,
          alt: image.alt,
          title: image.label,
        });
      });
    },
    async setPoster(files) {
      const poster = files[0];
      // console.log(files[0]);
      this.film.poster_url = poster.fileurl;
      this.film.poster_alt = poster.alt;
      // eslint-disable-next-line no-underscore-dangle
      this.film.poster = poster._id;
      // this.film.poster = files[0]
    },
    async setFeaturedSteel(files) {
      const steel = files[0];
      this.film.featured_steel = steel.fileurl;
    },
    // 결과값을 한번 처리합니다.
    async refineInputValues() {
      // if(this.film.prod_date) {

      // }
      // this.film.prod_date = new Date(this.film.prod_date);
      // this.film.open_date = new Date(this.film.open_date);
      const minutes = this.input.show_time_minutes;
      const seconds = this.input.show_time_seconds;
      this.film.show_time = parseInt(minutes * 60 + seconds, 10);

      // 컬러 설정
      this.film.badge_color = this.input.badge_color?.hex;
      this.film.featured_color = this.input.featured_color?.hex;
    },

    // 확인 버튼을 눌렀을 때.
    async confirm() {
      await this.refineInputValues();
      try {
        if (typeof this.id !== 'number') {
        // if (this.mode === 'new') {
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
      // console.log(result);
      const { id } = result.data.createFilm;
      this.$router.push({ name: 'FilmEdit', params: { id } });
      // this.mode = null;
    },
    async confirmUpdate() {
      const input = await this.buildInput();
      /* const result = */ await graphql(updateFilmMutation, {
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

<style lang="scss" scoped>
.header-suffix {
  font-size: 16px;
  font-weight: normal;
}

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

.photo-preview {
  max-height: 100px;
  max-width: 200px;
}

h2 {
  font-size: 22px;
  font-weight: bold;
  margin-top: 80px;
}

.main-poster-wrapper {
  height: 300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-poster {
  max-width: 100%;
  max-height: 100%;
}

.preview-wrapper {
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview {
  max-width: 100%;
  max-height: 100%;
}

.input-flexitem-auto {
  width: 0;
  flex: 1 1 auto;
}
</style>

<style lang="scss">
.film-edit .b-form-tags-button {
  flex: 0 0 auto;
}
</style>
