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
import { graphql, filmsQuery /* removeFilmMutation */ } from '../../api/graphql-client';
import router from '../../router';
import store from '../../store';

export default {
  name: 'Film',
  async created() {
    await this.getFilmList(0, 10);
  },
  data() {
    return {
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
    async getFilmList(page, perpage) {
      const {
        data: { films },
      } = await graphql(filmsQuery, {
        condition: { page, perpage },
      });
      // console.log(films);
      const list = films.map((value) => {
        const { id, title, people } = value;
        const director = people ? people.find((person) => person.role_type === 'director') : null;
        return {
          id,
          title,
          director: director.name,
        };
      });
      console.log(list);
      this.films = list;
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
