<template>
  <div>
    <div class="toolbar">
      <b-button
        @click="$bvModal.show(modalId)"
        class="border-secondary mr-2"
        size="sm"
        >파일/이미지 삽입</b-button
      >
      <b-modal
        hide-footer
        hide-header
        :id="modalId"
        size="fw"
        class="w-100 hello world"
      >
        <file-manager
          @file-manager-selected="fileSelected"
          :modalId="modalId"
          :selectOnlyOne="false"
        ></file-manager>
      </b-modal>
      <info>
        파일/이미지를 삽입하기 위해 파일 매니저를 엽니다. (에디터 내부의 삽입 >
        이미지는 url를 이용하여 외부 이미지를 가지고 오는 것이기 때문에 업로드가
        되지 않습니다.)
      </info>
      <!-- <b-button @click="test1">테스트</b-button> -->
    </div>
    <div
      v-if="!state.editorLoaded"
      class="h-25 d-flex p-2 justify-content-center align-items-center"
    >
      <b-spinner variant="secondary" small class="m-2 small"></b-spinner>
      <p class="m-0">에디터 로딩중입니다.</p>
    </div>
    <!-- v-model="value" -->
    <!-- v-model="content" -->
    <editor
      api-key="gt5higoqzglgrwcu9r7cdbmj408cva4csd4aj2y6qvcr5i5r"
      :init="editorInit"
      :value="value"
      @onInit="onEditorInit"
      @input="onInput"
    >
    </editor>
    <!-- <div>commonEditor value >> {{ value }}</div> -->

    <!-- initContent: {{ initContent }} -->
    <!-- modalId: {{ modalId }}<br>
    uuid: {{uuid}} -->
  </div>
</template>

<script>
import { BSpinner, BButton, BModal } from 'bootstrap-vue';

import Editor from '@tinymce/tinymce-vue';

import FileManager from '@/components/FileManager.vue';
import tinymceInit from '@/tinymce-configure';
import Info from '@/components/admin/Info.vue';

let uuid = 0;

export default {
  name: 'CommonEditor',
  model: {
    prop: 'value',
    event: 'input',
  },
  components: {
    Editor,
    BSpinner,
    BButton,
    BModal,
    FileManager,
    Info,
  },
  props: {
    value: String,
    initContent: String,
    height: String,
    autoresize: [String, Boolean],
  },
  data() {
    return {
      uuid: '',
      state: {
        editor: null,
        editorLoaded: false,
      },
    };
  },
  computed: {
    /** @returns {boolean} */
    isAutoresize() {
      return (
        this.autoresize === '' ||
        this.autoresize === 'true' ||
        this.autoresize === true
      );
    },
    /** @returns {object} */
    editorInit() {
      return tinymceInit({
        height: parseInt(this.height, 10),
        autoresize: this.isAutoresize,
      });
    },
    /** @returns {string} */
    modalId() {
      return `common-editor-file-insert-modal-${this.uuid}`;
    },
  },
  beforeCreate() {
    // this.uuid = uuid.toString();
    // uuid += 1;
  },
  mounted() {
    // this.value = this.initContent;
    this.uuid = uuid.toString();
    uuid += 1;
    // console.log(this.uuid);
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
    onEditorInit(event, tinymce) {
      this.editor = tinymce;
      this.state.editorLoaded = true;
      this.$emit('onInit');
    },
    async fileSelected(files) {
      console.log(files);
      files.forEach((file) => {
        const { mimetype, fileurl, alt, origin } = file;
        if (mimetype.startsWith('image')) {
          this.pushHtmlToEditor(
            `<img src="${fileurl}?size=common" alt="${alt}">`,
          );
        } else {
          this.pushHtmlToEditor(
            `<a href="${fileurl}?action=download">${origin}</a>`,
          );
        }
        // file to do
      });
      // console.log('# CommonEditor fileSelected');
      // console.log(files, a, b);
    },
    async pushHtmlToEditor(html) {
      this.editor.execCommand('mceInsertContent', true, html);
    },
  },
};
</script>

<style>
</style>
