<template>
  <div>
    <wrap-with-editor>
      <template #main>
        <h2>페이지 편집</h2>
        <b-form-input v-model="permalink" placeholder="url 이름"></b-form-input>
        <b-form-input v-model="title" placeholder="페이지 제목"></b-form-input>
        <p v-if="!editorLoaded"><b-spinner label="Spinning" />에디터 로딩중</p>
        <editor
          api-key="gt5higoqzglgrwcu9r7cdbmj408cva4csd4aj2y6qvcr5i5r"
          v-model="content"
          :init="editorInit"
          @onInit="onEditorInit"
        />
        <b-button @click="confirm">적용</b-button>

        <b-form-file v-model="file2" @input="fileUpload" ref="file-input" class="mt-3" plain>
        </b-form-file>
        <p>{{ file2 }}</p>
        <p><b> content </b>: {{ content }}</p>
        <p>belongs_to : {{ belongs_to }}, mode: {{ mode }}</p>
        <p>oldPermalink: {{ oldPermalink }}</p>
      </template>
      <template #sidebar>
        ...
      </template>
    </wrap-with-editor>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import upload from '../../upload-client';
import tinymceInit from '../../tinymce-configure';
import {
  dataGraphql,
  createPageMutation,
  updatePageMutation,
  getPageByIdQuery,
} from '../../api/graphql-client';
import router from '../../router';
import WrapWithEditor from '../layout/WrapWithEditor.vue';

// const getPageByIdQuery = `
// query getPageById($id: String!) {
//   pageById(id: $id) {
//     id
//     title
//     content
//     permalink
//     c_date
//   }
// }
// `;
// tinymceConfigure();

// import { singleUploadQuery } from '../graphql-client';

// import { BFormFile } from 'bootstrap-vue';

// const client = new GraphQLClient({
//   url: '/graphql',
//   fetch,
//   FormData,
// });

export default {
  name: 'PageEdit',
  components: {
    editor: Editor,
    'wrap-with-editor': WrapWithEditor,
    // 'b-form-file': BFormFile,
    // 'b-button' :
  },
  data() {
    return {
      file2: null,
      title: '',
      content: '',
      val: '',
      permalink: '',
      oldPermalink: '',
      meta_json: {},
      editorLoaded: false,
      dataLoaded: false,
    };
  },
  props: ['belongs_to', 'mode'],

  async created() {
    if (this.mode !== 'new') {
      const { id } = router.currentRoute.params;
      const { pageById } = await dataGraphql(getPageByIdQuery, { id: parseInt(id, 10) });
      const self = this;
      ['content', 'title', 'permalink'].forEach((key) => {
        self[key] = pageById[key];
      });
      this.dataLoaded = true;
      this.oldPermalink = this.permalink;
    }
    // const { id } = this.$route.params;
    // const { pageById } = await dataGraphql(getPageByIdQuery, { id });
    // this.content = pageById.content;
  },
  computed: {
    editorInit() {
      return tinymceInit('');
    },
  },

  methods: {
    onEditorInit() {
      this.editorLoaded = true;
    },
    confirm() {
      if (this.mode === 'new') return this.confirmNew();
      return this.confirmEdit();
    },
    confirmNew() {
      console.log('confirmNew');
      dataGraphql(createPageMutation, {
        permalink: this.permalink,
        belongs_to: this.belongs_to,
        pageinfo: {
          title: this.title,
          content: this.content,
          belongs_to: this.belongs_to,
          meta_json: JSON.stringify(this.meta_json),
        },
      })
        .then((result) => {
          console.log('pageWirteSuccessed!');
          console.log(result);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    confirmEdit() {
      const {
        // eslint-disable-next-line
        title,
        permalink,
        belongs_to,
        oldPermalink,
        content,
      } = this;
      dataGraphql(updatePageMutation, {
        permalink: oldPermalink,
        belongs_to,
        pageinfo: {
          title,
          permalink,
          content,
          belongs_to,
          meta_json: JSON.stringify(this.meta_json),
        },
      })
        .then((result) => {
          console.log('page Update Successed!');
          console.log(result);
        })
        .catch((err) => {
          console.error(err);
        });
      console.log('confirmEdit');
    },
    async fileUpload() {
      console.log(this.file2);
      try {
        console.log(this.$refs['file-input']);
        const result = await upload(this.$refs['file-input'].selectedFile, 'hi');
        console.log(result);
      } catch (e) {
        console.log(e);
      }
      // const { data, error } = await client.request({
      //   query: singleUploadQuery,
      //   variables: {
      //     file: this.file2,
      //   },
      // });
      // console.log(data);
      // console.log(error);
      // try {
      //   const result = await graphql(singleUploadQuery, { file: this.file2 });
      //   console.log(result);
      // } catch (e) {
      //   console.log('error!');
      //   console.log(e);
      // }
    },
  },
};
</script>

<style></style>
