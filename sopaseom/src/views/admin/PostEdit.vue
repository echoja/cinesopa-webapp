<template>
  <wrap-with-editor>
    <template #main>
      <h2>글 편집</h2>
      <div class="post-edit-content">
        <b-form-group
          id="input-title-group"
          label="제목"
          label-for="input-title"
        >
          <b-form-input
            id="input-title"
            name="input-title"
            type="text"
            v-model="input.title"
            class="flex-grow-1"
          ></b-form-input>
        </b-form-group>
        <common-editor height="600" v-model="input.content"></common-editor>
      </div>
      <b-modal
        title="다른 페이지로 이동중입니다."
        id="confirm-routing"
        @ok="confirmRoutingOk"
        ok-title="예"
        cancel-title="아니오"
      >
        아직 변경사항이 적용되지 않았습니다. 이동하시겠습니까?
      </b-modal>
    </template>
    <template #sidebar>
      <!-- :disabled="!changed" -->
      <b-button variant="primary" @click="confirm">{{
        mode === 'new' ? '생성' : '업데이트'
      }}</b-button>
      <!-- <p class="small m-0">자동저장 기능이 없으므로 수시로 업데이트 해주세요.</p> -->
      <p v-if="dirty" class="small m-0 text-red">
        현재 본문에 변경사항이 있습니다.
      </p>

      <hr />
      <b-form-group id="input-excerpt-group" label-for="input-excerpt">
        <template #label>
          <span class="mr-2">요약</span>
          <info>
            게시판 레이아웃에 따라 필요합니다. 만약 요약이 설정되어 있지 않을
            경우 게시글 내용 첫 부분의 일정 크기만큼 가져옵니다.<br />
            (현재 요약은 사용되지 않습니다.)
          </info>
        </template>
        <b-form-textarea
          id="input-excerpt"
          name="input-excerpt"
          v-model="input.excerpt"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
        id="input-status-group"
        label="공개 여부"
        label-for="input-status"
      >
        <b-form-select
          id="input-status"
          name="input-status"
          v-model="input.status"
          value="public"
          :options="options.status"
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-c_date-group" label-for="input-c_date">
        <template #label>
          <span class="mr-2">작성일</span>
          <info>
            작성일을 별도로 설정합니다. <br />게시글을 정렬할 때 기준으로
            설정됩니다.
          </info>
        </template>
        <b-form-datepicker
          value-as-date
          id="input-c_date"
          name="input-c_date"
          v-model="input.c_date"
          locale="ko"
        ></b-form-datepicker>
      </b-form-group>
      <b-form-group id="input-board-group" label-for="input-board">
        <template #label>
          <span class="mr-2">게시판</span>
          <info> 어떤 게시판에 쓸 것인지를 결정합니다. </info>
        </template>
        <b-form-select
          id="input-board"
          name="input-board"
          v-model="input.board"
          :options="options.board"
        ></b-form-select>
      </b-form-group>
      <b-form-group
        id="input-featured_image-group"
        label-for="input-featured_image"
      >
        <template #label>
          <span class="mr-2">대표 이미지</span>
          <info>
            아카이브와 같은 갤러리형 게시판에서 나타날 이미지를 설정합니다. 대표
            이미지가 설정되어야 이미지가 제대로 표시됩니다.
            <small>(본문에서 자동으로 가져오지 않습니다.)</small>
          </info>
        </template>
        <!-- <b-form-select
          id="input-board"
          name="input-board"
          v-model="input.board"
          :options="options.board"
        ></b-form-select> -->
        <!-- {{ input.featured_image }},
        {{ featured_image_link }} -->
        <div
          class="featured-image"
          v-if="featured_image_link && featured_image_link !== ''"
        >
          <b-img
            class="featured-image-content"
            :src="featured_image_link"
            alt=""
          ></b-img>
        </div>
        <b-button size="sm" @click="$bvModal.show('set-featured-image-modal')"
          >설정하기</b-button
        >
        <b-modal size="xl" hide-footer id="set-featured-image-modal">
          <file-manager
            @file-manager-selected="setFeaturedImage"
            :modalId="'set-featured-image-modal'"
          ></file-manager>
        </b-modal>
      </b-form-group>
    </template>
  </wrap-with-editor>
</template>

<script>
// input PostInput {
//   title: String
//   content: String
//   excerpt: String
//   permalink: String
//   status: String
//   board: String # Board 에 대한 id
//   c_date: DateTime
//   m_date: DateTime
//   meta: JSON
// }

// import Editor from '@tinymce/tinymce-vue';
import {
  BFormGroup,
  BFormTextarea,
  BFormSelect,
  BFormDatepicker,
  BButton,
  BModal,
  BFormInput,
  // BSpinner,
  BImg,
} from 'bootstrap-vue';
import { mapActions } from 'vuex';
import FileManager from '@/components/FileManager.vue';
import tinymceInit from '@/tinymce-configure';
import { queryString, graphql } from '@/loader';
import { baseUrl } from '@/constants';
import WrapWithEditor from '@/views/layout/WrapWithEditor.vue';
import Info from '@/components/admin/Info.vue';

/** @type {import('tinymce').Editor} */
// let editor = null;

export default {
  name: 'PostEdit',

  components: {
    WrapWithEditor,
    // Editor,
    FileManager,
    BFormGroup,
    BFormTextarea,
    BFormSelect,
    BFormDatepicker,
    BButton,
    BModal,
    BFormInput,
    // BSpinner,
    BImg,
    CommonEditor: () => import('@/components/admin/CommonEditor.vue'),
    Info,
  },
  props: ['belongs_to', 'mode'],
  data() {
    return {
      dirty: false,
      /** @type {import('vue-router').Route} */
      leaveTo: null,
      /** @type {import('tinymce').Editor} */
      editor: null,
      featured_image_link: '',
      state: {
        editorLoaded: false,
      },
      input: {
        title: '',
        content: '',
        excerpt: '',
        status: 'public',
        c_date: new Date(),
        board: 0,
      },
      options: {
        status: [
          {
            value: 'public',
            text: '공개',
          },
          {
            value: 'private',
            text: '비공개',
          },
        ],
        board: [],
      },
      origin: {},
    };
  },
  computed: {
    /** @returns {object} */
    editorInit() {
      return tinymceInit();
    },
    /** @returns {string} */
    id() {
      return this.$route.params.id;
    },
    /** @returns {string} */
    contentComputedForWatch() {
      return this.input.content;
    },
  },

  watch: {
    contentComputedForWatch(newValue, oldValue) {
      console.log('# PostEdit contentComputedForWatch');
      this.dirty = true;
    },
  },

  async mounted() {
    // beforeunload 설정
    window.addEventListener('beforeunload', this.onBeforeunload);

    // 게시판 초기화 설정
    const res = await graphql(queryString.board.boardsQuery, {
      belongs_to: this.belongs_to,
    });
    // console.log('# PostEdit mounted');
    // console.log(res);
    this.options.board = res.data.boards.map((board) => ({
      // eslint-disable-next-line
      value: board._id,
      text: board.title,
    }));
    this.input.board = this.options.board[0].value;

    // edit mode일 때 정보 초기화 설정
    if (this.mode !== 'new') {
      const postRes = await graphql(queryString.post.postAdminQuery, {
        id: parseInt(this.id, 10),
      });
      // console.log(postRes);
      const { postAdmin: post } = postRes.data;
      // console.log(post);
      [
        'board',
        'content',
        'excerpt',
        'c_date',
        'meta',
        'status',
        'title',
        'featured_image',
      ].forEach((key) => {
        if (post[key]) this.input[key] = post[key];
      });
      this.featured_image_link = post.featured_image_link;
      // this.input.board = board.id;
      // this.input.conetent =
      // this.input.
    }

    // dirty 설정.
    this.$nextTick(() => {
      this.dirty = false;
    });

    // tinymce 테스트
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeunload);
  },
  beforeRouteLeave(to, from, next) {
    console.log('# PostEdit beforeRouteLeave');
    if (typeof this.onBeforeunload() === 'string') {
      this.$bvModal.show('confirm-routing');
      this.leaveTo = to;
      next(false);
    } else {
      // Navigate to next view
      next();
    }
  },
  methods: {
    pushMessage: mapActions(['pushMessage']).pushMessage,
    // onEditorInit(ev, tinymce) {
    //   this.editor = tinymce;
    //   this.state.editorLoaded = true;
    //   // editor.execCommand('mceInsertContent', false, 'Hello, World!');
    // },
    async confirm() {
      if (this.mode === 'new') {
        await this.create();
      } else {
        await this.update();
      }
    },
    async create() {
      const { input } = this;
      // input.board = parseInt(input.board, 10);
      // input.featured_image = parseInt(input.featured_image, 10);
      // console.log(input);
      const res = await graphql(queryString.post.createPostMutation, { input });
      const { id } = res.data.createPost;
      this.pushMessage({
        type: 'success',
        msg: '새 글이 성공적으로 작성되었습니다.',
        id: 'postCreateSuccess',
      });
      this.dirty = false;
      this.$router.push({ name: 'PostEdit', params: { id } });
    },

    async update() {
      const { input } = this;
      // input.board = parseInt(input.board, 10);
      // input.featured_image = parseInt(input.featured_image, 10);
      graphql(queryString.post.updatePostMutation, {
        id: parseInt(this.id, 10),
        input,
      })
        .then((result) => {
          console.log(result);
          this.pushMessage({
            type: 'success',
            msg: '글이 성공적으로 수정되었습니다.',
            id: 'postUpdateSuccess',
          });
          this.dirty = false;
        })
        .catch((err) => {
          this.pushMessage({
            type: 'danger',
            msg: `글을 업데이트 하는 중 에러가 발생했습니다.>> ${JSON.stringify(
              err,
            )}`,
            id: 'postUpdateFail',
          });
        });
    },

    // async fileSelected(files) {
    //   files.forEach((file) => {
    //     const { mimetype, fileurl, alt } = file;
    //     if (mimetype.startsWith('image')) {
    //       this.pushHtmlToEditor(`<img src="${fileurl}" alt="${alt}">`);
    //     }
    //   });
    //   // console.log(files, a, b);
    // },

    async setFeaturedImage(files) {
      if (files.length >= 1) this.input.featured_image = files[0]._id;
      // console.log('# postEdit setFeaturedImage');
      // console.log(files);
      this.featured_image_link = `${baseUrl}${files[0].fileurl}`;
    },

    async pushHtmlToEditor(html) {
      this.editor.execCommand('mceInsertContent', true, html);
    },

    async test1(event, values) {
      this.editor.execCommand(
        'mceInsertContent',
        true,
        '<div>하하하하 ~!!</div>',
      );
      console.log(event);
      console.log(values);
    },
    onBeforeunload(e = {}) {
      if (this.dirty) {
        const msg = '변경사항이 있습니다. 정말 나가시겠습니까?';

        // Cancel the event
        if (e.preventDefault) e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = msg;
        return msg;
      }
      delete e.returnValue;
      return undefined;
    },
    confirmRoutingOk() {
      this.dirty = false;
      this.$router.push(this.leaveTo);
    },
  },
};
</script>

<style lang="scss" scoped>
.featured-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  border: 1px solid #ddd;
}
.featured-image-content {
  max-width: 100%;
  max-height: 100%;
}
.post-edit-content {
  max-width: 700px;
  margin: 0 auto;
}
</style>

<style></style>
