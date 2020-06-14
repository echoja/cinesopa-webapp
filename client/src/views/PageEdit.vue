
<template>
  <div>
    <editor
      api-key="gt5higoqzglgrwcu9r7cdbmj408cva4csd4aj2y6qvcr5i5r"
      v-model="val"
      :init="{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
      }"
    />
  <b-button @click="confirm">적용</b-button>
  <p>{{ val }}</p>
  <b-form-file v-model="file2" @input="fileUpload" ref="file-input" class="mt-3" plain></b-form-file>
  <p>{{ file2 }}</p>
  </div>

</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import upload from '../upload-client';
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
    // 'b-form-file': BFormFile,
    // 'b-button' :
  },
  data() {
    return {
      file2: null,
      val: '',
    };
  },
  methods: {
    confirm() {

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
