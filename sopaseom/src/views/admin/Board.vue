<template>
  <div>
    <header class="p-3">
      <h2>게시판 목록</h2>
    </header>

    <!-- 모달 -->
    <b-modal
      @ok="removeRow()"
      id="check-remove"
      title="삭제 확인"
      ok-title="삭제"
      ok-variant="danger"
      cancel-title="취소"
    >
      <p class="my-1">정말로 삭제하시겠습니까?</p>
    </b-modal>

    <b-table :items="boards" :fields="boardFields" @row-clicked="rowClicked" class="width-auto">
      <template #head(permalink)="{ label }">
        <span class="mr-2">{{ label }}</span>
        <info
          >게시판의 url을 결정할 때 사용되며, 동시에 게시판의 고유값입니다.
          (다른 게시판과 겹치면 안 됩니다.)</info
        >
      </template>
      <template #head(title)="{ label }">
        <span class="mr-2">{{ label }}</span>
        <info>게시판의 제목입니다.</info>
      </template>
      <template #head(description)="{ label }">
        <span class="mr-2">{{ label }}</span>
        <info>
          게시판의 설명입니다. (현재 나타나는 화면은 없습니다.)
        </info>
      </template>
      <template #cell(permalink)="row">
        <div class="text-monospace">
          {{ row.value }}
        </div>
      </template>
      <template #cell(actions)="row">
        <!-- <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button>
        @click="removeRow(row)"
         -->
        <b-button
          variant="light"
          size="sm"
          @click="editRow(row)"
          :disabled="row.detailsShowing"
          class="p-2 mr-2"
        >
          수정
        </b-button>
        <b-button
          variant="light"
          size="sm"
          @click="removeCheck(row, $event.target)"
          :disabled="row.detailsShowing"
          class="p-2 mr-2"
        >
          삭제
        </b-button>
      </template>
      <template #row-details="row">
        <div>
          <!-- <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul> -->
          <b-form @submit.prevent.stop="onSubmit(row)" @reset="onReset">
            <b-form-group
              id="input-permalink-group"
              label="링크"
              label-for="input-permalink"
            >
              <b-form-input
                id="input-permalink"
                name="input-permalink"
                type="text"
                v-model="row.item.editForm.permalink"
                @input="onInput(row)"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-title-group"
              label="제목"
              label-for="input-title"
            >
              <b-form-input
                id="input-title"
                name="input-title"
                type="text"
                v-model="row.item.editForm.title"
                @input="onInput(row)"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-description-group"
              label="설명"
              label-for="input-description"
            >
              <b-form-input
                id="input-description"
                name="input-description"
                type="text"
                v-model="row.item.editForm.description"
                @input="onInput(row)"
              ></b-form-input>
            </b-form-group>
            <b-button-group>
              <b-button
                :disabled="!row.item.changed"
                type="submit"
                variant="success"
                >{{
                  row.item.submitAction === 'new' ? '확인' : '적용'
                }}</b-button
              >
              <b-button @click="cancelForm(row)">취소</b-button>
            </b-button-group>
            <div
              v-if="state.processing.create"
              class="h-25 d-flex p-2 justify-content-center align-items-center"
            >
              <b-spinner variant="secondary" class="m-2 small"></b-spinner>
              <p class="m-0">생성 중입니다.</p>
            </div>
            <div
              v-if="state.processing.update"
              class="h-25 d-flex p-2 justify-content-center align-items-center"
            >
              <b-spinner variant="secondary" class="m-2 small"></b-spinner>
              <p class="m-0">업데이트 중입니다.</p>
            </div>
          </b-form>
        </div>
      </template>
    </b-table>
    <p v-if="this.state.processing.get">로딩중입니다.</p>
    <p v-if="!hasData && !this.state.processing.get">게시판이 없습니다.</p>
    <hr />
    <b-button variant="primary" @click="newForm">새로 추가</b-button>
    <!-- <div>belongs_to: {{ belongs_to }}</div> -->
  </div>
</template>
<script>
/* eslint-disable no-tabs */
import {
  BButton,
  BButtonGroup,
  BTable,
  BSpinner,
  BForm,
  BFormGroup,
  BFormInput,
  BModal,
} from 'bootstrap-vue';
import { mapActions } from 'vuex';
import { queryString, graphql } from '@/loader';
import Info from '@/components/admin/Info.vue';

export default {
  name: 'Board',
  props: {
    belongs_to: String,
  },
  components: {
    BButton,
    BButtonGroup,
    BTable,
    BSpinner,
    BForm,
    BFormGroup,
    BFormInput,
    BModal,
    Info,
  },
  data() {
    return {
      state: {
        dataLoaded: false,
        processing: {
          get: false,
          remove: false,
          create: false,
          update: false,
        },
      },
      removingRow: null,
      temp_id: 9999,
      boardFields: [
        // {
        //   key: 'id',
        //   label: 'id',
        // },
        {
          key: 'permalink',
          label: '링크',
        },
        {
          key: 'title',
          label: '제목',
        },
        {
          key: 'description',
          label: '설명',
        },
        {
          key: 'actions',
          label: '행동',
        },
      ],
      /** @type {*} */
      boards: [
        {
          id: 1,
          permalink: 'test',
          title: '제목입니다',
          description: '설명입니다',
          editForm: {
            permalink: null,
            title: null,
            description: null,
          },
          changed: false,
          submitAction: 'edit',
        },
      ],
    };
  },
  computed: {
    /** @returns {boolean} */
    hasData() {
      return this.boards.length !== 0;
    },
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(['pushMessage']),
    pushMessage: mapActions(['pushMessage']).pushMessage,

    async fetchData() {
      this.state.processing.get = true;
      this.boards = [];
      const res = await graphql(queryString.board.boardsQuery, {
        belongs_to: this.belongs_to,
      });
      const { boards } = res.data;
      const table = [];
      for (const board of boards) {
        table.push(this.createBoardTableRow(board));
      }
      // console.log('TABLE!!!');
      // console.log(table);
      this.boards = table;
      this.state.processing.get = false;
    },

    createBoardTableRow(board) {
      // console.log('TABLE!!!');
      // console.log(board);
      const result = {
        ...board,
        editForm: {
          permalink: null,
          title: null,
          description: null,
        },
        changed: false,
        submitAction: 'edit',
      };
      return result;
    },

    async info() {
      //
    },
    async rowClicked() {
      //
    },
    async removeCheck(row, target) {
      this.removingRow = row;
      this.$root.$emit('bv::show::modal', 'check-remove', target);
    },
    async removeRow() {
      this.state.processing.remove = true;
      await this.removeBoard();
      this.state.processing.remove = false;
      // console.log(`removing! ${id}`);
    },
    async onSubmit(row) {
      if (row.item.submitAction === 'new') {
        this.state.processing.create = true;
        await this.createBoard(row);
        this.state.processing.create = false;
      } else {
        this.state.processing.create = true;
        await this.updateBoard(row);
        this.state.processing.create = false;
      }
      // console.log('onSubmit!');
      // console.log(row);
      // this.$emit('successMsg', '호에엥');
      // store.dispatch('pushMessage', {
      //   type: 'success',
      //   id: 'boardSubmitSuccess',
      //   msg: '성공했습다!',
      // });
    },
    async createBoard(row) {
      const { title, description, permalink } = row.item.editForm;
      const res = await graphql(queryString.board.createBoardMutation, {
        input: {
          title,
          description,
          permalink,
          belongs_to: this.belongs_to,
        },
      });
      // JSON.stringify(result)
      // console.log(res);
      if (res.data.createBoard) {
        this.pushMessage({
          type: 'success',
          msg: `${title} 게시판 생성 성공했습니다.`,
          id: 'successCreateBoard',
        });
      } else {
        this.pushMessage({
          type: 'warning',
          msg: `${title} 게시판 생성에 실패했습니다.`,
          id: 'failCreateBoard',
        });
      }
      // if (result)

      row.toggleDetails();
      this.fetchData();
      // console.log('createBoard!');
      // console.log(row);
    },
    async updateBoard(row) {
      const { title, description, permalink } = row.item.editForm;
      const res = await graphql(queryString.board.updateBoardMutation, {
        id: row.item.id,
        input: {
          title,
          description,
          permalink,
        },
      });
      // console.log(res);
      if (res.data.updateBoard) {
        this.pushMessage({
          type: 'success',
          msg: `${title} 게시판 업데이트에 성공했습니다.`,
          id: 'successUpdateBoard',
        });
      } else {
        this.pushMessage({
          type: 'warning',
          msg: `${title} 게시판 업데이트에 실패했습니다.`,
          id: 'failUpdateBoard',
        });
      }
      this.fetchData();
    },
    async removeBoard() {
      const row = this.removingRow;
      const res = await graphql(queryString.board.removeBoardMutation, {
        id: row.item.id,
      });
      if (res.data.removeBoard) {
        this.pushMessage({
          type: 'success',
          msg: `${row.item.title} 게시판 삭제가 성공했습니다.`,
          id: 'successRemoveBoard',
        });
      } else {
        this.pushMessage({
          type: 'warning',
          msg: `${row.item.title} 게시판 삭제가 실패했습니다.`,
          id: 'failRemoveBoard',
        });
      }
      this.fetchData();
      this.removingRow = null;
    },

    async onInput(row) {
      // console.log('onchange!');
      // console.log(row);
      const found = this.boards.find((board) => board.id === row.item.id);
      if (found) found.changed = true;
      else console.log('찾지 못했습니다.. ');
    },
    async onReset() {
      //
    },
    async newForm() {
      this.boards.push({
        id: this.temp_id,
        changed: false,
        submitAction: 'new',
        _showDetails: true,
        editForm: {
          permalink: null,
          title: null,
          description: null,
        },
      });
    },
    async editRow(row) {
      row.toggleDetails();
      const found = this.boards.find((board) => board.id === row.item.id);
      found.editForm.permalink = found.permalink;
      found.editForm.title = found.title;
      found.editForm.description = found.description;
    },
    async cancelForm(row) {
      row.toggleDetails();
      if (row.item.submitAction === 'new') {
        this.boards.splice(row.index, 1);
      }
    },
  },
};
</script>

<style></style>
