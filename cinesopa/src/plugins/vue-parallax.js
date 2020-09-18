import Vue from 'vue';

const r = (element) => {

};

// const listenerMap = 
Vue.directive('parallax', {
  // 바인딩 된 엘리먼트가 DOM에 삽입되었을 때...
  bind(el, binding) {
    console.dir(el);
    console.log('binded!');
    console.log(binding);
    window.addEventListener('scroll', r);
  },
  inserted(el, binding) {
    console.log('inserted!');
    // 엘리먼트에 포커스를 줍니다
    // el.focus();
    const scrollY = window.scrollY || window.pageYOffset;
    console.log(el.parentElement.getBoundingClientRect().top + scrollY);
    console.log(el.offsetTop);
    console.log(el.getBoundingClientRect().top + scrollY);
    console.log(binding);
  },
  update(el, binding) {
    console.log('updated!');
    console.log(binding);
  },
  unbind(el, binding) {
    // window.removeEventListener
  }
});
