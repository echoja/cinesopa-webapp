<template>
  <div class="sopakit-detail">
    <page-header>
      <div class="page-header-inner-wrapper">
        <h1>{{ headerTitle }}</h1>
      </div>
    </page-header>
    <div class="wrapper">
      <div class="left-blank"></div>
      <div class="content">
        <div class="featured-image-wrapper">
          <b-img
            :src="product.featured_image_url"
            :alt="product.featured_image_alt"
          ></b-img>
        </div>
        <div class="content-sub" v-html="product.content_sub">
          <!-- {{ product.content_sub }} -->
        </div>
        <h2 class="content-header">영화 소개</h2>
        <div
          class="film-info"
          role="table"
          aria-colcount="2"
          :aria-label="`${film.title} 기본 정보`"
          aria-describedby="basic-info-table-summary"
        >
          <div role="rowgroup" class="sr-only">
            <div class="basic-body-row d-flex" role="row">
              <span role="columnheader">구분</span>
              <span role="columnheader">내용</span>
            </div>
          </div>
          <div role="rowgroup">
            <div
              v-if="filmGenres || filmShowMinutes || film.is_opened"
              class="basic-body-row d-flex"
              role="row"
            >
              <span class="title" role="rowheader"> 개요 </span>
              <span class="content" role="cell">
                <template v-for="(output, index) in filmSummary">
                  <span :key="`${index}0`">{{ output }}</span>
                  <span
                    v-if="index !== filmSummary.length - 1"
                    class="seperator"
                    role="separator"
                    :key="`${index}1`"
                    >|</span
                  >
                </template>
                <!-- <span v-if="filmGenres">{{ filmGenres }}</span>
              <span v-if="filmGenres && filmShowMinutes" class="seperator" role="separator">|</span>
              <span v-if="filmShowMinutes > 0">{{ filmShowMinutes }}분</span>
              <span v-if="filmShowMinutes && film.is_opened" class="seperator" role="separator"
                >|</span
              >
              <span v-if="film.is_opened">{{ filmOpenDate }} 개봉</span> -->
              </span>
            </div>
            <div v-if="filmDirector" class="basic-body-row d-flex" role="row">
              <span class="title" role="rowheader"> 감독 </span>
              <span class="content" role="cell">
                {{ filmDirector }}
              </span>
            </div>
            <div
              v-if="filmActors.length > 0"
              class="basic-body-row d-flex"
              role="row"
            >
              <span class="title" role="rowheader"> 출연 </span>
              <span class="content" role="cell">
                {{ filmActors }}
              </span>
            </div>
            <div
              v-if="film.watch_grade"
              class="basic-body-row d-flex"
              role="row"
            >
              <span class="title" role="rowheader"> 등급 </span>
              <span class="content" role="cell">
                {{ film.watch_grade }}
              </span>
            </div>
          </div>
        </div>
        <h2 class="content-header">상세 정보</h2>
        <div class="content-main" v-html="product.content_main">
          <!-- {{ product.content_main }} -->
        </div>
        <h2 class="content-header" id="notice-content">유의사항</h2>
        <div class="phrase-wrapper">
          <div class="phrase">
            {{ product.side_phrase }}
          </div>
          <div class="phrase-line"></div>
        </div>
      </div>
      <div class="desktop-order-wrapper">
        <div class="desktop-order">
          <h2>주문 내용</h2>
          <div class="order-content">
            <div
              class="order-item"
              v-for="(option, optionIndex) in product.options"
              :key="optionIndex"
            >
              <div class="item-name">
                <span>{{ option.content }}</span>
              </div>
              <div class="inf-row">
                <number-controller
                  v-model="option.count"
                  class="inf-cell"
                ></number-controller>
                <!-- <div class="inf-cell number-controller">
                </div> -->
                <div class="inf-cell money">
                  ￦ {{ numberWithCommas(option.price) }}
                </div>
              </div>
            </div>
          </div>
          <div class="order-info">
            <div class="inf-row">
              <div class="inf-cell colheader">배송비</div>
              <div class="inf-cell money">{{ transportFeeView }}</div>
            </div>
            <hr />
            <div class="inf-row">
              <div class="inf-cell colheader">총 결제금액</div>
              <div class="inf-cell money all-price">{{ allPriceView }}</div>
            </div>
          </div>
          <!-- <div class="last-guide">
            <p> -->
          <!-- <b-form-checkbox v-model="noticeChecked">
                <b-link href="#notice-content">유의사항</b-link> 및
                주문내용을<br />
                확인했습니다.
              </b-form-checkbox> -->
          <!-- </p>
          </div> -->
          <div class="order-buttons">
            <!-- :disabled="!noticeChecked" -->
            <b-button
              @click="desktopCartClicked"
              :disabled="addCartTooltipShow"
              id="desktop-add-cartitem-button"
            >
              장바구니
            </b-button>
            <b-tooltip
              triggers="manual"
              :show="addCartTooltipShow"
              target="desktop-add-cartitem-button"
              placement="bottom"
            >
              성공적으로 장바구니에<br />추가했습니다.
            </b-tooltip>

            <!-- :disabled="!noticeChecked" -->
            <b-button @click="desktopBuyClicked"> 구매하기 </b-button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mobile-order-wrapper"
      :style="{ 'z-index': mobileOrderModalVisible ? 1045 : 100 }"
    >
      <div class="order-buttons">
        <b-button
          id="mobile-add-cartitem-button"
          @touchstart.prevent="mobileCartClicked"
          @click.prevent="mobileCartClicked"
          :disabled="addCartTooltipShow"
          >장바구니</b-button
        >
        <b-tooltip
          triggers="manual"
          :show="addCartTooltipShow"
          target="mobile-add-cartitem-button"
        >
          성공적으로 장바구니에<br />추가했습니다.
        </b-tooltip>
        <!-- :disabled="mobileOrderModalVisible && !noticeChecked" -->
        <b-button
          @touchstart.prevent="mobileBuyClicked"
          @click.prevent="mobileBuyClicked"
          >구매하기</b-button
        >
        <!-- :disabled="mobileOrderModalVisible && !noticeChecked" -->
      </div>
      <!-- @change="mobileOrderModalChanged" -->
      <b-modal
        id="mobile-order"
        v-model="mobileOrderModalVisible"
        hide-header
        hide-footer
      >
        <b-link
          class="modal-close-button"
          href="#"
          @click="$bvModal.hide('mobile-order')"
        >
          <close-figure></close-figure>
        </b-link>
        <div class="mobile-order">
          <h2>주문 내용</h2>

          <div class="order-content">
            <div
              class="order-item"
              v-for="(option, optionIndex) in product.options"
              :key="optionIndex"
            >
              <div class="item-name">
                <span>{{ option.name }}</span>
              </div>
              <div class="inf-row">
                <number-controller v-model="option.count" class="inf-cell">
                </number-controller>
                <div class="inf-cell money">
                  ￦ {{ numberWithCommas(option.price) }}
                </div>
              </div>
            </div>
          </div>

          <div class="order-info">
            <div class="inf-row">
              <div class="inf-cell colheader">배송비</div>
              <div class="inf-cell money">{{ transportFeeView }}</div>
            </div>
            <hr />
            <div class="inf-row">
              <div class="inf-cell colheader">총 결제금액</div>
              <div class="inf-cell money all-price">{{ allPriceView }}</div>
            </div>
          </div>
          <!-- <div class="last-guide">
            <p><b-link>유의사항</b-link>을 읽고 확인했습니다.</p>
          </div> -->
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import {
  BModal,
  BButton,
  BLink,
  BImg,
  BFormCheckbox,
  BTooltip,
} from 'bootstrap-vue';
import { mapMutations } from 'vuex';
import moment from 'moment';

import { numberWithCommas } from '@/util';
import { makeSimpleQuery, makeSimpleMutation } from '@/api/graphql-client';

// const numberWithCommas = (x) =>
//   x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const addCartitemReq = makeSimpleMutation('addCartitem');
const makeInstancePaymentCartitemReq = makeSimpleMutation(
  'makeInstancePaymentCartitem',
);
export default {
  name: 'SopakitDetail',
  title: (vm) => vm.title,
  components: {
    BButton,
    BLink,
    BModal,
    BImg,
    BFormCheckbox,
    BTooltip,
    PageHeader: () => import('@/components/PageHeader'),
    // SvgNext: () => import('@/components/SvgNext'),
    CloseFigure: () => import('@/components/CloseFigure'),
    NumberController: () => import('@/components/NumberController'),
  },
  data() {
    return {
      filmSummary: [],
      noticeChecked: false,
      transportFee: 5000,
      mobileOrderModalVisible: false,
      // content: '콘텐트',
      // notice: '안내사항',
      // keyword: { number: '01', name: '고독' },
      // film_name: '여름날',
      // name: '여름날',
      film: {
        genres: [],
        people: [],
      },
      product: {
        options: [],
      },
      sopakit: {},
      // sidePhrase: '누구에게나 유배된 시간이 있다',
      // items: [
      //   {
      //     name: '소파킷 01_고독 여름내',
      //     count: 1,
      //     price: 500000,
      //   },
      //   {
      //     name: '소파킷 02_고독 haha',
      //     count: 1,
      //     price: 10000,
      //   },
      // ],
      addCartTooltipShow: false,
    };
  },
  computed: {
    title() {
      return `소파킷 ${this.sopakit.num} ${this.sopakit.title} - ${this.product.name}`;
    },
    vuePageTitle() {
      return `소파킷 ${this.sopakit.num} ${this.sopakit.title} - ${this.product.name}`;
    },
    headerTitle() {
      return `소파킷 ${this.sopakit.num} - ${this.sopakit.title} - ${this.product.name}`;
    },

    id() {
      return parseInt(this.$route.params.id, 10);
    },

    allSum() {
      let result = 0;
      this.product.options.forEach((option) => {
        result += option.price * option.count;
      });
      return result;
    },

    transportFeeView() {
      return `￦ ${this.numberWithCommas(this.transportFee)}`;
    },
    allPriceView() {
      return `￦ ${this.numberWithCommas(this.allSum + this.transportFee)}`;
    },
    filmDirector() {
      return this.film.people
        .filter((person) => person.role_type === 'director')
        .map((person) => person.name)
        .join(', ');
    },
    filmOpenYear() {
      // console.log(this.film.open_date);
      if (this.film.open_date.getTime() > 0) {
        return this.film.open_date.getFullYear();
      }
      return null;
    },
    filmProdYear() {
      if (this.film.prod_date.getTime() > 0) {
        return this.film.prod_date.getFullYear();
      }
      return null;
    },
    filmActors() {
      return this.film.people
        .filter((person) => person.role_type === 'actor')
        .map((person) => `${person.name}(${person.role})`)
        .join(', ');
    },
    filmGenres() {
      return this.film.genres.join(', ');
    },
    filmShowMinutes() {
      return Math.floor(this.film.show_time / 60);
    },
    filmOpenDate() {
      if (this.film.open_date.getTime() === 0) {
        return null;
      }
      return moment(this.film.open_date).format('yyyy.MM.DD');
    },
    filmSynopsis() {
      if (this.film.synopsis) {
        return this.film.synopsis.replace(/\n/gi, '<br>');
      }
      return null;
    },
  },
  async mounted() {
    this.setAdditionalFooterPaddingBottom(40);
    this.fetchData();
  },
  beforeDestroy() {
    this.setAdditionalFooterPaddingBottom(0);
  },
  methods: {
    ...mapMutations(['setAdditionalFooterPaddingBottom']),
    numberWithCommas,
    upClicked(index) {
      if (this.product.options[index].count < 99) {
        this.product.options[index].count += 1;
      }
    },
    downClicked(index) {
      if (this.product.options[index].count > 0) {
        this.product.options[index].count -= 1;
      }
    },
    // mobileOrderModalChanged(isVisible) {
    //   this.mobileOrderModalVisible = isVisible;
    //   console.log(`changed!!! >> ${isVisible}`);
    // },
    mobileCartClicked(event) {
      event.target.blur();
      if (this.mobileOrderModalVisible) {
        console.log('카트에 담는다!!');
        this.startCartProcess();
      } else {
        this.$bvModal.show('mobile-order');
      }
    },
    mobileBuyClicked(event) {
      // this.$nextTick(() => {
      event.target.blur();
      // });
      if (this.mobileOrderModalVisible) {
        console.log('산다!!');
        this.startBuyProcess();
      } else {
        this.$bvModal.show('mobile-order');
      }
    },
    async fetchData() {
      const getProductReq = makeSimpleQuery('product');
      const received = await getProductReq(
        { id: this.id },
        `{
          featured_image_url featured_image_alt content_main content_sub side_phrase notice name 
          options {
            id content left price
          }
          related_film {
            title title_en open_date prod_date genres watch_grade poster_url poster_alt show_time synopsis
            people {
              role_type name role
            }
          }
          kit {
            num year title
          }
        }`,
      );
      console.log('# SopakitDetail fetchData received');
      console.log(received);

      // data 바인딩
      this.film = { ...received.related_film };
      this.sopakit = { ...received.kit };
      delete received.related_film;
      delete received.kit;

      // 영화 개요 만들기
      if (this.filmGenres) {
        this.filmSummary.push(this.filmGenres);
      }
      if (this.filmShowMinutes > 0) {
        this.filmSummary.push(`${this.filmShowMinutes}분`);
      }
      if (this.film.is_opened) {
        this.filmSummary.push(`${this.filmOpenDate} 개봉`);
      }

      // 옵션의 카운트를 0으로 초기화
      if (received.options) {
        received.options = received.options.map((option) => ({
          ...option,
          count: 1,
        }));
      }
      this.product = {
        ...received,
      };
      // this.id;
    },

    desktopCartClicked() {
      this.startCartProcess();
    },
    desktopBuyClicked() {
      this.startBuyProcess();
    },
    async startCartProcess() {
      const res = await addCartitemReq(
        {
          input: {
            product_id: this.id,
            options: this.product.options.map((option) => ({
              id: option.id,
              count: option.count,
            })),
          },
        },
        '{success code}',
      );
      console.log('# SopakitDetail startCartProcess res');
      console.log(res);

      this.addCartTooltipShow = true;
      setTimeout(() => {
        this.addCartTooltipShow = false;
      }, 2500);
    },
    async startBuyProcess() {
      const res = await makeInstancePaymentCartitemReq(
        {
          input: {
            product_id: this.id,
            options: this.product.options.map((option) => ({
              id: option.id,
              count: option.count,
            })),
          },
        },
        '{success code doc}',
      );
      console.log('# SopakitDetail startBuyProcess res');
      console.log(res);
      // todo
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/common';

$content-margin-top: 30px;

.wrapper {
  display: flex;
  align-items: stretch;
  justify-content: center;
  margin-top: $content-margin-top;
}

.content {
  // max-width: 700px;
  flex: 0 0 800px;
  // height: 10000px;
  padding: 0 45px 0 80px;
  position: relative;
  h2 {
    font-size: 23px;
    font-weight: bold;
  }
}

.featured-image-wrapper img {
  max-width: 100%;
}

@include max-with(md) {
  .content {
    padding: 0;
  }
}

.desktop-order-wrapper {
  display: flex;
  align-items: flex-start;
  width: 250px;
  padding-left: 30px;
  border-left: 2px solid #000;
  flex: 0 0 auto;
}

.mobile-order-wrapper {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  // z-index: 1045;
}

@include max-with(md) {
  .desktop-order-wrapper {
    display: none;
  }
  .mobile-order-wrapper {
    display: block;
  }
}

.desktop-order {
  position: sticky;
  flex: 1;
  top: $content-margin-top + 2px + $desktop-header-height +
    $desktop-subheader-height;
}

@include prevent-break-top0('.desktop-order');

.desktop-order,
.mobile-order {
  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  hr {
    margin: 10px 0;
    border-top-width: 2px;
    border-color: #000;
  }
}

// .number-controller .controller-down svg {
//   border-left: 0;
// }

.inf-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.inf-cell.colheader {
  color: #585858;
}

.order-content {
  min-height: 250px;
  margin: 10px 0;
}
.item-name {
  font-size: 16px;
  color: #585858;
}

.money {
  text-align: right;
  font-weight: bold;
}

.all-price {
  font-size: 20px;
}

.last-guide {
  margin-top: 30px;
  p {
    text-align: left;
    font-size: 14px;
  }
  a {
    text-decoration: underline;
  }
}

.order-info {
  margin-bottom: 20px;
}

@include max-with(md) {
  .order-info {
    margin-bottom: 50px;
  }
}

.order-item {
  margin-bottom: 15px;
}

.order-buttons {
  margin: 0 -10px;
  display: flex;
  justify-content: space-around;
}

.mobile-order-wrapper .order-buttons {
  margin: 0 0 10px 0;
}

.order-buttons button {
  border-radius: 50%;
  border-width: 2px;
  font-size: 18px;
  font-weight: bold;
  padding: 6px 17px;
}

// phrase

.phrase-wrapper {
  position: absolute;
  left: 0;
  top: 0;
}

.phrase {
  position: relative;
  z-index: 1;
  writing-mode: tb-rl;
  letter-spacing: 5px;
  font-size: 24px;
  font-weight: bold;
  background-color: #fff;
  padding-bottom: 20px;
}

.phrase-line {
  position: absolute;
  height: 660px;
  border-left: 1px solid #000;
  top: 0;
  left: 17px;
}

@include max-with(md) {
  .phrase-wrapper {
    display: none;
  }
}
</style>

<style lang="scss">
// .modal-open {
//   overflow:hidden;
//   overflow-y:scroll;
//   padding-right:0 !important;
// }

// modal design
// mobile order
#mobile-order {
  .modal-dialog {
    position: absolute;
    bottom: 0;
    margin: 0;
    left: 0;
    right: 0;
    max-width: none;
  }
  .modal-body {
    border-top: 2px solid #000;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.17);
  }

  .modal-content {
    border: 0;
  }

  .order-content {
    min-height: auto;
    max-height: 200px;
  }

  .item-name,
  .inf-row {
    font-size: 14px;
  }

  .all-price {
    font-size: 18px;
  }

  .last-guide {
    margin-bottom: 60px;
    p {
      font-size: 15px;
    }
  }
  .modal-close-button {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    border-style: solid;
    border-color: transparent;
    border-width: 20px;
    color: #000;
    :hover {
      color: #666;
    }
  }
}
</style>



<style scoped></style>

<style></style>
