<template>
  <div class="container-fluid">
    <h1>{{ title }}</h1>
    <div class="board-nav d-flex">
      <div
        class="board-select d-flex justify-content-center flex-wrap"
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
      <div class="search text-center position-relative d-flex align-items-center">
        <div class="search-icon mr-3 d-flex align-items-center">
          <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
        </div>
        <label class="w-100 m-0" for="post-search" title="제목, 내용 검색">
          <b-form-input
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
    <ul class="post-list" :aria-label="listARIALabel">
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
        <span class="cell-date flex-shrink-0 small">{{ formatDate(post.date) }}</span>
      </li>
    </ul>

    <!-- 페이지 옮기기 -->
    <div class="pagenav-wrapper d-flex justify-content-center">
      <!-- pills -->
      <b-pagination-nav
        limit="9"
        v-model="currentPage"
        :link-gen="linkGen"
        :number-of-pages="10"
        use-router
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

export default {
  name: 'Board',
  title: (context) => context.title,
  props: ['title', 'boardsProp'],
  data() {
    return {
      currentPage: 1,
      boards: [
        {
          permalink: '_all',
          title: '전체',
          selected: true,
        },
        {
          permalink: 'press',
          title: '프레스',
          selected: false,
        },
        {
          permalink: 'cooperative',
          title: '조합소식',
          selected: false,
        },
      ],
      posts: [
        // http://m.cine21.com/news/view/?mag_id=89286
        {
          id: 1,
          board: '프레스',
          title: '성송이 영화배급협동조합 씨네소파 대표 - 부산에서 독립영화 배급하기',
          date: new Date('2018-01-18'),
        },
        // http://www.busan.com/view/busan/view.php?code=20170720000205
        {
          id: 3,
          board: '프레스',
          title: "독립영화 배급 나선 당찬 20대 청년들 '씨네소파' 협동조합 \"멀티플렉스 게, 섰거라!",
          date: new Date('2017-07-20'),
        },
        // https://actmediact.tistory.com/1204
        {
          id: 2,
          board: '프레스',
          title: '[ACT! 107호 인터뷰] “희생하지 않습니다.” - 부산 영화배급협동조합 씨네소파',
          date: new Date('2017-11-06'),
        },
        {
          id: 4,
          board: '조합소식',
          title: '2018년 임시총회 공고',
          date: new Date('2018-03-11'),
        },
        {
          id: 5,
          board: '조합소식',
          title: '2018년 정기총회 공고',
          date: new Date('2018-01-11'),
        },
        {
          id: 6,
          board: '조합소식',
          title: '2018년 임시총회 공고',
          date: new Date('2018-03-11'),
        },
        {
          id: 7,
          board: '조합소식',
          title: '2018년 정기총회 공고',
          date: new Date('2018-01-11'),
        },
      ],
    };
  },
  computed: {
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
  },
  methods: {
    async boardClicked(index) {
      this.boards.forEach((board) => {
        // eslint-disable-next-line no-param-reassign
        board.selected = false;
      });
      this.boards[index].selected = true;
      //
    },
    formatDate(date) {
      return moment(date).format('YYYY.MM.DD');
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 50px;
  color: var(--link-color);
  margin-bottom: 20px;
}
.mobile h1 {
  font-size: 40px;
}

// 게시판 필터링
.board-select-item {
  font-size: 26px;
  font-weight: 500;
  color: var(--secondary-text-color);
  padding: 10px 20px;

  &:first-child {
    padding-left: 0;
  }
  &.selected {
    color: var(--link-color);
  }
}
.mobile .board-select-item {
  font-size: 20px;
}
.board-nav {
  justify-content: space-between;
  flex-wrap: wrap;
}
.mobile .board-nav {
  justify-content: center;
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

.post-list {
  padding: 0;
  padding-top: 2px;
  margin-top: 10px;
}
.post-listitem {
  // border: 2px solid var(--text-color);
  border: 1px solid #b0b6ba;
  border-left: 0;
  border-right: 0;
  margin-top: -1px;
  padding: 35px 0;
  font-size: 20px;
}
// .post-listitem:first-child {
//   border-top: 2px solid #b0b6ba;
// }
// .post-listitem:last-child {
//   border-bottom: 2px solid #b0b6ba;
// }

.mobile .post-listitem {
  font-size: 18px;
}

.cell-board {
  width: 18vw;
  max-width: 200px;
  color: var(--secondary-text-color);
}

.cell-date {
  padding-left: 10px;
}

.pagenav-wrapper {
  margin-top: 30px;
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
