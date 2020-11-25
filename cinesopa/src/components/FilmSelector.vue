<template>
  <div
    class="film-selector"
    @keydown.down="keyDowned"
    @keydown.up="keyUped"
    @keydown.enter="keyEntered"
    tabindex="-1"
  >
    <div
      role="combobox"
      :aria-expanded="expanded"
      :aria-owns="id"
      aria-haspopup="listbox"
    >
      <!-- @input="inputSearchString" -->
      <b-form-input
        aria-autocomplete="true"
        auto-complete="off"
        :aria-controls="id"
        :aria-activedescendant="activeId"
        :aria-describedby="descriptionId"
        ref="search-input"
        debounce="500"
        @update="updateSearchString"
        @change="changeSearchString"
        @input="inputSearchString"
        v-model="search"
        type="search"
        placeholder="영화제목, 감독, 배우 검색"
        aria-placeholder="영화제목, 감독, 배우 검색"
        aria-label="영화 검색"
      >
      </b-form-input>
      <p class="description" :id="descriptionId" @keydown.down="keyDowned2">
        해당하는 영화를 검색한 후 선택하세요.<br />검색 결과는 최대 20개 까지
        표시됩니다.
      </p>
    </div>
    <ul
      class="list-wrapper"
      :id="`film-selector-listbox-${id}`"
      role="listbox"
      :aria-busy="searchProcessing"
    >
      <li class="notice-listitem" v-if="searchProcessing">
        <b-spinner class="loading-spinner"> </b-spinner>데이터를 불러오는
        중입니다.
      </li>
      <li
        class="notice-listitem"
        v-if="!searchProcessing && searchResults.length === 0"
      >
        영화 정보가 없습니다.
      </li>
      <li
        class="listitem"
        v-for="(item, itemIndex) in searchResults"
        :key="itemIndex"
        role="option"
        :id="item.active ? activeId : null"
        :class="{ active: item.active }"
        @click="selected(item)"
      >
        <div class="listitem-inner-wrapper">
          <h2>{{ item.title }}</h2>
          <div class="meta">
            <template v-for="(metaItem, metaIndex) in item.meta">
              <span class="meta-content" :key="metaIndex">{{ metaItem }}</span>
              <span
                class="meta-seperator"
                v-if="metaIndex !== item.meta.length - 1"
                :key="`${metaIndex}-seperator`"
                >|</span
              >
            </template>
          </div>
        </div>
      </li>
    </ul>
    <!-- <div class="test">
      {{ searchProcessing }}
    </div> -->
  </div>
</template>

<script>
import moment from 'moment';
import { BFormInput, BSpinner } from 'bootstrap-vue';
import { makeSimpleQuery } from '@/graphql-client';

let gid = 0;

export default {
  components: {
    BFormInput,
    BSpinner,
  },
  data() {
    return {
      activeIndex: -1,
      expanded: false,
      search: '',
      searchProcessing: false,
      searchResults: [
        // {
        //   title: 'ho',
        //   meta: ['감독 123', '개봉 호호'],
        //   active: false,
        // },
        // {
        //   title: '슈퍼제목',
        //   meta: ['감독 123', '개봉 2020.3.1.', '기타등등'],
        //   active: false,
        // },
      ],
      id: '',
    };
  },
  computed: {
    activeId() {
      return `film-selector-active-${this.id}`;
    },
    descriptionId() {
      return `film-selector-description-${this.id}`;
    },
  },
  methods: {
    selected(item) {
      // console.log('# FilmSelector selected');
      // console.log(item);
      this.$emit('film-selected', item);
    },

    inputSearchString() {
      // console.log('# FilmSelector inputSearchString');
      this.searchProcessing = true;
      this.searchResults = [];
    },
    changeSearchString() {
      // console.log('# FilmSelector changeSearchString');
      // this.searchProcessing = true;
    },
    async updateSearchString() {
      // 검색중인 상태를 두기. (aria 에 필요함.)
      this.searchProcessing = true;
      // console.log('# FilmSelector updateSearchString');
      // console.log(this.search);

      const condition = {
        search: this.search,
        page: 0,
        perpage: 20,
      };
      const result = await makeSimpleQuery('films')(
        { condition },
        '{ total list { id title is_opened open_date people  {name role_type role} available_subtitles}}',
      );
      // console.log('# FilmSelector updateSearchString result');
      // console.log(result);

      this.searchResults = result.list.map((item) => {
        const meta = [];

        // 감독 불러오기
        const director = item.people.find(
          (person) => person.role_type === 'director',
        );

        if (director) {
          meta.push(`감독 ${director.name}`);
        }
        // 두명의 배우만 불러오기
        const actors = item.people.filter(
          (person) => person.role_type === 'actor',
        );
        const twoActors = actors.slice(0, 2);
        if (twoActors.length > 0) {
          meta.push(`출연 ${twoActors.map((actor) => actor.name).join(' ')}`);
        }

        const { open_date } = item;
        if (open_date) {
          meta.push(`${moment(open_date).format('YYYY.MM.DD')} 개봉`);
        }
        return {
          ...item,
          title: item.title,
          active: false,
          meta,
        };
      });

      // 현재 활성화된 요소 초기화
      this.activeIndex = -1;

      // 검색중인 상태 해제
      this.searchProcessing = false;
    },

    keyDowned(event) {
      // console.log('keyDowned');
      // console.log(event);

      if (this.activeIndex === -1) {
        this.activeIndex = 0;
        this.searchResults[0].active = true;
        return;
      }
      this.searchResults[this.activeIndex].active = false;
      const l = this.searchResults.length;
      this.activeIndex = (this.activeIndex + l + 1) % l;
      this.searchResults[this.activeIndex].active = true;
    },
    keyUped(event) {
      // console.log('keyUped');
      // console.log(event);
      const l = this.searchResults.length;

      if (this.activeIndex === -1) {
        this.activeIndex = l - 1;
        this.searchResults[l - 1].active = true;
        return;
      }
      this.searchResults[this.activeIndex].active = false;
      this.activeIndex = (this.activeIndex + l - 1) % l;
      this.searchResults[this.activeIndex].active = true;
    },
    keyEntered(event) {
      // console.log('keyEntered');
      // console.log(event);
      if (this.activeIndex !== -1) {
        this.selected(this.searchResults[this.activeIndex]);
      }
    },
    keyDowned2() {
      // console.log('downed2');
    },
  },
  async mounted() {
    this.id = `${gid}`;
    gid += 1;
    this.updateSearchString();
    this.$refs['search-input'].focus();
  },
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #ddd;
}

.description {
  font-size: 13px;
  color: #666;
  margin: 0;
  padding-left: 5px;
  margin-top: 5px;
  line-height: 1.5;
}

ul {
  list-style: none;
  padding: 0;
}

.list-wrapper {
  margin-top: 40px;
  border-top: 1px solid #ddd;
  font-size: 14px;
}

.notice-listitem {
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 15px;
  height: 15px;
  margin-right: 7px;
}

.listitem {
  cursor: pointer;
  transition: 0.3s;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.meta-content {
  color: #444;
}

.meta-seperator {
  color: #777;
  padding: 0 6px;
}

li:hover {
  background-color: #ddd;
  transition: 0s;
}
h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
</style>
