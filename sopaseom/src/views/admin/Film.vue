<template>
  <div>
    <header class="p-3">
      <h2>영화 관리<b-button class="new" :to="{ name: 'FilmNew' }">새 영화</b-button></h2>
    </header>
    <div class="notice"><p>줄을 클릭하면 편집합니다.</p></div>
    <b-table hover :fields="fields" :items="films" @row-clicked="rowClicked"></b-table>
    <!-- {{ films }} -->
  </div>
</template>

<script>
import { BButton, BTable } from 'bootstrap-vue';
import store from '@/store';
import { graphql, filmsAdminQuery /* removeFilmMutation */ } from '@/api/graphql-client';
import router from '@/router';

export default {
  components: {
    BButton,
    BTable,
  },
  name: 'Film',
  async created() {
    await this.fetchFilms();
  },
  data() {
    return {
      total: 0,
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
          page: 0,
          perpage: 10,
        },
      });
      // console.log(films);
      const list = films.map((value) => {
        const { id, title, people } = value;
        const director = people ? people.find((person) => person.role_type === 'director') : null;
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
  },
};
</script>
<style></style>
<style lang="scss" scoped>
.new {
  margin-left: 10px;
}
</style>
