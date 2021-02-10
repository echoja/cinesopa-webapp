<template>
  <div>
    <p class="error-msg" v-if="hasErrorMsg">{{ errorMsg }}</p>
    <div class="d-flex bd-highlight mb-3">
      <div class="p-2 sidebar bd-highlight">
        <b-list-group>
          <b-list-group-item to="/admin"> 대시보드 </b-list-group-item>
          <b-list-group-item to="/admin/statistics"> 통계 </b-list-group-item>
          <b-list-group-item to="/admin/file"> 파일 <info description="파일 관리자를 엽니다. 파일을 업로드하여 추후에 에디터에서 이미지를 삽입하거나 첨부파일을 만들 수 있습니다."></info> </b-list-group-item>
          <b-list-group-item class="py-1 bg-light">
            cinesopa.kr
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/site">
            사이트 정보
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/page">
            페이지
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/board">
            게시판
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/post">글</b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/film">
            영화
          </b-list-group-item>
          <!-- <b-list-group-item to="/admin/cinesopa/menu">
            메뉴
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/design">
            디자인
          </b-list-group-item> -->
          <b-list-group-item class="py-1 bg-light">
            sopaseom.com
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/site">
            사이트 정보
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/page">
            페이지
          </b-list-group-item>
          <b-list-group-item :to="{ name: 'AdminSopakit' }">
            소파킷 키워드
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/product">
            소파킷 상품
          </b-list-group-item>
          <b-list-group-item :to="{ name: 'AdminOrders', query: { a: 123 } }">
            주문
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/application">
            상영 신청
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/user">
            사용자
          </b-list-group-item>
          <!-- <b-list-group-item to="/admin/sopaseom/menu">
            메뉴
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/design">
            디자인
          </b-list-group-item> -->

          <!-- makeListItem('/admin/statistics', '통계'), makeListItem(null, 'cinesopa.kr'),
          makeListItem('/admin/cinesopa/site', '사이트 정보'), makeListItem('/admin/cinesopa/page',
          '페이지'), makeListItem('/admin/cinesopa/board', '게시판'),
          makeListItem('/admin/cinesopa/post', '글'), makeListItem('/admin/cinesopa/film', '영화'),
          makeListItem('/admin/cinesopa/menu', '메뉴'), makeListItem('/admin/cinesopa/design',
          '디자인'), makeListItem(null, 'sopaseom.com'), makeListItem('/admin/sopaseom/site',
          '사이트 정보'), makeListItem('/admin/sopaseom/page', '페이지'),
          makeListItem('/admin/sopaseom/product', '소파킷'),
          makeListItem('/admin/sopaseom/application', '신청'), makeListItem('/admin/sopaseom/user',
          '사용자'), makeListItem('/admin/sopaseom/menu', '메뉴'),
          makeListItem('/admin/sopaseom/design', '디자인'), -->

          <!-- <b-list-group-item v-for="item in sidebar" :key="item.id" :to="item.to">
            {{ item.label }}
          </b-list-group-item> -->
        </b-list-group>
      </div>
      <div class="p-2 flex-grow-1 bd-highlight">
        <!-- <header class="p-2">
        </header> -->
        <b-navbar>
          <b-navbar-brand to="/">영화배급협동조합 씨네소파</b-navbar-brand>
          <b-navbar-nav>
            <b-nav-item-dropdown text="새로 추가" right>
              <b-dropdown-header>cinesopa.kr</b-dropdown-header>
              <b-dropdown-item :to="{ name: 'CinesopaNewPage' }"
                >페이지</b-dropdown-item
              >
              <b-dropdown-item :to="{ name: 'PostNew' }"
                >게시글</b-dropdown-item
              >
              <b-dropdown-item :to="{ name: 'FilmNew' }">영화</b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-header>sopaseom.com</b-dropdown-header>
              <b-dropdown-item :to="{ name: 'SopaseomNewPage' }"
                >페이지</b-dropdown-item
              >
              <b-dropdown-item :to="{ name: 'AdminProductNew' }"
                >소파킷</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-navbar>
        <div class="message-box fixed-top">
          <!-- <h2>
            {{ messages }}
          </h2> -->
          <!-- @dismissed="messageDismissed(msgObj.id)"
          @dismiss-count-down="countDownChanged" -->
          <transition-group name="fade">
            <div
              class="message-wrapper mx-auto w-50"
              v-for="msgObj in messages"
              :key="msgObj.id"
            >
              <b-alert :show="true" :variant="msgObj.type" dismissible>
                {{ msgObj.msg }}
              </b-alert>
            </div>
          </transition-group>
          <!-- @input="messageChanged($event, msgObj)" -->
        </div>

        <main>
          <router-view @successMsg="onSuccessMsg"></router-view>
        </main>
      </div>
    </div>

    <b-container fluid>
      <b-row>
        <b-col>
          <header>
            <!-- 어드민 헤더 -->
          </header>
        </b-col>
      </b-row>
      <b-row>
        <b-col col lg="2"> </b-col>
        <b-col>
          <main>
            <article></article>
            <aside>
              <!-- 연관 콘텐츠 -->
            </aside>
          </main>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <footer></footer>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import { BContainer, BCol, BRow, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mapState, mapActions } from 'vuex';
import {
  BContainer,
  BCol,
  BRow,
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BDropdownHeader,
  BListGroup,
  BListGroupItem,
  BAlert,
} from 'bootstrap-vue';
import { store } from '@/loader';
// const makeListItem = (to, label, color) => ({
//   id: to,
//   to,
//   label,
//   color,
// });

export default {
  name: 'LayoutAdmin',
  components: {
    BContainer,
    BCol,
    BRow,
    BNavbar,
    BNavbarBrand,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BDropdownHeader,
    BListGroup,
    BListGroupItem,
    BAlert,
    Info: () => import('@/components/admin/Info'),
  },
  computed: {
    ...mapState(['messages']),
    errorMsg() {
      // return store.state.messages;
      return null;
    },
    hasErrorMsg() {
      // return store.state.messages.length !== 0;
      return false;
    },
  },
  created() {
    // this.unsubscribe = store.subscribe((mutation /* , state */) => {
    //   if (mutation.type === 'pushMessage') {
    //     setTimeout(() => {
    //       this.removeMessage({ id: mutation.payload.id });
    //     }, this.messageDuraton);
    //     // // Do whatever makes sense now
    //     // if (state.status === 'success') {
    //     //   this.complex = {
    //     //     deep: 'some deep object',
    //     //   };
    //     // }
    //   }
    // });
  },
  beforeDestroy() {
    // this.unsubscribe();
  },
  methods: {
    ...mapActions(['removeMessage']),
    async someMethod() {
      // alert('hi');
    },
    async onSuccessMsg(msg) {
      // alert(msg);
    },
    async messageDismissed(id) {
      this.removeMessage({ id });
    },
    async messageChanged(a, b) {
      // console.log('mesageChanged');
      // console.log(a);
      // console.log(b);
    },
  },
  data: () => ({
    messageDuraton: 2000,
  }),
};
</script>

<style>
body {
  font-size: 14px;
}
.error-msg {
  background-color: #ddd;
}
.sidebar {
  min-width: 175px;
}
.message-box {
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  padding-top: 20px;
}

.router-link-exact-active {
  background-color: #dcf5ff;
}

/* .fade-enter-active, */
.fade-leave-active {
  transition: all 2s ease;
}

.fade-enter, .fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  /* transform: translateX(10px); */
  opacity: 0;
}

.btn-primary:hover {
  color: #fff;
  background-color: #555;
  border-color: black;
}
</style>
