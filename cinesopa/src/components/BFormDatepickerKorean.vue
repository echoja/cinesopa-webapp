<template>
  <!-- class="underlined-box" -->
  <!-- @input="onInput" -->
  <!-- <div> -->
  <!-- v-bind="$attrs" -->
  <div class="calendar-wrapper">
    <div
      class="b-form-datepicker-korean"
      ref="container"
      :aria-label="`${title} - ${hiddenButtonText}`"
    >
      <!-- tabindex="0" -->
      <!-- @focus="onContainerFocus"-->
      <!-- <b-form-datepicker
      :value="value"
      :required="required"
      :id="id"
      :date-disabled-fn="dateDisabledFn"
      v-on="$listeners"
      ref="datepicker"
      placeholder="클릭하여 날짜 선택"
      label-today-button="오늘 날짜"
      label-reset-button="재설정"
      label-close-button="닫기"
      label-prev-year="이전해"
      label-prev-month="이전달"
      label-current-month="현재달"
      label-next-month="다음달"
      label-next-year="다음해"
      label-today="오늘"
      label-selected="선택된 날짜"
      label-no-date-selected="날짜가 선택되지 않았습니다"
      label-calendar="달력"
      label-nav="이동하기"
      label-help="방향키를 이용하여 날짜를 선택하세요"
      value-as-date
      @input="onCalendarInput"
    > -->
      <!-- @shown="onShown" -->
      <!-- @hidden="onHidden" -->
      <!-- @context="onContext"  -->
      <!-- <template #button-content>
        <span class="sr-only">{{ title }}</span>
        <font-awesome-icon
          class="button-icon"
          :icon="['far', 'calendar']"
        ></font-awesome-icon>
      </template>
    </b-form-datepicker> -->
      <!-- <b-link
      class="show-calendar-button"
      variant="outline-secondary"
      ref="dropdownButton"
      @click="onButtonClicked"
    >
      <span class="sr-only">{{ hiddenButtonText }}</span>
      <span aria-hidden="true">
        <font-awesome-icon
          class="button-icon"
          :icon="['far', 'calendar']"
        ></font-awesome-icon>
        {{ buttonText }}
      </span>
    </b-link> -->

      <!-- <b-dropdown
      :id="dropdownId"
      @shown="onDropdownShown"
      ref="dropdown"
      variant="outline-secondary"
      class="datepicker-korean"
    > -->
      <!-- 버튼 내용 -->
      <!-- <b-calendar
        v-show="show"
        :value="value"
        :id="id"
        :date-disabled-fn="dateDisabledFn"
        v-on="$listeners"
        ref="calendar"
        class="absolute-calendar"
        label-today-button="오늘 날짜"
        label-reset-button="재설정"
        label-close-button="닫기"
        label-prev-year="이전해"
        label-prev-month="이전달"
        label-current-month="현재달"
        label-next-month="다음달"
        label-next-year="다음해"
        label-today="오늘"
        label-selected="선택된 날짜"
        label-no-date-selected="날짜가 선택되지 않았습니다"
        label-calendar="달력"
        label-nav="이동하기"
        label-help="방향키를 이용하여 날짜를 선택하세요"
        value-as-date
        @selected="onCalendarSelected"
        @input="onCalendarInput"
      >
      </b-calendar> -->
      <div class="select-box" :id="id" tabindex="-1">
        <b-form-select :title="`${title}, 년도 선택`" v-model="year" :options="yearOptions" :required="required">
        </b-form-select>
        <b-form-select :title="`${title}, 월 선택`" v-model="month" :options="monthOptions" :required="required">
        </b-form-select>
        <b-form-select :title="`${title}, 일 선택`" v-model="date" :options="dateOptions" :required="required">
        </b-form-select>
      </div>
      <!-- 
      <b-dropdown-item>First Action</b-dropdown-item>
      <b-dropdown-item>Second Action</b-dropdown-item>
      <b-dropdown-item>Third Action</b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item active>Active action</b-dropdown-item>
      <b-dropdown-item disabled>Disabled action</b-dropdown-item> -->
      <!-- </b-dropdown> -->
    </div>
  </div>
  <!-- {{ $attrs }}
  {{ $props }}
    {{ $listeners }}
  </div> -->
</template>

<script>
import {
  BDropdown,
  // BDropdownItem,
  BFormDatepicker,
  BCalendar,
  BButton,
  BLink,
} from 'bootstrap-vue';
import moment from 'moment';

let uid = 0;

export default {
  components: {
    BFormDatepicker,
    BDropdown,
    // BDropdownItem,
    BCalendar,
    BButton,
    BLink,
  },
  props: {
    value: [String, Date],
    required: Boolean,
    id: String,
    dateDisabledFn: Function,
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentContext: null,
      allowKeyUp: false,
      keyDowned: false,
      contextChangedCount: 0,
      showTime: 0,
      internalId: 0,
      show: true,
      year: null,
      month: null,
      date: null,
    };
  },
  computed: {
    dropdownId() {
      return `calendar-dropdown-${this.internalId}`;
    },
    dateFormatted() {
      return moment(this.value).format('YYYY년 M월 D일');
    },
    buttonText() {
      return this.value === null ? '클릭하여 날짜 선택' : this.dateFormatted;
    },
    hiddenButtonText() {
      return this.value === null
        ? '날짜가 선택되지 않았습니다'
        : `선택된 날짜: ${this.dateFormatted}`;
    },
    yearOptions() {
      const standard = new Date().getFullYear();
      const options = [];
      for (let i = standard; i < standard + 5; i += 1) {
        options.push({ value: i, text: `${i}년` });
      }
      return options;
    },
    monthOptions() {
      const options = [];
      for (let i = 1; i <= 12; i += 1) {
        options.push({ value: i, text: `${i}월` });
      }
      return options;
    },
    isYoon() {
      if (!this.year) {
        return false;
      }
      if (this.year % 400 === 0) {
        return true;
      }
      if (this.year % 100 === 0) {
        return false;
      }
      if (this.year % 4 === 0) {
        return true;
      }
      return false;
    },
    dateOptions() {
      if (this.month === null) {
        return [{ value: null, text: '' }];
      }
      const options = [];
      for (let i = 1; i <= 31; i += 1) {
        options.push({ value: i, text: `${i}일` });
      }
      if ([2, 4, 6, 9, 11].includes(this.month)) {
        options.splice(-1, 1);
      }

      if (this.month === 2) {
        options.splice(-2, 2);
      }

      if (this.isYoon) {
        options.push({ value: 29, text: '29일' });
      }

      return options;
    },
  },
  watch: {
    year() {
      this.checkAndEmitInput();
    },
    month() {
      this.checkAndEmitInput();
    },
    date() {
      this.checkAndEmitInput();
    },
  },
  created() {
    this.internalId = `${uid}`;
    uid += 1;
  },
  mounted() {
    // 가장 바깥쪽 버튼에 title 추가
    this.$nextTick(() => {
      // const datepicker = this.$refs.datepicker.$el;
      // console.log('# BFormDatepickerKorean mounted');
      // console.log(element);
      // /** @type {HTMLElement} */
      // const button = datepicker.getElementsByTagName('button')[0];
      // // console.log(button);
      // button.setAttribute('title', this.title);
      // 충돌을 일으키는 aria 삭제
      // this.removeAria();
    });

    // keydown 없애기 ... 불가능
    // this.nextTick(() => {
    //   this.$refs.datepicker.$children[0].$children[0].$off('keydown');
    // });
  },
  methods: {
    checkAndEmitInput() {
      if (this.year && this.month && this.date) {
        this.$emit('input', new Date(this.year, this.month, this.date));
      }
      return null;
    },
    // onInput(value) {
    //   // console.log('# BFormDatepickerKorean onInput');
    //   // console.log(value);
    //   this.$emit('input', value);
    // },
    // hoverButton(event) {
    //   console.log('# BFormDatepickerKorean hoverButton');
    //   console.log(event);
    // },
    removeAria() {
      // const datepicker = this.$refs.datepicker.$el;
      /** @type {Element} */

      // const removeMap = {
      //   'dropdown-menu': ['aria-modal', 'x-placement'],
      //   btn: ['aria-keyshortcuts', 'aria-expanded', 'aria-haspopup'],
      //   'b-calendar-nav': ['aria-keyshortcuts'],
      //   'b-calendar-grid': [
      //     'aria-activedescendant',
      //     'aria-roledescription',
      //     'role',
      //   ],
      //   'b-calendar-grid-caption': ['aria-live', 'aria-atomic'],
      // };

      // 속성 추가
      const calendar = this.$refs.calendar.$el;
      // const removeMap = {
      //   btn: [{'aria-hidden': 'true'}],
      // };

      // Object.keys(removeMap).forEach((key) => {
      //   const elements = calendar.getElementsByClassName(key);
      //   elements.forEach((element) => {
      //     removeMap[key].forEach((attr) => {
      //       element.removeAttribute(attrName);
      //     });
      //   });
      // });
      // const elements = calendar.querySelectorAll('.b-calendar-grid-body div[role="button"]');
      // console.log(elements);
      // elements.forEach((element) => {
      //   element.setAttribute('aria-hidden', true);
      // });

      // // role button 에 title 추가.
      // const buttons = datepicker.querySelectorAll('div[role="button"]');
      // // console.log('# BFormDatepickerKorean removeAria buttons');
      // // console.log(buttons);
      // buttons.forEach((button) => {
      //   const number = button.querySelector('span').textContent;
      //   button.setAttribute('title', number);
      // });

      // header 삭제
      const header = this.$refs.calendar.$el.querySelector('.b-calendar-nav');
      header.parentNode.removeChild(header);
      // console.log('123');
      // header.remove();
    },
    onShown(event) {
      const datepicker = this.$refs.datepicker.$el;
      const grid = datepicker.querySelector('.b-calendar-grid');
      grid.addEventListener('keyup', this.onKeyUp);
      grid.addEventListener('keydown', this.onKeyDown);
      this.$nextTick(() => {
        this.removeAria();
      });
      console.log('onShown');
      console.log(event);
      // keyUP 보정 초기화!!
      this.keyDowned = false;
      this.allowKeyUp = false;

      // enter 키가 연속으로 눌려지지 않도록 시간을 재서 enter 를 누름.
      this.showTime = new Date().getTime();
    },
    onHidden(event) {
      const datepicker = this.$refs.datepicker.$el;
      const grid = datepicker.querySelector('.b-calendar-grid');
      grid.removeEventListener('keyup', this.onKeyUp);
      grid.removeEventListener('keydown', this.onKeyDown);
    },
    onContext(context) {
      // console.log('# BFormDatepickerKorean context');
      // console.log(context);
      this.currentContext = context;
      // console.log(this.currentContext);
      this.$nextTick(() => {
        this.removeAria();
      });
      this.contextChangedCount += 1;
    },
    // keyDown 감지. 만약 keyDown 이 된다면
    // keyUp이 패스가 됨.
    onKeyDown(event) {
      // console.log('# BFormDatepickerKorean keydown');
      // console.log(event);
      this.keyDowned = true;
    },
    onKeyUp(event) {
      console.log('# BFormDatepickerKorean keyup');
      console.log(event);
      console.log(this.$refs.datepicker);
      console.log({ keyDowned: this.keyDowned, allowKeyUp: this.allowKeyUp });
      // const {
      //   onKeydownWrapper,
      // } = this.$refs.datepicker.$children[0].$children[0];

      if (this.keyDowned === false) {
        const newE = new KeyboardEvent('keydown', {
          key: event.key,
          keyCode: event.keyCode,
        });
        const newE2 = new KeyboardEvent('keydown', {
          key: event.key,
          keyCode: event.keyCode,
        });
        // console.log(newE);
        this.$refs.datepicker.$children[0].$children[0].onKeydownWrapper(newE);
        if (new Date().getTime() - this.showTime > 1000) {
          this.$refs.datepicker.$children[0].$children[0].onKeydownGrid(newE2);
        }
        // onKeydownWrapper(newE);
        // console.log('you got key up!!!');
        this.currentContext = null;
        // console.log(this.currentContext);
        // grid.dispatchEvent(newE);
      }
    },
    onContainerFocus() {
      const output = this.$refs.calendar.$el.querySelector('output');
      output.focus();
    },
    onDropdownShown() {
      this.$nextTick(() => {
        // this.$refs.calendar.focus();
      });
    },
    onCalendarInput(value) {
      this.$emit('input', value);
    },
    onCalendarSelected(value) {
      console.log('# BFormDatepickerKorean onCalendarSelected');
      // console.log(this.$refs.dropdown);
      // this.$root.$emit('bv::dropdown::hide', this.dropdownId);
      // this.$refs.dropdown.hide();

      // 창 닫기
      // this.show = !this.show;

      // 창 닫은 후 버튼 포커싱
      this.$nextTick(() => {
        // this.$refs.dropdown.$refs.toggle.focus();
        // this.$refs.dropdownButton.focus();
        this.$refs.container.focus();
      });
    },
    onButtonClicked() {
      console.log('# BFormDatepickerKorean onButtonClicked');

      this.show = !this.show;
      // 만약 현재 창이 보이는 상태라면 calendar focus.
      if (this.show) {
        this.$nextTick(() => {
          console.log(this.$refs.calendar);
          this.$refs.container.focus();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-icon:hover {
  opacity: 0.8;
}
.button-icon {
  margin-right: 10px;
}

.b-form-datepicker-korean {
  position: relative;

  &:focus {
    outline: 2px solid #000;
  }
  width: auto;
}

.show-calendar-button {
  border-color: #ced4da;
}

// .absolute-calendar {
//   position: absolute;
//   left: 0;
//   top: 0;
//   transform: translate(0, 38px);
//   z-index: 1000;
//   background-color: #fff;
//   border: 1px solid #ced4da;
// }
.calendar-wrapper {
  display: flex;
}
.select-box {
  display: flex;
  select {
    margin-right: 10px;
  }
  &:focus {
    outline: 2px solid #000;
  }
}

</style>

<style lang="scss">
.datepicker-korean {
  .btn {
    border-color: #ced4da;
  }
  .dropdown-menu {
    padding: 0;
  }
  .b-calendar-header .form-control {
  }
}

.calendar-wrapper {
  border: 0 !important;
}
</style>
<style>
</style>
