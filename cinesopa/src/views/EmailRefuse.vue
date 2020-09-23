<template>
  <div class="email-refuse">
    <h1>
      이메일무단수집거부
    </h1>
    <div class="main-message">
      <p>
        영화배급협동조합 씨네소파 홈페이지에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의
        기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반시 정보통신망법에 의해
        형사처벌 됨을 유념하시기 바랍니다.
      </p>
    </div>
    <div class="basis">
      <h2>
        근거 : 정보통신망 이용촉진 및 정보보호 등에 관한 법률 제50조의2(전자우편주소의 무단 수집행위
        등 금지)
      </h2>
      <ul>
        <li>
          누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로
          전자우편주소를 수집하는 프로그램 그 밖의 기술적 장치를 이용하여 전자우편주소를
          수집하여서는 아니된다.
        </li>
        <li>
          누구든지 제1항의 규정을 위반하여 수집된 전자우편주소를 판매·유통하여서는 아니된다.
        </li>
        <li>
          누구든지 제1항의 및 제2항의 규정에 의하여 수집·판매 및 유통이 금지된 전자우편주소임을 알고
          이를 정보전송에 이용하여서는 아니된다.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailRefuse',
  title: '이메일무단수집거부',
};
</script>

<style lang="scss" scoped>
@use '../util.scss';

.email-refuse {
  max-width: 700px;
  margin: 0 auto;
}

.main-message {
  border: 1px solid util.$link-color;
  padding: 20px;
  & p {
    margin: 0;
  }
}

h1 {
  color: util.$link-color;
  margin-bottom: 30px;
}

.basis {
  margin: 50px 0;
}

.basis h2 {
  font-size: 18px;
}
</style>

<style></style>
