<template>
  <div>
    <header>
      <h2 class="Tmb-3">파일 관리</h2>
    </header>
    <!-- select-message="false" -->
    <file-manager :modal-id="'hello-modal'" :selectable="false"></file-manager>

    <!-- 모달 닫기 이벤트를 컴포넌트 외부에서 할 수 잇는가? >> id를 props로 전달하여 $bvModal.hide 를 이용해 종료시키면 된다. -->
    <!-- <b-button @click="$bvModal.show('hello-modal')">열어줘!</b-button>
    <b-modal id="hello-modal">
     <file-manager :modal-id="'hello-modal'"></file-manager>
    </b-modal> -->
  </div>
</template>

<script>
export default {
  name: 'File',
  components: {
    FileManager: () => import('@/components/FileManager.vue'),
  },
};
</script>

<style></style>
