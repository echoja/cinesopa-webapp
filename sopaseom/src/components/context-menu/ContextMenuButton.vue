<template>
  <a @click="closeMenu" v-on="$listeners" href="#">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'ContextMenuButton',
  data() {
    return {
      cm: null,
    };
  },
  mounted() {
    /** @type {Vue} */
    let vnode = this;
    while (vnode && vnode.$options.name !== 'ContextMenu') {
      // console.log(vnode.$options.name);
      vnode = vnode.$parent;
    }
    if (vnode) {
      // console.log('# ContextMenuButton parent found!');
      // console.log(vnode);
      this.cm = vnode;
    }
  },
  methods: {
    closeMenu() {
      if (this.cm) {
        this.cm.hide();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  margin-left: -15px;
  margin-right: -15px;
  padding: 10px 15px;
  display: block;

  &:hover {
    background-color: #eee;
    text-decoration: none;
  }
}
</style>
