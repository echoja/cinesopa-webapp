<template>
  <div class="file-manager">
    <!-- <b-button @click="$bvModal.hide(modalId)">닫아줘!</b-button> -->
    <h2>파일매니저</h2>
    <hr />
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- <b-button size="sm">모두 선택</b-button> -->
        <b-button size="sm" :disabled="selectedFiles.length === 0" @click="cancelSelected"
          >선택 취소
        </b-button>
        <b-button
          size="sm"
          :disabled="selectedFiles.length === 0"
          variant="danger"
          @click="$bvModal.show('confirm-remove')"
        >
          선택 삭제
        </b-button>
        <b-modal
          ok-title="네, 삭제합니다."
          cancel-title="아니오"
          title="삭제 확인"
          ok-variant="danger"
          id="confirm-remove"
          @ok="removeSelected"
          >{{ selectedFiles.length }} 개의 파일을 정말로 삭제하시겠습니까? 이 파일들을 삭제하면
          복구할 수 없으며, 삽입된 페이지/게시물 내에서도 모두 찾을 수 없게 됩니다.</b-modal
        >
        <b-form-file
          class="d-inline-block w-auto"
          v-model="uploadingFile"
          :disabled="uploadingFile.length !== 0"
          @input="onFileInput"
          ref="fileUpload"
          multiple
          browse-text="업로드"
          placeholder="클릭하여 파일/이미지 업로드"
          variant="primary"
          >파일 새롭게 업로드</b-form-file
        >
      </div>
      <div class="toolbar-right">
        <b-button
          v-if="selectable"
          :disabled="selectedFiles.length === 0"
          variant="primary"
          @click="onSelect"
        >
          {{ selectMessage }}
        </b-button>
        <!-- <b-button size="sm" variant="primary">새로 추가</b-button> -->
      </div>
    </div>
    <hr />
    <div class="main row">
      <div class="col-8 main-list" @click.self="mainListClicked">
        <!-- <div>{{ files }}</div> -->
        <div class="file-items">
          <div class="file-item" v-if="files.length === 0">업로드된 파일이 없습니다.</div>
          <div
            :class="{ detailed: file.detailed }"
            class="file-item"
            v-for="(file, index) in files"
            :key="index"
          >
            <!-- <b-link
              :class="{ detailed: file.detailed }"
              class="d-block w-100 h-100"
            > -->
            <div
              class="preview-wrapper d-flex w-100 h-100 align-items-center justify-content-center"
              @click="setDetail(index)"
            >
              <b-img
                class="preview"
                v-if="file.mimetype.startsWith('image')"
                :src="`/upload/${file.filename}`"
              ></b-img>
              <div v-else>
                {{ file.origin }}
              </div>
            </div>
            <div class="item-checkbox">
              <b-form-checkbox
                size="lg"
                v-bind:checked="file.selected"
                @change="itemChecked(index, $event)"
              ></b-form-checkbox>
            </div>
            <!-- </b-link> -->
          </div>
        </div>
      </div>
      <div class="col-4 main-detail">
        <b-form @submit.prevent.stop="updateDetail" @change="detailFormChanged = true">
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="업로드 날짜"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-c_date"
          >
            <p id="detail-c_date" class="form-sticky">{{ prettyCDate }}</p>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="원본 파일 이름"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-origin"
            description="최초 업로드할 때의 파일 이름입니다."
          >
            <p id="detail-origin" class="form-sticky">{{ detailForm.origin }}</p>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="파일 타입 (mimetype)"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-mimetype"
          >
            <p id="detail-mimetype" class="form-sticky">{{ detailForm.mimetype }}</p>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="파일 용량"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-size"
          >
            <p id="detail-size" class="form-sticky">{{ prettySize }}</p>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            v-if="detailForm.width"
            class="main-detail-row"
            label="이미지 크기"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-size"
          >
            <p id="detail-size" class="form-sticky">
              {{ detailForm.width }} px &times; {{ detailForm.height }} px
            </p>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="파일 이름"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-label"
            description="유저들에게 보여질 이름"
          >
            <b-form-input v-model="detailForm.label" id="detail-label" type="text"></b-form-input>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="대체텍스트"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-alt"
            description="이미지/파일이 로딩되지 않거나 했을 시 나타나는 이름. 접근성을 위해 cinesopa.kr 는 필수로 작성해야 합니다."
          >
            <b-form-input v-model="detailForm.alt" id="detail-alt" type="text"></b-form-input>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="설명"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-description"
            description="부가 설명입니다. 관리용 외에는 사용되지 않습니다."
          >
            <b-form-textarea
              v-model="detailForm.description"
              id="detail-description"
              size="sm"
            ></b-form-textarea>
          </b-form-group>
          <!--------------- b-form-broup start ----------------->
          <b-form-group
            class="main-detail-row"
            label="공개 여부"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="detail-public"
            description="파일/이미지가 외부에 공개되어 있는지 여부입니다. 공개되어 있다면 링크를 통해 파일을 다운받거나 이미지를 볼 수 있습니다."
          >
            <b-form-radio-group v-model="detailForm.public" id="detail-public" type="text">
              <b-form-radio :value="true">공개</b-form-radio>
              <b-form-radio :value="false">비공개</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <!--------------- b-form-broup ends ----------------->
          <b-button type="submit" size="sm" :disabled="!detailFormChanged"
            >파일 세부정보 변경사항 적용
          </b-button>
        </b-form>
        <div></div>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col">
        <b-pagination
          v-model="currentPage"
          :total-rows="total"
          :per-page="20"
          aria-controls="my-table"
          align="center"
          @change="pageChanged"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import prettyBytes from 'pretty-bytes';
import moment from 'moment';
import { mapActions } from 'vuex';
// import // filesQuery,
// // // eslint-disable-next-line no-unused-vars
// // fileQuery,
// // updateFileMutation,
// // removeFileMutation,
// '../api/graphql-client';
import { queryString, graphql } from '../loader';
import upload from '../upload-client';

const detailFormInitValue = () => ({
  filename: null,
  c_date: null,
  mimetype: '-',
  origin: '-',
  description: '',
  label: ' ',
  alt: '',
  size: 0,
  public: null,
  width: null,
  height: null,
});
const makeDetailForm = (file) => ({
  ...file,
});

export default {
  name: 'FileManager',
  props: {
    modalId: String,
    selectMessage: {
      type: String,
      default: '삽입',
    },
    selectable: {
      type: Boolean,
      default: true,
    },
    selectOnlyOne: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detailedIndex: null,
      detailFormChanged: false,
      totalPage: 1,
      total: 100,
      currentPage: 1,
      files: [],
      uploadingFile: [],
      detailForm: detailFormInitValue(),
    };
  },
  computed: {
    prettySize() {
      return prettyBytes(this.detailForm.size);
    },
    prettyCDate() {
      // eslint-disable-next-line camelcase
      const { c_date } = this.detailForm;
      // console.log(c_date);
      const d = moment(c_date);
      // console.log(d);
      // eslint-disable-next-line camelcase
      if (c_date) return moment(c_date).format('YYYY.MM.DD a HH:mm:ss');
      return null;
    },
    selectedFiles() {
      return this.files.filter((file) => file.selected);
    },
    detailedFile() {
      return this.files[this.detailedIndex];
    },
  },
  mounted() {
    this.fetchFiles();
  },
  methods: {
    ...mapActions(['pushMessage']),
    mainListClicked() {
      // console.log('ho!');
      this.cancelDetail();
    },
    onFileInput() {
      if (this.uploadingFile.length === 0) return;

      console.log(`OnFileInput!!! ${this.uploadingFile}`);
      const promises = [];
      // console.dir(this.uploadingFile[0]);
      this.uploadingFile.forEach((file) => {
        promises.push(upload(file, file.name));
      });
      Promise.allSettled(promises)
        .then((results) => {
          this.fetchFiles();
          this.pushMessage({
            type: 'success',
            msg: `${results.length} 개의 파일이 성공적으로 업로드 되었습니다.`,
            id: 'fileUploadSuccess',
          });
          this.uploadingFile = [];
        })
        .catch((err) => {
          console.log(err);
          this.pushMessage({
            type: 'danger',
            msg: `파일을 업로드하는 도중 에러가 발생했습니다. >> ${err}`,
            id: 'fileUploadFail',
          });
        });
    },
    updateDetail() {
      graphql(queryString.file.updateFileMutation, {
        filename: this.detailForm.filename,
        input: {
          description: this.detailForm.description,
          label: this.detailForm.label,
          alt: this.detailForm.alt,
          public: this.detailForm.public,
        },
      })
        .then((/* result */) => {
          this.fetchFiles();
          this.pushMessage({
            type: 'success',
            msg: `파일 ${this.detailForm.label}의 정보가 성공적으로 업데이트 되었습니다.`,
            id: 'fileUpdateSuccess',
          });
          this.cancelDetail();
        })
        .catch((err) => {
          console.log(err);
          this.pushMessage({
            type: 'danger',
            msg: `파일을 업데이트하는 도중 에러가 발생했습니다. >> ${err}`,
            id: 'fileUpdateFail',
          });
        });
    },
    async fetchFiles(page) {
      if (page) this.currentPage = page;
      const result = await graphql(queryString.file.filesQuery, {
        page: this.currentPage - 1,
      });
      this.files = result.data.files;
      // console.log(this.files);
      // todo
      // const getTotal = await graphql(filesQuery, {

      // });
    },
    cancelSelected() {
      this.selectedFiles.forEach((file) => {
        // eslint-disable-next-line no-param-reassign
        if (file.selected) file.selected = false;
      });
    },
    removeSelected() {
      const promises = [];
      this.selectedFiles.forEach((file) => {
        promises.push(
          graphql(queryString.file.removeFileMutation, {
            filename: file.filename,
          }),
        );
      });
      Promise.allSettled(promises)
        .then((results) => {
          this.pushMessage({
            type: 'success',
            msg: `${results.length} 개의 파일이 성공적으로 삭제되었습니다.`,
            id: 'fileRemoveSuccess',
          });
          this.cancelDetail();
          this.cancelSelected();
        })
        .catch((err) => {
          console.error(err);
          this.pushMessage({
            type: 'danger',
            msg: `파일을 업로드하는 도중 에러가 발생했습니다. >> ${err}`,
            id: 'fileRemoveFail',
          });
        })
        .finally(() => {
          this.fetchFiles();
        });
    },
    cancelDetail() {
      if (this.detailedIndex !== null) {
        // console.log(this.detailedIndex);
        this.files[this.detailedIndex].detailed = false;
      }
      this.detailedIndex = null;
      this.detailForm = detailFormInitValue();
      this.detailFormChanged = false;
    },
    setDetail(index) {
      // console.log(index);
      // console.log(this.detailedIndex);
      const oldIndex = this.detailedIndex;
      this.cancelDetail();
      if (oldIndex === index) return;

      this.files[index].detailed = true;
      this.detailedIndex = index;
      this.detailForm = makeDetailForm(this.files[index]);
      this.detailFormChanged = false;
    },
    pageChanged(page) {
      this.fetchFiles(page);
    },

    onSelect() {
      this.$emit('file-manager-selected', this.selectedFiles);
      this.$bvModal.hide(this.modalId);
    },
    itemChecked(index, value) {
      if (this.selectOnlyOne) {
        console.log(`ho index:${index}`);
        this.files = this.files.map((file, mapIndex) => {
          const newFile = { ...file };
          newFile.selected = false;
          if (mapIndex === index) {
            newFile.selected = true;
          } else {
            newFile.selected = false;
          }
          return newFile;
        });

        // this.files.forEach((file, forIndex) => {
        //   if (forIndex === index) {
        //     // eslint-disable-next-line no-param-reassign
        //     file.selected = true;
        //   } else {
        //     // eslint-disable-next-line no-param-reassign
        //     file.selected = false;
        //   }
        // });
      } else {
        // console.log(value);
        const newFiles = [...this.files];
        newFiles[index].selected = value;
        this.files = newFiles;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  font-size: 20px;
  font-weight: 700;
}
.file-manager {
  border: 1px solid #ddd;
  padding: 15px;
}

.file-manager hr {
  margin-left: -15px;
  margin-right: -15px;
}

.file-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.file-item {
  padding: 3px;
  width: 200px;
  height: 200px;
  border: 2px solid #ddd;
  margin-left: -2px;
  margin-top: -2px;
  position: relative;
  transition: 0.5s;
  background-color: #fff;
}

.detailed {
  border: 2px solid rgb(0, 0, 0);
  // transform: scale(1.00);
  z-index: 1;
}

.preview-wrapper {
  cursor: pointer;
  overflow: hidden;
}

.preview-wrapper:hover {
  background-color: #eee;
}

.preview {
  width: 100%;
}

.item-checkbox {
  position: absolute;
  left: 10px;
  top: 10px;
}

.main-detail {
  border-left: 1px solid #ddd;
}

.toolbar {
  display: flex;
  justify-content: space-between;
}

.form-sticky {
  margin-bottom: 0;
  margin-top: 7px;
}

button {
  margin: 0 5px;
}
</style>

<style></style>
