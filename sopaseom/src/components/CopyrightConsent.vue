<template>
  <div :style="style">
    <h2>저작물이용동의서</h2>

    <h3>1. 목적</h3>
    <p>
      본 동의서는 <strong>"영화배급협동조합 씨네소파(이하 공급자)"</strong>이
      저작권을 보유한 영화 <strong>"{{ filmName }}(이하 상영본)"</strong
      ><!--&lt;그럼에도 불구하고&gt;-->에 대하여
      <strong>"신청인 {{ userName }}(이하 수요자)"</strong>가 그 사용 허락을
      얻어 영화 상영에 이용하고 이와 관련한 권리의무 사항에 대한 동의를 확인하는
      것을 목적으로 합니다.
    </p>
    <h3>2. 상영 정보 (신청서 기재본)</h3>
    <ul>
      <li>영화명 : {{ prettyFilmName }}</li>
      <li>상영날짜 : {{ prettyPlaydate }}</li>
      <li>상영회차 : {{ playtimes }}회</li>
      <li>상영장소 : {{ playplace }}</li>
    </ul>
    <h3>3. 파일 유출 및 반환 금지</h3>
    <ol>
      <li>
        "수요자"는 신청서에 기재된 상영장소 및 일정 이외의 장소나 일시에
        "상영본"을 상영하지 않습니다. 상영장소나 일정의 변동이 있는 경우 반드시
        "공급자"에게 허락을 구하고 서면 합의합니다.
      </li>
      <li>
        "수요자"는 상영 목적 이외의 어떠한 경우에도 "상영본"을 외부에 유출하지
        않으며, 상영을 종료 후 책임지고 "상영본"을 완전히 파기합니다.
      </li>
    </ol>
    <h3>4. 기타 사항</h3>
    <ol>
      <li>
        "수요자"은 본 동의서의 내용을 신의성실에 의거하여 준수하여야 합니다.
      </li>
      <li>
        "수요자"가 위 사항을 위반한 경우, "공급자"는 법적 책임과 손해배상을 물을
        수 있습니다.
      </li>
    </ol>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Privacy',
  props: [
    'height',
    'playdate',
    'playtimes',
    'film-name',
    'playplace',
    'user-name',
    'film-list',
    'playdate-start',
    'playdate-end',
  ],
  computed: {
    prettyPlaydate() {
      if (this.playdate) {
        return moment(this.playdate).format('yyyy년 MM월 DD일');
      }
      const start = moment(this.playdateStart).format('yyyy년 MM월 DD일');
      const end = moment(this.playdateEnd).format('yyyy년 MM월 DD일');
      return `${start} - ${end}`;
    },
    prettyFilmName() {
      if (this.filmName) {
        return this.filmName;
      }
      return this.filmList.map((item) => item.title).join(', ');
    },
    style() {
      if (!this.height) return {};
      return {
        height: `${this.height}px`,
        overflowY: 'scroll',
        border: '1px solid #ddd',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
// .privacy-box {
//   // height: 300px;
//   // overflow-y: scroll;
//   // border: 1px solid #ddd;
//   padding: 0 30px 20px;
// }

h2 {
  font-size: 20px;
}
h3 {
  font-size: 16px;
  margin-top: 30px;
}
h4 {
  font-size: 13px;
  font-weight: bold;
}
p,
li {
  font-size: 13px;
}
</style>
<style></style>
