<template>
  <div class="application">
    <header>
      <h2>상영 신청 목록</h2>
    </header>
    <!-- 신청 추가 / 엑셀로 다운로드 -->
    <div class="quick-menu d-flex justify-content-end mb-3">
      <b-button @click="addApplicationClicked" class="mr-2">
        <font-awesome-icon :icon="['far', 'plus-square']"></font-awesome-icon>
        <span class="button-content ml-2"> 신청 추가 </span>
      </b-button>
      <b-button @click="extractExcelClicked">
        <font-awesome-icon :icon="['far', 'file-excel']"> </font-awesome-icon>
        <span class="button-content ml-2"> 엑셀로 다운로드 </span>
      </b-button>
    </div>
    <!-- 필터 -->
    <div class="filter d-flex justify-content-between align-items-center mb-3">
      <!-- <div class="d-flex"> -->

      <!-- 날짜 필터 -->
      <b-dropdown
        size="sm"
        class="calendar-selector mr-2"
        @shown="calendarFilterShown"
      >
        <template #button-content>
          <span>
            <font-awesome-icon :icon="['far', 'calendar']"> </font-awesome-icon>
            <span class="button-content ml-2">{{ dateFilterText }}</span>
          </span>
        </template>
        <template v-slot="{ hide }">
          <div class="d-flex position-relative">
            <div class="d-flex flex-column">
              <span class="text-center"> 시작 날짜 </span>
              <b-calendar
                v-model="filter.startDate"
                value-as-date
                :date-disabled-fn="startDateDFN"
              ></b-calendar>
            </div>
            <div class="d-flex flex-column">
              <span class="text-center"> 끝 날짜 </span>
              <b-calendar
                v-model="filter.endDate"
                value-as-date
                :date-disabled-fn="endDateDFN"
              >
              </b-calendar>
            </div>
            <!-- <div class="position-absolute" :style="{ top: 0, right: 0 }">
              <b-button-close @click="hide"> </b-button-close>
            </div> -->
          </div>
        </template>
      </b-dropdown>
      <!-- 상태 필터 -->
      <b-dropdown size="sm" class="status-filter mr-2">
        <!-- @shown="satFilterShown" -->
        <template #button-content>
          <font-awesome-icon :icon="['fas', 'ring']"> </font-awesome-icon>
          <span class="button-content ml-2">{{ stateFilterText }}</span>
        </template>
        <template v-slot="{ hide }">
          <b-dropdown-form :style="{ minWidth: '630px' }">
            <div class="row">
              <div class="col">
                <h2><font-awesome-icon :icon="['far', 'file']" />서류</h2>
                <hr />
                <b-form-checkbox-group
                  :options="docStatusOptions"
                  v-model="filter.docStatus"
                ></b-form-checkbox-group>
              </div>
              <div class="col">
                <h2>
                  <font-awesome-icon :icon="['fas', 'won-sign']" />입금 및 정산
                </h2>
                <hr />
                <b-form-checkbox-group
                  :options="moneyStatusOptions"
                  v-model="filter.moneyStatus"
                ></b-form-checkbox-group>
              </div>
              <div class="col">
                <h2><font-awesome-icon :icon="['fas', 'truck']" />배송</h2>
                <hr />

                <b-form-checkbox-group
                  :options="transportStatusOptions"
                  v-model="filter.transportStatus"
                  class="mb-5"
                ></b-form-checkbox-group>

                <h2>
                  <font-awesome-icon
                    :icon="['fas', 'file-invoice-dollar']"
                  />세금계산서
                </h2>
                <hr />
                <b-form-checkbox-group
                  :options="receiptStatusOptions"
                  v-model="filter.receiptStatus"
                ></b-form-checkbox-group>
              </div>
            </div>
            <div class="d-flex position-relative"></div>
          </b-dropdown-form>
        </template>
      </b-dropdown>
      <!-- </div> -->
      <div class="d-flex ml-auto border-dark border">
        <b-form-input
          class="border-0"
          :style="{ width: '300px' }"
          placeholder="검색 ..."
        >
        </b-form-input>
        <loading-button :loading="loading" class="border-0">
          <font-awesome-icon :icon="['fas', 'search']"> </font-awesome-icon>
        </loading-button>
      </div>
    </div>
    <b-table
      class="table"
      :fields="tableFields"
      :items="tableItems"
      @row-clicked="rowClicked"
      @row-contextmenu="rowContextMenu"
    >
      <template #head(checked)="row">
        <b-form-checkbox
          :checked="allChecked"
          @change="allCheckChanged"
          :indeterminate="allCheckIndeterminate"
        ></b-form-checkbox>
      </template>
      <template #cell(checked)="row">
        <b-form-checkbox
          @change="itemCheckChanged"
          v-model="row.item.checked"
        ></b-form-checkbox>
      </template>
      <template #head(host)="row">
        <span class="table-head-text">주최</span>
        <info></info>
      </template>
      <template #head(film_title)="row">
        <span class="table-head-text">작품명</span>
        <info></info>
      </template>
      <template #head(charge)="row">
        <span class="table-head-text">상영료</span>
        <info></info>
      </template>
      <template #head(start_date)="row">
        <span class="table-head-text">상영시작일</span>
        <info></info>
      </template>
      <template #cell(start_date)="row">
        {{ formatDate(row.value) }}
      </template>
      <template #head(applicant_name)="row">
        <span class="table-head-text">신청자</span>
        <info></info>
      </template>
      <template #head(applicant_phone)="row">
        <span class="table-head-text">연락처</span>
        <info></info>
      </template>
      <template #cell(applicant_phone)="{ value }">
        <eye-box v-if="value" :text="value"></eye-box>
      </template>
      <template #head(applicant_email)="row">
        <span class="table-head-text">이메일</span>
        <info></info>
      </template>
      <template #cell(applicant_email)="{ value }">
        <eye-box v-if="value" :text="value"></eye-box>
      </template>
      <template #head(destination)="row">
        <span class="table-head-text">주소</span>
        <info></info>
      </template>
      <template #cell(destination)="{ value }">
        <eye-box v-if="value" :text="value"></eye-box>
      </template>
      <template #head(message)="row">
        <span class="table-head-text">메시지</span>
        <info></info>
      </template>
      <template #head(memo)="row">
        <span class="table-head-text">메모</span>
        <info></info>
      </template>
      <!-- 편집창 -->
      <template #row-details="row">
        <div class="row-details-iwrapper">
          <h2 class="row-details-header">상세 정보 조회 및 편집</h2>
          <h3 class="detail-header">주최 및 배송</h3>
          <form-row title="주최">
            <template #info> 주최 단체명이나 회사를 기입합니다. </template>
            <b-form-input v-model="editing.host"></b-form-input>
          </form-row>
          <form-row title="작품명">
            <b-form-input v-model="editing.film_title"></b-form-input>
          </form-row>
          <form-row title="상영료">
            <div class="d-flex align-items-center">
              <b-form-input
                v-model="editing.number"
                class="mr-2"
              ></b-form-input>
              <span>원</span>
            </div>
          </form-row>
          <form-row title="상영 시작일">
            <b-form-datepicker
              v-model="editing.start_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="상영 종료일">
            <b-form-datepicker
              v-model="editing.end_date"
              value-as-date
            ></b-form-datepicker>
          </form-row>
          <form-row title="상영 회차">
            <div class="d-flex align-items-center">
              <b-form-input
                number
                v-model="editing.number"
                class="mr-2"
              ></b-form-input>
              <span>회</span>
            </div>
          </form-row>
          <form-row title="상영 포맷">
            <b-form-input v-model="editing.format"></b-form-input>
          </form-row>
          <form-row title="담당자 이름">
            <b-form-input v-model="editing.applicant_name"></b-form-input>
          </form-row>
          <form-row title="담당자 연락처">
            <b-form-input v-model="editing.applicant_phone"></b-form-input>
          </form-row>
          <form-row title="담당자 이메일">
            <b-form-input v-model="editing.applicant_email"></b-form-input>
          </form-row>
          <form-row title="상영본 받을 주소">
            <b-form-input v-model="editing.destination"></b-form-input>
          </form-row>
          <form-row title="배송 상태">
            <b-form-select
              :options="transportStatusOptions"
              v-model="editing.transport_status"
            ></b-form-select>
          </form-row>
          <form-row title="택배사">
            <b-form-select
              :options="deliveryOptions"
              v-model="editing.transport_company"
            ></b-form-select>
          </form-row>
          <form-row title="송장번호">
            <b-form-input
              v-model="editing.transport_number"
              class="mb-2"
            ></b-form-input>
            <div class="d-flex align-items-center">
              <p class="m-0 mr-2">발송 정보 이메일</p>
              <b-button
                size="sm"
                @click="transportEmailSampleClicked(row)"
                class="mr-2"
                >샘플 보기</b-button
              >
              <loading-button
                :loading="transportEmailSendloading"
                size="sm"
                @click="transportEmailSendClicked(row)"
                class="mr-2"
                variant="primary"
                >발송하기</loading-button
              >
            </div>
          </form-row>
          <h3 class="detail-header d-flex align-items-center">
            <span class="mr-2">서류 및 정산</span>
            <b-button size="sm" class="mr-2" @click="receiptCopyClicked(row)"
              >세금계산서 발행 내용 복사</b-button
            >
            <info
              >세금계산서 발행 내용과 관련하여 클립보드로 복사를 합니다. 작품명,
              세금계산서 작성 일자, 발행 이메일, 공급가액, 부가가치세액이
              복사됩니다.
            </info>
          </h3>

          <form-row title="세금계산서 관련 정보 입력 링크">
            <!-- 정보 입력 링크가 살아있을 때 -->
            <div class="d-flex align-items-center" v-if="editing.reqdoc_token">
              <b-button size="sm" class="mr-2">링크 복사</b-button>
              <b-button size="sm" class="mr-2">링크 제거</b-button>
              <p class="m-0">
                만료일: {{ formatTime(editing.reqdoc_expire_date) }}
              </p>
            </div>
            <b-button size="sm" v-else>
              <font-awesome-icon
                :icon="['far', 'plus-square']"
              ></font-awesome-icon>
              <span class="button-content ml-2"> 링크 생성 </span>
            </b-button>
          </form-row>
          <form-row title="서류요청 이메일">
            <div class="doc-request container-fluid">
              <div class="row">
                <div class="col">
                  <h4>씨네소파가 보낼 것</h4>
                  <b-form-checkbox-group
                    :options="docSendOptions"
                    v-model="docSend"
                  >
                    <b-form-checkbox value="license"
                      >씨네소파 사업자등록증</b-form-checkbox
                    >
                    <b-form-checkbox value="bank"
                      >씨네소파 통장 사본</b-form-checkbox
                    >
                    <div class="d-flex align-items-center">
                      <b-form-checkbox value="estimate">견적서</b-form-checkbox>
                      <b-button
                        class="border-0"
                        size="sm"
                        @click="downloadEstimateClicked"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'download']"
                        ></font-awesome-icon>
                      </b-button>
                    </div>
                    <b-form-checkbox value="advertisement"
                      >홍보물</b-form-checkbox
                    >
                  </b-form-checkbox-group>
                </div>
                <div class="col">
                  <h4>업체에게 요청할 것</h4>
                  <b-form-checkbox-group
                    :options="docReceiveOptions"
                    v-model="docReceive"
                  >
                    <b-form-checkbox value="receive">
                      세금계산서 관련 정보 <br />
                      (사업자등록증, 작성일자, 이메일)
                    </b-form-checkbox>
                  </b-form-checkbox-group>
                </div>
              </div>
              <div class="row">
                <div class="col"></div>
              </div>
            </div>
          </form-row>
          <form-row title="세금계산서 상태">
            <b-form-select
              :options="receiptStatusOptions"
              v-model="editing.receipt_status"
            ></b-form-select>
          </form-row>
          <form-row title="서류 요청 상태">
            <b-form-select
              :options="docStatusOptions"
              v-model="editing.doc_status"
            ></b-form-select>
          </form-row>
          <form-row title="입금 예상일">
            <b-form-datepicker v-model="editing.deposit_date" value-as-date>
            </b-form-datepicker>
          </form-row>
          <form-row title="정산 상태">
            <b-form-select
              :options="moneyStatusOptions"
              v-model="editing.money_status"
            >
            </b-form-select>
          </form-row>
          <form-row title="업체 사업자등록증">
            <b-button
              size="sm"
              @click="compLicenseDownloadClicked"
              class="mr-2"
              :disabled="compLicenseDownloadButtonDisabled"
            >
              <font-awesome-icon :icon="['fas', 'download']" class="mr-2" />

              <span>다운로드</span></b-button
            >
            <b-button
              size="sm"
              @click="compLicenseUploadClicked"
              variant="primary"
            >
              <font-awesome-icon :icon="['fas', 'upload']" class="mr-2" />
              <span>직접 업로드</span></b-button
            >
          </form-row>
          <form-row title="세금계산서 작성 일자">
            <b-form-datepicker v-model="editing.receipt_date" value-as-date>
            </b-form-datepicker>
          </form-row>
          <form-row title="세금계산서 발행 이메일">
            <b-form-input v-model="editing.receipt_email"></b-form-input>
          </form-row>
          <form-row title="세금계산서 기타 요청">
            <b-form-textarea
              size="sm"
              v-model="editing.receipt_etc_req"
            ></b-form-textarea>
          </form-row>
          <h3 class="detail-header">기타</h3>
          <form-row title="기타 요청">
            <b-form-textarea
              size="sm"
              v-model="editing.etc_req"
            ></b-form-textarea>
          </form-row>
          <form-row title="메모">
            <b-form-textarea size="sm" v-model="editing.memo"></b-form-textarea>
          </form-row>
          <div class="d-flex position-sticky bottom-0">
            <b-button @click="row.item._showDetails = false" class="mr-2"
              >취소</b-button
            >
            <b-button @click="detailSaveButtonClicked" variant="primary">
              <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />
              변경사항 저장</b-button
            >
          </div>
        </div>
      </template>
    </b-table>
    <!-- 우클릭-->
    <b-button v-contextmenu:hello="testNumber">TEST</b-button>
    {{ testNumber }}
    <context-menu #default="payload" id="hello">
      <h3 class="context-menu-header">
        {{ contextMenuHeaderText }}
      </h3>
      <context-menu-button @click="TESTLinkClicked">
        테스트 링크
      </context-menu-button>
      <!-- <pre>
      {{ payload }}
      </pre> -->
    </context-menu>
    <pre>{{ $cm._map }}</pre>
    <pre>
    {{ tableItems }}
    </pre>
  </div>
</template>

<script>
import {
  BButton,
  BDropdown,
  BDropdownForm,
  BCalendar,
  BFormInput,
  BFormDatepicker,
  BFormSelect,
  BFormCheckboxGroup,
  BTable,
  BFormCheckbox,
  BFormTextarea,
} from 'bootstrap-vue';
import { debounce } from 'throttle-debounce';
import moment from 'moment';
import {
  applicationTransportStatusMap,
  applicationReceiptStatusMap,
  applicationMoneyStatusMap,
  applicationDocStatusMap,
  getDeliveryOptions,
} from '@/util';
import Info from '@/components/admin/Info.vue';
import EyeBox from '@/components/admin/EyeBox.vue';
import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuButton from '@/components/context-menu/ContextMenuButton.vue';
import FormRow from '@/components/admin/FormRow.vue';
import LoadingButton from '@/components/LoadingButton.vue';
/** @param {object} map 맵 */
const mapToOption = (map) =>
  Object.keys(map).map((value) => ({
    value,
    text: map[value],
  }));

export default {
  components: {
    BButton,
    BDropdown,
    BCalendar,
    BFormInput,
    BFormCheckboxGroup,
    BDropdownForm,
    BTable,
    BFormCheckbox,
    LoadingButton,
    Info,
    EyeBox,
    ContextMenu,
    ContextMenuButton,
    FormRow,
    BFormSelect,
    BFormDatepicker,
    BFormTextarea,
  },
  data() {
    return {
      testNumber: 1,
      key: '',
      loading: false,
      transportStatusOptions: mapToOption(applicationTransportStatusMap),
      receiptStatusOptions: mapToOption(applicationReceiptStatusMap),
      moneyStatusOptions: mapToOption(applicationMoneyStatusMap),
      docStatusOptions: mapToOption(applicationDocStatusMap),
      filter: {
        startDate: null,
        endDate: null,
        transportStatus: [],
        receiptStatus: [],
        moneyStatus: [],
        docStatus: [],
      },
      tableFields: [
        {
          key: 'checked',
        },
        {
          key: 'host',
        },
        {
          key: 'film_title',
        },
        {
          key: 'charge',
        },
        {
          key: 'start_date',
        },
        {
          key: 'applicant_name',
        },
        {
          key: 'applicant_phone',
        },
        {
          key: 'applicant_email',
        },
        {
          key: 'destination',
        },
        {
          key: 'message',
        },
        {
          key: 'memo',
        },
      ],
      tableItems: [
        {
          _showDetails: true,
          host: '하나은행',
          start_date: new Date(),
          reqdoc_token: '1234',
        },
        {
          _showDetails: false,
          applicant_name: 'hi',
          applicant_phone: '123-456-789',
          applicant_email: 'eszqsc112@naver.com',
          destination: '부산시 구덕로 265번길 8',
        },
        { _showDetails: false },
      ],
      allChecked: false,
      allCheckIndeterminate: false,
      debouncedFetchDataFunction: null,
      contextItem: {},
      editing: {},
      deliveryOptions: [],
      docSendOptions: [],
      docSend: [],
      docReceiveOptions: [],
      docReceive: [],
      transportEmailSendloading: false,
    };
  },
  watch: {
    filter(newValue, oldValue) {},
  },
  computed: {
    /** @returns {string} */
    dateFilterText() {
      const string = '상영시작일 선택';
      if (this.filter.startDate || this.filter.endDate) {
        return `상영시작일: ${this.formatDate(
          this.filter.startDate,
        )} ~ ${this.formatDate(this.filter.endDate)}`;
      }
      return string;
    },
    /** @returns {string} */
    stateFilterText() {
      const statusMaps = [
        applicationTransportStatusMap,
        applicationReceiptStatusMap,
        applicationMoneyStatusMap,
        applicationDocStatusMap,
      ];
      const statuses = [
        this.filter.transportStatus,
        this.filter.receiptStatus,
        this.filter.moneyStatus,
        this.filter.docStatus,
      ]
        .map((status, i) =>
          status.map((string) => statusMaps[i][string] ?? '오류'),
        )
        .flat(Infinity);
      if (statuses.length !== 0) {
        return `상태: ${statuses.join(', ')}`;
      }
      return '상태 선택';
    },
    /** @returns {boolean} */
    compLicenseDownloadButtonDisabled() {
      return !!this.editing.business_license_url;
    },
    /** @returns {string} */
    contextMenuHeaderText() {
      return `${this.contextItem.host ?? '(주최없음)'} ${
        this.contextItem.start_date
          ? this.formatDate(this.contextItem.start_date)
          : '(시작일없음)'
      } 상영`;
    },
  },
  mounted() {
    getDeliveryOptions()
      .then((result) => {
        this.deliveryOptions = result;
      })
      .catch((err) => {
        console.log('# Application getDeliveryOptions Error!');
        console.error(err);
      });
  },
  methods: {
    async debouncedFetchData() {
      if (!this.debouncedFetchDataFunction) {
        this.debouncedFetchDataFunction = debounce(700, true, this.fetchData);
      }
      this.debouncedFetchDataFunction();
    },
    async fetchData() {
      this.loading = true;
      await debounce;
      this.loading = false;
    },
    startDateDFN(ymd, date) {
      return date > this.filter.endDate;
    },
    endDateDFN(ymd, date) {
      return date < this.filter.startDate;
    },

    // -------------------------------
    // 이벤트리스너
    // -------------------------------
    formatDate(date) {
      if (date) return moment(date).format('yyyy.MM.DD');
      return '';
    },
    formatTime(date) {
      if (date) return moment(date).format('yyyy.MM.DD HH:mm:ss');
      return '';
    },
    addApplicationClicked() {
      // todo
    },
    extractExcelClicked() {
      // todo
    },
    calendarFilterShown() {
      if (!this.filter.startDate) {
        const pastYear = new Date();
        pastYear.setFullYear(pastYear.getFullYear() - 1);
        this.filter.endDate = new Date();
        this.filter.startDate = pastYear;
      }
    },
    allCheckChanged(value) {
      this.allChecked = value;
      this.allCheckIndeterminate = false;
    },
    itemCheckChanged() {
      this.$nextTick(() => {
        this.allChecked = false;
        let allTrue = true;
        let allFalse = true;
        this.tableItems.forEach((item) => {
          if (item.checked) {
            allFalse = false;
          } else {
            allTrue = false;
          }
        });
        if (allTrue) {
          this.allChecked = true;
          this.allCheckIndeterminate = false;
        } else if (allFalse) {
          this.allChecked = false;
          this.allCheckIndeterminate = false;
        } else {
          this.allChecked = false;
          this.allCheckIndeterminate = true;
        }
      });
    },
    rowClicked(item, index, event) {
      const sd = item._showDetails;
      if (sd) {
        item._showDetails = false;
      } else {
        this.tableItems.forEach((tableItem) => {
          tableItem._showDetails = false;
        });
        item._showDetails = true;
      }

      // editing 에 복사하기
      this.editing = { ...item };
    },
    rowContextMenu(item, index, event) {
      event.preventDefault();
      this.contextItem = { ...item };
      this.$cm.show('hello', event);
    },
    downloadEstimateClicked() {
      // todo
    },
    compLicenseDownloadClicked() {
      // todo
    },
    compLicenseUploadClicked() {
      // todo
    },
    TESTLinkClicked() {
      console.log('clicked!!!');
    },
    detailSaveButtonClicked() {
      // todo
    },
  },
  name: 'Application',
};
</script>

<style lang="scss" scoped>
.status-filter .b-dropdown-form {
  font-size: 14px;
  h2 {
    font-size: 16px;
  }
  svg {
    margin-right: 10px;
  }
}

.table-head-text {
  margin-right: 5px;
}
.btn.eye {
  border: 0;
  background-color: rgba(255, 255, 255, 0);
  &:hover,
  &:focus {
    color: #000;
    background-color: #ddd;
  }
}

.table {
  font-size: 14px;
}
.row-details-iwrapper {
  // border: 1px solid #888;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2);
  padding: 10px;
}
.row-details-header {
  font-size: 14px;
  color: #999;
}
.detail-header {
  margin-top: 30px;
  font-size: 18px;
  font-weight: bold;
}
h3.context-menu-header {
  font-size: 12px;
  font-weight: bold;
  color: #888;
}
.doc-request h4 {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}
</style>

<style>
</style>
