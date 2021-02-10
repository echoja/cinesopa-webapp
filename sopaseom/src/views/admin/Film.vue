<template>
  <div>
    <header class="p-3">
      <h2>
        영화 관리<b-button class="new" :to="{ name: 'FilmNew' }"
          >새 영화</b-button
        >
      </h2>
    </header>
    <div class="notice"><p>줄을 클릭하면 편집합니다.</p></div>
    <b-table
      hover
      :fields="fields"
      :items="films"
      @row-clicked="rowClicked"
      class="width-auto"
    >
      <template #head(id)="{ label }">
        <!-- test -->
        <span class="mr-2">{{ label }}</span>
        <info
          >숫자 형태로 자동으로 생성됩니다. url 을 구성할 때 사용됩니다. (예:
          cinesopa.kr/film/숫자 )</info
        >
      </template>
    </b-table>
    <!-- {{ films }} -->
    <b-pagination-nav
      :link-gen="linkGen"
      :number-of-pages="totalPages"
      :value="page"
      use-router
    ></b-pagination-nav>
    <!-- :vaulue="page" -->
  </div>
</template>

<script>
import { BButton, BTable, BPaginationNav } from 'bootstrap-vue';
import store from '@/store';
import {
  graphql,
  filmsAdminQuery /* removeFilmMutation */,
} from '@/api/graphql-client';
import router from '@/router';
import Info from '@/components/admin/Info.vue';

export default {
  components: {
    BButton,
    BTable,
    BPaginationNav,
    Info,
  },
  name: 'Film',
  async created() {
    await this.fetchFilms();
  },
  data() {
    return {
      total: 0,
      perpage: 10,
      fields: [
        {
          key: 'id',
          label: '주소',
        },
        {
          key: 'title',
          label: '제목',
        },
        {
          key: 'director',
          label: '감독',
        },
      ],
      films: [],
    };
  },
  computed: {
    /** @returns {number} */
    page() {
      if (this.$route.params.page === undefined) return 1;
      return parseInt(this.$route.params.page, 10) ?? 1;
    },
    /** @returns {number} */
    totalPages() {
      const pages = Math.ceil(this.total / this.perpage);
      if (pages <= 0) return 1;
      return pages;
    },
  },
  watch: {
    $route() {
      this.fetchFilms();
    },
  },
  methods: {
    async rowClicked(item) {
      store.commit('setErrorMsg', { message: item });
      router.push({ name: 'FilmEdit', params: { id: item.id } });
      // router.
      // g호호
    },
    async fetchFilms() {
      const {
        data: {
          filmsAdmin: { list: films, total },
        },
      } = await graphql(filmsAdminQuery, {
        condition: {
          page: this.page - 1,
          perpage: this.perpage,
        },
      });
      // console.log(films);
      const list = films.map((value) => {
        const { id, title, people } = value;
        const director = people
          ? people.find((person) => person.role_type === 'director')
          : null;
        return {
          id,
          title,
          director: director?.name,
        };
      });
      console.log(list);
      this.films = list;
      this.total = total;
    },
    linkGen(page) {
      return { name: 'AdminFilmPaged', params: { page } };
    },
  },
};
</script>
<style></style>
<style lang="scss" scoped>
.new {
  margin-left: 10px;
}
</style>
