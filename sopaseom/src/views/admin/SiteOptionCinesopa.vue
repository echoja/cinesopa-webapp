<template>
  <div class="site-option-cinesopa">
    <header>
      <h2>씨네소파 사이트 정보 수정</h2>
    </header>
    <site-option-table>
      <site-option-row
        v-model="form.is_site_public.value"
        label="사이트 공개 여부"
        description="사이트를 공개한다면 사이트에 정상적으로 접근할 수 있습니다."
        type="single_checkbox"
        checkbox-label="사이트를 공개합니다."
      ></site-option-row>
      <site-option-row
        v-model="form.person.value"
        :fields-obj="typedef.person"
        label="사람들"
        description="회사 소개에서 함께하는 사람들에
        들어갈 사람들의 정보입니다. 씨네소파 구성원의 정보를
        작성하면 됩니다."
        type="table"
      ></site-option-row>
      <site-option-row
        v-model="form.history.value"
        :fields-obj="typedef.history"
        label="연혁"
        description="회사 소개에서 연혁에 들어갈 내용입니다. 나중에 보여질 때 날짜를 기준으로 자동으로 정렬되므로, 순서는 상관이 없습니다."
        type="table"
      ></site-option-row>
    </site-option-table>
    <hr />
    <b-button :disabled="disableConfirm" @click="confirmClicked"
      >변경사항 저장</b-button
    >
    <!-- <pre v-html="prettied"></pre> -->
  </div>
</template>

<script>
import { BButton, VBToggle } from 'bootstrap-vue';
import {
  siteOptionsQuery,
  graphql,
  getFileInfoQuery,
  makeSimpleMutation,
} from '@/api/graphql-client';

import { mapActions } from 'vuex';

const setSiteOptionsMutationReq = makeSimpleMutation('setSiteOptions');

export default {
  components: {
    BButton,
    SiteOptionRow: () => import('@/components/admin/SiteOptionRow.vue'),
    SiteOptionTable: () => import('@/components/admin/SiteOptionTable.vue'),
  },
  directives: {
    'b-toggle': VBToggle,
  },
  name: 'SiteOptionCinesopa',
  data() {
    return {
      typedef: {
        person: {
          name: {
            type: 'string',
            label: '이름',
            description: '실제 사람의 이름을 적습니다.',
          },
          nickname: {
            type: 'string',
            label: '닉네임',
          },
          position: {
            type: 'string',
            label: '직급',
            description: '회사 내 직급이 있을 경우 적습니다. 예: 대표',
          },
          work: {
            type: 'string',
            label: '직무',
            description: '어떤 일을 하는지에 관하여 적습니다. 예: 홍보마케팅',
          },
          email: {
            type: 'string',
            label: '이메일',
          },
          phone: {
            type: 'string',
            label: '전화번호',
          },
          image: {
            type: 'file',
            label: '이미지',
            description:
              '손글씨 이미지를 설정합니다. 최대 크기는 400px * 200px 이고, 이미지의 비율이 맞지 않아도 칸에 올바르게 배치됩니다.',
          },
        },
        history: {
          date: {
            type: 'date',
            label: '날짜',
          },
          content: {
            type: 'string',
            label: '내용',
          },
        },
      },
      testTableFields: {
        id: {
          type: 'string',
          label: '식별자',
          description:
            '내부적으로 구분짓기 위한 고유 id 값입니다. 겹치지만 않도록 1, 2, 3, 4... 로 설정해주시면 됩니다.',
          editable: true,
        },
        name: {
          type: 'file',
          label: '이름',
          description: '실제 사람의 이름을 적는 곳입니다.',
          editable: true,
        },
      },
      form: {
        person: {
          label: '사람들',
          type: 'table',
          value: [],
        },
        history: {
          label: '연혁',
          type: 'table',
          value: [],
        },
        is_site_public: {
          label: '사이트 공개 여부',
          value: null,
          type: 'single_checkbox',
          description: '공개합니다',
        },
      },
    };
  },
  computed: {
    /** @returns {boolean} */
    disableConfirm() {
      return false; // todo
    },
    // prettied() {
    //   return prettyPrintJson.toHtml(this.form);
    // },
  },
  async mounted() {
    await this.initOptionValues();
  },
  methods: {
    ...mapActions(['pushMessage']),
    async initOptionValues() {
      const { form } = this;
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
    sortHistory() {
      // console.log('# SiteOptionCinesopa sortHistory value');
      // console.log(this.form.history.value);
      const hiv = Array.from(this.form.history.value);
      hiv.sort((a, b) => (a.date > b.date ? 1 : -1));
      this.form.history.value = hiv;
      // console.log(hiv);
    },
    async confirmClicked() {
      this.sortHistory();

      // console.log('# confirmClicked');
      // console.log(this.form);
      const inputs = Object.keys(this.form).map((name) => ({
        name,
        value: this.form[name].value,
      }));
      // console.log(inputs);
      const inputsFlatted = inputs.flat(Infinity);
      // console.log(inputsFlatted);
      const filtered = inputsFlatted.filter((item) => item.value !== null);
      // console.log(filtered);
      // const res =

      const res = await setSiteOptionsMutationReq(
        { inputs: filtered },
        `
      {name, success, code}
      `,
      );
      // console.log('# SiteOptionCinesopa confirmClicked res');
      // console.log(res);
      // const result = res.data.setSiteOptions;
      // console.log(result);
      if (res.every((item) => item.success === true)) {
        this.pushMessage({
          type: 'success',
          msg: '설정을 성공적으로 업데이트 했습니다.',
          id: 'siteOptionUpdateSuccess',
        });
      } else {
        const failMessage = res
          .filter((item) => !item.success)
          .map((item) => `${item.name}(${item.code})`)
          .join(', ');
        this.pushMessage({
          type: 'danger',
          msg: `다음 설정을 업데이트하지 못했습니다 > ${failMessage}`,
          id: 'getSiteOptionFailed',
        });
      }
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
