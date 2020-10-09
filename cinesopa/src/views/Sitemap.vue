<template>
  <div class="container-fluid sitemap">
    <h1>사이트맵</h1>
    <div class="row">
      <div class="col-12 col-md-6">
        <h2>전체 메뉴</h2>
        <ul class="main">
          <li><b-link :to="{ name: 'Home' }">홈</b-link></li>
          <li><b-link :to="{ name: 'About' }">회사소개</b-link></li>
          <li><b-link :to="{name: 'FilmList', params: {type: 'all'}}">작품소개</b-link></li>
          <li>
            <b-link :to="{ name: 'BoardArchive',params: {board: 'all'} }">아카이브</b-link>
            <ul class="sub">
              <li>
                <b-link :to="{ name: 'BoardArchive',params: {board: 'community'} }">커뮤니티</b-link>
              </li>
              <li>
                <b-link :to="{ name: 'BoardArchive' ,params: {board: 'study'}}">스터디</b-link>
              </li>
              <li>
                <b-link :to="{ name: 'BoardArchive',params: {board: 'archive-etc'} }">기타</b-link>
              </li>
            </ul>
          </li>
          <li>
            <b-link :to="{ name: 'BoardNotice', params: {board: 'all'}}">공지사항</b-link>
            <ul class="sub">
              <li>
                <b-link :to="{ name: 'BoardNotice', params: {board: 'press'}}">프레스</b-link>
              </li>
              <li>
                <b-link :to="{ name: 'BoardNotice', params: {board: 'cooperative'}}"
                  >조합소식</b-link
                >
              </li>
            </ul>
          </li>
          <li>
            <b-link :to="{ name: 'Distribution' }">신청하기</b-link>
            <ul class="sub">
              <li>
                <b-link :to="{ name: 'Distribution' }">배급의뢰</b-link>
              </li>
              <li>
                <b-link :to="{ name: 'Community' }">상영 신청</b-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="col-12 col-md-6">
        <h2>기타 페이지</h2>
        <ul class="main">
          <li><b-link :to="{ name: 'EmailRefuse' }">이메일무단수집거부</b-link></li>
          <li><b-link :to="{ name: 'Sitemap' }">사이트맵</b-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sitemap',
  title: '사이트맵',
};
</script>

<style lang="scss" scoped>
@use '../util.scss';

.sitemap {
  max-width: 700px;
}

h1 {
  color: util.$link-color;
  margin-bottom: 50px;
}
h2 {
  font-size: 20px;
}
ul {
  // list-style-type: '- ';
}

.main {
  list-style-type: disc;
  // list-style-position: disc;
  & > li {
    font-size: 18px;
  }
}
.sub {
  & > li {
    font-size: 16px;
  }
}
</style>
<style></style>
