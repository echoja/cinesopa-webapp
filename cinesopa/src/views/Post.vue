<template>
  <p>Post</p>
</template>

<script>
export default {
  name: 'Post',
  title: (vm) => vm.post.title,
  data() {
    return {
      post: {
        title: '게시글 제목',
      }
    };
  },
};
</script>

<style></style>
