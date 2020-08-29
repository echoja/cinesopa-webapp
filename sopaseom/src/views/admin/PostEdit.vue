<template>
  <wrap-with-editor>
    <template #main>
      <h2>글 편집</h2>
      <b-form-group id="input-title-group" label="제목" label-for="input-title">
        <b-form-input
          id="input-title"
          name="input-title"
          type="text"
          v-model="input.title"
          class="flex-grow-1"
        ></b-form-input>
      </b-form-group>
      <div
        v-if="!state.editorLoaded"
        class="h-25 d-flex p-2 justify-content-center align-items-center"
      >
        <b-spinner variant="secondary" class="m-2 small"></b-spinner>
        <p class="m-0">에디터 로딩중입니다.</p>
      </div>
      <editor
        api-key="gt5higoqzglgrwcu9r7cdbmj408cva4csd4aj2y6qvcr5i5r"
        v-model="input.content"
        :init="editorInit"
        @onInit="onEditorInit"
      />
    </template>
    <template #sidebar>
      <!-- :disabled="!changed" -->
      <b-button variant="primary" @click="confirm">{{
        mode === 'new' ? '생성' : '업데이트'
      }}</b-button>
      <hr />
      <b-form-group id="input-excerpt-group" label="요약" label-for="input-excerpt">
        <b-form-textarea
          id="input-excerpt"
          name="input-excerpt"
          v-model="input.excerpt"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group id="input-status-group" label="글 상태" label-for="input-status">
        <b-form-select
          id="input-status"
          name="input-status"
          v-model="input.status"
          value="public"
          :options="options.status"
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-c_date-group" label="날짜" label-for="input-c_date">
        <b-form-datepicker
          value-as-date
          id="input-c_date"
          name="input-c_date"
          v-model="input.c_date"
          locale="ko"
        ></b-form-datepicker>
      </b-form-group>
      <b-form-group id="input-board-group" label="게시판" label-for="input-board">
        <b-form-select
          id="input-board"
          name="input-board"
          v-model="input.board"
          :options="options.board"
        ></b-form-select>
      </b-form-group>
      <b-form-group
        id="input-featured_image-group"
        label="대표 이미지"
        label-for="input-featured_image"
      >
        <!-- <b-form-select
          id="input-board"
          name="input-board"
          v-model="input.board"
          :options="options.board"
        ></b-form-select> -->
        대표 이미지
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

import Editor from '@tinymce/tinymce-vue';
import { mapActions } from 'vuex';
import WrapWithEditor from '../layout/WrapWithEditor.vue';
import tinymceInit from '../../tinymce-configure';
import { queryString, graphql } from '../../loader';

export default {
  name: 'PostEdit',

  components: {
    'wrap-with-editor': WrapWithEditor,
    editor: Editor,
  },
  props: ['belongs_to', 'mode'],
  data() {
    return {
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
        featured_image: '',
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
    editorInit() {
      return tinymceInit();
    },
    id() {
      return this.$route.params.id;
    },
  },

  async created() {
    // 게시판 초기화 설정
    const res = await graphql(queryString.board.boardsQuery, {
      belongs_to: this.belongs_to,
    });
    console.log(res);
    this.options.board = res.data.boards.map((board) => {
      return {
        value: board._id,
        text: board.title,
      };
    });
    this.input.board = this.options.board[0].value;

    // edit mode일 때 정보 초기화 설정
    if (this.mode !== 'new') {
      const postRes = await graphql(queryString.post.postAdminQuery, { id: parseInt(this.id, 10) });
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
      // this.input.board = board.id;
      // this.input.conetent =
      // this.input.
    }
  },
  methods: {
    ...mapActions(['pushMessage']),
    onEditorInit() {
      this.state.editorLoaded = true;
    },
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
        .then(() => {
          this.pushMessage({
            type: 'success',
            msg: '글이 성공적으로 수정되었습니다.',
            id: 'postUpdateSuccess',
          });
        })
        .catch((err) => {
          this.pushMessage({
            type: 'danger',
            msg: `글을 업데이트 하는 중 에러가 발생했습니다.>> ${JSON.stringify(err)}`,
            id: 'postUpdateFail',
          });
        });
    },
  },
};
</script>

<style></style>
