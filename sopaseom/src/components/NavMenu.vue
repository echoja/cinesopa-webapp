<template>
  <div class="nav-main-menu-wrapper" :class="{ zoomed: logoZoomed }">
    <b-sidebar
      id="sidebar-menu"
      title="MENU"
      backdrop-variant="dark"
      backdrop
      shadow
    >
      <template #default="{ hide }">
        <ul class="mobile-menu-link-list">
          <li>
            <b-link
              class="mobile-menu-link"
              :to="{ name: 'SopakitItems' }"
              @click="hide"
              >소파킷</b-link
            >
          </li>
          <li>
            <b-link
              class="mobile-menu-link"
              :to="{ name: 'Application' }"
              @click="hide"
            >
              상영
            </b-link>
          </li>
          <li>
            <b-link href="#" class="mobile-menu-link coming-soon"
              >소파밋
            </b-link>
          </li>
          <hr />
          <li>
            <b-link
              class="mobile-menu-link"
              v-if="!currentUser"
              :to="{ name: 'Login', params: { board: 'Login' } }"
              @click="hide"
            >
              로그인
            </b-link>
          </li>
          <li>
            <b-link
              class="mobile-menu-link"
              :to="{ name: 'JoinPolicy' }"
              v-if="!currentUser"
              @click="hide"
            >
              회원가입
            </b-link>
          </li>
          <li>
            <b-link
              class="mobile-menu-link"
              :to="{ name: 'Cart' }"
              v-if="currentUser"
              @click="hide"
              >장바구니
            </b-link>
          </li>
          <li>
            <b-link
              class="mobile-menu-link"
              :to="{ name: 'My' }"
              v-if="currentUser"
              @click="hide"
              >마이페이지
            </b-link>
          </li>
          <!-- <li> -->
          <!-- :to="{ name: 'Logout' }" -->
          <!-- <logout-link
            class="mobile-menu-link"
            @click="hide"
            v-if="currentUser"
          ></logout-link> -->
          <!-- </li> -->
        </ul>
      </template>
    </b-sidebar>
    <header class="nav-main-menu">
      <div class="flex-items">
        <div class="left">
          <link-strikethrough
            class="nav-main-menu-link"
            :to="{ name: 'SopakitItems' }"
          >
            소파킷
          </link-strikethrough>
          <link-strikethrough
            class="nav-main-menu-link"
            :to="{ name: 'Application' }"
          >
            상영
          </link-strikethrough>
          <link-strikethrough class="nav-main-menu-link coming-soon"
            >소파밋</link-strikethrough
          >
        </div>
        <!-- <div class="logo-wrapper">
          <link-strikethrough :to="{ name: 'Home' }" class="logo">
            <img class="logo-main" src="../assets/sopaseom-logo.svg" alt="" />
            <img
              class="logo-tag"
              src="../assets/sopaseom-logo-tag.svg"
              alt=""
            />
          </link-strikethrough>
        </div> -->
        <div class="right">
          <link-strikethrough
            class="nav-main-menu-link"
            @click="$bvModal.show('modal-login')"
            v-if="!currentUser"
          >
            로그인
          </link-strikethrough>
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

          <link-strikethrough
            class="nav-main-menu-link"
            :to="{ name: 'JoinPolicy' }"
            v-if="!currentUser"
          >
            회원가입
          </link-strikethrough>
          <link-strikethrough
            :to="{ name: 'Cart' }"
            class="nav-main-menu-link"
            v-if="currentUser"
          >
            장바구니
          </link-strikethrough>
          <link-strikethrough
            :to="{ name: 'My' }"
            class="nav-main-menu-link"
            v-if="currentUser"
          >
            마이페이지
          </link-strikethrough>
          <!-- <logout-link class="nav-main-menu-link" v-if="currentUser">
          </logout-link> -->
        </div>
        <div
          class="menu-mobile d-block d-sm-none h-100 d-flex align-items-center"
        >
          <b-link v-b-toggle.sidebar-menu class="menu-button">
            <font-awesome-icon size="2x" :icon="['fas', 'bars']" />
          </b-link>
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
import { BLink, BModal, BSidebar } from 'bootstrap-vue';
import { mapState } from 'vuex';
import VueScrollTo from 'vue-scrollto';
// import LinkStrikethrough from './LinkStrikethrough.vue';

export default {
  components: {
    BLink,
    BModal,
    BSidebar,
    CloseFigure: () => import('@/components/CloseFigure'),
    LoginForm: () => import('@/components/LoginForm'),
    LogoutLink: () => import('@/components/LogoutLink'),
    LinkStrikethrough: () => import('@/components/LinkStrikethrough'),
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
    async mobileMenuButtonClicked(event) {},
  },
};
</script>

<style lang="scss" scoped>
@import '../common';

.nav-main-menu-wrapper {
  position: sticky;
  top: 0;
  // left: 50%;
  // width: 100%;
  padding: 0 $desktop-min-x-margin;
  max-width: $desktop-max-width;
  // z-index: 1;
  // transform: translateX(-50%);
  // top: 0;
  z-index: 30;
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
  // max-width: $desktop-max-width;
  margin: 0 auto;
  border-bottom: 2px solid black;
}

@include max-with(sm) {
  .nav-main-menu {
    border-bottom: 0;
  }
}

.flex-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $desktop-header-height;
}

@include max-with(sm) {
  .flex-items {
    height: $mobile-header-height;
  }
}

.nav-main-menu-link {
  display: inline-block;
  font-size: 17px;
  font-weight: bold;
  border: 20px solid transparent;
  border-width: 20px 10px;
  border-radius: 100px;
}

// .logo-wrapper {
//   height: 100%;
// }

// .logo {
//   position: relative;
//   width: 113px;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// @include max-with(sm) {
//   .logo {
//     width: 70px;
//   }
// }

// .logo img {
//   box-sizing: content-box;
//   border: 10px solid transparent;
//   position: absolute;
//   width: 100%;
// }

.logo-abs {
  // width: 113px;
  // height: $desktop-header-height;
  width: $desktop-header-height * 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  margin: 0 auto;
  // transition: 1.5s ease;
  img {
    transition: 1.5s ease;
    top: 0;
    box-sizing: content-box;
    border-width: 5px 10px 10px 10px;
    border-style: solid;
    border-color: transparent;
    position: absolute;
    width: 100%;
  }
}

@include max-with(sm) {
  .logo-abs {
    width: 70px;
    img {
      border-width: 3px 10px;
    }
  }
}

.logo-tag {
  opacity: 0;
}

.zoomed .logo-abs {
  // width: 411px;
  position: absolute;
  // transform: translate(calc(50vw - 50%), calc(50vh - 50%));1
  margin: 0 auto;
  img {
    // transform: translate(0, max(#{$desktop-header-height}, calc(50vh - 50%)));
    transform: translate(0, calc(50vh - 50%)) scale(3.5);
  }
  .logo-tag {
    opacity: 1;
  }
}

@include max-with(sm) {
  .zoomed .logo-abs img {
    transform: translate(0, calc(50vh - 50%)) scale(2);
  }
}

// menu button
.menu-button {
  padding: 0;
  margin: 0;
  border: 10px solid transparent;
}

// left right

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
  .left,
  .right {
    display: none;
  }
}

// mobile menu

.mobile-menu-link-list {
  list-style: none;
  padding-left: 0;
  margin-left: 10px;
}

.mobile-menu-link {
  display: inline-block;
  padding: 5px;
  font-size: 16px;
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
