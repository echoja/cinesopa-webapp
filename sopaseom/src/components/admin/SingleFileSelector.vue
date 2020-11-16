
<!---

file-selected 이벤트. 파일 하나가 전달됨.

-->
<template>
  <div class="single-file-selector">
    <div class="already-selected">
      <span class="bold">선택된 파일: {{ fileLabel }}</span>
    </div>
    <div class="preview" v-if="canPreview">
      <div
        class="preview-image-wrapper"
        :style="{ 'background-image': `url('${file.fileurl}')` }"
      >
        <!-- <b-img class="preview-image" :src="file.fileurl"></b-img> -->
      </div>
      <p>미리보기(이미지)</p>
    </div>
    <div class="modal-wrapper">
      <b-button size="sm" @click="$bvModal.show(id)">파일 선택 ...</b-button>
      <b-modal size="xl" hide-footer hide-header :id="id">
        <file-manager
          @file-manager-selected="singleFileSelected"
          :modal-id="id"
        >
        </file-manager>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { graphql, getFileInfoQuery } from '@/api/graphql-client';

import { BImg, BModal, BButton } from 'bootstrap-vue';
// blog 같은 종류의 컴포넌트간 uuid 를 구현하는 방법 방법
let uuid = 0;

export default {
  components: {
    BModal,
    BImg,
    BButton,
    FileManager: () => import('@/components/FileManager'),
  },
  props: {
    initFilename: String,
    initObj: Object,
  },

  data() {
    return {
      uuid: '',
      file: null,
    };
  },
  computed: {
    // todo
    canPreview() {
      const mimetype = this.file?.mimetype;
      return typeof mimetype === 'string' && mimetype.startsWith('image');
    },
    id() {
      return `single-file-selector-${this.uuid}`;
    },
    fileLabel() {
      if (this.file) {
        return this.file.label;
      }
      return '없음';
    },
  },
  beforeCreate() {},
  
  async mounted() {
    // uuid 불러오기
    this.uuid = uuid.toString();
    uuid += 1;

    // initFilename props 로 받아온 파일을 기반으로 초기화하기.
    const res = await graphql(getFileInfoQuery, {
      filename: this.initFilename,
    });
    const { file } = res.data;
    if (file) {
      this.file = file;
    }

    this.file = res.data.file;
  },
  methods: {
    singleFileSelected(files) {
      console.log(files);
      const file = files[0];
      this.file = file;
      this.$emit('file-selected', file);
    },
  },
};
</script>

<style lang="scss" scoped>
.preview {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  p {
    margin: 0;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
}
.preview-image-wrapper {
  width: 100%;
  height: 0;
  max-width: 200px;
  padding-bottom: min(100%, 200px);
  background-position: center;
  background-size: cover;

  // display: flex;
  // align-items: center;
}
// .preview-image {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// }
</style>

<style>
</style>