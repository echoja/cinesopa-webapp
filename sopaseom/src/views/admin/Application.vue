<template>
  <div class="application">
    <b-overlay :show="loading" rounded="sm">
      <header>
        <h2>상영 신청 목록</h2>
        <p>
          각 항목을 클릭하여 세부 내용을 확인하고 수정하세요. 각 항목을 우클릭하면 편의 메뉴

          <info>
            <ul class="pl-4 text-left">
              <li class="m-1">
                편집 및 삭제
              </li>
              <li class="m-1">
                <b>정산 상태, 배송 상태, 세금계산서 상태</b> 다음 단계로
                편리하게 변경 (각 상태가 설정되어 있지 않거나 제일 마지막 단계일
                경우 비활성화됨.)
              </li>
              <li class="m-1">견적서 다운로드</li>
              <li class="m-1">세금계산서 발행 정보 요청 링크 생성 및 복사</li>
              <li class="m-1">세금계산서 발행 정보 복사 (상영료, 발행 작성일자, 발행 이메일이 설정되어 있지 않을 시 비활성화)</li>
            </ul>
          </info>
          가 나타납니다!
        </p>
      </header>
      <!-- 신청 추가 / 엑셀로 다운로드 -->
      <div class="quick-menu d-flex justify-content-end mb-3">
        <loading-button
          size="sm"
          :loading="addApplicationLoading"
          @click="addApplicationClicked"
          class="mr-2"
        >
          <font-awesome-icon :icon="['far', 'plus-square']"></font-awesome-icon>
          <span class="button-content ml-2"> 신청 추가 </span>
          <info v-once>
            내용이 없는 신청을 하나 추가합니다. 지금 날짜를 기준으로 대략 10개월 뒤의 날로 초기화합니다.
          </info>
        </loading-button>
        <loading-button
          size="sm"
          :loading="excelLoading"
          @click="extractExcelClicked"
        >
          <font-awesome-icon :icon="['far', 'file-excel']"> </font-awesome-icon>
          <span class="button-content ml-2"> 엑셀로 다운로드 </span>
          <info v-once>
            현재 필터와 검색 결과로 모든 데이터를 엑셀로 가져옵니다.
          </info>
        </loading-button>
      </div>
      <!-- 필터 -->
      <div
        class="filter d-flex justify-content-between align-items-center mb-3"
      >
        <!-- <div class="d-flex"> -->
        <!-- 선택된 항목 일괄처리 -->
        <b-dropdown size="sm" class="process-selected mr-2" v-if="hasChecked">
          <template #button-content>
            <span> 선택된 항목 일괄처리 </span>
          </template>
          <b-dropdown-item
            @click="$bvModal.show('remove-confirm-modal')"
            variant="danger"
          >
            <span class="font-weight-bold"> 삭제 </span>
          </b-dropdown-item>
        </b-dropdown>
        <b-modal
          id="remove-confirm-modal"
          @ok="removeCheckedClicked"
          cancel-title="취소"
          ok-variant="danger"
          ok-title="네, 삭제합니다."
          hide-header
        >
          <b>
            {{ tableItems.filter((item) => item.checked === true).length }} 건의
            항목을 정말로 삭제하시겠습니까? 이 행동은 복구할 수 없습니다.
          </b>
        </b-modal>

        <!-- 날짜 필터 -->
        <b-dropdown
          size="sm"
          class="calendar-selector mr-2"
          @shown="calendarFilterShown"
        >
          <template #button-content>
            <span>
              <font-awesome-icon :icon="['far', 'calendar']">
              </font-awesome-icon>
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
                    <font-awesome-icon :icon="['fas', 'won-sign']" />입금 및
                    정산
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
        <div class="d-flex align-items-center ml-auto border-dark border">
          <b-form-input
            class="border-0 mr-1"
            size="sm"
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
        <template #head(checked)="">
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
        <template #head(host)="">
          <span class="table-head-text">주최</span>
        </template>
        <template #head(film_title)="">
          <span class="table-head-text">작품명</span>
        </template>
        <template #head(charge)="">
          <span class="table-head-text">상영료</span>
        </template>
        <template #head(start_date)="">
          <span class="table-head-text">상영시작일</span>
          <info v-once>
            상영 시작일은 정렬의 기준입니다. 각 신청마다 시작일 뿐만 아니라
            종료일도 설정할 수 있습니다. 정렬할 때에는 시작일만 고려합니다.
          </info>
        </template>
        <template #cell(start_date)="row">
          {{ formatDate(row.value) }}
        </template>
        <template #head(applicant_name)="">
          <span class="table-head-text">신청자</span>
          <info v-once>신청자의 이름입니다.</info>
        </template>
        <template #head(applicant_phone)="">
          <span class="table-head-text">연락처</span>
          <info v-once>신청자의 연락처입니다.</info>
        </template>
        <template #cell(applicant_phone)="{ value }">
          <eye-box v-if="value" :text="value"></eye-box>
        </template>
        <template #head(applicant_email)="">
          <span class="table-head-text">이메일</span>
          <info v-once>신청자의 이메일입니다.</info>
        </template>
        <template #cell(applicant_email)="{ value }">
          <eye-box v-if="value" :text="value"></eye-box>
        </template>
        <template #head(destination)="">
          <span class="table-head-text">주소</span>
          <info v-once>상영본 배송지입니다.</info>
        </template>
        <template #cell(destination)="{ value }">
          <eye-box v-if="value" :text="value"></eye-box>
        </template>
        <template #head(message)="">
          <span class="table-head-text">메시지</span>
          <info v-once>
            <div class="text-left">
              <p class="m-1">
                메시지는 특수한 상황을 알려주는 용도입니다. 특별한 메시지가
                없다면 회색으로 나타나며, 메시지가 있다면 검정색으로 나타납니다.
                마우스를 올리면 메시지를 확인할 수 있습니다.
              </p>
              <p class="m-1">다음은 메시지가 나타나는 상황들입니다.</p>
              <ol class="pl-4">
                <li>
                  입금이 확인되지 않았을 때 입금예상월보다 초과되었을 때 -->
                  "이번 달 안에 입금되어야 합니다.", "입금 예정월이 지났지만
                  아직 입금이 되지 않았습니다."
                </li>
                <li>
                  아직 상영본을 보내지 않았는데 상영 날짜가 10일 이하일 때 -->
                  "상영일까지 ~일 남았습니다."
                </li>
              </ol>
            </div>
          </info>
        </template>
        <template #head(memo)="">
          <span class="table-head-text">메모</span>
          <info
            >관리자는 각 신청마다 메모를 설정할 수 있습니다. 메모가 있을 경우
            <b>검정 색</b>으로 표시되며, 주문에 메모 강조를 끈다고 설정하면
            메모가 없는 것처럼 옅은 색으로 표시됩니다.</info
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
            <form-row title="행사명">
              <template #info> 행사 이름을 기입합니다. </template>
              <b-form-input
                @input="changed.add('festival')"
                v-model="editing.festival"
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
              <b-button
                size="sm"
                class="mr-2"
                @click="editingReceiptCopyClicked(row)"
                :disabled="
                  !editing.charge ||
                  !editing.receipt_date ||
                  !editing.receipt_email
                "
                >세금계산서 발행 정보 복사</b-button
              >
              <info
                >세금계산서 발행 정보과 관련하여 클립보드로 복사를 합니다.
                작품명, 세금계산서 작성 일자, 발행 이메일, 공급가액,
                부가가치세액이 복사됩니다. <b>상영료</b>,
                <b>세금계산서 작성 일자</b>, <b>세금계산서 발행 이메일</b>을
                먼저 작성해야 합니다.
              </info>
            </h3>
            <hr />
            <form-row title="세금계산서 관련 정보 입력 링크">
              <!-- 정보 입력 링크가 살아있을 때 -->
              <template #info
                >세금계산서 관련 정보를 입력할 수 있는 별도의 폼 링크를
                생성합니다. 생성된 링크를 신청자에게 직접 전달하여 필요한
                세금계산서 정보를 입력받으세요. 변경사항을 저장하지 않아도
                링크는 저장이 됩니다.</template
              >
              <div
                class="d-flex align-items-center"
                v-if="editing.reqdoc_token"
              >
                <b-button size="sm" class="mr-2" @click="taxReqLinkCopyClicked"
                  >링크 복사</b-button
                >
                <b-button
                  size="sm"
                  class="mr-2"
                  @click="taxReqLinkRemoveClicked"
                  >링크 제거</b-button
                >
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
            <form-row title="견적서">
              <loading-button
                class="border-0"
                size="sm"
                @click="downloadEstimateClicked(row)"
                :loading="downloadingEstimate"
              >
                <font-awesome-icon :icon="['fas', 'download']">
                </font-awesome-icon>
              </loading-button>
            </form-row>
            <!-- <form-row title="서류요청 이메일">
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
          </form-row> -->
            <form-row title="세금계산서 정보">
              <template #info>
                위에서 입력된 상영료를 바탕으로 공급가액과 세액을 계산합니다.
              </template>
              <table>
                <tr>
                  <td>상영료 (부가세 포함)</td>
                  <td>{{ editing.charge }} 원</td>
                </tr>
                <tr>
                  <td>공급가액</td>
                  <td>
                    {{ editing.charge - Math.round(editing.charge / 11) }} 원
                  </td>
                </tr>
                <tr>
                  <td>세액</td>
                  <td>{{ Math.round(editing.charge / 11) }} 원</td>
                </tr>
              </table>
              <!-- <p class="m-0"></p>
            <p class="m-0">
              :

            </p>
            <p class="m-0"></p> -->
            </form-row>
            <form-row title="세금계산서 상태">
              <template #info>
                필터링할 때에만 사용됩니다.<br />자동으로 수정되지 않으므로 직접
                설정해야 합니다.
              </template>
              <b-form-select
                @input="changed.add('receipt_status')"
                :options="receiptStatusOptions"
                v-model="editing.receipt_status"
              ></b-form-select>
            </form-row>
            <form-row title="서류 요청 상태">
              <template #info>
                필터링할 때에만 사용됩니다.<br />자동으로 수정되지 않으므로 직접
                설정해야 합니다.
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
                반영됩니다. 관리자가 직접 파일을 지정할 수 있습니다.
              </template>
              <single-file-field
                v-model="editingBusinessLicense"
                @input="editingBusinessLicenseChanged"
              ></single-file-field>
              <!-- <b-button
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
            > -->
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
          @change="pageChanged"
        ></b-pagination-nav>
      </div>
      <!-- 우클릭-->
      <!-- <b-button v-contextmenu:hello="testNumber">TEST</b-button>
    {{ testNumber }} -->

      <!-- 콘텍스트 메뉴 (우클릭 메뉴) -->
      <context-menu
        #default="// eslint-disable-next-line vue/no-unused-vars
      payload"
        id="application-context"
      >
        <h3 class="context-menu-header">
          {{ contextMenuHeaderText }}
        </h3>
        <context-menu-button @click="contextEditClicked">
          편집
        </context-menu-button>
        <context-menu-button
          v-if="hasNextMoneyStatus"
          @click="nextMoneyStatusClicked"
        >
          정산 상태 : {{ beforeMoneyStatus }}에서 <b>{{ afterMoneyStatus }}</b
          >(으)로 변경
        </context-menu-button>
        <context-menu-button
          v-if="hasNextTransportStatus"
          @click="nextTransportStatusClicked"
        >
          배송 상태 : {{ beforeTransportStatus }}에서
          <b>{{ afterTransportStatus }}</b
          >(으)로 변경
        </context-menu-button>
        <context-menu-button
          v-if="hasNextReceiptStatus"
          @click="nextReceiptStatusClicked"
        >
          세금계산서 : {{ beforeReceiptStatus }}에서
          <b>{{ afterReceiptStatus }}</b
          >(으)로 변경
        </context-menu-button>
        <!-- <context-menu-button @click="contextEstimateDownloadClicked">
        상영료 입금 예정월 한달 미루기
      </context-menu-button> -->
        <hr class="my-2" />
        <context-menu-button @click="contextEstimateDownloadClicked">
          견적서 다운로드
        </context-menu-button>
        <context-menu-button
          v-if="contextItem.business_license_filename"
          @click="contextDownloadLicenseClicked"
        >
          사업자등록증 다운로드
        </context-menu-button>
        <context-menu-button
          v-if="!contextItem.reqdoc_token"
          @click="contextCreateTaxLinkClicked"
        >
          세금계산서 발행 정보 요청 링크 생성 및 복사
        </context-menu-button>
        <context-menu-button v-else @click="contextCopyTaxLinkClicked">
          세금계산서 발행 정보 요청 링크 복사
        </context-menu-button>
        <context-menu-button v-if="contextItem.charge && contextItem.receipt_date && contextItem.receipt_email" @click="contextReceiptCopyClicked">
          세금계산서 발행 정보 복사
        </context-menu-button>
        <hr class="my-2" />
        <context-menu-button
          class="text-red"
          @click="$bvModal.show('context-app-remove-modal')"
        >
          삭제
        </context-menu-button>

        <!-- <pre>
      {{ payload }}
      </pre> -->
      </context-menu>
      <b-modal
        id="context-app-remove-modal"
        @ok="contextRemoveClicked"
        cancel-title="취소"
        ok-variant="danger"
        ok-title="네, 삭제합니다."
        hide-header
      >
        이 항목을 정말로 삭제하시겠습니까? 삭제되면 복구할 수 없습니다.
      </b-modal>
      <!-- <pre>{{ changed }}</pre>
    <pre>{{ $cm._map }}</pre>
    <pre>
    {{ tableItems }}
    </pre> -->
    </b-overlay>
  </div>
</template>

<script>
import {
  BButton,
  BDropdown,
  BDropdownItem,
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
  BOverlay,
} from 'bootstrap-vue';
import moment from 'moment';
import {
  applicationTransportStatusMap,
  applicationTransportStatusOrder,
  applicationReceiptStatusMap,
  applicationReceiptStatusOrder,
  applicationMoneyStatusMap,
  applicationMoneyStatusOrder,
  applicationDocStatusMap,
  getDeliveryOptions,
  getSeoulDates,
  downloadLink,
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
import SingleFileField from '@/components/admin/SingleFileField.vue';
import copy from 'copy-to-clipboard';

/** @param {object} map 맵 */
const mapToOption = (map) =>
  Object.keys(map).map((value) => ({
    value,
    text: map[value],
  }));
const updateApplicationReq = makeSimpleMutation('updateApplication');
const fileReq = makeSimpleQuery('file');
const removeTaxReqLinkReq = makeSimpleMutation('removeTaxReqLink');
const removeApplicationReq = makeSimpleMutation('removeApplication');
const updateNewTaxReqLinkReq = makeSimpleMutation('updateNewTaxReqLink');

export default {
  components: {
    BButton,
    BDropdown,
    BCalendar,
    BFormInput,
    BFormCheckboxGroup,
    BDropdownForm,
    BDropdownItem,
    BTable,
    BFormCheckbox,
    BOverlay,
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
    SingleFileField,
  },
  data() {
    return {
      changed: new Set(),
      currentContextItemIndex: null,
      excelLoading: false,
      detailSaveButtonLoading: false,
      addApplicationLoading: false,
      updateNewTaxReqLinkLoading: false,
      loading: false,
      transportEmailSendloading: false,
      downloadingEstimate: false,
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
      editingBusinessLicense: {},
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

    /** @returns {string} */
    beforeMoneyStatus() {
      return applicationMoneyStatusMap[this.contextItem?.money_status];
    },
    /** @returns {string} */
    beforeTransportStatus() {
      return applicationTransportStatusMap[this.contextItem?.transport_status];
    },
    /** @returns {string} */
    beforeReceiptStatus() {
      return applicationReceiptStatusMap[this.contextItem?.receipt_status];
    },
    /** @returns {string} */
    afterMoneyStatusRaw() {
      const found = applicationMoneyStatusOrder.findIndex(
        (value) => value === this.contextItem.money_status,
      );
      if (found > 0 && found < applicationMoneyStatusOrder.length - 1) {
        return applicationMoneyStatusOrder[found + 1];
      }
      return null;
    },

    /** @returns {string} */
    afterMoneyStatus() {
      const raw = this.afterMoneyStatusRaw;
      if (raw) {
        return applicationMoneyStatusMap[raw];
      }
      return null;
    },

    /** @returns {string} */
    afterTransportStatusRaw() {
      const found = applicationTransportStatusOrder.findIndex(
        (value) => value === this.contextItem.transport_status,
      );
      if (found > 0 && found < applicationTransportStatusOrder.length - 1) {
        return applicationTransportStatusOrder[found + 1];
      }
      return null;
    },

    /** @returns {string} */
    afterTransportStatus() {
      const raw = this.afterTransportStatusRaw;
      if (raw) {
        return applicationTransportStatusMap[raw];
      }
      return null;
    },

    /** @returns {string} */
    afterReceiptStatusRaw() {
      const found = applicationReceiptStatusOrder.findIndex(
        (value) => value === this.contextItem.receipt_status,
      );
      if (found > 0 && found < applicationReceiptStatusOrder.length - 1) {
        return applicationReceiptStatusOrder[found + 1];
      }
      return null;
    },

    /** @returns {string} */
    afterReceiptStatus() {
      const raw = this.afterReceiptStatusRaw;
      if (raw) {
        return applicationReceiptStatusMap[raw];
      }
      return null;
    },
    /** @returns {boolean} */
    hasNextMoneyStatus() {
      if (typeof this.afterMoneyStatus === 'string') {
        return true;
      }
      return false;
    },
    /** @returns {boolean} */
    hasNextTransportStatus() {
      if (typeof this.afterTransportStatus === 'string') {
        return true;
      }
      return false;
    },
    /** @returns {boolean} */
    hasNextReceiptStatus() {
      if (typeof this.afterReceiptStatus === 'string') {
        return true;
      }
      return false;
    },
    /** @returns {boolean} */
    hasChecked() {
      return this.tableItems.some((item) => item.checked === true);
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
            id host festival c_date m_date film_title charge start_date
            end_date session_count format applicant_name applicant_phone
            applicant_email destination transport_company transport_number
            transport_status doc_status money_status receipt_status
            business_license_filename business_license_url deposit_date receipt_date
            receipt_email receipt_etc_req reqdoc_token reqdoc_expire_date
            search etc_req memo memo_unremarked meta
          }
        }`,
      );
      // item 복사 및 날짜 보정
      const tableItems = result.list.map((item) => ({
        ...item,
        ...getSeoulDates(item, [
          'end_date',
          'start_date',
          'reqdoc_expire_date',
          'c_date',
          'm_date',
          'deposit_date',
          'receipt_date',
        ]),
        _showDetails: false,
        checked: false,
      }));
      this.total = result.total;
      this.tableItems = tableItems;
      this.loading = false;
      this.allCheckIndeterminate = false;
      this.allChecked = false;
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
    async addApplicationClicked() {
      this.addApplicationLoading = true;
      const createApplicationReq = makeSimpleMutation('createApplication');
      const today = new Date();
      await createApplicationReq(
        {
          input: {
            host: '신규 등록됨',
            start_date: new Date(
              today.getFullYear(),
              today.getMonth() + 10,
              today.getDate(),
            ),
          },
        },
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
      this.excelLoading = true;
      const response = await axios.get('/graphql/get-excel', {
        withCredentials: true,
        responseType: 'blob',
        params: {
          type: 'application',
          date_lte: this.filter.endDate
            ? this.filter.endDate.toISOString()
            : null,
          date_gte: this.filter.startDate
            ? this.filter.startDate.toISOString()
            : null,
          transport_status: this.filter.transportStatus.join(','),
          doc_status: this.filter.docStatus.join(','),
          money_status: this.filter.moneyStatus.join(','),
          receipt_status: this.filter.receiptStatus.join(','),
          search: this.filter.search,
        },
      });
      fileDownload(
        response.data,
        `cinesopa_applications_${moment().format('yyyy-MM-DD')}.xlsx`,
      );
      this.excelLoading = false;
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
      this.tableItems.forEach((item) => {
        item.checked = value;
      });
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

    async rowClicked(item) {
      const sd = item._showDetails;
      // 현재 클릭한 것이 이미 열려있다면 닫기.
      if (sd) {
        item._showDetails = false;
      }
      // 현재 클릭한 것만 detail 열고 나머지 다 닫기.
      else {
        this.tableItems.forEach((tableItem) => {
          tableItem._showDetails = false;
        });
        item._showDetails = true;
      }

      // editing 에 복사하기
      this.editing = { ...item };

      // editingBusinessLicense 초기화하기
      if (item.business_license_filename) {
        const fileReceived = await fileReq(
          { filename: item.business_license_filename },
          '{fileurl label filename mimetype alt origin}',
        );
        this.editingBusinessLicense = fileReceived;
      } else {
        this.editingBusinessLicense = {};
      }

      // changed 초기화
      this.changed = new Set();
    },
    rowContextMenu(item, index, event) {
      event.preventDefault();
      this.contextItem = { ...item };
      this.currentContextItemIndex = index;
      this.$cm.show('application-context', event);
    },
    async downloadEstimate(id, host) {
      const res = await axios.get(`/graphql/pdf/estimate/${id}`, {
        responseType: 'blob',
      });
      fileDownload(
        res.data,
        `견적서_${host}_${moment().format('yyyy-MM-DD')}.pdf`,
      );
    },
    async downloadEstimateClicked(row) {
      this.downloadingEstimate = true;
      await this.downloadEstimate(row.item.id, row.item.host);
      this.downloadingEstimate = false;
    },
    async contextEstimateDownloadClicked() {
      await this.downloadEstimate(this.contextItem.id, this.contextItem.host);
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
    // async reqDocLinkSendClicked(row) {
    //   // todo
    // },
    // async reqDocLinkSampleClicked(row) {
    //   // todo
    // },
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

    async editingBusinessLicenseChanged(fileObject) {
      console.log('# Application.vue editingBusinessLicenseChanged');
      console.log(fileObject);
      this.editing.business_license_filename = fileObject.filename;
      this.editing.business_license_url = fileObject.fileurl;
      this.changed.add('business_license_filename');
      this.changed.add('business_license_url');
    },
    async copyTaxReqLink(token) {
      copy(`https://sopaseom.com/request-tax-info-gate?token=${token}`);
      this.pushMessage({
        type: 'success',
        id: 'copyTaxReqLinkSuccess',
        msg: '링크가 성공적으로 복사되었습니다.',
      });
    },
    async taxReqLinkCopyClicked() {
      await this.copyTaxReqLink(this.editing.reqdoc_token);
    },
    async contextCopyTaxLinkClicked() {
      await this.copyTaxReqLink(this.contextItem.reqdoc_token);
    },
    async taxReqLinkRemoveClicked() {
      const res = await removeTaxReqLinkReq(
        { id: this.editing.id },
        '{success code}',
      );
      if (res.success) {
        this.pushMessage({
          type: 'success',
          id: 'removeTaxReqLinkSuccess',
          msg: '링크가 성공적으로 삭제되었습니다.',
        });
        this.editing.reqdoc_token = null;
      } else {
        this.pushMessage({
          type: 'danger',
          id: 'removeTaxReqLinkFailed',
          msg: '링크 삭제가 실패하였습니다.',
        });
      }
    },
    async contextEditClicked() {
      this.$cm.hide('application-context');
      this.rowClicked(this.tableItems[this.currentContextItemIndex]);
      this.currentContextItemIndex = null;
    },
    async nextMoneyStatusClicked() {
      const res = await updateApplicationReq(
        {
          id: this.contextItem.id,
          input: {
            money_status: this.afterMoneyStatusRaw,
          },
        },
        '{success code}',
      );
      if (res.success) {
        this.pushMessage({
          type: 'success',
          id: 'nextMoneyStatusSuccess',
          msg: '성공적으로 적용되었습니다.',
        });
        this.fetchData();
      } else {
        this.pushMessage({
          type: 'danger',
          id: 'nextMoneyStatusFailed',
          msg: '업데이트 도중 오류가 발생했습니다.',
        });
      }
    },
    async nextTransportStatusClicked() {
      const res = await updateApplicationReq(
        {
          id: this.contextItem.id,
          input: {
            transport_status: this.afterTransportStatusRaw,
          },
        },
        '{success code}',
      );
      if (res.success) {
        this.pushMessage({
          type: 'success',
          id: 'nextTransportStatusSuccess',
          msg: '성공적으로 적용되었습니다.',
        });
        this.fetchData();
      } else {
        this.pushMessage({
          type: 'danger',
          id: 'nextTransportStatusFailed',
          msg: '업데이트 도중 오류가 발생했습니다.',
        });
      }
    },
    async nextReceiptStatusClicked() {
      const res = await updateApplicationReq(
        {
          id: this.contextItem.id,
          input: {
            receipt_status: this.afterReceiptStatusRaw,
          },
        },
        '{success code}',
      );
      if (res.success) {
        this.pushMessage({
          type: 'success',
          id: 'nextReceiptStatusSuccess',
          msg: '성공적으로 적용되었습니다.',
        });
        this.fetchData();
      } else {
        this.pushMessage({
          type: 'danger',
          id: 'nextReceiptStatusFailed',
          msg: '업데이트 도중 오류가 발생했습니다.',
        });
      }
    },
    async contextDownloadLicenseClicked() {
      const filename = this.contextItem.business_license_filename;
      const { origin } = await fileReq({ filename }, '{origin}');
      const url = downloadLink(filename);
      // console.log(url);
      const res = await axios.get(url, {
        responseType: 'blob',
      });
      fileDownload(res.data, origin);
    },
    async contextCreateTaxLinkClicked() {
      const res = await updateNewTaxReqLinkReq(
        { id: this.contextItem.id },
        `{
        success code token expire_date
        }`,
      );
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
      await this.fetchData();
      this.pushMessage({
        type: 'success',
        id: 'UpdateNewTaxReqLinkSuccess',
        msg: '성공적으로 요청 링크를 생성했습니다.',
      });
      this.copyTaxReqLink(res.token);
    },
    async copyReceipt(item) {
      const lines = [];
      lines.push(`상영료(부가세포함): ${item.charge} 원`);
      lines.push(`공급가액: ${item.charge - Math.round(item.charge / 11)} 원`);
      lines.push(`세액: ${Math.round(item.charge / 11)} 원`);
      lines.push(`이메일: ${item.receipt_email}`);
      lines.push(`작성일자: ${moment(item.receipt_date).format('yyyy-MM-DD')}`);
      copy(lines.join('\n'));
      this.pushMessage({
        type: 'success',
        id: 'copyReceiptSuccess',
        msg: '세금계산서 발행 정보을 성공적으로 복사했습니다.',
      });
    },
    async editingReceiptCopyClicked(row) {
      this.copyReceipt(row.item);
    },
    async contextReceiptCopyClicked() {
      this.copyReceipt(this.contextItem);
      // this.copyTaxReqLink(this.contextItem.reqdoc_token);
    },
    async removeApplications(ids) {
      let successCount = 0;
      let failCount = 0;
      const proms = ids.map((id) =>
        (async () => {
          const res = await removeApplicationReq({ id }, '{success, code}');
          console.log(`# Application.vue ${id} remove res`);
          console.log(res);
          if (res.success) {
            successCount += 1;
          } else {
            failCount += 1;
          }
        })(),
      );
      await Promise.allSettled(proms);
      if (successCount > 0 && failCount === 0) {
        this.pushMessage({
          type: 'success',
          id: 'removeApplicationSuccess',
          msg: `${successCount} 건의 상영 신청을 성공적으로 삭제했습니다.`,
        });
      } else {
        this.pushMessage({
          type: 'danger',
          id: 'removeApplicationFailed',
          msg: `${successCount} 건 삭제 성공, ${failCount} 건 삭제 실패하였습니다.`,
        });
      }
      await this.fetchData();
    },
    async removeCheckedClicked() {
      this.loading = true;
      const ids = this.tableItems
        .filter((item) => item.checked === true)
        .map((item) => item.id);
      this.removeApplications(ids);
      this.loading = false;
    },
    async contextRemoveClicked() {
      this.loading = true;
      const ids = [this.contextItem.id];
      await this.removeApplications(ids);
      this.loading = false;
    },
    async pageChanged() {
      await this.fetchData();
    },
  },
  name: 'Application',
};
</script>

<style lang="scss" scoped>
.application {
  width: 1040px;
}
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
