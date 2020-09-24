<template>
  <div ref="about" class="container-fluid">
    <!-- big-title -->
    <h1 class="visually-hidden">씨네소파 소개</h1>
    <div class="big-title d-flex justify-content-center">
      <div class="big-title-letter">
        <div class="big-title-letter-up">
          씨네
        </div>
        <div class="big-title-letter-down">
          Cine-; 영화의
        </div>
      </div>
      <span class="big-title-plus">+</span>
      <div class="big-title-letter">
        <div class="big-title-letter-up">
          소파
        </div>
        <div class="big-title-letter-down">
          小波; 작은 파도
        </div>
      </div>
    </div>

    <!-- excerpt -->
    <div class="excerpt">
      씨네소파는 숨겨져 있던 영화를<br />
      관객에게 실어 보내는 파도입니다.
    </div>

    <!-- value three -->
    <div class="value-three">
      <div class="value-three-background">
        <b-img
          class="value-three-background-img unselectable"
          src="../assets/about/values-bg.png"
        ></b-img>
      </div>
      <div class="value-three-prefix">우리의 작은 파도는</div>
      <div class="value-three-main d-flex justify-content-center">
        <div class="blue-circle">
          <p>
            상영 기회가 없던<br /><span class="blue-circle-strong">좋은 영화</span>를 발견하여<br />관객과
            만나게 합니다.
          </p>
        </div>
        <!-- <div class="blue-dots">
          <div class="blue-dot"></div>
          <div class="blue-dot"></div>
          <div class="blue-dot"></div>
        </div> -->
        <div class="blue-circle">
          <p>
            영화를 재밌고<br />깊이 <span class="blue-circle-strong">향유</span>할 수 있는<br />방법을
            고민합니다.
          </p>
        </div>
        <!-- <div class="blue-dots">
          <div class="blue-dot"></div>
          <div class="blue-dot"></div>
          <div class="blue-dot"></div>
        </div> -->
        <div class="blue-circle">
          <p>
            다재다능한 친구들과<br />영화를 매개로<br /><span class="blue-circle-strong">함께</span
            >하고자 합니다.
          </p>
        </div>
      </div>
      <div class="value-three-affix">
        <div class="value-three-affix-bg"></div>
        <div class="value-three-affix-sub">씨네소파는 시야를 확장시키는 영화를 통해</div>
        <div class="value-three-affix-main">
          나 자신을 발견하고, 상대를 헤아리며,<br />
          세상을 이해하는 방법을 제시합니다.
        </div>
      </div>
    </div>
    <!-- works -->
    <div class="big-heading-wrapper">
      <h2 class="big-heading">씨네소파가 하는 일</h2>
    </div>
    <div class="works">
      <div class="works-bg"></div>
      <div class="works-circles">
        <div class="works-circle">영화<br />배급/마케팅</div>
        <div class="works-circle">영화향유플랫폼<br />소파섬</div>
        <div class="works-circle">홍보 및<br />행사 대행</div>
      </div>
    </div>

    <!-- people -->
    <div class="big-heading-wrapper">
      <h2 class="big-heading">함께하는 사람들</h2>
    </div>
    <div class="people row">
      <div class="person col-12 col-md-6" v-for="(person, index) in people" :key="index">
        <div class="person-sign">
          <b-img class="person-sign-image" :src="person.imageLink" alt=""></b-img>
        </div>
        <div class="person-info">
          <div class="person-name-position">
            <div class="person-name-position-wrapper">
              <div class="person-name">
                <span class="person-real-name">{{ person.name }}</span>
                <span class="person-nickname"> {{ person.nickname }}</span>
              </div>
              <div class="person-position">
                <template v-if="person.position !== ''">
                  {{ person.position }}
                  <span class="position-seperator">|</span>
                </template>

                {{ person.work }}
              </div>
            </div>
          </div>
          <div class="person-contact">
            <div class="person-phone">
              <span class="person-contact-title">m</span>
              <span class="person-contact-content">{{ person.phone }}</span>
            </div>
            <div class="person-email">
              <span class="person-contact-title">e</span>
              <span class="person-contact-content">{{ person.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- history -->
    <div class="big-heading-wrapper">
      <h2 class="big-heading">씨네소파가 걸어온 길</h2>
    </div>
    <div class="history">
      <div class="history-bg"></div>
      <div class="history-year-row" v-for="(yearGroup, index) in formattedHistory" :key="index">
        <div class="history-year">{{ yearGroup.year }}</div>
        <div class="history-events">
          <div class="history-event" v-for="(event, index) in yearGroup.events" :key="index">
            {{ event.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  title: '인사해요',
  data() {
    return {
      //       최예지(딩딩)
      // - 직무: 홍보마케팅

      // 성송이(쏭쏭)
      // - 직급: 대표
      // - 직무: 배급

      // 남유진(남다른)
      // - 직무: 배급/홍보지원

      // 최동녁(누룩)
      // - 직무: 디자인, 홍보지원
      //       nulook@cinesopa.kr
      // ssong@cinesopa.kr
      // dingding@cinesopa.kr
      // namda@cinesopa.kr
      people: [
        {
          name: '성송이',
          nickname: '쏭쏭',
          position: '대표',
          work: '배급',
          email: 'ssong@cinesopa.kr',
          phone: '010-3577-4970',
          // eslint-disable-next-line global-require
          imageLink: require('../assets/test/ss.png'),
        },
        {
          name: '최예지',
          nickname: '딩딩',
          position: '',
          work: '홍보마케팅',
          email: 'dingding@cinesopa.kr',
          phone: '010-3399-4668',
          // eslint-disable-next-line global-require
          imageLink: require('../assets/test/dd.png'),
        },
        {
          name: '최동녁',
          nickname: '누룩',
          position: '',
          work: '디자인/홍보지원',
          email: 'nulook@cinesopa.kr',
          phone: '010-5295-9737',
          // eslint-disable-next-line global-require
          imageLink: require('../assets/test/nu.png'),
        },
        {
          name: '남유진',
          nickname: '남다른',
          position: '',
          work: '배급/홍보지원',
          email: 'namda@cinesopa.kr',
          phone: '010-8425-9362',
          // eslint-disable-next-line global-require
          imageLink: require('../assets/test/nam.png'),
        },
      ],
      history: [
        { date: new Date('2019-05-03'), title: '영화展; 기억할 만한 지나침[머무는 집] 전시' },
        { date: new Date('2019-04-03'), title: '<기억할 만한 지나침> 전국 개봉' },
        { date: new Date('2019-03-03'), title: '<밤의 문이 열린다> 전국 개봉' },
        { date: new Date('2019-02-03'), title: '높아서 재송 ‘재송동 사무실’시대 개막' },
        { date: new Date('2019-01-03'), title: '부산독립영화제 순회상영회 <단, 비>진행' },
        { date: new Date('2018-06-03'), title: '<마담B> 전국 개봉' },
        { date: new Date('2018-05-03'), title: '시민배급단 씨네보배 1기 운영' },
        { date: new Date('2018-04-03'), title: '부산형 예비사회적 기업 지정' },
        { date: new Date('2018-03-03'), title: '배급기록집 [소파섬] 1호 출간' },
        { date: new Date('2018-02-03'), title: '관객리뷰단 씨네보쓰 2기 운영' },
        { date: new Date('2018-01-03'), title: '<파란입이 달린 얼굴> 전국 개봉' },
        { date: new Date('2017-05-03'), title: '배급기록집 [소파섬] 0호 출간' },
        { date: new Date('2017-04-03'), title: '관객리뷰단 씨네보쓰 1기 운영' },
        { date: new Date('2017-03-03'), title: '<그럼에도 불구하고> 전국 개봉' },
        { date: new Date('2017-02-03'), title: '영화배급협동조합 씨네소파 설립' },
        { date: new Date('2017-01-03'), title: '영화배급협동조합 씨네소파 창립총회' },
      ],
    };
  },
  computed: {
    formattedHistory() {
      const yearKeyed = {};
      this.history.forEach((event) => {
        const year = event.date.getFullYear();
        if (yearKeyed[year] === undefined) yearKeyed[year] = [];
        yearKeyed[year].push(event);
      });
      // const result = [];
      const result = Object.keys(yearKeyed)
        .sort()
        .reverse()
        .map((year) => ({
          year,
          events: yearKeyed[year].sort((a, b) => b.date.getTime() - a.date.getTime()),
        }));
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../util.scss';

.big-title {
  position: relative;
  z-index: 2;
  margin: 80px 0 0;
}

.big-title-letter-up {
  font-size: 24px;
  font-weight: 700;
}

.big-title-letter-down {
  color: util.$text-secondary-color;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: -1px;
  text-align: center;
  margin: 0 -20px 0;
}
.big-title-plus {
  font-size: 24px;
  font-weight: 700;
  color: util.$text-secondary-color;
  padding: 0 30px;
}

.excerpt {
  position: relative;
  z-index: 2;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  padding: 50px 0;
  margin-bottom: 50px;
  letter-spacing: -0.5px;
}

.value-three {
  position: relative;
  margin: 0 -15px;
}
.value-three-prefix {
  position: relative;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  padding: 50px 0 20px;
  color: util.$link-color;
}

.value-three-main {
  position: relative;
  // margin: 30px 0;
  padding: 0 0 30px;
}

.value-three-background {
  position: absolute;
  transform: translateX(min(calc((100vw - 1260px) / -2), 0.000000000000000001px));
  // background-color: #ddd;
  width: 100vw;
  height: 100%;
}

.value-three-background-img {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -500px;
}
.blue-circle {
  text-align: center;
  color: util.$text-color;
  // border-bottom: 1px solid util.$link-color;
  margin: 0 20px;
  // background-color: #fff;
  padding: 0 20px;
  // width: 200px;
  // height: 200px;
  // border-radius: 300px;
  display: flex;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.4px;
  justify-content: center;
  align-items: center;
}
.blue-circle-strong {
  font-weight: 700;
  // font-size: 21px;
}
.blue-circle p {
  // padding-bottom: 100%;
  margin: 0;
}
.blue-dots {
  display: flex;
  align-items: center;
  margin: 8px;
}
.mobile .boue-dots {
  display: none;
}

.blue-dot {
  width: 10px;
  height: 10px;
  border-radius: 100px;
  margin: 2px;
  background-color: #009eda;
  // background-color: var(--link-dark-color);
}
.value-three-affix {
  position: relative;
  padding: 80px 0 30px;
}

.value-three-affix-bg {
  position: absolute;
  top: 0%;
  width: 100%;
  height: 120%;
  background: radial-gradient(rgba(255, 255, 255, 1) 0%, transparent 50%);
}

.value-three-affix-sub {
  position: relative;
  text-align: center;
  font-size: 19px;
  font-weight: 600;
  color: #009eda;
  // color: #009eda;
}

.value-three-affix-main {
  position: relative;
  text-align: center;
  font-size: 26px;
  font-weight: 500;
}

/* BIG HEADING */

.big-heading-wrapper {
  display: flex;
  position: relative;
  justify-content: center;
  margin-top: 100px;
}
.big-heading-wrapper::before {
  content: '';
  background-color: #009eda;
  display: block;
  position: absolute;
  width: 360px;
  height: 1px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.big-heading {
  text-align: center;
  display: block;
  color: #009eda;
  margin: 60px auto;
  font-size: 38px;
  // border-top: 1px solid #009eda;
}
/* PEOPLE */

.people {
  max-width: 1000px;
  margin: 0 auto;
}

.person {
  padding: 50px;
}

.person-sign {
  // text-align: center;
  // background-color: #eee;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.person-sign-image {
  max-width: 100%;
  max-height: 100%;
  min-width: 1px;
  min-height: 1px;
  padding: 30px;
}

.person-info {
  display: flex;
}

.person-name-position,
.person-contact {
  // flex: 0 0 auto;
  
  width: 50%;
}

.person-name-position {
  // padding-left: 60px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  // text-align: right;
}

.person-name-position-wrapper {

}
.person-contact {

  display: flex;
  flex-direction: column;
  justify-content: center;
}



.person-real-name {
  font-size: 28px;
  font-weight: 600;
}

.person-nickname {
  font-size: 20px;
  font-weight: 500;
}

.person-position {
  margin-top: -5px;
  margin-left: 1px;
}
.person-phone, .person-email {
  border-left: 1px solid util.$link-color;
  padding-left: 20px;
  font-size: 15px;
}

.person-phone {
  padding-bottom: 5px;
}

.person-contact-title {
  font-weight: 600;
  width: 20px;
  display: inline-block;
}

.person-contact-content {
  color: util.$text-secondary-color;
}
/* WORKS */

.works {
  position: relative;
  margin-left: -15px;
  margin-right: -15px;
  margin-bottom: 100px;
}

.works-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: center url('../assets/about/works-bg.png') no-repeat;
  background-size: auto 515px;
  background-position: center top -90px;
}

.works-circles {
  display: flex;
  position: relative;
  justify-content: center;
}

.works-circle {
  // flex-shrink: 0;
  flex-grow: 0;
  width: 250px;
  text-align: center;
  font-size: 28px;
  line-height: 1.3;
  color: #009eda;
  font-weight: 500;
  padding: 100px 0 150px;
}

// history
.history {
  margin-top: 40px;
  position: relative;
}

.history-bg {
  // background: url('../assets/about/vertical-wave.svg') repeat-y;
  // position: absolute;
  // left: 50%;
  // transform: translateX(-50%);
  // top: 10px;
  // background-position: left 92px top 0px;
  // max-width: 600px;
  // width: 100%;
  // height: calc(100% - 20px);
  // background-size: auto 461px;
}

.history-year-row {
  display: flex;
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}
.history-year {
  color: #009eda;
  font-weight: 600;
  font-size: 32px;
  line-height: calc(100% + 3px);
  padding-right: 30px;
  border-style: solid;
  border-image: linear-gradient(to bottom, util.$link-color 0%, #fff 80%);
  border-image-slice: 1;
  border-image-width: 0 1px 0 0;
}
.history-events {
  padding-left: 30px;
    margin-bottom: 30px;
}
.history-event {
  font-size: 20px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.unselectable {
  user-select: none;
  pointer-events: none;
  // user-drag: none;
  // user-drag: none;
}
</style>

<style></style>
