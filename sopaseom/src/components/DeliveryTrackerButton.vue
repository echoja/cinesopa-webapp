<template>
  <span class="delivery-tracker-button-wrapper">
    <b-button :size="size" class="delivery-tracker-button" @click="$bvModal.show(modalId)">{{
      buttonText
    }}</b-button>
    <b-modal
      size="xl"
      :id="modalId"
      @show="showModal"
      ok-only
      ok-title="확인"
      title="배송조회"
    >
      <div class="loading" v-if="dataLoading">
        <small-spinner></small-spinner>로딩중입니다.
      </div>
      <div class="error" v-else-if="err">
        {{ errMsg }}
      </div>
      <div class="wrapper" v-else>
        <b-table-simple class="summary">
          <b-tr>
            <b-td> <b>송장번호</b> </b-td>
            <b-td>
              {{ transportNumber }}
            </b-td>
          </b-tr>
          <b-tr>
            <b-td> <b>보내는 사람</b> </b-td>
            <b-td>
              {{ fromName }}
            </b-td>
          </b-tr>
          <b-tr>
            <b-td> <b>보낸 시간</b> </b-td>
            <b-td>
              {{ fromTime }}
            </b-td>
          </b-tr>
          <b-tr>
            <b-td> <b>받는 사람</b> </b-td>
            <b-td>
              {{ toName }}
            </b-td>
          </b-tr>
          <b-tr>
            <b-td> <b>받은 시간</b> </b-td>
            <b-td>
              {{ toTime }}
            </b-td>
          </b-tr>
        </b-table-simple>
        <b-table-lite :fields="fields" :items="data.progresses">
          <template #cell(time)="{ item }">
            {{ formatTime(item.time) }}
          </template>
          <template #cell(status)="{ item }">
            {{ item.status ? item.status.text : '' }}
          </template>
          <template #cell(location)="{ item }">
            {{ item.location ? item.location.name : '' }}
          </template>
        </b-table-lite>
        <!-- <pre> test
        {{ data }}
      </pre> -->
      </div>
    </b-modal>
  </span>
</template>

<script>
import {
  BButton,
  BModal,
  BTableLite,
  BTableSimple,
  BTd,
  BTr,
} from 'bootstrap-vue';
import axios from 'axios';
import moment from 'moment';

let uuid = 0;
export default {
  components: {
    BModal,
    BButton,
    BTableLite,
    BTableSimple,
    BTd,
    BTr,
    SmallSpinner: () => import('@/components/SmallSpinner'),
  },
  props: {
    buttonText: {
      type: String,
      default: '배송조회',
    },
    carrierId: {
      type: String,
      default: 'kr.epost',
    },
    transportNumber: {
      type: [String, Number],
      required: true,
    },
    size: {
      type: String,
      default: 'sm',
    },
  },

  data() {
    return {
      id: 0,
      dataLoading: false,
      data: {},
      fields: [
        {
          key: 'time',
          label: '시간',
        },
        {
          key: 'status',
          label: '상태',
        },
        {
          key: 'location',
          label: '위치',
        },
        {
          key: 'description',
          label: '상세 설명',
        },
      ],
      err: false,
      errMsg: '',
    };
  },
  computed: {
    modalId() {
      return `delivery-tracker-modal-${this.id}`;
    },
    fromName() {
      return this.data?.from?.name;
    },
    fromTime() {
      return this.formatTime(this.data?.from?.time);
    },
    toName() {
      return this.data?.to?.name;
    },
    toTime() {
      return this.formatTime(this.data?.to?.time);
    },
  },
  created() {
    this.id = uuid;
    uuid += 1;
  },
  methods: {
    showModal() {
      this.fetchData();
    },
    formatTime(date) {
      return moment(date).format('YYYY년 MM월 DD일 HH:mm:ss');
    },
    async fetchData() {
      this.dataLoading = true;
      const reqUrl = `https://apis.tracker.delivery/carriers/${this.carrierId}/tracks/${this.transportNumber}`;
      try {
        const { data } = await axios.get(reqUrl);
        console.log('# DeliveryTrackerButton fetchData data');
        console.log(data);
        this.err = false;
        this.errMsg = '';
        this.data = data;
      } catch (e) {
        console.error('# DeliveryTrackerButton fetchData failed');
        console.dir(e);
        this.err = true;
        this.errMsg = e.response.data.message;
        this.data = {};
      }
      this.dataLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  width: auto;
}
</style>
