<template>
  <b-container>
    <b-row>
      <b-col>
        <header>
          어드민 헤더
        </header>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        사이드바
      </b-col>
      <b-col>
        <main>
          <article>
            <slot/>
          </article>
          <aside>
            연관 콘텐츠
          </aside>
        </main>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <footer>

        </footer>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { BContainer, BCol, BRow } from 'bootstrap-vue';

export default {
  name: 'LayoutAdmin',
  components: {
    'b-container': BContainer,
    'b-col': BCol,
    'b-row': BRow,
  },
};
</script>

<style>

</style>
