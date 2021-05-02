<template>
  <div class="site-option-cinesopa">
    <header>
      <h2>소파섬 사이트 정보 수정</h2>
    </header>

    <site-option-table>
      <site-option-row
        v-for="(form, key) in forms"
        :key="key"
        :id="`option-${key}`"
        v-model="form.value"
        :label="form.label"
        :description="form.description"
        :type="form.type"
      ></site-option-row>
    </site-option-table>
    <hr />
    <b-button :disabled="disableConfirm" @click="confirmClicked"
      >변경사항 저장</b-button
    >
  </div>
</template>

<script>
import { BButton, VBToggle } from 'bootstrap-vue';
import {
  siteOptionsQuery,
  graphql,
  setSiteOptionsMutation,
} from '@/api/graphql-client';

import SiteOptionRow from '@/components/admin/SiteOptionRow.vue';
import SiteOptionTable from '@/components/admin/SiteOptionTable.vue';

import { mapActions } from 'vuex';

export default {
  components: {
    BButton,
    SiteOptionRow,
    SiteOptionTable,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  name: 'SiteOptionSopaseom',
  data() {
    return {
      forms: {
        transportation_fee: {
          label: '기본 배송비',
          value: null,
          description:
            '모든 상품의 배송비를 일괄 설정합니다. 현재 상품별로 배송비를 설정할 수는 없습니다. 이미 결제가 완료된 주문의 배송비도 수정할 수 없습니다.',
          type: 'number',
        },
        default_notice: {
          label: '상품 안내사항 기본값',
          value: null,
          description:
            '매 상품 설명 페이지 하단에 들어가는 공통 공지의 기본값을 설정합니다. 각 상품 편집에서 이 설정을 덮어쓸 수 있습니다.',
          type: 'editor',
        },
        option_privacy: {
          label: '개인정보처리방침',
          value: null,
          description: '소파섬 개인정보보호방침과 관련된 내용입니다.',
          type: 'editor',
        },
        option_policy: {
          label: '소파섬 이용약관',
          value: null,
          description: '소파섬 이용약관을 설정합니다.',
          type: 'editor',
        },
      },
    };
  },
  computed: {
    /** @returns {boolean} */
    disableConfirm() {
      return false; // todo
    },
  },
  async mounted() {
    await this.initOptionValues(this.forms);
  },
  methods: {
    ...mapActions(['pushMessage']),
    async initOptionValues(forms) {
      const names = Object.keys(forms);
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
        const formItem = forms[item.name];
        formItem.value = item.value;
        // console.log(
        //   `# initOptionValues - SiteOptionCinesopa.vue - pushed ${item.name}`,
        // );
        // if (formItem.type === 'file') {
        //   formItem.file.label = item.value.
        //   console.log(item.value);
        //   this.getFileInfo(item.value, formItem);
        // }
      });
    },
    // async getFileInfo(filename, formItem) {
    //   const res = await graphql(getFileInfoQuery, {
    //     filename,
    //   });
    //   // console.log('# getFileInfo - SiteOptionCinesopa.vue');
    //   // console.log(res);
    //   const { file } = res.data;
    //   if (file) {
    //     formItem.file.label = file.label;
    //     formItem.file.fileurl = file.fileurl;
    //     formItem.file.mimetype = file.mimetype;
    //   }
    // },
    async confirmClicked() {
      // console.log('# confirmClicked');
      // console.log(this.form);
      const inputs = Object.keys(this.forms).map(
        (name) =>
          // const { type, value } = this.form[name];
          // if (type === 'string') {
          ({
            name,
            value: this.forms[name].value,
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

.input-content input {
  width: auto;
}
// .input-item {
//   display: flex;
// }
</style>

<style>
</style>
