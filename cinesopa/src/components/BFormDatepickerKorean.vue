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
    label-nav="달력 열기"
    label-help="방향키를 이용하여 날짜를 선택하세요"
    value-as-date
    @input="onInput"
  >
    <template #button-content>
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
  },
  methods: {
    onInput(value) {
      console.log('# BFormDatepickerKorean onInput');
      console.log(value);
      this.$emit('input', value);
    },
    // hoverButton(event) {
    //   console.log('# BFormDatepickerKorean hoverButton');
    //   console.log(event);
    // },
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