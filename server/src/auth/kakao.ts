import { Profile, Strategy as KakaoStrategy } from 'passport-kakao';
import { PassportStatic } from 'passport';
import { DBManager, Userinfo } from '@/typedef';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { kakaoClientId, kakaoClientSecret } from '../../config/common';

export const kakaoStrategyOptions = {
  clientID: kakaoClientId,
  clientSecret: kakaoClientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
  callbackURL:
    process.env.NODE_ENV === 'production'
      ? 'https://sopaseom.com/graphql/kakao/login/oauth'
      : 'http://localhost:8080/graphql/kakao/login/oauth',
};
/**
 *
 * @param {DBManager} db
 */
export const kakaoVerifyFunctionMaker = (db: DBManager) => async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (err: Error, user?: Userinfo) => void,
): Promise<void> => {
  // 사용자의 정보는 profile에 들어있다.
  const kakaoId = profile._json.id;
  const accountInfo = profile._json.kakao_account;
  const { is_email_valid, is_email_verified, email } = accountInfo;
  if (!is_email_valid || !is_email_verified) {
    return done(
      new Error(
        '카카오에서 계정의 이메일이 인증되지 않았습니다. 카카오 계정으로 로그인할 수 없습니다.',
      ),
    );
  }

  // 유저 정보가 이미 존재하는 경우 각종 정보를 업데이트하고 유저를 내보냄.
  // todo: 유저가 인증이 되지 않은 상태에서 정보 업데이트 하려고 하면 어떻게 되는가? - 바로 빠꾸 먹여야 함.
  const user = await db.getUserByEmail(email);
  if (user) {
    await db.updateUser(email, {
      kakao_access_token: accessToken,
      kakao_refresh_token: refreshToken,
      kakao_id: kakaoId,
      blocked_count: 0,
      wrong_pwd_count: 0,
    });
    const updated = await db.getUserByEmail(email);
    return done(null, updated);
  }

  // 카카오로 로그인했는데 기존의 로그인 정보가 없는 경우
  // 새롭게 유저를 만들어서 그 유저를 내보냄.
  await db.upsertKakaoUser(email, {
    kakao_access_token: accessToken,
    kakao_refresh_token: refreshToken,
    kakao_id: kakaoId,
    blocked_count: 0,
    wrong_pwd_count: 0,
  });
  const upserted = await db.getUserByEmail(email);
  return done(null, upserted);
};

export const useKakaoStrategy = (
  passport: PassportStatic,
  db: DBManager,
): void => {
  passport.use(
    new KakaoStrategy(kakaoStrategyOptions, kakaoVerifyFunctionMaker(db)),
  );
};

interface KakaoError {
  code: number;
  msg: string;
}

interface KakaoRequestArgs {
  method: Method;
  data?: any;
  headers?: any;
  access_token?: string;
}

interface KakaoResponse<ResType> {
  success: boolean;
  data?: ResType;
  error?: KakaoError;
}

/**
 *
 * @param url 요청을 날릴 url
 * @param param1
 * @returns data 속성이 있으면 성공, data 속성이 없고 error 속성이 있으면 실패.
 */
export async function kakaoRequest<ResType>(
  url: string,
  config: KakaoRequestArgs,
): Promise<KakaoResponse<ResType>> {
  const { method, access_token, data, headers = {} } = config;

  // headers 설정
  if (access_token) {
    headers.Authorization = `Bearer ${access_token}`;
  }
  let res: AxiosResponse;
  try {
    // 요청 날리기
    const instance = axios.create();
    res = await instance.request({ url, method, headers, data });
  } catch (e) {
    // 요청 실패
    const error: AxiosError = e;
    if (error.response) {
      // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
      const { data } = error.response;
      const kakaoError = {
        msg: data.msg,
        code: data.code,
      };
      return { success: false, error: kakaoError };
    }
    console.log(e);
    return {
      success: false,
      error: {
        code: -999,
        msg: 'unknown kakao error',
      },
    };
  }

  // 정상 수행
  console.log(`# kakaoRequest ${url} ${method} success`);
  console.log(res.data);
  return { success: true, data: res.data };
}

/**
 * POST /oauth/token HTTP/1.1
 * Host: kauth.kakao.com
 * Content-type: application/x-www-form-urlencoded;charset=utf-8
 *
 * datas
 * grant_type	String	refresh_token으로 고정	O
 * client_id	String	앱 생성 시 발급받은 REST API	O
 * refresh_token	String	토큰 발급 시 응답으로 받은 refresh_token. Access Token을 갱신하기 위해 사용	O
 * client_secret	String	토큰 발급 시, 보안을 강화하기 위해 추가 확인하는 코드. [내 애플리케이션] > [보안]에서 설정 가능. ON 상태인 경우 필수 설정해야 함
 */

interface KakaoRefreshRes {
  /** 토큰 타입, bearer로 고정 */
  token_type: string; //
  /** 갱신된 사용자 액세스 토큰 값 */
  access_token: string; //
  /** 액세스 토큰 만료 시간(초) */
  expires_in: number; //
  /** 갱신된 사용자 리프레시 토큰 값, 기존 리프레시 토큰의 유효기간이 1개월 미만인 경우에만 갱신 */
  refresh_token?: string; //
  /** 리프레시 토큰 만료 시간(초) */
  refresh_token_expires_in?: number; //
}

/**
 * refresh 토큰을 이용해 access 토큰을 다시 가져옵니다.
 * @param refresh_token
 */
export async function refresh(
  refresh_token: string,
): Promise<KakaoResponse<KakaoRefreshRes>> {
  return kakaoRequest<KakaoRefreshRes>('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    data: {
      grant_type: 'refresh_token',
      client_id: kakaoClientId,
      refresh_token,
    },
  });
}

/**
 * GET /v1/user/access_token_info HTTP/1.1
 * Host: kapi.kakao.com
 * Authorization: Bearer {ACCESS_TOKEN}
 * Content-type: application/x-www-form-urlencoded;charset=utf-8
 */

interface KakaoAccessTokenInfoRes {
  id: number;
  expires_in: number;
  app_id: number;
}

export async function getAccessTokenInfo(
  access_token: string,
): Promise<KakaoResponse<KakaoAccessTokenInfoRes>> {
  return kakaoRequest<KakaoAccessTokenInfoRes>('https://kapi.kakao.com/v1/user/access_token_info', {
    method: 'GET',
    access_token,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
}

// POST /v1/user/unlink HTTP/1.1
// Host: kapi.kakao.com
// Authorization: Bearer {ACCESS_TOKEN}

interface KakaoUnlinkRes {
  id: string;
}

/**
 * unlink 수행. 내부에서 kakaoRequest 함수를 호출합니다.
 * @param access_token 각 유저의 액세스 토큰
 */
export async function unlink(
  access_token: string,
): Promise<KakaoResponse<KakaoUnlinkRes>> {
  console.log('# kakao.ts unlink called');
  return kakaoRequest<KakaoUnlinkRes>('https://kapi.kakao.com/v1/user/unlink', {
    method: 'POST',
    access_token,
  });
}

/**
 * 일단 access_token 검사를 하고, 그 다음 unlink 를 수행합니다.
 * 만약 access_token 이 만료되었을 시 refresh_token 을 이용해 새로고침함.
 * @param access_token 각 유저의 액세스 토큰
 * @returns 토큰이 업데이트 되었다면 각각의 ..._token_updated 변수가 true 임.
 */
export async function tryUnlink(
  access_token: string,
  refresh_token: string,
): Promise<{
  success: boolean;
  code?: string;
  refresh_token?: string;
  refresh_token_updated?: boolean;
  access_token?: string;
  access_token_updated?: boolean;
}> {
  // console.log('# kakao.ts abc');
  // console.log(access_token);
  // console.log(refresh_token);
  const tokenInfo = await getAccessTokenInfo(access_token);
  let access_token_updated = false;
  let refresh_token_updated = false;
  // 액세스 토큰이 만료됨
  if (!tokenInfo.success) {
    const refreshResult = await refresh(refresh_token);
    // refresh token 마저 만료됨
    if (!refreshResult.success) {
      return { success: false, code: 'refresh_token_expired' };
    }
    // 액세스 토큰 갱신
    access_token = refreshResult.data?.access_token;
    access_token_updated = true;
    if (refreshResult.data.refresh_token) {
      refresh_token = refreshResult.data.refresh_token;
      refresh_token_updated = true;
    }
  }
  // console.log('# kakao.ts abcde');
  // console.log(access_token);
  // console.log(refresh_token);

  // 액세스 토큰 갱신 완료
  const unlinkResult = await unlink(access_token);
  // console.log('# kakao.ts');
  // console.log(unlinkResult);
  if (!unlinkResult.success) {
    return { success: false, code: unlinkResult?.error?.msg };
  }
  return {
    success: true,
    refresh_token,
    access_token,
    refresh_token_updated,
    access_token_updated,
  };
}

export default {
  kakaoVerifyFunctionMaker,
  useKakaoStrategy,
  unlink,
  tryUnlink,
  getAccessTokenInfo,
  refresh,
};
