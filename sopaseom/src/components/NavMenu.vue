<template>
  <div class="nav-main-menu-wrapper" :class="{ zoomed: logoZoomed }">
    <header class="nav-main-menu">
      <div class="flex-items">
        <div class="left">
          <b-link class="nav-main-menu-link" :to="{ name: 'SopakitItems' }">
            소파킷
          </b-link>
          <b-link class="nav-main-menu-link" :to="{ name: 'Application' }">
            상영
          </b-link>
          <b-link class="nav-main-menu-link coming-soon">소파밋</b-link>
        </div>
        <!-- <div class="logo-wrapper">
          <b-link :to="{ name: 'Home' }" class="logo">
            <img class="logo-main" src="../assets/sopaseom-logo.svg" alt="" />
            <img
              class="logo-tag"
              src="../assets/sopaseom-logo-tag.svg"
              alt=""
            />
          </b-link>
        </div> -->
        <div class="right">
          <b-link
            class="nav-main-menu-link"
            @click="$bvModal.show('modal-login')"
            v-if="!currentUser"
          >
            로그인
          </b-link>
          <b-modal id="modal-login" hide-footer hide-header centered>
            <b-link
              class="modal-close-button"
              href="#"
              @click="$bvModal.hide('modal-login')"
            >
              <close-figure></close-figure>
            </b-link>
            <login-form modal-id="modal-login"></login-form>
            <!-- <template #modal-header-close>
              <b-img
                class="close-button"
                width="25"
                src="@/assets/close-button.svg"
              ></b-img> -->
            <!-- </template> -->
            <!-- <template #modal-backdrop class="hello">
              <div class="hello"></div>
            modal-backdrop
            </template> -->
          </b-modal>

          <b-link
            class="nav-main-menu-link"
            :to="{ name: 'Join' }"
            v-if="!currentUser"
          >
            회원가입
          </b-link>
          <b-link class="nav-main-menu-link" v-if="currentUser">
            마이페이지
          </b-link>
          <b-link
            :to="{ name: 'Logout' }"
            class="nav-main-menu-link"
            v-if="currentUser"
          >
            로그아웃
          </b-link>
          <!-- <b-button @click="zoomed = !zoomed"></b-button> -->
        </div>
      </div>
    </header>
    <b-link
      :to="{ name: 'Home' }"
      @click="goTopIfSame('Home')"
      class="logo-abs"
    >
      <img class="logo-main" src="@/assets/sopaseom-logo.svg" alt="" />
      <img class="logo-tag" src="@/assets/sopaseom-logo-tag.svg" alt="" />
    </b-link>
  </div>
</template>

<script>
import { BLink, BButton, BModal, BImg, BForm, BFormInput } from 'bootstrap-vue';
import { mapState } from 'vuex';
import VueScrollTo from 'vue-scrollto';

export default {
  components: {
    BLink,
    BButton,
    BModal,
    CloseFigure: () => import('@/components/CloseFigure'),
    LoginForm: () => import('@/components/LoginForm'),
  },
  data() {
    return {
      zoomed: false,
    };
  },
  computed: {
    ...mapState(['currentUser', 'logoZoomed']),
  },
  methods: {
    async openLoginForm() {
      console.log('openLoginForm!!');
    },
    async goTopIfSame(routeName) {
      if (this.$route.name === routeName) {
        VueScrollTo.scrollTo('body', 300);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../common';

.nav-main-menu-wrapper {
  padding: 0 $desktop-min-x-margin;
  position: fixed;
  width: 100%;
  z-index: 1;
  top: 0;
  background-color: #fff;
}

@include max-with(sm) {
  .nav-main-menu-wrapper {
    padding: 0 $mobile-min-x-margin;
  }
}


.nav-main-menu {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;

  border-bottom: 2px solid black;
}

.flex-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $desktop-header-height;
}

.nav-main-menu-link {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  border: 20px solid transparent;
  border-width: 20px 13px;
  border-radius: 100px;
}

.logo-wrapper {
  height: 100%;
}

.logo {
  position: relative;
  width: 113px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  box-sizing: content-box;
  border: 10px solid transparent;
  position: absolute;
  width: 100%;
}

.logo-abs {
  width: 113px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transform: translate(calc(50vw - 50%), 0);
  top: 0;
  left: 0;
  margin: 0 auto;
  transition: 1.5s ease;
}

.zoomed .logo-abs {
  width: 411px;
  position: absolute;
  // transform: translate(calc(50vw - 50%), calc(50vh - 50%));1
  margin: 0 auto;
  img {
    transform: translate(0, max(#{$desktop-header-height}, calc(50vh - 50%)));
  }
  .logo-tag {
    opacity: 1;
  }
}

@include max-with(sm) {
  .zoomed .logo-abs img {
    width: 200px;
  }
}

.logo-tag {
  opacity: 0;
}

.logo-abs img {
  transition: 1.5s ease;
  top: 0;
  box-sizing: content-box;
  border: 10px solid transparent;
  position: absolute;
  width: 100%;
}

.left .nav-main-menu-link:first-child {
  border-left: 0;
}
.right .nav-main-menu-link:last-child {
  border-right: 0;
}

.right,
.left {
  flex: 1 1 0;
}

.right {
  text-align: right;
}

@include max-with(sm) {
  .nav-main-menu-link {
    display: none;
  }
}

// modal!

#modal-login {
  position: relative;
}

.modal-close-button {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  border: 20px solid transparent;
  border-width: 30px 20px;
  color: #000;
  :hover {
    color: #666;
  }
}
</style>

<style>
</style>
