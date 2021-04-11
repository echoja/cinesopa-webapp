<template>
  <div class="application">
    <header>
      <h2>상영 신청 목록</h2>
    </header>
    <!-- 신청 추가 / 엑셀로 다운로드 -->
    <div class="quick-menu d-flex justify-content-end mb-3">
      <loading-button
        :loading="addApplicationLoading"
        @click="addApplicationClicked"
        class="mr-2"
      >
        <font-awesome-icon :icon="['far', 'plus-square']"></font-awesome-icon>
        <span class="button-content ml-2"> 신청 추가 </span>
      </loading-button>
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
          <div class="p-2">
            <div class="d-flex position-relative mb-2">
              <div class="d-flex flex-column">
                <span class="text-center"> <b>~부터</b> </span>
                <b-calendar
                  v-model="filter.startDate"
                  value-as-date
                  :date-disabled-fn="startDateDFN"
                  locale="ko"
                ></b-calendar>
              </div>
              <div class="d-flex flex-column">
                <span class="text-center"> <b>~ 까지</b> </span>
                <b-calendar
                  v-model="filter.endDate"
                  value-as-date
                  :date-disabled-fn="endDateDFN"
                  locale="ko"
                >
                </b-calendar>
              </div>
              <!-- <div class="position-absolute" :style="{ top: 0, right: 0 }">
              <b-button-close @click="hide"> </b-button-close>
            </div> -->
            </div>
            <div class="d-flex justify-content-end">
              <loading-button
                :loading="loading"
                variant="primary"
                @click="submitDateFilter(hide)"
              >
                <font-awesome-icon :icon="['fas', 'check']" class="mr-2" />
                <b>적용</b>
              </loading-button>
            </div>
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
          <b-dropdown-form :style="{ minWidth: '650px' }">
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
            <hr />
            <div class="d-flex justify-content-end">
              <loading-button
                :loading="loading"
                variant="primary"
                @click="submitStateFilter(hide)"
              >
                <font-awesome-icon :icon="['fas', 'check']" class="mr-2" />
                <b>적용</b>
              </loading-button>
            </div>
          </b-dropdown-form>
        </template>
      </b-dropdown>
      <!-- </div> -->
      <div class="d-flex ml-auto border-dark border">
        <b-form-input
          class="border-0"
          :style="{ width: '300px' }"
          placeholder="검색 ..."
          v-model="filter.search"
          @keydown.enter="searchButtonClicked"
        >
        </b-form-input>
        <loading-button
          :loading="loading"
          @click="searchButtonClicked"
          class="border-0"
        >
          <font-awesome-icon :icon="['fas', 'search']"> </font-awesome-icon>
        </loading-button>
      </div>
    </div>
    <b-table
      class="table"
      :fields="tableFields"
      :items="tableItems"
      primary-key="id"
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
      </template>
      <template #head(film_title)="row">
        <span class="table-head-text">작품명</span>
      </template>
      <template #head(charge)="row">
        <span class="table-head-text">상영료</span>
      </template>
      <template #head(start_date)="row">
        <span class="table-head-text">상영시작일</span>
        <info v-once>
          상영 시작일은 정렬의 기준입니다. 각 신청마다 시작일 뿐만 아니라
          종료일도 설정할 수 있습니다. 정렬할 때에는 시작일만 고려합니다.
        </info>
      </template>
      <template #cell(start_date)="row">
        {{ formatDate(row.value) }}
      </template>
      <template #head(applicant_name)="row">
        <span class="table-head-text">신청자</span>
        <info v-once>신청자의 이름입니다.</info>
      </template>
      <template #head(applicant_phone)="row">
        <span class="table-head-text">연락처</span>
        <info v-once>신청자의 연락처입니다.</info>
      </template>
      <template #cell(applicant_phone)="{ value }">
        <eye-box v-if="value" :text="value"></eye-box>
      </template>
      <template #head(applicant_email)="row">
        <span class="table-head-text">이메일</span>
        <info v-once>신청자의 이메일입니다.</info>
      </template>
      <template #cell(applicant_email)="{ value }">
        <eye-box v-if="value" :text="value"></eye-box>
      </template>
      <template #head(destination)="row">
        <span class="table-head-text">주소</span>
        <info v-once>상영본 배송지입니다.</info>
      </template>
      <template #cell(destination)="{ value }">
        <eye-box v-if="value" :text="value"></eye-box>
      </template>
      <template #head(message)="row">
        <span class="table-head-text">메시지</span>
        <info v-once>
          <div class="text-left">
            <p class="m-1">
              메시지는 특수한 상황을 알려주는 용도입니다. 특별한 메시지가 없다면
              회색으로 나타나며, 메시지가 있다면 검정색으로 나타납니다. 마우스를
              올리면 메시지를 확인할 수 있습니다.
            </p>
            <p class="m-1">다음은 메시지가 나타나는 상황들입니다.</p>
            <ol class="pl-4">
              <li>
                입금이 확인되지 않았을 때 입금예상월보다 초과되었을 때 --> "이번
                달 안에 입금되어야 합니다.", "입금 예정월이 지났지만 아직 입금이
                되지 않았습니다."
              </li>
              <li>
                아직 상영본을 보내지 않았는데 상영 날짜가 10일 이하일 때 -->
                "상영일까지 ~일 남았습니다."
              </li>
            </ol>
          </div>
        </info>
      </template>
      <template #head(memo)="row">
        <span class="table-head-text">메모</span>
        <info
          >관리자는 각 신청마다 메모를 설정할 수 있습니다. 메모가 있을 경우
          <b>검정 색</b>으로 표시되며, 주문에 메모 강조를 끈다고 설정하면 메모가
          없는 것처럼 옅은 색으로 표시됩니다.</info
        >
      </template>
      <!-- 편집창 -->
      <template #row-details="row">
        <div class="row-details-iwrapper">
          <h2 class="row-details-header">상세 정보 조회 및 편집</h2>
          <h3 class="detail-header">주최 및 배송</h3>
          <hr />
          <form-row title="주최">
            <template #info> 주최 단체명이나 회사를 기입합니다. </template>
            <b-form-input
              @input="changed.add('host')"
              v-model="editing.host"
            ></b-form-input>
          </form-row>
          <form-row title="작품명">
            <b-form-input
              @input="changed.add('film_title')"
              v-model="editing.film_title"
            ></b-form-input>
          </form-row>
          <form-row title="상영료">
            <div class="d-flex align-items-center">
              <b-form-input
                @input="changed.add('charge')"
                number
                v-model="editing.charge"
                class="mr-2"
              ></b-form-input>
              <span>원</span>
            </div>
          </form-row>
          <form-row title="상영 시작일">
            <b-form-datepicker
              @input="changed.add('start_date')"
              v-model="editing.start_date"
              value-as-date
              locale="ko"
            ></b-form-datepicker>
          </form-row>
          <form-row title="상영 종료일">
            <b-form-datepicker
              @input="changed.add('end_date')"
              v-model="editing.end_date"
              value-as-date
              locale="ko"
            ></b-form-datepicker>
          </form-row>
          <form-row title="상영 회차">
            <div class="d-flex align-items-center">
              <b-form-input
                @input="changed.add('session_count')"
                number
                v-model="editing.session_count"
                class="mr-2"
              ></b-form-input>
              <span>회</span>
            </div>
          </form-row>
          <form-row title="상영 포맷">
            <b-form-input
              @input="changed.add('format')"
              v-model="editing.format"
            ></b-form-input>
          </form-row>
          <form-row title="담당자 이름">
            <b-form-input
              @input="changed.add('applicant_name')"
              v-model="editing.applicant_name"
            ></b-form-input>
          </form-row>
          <form-row title="담당자 연락처">
            <b-form-input
              @input="changed.add('applicant_phone')"
              v-model="editing.applicant_phone"
            ></b-form-input>
          </form-row>
          <form-row title="담당자 이메일">
            <b-form-input
              @input="changed.add('applicant_email')"
              v-model="editing.applicant_email"
            ></b-form-input>
          </form-row>
          <form-row title="상영본 받을 주소">
            <b-form-input
              @input="changed.add('destination')"
              v-model="editing.destination"
            ></b-form-input>
          </form-row>
          <form-row title="배송 상태">
            <b-form-select
              @input="changed.add('transport_status')"
              :options="transportStatusOptions"
              v-model="editing.transport_status"
            ></b-form-select>
          </form-row>
          <form-row title="택배사">
            <b-form-select
              @input="changed.add('transport_company')"
              :options="deliveryOptions"
              v-model="editing.transport_company"
            ></b-form-select>
          </form-row>
          <form-row title="송장번호">
            <b-form-input
              @input="changed.add('transport_number')"
              v-model="editing.transport_number"
              class="mb-2"
            ></b-form-input>
            <!-- <div class="d-flex align-items-center">
              <p class="m-0 mr-2">
                발송 정보 이메일
                <info
                  >상영본을 발송했다는 내용의 메일을 신청자의 이메일로 보낼 수
                  있습니다. 샘플 보기에서 내용 확인 및 복사를 할 수 있고, 발송을
                  하게 되면 메일이 즉시 발송됩니다.</info
                >
              </p>
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
            </div> -->
          </form-row>
          <h3 class="detail-header d-flex align-items-center">
            <span class="mr-2">서류 및 정산</span>
            <b-button size="sm" class="mr-2" @click="receiptCopyClicked(row)"
              >세금계산서 발행 정보 복사</b-button
            >
            <info
              >세금계산서 발행 정보과 관련하여 클립보드로 복사를 합니다. 작품명,
              세금계산서 작성 일자, 발행 이메일, 공급가액, 부가가치세액이
              복사됩니다.
            </info>
          </h3>
          <hr />
          <form-row title="세금계산서 관련 정보 입력 링크">
            <!-- 정보 입력 링크가 살아있을 때 -->
            <template #info
              >세금계산서 관련 정보를 입력할 수 있는 별도의 폼 링크를
              생성합니다. 바로 아래에서 서류 관련 이메일 발송할 때 이용할 수
              있습니다. 생성된 링크로 직접 들어가서 링크가 제대로 동작하는지도
              확인할 수 있고 신청자에게 직접 전달할 수 있습니다.</template
            >
            <div class="d-flex align-items-center" v-if="editing.reqdoc_token">
              <b-button size="sm" class="mr-2">링크 복사</b-button>
              <b-button size="sm" class="mr-2">링크 제거</b-button>
              <p class="m-0">
                만료일: {{ formatTime(new Date(editing.reqdoc_expire_date)) }}
              </p>
            </div>
            <loading-button
              :loading="updateNewTaxReqLinkLoading"
              @click="createReqTaxinfoButtonClicked(row)"
              size="sm"
              v-else
            >
              <font-awesome-icon
                :icon="['far', 'plus-square']"
              ></font-awesome-icon>
              <span class="button-content ml-2"> 링크 생성 </span>
            </loading-button>
          </form-row>
          <form-row title="서류요청 이메일">
            <template #info
              >신청자에게 서류 관련 전달/요청 메일을 보낼 수 있습니다.</template
            >
            <div class="doc-request container-fluid">
              <div class="row mb-3">
                <div class="col">
                  <h4>씨네소파가 보낼 것</h4>
                  <b-form-checkbox-group
                    :options="docSendOptions"
                    v-model="docSend"
                  >
                    <b-form-checkbox value="license">
                      씨네소파 사업자등록증
                    </b-form-checkbox>
                    <info
                      >sopaseom.com 사이트 옵션에서 먼저 설정해야 합니다.
                    </info>
                    <b-form-checkbox value="bank"
                      >씨네소파 통장 사본
                    </b-form-checkbox>
                    <info v-once>
                      sopaseom.com 사이트 옵션에서 먼저 설정해야 합니다.
                    </info>
                    <div class="d-flex align-items-center">
                      <b-form-checkbox value="estimate">
                        견적서
                      </b-form-checkbox>
                      <b-button
                        class="border-0"
                        size="sm"
                        @click="downloadEstimateClicked"
                      >
                        <font-awesome-icon :icon="['fas', 'download']">
                        </font-awesome-icon>
                      </b-button>
                    </div>
                    <b-form-checkbox value="advertisement">
                      홍보물
                    </b-form-checkbox>
                    <info v-once>
                      먼저 해당 영화 설정에서 설정해야 합니다.
                    </info>
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
                      <info v-once>
                        먼저 <b>세금계산서 관련 정보 링크를 생성</b>해야 합니다.
                        바로 한칸 위에서 링크를 생성해야 활성화됩니다.
                      </info>
                    </b-form-checkbox>
                  </b-form-checkbox-group>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <b-button
                    size="sm"
                    @click="reqDocLinkSampleClicked(row)"
                    class="mr-2"
                    >샘플 보기</b-button
                  >
                  <loading-button
                    :loading="transportEmailSendloading"
                    size="sm"
                    @click="reqDocLinkSendClicked(row)"
                    class="mr-2"
                    variant="primary"
                    >발송하기</loading-button
                  >
                </div>
              </div>
            </div>
          </form-row>
          <form-row title="세금계산서 상태">
            <template #info>
              필터링 하는 데 사용되는 것 외에 특별한 용도는 없습니다.<br />자동으로
              수정되지 않으므로 직접 설정해야 합니다.
            </template>
            <b-form-select
              @input="changed.add('receipt_status')"
              :options="receiptStatusOptions"
              v-model="editing.receipt_status"
            ></b-form-select>
          </form-row>
          <form-row title="서류 요청 상태">
            <template #info>
              필터링 하는 데 사용되는 것 외에 특별한 용도는 없습니다.<br />자동으로
              수정되지 않으므로 직접 설정해야 합니다.
            </template>
            <b-form-select
              @input="changed.add('doc_status')"
              :options="docStatusOptions"
              v-model="editing.doc_status"
            ></b-form-select>
          </form-row>
          <form-row title="입금 예상일">
            <template #info>
              신청 목록에서 입금과 관련한 메시지 안내를 줄 때 사용됩니다.
            </template>
            <b-form-datepicker
              @input="changed.add('deposit_date')"
              v-model="editing.deposit_date"
              value-as-date
              locale="ko"
            >
            </b-form-datepicker>
          </form-row>
          <form-row title="정산 상태">
            <template #info>
              필터링 하는 데 사용되는 것 외에 특별한 용도는 없습니다.<br />자동으로
              수정되지 않으므로 직접 설정해야 합니다.
            </template>
            <b-form-select
              @input="changed.add('money_status')"
              :options="moneyStatusOptions"
              v-model="editing.money_status"
            >
            </b-form-select>
          </form-row>
          <form-row title="업체 사업자등록증">
            <template #info>
              신청자가 링크를 통해 사업자등록증을 업로드했다면 자동으로
              반영됩니다. 관리자가 직접 파일을 지정하여 업로드할 수 있습니다.
              등록한다면 변경사항을 저장하지 않아도 곧바로 적용됩니다.
            </template>
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
              <span>직접 등록</span></b-button
            >
          </form-row>
          <form-row title="세금계산서 작성 일자">
            <b-form-datepicker
              @input="changed.add('receipt_date')"
              v-model="editing.receipt_date"
              value-as-date
              locale="ko"
            >
            </b-form-datepicker>
          </form-row>
          <form-row title="세금계산서 발행 이메일">
            <b-form-input
              @input="changed.add('receipt_email')"
              v-model="editing.receipt_email"
            ></b-form-input>
          </form-row>
          <form-row title="세금계산서 기타 요청">
            <b-form-textarea
              size="sm"
              @input="changed.add('receipt_etc_req')"
              v-model="editing.receipt_etc_req"
            ></b-form-textarea>
          </form-row>
          <h3 class="detail-header">기타</h3>
          <hr />
          <form-row title="기타 요청">
            {{ editing.etc_req || '-' }}
            <!-- <b-form-textarea
              size="sm"
              @input="changed.add('etc_req')"
              v-model="editing.etc_req"
            ></b-form-textarea> -->
          </form-row>
          <form-row title="메모">
            <b-form-textarea
              size="sm"
              @input="changed.add('memo')"
              v-model="editing.memo"
              class="mb-2"
            ></b-form-textarea>
            <b-form-checkbox
              @input="changed.add('memo_unremarked')"
              v-model="editing.memo_unremarked"
              >메모 강조 표시를 해제합니다.</b-form-checkbox
            >
          </form-row>
          <apply-button-set
            @ok="detailSaveButtonClicked(row)"
            @cancel="row.item._showDetails = false"
            :disabled="changed.size === 0"
            :loading="detailSaveButtonLoading"
          ></apply-button-set>
          <!-- <div class="d-flex position-sticky bottom-0 justify-content-end"> -->
          <!-- <b-button @click="row.item._showDetails = false" class="mr-2"
              >취소</b-button
            >
            <b-button @click="detailSaveButtonClicked" variant="primary">
              <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />
              변경사항 저장</b-button
            > -->
          <!-- </div> -->
        </div>
      </template>
    </b-table>
    <div class="pagination-wrapper">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="totalPages"
        align="center"
        :value="page + 1"
        use-router
      ></b-pagination-nav>
    </div>
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
      <pre>
      {{ payload }}
      </pre>
    </context-menu>
    <pre>{{ changed }}</pre>
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
  BPaginationNav,
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
import ApplyButtonSet from '@/components/admin/button/ApplyButtonSet.vue';
import { makeSimpleMutation, makeSimpleQuery } from '@/api/graphql-client';
import { mapActions } from 'vuex';
import axios from 'axios';
import fileDownload from 'js-file-download';

/** @param {object} map 맵 */
const mapToOption = (map) =>
  Object.keys(map).map((value) => ({
    value,
    text: map[value],
  }));
const updateApplicationReq = makeSimpleMutation('updateApplication');

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
    ApplyButtonSet,
    BPaginationNav,
  },
  data() {
    return {
      changed: new Set(),
      detailSaveButtonLoading: false,
      addApplicationLoading: false,
      updateNewTaxReqLinkLoading: false,
      loading: false,
      transportEmailSendloading: false,
      testNumber: 1,
      key: '',
      total: 1,
      transportStatusOptions: mapToOption(applicationTransportStatusMap),
      receiptStatusOptions: mapToOption(applicationReceiptStatusMap),
      moneyStatusOptions: mapToOption(applicationMoneyStatusMap),
      docStatusOptions: mapToOption(applicationDocStatusMap),
      filter: {
        /** @type {Date} */
        startDate: null,
        /** @type {Date} */
        endDate: null,
        transportStatus: [],
        receiptStatus: [],
        moneyStatus: [],
        docStatus: [],
        search: '',
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
      tableItems: [],
      allChecked: false,
      allCheckIndeterminate: false,
      contextItem: {},
      editing: {},
      deliveryOptions: [],
      docSendOptions: [],
      docSend: [],
      docReceiveOptions: [],
      docReceive: [],
      // debouncedFetchDataFunction: null,
    };
  },

  computed: {
    // /** @returns {string[]} */
    // async deliveryOptions() {
    // },

    /** @returns {number} */
    perpage() {
      return 20;
    },
    /** @returns {number} */
    totalPages() {
      const { perpage } = this;
      const o = Math.ceil(this.total / perpage);
      if (o === 0) return 1;
      // console.log('# Orders totalPages o');
      // console.log(o);
      return o;
    },

    /** @returns {number} */
    page() {
      const { page } = this.$route.query;
      return page ? parseInt(page, 10) - 1 : 0;
    },
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
  async mounted() {
    const result = await getDeliveryOptions();
    this.deliveryOptions = result;

    await this.fetchData();
  },
  methods: {
    ...mapActions(['pushMessage']),
    async createReqTaxinfoButtonClicked(row) {
      this.updateNewTaxReqLinkLoading = true;
      const updateNewTaxReqLinkReq = makeSimpleMutation('updateNewTaxReqLink');
      const res = await updateNewTaxReqLinkReq(
        { id: row.item.id },
        `{
        success code token expire_date
        }`,
      );
      // 실패했을 시
      if (!res.success) {
        console.error(res.code);
        this.pushMessage({
          type: 'danger',
          id: 'UpdateNewTaxReqLinkFailed',
          msg: '요청 링크 생성이 실패했습니다.',
        });
        this.updateNewTaxReqLinkLoading = false;
        return;
      }
      this.editing.reqdoc_expire_date = res.expire_date;
      this.editing.reqdoc_token = res.token;
      this.pushMessage({
        type: 'success',
        id: 'UpdateNewTaxReqLinkSuccess',
        msg: '성공적으로 요청 링크를 생성했습니다.',
      });
      this.updateNewTaxReqLinkLoading = false;
    },
    // async debouncedFetchData() {
    //   if (!this.debouncedFetchDataFunction) {
    //     this.debouncedFetchDataFunction = debounce(700, true, this.fetchData);
    //   }
    //   this.debouncedFetchDataFunction();
    // },
    async fetchData() {
      this.loading = true;
      const applicationsAdminReq = makeSimpleQuery('applicationsAdmin');
      const result = await applicationsAdminReq(
        {
          condition: {
            date_gte: this.filter.startDate,
            date_lte: this.filter.endDate,
            transport_status: this.filter.transportStatus,
            doc_status: this.filter.docStatus,
            money_status: this.filter.moneyStatus,
            receipt_status: this.filter.receiptStatus,
            page: this.page,
            perpage: this.perpage,
            search: this.filter.search,
          },
        },
        `{
          total list {
            id host c_date m_date film_title charge start_date
            end_date session_count format applicant_name applicant_phone
            applicant_email destination transport_company transport_number
            transport_status doc_status money_status receipt_status
            business_license_filename business_license_url deposit_date receipt_date
            receipt_email receipt_etc_req reqdoc_token reqdoc_expire_date
            search etc_req memo memo_unremarked meta
          }
        }`,
      );
      const tableItems = result.list.map((item) => ({
        ...item,
        _showDetails: false,
      }));
      this.total = result.total;
      this.tableItems = Object.freeze(tableItems);
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
      console.log(date);
      if (date) return moment(date).format('yyyy.MM.DD HH:mm:ss');
      return '';
    },
    async addApplicationClicked() {
      this.addApplicationLoading = true;
      const createApplicationReq = makeSimpleMutation('createApplication');
      await createApplicationReq(
        { input: { host: '신규 등록됨' } },
        '{success code application_id}',
      );
      this.pushMessage({
        type: 'success',
        id: 'createApplicationSuccess',
        msg:
          '성공적으로 새 신청서가 등록되었습니다. 세부 내용은 클릭하여 수정하시기 바랍니다.',
      });
      await this.fetchData();
      this.addApplicationLoading = false;
    },
    async extractExcelClicked() {
      const response = await axios.get('/graphql/get-excel', {
        withCredentials: true,
        responseType: 'blob',
        params: {
          type: 'application',
          // date_lte: this.filter.endDate.toISOString(),
          // date_gte: this.filter.startDate.toISOString(),
          // transport_status: this.filter.transportStatus.join(','),
          // doc_status: this.filter.docStatus.join(','),
          // money_status: this.filter.moneyStatus.join(','),
          // receipt_status: this.filter.receiptStatus.join(','),
          // search: this.filter.search,
        },
      });
      fileDownload(response.data, `cinesopa_applications_${moment().format('yyyy-mm-dd')}.xlsx`);
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
    blank() {
      //
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
      this.changed = new Set();
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
    async detailSaveButtonClicked(row) {
      this.detailSaveButtonLoading = true;
      const changed = [...this.changed.values()];
      const values = {};
      changed.forEach((key) => {
        values[key] = this.editing[key];
      });
      let res = {};
      try {
        res = await updateApplicationReq(
          {
            id: row.item.id,
            input: values,
          },
          '{success code}',
        );
      } catch (e) {
        console.error(e);
      }
      // 성공했을 시
      if (res.success === true) {
        this.pushMessage({
          type: 'success',
          id: 'updateApplicationSuccess',
          msg: '신청서 수정이 완료되었습니다.',
        });
        row.item._showDetails = false;
        this.editing = {};
        await this.fetchData();
      } else {
        // 실패했을 시
        console.error('신청서 수정이 실패했습니다.');
        console.error(res.code);
        this.pushMessage({
          type: 'danger',
          id: 'updateApplicationFailed',
          msg: '신청서 수정이 실패했습니다.',
        });
      }
      this.detailSaveButtonLoading = false;
    },
    async reqDocLinkSendClicked(row) {
      // todo
    },
    async reqDocLinkSampleClicked(row) {
      // todo
    },
    submitToChange(key) {
      this.changed.add(key);
    },
    linkGen(pageNum) {
      return {
        name: 'AdminApplication',
        query: { ...this.$route.query, page: pageNum },
      };
    },
    async searchButtonClicked(event) {
      // 키보드 이벤트라면
      if (event.key) {
        event.target.blur();
      }
      console.log(event);
      await this.fetchData();
    },
    async submitDateFilter(hideMethod) {
      await this.fetchData();
      hideMethod();
    },
    async submitStateFilter(hideMethod) {
      await this.fetchData();
      hideMethod();
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
