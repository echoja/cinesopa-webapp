# 씨네소파 웹앱

## 소개

씨네소파 웹사이트 및 관리툴 개발과 관련된 소스 코드 관리입니다. 소스는 공개되어 있으나 라이센스는 (추가 예정)입니다.

## 프로젝트 실행

### 환경 세팅 

1. `server/config/index.js` 파일 생성 (`server/config/index-example.js` 파일 참고)
1. SSL 인증서 설치. (Let's Encrypt 사용시 `crontab` 등을 이용해 자동 갱신 필요)

### 


1. 도커 이미지 빌드 및 컨테이너 실행

   - ssl 인증서 정보를 위하여 볼륨 설정 필요.

    ```bash
    docker build -t app:0.1 .
    sudo docker run -it -p 4000:4000 -v /etc/letsencrypt:/app/server/config/letsencrypt  --rm --name vue app:0.1
    ```

## 배포

추가 예정
