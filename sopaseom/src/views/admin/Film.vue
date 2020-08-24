
<template>
  <div>
    <h2>영화 관리</h2>
    <div class="actions"><b-button :to="{ name: 'FilmNew' }">새 영화</b-button></div>
    <b-table hover :items="films" @row-clicked="rowClicked"></b-table>
    <!-- {{ films }} -->
  </div>
</template>

<script>
import { graphql, filmsQuery /* removeFilmMutation */ } from '../../graphql-client';
import router from '../../router';
import store from '../../store';

export default {
  name: 'Film',
  async created() {
    await this.getFilmList(0, 10);
  },
  data() {
    return {
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
          director,
        };
      });
      console.log(list);
      this.films = list;
    },
  },
};
</script>
dfdf
<style></style>
