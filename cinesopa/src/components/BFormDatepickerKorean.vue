<template>
  <!-- class="underlined-box" -->
  <!-- @input="onInput" -->
  <!-- <div> -->
  <!-- v-bind="$attrs" -->
  <b-form-datepicker
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
    @input="onInput"
    @shown="onShown"
    @hidden="onHidden"
    @context="onContext"
  >
    <template #button-content>
      <span class="sr-only">{{ title }}</span>
      <font-awesome-icon
        class="button-icon"
        :icon="['far', 'calendar']"
      ></font-awesome-icon>
    </template>
  </b-form-datepicker>
  <!-- {{ $attrs }}
  {{ $props }}
    {{ $listeners }}
  </div> -->
</template>

<script>
import { BFormDatepicker } from 'bootstrap-vue';

export default {
  components: {
    BFormDatepicker,
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
    };
  },
  mounted() {
    // 가장 바깥쪽 버튼에 title 추가
    this.$nextTick(() => {
      const datepicker = this.$refs.datepicker.$el;
      // console.log('# BFormDatepickerKorean mounted');
      // console.log(element);
      /** @type {HTMLElement} */
      const button = datepicker.getElementsByTagName('button')[0];
      // console.log(button);
      button.setAttribute('title', this.title);
    });

    // keydown 없애기 ... 불가능
    // this.nextTick(() => {
    //   this.$refs.datepicker.$children[0].$children[0].$off('keydown');
    // });
  },
  methods: {
    onInput(value) {
      // console.log('# BFormDatepickerKorean onInput');
      // console.log(value);
      this.$emit('input', value);
    },
    // hoverButton(event) {
    //   console.log('# BFormDatepickerKorean hoverButton');
    //   console.log(event);
    // },
    removeAria() {
      const datepicker = this.$refs.datepicker.$el;
      /** @type {Element} */

      const removeMap = {
        'dropdown-menu': ['aria-modal', 'x-placement'],
        btn: ['aria-keyshortcuts', 'aria-expanded', 'aria-haspopup'],
        'b-calendar-nav': ['aria-keyshortcuts'],
        'b-calendar-grid': [
          'aria-activedescendant',
          'aria-roledescription',
          'role',
        ],
        'b-calendar-grid-caption': ['aria-live', 'aria-atomic'],
      };

      Object.keys(removeMap).forEach((key) => {
        const elements = datepicker.getElementsByClassName(key);
        elements.forEach((element) => {
          removeMap[key].forEach((attrName) => {
            element.removeAttribute(attrName);
          });
        });
      });

      // role button 에 title 추가
      const buttons = datepicker.querySelectorAll('div[role="button"]');
      // console.log('# BFormDatepickerKorean removeAria buttons');
      // console.log(buttons);
      buttons.forEach((button) => {
        const number = button.querySelector('span').textContent;
        button.setAttribute('title', number);
      });
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
    // 사용안함
    onButtonKeyDown(event) {},

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
  },
};
</script>

<style lang="scss" scoped>
.button-icon:hover {
  opacity: 0.8;
}
</style>

<style>
</style>
