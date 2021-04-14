<template>
  <tr class="input-item">
    <td class="input-title">
      <label class="input-title-label" :for="inputId">
        <b>{{ label }}</b>
      </label>
      <info :modal="descriptionModal" :description="description">
        <!-- <p><b>파워설명</b>입니다.</p> -->
      </info>
      <!-- <info v-if="description" :description="description"></info> -->
    </td>
    <td class="input-content">
      <!-- 만약 현재 요소가 배열이라면 추가/삭제 등의 기능도 추가 -->
      <div v-if="type === 'table'">
        <b-table-simple>
          <!-- 필드행 -->
          <b-tr>
            <b-th
              v-for="(fieldObj, fieldObjIndex) in fieldsObj"
              :key="fieldObjIndex"
            >
              {{ fieldObj.label }}
              <info
                v-if="fieldObj.description"
                :description="fieldObj.description"
              ></info>
            </b-th>
            <b-th>
              동작
              <info>
                <ul class="text-left pl-3">
                  <li>
                    &times; 버튼을 눌러 해당 항목을 삭제합니다.
                    <b>변경사항 저장</b>을 해야 삭제가 반영됩니다.
                  </li>
                  <li>화살표 버튼을 눌러 순서를 조정합니다.</li>
                </ul>
              </info>
            </b-th>
          </b-tr>
          <b-tr v-for="(row, rowIndex) in value" :key="rowIndex">
            <b-td
              v-for="(field, fieldIndex) in Object.keys(row)"
              :key="fieldIndex"
            >
              <template v-if="fieldsObj[field]">
                <!-- 필드가 string일 때 -->
                <div v-if="fieldsObj[field].type === 'string'">
                  <b-form-input
                    size="sm"
                    :value="row[field]"
                    @input="inputTableValue($event, rowIndex, field)"
                  >
                  </b-form-input>
                </div>
                <!-- 필드가 file일 때 -->
                <div v-else-if="fieldsObj[field].type === 'file'">
                  <div>
                    <p class="mb-0 text-center">
                      <b-img-lazy
                        class="input-table-image-preview"
                        v-if="row[field].mimetype.startsWith('image')"
                        :src="`${row[field].fileurl}?size=file_preview`"
                        :style="{ maxWidth: '100px' }"
                      >
                        이미지
                      </b-img-lazy>
                      <template v-else-if="row[field].label">
                        선택된 파일 :
                        {{ row[field].label }}
                      </template>
                      <template v-else> 파일을<br />설정해주세요. </template>
                    </p>
                  </div>
                  <div class="text-center mt-3">
                    <!-- style="min-width: 100px" -->
                    <b-button
                      size="sm"
                      @click="
                        $bvModal.show(
                          `input-file-${id}-${rowIndex}-${field}-modal`,
                        )
                      "
                    >
                      설정
                    </b-button>
                    <b-modal
                      size="xl"
                      hide-header
                      hide-footer
                      :id="`input-file-${id}-${rowIndex}-${field}-modal`"
                    >
                      <file-manager
                        :modal-id="`input-file-${id}-${rowIndex}-${field}-modal`"
                        @file-manager-selected="
                          handleTableFile($event, rowIndex, field)
                        "
                      >
                        <!-- // todo -->
                      </file-manager>
                    </b-modal>
                  </div>
                </div>

                <!-- 필드가 date일 때 -->
                <div v-else-if="fieldsObj[field].type === 'date'">
                  <b-form-datepicker
                    value-as-date
                    :value="row[field]"
                    size="sm"
                    @input="inputTableValue($event, rowIndex, field)"
                  ></b-form-datepicker>
                </div>
              </template>
            </b-td>
            <b-td>
              <!-- <b-button class="border-secondary" @click="removeRow(rowIndex)">
                &times;
              </b-button> -->
              <b-button class="border-light" @click="removeRow(rowIndex)">
                <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
              </b-button>
              <b-button class="border-light" @click="moveUpClicked(rowIndex)">
                <font-awesome-icon
                  :icon="['fas', 'arrow-up']"
                ></font-awesome-icon>
              </b-button>
              <b-button class="border-light" @click="moveDownClicked(rowIndex)">
                <font-awesome-icon
                  :icon="['fas', 'arrow-down']"
                ></font-awesome-icon>
              </b-button>
            </b-td>
          </b-tr>
        </b-table-simple>
        <div class="button">
          <b-button @click="addRow">추가</b-button>
        </div>
      </div>

      <!-- 만약 현재 요소가 string 이라면 일반적으로 수행. -->
      <b-form-input
        :id="inputId"
        v-else-if="type === 'string'"
        :value="value"
        @input="normalInput"
      ></b-form-input>

      <!-- 만약 현재 요소가 file 이라면 파일 매니저 불러오기. -->
      <div v-else-if="type === 'file'">
        <single-file-field :value="value" @input="$emit('input', $event)">
        </single-file-field>

        <!-- <div>
          <template v-if="value && value.label && value.filename">
            <span>현재 파일: </span>
            <a :href="`/upload/${value.filename}?action=download`"
              ><u>{{ value.label }}</u></a
            >
          </template>
        </div>
        <div>
          <b-button
            size="sm"
            @click="$bvModal.show(singleFileModalId)"
            :id="inputId"
          >
            설정 및 교체
          </b-button>
          <b-modal size="xl" hide-header hide-footer :id="singleFileModalId">
            <file-manager
              :modal-id="singleFileModalId"
              @file-manager-selected="handleSingleFile($event)"
            ></file-manager>
          </b-modal>
        </div> -->
      </div>

      <!-- 만약 현재 요소가 boolean 이라면 체크박스 불러오기. -->
      <b-form-checkbox
        v-else-if="type === 'single_checkbox'"
        :checked="value"
        @input="normalInput"
        :id="inputId"
      >
        {{ checkboxLabel }}
      </b-form-checkbox>

      <!-- 만약 현재 요소가 editor 이라면 데이터 불러오기. -->
      <common-editor
        v-else-if="type === 'editor'"
        :value="value"
        @input="normalInput"
        height="500"
      ></common-editor>

      <!-- 만약 현재 요소가 number 라면 number 용 input 생성 -->
      <b-form-input
        :id="inputId"
        v-else-if="type === 'number'"
        :value="value"
        @input="normalInput"
        number
        type="number"
      ></b-form-input>
    </td>
  </tr>
</template>

<script>
import {
  BTableSimple,
  BImgLazy,
  BTr,
  BTh,
  BTd,
  BFormCheckbox,
  BFormInput,
  BButton,
  BFormDatepicker,
} from 'bootstrap-vue';
import axios from 'axios';
import fileDownload from 'js-file-download';
import moment from 'moment';
import CommonEditor from '@/components/admin/CommonEditor.vue';
import Info from './Info.vue';
import FileManager from '../FileManager.vue';
import SingleFileField from './SingleFileField.vue';

let uuid = 0;

export default {
  name: 'SiteOptionRow',
  components: {
    BTableSimple,
    BTr,
    BTh,
    BTd,
    BFormCheckbox,
    BFormInput,
    BButton,
    FileManager,
    BImgLazy,
    Info,
    CommonEditor,
    BFormDatepicker,
    SingleFileField,
  },
  props: {
    type: {
      type: String,
      default: 'string', // string, file, single_checkbox, table
    },
    value: {
      type: [String, Number, Object, Boolean, Array],
    },
    label: String,
    description: String,
    fieldsObj: Object,
    checkboxLabel: String,
    descriptionModal: String,
  },
  data() {
    return {
      id: 0,
    };
  },
  computed: {
    /** @returns {string} */
    inputId() {
      return `input-${this.id}`;
    },
    /** @returns {string} */
    singleFileModalId() {
      return `input-singlefile-modal-${this.id}`;
    },
    /** @returns {string} */
    currentFile() {
      return this.value?.label ?? '없음';
    },
  },

  created() {
    this.id = uuid;
    uuid += 1;
  },

  mounted() {
    this.parseInitialTableDate();
  },

  methods: {
    async addRow() {
      if (this.type !== 'table') {
        return;
      }
      let value;
      if (!this.value) {
        value = [];
      } else {
        value = [...this.value];
      }

      // console.log('# addRow');
      // console.log(form[option]);
      const toPush = {};
      Object.keys(this.fieldsObj).forEach((key) => {
        const fieldObj = this.fieldsObj[key];
        if (fieldObj.type === 'file') {
          toPush[key] = { label: '', fileurl: '', mimetype: '' };
        } else {
          toPush[key] = '';
        }
      });
      value.push(toPush);
      console.log('# SiteOptionRow addRow');
      console.log(value);
      this.$emit('input', value);
    },

    async removeRow(fieldIndex) {
      if (this.type !== 'table') {
        return;
      }
      const value = [...this.value];
      value.splice(fieldIndex, 1);
      this.$emit('input', value);
    },
    async handleSingleFile(files) {
      const file = files[0];
      // console.log('# SiteOptionRow.vue handleSingleFile');
      // console.log(file);
      const obj = {};
      obj.fileurl = file.fileurl;
      obj.label = file.label;
      obj.filename = file.filename;
      obj.mimetype = file.mimetype;
      obj.alt = file.alt;
      obj.origin = file.origin;
      this.$emit('input', obj);
    },
    handleTableFile(files, tableRow, fieldName) {
      const file = files[0];
      const obj = {};

      obj.fileurl = file.fileurl;
      obj.label = file.label;
      obj.filename = file.filename;
      obj.mimetype = file.mimetype;
      obj.alt = file.alt;
      this.inputTableValue(obj, tableRow, fieldName);
    },
    inputTableValue(value, tableRowIndex, fieldName) {
      const values = [...this.value];
      values[tableRowIndex][fieldName] = value;
      this.$emit('input', values);
    },
    normalInput(value) {
      // console.log('# SiteOptionRow normalInput,');
      // console.log(value);
      this.$emit('input', value);
    },
    moveUpClicked(fieldIndex) {
      if (this.type !== 'table' || fieldIndex === 0) {
        return;
      }
      const value = [...this.value];
      const imsi = value[fieldIndex];
      value[fieldIndex] = value[fieldIndex - 1];
      value[fieldIndex - 1] = imsi;
      this.$emit('input', value);
    },
    moveDownClicked(fieldIndex) {
      if (
        this.type !== 'table' ||
        fieldIndex === (this.value?.length ?? 1) - 1
      ) {
        return;
      }
      const value = [...this.value];
      const imsi = value[fieldIndex];
      value[fieldIndex] = value[fieldIndex + 1];
      value[fieldIndex + 1] = imsi;
      this.$emit('input', value);
    },
    /**
     * date 는 그대로 받아오면 string 으로 받아오므로, 이것을 date 형식으로 바꿔줘야 할 필요가 있음.
     */
    parseInitialTableDate() {
      if (this.type !== 'table') return;
      if (!this.value) return;

      this.value.forEach((row, rowIndex) => {
        Object.keys(row).forEach((field) => {
          // date 가 있으나 그 값이 일반 string 으로 이루어져 있을 때
          if (
            this.fieldsObj[field].type === 'date' &&
            typeof row[field] &&
            row[field].length !== 0
          ) {
            this.inputTableValue(new Date(row[field]), rowIndex, field);
          }
        });
      });
    },
    async fileDownloadClicked() {
      const res = await axios.get(`/upload/${this.value.filename}`, {
        withCredentials: true,
        responseType: 'blob',
      });
      fileDownload(
        res.data,
        this.value?.origin ?? moment().format('yyyy-MM-DD hh:mm:ss'),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  max-width: 1000px;
}

.input-title-label {
  padding-right: 3px;
}

.input-title {
  vertical-align: top;
  min-width: 100px;
}

.input-item > td {
  padding: 20px 10px 20px 0;
}

.remove-item {
  border: 0;
}

.input-content td {
  vertical-align: top;
  padding-top: 20px;
}
// .input-item {
//   display: flex;
// }
</style>
