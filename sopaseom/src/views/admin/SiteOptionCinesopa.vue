<template>
  <div class="site-option-cinesopa">
    <h2>씨네소파 사이트 정보 수정</h2>

    <table class="input-table form">
      <tr
        class="input-item"
        v-for="(option, optionIndex) in Object.keys(form)"
        :key="optionIndex"
      >
        <td class="input-title">
          <label class="input-title-label" :for="`input-${option}`">
            {{ form[option].label }}
          </label>
        </td>
        <td class="input-content">
          <!-- 만약 현재 요소가 배열이라면 추가/삭제 등의 기능도 추가 -->
          <div v-if="form[option].type === 'array'">
            <table>
              <tr>
                <th
                  v-for="(fieldObj, fieldObjIndex) in typedef[option]"
                  :key="fieldObjIndex"
                >
                  {{ fieldObj.label }}
                </th>
                <th>삭제</th>
              </tr>
              <tr v-for="(row, rowIndex) in form[option].value" :key="rowIndex">
                <td
                  v-for="(field, fieldIndex) in Object.keys(row)"
                  :key="fieldIndex"
                >
                  <!-- 필드가 string일 때 -->
                  <div v-if="typedef[option][field].type === 'string'">
                    <b-form-input size="sm" v-model="row[field]">
                    </b-form-input>
                  </div>
                  <!-- 필드가 file일 때 -->
                  <div v-else-if="typedef[option][field].type === 'file'">
                    <div>
                      <p class="mb-0">
                        현재 파일 :
                        {{ row[field].label ? row[field].label : '없음' }}
                      </p>
                    </div>
                    <div>
                      <b-button
                        size="sm"
                        style="min-width: 100px"
                        @click="
                          $bvModal.show(
                            `input-file-${option}-${row.id}-${field}-modal`,
                          )
                        "
                      >
                        설정 및 교체
                      </b-button>
                      <b-modal
                        size="xl"
                        hide-header
                        hide-footer
                        :id="`input-file-${option}-${row.id}-${field}-modal`"
                      >
                        <file-manager
                          :modal-id="`input-file-${option}-${row.id}-${field}-modal`"
                          @file-manager-selected="
                            fileManagerSelected(row[field], $event)
                          "
                        >
                          <!-- // todo -->
                        </file-manager>
                      </b-modal>
                    </div>
                  </div>
                </td>
                <td>
                  <b-button
                    class="remove-item"
                    @click="removeItem(form, option, fieldIndex)"
                    >&times;</b-button
                  >
                </td>
              </tr>
            </table>
            <div class="button">
              <b-button @click="addRow(form, option)">추가</b-button>
            </div>
          </div>

          <!-- 만약 현재 요소가 string 이라면 일반적으로 수행. -->
          <b-form-input
            :id="`input-${option}`"
            v-if="form[option].type === 'string'"
            v-model="form[option].value"
          ></b-form-input>

          <!-- 만약 현재 요소가 file 이라면 파일 매니저 불러오기. -->
          <div v-else-if="form[option].type === 'file'">
            <div>
              <p>
                현재 파일 :
                {{ form[option].value ? form[option].file.label : '없음' }}
              </p>
            </div>
            <div>
              <b-button @click="$bvModal.show(`input-file-${option}-modal`)">
                설정 및 교체하기
              </b-button>
              <b-modal
                size="xl"
                hide-header
                hide-footer
                :id="`input-file-${option}-modal`"
              >
                <file-manager
                  :modal-id="`input-file-${option}-modal`"
                  @file-manager-selected="
                    fileManagerSelected(form[option], $event, true)
                  "
                ></file-manager>
              </b-modal>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <!--
    <b-form class="form">
      <b-form-group
        label="주소"
        label-for="input-title"
        label-cols-md="3"
        label-align-md="right"
        label-size="sm"
      >
        <b-form-input id="input-address" v-model="form.address.value">
        </b-form-input>
      </b-form-group>
      <b-form-group
        label="전화번호"
        label-for="input-phone"
        label-cols-md="3"
        label-align-md="right"
        label-size="sm"
      >
        <b-form-input id="input-phone" v-model="form.phone.value">
        </b-form-input> -->
    <!-- </b-form-group> -->
    <!-- </b-form> -->
    <hr />
    <b-button :disabled="disableConfirm" @click="confirmClicked"
      >변경사항 저장</b-button
    >
    <pre v-html="prettied"></pre>
  </div>
</template>

<script>
import { BButton, BFormInput, VBToggle, BModal } from 'bootstrap-vue';
import {
  siteOptionsQuery,
  graphql,
  getFileInfoQuery,
  setSiteOptionsMutation,
} from '@/api/graphql-client';
import FileManager from '@/components/FileManager.vue';

import prettyPrintJson from 'pretty-print-json';
import { mapActions } from 'vuex';

export default {
  components: {
    BFormInput,
    BButton,
    BModal,
    FileManager,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  name: 'Site',
  data() {
    return {
      typedef: {
        person: {
          id: {
            type: 'string',
            label: '식별자',
            editable: true,
          },
          name: {
            type: 'string',
            label: '이름',
            editable: true,
          },
          nickname: {
            type: 'string',
            label: '닉네임',
            editable: true,
          },
          position: {
            type: 'string',
            label: '직급',
            editable: true,
          },
          work: {
            type: 'string',
            label: '직무',
            editable: true,
          },
          email: {
            type: 'string',
            label: '이메일',
            editable: true,
          },
          phone: {
            type: 'string',
            label: '전화번호',
            editable: true,
          },
          image: {
            type: 'file',
            label: '이미지',
            editable: true,
          },
        },
      },
      form: {
        address: {
          label: '주소',
          value: null,
          initValue: null,
          type: 'string',
        },
        phone: {
          label: '전화번호',
          value: null,
          initValue: null,
          type: 'string',
        },
        logo: {
          label: '로고',
          value: null,
          initValue: null,
          type: 'file',
          file: {
            label: '',
            mimetype: '',
            fileurl: '',
          },
        },
        person: {
          label: '사람들',
          type: 'array',
          value: [],
          initValue: [],
          typedef: 'person',
        },
      },
    };
  },
  computed: {
    disableConfirm() {
      return false; // todo
    },
    prettied() {
      return prettyPrintJson.toHtml(this.form);
    },
  },
  async mounted() {
    await this.initOptionValues(this.form);
  },
  methods: {
    ...mapActions(['pushMessage']),
    async initOptionValues(form) {
      const names = Object.keys(form);
      const res = await graphql(siteOptionsQuery, {
        names,
      });
      // console.log('# initOptionValues - SiteOptionCinesopa.vue');
      // console.log(res);
      const result = res.data.siteOptions;
      if (!result) {
        // console.log(
        //   '# initOptionValues - SiteOptionCinesopa.vue - no result!!',
        // );
        return;
      }

      // 서버로부터 받아온 옵션 값을 v-model 연결된 값으로 대입시킴.
      result.forEach((item) => {
        const formItem = form[item.name];
        formItem.value = item.value;
        // console.log(
        //   `# initOptionValues - SiteOptionCinesopa.vue - pushed ${item.name}`,
        // );
        if (formItem.type === 'file') {
          this.getFileInfo(item.value, formItem);
        }
      });
    },
    async getFileInfo(filename, formItem) {
      const res = await graphql(getFileInfoQuery, {
        filename,
      });
      // console.log('# getFileInfo - SiteOptionCinesopa.vue');
      // console.log(res);
      const { file } = res.data;
      if (file) {
        formItem.file.label = file.label;
        formItem.file.fileurl = file.fileurl;
        formItem.file.mimetype = file.mimetype;
      }
    },
    async confirmClicked() {
      // console.log('# confirmClicked');
      // console.log(this.form);
      const inputs = Object.keys(this.form).map(
        (name) =>
          // const { type, value } = this.form[name];
          // if (type === 'string') {
          ({
            name,
            value: this.form[name].value,
          }),
        // }
        // if (type === 'array') {
        //   return value.map((row) => {
        //     return Object.keys(row).map((deepName) => ({
        //       name: `${name}-${row.id}-${deepName}`,
        //       value:
        //         typeof row[deepName] === 'string'
        //           ? row[deepName]
        //           : row[deepName].filename,
        //     }));
        //   });
        // }
      );
      // console.log(inputs);
      const inputsFlatted = inputs.flat(Infinity);
      // console.log(inputsFlatted);
      const filtered = inputsFlatted.filter((item) => item.value !== null);
      // console.log(filtered);
      // const res =
      await graphql(setSiteOptionsMutation, {
        inputs: filtered,
      });
      // const result = res.data.setSiteOptions;
      // console.log(result);
      this.pushMessage({
        type: 'success',
        msg: '설정을 성공적으로 업데이트 했습니다.',
        id: 'siteOptionUpdateSuccess',
      });
    },
    // onlyFilename 일 경우 obj.value 만 filename 으로 설정합니다.
    async fileManagerSelected(obj, files, onlyFilename) {
      const file = files[0];
      if (onlyFilename) {
        obj.value = file.filename;
        obj.file.label = file.label;
        obj.file.alt = file.alt;
        return;
      }
      obj.fileurl = file.fileurl;
      obj.label = file.label;
      obj.filename = file.filename;
      obj.mimetype = file.mimetype;
      obj.alt = file.alt;
    },

    async addRow(form, option) {
      if (form[option].type !== 'array') {
        return;
      }
      if (form[option].value === null) {
        form[option].value = [];
      }
      console.log('# addRow');
      console.log(form[option]);
      const toPush = {};
      Object.keys(this.typedef[option]).forEach((key) => {
        const typedefFieldObj = this.typedef[option][key];
        if (typedefFieldObj.type === 'file') {
          toPush[key] = { label: '', fileurl: '', mimetype: '' };
        } else {
          toPush[key] = '';
        }
      });
      form[option].value.push(toPush);
    },
    async removeItem(form, option, fieldIndex) {
      form[option].value.splice(fieldIndex, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  max-width: 1000px;
}

.input-title-label {
  padding: 0 20px 0 0;
}

.input-title {
  vertical-align: top;
  min-width: 100px;
}

.input-item > td {
  padding: 20px 0;
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

<style>
</style>
