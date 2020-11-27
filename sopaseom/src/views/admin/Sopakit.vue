<template>
  <div class="admin-sopakit">
    <header>
      <h2>소파킷 상품 목록</h2>
      <p>행을 클릭하면 바로 편집합니다.</p>
    </header>
        <b-table hover :items="items" :fields="fields" @row-clicked="rowClicked">
      <template #cell(checkbox)="row">
        <b-form-checkbox v-model="row.item.checked"></b-form-checkbox>
      </template>
      <!-- <template #cell(permalink)="row">
        <div class="text-monospace">
          {{ row.item.id }}
        </div>
      </template> -->
      <template #cell(status)="{ item }">
        {{ item.status === 'public' ? '공개' : '비공개' }}
      </template>
      <!-- <template #cell(c_date)="row">
        <div class="text-monospace">
          {{ formatDate(row.value) }}
        </div>
      </template>
      <template #cell(m_date)="row">
        <div class="text-monospace">
          {{ formatDate(row.value) }}
        </div>
      </template> -->
    </b-table>
        <p v-if="state.processing.get">로딩중입니다.</p>
    <p v-if="!hasData && !state.processing.get">상품이 없습니다.</p>
    <hr />
     <div class="buttons">
      <b-button @click="allCheckClicked">모두 선택</b-button>
      <b-button
        :disabled="!checkedAtleastOne"
        variant="danger"
        @click="$bvModal.show('remove-products-modal')"
        >삭제</b-button
      >
      <b-modal
        id="remove-products-modal"
        @ok="removeClicked"
        title="삭제 확인"
        ok-title="삭제"
        ok-variant="danger"
        cancel-title="취소"
      >
        <p>
          {{ items.filter((item) => item.checked === true).length }} 개의 상품을
          정말로 삭제하시겠습니까?
        </p>
      </b-modal>
      <b-button class="mx-1" variant="primary" :to="{ name: 'AdminProductNew' }"
        >새로 추가</b-button
      >
    </div>
    <div class="pagination-wrapper">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="totalPages"
        align="center"
        :value="page"
        use-router
      ></b-pagination-nav>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>