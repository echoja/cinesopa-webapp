<template>
  <div
    :id="id"
    ref="tooltip"
    v-click-outside="hide"
    class="popper"
    @contextmenu.capture.prevent
  >
    <div class="context-menu">
      <slot>TEST CONTEXT-MENU</slot>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core/lib/popper-lite';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import ClickOutside from 'vue-click-outside';
import flip from '@popperjs/core/lib/modifiers/flip';
import Vue from 'vue';

// 저장해 놓는 곳.
const _map = Vue.observable({});
const set = (key, value) => {
  Vue.set(_map, key, value);
};
const deleteImpl = (key) => {
  Vue.delete(_map, key);
};
const getImpl = (key) => {
  return _map[key];
};
const show = (id, evt) => {
  console.log('# ConextMenu show');
  console.log(_map);
  _map[id]?.show(evt);
};
const hide = (id) => {
  _map[id]?.hide();
};
Vue.prototype.$cm = Vue.observable({
  _map,
  // _set: set,
  // _get: getImpl,
  // _delete: deleteImpl,
  show,
  hide,
});

// 우클릭시 이벤트를 받아들이는 객체.
const showHandler = (() => {
  const map = new Map();
  return (id) => {
    let handler;
    if (!map.get(id)) {
      handler = (evt) => {
        evt.preventDefault();
        console.log('# ContextMenu Handler');
        show(id, evt);
      };
      map.set(id, handler);
    } else {
      handler = map.get(id);
    }
    return handler;
  };
})();

Vue.directive('contextmenu', {
  bind(el, binding, vnode) {
    console.log('# ContextMenu directive binded!');
    const id = binding.value;
    console.log(id);
    el.addEventListener('contextmenu', showHandler(id));
  },
  unbind(el, binding, vnode) {
    console.log('# ContextMenu directive unbinded!');
    const id = binding.value;
    el.removeEventListener('contextmenu', showHandler(id));
  },
});

export default {
  name: 'ContextMenu',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  directives: {
    ClickOutside,
  },
  data() {
    return {
      // id: 0,
      targetDOM: null,
      popperInstance: null,
    };
  },
  computed: {
    /** @returns {string} */
    // elId() {
    //   return `${this.id}`;
    // },
    /** @returns {string} */
    cmMap() {
      const keys = Object.keys(this.$cm._map);
      console.log(keys);
      return keys.join('-');
    },
  },
  created() {},
  // 해당 id에 대한 행동을 만들어놓는다.
  mounted() {
    if (getImpl(this.id)) {
      console.error('# ContextMenu id가 겹칩니다.');
      throw Error('# ContextMenu id가 겹칩니다.');
    }
    set(this.id, {
      show: this.show,
      hide: this.hide,
    });
  },
  // 이벤트 추가
  beforeDestroy() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
    deleteImpl(this.id);
  },
  methods: {
    show(evt) {
      console.log('# ContextMenu show payload');
      console.log(evt);
      this.contextMenu(evt);
    },
    hide(evt) {
      console.log('# ContextMenu hide payload');
      console.log(evt);
      if (this.popperInstance) {
        this.popperInstance.destroy();
      }
    },

    /** @param {MouseEvent} evt */
    contextMenu(evt) {
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
      // 가상으로 object 를 만듭니다.
      const newTop = evt.clientY;
      const newLeft = evt.clientX;

      const newRect = {
        top: newTop,
        left: newLeft,
        bottom: newTop + 1,
        right: newLeft + 1,
        height: 1,
        width: 1,
      };
      const virtualElement = {
        getBoundingClientRect() {
          return newRect;
        },
      };

      // popper 를 생성합니다.
      // console.log(this.$refs.tooltip);
      this.popperInstance = createPopper(virtualElement, this.$refs.tooltip, {
        placement: 'right-start',
        modifiers: [preventOverflow, flip],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.popper {
  position: fixed;
  left: -10000px;
}
.context-menu {
  padding: 15px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);

  &:focus {
    outline: none;
  }
}
</style>