<template>
  <span>
    <span v-if="!value || !value.filename">현재 파일이 등록되어있지 않습니다.</span>
    <a class="mr-2" :href="`/upload/${value.filename}?action=download`" v-else>
      <u>
        {{ value.origin }}
      </u>
    </a>
    <b-button
      size="sm"
      @click="$bvModal.show(singleFileFieldModalId)"
      variant="primary"
    >
      <font-awesome-icon :icon="['fas', 'upload']" class="mr-2" />
      <span>등록</span></b-button
    >
    <b-modal size="xl" hide-header hide-footer :id="singleFileFieldModalId">
      <file-manager
        select-message="등록"
        select-description="하나를 선택 후 등록을 누르세요."
        :select-only-one="true"
        :modal-id="singleFileFieldModalId"
        @file-manager-selected="handleSingleFile($event)"
      ></file-manager>
    </b-modal>
  </span>
</template>

<script>
import { BModal, BButton } from 'bootstrap-vue';

let uuid = 0;
export default {
  name: 'SingleFileField',
  components: {
    BModal,
    BButton,
    FileManager: () => import('../FileManager.vue'),
  },
  data() {
    return {
      id: 0,
    };
  },
  props: {
    value: {
      type: [Object],
      default() {
        return {};
      },
    },
  },
  computed: {
    /** @returns {string} */
    singleFileFieldModalId() {
      return `single-file-field-modal-${this.id}`;
    },
  },
  created() {
    this.id = uuid;
    uuid += 1;
  },
  methods: {
    uploadClicked() {},
    handleSingleFile(files) {
      const file = files[0];
      console.log('# SingleFileField.vue handleSingleFile');
      console.log(file);
      const obj = {};
      obj.fileurl = file.fileurl;
      obj.label = file.label;
      obj.filename = file.filename;
      obj.mimetype = file.mimetype;
      obj.alt = file.alt;
      obj.origin = file.origin;
      this.$emit('input', obj);
    },
  },
};
</script>

<style>
</style>
