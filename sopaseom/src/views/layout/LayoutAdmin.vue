<template>
  <div>
    <p class="error-msg" v-if="hasErrorMsg">{{ errorMsg }}</p>
    <div class="d-flex bd-highlight mb-3">
      <div class="p-2 sidebar bd-highlight">
        <b-list-group>
          <b-list-group-item to="/admin"> 대시보드 </b-list-group-item>
          <b-list-group-item to="/admin/statistics"> 통계 </b-list-group-item>
          <b-list-group-item to="/admin/file">
            <span>파일</span>
            <info>
              파일 관리자를 엽니다. 파일을 업로드하여 추후에 에디터에서 이미지를
              삽입하거나 첨부파일을 만들 수 있습니다.
            </info>
          </b-list-group-item>
          <b-list-group-item class="py-1 bg-light">
            <span>cinesopa.kr</span>
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/site">
            <span>사이트 정보</span>
            <info>
              <code>cinesopa.kr</code> 사이트의 정보들을 설정합니다.
            </info>
          </b-list-group-item>
          <!-- <b-list-group-item to="/admin/cinesopa/page">
            <span>페이지</span>
          </b-list-group-item> -->
          <b-list-group-item to="/admin/cinesopa/board">
            <span>게시판</span>
            <info>
              게시판의 링크나 제목 등을 설정합니다. 메뉴 설정은 할 수 없고 글을
              추가하려면 <code>글</code> 에서 게시글을 작성할 수 있습니다.
            </info>
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/post">
            <span> 글 </span>

            <info> 게시판의 글을 작성/수정/삭제합니다. </info>
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/film">
            <span>영화</span>
            <info>
              영화와 관련된 정보를 추가/편집/삭제합니다. 여기서 관리하는
              데이터들이
              <code>sopaseom</code> 사이트에도 동일하게 적용됩니다.
            </info>
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
            <info>
              <code>sopaseom.com</code> 사이트의 정보들을 설정합니다. 다만
              개인정보처리방침, 이용약관 등은 페이지에서 설정할 수 있습니다.
            </info>
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/page">
            <span>페이지</span>
            <info> 개인정보처리방침, 이용약관 등을 설정합니다. </info>
          </b-list-group-item>
          <b-list-group-item :to="{ name: 'AdminSopakit' }">
            <span>소파킷 키워드</span>
            <info> 소파킷의 키워드를 추가/편집/삭제할 수 있습니다. </info>
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/product">
            <span> 소파킷 상품</span>
            <info>
              소파킷 상품을 편집합니다. 소파킷과 연계된 영화는
              <u>cinesopa 의 영화</u>에서, 키워드는 소파킷 키워드에서 설정할 수
              있습니다.
            </info>
          </b-list-group-item>
          <b-list-group-item :to="{ name: 'AdminOrders', query: { a: 123 } }">
            <span>주문</span>
            <info> 소파킷 상품의 주문을 관리합니다. </info>
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/application">
            <span>상영 신청</span>

            <info> 공동체 상영 신청을 관리합니다. </info>
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/user">
            <span>사용자</span>
            <info> 회원을 관리합니다. </info>
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
        </div>

        <main class="admin-main">
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
import Info from '@/components/admin/Info.vue';
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
    Info,
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
    async onSuccessMsg() {
      // alert(msg);
    },
    async messageDismissed(id) {
      this.removeMessage({ id });
    },
  },
  data: () => ({
    messageDuraton: 2000,
  }),
};
</script>
<style lang="scss" scoped>
.info-hover-component {
  margin-left: 5px;
}
</style>

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

.btn-primary:hover:not(:disabled):not(.disabled) {
  color: #fff;
  background-color: #555;
  border-color: black;
}

.admin-main header > h2 {
  font-size: 18px;
  font-weight: bold;
}
</style>
