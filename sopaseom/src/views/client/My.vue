<template>
  <div class="my">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>마이페이지</h1>
      </div>
    </page-header>

    <div class="wrapper">
      <div class="sidebar-wrapper">
        <div class="sidebar">
          <ul>
            <li v-for="(item, itemIndex) in sidebarLinks" :key="itemIndex">
              <link-strikethrough :to="item.to">{{
                item.label
              }}</link-strikethrough>
            </li>
          </ul>
        </div>
      </div>
      <div class="content-wrapper">
        <transition name="my-slide" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <!-- <pre>
        {{ currentUser }}
    </pre>
    <div class="test">
      <p>This is Special!!! wow~</p>

      <p>email : {{ currentUser.email }}</p>
      <p>role: {{ currentUser.role }}</p>
      <p>name: {{ currentUser.name }}</p>
      <p>c_date: {{ currentUser.c_date }}</p>
    </div> -->

    <!-- <router-link :to="{ name: 'Logout' }" tag="b-button">로그아웃</router-link> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { BLink } from 'bootstrap-vue';

export default {
  name: 'My',
  components: {
    BLink,
    LinkStrikethrough: () => import('@/components/LinkStrikethrough.vue'),
    PageHeader: () => import('@/components/PageHeader.vue'),
  },
  data() {
    return {
      a: 0,
      sidebarLinks: [
        {
          to: { name: 'MyInfo' },
          label: '회원정보',
        },
        {
          to: { name: 'MyOrdered' },
          label: '주문내역',
        },
        // {
        //   to: { name: 'MyApplication' },
        //   label: '상영 신청 내역',
        // }, 
        // todo: 상영 신청 내역은 상영 관련 데이터베이스를 짜고 나서 해야 함.
      ],
    };
  },
  computed: {
    ...mapState(['currentUser']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

$content-margin-top: 30px;

.my {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.wrapper {
  margin-top: $content-margin-top;
  flex: 1;
  display: flex;
  align-items: stretch;
}

.sidebar-wrapper {
  flex: 0 0 150px;
  padding-right: 30px;
  border-right: 2px solid #000;
  margin-right: 50px;
}

.sidebar {
  position: sticky;
  top: $content-margin-top + 2px + $desktop-header-height +
    $desktop-subheader-height;
  ul {
    padding: 0;
    list-style-type: none;
  }
  li {
    padding-bottom: 20px;
  }
  a {
    font-size: 20px;
    font-weight: bold;
  }
}

@include prevent-break-top0('.sidebar');

.content-wrapper {
  flex: 1;
}

/* *********************** */
/* **** AMINATION!!! ***** */
/* *********************** */

.my-slide-enter-active,
.my-slide-leave-active {
  transition-property: opacity;
  transition-property: height, opacity, margin, transform;
  transition-timing-function: ease;
  overflow: hidden;
}

.my-slide-enter-active {
  transition-duration: 1s;
}
.my-slide-leave-active {
  transition-duration: 0.3s;
}
.my-slide-enter {
  transform: translateX(20px);
  opacity: 0;
}
.my-slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>

<style></style>
