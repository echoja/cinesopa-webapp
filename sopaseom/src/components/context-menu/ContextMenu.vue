<template>
  <div
    :id="id"
    ref="contextMenuWrapper"
    v-click-outside="hide"
    class="popper"
    @contextmenu.capture.prevent
  >
    <div class="context-menu">
      <slot :payload="payload">DEFALUT SLOT</slot>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core/lib/popper-lite';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import ClickOutside from 'vue-click-outside';
import flip from '@popperjs/core/lib/modifiers/flip';
import Vue from 'vue';

// custom directive 에 addEventListener, removeEventListener 할 녀석들.
const handlerMap = new Map();

// directive Element 마다 가지고 있는 payload 를 저장함.
// 매번 업데이트마다 바뀌기 때문에 항상 최신의 것이 들어가있음.
const directivePayloadMap = new Map();

// 각 ContextMenu 의 메소드에 접근하기 쉽도록 저장해 놓는 곳.
/**
 * @typedef {Object} ContextMenuMethods
 * @property {(evt, payload) => void} show
 * @property {() => void} hide
 * @property {(payload) => void} updatePayload
 */

/** @type {Object.<string, ContextMenuMethods>} key: Context Menu Component 의 id 값, value: 각 메소드 */
const localMethods = Vue.observable({});

const setLocalMethods = (menuId, value) => {
  Vue.set(localMethods, menuId, value);
};
const deleteLocalMethods = (menuId) => {
  Vue.delete(localMethods, menuId);
};
const getLocalMethods = (menuId) => {
  return localMethods?.[menuId];
};

/**
 * payload 데이터를 어디서 가지고 올 건지를 설정하는 객체.
 * `elid` 혹은 `payload` 둘 중 하나를 설정해야 함.
 * @typedef {Object} ShowGlobalFrom
 * @property {string} [elid]
 * @property {*} [payload]
 */

/**
 * @param {string} menuId ContextMenu 의 id 값.
 * @param {Event} event 이벤트. 마우스 위치를 얻기 위해 필요함.
 * @param {ShowGlobalFrom} from Payload 관련 데이터를 받아오기 위해 필요함.
 * directive 에 붙어있을 경우 el 을 지정해주고 직접 값을 지정한다면 payload 에 지정해야 함.
 */
const showGlobal = (menuId, event, from = {}) => {
  console.log('# ConextMenu showGlobal');
  const { elid, payload } = from;
  event.preventDefault();
  console.log(`elid: ${elid}`);
  console.log(`payload: ${payload}`);
  // console.log(menuId);
  console.log(localMethods);
  // console.log(directivePayloadMap);
  let payloadToPush;
  if (elid) {
    payloadToPush = directivePayloadMap.get(elid);
  } else if (payload) {
    payloadToPush = payload;
  } else payloadToPush = null;
  const show = getLocalMethods(menuId)?.show;
  if (show) show(event, payloadToPush);
  // ho
};

// 숨기는 함수. 글로벌로 등록됨.
const hideGlobal = (menuId) => {
  const hide = getLocalMethods(menuId)?.hide;
  if (hide) hide();
};

// 글로벌 객체를 만듬.
Vue.prototype.$cm = Vue.observable({
  localMethods,
  show: showGlobal,
  hide: hideGlobal,
});

// directive 에 붙어있는 el에 대해서 이벤트 핸들러를 만들어줌.
const getShowHandler = (menuId, elid) => {
  if (!handlerMap.get(elid)) {
    handlerMap.set(elid, (event) => {
      console.log('# eventListener getShowHandler made');
      // console.log(`${menuId}`);
      // console.log(el);
      showGlobal(menuId, event, { elid });
    });
  }
  // addEventListener 혹은 removeEventListener 에 들어갈 것
  return handlerMap.get(elid);
};

/**
 * directive 가 붙어있는 Element 에 대해 새로고침이 되었을 때 unbind 이후 bind 가 일어날
 * 거라는 보장이 없으므로, ShowHandler 를 저장해두는 id 값을 별도로 만들어 관리.
 */
let duuid = 0;

Vue.directive('contextmenu', {
  bind(el, binding, vnode) {
    console.log('# ContextMenu directive binded!');
    console.log(vnode);
    const menuId = binding.arg;
    const elid = duuid.toString();
    el.dataset.contextElid = elid;
    duuid += 1;
    directivePayloadMap.set(elid, binding.value);
    el.addEventListener('contextmenu', getShowHandler(menuId, elid));
  },
  unbind(el, binding, vnode) {
    console.log(vnode);
    console.log('# ContextMenu directive unbinded!');
    const menuId = binding.value;
    const elid = el.dataset.contextElid;
    directivePayloadMap.delete(elid);
    el.removeEventListener('contextmenu', getShowHandler(menuId, elid));
  },
  update(el, binding, vnode) {
    console.log('# ContextMenu directive componentUpdated');
    const payload = binding.value;
    const elid = el.dataset.contextElid;
    directivePayloadMap.set(elid, payload);
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
      payload: null,
    };
  },
  /** contextMenu 의 id는 겹치면 안 된다. */
  mounted() {
    if (getLocalMethods(this.id)) {
      console.error('# ContextMenu id가 겹칩니다.');
      throw Error('# ContextMenu id가 겹칩니다.');
    }
    setLocalMethods(this.id, {
      show: this.show,
      hide: this.hide,
    });
  },
  // 이벤트 추가
  beforeDestroy() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
    deleteLocalMethods(this.id);
  },
  methods: {
    show(event, payload) {
      console.log('# ContextMenu show payload');
      // console.log(event);
      // console.log(payload);
      this.payload = payload;
      this.contextMenu(event);
    },
    hide() {
      console.log('# ContextMenu hide payload');
      // console.log(evt);
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
      this.popperInstance = createPopper(
        virtualElement,
        this.$refs.contextMenuWrapper,
        {
          placement: 'right-start',
          modifiers: [preventOverflow, flip],
        },
      );
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
