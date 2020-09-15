<template>
  <div class="container-fluid">
    <h1>사이트맵</h1>
    <ul>
      <li><b-link :to="{ name: 'Home' }">홈</b-link></li>
      <li><b-link :to="{ name: 'About' }">인사해요</b-link></li>
      <li><b-link :to="{ name: 'BoardActivity' }">활동해요</b-link></li>
      <li><b-link :to="{ name: 'BoardNotice' }">공지해요</b-link></li>
      <li><b-link :to="{ name: 'BoardActivity' }">인사해요</b-link></li>
      <li>
        신청해요
        <ul>
          <li>
            <b-link :to="{ name: 'Distribution' }">배급의뢰</b-link>
          </li>
          <li>
            <b-link :to="{ name: 'Community' }">공동체상영 신청</b-link>
          </li>
        </ul>
      </li>
      <hr />

      <li><b-link :to="{ name: 'EmailRefuse' }">이메일무단수집거부</b-link></li>
    </ul>
    <div class="col-md-4 col-sm-6 col-12">asdf</div>
    <div class="col-md-4 col-sm-6 col-12">asdf</div>
    <div class="col-md-4 col-sm-6 col-12">asdf</div>
    <div class="col-md-4 col-sm-6 col-12">asdf</div>
    <div class="col-md-4 col-sm-6 col-12">asdf</div>
    <div class="col-md-4 col-sm-6 col-12">asdf</div>
    <h2></h2>
  </div>
</template>

<script>
export default {
  name: 'sitemap',
  title: '사이트맵',
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: '-';
}
</style>
<style></style>
