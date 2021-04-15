<template>
  <div>
    <h2 class="sr-only">상영신청</h2>
    <h3 class="sr-only">안내사항</h3>

    <div class="guide">
      <p class="guide-main">
        여럿이 함께 영화를 보거나 아카이빙을 위한 상영 신청 페이지입니다.<br />
      </p>
      <p class="guide-main-sub">
        본 신청서를 작성하시면 <span class="colored-strong">3일 이내</span>에
        메일 또는 전화로 연락을 드리오니,<br />잠시만 기다려주세요 :)
      </p>
      <hr />
      <h4>상영 절차</h4>
      <ol>
        <li>상영 신청서를 작성해주세요.</li>
        <li>담당자가 신청서를 확인하여 상영 확정 메일을 드립니다.</li>
        <li>상영본 외장하드를 수령합니다.</li>
        <li>상영 후, 상영본을 반환합니다.</li>
        <li>상영료를 정산합니다.</li>
      </ol>
      <h4>상영료 안내</h4>
      <b-table
        class="guide-showing-fee"
        :items="showingFeeItems"
        :fields="showingFeeFields"
      >
        <template #table-caption> 장단편 및 관객수에 따른 상영료 </template>
      </b-table>

      <h4>유의사항</h4>
      <ul>
        <li>본 상영료는 vat를 포함한 금액입니다.</li>
        <li>
          상영본 발송에 필요한 모든 비용은 씨네소파가 부담하며, 상영 후
          반납시에는 신청자가 부담합니다.
        </li>
        <li>
          <p>감독님 섭외 부분은 신청인께서 직접하셔야 합니다.</p>
          <p class="small">
            씨네소파는 신청인과 감독의 상호 연락처 전달 업무만 담당합니다.
          </p>
        </li>
        <!-- <li>
          씨네소파는 예비사회적기업으로서 독립영화 저변 확대를 위해 노력하고 있습니다.<br />이에,
          상영료를 좌석 수가 아닌 관객 수를 기준으로 책정하고 있습니다. 그에 따른 차액만큼<br />
          사회서비스제공확인서(양식제공)를 요청드릴 수 있으니 참고 부탁드립니다.
        </li> -->
      </ul>
    </div>
    <h3 class="sr-only">신청서 작성</h3>
    <validation-observer
      ref="observer"
      slim
      v-slot="{ /* handleSubmit, */ validate /* errors */ }"
    >
      <b-form class="community-form" @submit.stop.prevent="submit(validate())">
        <h4>행사 정보</h4>
        <b-form-group
          class="community-form-group"
          label="주최기관 / 단체 이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="compnay-name"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.companyName"
            id="compnay-name"
            type="text"
            :required="required"
            title="주최기관 / 단체 이름"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="행사 이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="festival-name"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.festivalName"
            id="festival-name"
            type="text"
            :required="required"
            title="행사 이름"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="상영 시작일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="playdate-start"
        >
          <b-form-datepicker-korean
            class="underlined-box"
            v-model="form.playdateStart"
            :required="required"
            id="playdate-start"
            title="상영 시작일"
          >
          </b-form-datepicker-korean>
        </b-form-group>
        <!-- 날짜 validation -->
        <validation-provider>
          <b-form-group
            class="community-form-group"
            label="상영 종료일"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="playdate-end"
          >
            <b-form-datepicker-korean
              class="underlined-box"
              v-model="form.playdateEnd"
              :required="required"
              id="playdate-end"
              title="상영 종료일"
            >
            </b-form-datepicker-korean>
          </b-form-group>
        </validation-provider>
        <b-form-group
          class="community-form-group"
          label="상영 회차"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="playtimes"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.playtimes"
            id="playtimes"
            type="number"
            :required="required"
            number
            title="상영 회차"
          ></b-form-input>
          <template #description>영화 상영 횟수를 적어주세요.</template>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="상영 장소"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="playplace"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.playplace"
            id="playplace"
            type="text"
            placeholder="예) 소파극장 (부산시 해운대구)"
            :required="required"
            title="상영 장소. 예시) 소파극장 (부산시 해운대구)"
          ></b-form-input>
        </b-form-group>

        <h4>신청인 정보</h4>

        <b-form-group
          class="community-form-group"
          label="이름"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="username"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.username"
            id="username"
            type="text"
            :required="required"
            title="이름"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="전화번호"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="userphone"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.userphone"
            id="userphone"
            type="text"
            placeholder="예) 01012345678"
            :required="required"
            title="전화번호. 예) 01012345678"
          ></b-form-input>
          <template #description
            >반드시 연락 가능한 연락처를 적어주세요.
          </template>
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="이메일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="useremail"
        >
          <b-form-input
            class="underlined-box"
            v-model="form.useremail"
            id="useremail"
            type="email"
            :required="required"
            title="이메일"
          ></b-form-input>
          <template #description>
            반드시 수신 가능한 이메일을 적어주세요.
          </template>
        </b-form-group>

        <h4>상영본 정보</h4>
        <!-- b-form-group started -->
        <b-form-group
          class="community-form-group"
          label="신청 영화"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="select-film-button"
        >
          <!-- <b-form-input
            class="underlined-box"
            v-model="form.filmname"
            id="filmname"
            ref="filmname"
            type="text"
            placeholder=""
            :required="required"
          ></b-form-input> -->
          <ul class="film-list">
            <li
              v-for="(film, filmIndex) in form.films"
              :key="filmIndex"
              ref="filmlist"
              :id="`film-list-item-${filmIndex}`"
              tabindex="-1"
            >
              <div class="film-header">
                <h3 class="film-title">{{ film.title }}</h3>
                <!-- :aria-labelledby="`remove-film-${filmIndex}`" -->
                <b-button
                  class="close-button"
                  @click="removeFilm(filmIndex)"
                  :title="`${film.title} 삭제`"
                  :aria-label="`${film.title} 삭제`"
                >
                  <span class="sr-only">{{ film.title }} 삭제</span>
                  &times;</b-button
                >
                <!-- <p :id="`remove-film-${filmIndex}`" class="sr-only">
                  {{ film.title }} 삭제
                </p> -->
              </div>
              <!-- <div class="meta">
                {{ film.meta.join(' | ') }}
              </div> -->
              <!-- <h4>상영 포맷</h4> -->
              <div class="format">
                <!-- @change="formatSelected" -->
                <b-form-group
                  class="community-form-group"
                  label="상영 포맷"
                  label-size="md"
                  :label-for="`format-${filmIndex}`"
                >
                  <!-- description="일반 MOV만 이메일 발송이 가능합니다." -->
                  <!-- DCP / MOV(100GB) / MOV 혹은 MP4 (10~30GB) -->
                  <b-form-radio-group
                    class="radio-group"
                    :id="`format-${filmIndex}`"
                    v-model="film.format"
                    stacked
                  >
                    <b-form-radio value="DCP"
                      >DCP <small>(별도 영사기 필요)</small></b-form-radio
                    >
                    <b-form-radio value="MOV_100GB"
                      >MOV <small>(100GB)</small></b-form-radio
                    >
                    <b-form-radio value="MOV_or_MP4_10-30GB"
                      >MOV 혹은 MP4 <small>(10~30GB)</small></b-form-radio
                    >
                    <!-- <b-form-radio value="MOV3"
                      >일반 MOV
                      <small>(2~3GB, 유튜브 1080p 화질)</small></b-form-radio
                    > -->
                  </b-form-radio-group>
                </b-form-group>
              </div>
              <!-- <h4>자막</h4> -->
              <div
                class="subtitle"
                v-if="
                  film.available_subtitles &&
                  film.available_subtitles.length > 0
                "
              >
                <b-form-group
                  class="community-form-group"
                  label="자막"
                  label-size="md"
                  :label-for="`subtitle-${filmIndex}`"
                >
                  <b-form-checkbox-group
                    :id="`subtitle-${filmIndex}`"
                    v-model="film.selected_subtitles"
                    stacked
                  >
                    <b-form-checkbox
                      v-for="(
                        subtitle, subtitleIndex
                      ) in film.available_subtitles"
                      :key="subtitleIndex"
                      :value="subtitle"
                      >{{ subtitle }}</b-form-checkbox
                    >
                  </b-form-checkbox-group>
                </b-form-group>
              </div>
              <!-- <div class="test">
                {{ film }}
              </div> -->
            </li>
          </ul>
          <template #description>
            영화 추가 후 상영 포맷 및 자막을 설정합니다.
          </template>
          <b-button
            size="sm"
            id="select-film-button"
            @click="$bvModal.show('film-select-modal')"
            title="영화 추가"
          >
            영화 추가
          </b-button>
          <b-modal
            size="xl"
            id="film-select-modal"
            title="영화 선택"
            hide-footer
            :return-focus="filmSelectFocus"
            @shown="getFocusCloseButton('film-select-modal')"
          >
            <template #modal-header-close>
              <span class="close-figure" aria-hidden="true">&times;</span>
              <span class="sr-only"> 닫기 </span>
            </template>
            <film-selector
              class="noto-sans"
              @film-selected="filmSelected"
              modal-id="film-select-modal"
            ></film-selector>
          </b-modal>
        </b-form-group>
        <!-- b-form-group started -->
        <!-- <b-form-group
          class="community-form-group"
          label="상영 포맷"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="format"
        >
          
        </b-form-group> -->
        <h4>비용 및 배송 관련 정보</h4>
        <b-form-group
          class="community-form-group"
          label="상영본 수령 방법"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="how-to-receive"
        >
          <!-- description="일반 MOV만 이메일 발송이 가능합니다." -->
          <b-form-radio-group
            class="radio-group"
            id="how-to-receive"
            :required="required"
            @change="changedHowToReceive"
            v-model="form.howToReceive"
          >
            <b-form-radio value="택배">택배로 수령</b-form-radio>
            <!-- :disabled="disabledReceiveByEmail" -->
            <b-form-radio value="온라인">온라인 수령</b-form-radio>
            <b-form-radio value="직접">직접 수령</b-form-radio>
          </b-form-radio-group>
        </b-form-group>

        <b-form-group
          class="community-form-group"
          label="방문 예정일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="visit-date"
          v-if="form.howToReceive === '직접'"
        >
          <b-form-datepicker-korean
            class="underlined-box"
            v-model="form.visitDate"
            :required="required"
            id="visit-date"
            :date-disabled-fn="receiveDateDisabled"
            title="방문 예정일"
          >
          </b-form-datepicker-korean>
        </b-form-group>
        <template v-else-if="form.howToReceive === '택배'">
          <b-form-group
            class="community-form-group"
            label="상영본 받을 주소"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="address"
          >
            <!-- :disabled="receivedByEmail" -->
            <b-button
              id="address"
              variant="outline-dark"
              @click="openMap"
              aria-describedby="다음 주소창이 새 창으로 열립니다."
              title="주소 검색"
              >주소 검색</b-button
            >
            <p v-if="addressNew !== ''" class="address-new">{{ addressNew }}</p>
            <p v-if="addressOld !== ''" class="address-old">{{ addressOld }}</p>
            <!-- <b-form-text
            >하나의 영화만 기재해주세요. 여러 영화를 상영하신다면, 각각 신청서를 작성해주시기
            바랍니다.</b-form-text
          > -->
          </b-form-group>

          <b-form-group
            class="community-form-group"
            label="상세 주소"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            :label-for="!receivedByEmail ? 'addressDetailed' : null"
            :disabled="receivedByEmail"
          >
            <b-form-input
              class="underlined-box"
              v-model="form.addressDetailed"
              id="addressDetailed"
              type="text"
              :required="required"
              title="상세 주소"
            ></b-form-input>
            <!-- <b-form-text
            >하나의 영화만 기재해주세요. 여러 영화를 상영하신다면, 각각 신청서를 작성해주시기
            바랍니다.</b-form-text
          > -->
          </b-form-group>
        </template>

        <b-form-group
          class="community-form-group"
          label="상영본 받을 날짜"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="receive-date"
          v-if="form.howToReceive !== '직접'"
        >
          <b-form-datepicker-korean
            class="underlined-box"
            v-model="form.receiveDate"
            id="receive-date"
            :required="required"
            title="상영본 받을 날짜"
          >
            <!-- <template #button-content :style="{ width: `300px` }"> -->
            <!-- <div class="w-100 h-100 d-flex align-items-center justify-content-center"> -->
            <!-- <font-awesome-icon :icon="['fas', 'calendar']"></font-awesome-icon> -->
            <!-- </div> -->
            <!-- </template> -->
          </b-form-datepicker-korean>
        </b-form-group>
        <!-- <hr /> -->
        <!-- <b-form-group
          class="community-form-group"
          label="영화 구분"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="film-type"
          description="영화 길이가 60분 이상이면 장편, 60분 미만이면 단편입니다."
        >
          <b-form-radio-group
            class="radio-group"
            :required="required"
            id="film-type"
            v-model="form.filmType"
          >
            <b-form-radio value="long">장편</b-form-radio>
            <b-form-radio value="short">단편</b-form-radio>
          </b-form-radio-group>
        </b-form-group> -->
        <b-form-group
          class="community-form-group"
          label="예상 관객수"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="expected-population"
        >
          <b-form-select
            class="rounded-box w-50"
            v-model="form.expectedPopulation"
            id="expected-population"
            :required="required"
          >
            <template v-slot:first>
              <option value=""></option>
            </template>

            <option
              v-for="(key, index) in Object.keys(showingFeePopLabels)"
              :value="key"
              :key="index"
            >
              {{ showingFeePopLabels[key] }}
            </option>
          </b-form-select>
        </b-form-group>
        <!-- label="상영료(부가세 포함)" -->
        <b-form-group
          class="community-form-group align-items-center"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="showingFee"
        >
          <!-- description="영화 구분(장편/단편)과 예상 관객수를 설정하면 예상 상영료가 표시됩니다." -->
          <b-form-input
            class="underlined-box"
            v-model="form.selfShowingFee"
            id="showingFee"
            type="text"
            :required="required"
            title="상영료 (부가세 포함)"
          ></b-form-input>
          <template #label>상영료<br />(부가세 포함) </template>
          <!-- <p id="showingFee">
            <var>{{ showingFee }}</var> 원
          </p> -->
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="입금 예정일"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="depositdate"
        >
          <b-form-datepicker-korean
            class="underlined-box"
            v-model="form.depositdate"
            id="depositdate"
            :required="required"
            title="입금 예정일"
          >
          </b-form-datepicker-korean>
        </b-form-group>
        <div class="d-flex align-items-baseline">
          <h4>정산 정보</h4>
          <b-form-checkbox
            class="ml-4"
            id="is-tax-same"
            v-model="form.isTaxSame"
            >주최기관과 같습니다</b-form-checkbox
          >
        </div>
        <!-- <b-form-group
          class="community-form-group align-items-center"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="is-tax-same"
          label="정산 기관"
        >
          <b-form-checkbox id="is-tax-same" v-model="form.isTaxSame"
            >주최기관과 같습니다</b-form-checkbox
          >
        </b-form-group> -->
        <!-- form.isTaxSame 일 때에는 위의 정보를 보여줌 -->
        <template v-if="form.isTaxSame">
          <b-form-group
            class="community-form-group"
            label="기관 이름"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-company"
          >
            <!-- v-model="form.taxCompany" -->
            <b-form-input
              class="underlined-box"
              :value="form.companyName"
              id="tax-company"
              type="text"
              disabled
              title="기관 이름"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            class="community-form-group"
            label="담당자 이름"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-person"
          >
            <template #label> 담당자 이름 </template>
            <!-- v-model="form.taxPerson" -->
            <b-form-input
              class="underlined-box"
              :value="form.username"
              id="tax-person"
              type="text"
              disabled
              title="담당자 이름"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            class="community-form-group"
            label="담당자 연락처"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-phone"
          >
            <!-- v-model="form.taxPhone" -->
            <b-form-input
              class="underlined-box"
              :value="form.userphone"
              id="tax-phone"
              type="text"
              disabled
              title="담당자 연락처"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            class="community-form-group"
            label="비고"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-others"
          >
            <!-- class="underlined-box" -->
            <b-form-textarea
              v-model="form.taxOthers"
              size="sm"
              id="tax-others"
              title="비고"
            >
            </b-form-textarea>
          </b-form-group>
        </template>
        <!-- tax 정보를 직접 써야 할 때 -->
        <template v-else>
          <b-form-group
            class="community-form-group"
            label="기관 이름"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-company"
          >
            <b-form-input
              class="underlined-box"
              v-model="form.taxCompany"
              id="tax-company"
              type="text"
              :required="required"
              title="기관 이름"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            class="community-form-group"
            label="담당자 이름"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-person"
          >
            <template #label> 담당자 이름 </template>
            <b-form-input
              class="underlined-box"
              v-model="form.taxPerson"
              id="tax-person"
              type="text"
              :required="required"
              title="담당자 이름"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            class="community-form-group"
            label="담당자 연락처"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-phone"
          >
            <b-form-input
              class="underlined-box"
              v-model="form.taxPhone"
              id="tax-phone"
              type="text"
              :required="required"
              title="담당자 연락처"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            class="community-form-group"
            label="비고"
            label-cols-sm="3"
            label-align-sm="left"
            label-size="md"
            label-for="tax-others"
          >
            <!-- class="underlined-box" -->
            <b-form-textarea
              v-model="form.taxOthers"
              size="sm"
              id="tax-others"
              title="비고"
            >
            </b-form-textarea>
          </b-form-group>
        </template>
        <hr />
        <b-form-group
          class="community-form-group"
          label="추가 요청할 서류"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="additional-papers"
        >
          <b-form-checkbox-group
            id="additional-papers"
            v-model="form.additionalPapers"
          >
            <b-form-checkbox
              :disabled="form.additionalPapers.includes('현금영수증')"
              :value="'세금계산서'"
              >세금계산서</b-form-checkbox
            >
            <!-- <b-form-checkbox
              :disabled="form.additionalPapers.includes('세금계산서')"
              :value="'현금영수증'"
              >현금영수증</b-form-checkbox
            > -->
            <b-form-checkbox :value="'견적서'">견적서</b-form-checkbox>
          </b-form-checkbox-group>
          <!-- {{ form.additionalPapers }} -->
        </b-form-group>
        <b-form-group
          class="community-form-group"
          label="기타 요청 사항"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="md"
          label-for="others"
          description="추가로 요청하실 사항이나 논의가 필요한 부분이 있다면, 자유롭게 적어주세요!"
        >
          <b-form-textarea
            v-model="form.others"
            size="sm"
            id="others"
            rows="5"
            title="기타 요청 사항"
          ></b-form-textarea>
        </b-form-group>

        <!-- <p>상영료:</p> -->

        <!-- <datalist id="my-list-id">
          <option>Manual Option</option>
          <option v-for="(size, index) in sizes" :key="index">{{ size }}</option>
        </datalist> -->
        <div class="agreement">
          <validation-provider
            :rules="{ shouldCheck: true }"
            :customMessages="{ shouldCheck: '반드시 동의하여야 합니다.' }"
            v-slot="v_context"
          >
            <b-form-group id="check-privacy">
              <div class="check-privacy-wrapper">
                <b-checkbox
                  :state="getValidationState(v_context)"
                  v-model="checkPrivacy"
                  v-bind="v_context.ariaInput"
                  class="check-privacy d-flex align-items-center"
                >
                  <strong>개인정보처리방침에 동의합니다.</strong>
                </b-checkbox>
                <b-link
                  class="privacy-button"
                  size="sm"
                  outlined
                  v-b-modal.modal-privacy
                  variant="outline-dark"
                  >전문 보기</b-link
                >
                <b-modal
                  id="modal-privacy"
                  size="lg"
                  scrollable
                  hide-footer
                  title="개인정보처리방침"
                  @shown="modalPrivacyShown"
                >
                  <template #modal-header-close>
                    <span class="close-figure" aria-hidden="true">&times;</span>
                    <span class="sr-only"> 닫기 </span>
                  </template>
                  <privacy></privacy>
                </b-modal>
              </div>
              <b-form-invalid-feedback
                :state="getValidationState(v_context)"
                id="check-privacy-invalid-feedback"
                >{{ v_context.errors[0] }}</b-form-invalid-feedback
              >
              <span class="invalid-feedback" v-bind="v_context.ariaMsg">{{
                v_context.errors[0]
              }}</span>
              <!-- <span>{{ JSON.stringify(v_context) }}</span> -->
            </b-form-group>
          </validation-provider>

          <validation-provider
            :rules="{ shouldCheck: true }"
            :customMessages="{ shouldCheck: '반드시 준수하여야 합니다.' }"
            v-slot="v_context"
          >
            <b-form-group id="check-copyright">
              <div class="check-copyright-wrapper">
                <b-checkbox
                  :state="getValidationState(v_context)"
                  v-model="checkCopyright"
                  v-bind="v_context.ariaInput"
                  class="check-copyright d-flex align-items-center"
                >
                  <strong>저작물이용동의서를 준수합니다.</strong>
                </b-checkbox>
                <b-link
                  class="privacy-button"
                  size="sm"
                  outlined
                  v-b-modal.modal-copyright
                  variant="outline-dark"
                  >전문 보기</b-link
                >
                <b-modal
                  id="modal-copyright"
                  size="lg"
                  scrollable
                  hide-footer
                  title="저작물이용동의서"
                  @shown="modalCopyrightShown"
                >
                  <!-- :film-name="form.filmname" -->
                  <template #modal-header-close>
                    <span class="close-figure" aria-hidden="true">&times;</span>
                    <span class="sr-only"> 닫기 </span>
                  </template>
                  <copyright-consent
                    :film-list="form.films"
                    :playdate-start="form.playdateStart"
                    :playdate-end="form.playdateEnd"
                    :playplace="form.playplace"
                    :playtimes="form.playtimes"
                    :user-name="form.username"
                  ></copyright-consent>
                </b-modal>
              </div>
              <b-form-invalid-feedback
                :state="getValidationState(v_context)"
                id="check-copyright-invalid-feedback"
                >{{ v_context.errors[0] }}</b-form-invalid-feedback
              >
              <span class="invalid-feedback" v-bind="v_context.ariaMsg">{{
                v_context.errors[0]
              }}</span>
              <!-- <span>{{ JSON.stringify(v_context) }}</span> -->
            </b-form-group>
          </validation-provider>
        </div>
        <loading-button
          class="submit"
          type="submit"
          variant="primary"
          :loading="submitting"
          loading-label="제출 중입니다."
          title="신청서를 제출하겠습니다"
        >
          신청서를 제출하겠습니다
        </loading-button>
        <!-- <b-button class="submit" type="submit" variant="primary"
          ></b-button -->
        <!-- > -->
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
// import
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  // extend,
  // localize,
} from 'vee-validate';
import FilmSelector from '@/components/FilmSelector.vue';
import Privacy from '@/components/Privacy.vue';
import CopyrightConsent from '@/components/CopyrightConsent.vue';
import { makeSimpleMutation } from '@/graphql-client';
import LoadingButton from '@/components/LoadingButton.vue';
import { mapActions } from 'vuex';

extend('shouldCheck', (value) => value === true);

export default {
  title: '상영신청 - 신청하기',
  name: 'Community',
  components: {
    Privacy,
    CopyrightConsent,
    ValidationObserver,
    ValidationProvider,
    LoadingButton,
    BFormDatepickerKorean: () => import('@/components/BFormDatepickerKorean'),
    FilmSelector,
  },
  data() {
    return {
      submitting: false,
      showingFeeMap: {
        0: {
          long: 150000,
          short: 100000,
        },
        1: {
          long: 300000,
          short: 150000,
        },
        2: {
          long: 400000,
          short: 200000,
        },
        3: {
          long: 500000,
          short: 250000,
        },
      },
      showingFeePopLabels: {
        0: '30명 이하',
        1: '31 ~ 60명',
        2: '61 ~ 80명',
        3: '81명 이상',
      },
      showingFeeFields: [
        {
          key: 'popClass',
          label: '구분',
          isRowHeader: true,
        },
        {
          key: 'long',
          label: '장편',
        },
        {
          key: 'short',
          label: '단편',
        },
      ],
      // required: false,
      required: true,
      checkPrivacy: false,
      checkCopyright: false,
      mapLoader: null,
      addressNew: '', // admin 으로 보내는 정보에 포함되어야 함
      addressOld: '', // admin 으로 보내는 정보에 포함되어야 함
      form: {
        companyName: '',
        festivalName: '',
        playdateStart: null,
        playdateEnd: null,
        playtimes: null,
        playplace: null,
        username: null,
        userphone: null,
        useremail: null,
        films: [
          // {
          //   title: '타이틀',
          //   format: '',
          //   meta: ['감독 김한글'],
          //   available_subtitles: ['a', 'b', 'c'],
          //   selected_subtitles: [],
          // },
        ],
        // format: null,
        howToReceive: null,
        visitDate: null,
        receiveDate: null,
        addressDetailed: '',
        // filmType: '',
        expectedPopulation: '',
        selfShowingFee: '',
        depositdate: null,
        isTaxSame: true,
        taxCompany: '',
        taxPerson: '',
        taxPhone: '',
        taxOthers: '',
        additionalPapers: [],
        others: '',
      },
    };
  },

  computed: {
    // disabledReceiveByEmail() {
    //   return this.form.format !== 'MOV3' && this.form.format !== null;
    // },
    receivedByEmail() {
      return this.form.howToReceive === '온라인';
    },

    // showingFee() {
    //   const { expectedPopulation, filmType } = this.form;
    //   if (expectedPopulation === '' || filmType === '') return 0;
    //   let fee = this.showingFeeMap[expectedPopulation][filmType];
    //   fee += fee / 10 + 10000;
    //   return this.numberWithCommas(fee);
    // },

    showingFeeItems() {
      const keys = Object.keys(this.showingFeeMap);
      const items = [];
      keys.forEach((key) => {
        let { long, short } = this.showingFeeMap[key];
        short += short / 10 + 10000;
        long += long / 10 + 10000;
        short = `${this.numberWithCommas(short)}원`;
        long = `${this.numberWithCommas(long)}원`;

        items.push({
          popClass: this.showingFeePopLabels[key],
          long,
          short,
        });
      });
      return items;
    },
    // lastAdded() {
    //   const lis = this.$refs.filmlist;
    //   return lis[lis.length - 1];
    // },
    lastFilmIndex() {
      return this.form.films.length - 1;
    },
    filmSelectFocus() {
      return this.lastFilmIndex === -1
        ? '#select-film-button'
        : `#film-list-item-${this.lastFilmIndex}`;
    },
  },

  mounted() {
    this.$loadScript(
      'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
    )
      .then((/* result */) => {
        // console.log(this);
        // console.dir(result);
        const self = this;
        // eslint-disable-next-line no-undef
        this.mapLoader = new daum.Postcode({
          oncomplete(data) {
            // console.log(this);
            // console.log(data);
            // console.log(self);
            self.addressNew = `${data.roadAddress} (${data.bname})`;
            self.addressOld = data.jibunAddress;
            self.form.addressDetailed = data.buildingName;
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
          },
        });
      })
      .catch((err) => {
        // console.log(this);
        console.error(err);
      });
    const { name } = this.$route.query;
    if (name) {
      // todo 주소로 영화 이름이 들어왔을 때 처리해야 함.
      this.form.filmname = name;
      // this.$refs.filmname.focus();
    }
  },

  methods: {
    async submit(isValidPromise) {
      // console.log('# Community submit');
      // console.log(isValidPromise);
      this.submitting = true;
      try {
        const isValid = await isValidPromise;
        if (isValid) {
          const requestShowing = makeSimpleMutation('requestShowing');
          const result = await requestShowing(
            {
              input: {
                ...this.form,
                films: this.form.films.map((film) => ({
                  id: film.id,
                  title: film.title,
                  format: film.format,
                  selected_subtitles: film.selected_subtitles,
                  meta: film.meta,
                })),
                addressNew: this.addressNew,
                addressOld: this.addressOld,
              },
            },
            '{success code recipient}',
          );
          if (result.success) {
            this.$router.push({ name: 'SuccessRequest' });
          } else {
            alert(
              '신청서 제출 중 오류가 발생했습니다. 관리자에게 문의해주세요.',
            );
            // this.pushMessage({
            //   type: 'danger',
            //   id: 'communityFailed',
            //   msg: '신청서 제출 중 오류가 발생했습니다. 관리자에게 문의해주세요.',
            // });
          }
          // console.log('# Community submit result');
          // console.log(result);
          // todo 메일을 실제로 보내기 전까지 로딩 기간을 뭔가 로딩 바가 도는 등의 애니메이션 등장이 필요함.
        } else {
          // todo 만약 유효하지 않을 때만 따로 처리할 피룡가 있슴.
        }
      } catch (error) {
        console.error(error);
      }
      this.submitting = false;
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    openMap() {
      this.mapLoader.open();
    },

    formatSelected(value) {
      if (value !== 'MOV3') {
        this.form.howToReceive = '택배';
      }
    },
    changedHowToReceive() {
      this.addressNew = '';
      this.addressOld = '';
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    filmSelected(item) {
      this.$bvModal.hide('film-select-modal');
      // console.log('# Community filmSelected');
      // console.log(item);
      this.form.films.push({
        ...item,
        format: '',
        // meta: '감독 김한글',
        selected_subtitles: [],
      });

      // this.$nextTick(() => {
      //   const i = this.form.films.length - 1;
      //   // console.log(this.$refs.filmlist[i]);
      //   this.$refs.filmlist[i].focus();
      // });
      // console.log(this.$refs);
    },
    removeFilm(index) {
      this.form.films.splice(index, 1);
      this.$nextTick(() => {
        // console.log('# community removeFilm nextick to set Focus');
        // console.log(this.filmSelectFocus);

        // #이 포함되어 있으므로 첫번째 글자를 없앰.
        document.getElementById(this.filmSelectFocus.slice(1)).focus();
      });
    },
    receiveDateDisabled(ymd, date) {
      const weekday = date.getDay();
      return weekday === 0 || weekday === 5 || weekday === 6;
    },
    modalPrivacyShown() {
      this.getFocusCloseButton('modal-privacy');
    },
    modalCopyrightShown() {
      this.getFocusCloseButton('modal-copyright');
    },
    getFocusCloseButton(modalId) {
      this.$nextTick(() => {
        const buttonElement = document
          .getElementById(modalId)
          .getElementsByClassName('close')[0];

        buttonElement.focus();
        buttonElement.setAttribute('title', '닫기');
      });
    },
  },
};
</script>

<!---------------------------------------------------------------->
<!-----------------------    SCOPED SCSS    ---------------------->
<!---------------------------------------------------------------->

<style lang="scss" scoped>
.guide {
  padding: 50px 0;

  max-width: 700px;
  & h4 {
    margin-top: 40px;
    font-size: 20px;
    font-weight: bold;
  }
  & li {
    font-size: 16px;
    margin-bottom: 5px;
    & p {
      margin-bottom: 0;
    }
  }

  & hr {
    margin-bottom: 60px;
  }
}

.community-form hr {
  margin: 40px 0;
}

.guide-main {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.7px;
  max-width: 660px;
  margin-bottom: 0;
}

.guide-main-sub {
  font-size: 19px;
  font-weight: 600;
}

.guide-showing-fee {
  text-align: center;
  margin-top: 20px;
}
.community-form h4 {
  margin-top: 70px;
  font-size: 30px;
  font-weight: bold;
  color: #009eda;
}

.community-form-group {
  max-width: 600px;
  margin: 20px 0;
}

.address-new {
  margin: 10px 0 0;
  font-weight: 500;
}
.address-old {
  font-size: 80%;
  color: #767676;
  margin: 0;
}

.agreement {
  margin-top: 50px;
  margin-bottom: 20px;
  .invalid-feedback {
    margin-bottom: 10px;
  }
}

.check-privacy-wrapper,
.check-copyright-wrapper {
  display: flex;
  align-items: center;
}
#check-privacy,
#check-copyright {
  margin-bottom: 5px;
}

.mobile .check-privacy-wrapper,
.mobile .check-copyright-wrapper {
  margin: 0 -15px;
}

.privacy-button {
  margin-left: 10px;
  font-size: 14px;
  text-decoration: underline;
  transition: 1s;
  &:hover {
    color: #009eda;
    transition: none;
  }
}

.colored-strong {
  color: #009eda;
  font-weight: 700;
}

// #showingFee {
//   margin-top: 6px;
//   font-size: 18px;
//   margin-bottom: 0;
//   & var {
//     font-family: var(--font-family-monospace);
//   }
// }

.submit {
  font-size: 18.7px;
  font-weight: bold;
  padding: 10px 20px;
}

.film-list {
  padding: 0;
  list-style: none;
}

.film-list li {
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
  }
  h4 {
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
  }

  .meta {
    font-size: 13px;
    color: #666;
  }
}

// .mobile .film-list li {
//   padding: 20px 0;
// }

.film-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .close-button {
    flex: 0;
    background-color: #fff;
    border: 0;
    color: #2b3e4a;
  }
}
</style>

<!---------------------------------------------------------------->
<!-----------------------    NORMAL SCSS    ---------------------->
<!---------------------------------------------------------------->

<style lang="scss">
.community-form-group {
  & > label {
    font-weight: 500;
  }
}

.community-form {
  & .custom-control-input.is-valid ~ .custom-control-label,
  & .was-validated .custom-control-input:valid ~ .custom-control-label {
    color: #2b3e4a;
  }
  // & .custom-control-input:checked ~ .custom-control-label::before {
  //   background-color: #009eda;
  //   border-color: #009eda;
  // }
}

.community-form .radio-group,
#additional-papers {
  margin-top: 8px;
}

.mobile .community-form .radio-group {
  margin-top: 0px;
}

.guide-showing-fee tbody tr:last-child {
  border-bottom: 1px solid #dee2e6;
}
</style>
