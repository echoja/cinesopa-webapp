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
        <div class="film-description">
          <!-- 영화 포스터 -->
          <div class="film-poster">
            <b-img :src="film.poster_url" :alt="film.poster_alt"></b-img>
          </div>
          <div class="film-right">
            <!-- 제목 -->
            <div class="film-ko-title">
              <h2>{{ film.title }}</h2>
              <span class="film-prod-year">{{ filmProdYear }}</span>
            </div>
            <div class="film-en-title">
              {{ film.title_en }}
            </div>
            <!-- 설명 표 -->
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
                  <span class="basic-title" role="rowheader"> 개요 </span>
                  <span class="basic-content" role="cell">
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
                <div
                  v-if="filmDirector"
                  class="basic-body-row d-flex"
                  role="row"
                >
                  <span class="basic-title" role="rowheader"> 감독 </span>
                  <span class="basic-content" role="cell">
                    {{ filmDirector }}
                  </span>
                </div>
                <div
                  v-if="filmActors.length > 0"
                  class="basic-body-row d-flex"
                  role="row"
                >
                  <span class="basic-title" role="rowheader"> 출연 </span>
                  <span class="basic-content" role="cell">
                    {{ filmActors }}
                  </span>
                </div>
                <div
                  v-if="film.watch_grade"
                  class="basic-body-row d-flex"
                  role="row"
                >
                  <span class="basic-title" role="rowheader"> 등급 </span>
                  <span class="basic-content" role="cell">
                    {{ film.watch_grade }}
                  </span>
                </div>
              </div>
            </div>
            <!-- 시놉시스 -->
            <div class="film-synopsis" v-html="film.synopsis">
              <!-- <div class="film-synopsis" v-html="filmSynopsis"> -->
            </div>
            <!-- 더 보기 -->
            <b-button
              class="film-detail-button"
              target="_blank"
              :href="`https://cinesopa.kr/film/${film.id}`"
            >
              더 보기 >
            </b-button>
          </div>
        </div>
        <h2 class="content-header">상세 정보</h2>
        <div class="content-main" v-html="product.content_main">
          <!-- {{ product.content_main }} -->
        </div>
        <div class="notice" v-html="product.notice"></div>
        <!-- <h2 class="content-header" id="notice-content">유의사항</h2> -->
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
              <div class="inf-cell money">{{ transportationFeeView }}</div>
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
              <div class="inf-cell money">{{ transportationFeeView }}</div>
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
  // BFormCheckbox,
  BTooltip,
} from 'bootstrap-vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import moment from 'moment';

import { numberWithCommas } from '@/util';
import { makeSimpleQuery, makeSimpleMutation } from '@/api/graphql-client';

// const numberWithCommas = (x) =>
//   x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const addCartitemReq = makeSimpleMutation('addCartitem');
const makeInstancePaymentCartitemReq = makeSimpleMutation(
  'makeInstancePaymentCartitem',
);
const siteOptionsReq = makeSimpleQuery('siteOptions');

export default {
  name: 'SopakitDetail',
  title: (vm) => vm.title,
  components: {
    BButton,
    BLink,
    BModal,
    BImg,
    // BFormCheckbox,
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
      transportationFee: 0,
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
    ...mapState(['currentUser']),
    title() {
      return `소파킷 ${this.sopakit.num ?? ''} ${this.sopakit.title ?? ''} - ${
        this.product.name ?? ''
      }`;
    },
    vuePageTitle() {
      return `소파킷 ${this.sopakit.num ?? ''} ${this.sopakit.title ?? ''} - ${
        this.product.name ?? ''
      }`;
    },
    headerTitle() {
      return `소파킷 ${this.sopakit.num ?? ''} - ${
        this.sopakit.title ?? ''
      } - ${this.product.name ?? ''}`;
    },

    id() {
      return parseInt(this.$route.params.id, 10);
    },

    allSum() {
      let result = 0;
      (this.product.options ?? []).forEach((option) => {
        result += option.price * option.count;
      });
      return result;
    },

    transportationFeeView() {
      return `￦ ${this.numberWithCommas(this.transportationFee)}`;
    },
    allPriceView() {
      return `￦ ${this.numberWithCommas(
        this.allSum + this.transportationFee,
      )}`;
    },
    filmDirector() {
      return (this.film.people ?? [])
        .filter((person) => person.role_type === 'director')
        .map((person) => person.name)
        .join(', ');
    },
    filmOpenYear() {
      // console.log(this.film.open_date);
      const date = new Date(this.film.open_date);
      if (date && date.getTime() > 0) {
        return date.getFullYear();
      }
      return null;
    },
    filmProdYear() {
      const date = new Date(this.film.prod_date);
      if (date && date.getTime() > 0) {
        return date.getFullYear();
      }
      return null;
    },
    filmActors() {
      return (this.film.people ?? [])
        .filter((person) => person.role_type === 'actor')
        .map((person) => `${person.name}(${person.role})`)
        .join(', ');
    },
    filmGenres() {
      return (this.film.genres ?? []).join(', ');
    },
    filmShowMinutes() {
      return Math.floor(this.film.show_time / 60);
    },
    filmOpenDate() {
      console.log('# SopakitDetail filmOpenDate');
      console.log(this.film.open_date);
      const date = new Date(this.film.open_date);
      if (date && date.getTime() === 0) {
        return null;
      }
      return moment(date).format('yyyy.MM.DD');
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
    this.fetchTransportationFee();
  },
  beforeDestroy() {
    this.setAdditionalFooterPaddingBottom(0);
  },
  methods: {
    ...mapActions(['pushMessage']),
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
          featured_image_url featured_image_alt content_main content_sub side_phrase notice name is_notice_default
          options {
            id content left price
          }
          related_film {
            id title title_en open_date prod_date genres watch_grade poster_url poster_alt show_time synopsis is_opened
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
      console.log({ ...received });

      // data 바인딩
      this.film = { ...received.related_film };
      console.log(this.film);
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

      // 만약에 is_notice_default 가 true 라면 값을 가져옴.
      if (received.is_notice_default) {
        this.fetchDefaultNotice();
      }
    },

    async fetchDefaultNotice() {
      const res = await siteOptionsReq(
        {
          names: ['default_notice'],
        },
        '{ name value success code }',
      );
      console.log('# SopakitDetail fetchDefaultNotice res');
      console.log(res);
      this.product.notice = res[0].value;
    },

    desktopCartClicked() {
      this.startCartProcess();
    },
    desktopBuyClicked() {
      this.startBuyProcess();
    },
    async startCartProcess() {
      if (!this.currentUser) {
        this.pushMessage({
          type: 'danger',
          msg: '로그인이 필요한 서비스입니다.',
          id: 'needLoginAlert',
        });
        return;
      }
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
      if (!this.currentUser) {
        this.pushMessage({
          type: 'danger',
          msg: '로그인이 필요한 서비스입니다.',
          id: 'needLoginAlert',
        });
        return;
      }
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
        `{success code doc {
          id
        }}`,
      );
      console.log('# SopakitDetail startBuyProcess res');
      console.log(res);

      if (res.success) {
        this.$router.push({
          name: 'Payment',
          params: { ids: `${res.doc.id}` },
        });
      } else {
        this.pushMessage({
          type: 'danger',
          msg: '즉시 구매 데이터 요청 중 오류가 발생했습니다.',
          id: 'makeInstancePaymentError',
        });
      }
    },
    async fetchTransportationFee() {
      const res = await siteOptionsReq(
        {
          names: ['transportation_fee'],
        },
        '{ name value success code }',
      );
      console.log('# OrderPayment fetchTransporationFee res');
      console.log(res);
      if (res[0].success) {
        this.transportationFee = res[0].value;
      }
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
  flex: 1;
  padding: 0 45px 0 80px;
  position: relative;
  overflow: hidden;
  h2 {
    font-size: 23px;
    font-weight: bold;
  }
}

@include max-with(lg) {
  .content {
    padding: 0 20px 0 0;
  }
}

@include max-with(md) {
  .content {
    padding: 0;
  }
}

.featured-image-wrapper img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.film-description {
  display: flex;
}

.film-poster {
  height: 300px;
  margin-right: 30px;
  img {
    height: 100%;
    max-width: 250px;
    object-fit: cover;
    border: 1px solid #ddd;
  }
}

@include max-with(xl) {
  .film-description {
    display: block;
  }
  .film-poster {
    margin-bottom: 20px;
    img {
      display: block;
      margin: 0 auto;
    }
  }
}

.film-right {
  font-size: 16px;

  .basic-body-row {
    margin-bottom: 3px;
  }
  .basic-title {
    font-weight: bold;
    padding-right: 15px;
  }
  .film-ko-title {
    display: flex;
    align-items: baseline;
    h2 {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
  }
  .seperator {
    padding: 0 10px;
  }
  .film-en-title {
    color: #565656;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .film-prod-year {
    font-size: 14px;
    font-weight: bold;
    padding-left: 5px;
  }

  .film-info {
    margin-bottom: 20px;
  }

  .film-synopsis {
    font-size: 14px;
    margin-bottom: 15px;
  }

  .film-detail-button {
    border: 0;
    padding: 0;
    font-size: 15px;
    font-weight: bold;
    color: #565656;
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
.mobile-order h2 {
  margin-bottom: 30px;
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
    margin-bottom: 70px;
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

@include max-with(lg) {
  .phrase-wrapper {
    display: none;
  }
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

<style lang="scss">
.sopakit-detail .content {
  font-size: 16px;
  h2 {
    font-size: 23px;
    font-weight: bold;
    margin: 50px 0 30px;
  }
  h3 {
    font-size: 18px;
    font-weight: bold;
    margin: 30px 0 15px;
  }
  h4 {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 15px;
  }
  table {
    border-top: 1px solid #ddd;
  }
  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .seperator {
  }
}
</style>

<style scoped></style>

<style></style>
