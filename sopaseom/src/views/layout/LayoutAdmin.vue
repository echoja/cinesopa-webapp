<template>
  <b-container>
    <b-row>
      <b-col>
        <header>
          <p v-if="errorMsg">{{ errorMsg }}</p>
          <!-- 어드민 헤더 -->
        </header>
      </b-col>
    </b-row>
    <b-row>
      <b-col col lg="2">
        <b-list-group>
          <b-list-group-item to="/admin">
            대시보드
          </b-list-group-item>
          <b-list-group-item to="/admin/statistics">
            통계
          </b-list-group-item>
          <b-list-group-item to="/admin/file">
            파일
          </b-list-group-item>
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
          <b-list-group-item to="/admin/cinesopa/post">
            글
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/film">
            영화
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/menu">
            메뉴
          </b-list-group-item>
          <b-list-group-item to="/admin/cinesopa/design">
            디자인
          </b-list-group-item>
          <b-list-group-item class="py-1 bg-light">
            sopaseom.com
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/site">
            사이트 정보
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/page">
            페이지
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/product">
            소파킷
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/application">
            신청
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/user">
            사용자
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/menu">
            메뉴
          </b-list-group-item>
          <b-list-group-item to="/admin/sopaseom/design">
            디자인
          </b-list-group-item>

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
      </b-col>
      <b-col>
        <main>
          <article>
            <slot />
          </article>
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
</template>

<script>
import {
  BContainer, BCol, BRow, BListGroup, BListGroupItem,
} from 'bootstrap-vue';
import store from '../../store';

const makeListItem = (to, label, color) => ({
  id: to,
  to,
  label,
  color,
});

export default {
  name: 'LayoutAdmin',
  components: {
    'b-container': BContainer,
    'b-list-group': BListGroup,
    'b-list-group-item': BListGroupItem,
    'b-col': BCol,
    'b-row': BRow,
  },
  computed: {
    errorMsg() {
      return store.state.errorMsg;
    },
  },
  data: () => ({
    sidebar: [
      makeListItem('/admin', '대시보드'),
      makeListItem('/admin/statistics', '통계'),
      makeListItem(null, 'cinesopa.kr'),
      makeListItem('/admin/cinesopa/site', '사이트 정보'),
      makeListItem('/admin/cinesopa/page', '페이지'),
      makeListItem('/admin/cinesopa/board', '게시판'),
      makeListItem('/admin/cinesopa/post', '글'),
      makeListItem('/admin/cinesopa/film', '영화'),
      makeListItem('/admin/cinesopa/menu', '메뉴'),
      makeListItem('/admin/cinesopa/design', '디자인'),
      makeListItem(null, 'sopaseom.com'),
      makeListItem('/admin/sopaseom/site', '사이트 정보'),
      makeListItem('/admin/sopaseom/page', '페이지'),
      makeListItem('/admin/sopaseom/product', '소파킷'),
      makeListItem('/admin/sopaseom/application', '신청'),
      makeListItem('/admin/sopaseom/user', '사용자'),
      makeListItem('/admin/sopaseom/menu', '메뉴'),
      makeListItem('/admin/sopaseom/design', '디자인'),
    ],
  }),
};
</script>

<style scoped>
.router-link-exact-active {
  background-color: #dcf5ff;
}
</style>
