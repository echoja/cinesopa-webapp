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
        {{ content }}
        <div class="phrase-wrapper">
          <div class="phrase">
            {{ sidePhrase }}
          </div>
          <div class="phrase-line"></div>
        </div>
      </div>
      <div class="desktop-order-wrapper">
        <div class="desktop-order">
          <h2>주문 내용</h2>
          <div class="order-content">
            <div class="order-item" v-for="(item, index) in items" :key="index">
              <div class="item-name">
                <span>{{ item.name }}</span>
              </div>
              <div class="inf-row">
                <div class="inf-cell number-controller">
                  <div class="controller-down">
                    <b-link @click="downClicked(index)">
                      <svg-next></svg-next>
                    </b-link>
                  </div>
                  <div class="controller-number">
                    {{ item.count }}
                  </div>
                  <div class="controller-up">
                    <b-link @click="upClicked(index)">
                      <svg-next></svg-next>
                    </b-link>
                  </div>
                </div>
                <div class="inf-cell money">
                  ￦ {{ numberWithCommas(item.price) }}
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
          <div class="last-guide">
            <p><b-link>유의사항</b-link>을 읽고 확인했습니다.</p>
          </div>
          <div class="order-buttons">
            <b-button @click="desktopCartClicked">장바구니</b-button>
            <b-button @click="desktopBuyClicked">구매하기</b-button>
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
          @touchstart.prevent="mobileCartClicked"
          @click.prevent="mobileCartClicked"
          >장바구니</b-button
        >
        <b-button
          @touchstart.prevent="mobileBuyClicked"
          @click.prevent="mobileBuyClicked"
          >구매하기</b-button
        >
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
            <div class="order-item" v-for="(item, index) in items" :key="index">
              <div class="item-name">
                <span>{{ item.name }}</span>
              </div>
              <div class="inf-row">
                <div class="inf-cell number-controller">
                  <div class="controller-down">
                    <b-link @click="downClicked(index)">
                      <svg-next></svg-next>
                    </b-link>
                  </div>
                  <div class="controller-number">
                    {{ item.count }}
                  </div>
                  <div class="controller-up">
                    <b-link @click="upClicked(index)">
                      <svg-next></svg-next>
                    </b-link>
                  </div>
                </div>
                <div class="inf-cell money">
                  ￦ {{ numberWithCommas(item.price) }}
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
          <div class="last-guide">
            <p><b-link>유의사항</b-link>을 읽고 확인했습니다.</p>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { BModal, BButton, BLink } from 'bootstrap-vue';
import { mapMutations } from 'vuex';

// const numberWithCommas = (x) =>
//   x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default {
  title: (vm) => vm.title,
  components: {
    BButton,
    BLink,
    BModal,
    PageHeader: () => import('@/components/PageHeader'),
    SvgNext: () => import('@/components/SvgNext'),
    CloseFigure: () => import('@/components/CloseFigure'),
  },
  data() {
    return {
      transportFee: 5000,
      mobileOrderModalVisible: false,
      content: '콘텐트',
      notice: '안내사항',
      keyword: { number: '01', name: '고독' },
      film_name: '여름날',
      name: '여름날',
      sidePhrase: '누구에게나 유배된 시간이 있다',
      items: [
        {
          name: '소파킷 01_고독 여름내',
          count: 1,
          price: 500000,
        },
        {
          name: '소파킷 02_고독 haha',
          count: 1,
          price: 10000,
        },
      ],
    };
  },
  computed: {
    title() {
      return `소파킷 ${this.keyword.number} ${this.keyword.name} - ${this.name}`;
    },
    headerTitle() {
      return `소파킷 ${this.keyword.number} - ${this.keyword.name} - ${this.name}`;
    },

    allSum() {
      let result = 0;
      this.items.forEach((item) => {
        result += item.price * item.count;
      });
      return result;
    },

    transportFeeView() {
      return `￦ ${this.numberWithCommas(this.transportFee)}`;
    },
    allPriceView() {
      return `￦ ${this.numberWithCommas(this.allSum + this.transportFee)}`;
    },
  },
  mounted() {
    this.setAdditionalFooterPaddingBottom(40);
  },
  beforeDestroy() {
    this.setAdditionalFooterPaddingBottom(0);
  },
  methods: {
    ...mapMutations(['setAdditionalFooterPaddingBottom']),
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    upClicked(index) {
      if (this.items[index].count < 99) {
        this.items[index].count += 1;
      }
    },
    downClicked(index) {
      if (this.items[index].count > 0) {
        this.items[index].count -= 1;
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
        this.desktopCartClicked();
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
        this.desktopBuyClicked();
      } else {
        this.$bvModal.show('mobile-order');
      }
    },

    desktopCartClicked() {},
    desktopBuyClicked() {},
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
  flex: 0 1 800px;
  height: 10000px;
  padding: 0 45px 0 80px;
  position: relative;
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

.number-controller {
  margin-top: 5px;
  display: flex;
  align-items: center;

  a:hover {
    color: #585858;
  }
  svg {
    width: 6px;
    border-style: solid;
    border-color: transparent;
    border-width: 0 17px 2px;
    box-sizing: content-box;
  }
}

// .number-controller .controller-down svg {
//   border-left: 0;
// }
.number-controller .controller-down svg,
.number-controller .controller-up svg {
  border-right: 0;
}
.controller-down svg {
  transform: scaleX(-1);
}

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
    text-align: center;
    font-size: 17px;
  }
  a {
    text-decoration: underline;
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
