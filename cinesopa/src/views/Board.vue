<template>
  <div class="container-fluid">
    <h1>{{ title }}</h1>
    <div class="board-nav d-flex">
      <div
        class="board-select"
        role="listbox"
        aria-orientation="horizontal"
        aria-label="게시판 종류 선택"
      >
        <template v-for="(board, index) in boards">
          <b-link
            href="#"
            :key="index"
            @click="boardClicked(index)"
            role="option"
            class="board-select-item d-inline-block"
            :class="{ selected: board.selected }"
            >{{ board.title }}</b-link
          >
        </template>
      </div>
      <!-- 검색창 -->
      <div
        class="search text-center position-relative d-flex align-items-center"
      >
        <div class="search-icon mr-3 d-flex align-items-center">
          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
        </div>
        <label class="w-100 m-0" for="post-search" title="제목, 내용 검색">
          <b-form-input
            debounce="500"
            @update="updateSearchString"
            v-model="searchString"
            class="rounded-pill search-box"
            id="post-search"
            size="lg"
            type="search"
            placeholder="제목, 내용 검색"
            aria-placeholder="제목, 내용 검색"
            contenteditable="true"
            autocomplete="off"
            name="search"
          ></b-form-input>
        </label>
      </div>
    </div>
    <!-- 게시글 목록 -->
    <!-- <VueAria :aria="postListAria"> -->
    <div
      v-if="viewType === 'list'"
      class="post-list-wrapper"
      :aria-label="listARIALabel"
      :aria-busy="loading"
    >
      <div
        v-if="loading"
        class="position-absolute w-100 h-100 d-flex text-center justify-content-center align-items-center"
      >
        불러오는 중입니다.
      </div>
      <div
        v-if="posts.length === 0 && !loading"
        class="position-absolute w-100 h-100 d-flex text-center justify-content-center align-items-center"
      >
        게시글이 없습니다.
      </div>
      <transition name="post-list-item" mode="out-in">
        <ul v-if="!loading" class="post-list">
          <li
            v-for="(post, index) in posts"
            :key="index"
            class="d-flex post-listitem justify-content-between"
          >
            <span class="cell-board flex-shrink-0 small">{{ post.board }}</span>
            <span class="cell-title flex-fill">
              <b-link :to="{ name: 'Post', params: { id: post.id } }">
                {{ post.title }}
              </b-link>
            </span>
            <span
              class="cell-date flex-shrink-0 small"
              :aria-label="ariaDate(post.date)"
              >{{ formatDate(post.date) }}</span
            >
          </li>
        </ul>
      </transition>
    </div>
    <!-- </VueAria> -->
    <!-- 게시글 목록 (갤러리형) -->
    <!-- <VueAria :aria="postListAria"> -->
    <div
      v-if="viewType === 'gallery'"
      class="gallery"
      :aria-label="listARIALabel"
    >
      <div
        v-if="loading"
        class="position-absolute w-100 h-100 d-flex text-center justify-content-center align-items-center"
      >
        불러오는 중입니다.
      </div>
      <div
        v-if="posts.length === 0 && !loading"
        class="position-absolute w-100 h-100 d-flex text-center justify-content-center align-items-center"
      >
        게시글이 없습니다.
      </div>
      <transition-group
        name="post-list-item"
        mode="out-in"
        tag="div"
        class="row"
      >
        <div
          class="gallery-item col-12 col-sm-6 col-md-4"
          v-for="(post, index) in posts"
          :key="index"
        >
          <div class="gallery-thumbnail">
            <b-link
              :to="{ name: 'Post', params: { id: post.id } }"
              class="thumbnail-link"
            >
              <span class="sr-only">{{ post.title }}</span>

              <img
                v-if="post.featured_image_link"
                :alt="post.featured_image_alt"
                :src="parseUploadLink(post.featured_image_link)"
                class="gallery-thumbnail-img"
              />
              <span class="no-featured-image" v-else>
                대표 사진이<br />없습니다.
              </span>
              <!-- todo: 서버에서 alt 받아와서 처리해야 함. -->
            </b-link>
          </div>
          <div class="gallery-title">
            <b-link
              class="gallery-title-link"
              :to="{ name: 'Post', params: { id: post.id } }"
            >
              {{ post.title }}
            </b-link>
          </div>
          <div class="gallery-board">{{ post.board }}</div>
        </div>
      </transition-group>
    </div>
    <!-- </VueAria> -->

    <!-- 페이지 옮기기 -->
    <div class="pagenav-wrapper d-flex justify-content-center">
      <!-- pills -->
      <b-pagination-nav
        limit="9"
        v-model="currentPage"
        :link-gen="linkGen"
        :number-of-pages="numberOfPages"
        use-router
        @change="pageChanged"
        class="film-pagination"
        hide-goto-end-buttons
        label-first-page="첫 페이지로 이동"
        label-prev-page="이전 페이지로 이동"
        label-next-page="다음 페이지로 이동"
        label-last-page="마지막 페이지로 이동"
        label-page="페이지 이동:"
        aria-label="게시글 페이지 이동"
        exact-active-class="exact"
      ></b-pagination-nav>
    </div>
  </div>
</template>

<script>
// 이 함수의 호출된 결과를 computed 에 ... 로 destucture 해서 쓸 수 있음.
// function titleof(permalinkList) {
//   const result = {};
//   permalinkList.forEach((permalink) => {
//     result[`titleof_${permalink}`] = (vm) => {
//       return vm.boards.find((board) => board.permalink === permalink).title;
//     };
//   });
//   return result;
// }
import moment from 'moment';
// import { VueAria } from 'vue-a11y-utils';
import { boardsQuery, graphql, postsInBoardQuery } from '../graphql-client';
import { parseUploadLink } from '../util';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  name: 'Board',
  title: (context) => context.titleComputed,
  components: {
    // VueAria,
  },
  props: {
    title: String,
    board: String,
    boardPermalinks: Array,
    viewType: {
      // 'list' or 'gallery'
      type: String,
      default: 'list',
    },
    perpage: Number,
  },
  data() {
    return {
      loadedCount: 0,
      loading: false,
      searchString: null,
      currentPage: 1,
      postTotal: 0,
      vuePageTitle: '',
      boards: [
        // {
        //   permalinks: '_all',
        //   title: '전체',
        //   selected: true,
        // },
        // {
        //   permalinks: 'press',
        //   title: '프레스',
        //   selected: false,
        // },
        // {
        //   permalinks: 'cooperative',
        //   title: '조합소식',
        //   selected: false,
        // },
      ],
      boardTitleMap: {},
      posts: [
        //   // http://m.cine21.com/news/view/?mag_id=89286
        //   {
        //     id: 1,
        //     board: '프레스',
        //     title: '성송이 영화배급협동조합 씨네소파 대표 - 부산에서 독립영화 배급하기',
        //     date: new Date('2018-01-18'),
        //     // eslint-disable-next-line global-require, import/no-unresolved
        //     thumbnailUrl: require('../assets/test/steel23.jpg'),
        //   },
        //   // http://www.busan.com/view/busan/view.php?code=20170720000205
        //   {
        //     id: 3,
        //     board: '프레스',
        //     title: "독립영화 배급 나선 당찬 20대 청년들 '씨네소파' 협동조합 \"멀티플렉스 게, 섰거라!",
        //     date: new Date('2017-07-20'),
        //     // eslint-disable-next-line global-require, import/no-unresolved
        //     thumbnailUrl: require('../assets/test/steel23.jpg'),
        //   },
        //   // https://actmediact.tistory.com/1204
        //   {
        //     id: 2,
        //     board: '프레스',
        //     title: '[ACT! 107호 인터뷰] “희생하지 않습니다.” - 부산 영화배급협동조합 씨네소파',
        //     date: new Date('2017-11-06'),
        //     // eslint-disable-next-line global-require, import/no-unresolved
        //     thumbnailUrl: require('../assets/test/steel23.jpg'),
        //   },
        //   {
        //     id: 4,
        //     board: '조합소식',
        //     title: '2018년 임시총회 공고',
        //     date: new Date('2018-03-11'),
        //     // eslint-disable-next-line global-require, import/no-unresolved
        //     thumbnailUrl: require('../assets/test/steel23.jpg'),
        //   },
        //   {
        //     id: 5,
        //     board: '조합소식',
        //     title: '2019년 정기총회 공고',
        //     date: new Date('2018-01-11'),
        //     // eslint-disable-next-line global-require, import/no-unresolved
        //     thumbnailUrl: require('../assets/test/steel23.jpg'),
        //   },
        //   {
        //     id: 6,
        //     board: '조합소식',
        //     title: '2020년 임시총회 공고',
        //     date: new Date('2018-03-11'),
        //     // eslint-disable-next-line global-require, import/no-unresolved
        //     thumbnailUrl: require('../assets/test/steel23.jpg'),
        //   },
        //   {
        //     id: 7,
        //     board: '조합소식',
        //     title: '2021년 정기총회 공고',
        //     date: new Date('2018-01-11'),
        //     // eslint-disable-next-line global-require, import/no-unresolved
        //     thumbnailUrl: require('../assets/test/steel23.jpg'),
        //   },
      ],
    };
  },
  computed: {
    postListAria() {
      return {
        label: this.listARIALabel,
        busy: this.loading,
      };
    },
    listARIALabel() {
      const selected = this.boards.find((board) => board.selected);
      if (selected) return `${selected.title} 글 목록`;
      return '글 목록';
    },
    boardMenu() {
      const result = [];
      result.push({
        selected: true,
        premalink: '_all',
        title: '전체',
      });
      result.push(...this.boards);
      return result;
    },

    titleComputed() {
      return `${this.boards.find((board) => board.selected === true)?.title ?? ''} - ${this.title}`;
    },
    // ...titleof(['press', 'cooperative']),
    // getBoardTitle(...args) {
    //   console.dir(args);
    //   const { permalink } = args;
    //   return () => {
    //     console.log(this.boards);
    //     return this.boards.findIndex((item) => {
    //       console.log(item.permalink);
    //       console.log(permalink);
    //       return item.permalink === permalink;
    //     });
    //   };
    // },
    permalink() {
      return this.$route.params.permalink;
    },
    key() {
      return this.$route.params.permalink;
    },
    numberOfPages() {
      if (this.postTotal === 0) return 1;
      return Math.ceil(this.postTotal / this.perpage);
    },
    calculatedBoardPermalinks() {
      return this.boards.find((board) => board.selected)?.permalinks;
    },
  },
  // watch: {
  //   $route(to) {
  //     console.log('# Board.vue watch route');
  //     console.log(to.fullPath);
  //   },
  // },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     console.log('# Board.vue beforeRouteEnter');
  //     console.log(vm.$route.fullPath);
  //     // `vm`을 통한 컴포넌트 인스턴스 접근
  //   });
  // },

  async mounted() {
    this.startLoading();

    // 페이지 설정
    const { page } = this.$route.params;
    this.currentPage = !page ? 1 : parseInt(page, 10);

    // 게시판 정보들 서버로부터 가져오기
    // console.log(this.boardPermalinks);
    const res = await graphql(boardsQuery, {
      belongs_to: 'cinesopa',
    });

    this.boards = [];
    this.boards.push({
      permalinks: this.boardPermalinks,
      permalink: 'all',
      title: '전체',
      selected: false,
    });
    // console.log(this.boardPermalinks);
    // console.log(res.data);
    this.boardPermalinks.forEach((value) => {
      const found = res.data.boards.find((board) => board.permalink === value);
      // console.log('`found!!!`');
      // console.log(found);
      this.boards.push({
        _id: found?._id,
        permalinks: [value],
        permalink: value,
        title: found?.title,
        selected: false,
      });
      this.boardTitleMap[found?._id] = found.title;
    });

    // 보드를 맞추기
    // console.log('*&!(@&$*!@*&!@(&$#');
    // console.log(this.$route.params.board);
    // console.log(this.boards);

    const foundIndex = this.boards.findIndex(
      (item) => item.permalink === this.$route.params.board,
    );
    if (foundIndex !== -1) {
      this.boards[foundIndex].selected = true;
      this.vuePageTitle = this.titleComputed;
    }
    await this.refreshPosts();

    // // 게시글들 설정
    // const { posts } = res.data;
    // console.log(res);
    // this.posts = posts.posts.map((post) => ({
    //   id: post.id,
    //   board: this.boardTitleMap[post.board],
    //   title: post.title,
    //   date: post.c_date,
    //   // eslint-disable-next-line global-require, import/no-unresolved
    //   // todo url 해야함.
    //   featured_image_url: post.featured_image_url,
    // }));
    // this.postTotal = posts.total;

    this.finishLoading();
  },
  methods: {
    parseUploadLink,
    async boardClicked(index) {
      this.$router.push({
        name: this.$route.name,
        params: {
          board: this.boards[index].permalink,
        },
      });
      this.currentPage = 1;
      this.startLoading();
      this.boards.forEach((board) => {
        // eslint-disable-next-line no-param-reassign
        board.selected = false;
      });
      this.boards[index].selected = true;
      await this.refreshPosts();
      this.finishLoading();
    },
    formatDate(date) {
      return moment(date).format('YYYY.MM.DD');
    },
    ariaDate(date) {
      return moment(date).format('YYYY년 MM월 DD일');
    },
    linkGen(page) {
      // console.log(this.$route.fullPath);
      return { name: this.$route.name, params: { page } };
      // return null;
    },
    async pageChanged(page) {
      this.startLoading();
      this.currentPage = page;
      await this.refreshPosts();
      this.finishLoading();
    },
    async refreshPosts() {
      const minimum = sleep(300);

      // 게시글 검색 조건 생성
      const condition = {
        page: this.currentPage - 1,
        perpage: this.perpage,
        board_permalinks: this.calculatedBoardPermalinks,
        board_belongs_to: 'cinesopa',
        search: this.searchString,
      };
      const res = await graphql(postsInBoardQuery, {
        condition,
      });
      // console.log(condition);
      // console.log(res.data);
      // 게시글들 설정
      const { posts } = res.data;
      this.posts = posts.posts.map((post) => ({
        id: post.id,
        board: this.boardTitleMap[post.board],
        title: post.title,
        date: post.c_date,
        featured_image_link: post.featured_image_link,
        featured_image_alt: post.featured_image_alt,
      }));
      this.postTotal = posts.total;

      await minimum;
    },
    startLoading() {
      this.loadedCount += 1;
      this.loading = true;
      // this.boards = [];
      this.posts = [];
    },
    finishLoading() {
      this.loading = false;
    },
    async updateSearchString() {
      this.startLoading();
      await this.refreshPosts();
      this.finishLoading();
    },
  },
};
</script>

<!----------------------------------------------------------------->
<!---------------------------- CSS SCOPED!!!! -------------------->
<!----------------------------------------------------------------->

<style scoped>
.post-list-item-enter-active {
  transition: all 1s;
}
.post-list-item-leave-active {
  transition: all 0.3s;
}

.post-list-item-enter, .post-list-item-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(15px);
}

/* .post-loading-enter-active,  */
.post-loading-leave-active {
  transition: 0.2s;
}

.post-loading-enter, .post-loading-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<!----------------------------------------------------------------->
<!---------------------------- SCSS SCOPED!!!! -------------------->
<!----------------------------------------------------------------->
<style lang="scss" scoped>
h1 {
  font-size: 50px;
  color: #009eda;
  margin-bottom: 20px;
}

.mobile h1 {
  font-size: 40px;
  margin-top: 50px;
}

// 게시판 필터링
.board-nav {
  justify-content: space-between;
  flex-wrap: wrap;
}

.mobile .board-nav {
  // justify-content: center;
  justify-content: flex-start;
}

.board-select {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.mobile .board-select {
  justify-content: flex-start;
}

.board-select-item {
  font-size: 26px;
  font-weight: 500;
  color: #767676;
  padding: 10px 20px;

  &:first-child {
    padding-left: 0;
  }
  &.selected {
    color: #009eda;
  }
  // &:hover {
  //   text-decoration: none;
  // }
}
.mobile .board-select-item {
  font-size: 20px;
  padding: 10px;
  &:first-child {
    padding-left: 0;
  }
}

.post-search {
  max-width: 300px;
}

.search {
  width: 100%;
  max-width: 260px;
}

.search-box {
  font-size: 16px;
}

// 포스트

.post-list-wrapper {
  min-height: 300px;
  position: relative;
}

.post-list {
  padding: 0;
  padding-top: 2px;
  margin-top: 10px;
}
.post-listitem {
  border: 1px solid #b0b6ba;
  border-left: 0;
  border-right: 0;
  margin-top: -1px;
  padding: 35px 0;
  font-size: 20px;
}

.mobile .post-listitem {
  font-size: 18px;
}

.cell-board {
  width: 18vw;
  max-width: 200px;
  color: #767676;
}

.cell-date {
  padding-left: 10px;
}

.pagenav-wrapper {
  margin-top: 30px;
}

// 포스트 갤러리형
$gallery-item-padding: 30px;

.gallery {
  position: relative;
  padding: 30px 0;
  margin-left: 15px - $gallery-item-padding;
  margin-right: 15px - $gallery-item-padding;
  min-height: 300px;
  margin-top: 10px;
  border-top: 1px solid #b0b6ba;
}

.gallery-item {
  padding-left: $gallery-item-padding;
  padding-right: $gallery-item-padding;
  margin-bottom: 50px;
}

.thumbnail-link {
  position: absolute;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
}
.thumbnail-link:hover .gallery-thumbnail-img {
  transform: scale(1.2);
  opacity: 0.7;
}

.gallery-thumbnail {
  position: relative;
  overflow: hidden;

  width: 100%;

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
}
.no-featured-image {
  line-height: 1.6;
  text-align: center;
  padding: 10px 20px;
  border: 1px solid #ddd;
}

// todo 갤러리 탭했을 때 그림이랑 제목링크랑 중복으로 되는 문제 수정해야 함.?? 평가때 보나?

.gallery-thumbnail-img {
  transition: 0.5s;
  height: 100%;
  width: auto;
}

.gallery-title {
  font-size: 18px;
  font-weight: 500;
  padding: 5px 20px 0;
  text-align: center;
}

.gallery-board {
  font-size: 16px;
  color: #767676;
  text-align: center;
}
</style>

<style lang="scss">
.page-item.active a.page-link {
  margin: 5px;
  width: 30px;
  height: 30px;
  padding-bottom: 10px;
}
</style>
