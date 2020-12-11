<template>
  <div class="container-fluid request">
    <h1 class="sr-only">신청하기</h1>
    <nav class="request-menu">
      <ol class="request-menu-list">
        <!-- linkRefMap[$route.name].$el.offsetLeft -->
        <div
          class="request-em"
          aria-hidden="true"
          :style="{
            left: `${currentNavEmLeft}px`,
            top: `${currentNavEmTop}px`,
            width: `${currentNavEmWidth}px`,
          }"
        ></div>
        <li class="request-menu-listitem">
          <b-link
            class="request-router-link smooth-hover"
            ref="link1"
            :to="{ name: 'Distribution' }"
            @focus="fixFocusScroll"
            @click="getBlur"
            >배급의뢰</b-link
          >
        </li>
        <li class="request-menu-listitem">
          <b-link
            class="request-router-link smooth-hover"
            ref="link2"
            :to="{ name: 'Community' }"
            @focus="fixFocusScroll"
            @click="getBlur"
            >상영신청</b-link
          >
        </li>
      </ol>
    </nav>

    <!-- <div role="heading" aria-level="1">This is a main page heading</div> -->

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { fixFocusScroll } from '@/util';

export default {
  name: 'Request',
  // title: '상영신청',
  data() {
    return {
      calendars: document.getElementsByClassName('b-form-datepicker'),
      linkRefMap: {
        Distribution: null,
        Community: null,
      },
    };
  },
  created() {
    //
  },

  $watch: {
    calendars(to) {
      console.log('# Request watch calendars');
      console.log(to);
    },
  },
  // created 시점에는 ref가 전부 undefined 이다.
  mounted() {
    this.linkRefMap.Distribution = this.$refs.link1;
    this.linkRefMap.Community = this.$refs.link2;
    this.giveTitleToCalendar();
  },

  // beforeDestroy() {
  //   console.log('beforeDestory!!');
  // },

  computed: {
    currentNavEmLeft() {
      return this.linkRefMap[this.$route.name]?.$el.offsetLeft + 4;
    },
    currentNavEmWidth() {
      return this.linkRefMap[this.$route.name]?.$el.offsetWidth - 8;
    },
    currentNavEmTop() {
      return this.linkRefMap[this.$route.name]?.$el.offsetHeight;
    },
  },
  methods: {
    fixFocusScroll,
    getBlur(e) {
      this.$nextTick(() => {
        document.activeElement.blur();
      });
    },
    giveTitleToCalendar() {
      this.$nextTick(() => {
        const calendars = document.getElementsByClassName('b-form-datepicker');
        console.log('# Request giveTitleToCalendar calendars');
        console.log(calendars);
        console.log(calendars.length);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../util.scss';

.request-menu-list {
  padding: 0;
  position: relative;
}

.request-menu-listitem {
  display: inline-block;
  margin-right: 30px;
  font-size: 50px;
  font-weight: 500;
}
.mobile .request-menu-listitem {
  font-size: 30px;
}

.request-router-link {
  @extend %smooth-hover;
  color: #767676;
  transition: 1s;

  &.router-link-active {
    color: #009eda;
  }
  &:hover {
    color: #009eda;
  }
}

.request-em {
  position: absolute;
  transition: 1s;
  background-color: #009eda;
  height: 2px;
  left: 0;
  width: 0;
}
</style>

<style lang="scss"></style>
