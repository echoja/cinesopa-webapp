<template>
  <div>
    <p>This is Special!!! wow~</p>
    <p>email : {{ user.email }}</p>
    <p>role: {{ user.role }}</p>
    <p>name: {{ user.name }}</p>
    <p>c_date: {{ user.c_date }}</p>

    <router-link :to="{ name: 'Logout' }" tag="b-button">로그아웃</router-link>
  </div>
</template>

<script>
export default {
  name: 'My',
};
</script>

<style></style>
