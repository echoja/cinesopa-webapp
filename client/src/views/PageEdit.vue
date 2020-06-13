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
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'PageEdit',
  components: {
    editor: Editor,
  },
  data() {
    return {
      val: '',
    };
  },
  methods: {
    confirm() {

    },
  },
};
</script>

<style></style>
