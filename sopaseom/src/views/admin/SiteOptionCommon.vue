<template>
  <div class="site-option-common">
    <header>
      <h2>관리 정보</h2>
    </header>

    <site-option-table>
      <site-option-row
        v-for="(option, optionName) in form"
        :key="optionName"
        :class="{ [`option-${optionName}`]: true }"
        v-model="option.value"
        :label="option.label"
        :description="option.description"
        :type="option.type"
        :fieldsObj="option.typedef"
      >
      </site-option-row>
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
  name: 'SiteOptionCommon',
  data() {
    return {
      form: {
        contact_email: {
          value: null,
          label: '씨네소파 대외용 이메일',
          type: 'string',
          description: '대외적으로 사용할 공식 이메일입니다. 사이트 하단 푸터 영역에 표시되거나 견적서 등의 정보로 들어갑니다.',
        },
        address: {
          label: '사무실 주소',
          value: null,
          type: 'string',
          description:
            '사이트를 방문하는 사람들 입장에서 볼 수 있는 사무실 주소입니다. 하단 푸터 영역에 표시됩니다. 상영 신청 견적서에도 사용됩니다.',
        },
        phone: {
          label: '사무실 전화번호',
          value: null,
          type: 'string',
          description: '사이트를 방문하는 사람들 입장에서 볼 수 있는 전화번호입니다. 하단 푸터 영역에 표시됩니다.',
        },
        cinesopa_license: {
          label: '씨네소파 사업자등록증',
          value: null,
          type: 'file',
          description:
          '씨네소파의 사업자등록증을 설정합니다. 상영신청서 관련 절차에 필요합니다.',
        },
        cinesopa_bank_account: {
          label: '씨네소파 통장',
          value: null,
          type: 'file',
          description: '씨네소파의 통장 사본을 설정합니다. 상영신청서 관련 절차에 필요합니다.',
        },
        distribution_application_email: {
          label: '배급의뢰 받을 이메일',
          value: null,
          type: 'table',
          description: '배급 의뢰를 받을 이메일을 설정합니다. 여러 개를 설정할 수 있습니다.',
          typedef: {
            email: {
              type: 'string',
              label: '이메일',
              description: '이메일을 작성합니다.',
            },
          },
        },
        show_application_email: {
          label: '공동체상영 신청 받을 이메일',
          value: null,
          type: 'table',
          description: '공동체 상영 신청을 받을 이메일 및 공동체 상영 관련 알림 메일을 설정합니다. 여러 개를 설정할 수 있습니다.',
          typedef: {
            email: {
              type: 'string',
              label: '이메일',
              description: '이메일을 작성합니다.',
            },
          },
        },
        shopping_email: {
          label: '상품 판매 관련 알림 받을 메일',
          value: null,
          type: 'table',
          description: '소파섬 판매와 같은 상품 관련 알림 메일을 설정합니다. 여러 개를 설정할 수 있습니다.',
          typedef: {
            email: {
              type: 'string',
              label: '이메일',
              description: '이메일을 작성합니다.',
            },
          },
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
        // if (formItem.type === 'file') {
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
