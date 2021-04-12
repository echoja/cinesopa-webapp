# 씨네소파 웹앱

## 소개

씨네소파 웹사이트 및 관리툴 개발과 관련된 소스 코드 관리입니다. 소스는 공개되어 있으나 라이센스는 (추가 예정)입니다.

## 사용 기술

- 데이터베이스는 MongoDB Atlas를 이용합니다.
- 빈약한 서버 메모리에 대처하기 위해 스왑 기능을 활용합니다.
- ssl 단은 전부 nginx 에서 처리합니다.
- ssl 인증서는 Let's Encrypt 를 활용합니다. 서버 사전 세팅이 필요합니다.
- 로컬 환경에서는 ssl이나 nginx reverse proxy 기능을 사용하지 않습니다.
- 서버 프로그램 실행은 도커를 활용합니다. 서버 사전 세팅이 필요합니다.
- nginx의 리버스 프록시 기능을 활용하여 실제 서버를 노출시키지 않습니다.
- api 처리는 graphql 을 이용합니다. 단, 사용자의 세션(쿠키)에 종속적이라서, 같은 url 내에 있어야 합니다. (sopaseom.com 에서 처리하는 모든 api 요청은 sopaseom.com/graphql 로 가도록.)
- 서버는 express 입니다.
- 클라이언트는 vue 입니다.

## 로컬 개발환경 세팅

### eslint

vscode 에서 `Preferences : Open Workspace Settings (JSON)` 에 들어간다.

다음 항목을 추가한다.

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": true },
  "eslint.alwaysShowStatus": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue"
  ],
  "eslint.workingDirectories": [
    "./cinesopa/",
    "./sopaseom/"
  ] ,

  "files.exclude": {
    "**/.git": true,
    "**/.vscode": true,
    "**/node_modules": true
  },
  "prettier.endOfLine": "lf",
  "files.eol": "\n"
}
```

## 서버 세팅

### 서버 사전 세팅

각종 프로그램은 도커로 실행합니다. 서버 실행 뿐만 아니라 Let's Encrypt 인증서 관리까지 이미 빌드된 이미지를 활용해서 도커 컨테이너로 진행합니다. 그러므로 도커의 버전을 맞추는 것이 중요합니다. 구버전일 경우 올바르게 동작하지 않을 수도 있습니다.

#### 각종 프로그램 버전 정보

- Docker version 19.03.12, build 48a66213fe
- docker-compose version 1.26.2, build eefe0d31

#### 스왑 (일종의 가상 메모리) 설정하기

우선 스왑을 설정

```bash
sudo swapon -s
sudo fallocate -l 2GB /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

그 다음, 스왑을 재부팅해도 없어지지 않도록 설정

```bash
sudo vim /etc/fstab
```

이후 다음 항목을 추가하여 저장

```swapfile
/swapfile none swap sw 0 0
```

#### docker로 Let's Encrypt SSL 인증서 등록&갱신하기

##### Let's Encrypt 인증서 발급받기

```bash
sudo docker run -it --rm --name certbot \
-v '/etc/letsencrypt:/etc/letsencrypt' \
-v '/var/lib/letsencrypt:/var/lib/letsencrypt' \
certbot/certbot certonly \
-d cinesopa.kr -d graphql.sopaseom.com -d sopaseom.com -d www.cinesopa.kr -d www.sopaseom.com \
--manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory
```

##### ~~Let's Encrypt 인증서 리뉴얼~~

```bash
sudo docker run -it --rm --name certbot \
-v '/etc/letsencrypt:/etc/letsencrypt' \
-v '/var/lib/letsencrypt:/var/lib/letsencrypt' \
certbot/certbot renew --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory
```

##### ~~crontab 으로 인증서 갱신 자동화~~ (수정 필요)

```crontab
50 23 * * * crontab -l > $HOME/crontab_log/crontab_bak.txt
45 5 */3 * * sudo docker run -it --rm --name certbot -v '/etc/letsencrypt:/etc/letsencrypt' -v '/var/lib/letsencrypt:/var/lib/letsencrypt' certbot/certbot renew --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory >> $HOME/crontab_log/letsencrpyt.log 2>&1

```

- 1열 : crontab의 내용을 crontab_bak.txt 에 저장하기. (백업)
- 2열 : 3일마다 새벽 5시 45분에 갱신 실시. 관련 로그는 `$HOME/crontab_log/letsencrpyt.log` 에 계속 추가하며 저장.

## 배포

### 로컬에서 이미지 빌드 후 Docker Hub에 배포하기

1. `docker build -t eszqsc112/cinesopa:latest .` 실행하여 이미지 빌드
   - 버전을 매길려면 `docker build -t eszqsc112/cinesopa:latest -t eszqsc112/cinesopa:0.4.3 .` 등으로 버전을 매긴다.
2. `docker push eszqsc112/cinesopa` 실행하여 배포
3.  배포가 완료되면 특정 버전은 삭제하여도 된다. (`docker image rm eszqsc112/cinesopa:0.4.3`)

### 서버 환경 세팅

1. `git pull`로 최신 버전 소스 파일들로 땡겨오기. (서버를 실행시키는 `docker-compose.yml` 및 `refresh.sh` 파일을 받아와야 함. 프록시 설정도 git에 저장되어 있음.)
1. `server/config/common/index.js` 파일 생성 (`server/config/common/index-example.js` 파일 참고하여 해당하는 파일 설정하기.)
1. [프록시 설정 문서](proxy)를 참고하여 프록시 서버 설정하기.

### 실행(및 재실행)

다음 쉘 프로그램 실행 (docker hub에서 이미지 내려받고 다시 진행)

```bash
./refresh.sh
```
