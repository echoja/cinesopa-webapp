<template>
  <div class="sitemap">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>사이트맵</h1>
      </div>
    </page-header>

    <div class="container-fluid sitemap-container">
      <div class="row">
        <div class="col-12 col-md-6 col-xl-3">
          <ul class="link-list">
            <li>
              <b-link :to="{ name: 'Home' }"> 홈 </b-link>
            </li>
            <li>
              <b-link :to="{ name: 'Login' }"> 로그인 </b-link>
            </li>
            <li>
              <b-link :to="{ name: 'Join' }"> 회원가입 </b-link>
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <ul class="link-list">
            <li>
              <b-link :to="{ name: 'My' }"> 마이페이지 </b-link>
              <ul>
                <li>
                  <b-link :to="{ name: 'MyInfo' }"> 회원정보 </b-link>
                </li>
                <li>
                  <b-link :to="{ name: 'MyOrdered' }"> 주문내역 </b-link>
                </li>
                <li>
                  <b-link :to="{ name: 'Cart' }"> 장바구니 </b-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <ul class="link-list">
            <li>
              <b-link :to="{ name: 'SopakitItems' }"> 소파킷 </b-link>
              <ul>
                <li>
                  <b-link :to="{ name: 'SopakitAllItems' }"> 상품목록 </b-link>
                </li>
              </ul>
            </li>
            <li>
              <b-link :to="{ name: 'SopakitAllItems' }"> 상영신청 </b-link>
            </li>
            <li>
              <b-link class="coming-soon"> 소파밋 </b-link>
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <ul class="link-list">
            <li>
              <b-link :to="{ name: 'Policy' }"> 이용약관 </b-link>
            </li>
            <li>
              <b-link :to="{ name: 'Privacy' }"> 개인정보처리방침 </b-link>
            </li>
            <li>
              <b-link> 사이트맵 </b-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 소파킷 상품목록 상영신청 소파밋 이용약관 개인정보처리방침 사이트맵 -->
  </div>
</template>

<script>
import { BLink } from 'bootstrap-vue';
import PageHeader from '@/components/PageHeader.vue';

export default {
  title: '사이트맵',
  components: {
    BLink,
    PageHeader,
  },
};
</script>


<style lang="scss" scoped>
.sitemap-container {
  margin-top: 30px;
}
.link-list {
  background-color: #f8f8f8;
  padding: 30px 30px 30px 50px;
}
.coming-soon {
  position: relative;

  &:after {
    font-size: 90%;
    opacity: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #000;
    content: '커밍쑨!';
    white-space: nowrap;
    transition: 0.5s;
  }

  &:hover,
  &:focus {
    color: #ddd;
    transition: 0.5s;
  }

  &:hover:after,
  &:focus:after {
    transform: translate(-50%, -50%) rotateZ(-10deg);
    opacity: 1;
  }
}
</style>
