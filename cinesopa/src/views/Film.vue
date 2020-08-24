<template>
  <div>
    <affix relative-element-selector="#content" style="width: 300px" :offset="{top: 1100, bottom: 30}">
      <scrollactive
        active-class="active"
        :offset="80"
        :duration="800"
        bezier-easing-value=".5,0,.35,1"
        class="my-nav"
      >
        <a href="#a" class="scrollactive-item">a</a>
        <a href="#b" class="scrollactive-item">b Us</a>
        <a href="#d" class="scrollactive-item">d</a>
        <a href="#c" class="scrollactive-item">c</a>
      </scrollactive>
    </affix>
    <b-row>
      <b-col>
        <div class="blank">
          DARK!!
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="blank"></div>
        <p>Film</p>
      </b-col>
    </b-row>
    <b-row id="content">
      <b-col>
        <b-row id="a">
          <b-col>
            <p>aaaaaaaa aaaa</p>
            <p>aaaaaaaa aaaa</p>
            <p>aaaaaaaa aaaa</p>
            <p>aaaaaaaa aaaa</p>
            <p>aaaaaaaa aaaa</p>
            <p>aaaaaaaa aaaa</p>
            <p>aaaaaaaa aaaa</p>
            <p>aaaaaaaa aaaa</p>
            <div class="blank"></div>
          </b-col>
        </b-row>
        <b-row id="b">
          <b-col>
            <p>bbbbbbbb bbbb</p>
            <p>bbbbbbbb bbbb</p>
            <p>bbbbbbbb bbbb</p>
            <p>bbbbbbbb bbbb</p>
            <p>bbbbbbbb bbbb</p>
            <p>bbbbbbbb bbbb</p>
            <p>bbbbbbbb bbbb</p>
            <p>bbbbbbbb bbbb</p>
            <div class="blank"></div>
          </b-col>
        </b-row>
        <b-row id="d">
          <b-col>
            <p>dddddddd dddd</p>
            <p>dddddddd dddd</p>
            <p>dddddddd dddd</p>
            <p>dddddddd dddd</p>
            <p>dddddddd dddd</p>
            <p>dddddddd dddd</p>
            <p>dddddddd dddd</p>
            <p>dddddddd dddd</p>
            <div class="blank"></div>
          </b-col>
        </b-row>
        <b-row id="c">
          <b-col>
            <div class="blank"></div>
            <p>cccccccc cccc</p>
            <p>cccccccc cccc</p>
            <p>cccccccc cccc</p>
            <p>cccccccc cccc</p>
            <p>cccccccc cccc</p>
            <p>cccccccc cccc</p>
            <p>cccccccc cccc</p>
            <p>cccccccc cccc</p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
  <!-- <b-nav>
    <b-nav-item :to="{name:}"></b-nav-item>
  </b-nav> -->
</template>

<script>
export default {
  name: 'Film',
};
</script>

<style>
div.blank {
  margin-top: 10px;
  background-color: #ddd;
  min-height: 500px;
  border-top: 1px solid #aaa;
}
a {
  padding-right: 50px;
}
.vue-affix {
  z-index:888;
}
</style>
