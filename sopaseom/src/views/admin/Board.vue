<template>
  <div>
    <header class="p-3">
      <h2>게시판 목록</h2>
    </header>

    <b-table :items="boards" :fields="boardFields" @row-clicked="rowClicked">
      <template #cell(permalink)="row">
        <div class="text-monospace">
          {{ row.value }}
        </div>
      </template>
      <template #cell(actions)="row">
        <!-- <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Info modal
        </b-button> -->
        <b-button
          variant="light"
          size="sm"
          @click="row.toggleDetails"
          :disabled="row.detailsShowing"
          class="p-2 mr-2"
        >
          수정
        </b-button>
        <b-button
          variant="light"
          size="sm"
          @click="remove(row.item.id)"
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
            <b-form-group id="input-permalink-group" label="링크" label-for="input-permalink">
              <b-form-input
                id="input-permalink"
                name="input-permalink"
                type="text"
                :value="row.item.permalink"
                @input="onInput(row)"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-title-group" label="제목" label-for="input-title">
              <b-form-input
                id="input-title"
                name="input-title"
                type="text"
                :value="row.item.title"
                @input="onInput(row)"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-description-group" label="설명" label-for="input-description">
              <b-form-input
                id="input-description"
                name="input-description"
                type="text"
                :value="row.item.description"
                @input="onInput(row)"
              ></b-form-input>
            </b-form-group>
            <b-button-group>
              <b-button :disabled="!row.item.changed" type="submit" variant="success"
                >적용</b-button
              >
              <b-button @click="row.toggleDetails">취소</b-button>
            </b-button-group>
          </b-form>
        </div>
      </template>
    </b-table>
    <p v-if="!hasData">게시판이 없습니다.</p>
    <hr />
    <b-button variant="primary">새로 추가</b-button>
    <div>Board</div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { store } from '../../loader';
/**
 * 
 * 
index	{Number}	The row's index (zero-based) with respect to the displayed rows
item	Object	The row's item data object
value	Any	The value for this key in the record (null or undefined if a virtual column), or the output of the field's formatter function
unformatted	Any	The raw value for this key in the item record (null or undefined if a virtual column), before being passed to the field's formatter function
field	Object	The field's normalized definition object (from the fields prop)
detailsShowing	Boolean	Will be true if the row's row-details scoped slot is visible
toggleDetails	Function	Can be called to toggle the visibility of the rows row-details scoped slot
rowSelected	Boolean	Will be true if the row has been selected. Only applicable when table is in selectable mode
selectRow v2.1.0+	Function	Can be called to select the current row. Only applicable when table is in selectable mode
unselectRow v2.1.0+	Function	Can be called to unselect the current row. Only applicable when table is in selectable mode
 */
// import { mapState } from 'vuex';

export default {
  name: 'Board',
  data() {
    return {
      state: {
        dataLoaded: false,
      },
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
      boards: [
        {
          id: 1,
          permalink: 'test',
          title: '제목입니다',
          description: '설명입니다',
          changed: false,
        },
      ],
    };
  },
  computed: {
    hasData() {
      return this.boards.length !== 0;
    },
  },
  methods: {
    ...mapActions(['pushMessage']),
    async info() {
      //
    },
    async rowClicked() {
      //
    },
    async remove(id) {
      console.log(`removing! ${id}`);
    },
    async onSubmit(row) {
      console.log('onSubmit!');
      console.log(row);
      // this.$emit('successMsg', '호에엥');
      store.dispatch('pushMessage', {
        type: 'success',
        id: 'boardSubmitSuccess',
        msg: '성공했습다!',
      });
    },
    async onInput(row) {
      console.log('onchange!');
      console.log(row);
      const found = this.boards.find((board) => {
        return board.id === row.item.id;
      });
      if (found) found.changed = true;
      else console.log('찾지 못했습니다.. ');
    },
    async onReset(row) {
      //
    },
  },
};
</script>

<style></style>
