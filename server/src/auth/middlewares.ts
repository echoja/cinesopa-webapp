import {
  AuthValidator,
  AuthType,
  AuthActions,
  AuthActionDataMap,
} from '@/typedef';
import { authHandler, aw } from '@/util';
import { ErrorRequestHandler, Handler, Request } from 'express';
import { PassportStatic } from 'passport';
import { Asyncify, SetReturnType } from 'type-fest';

/**
 * 권한을 검사하는 express middleware를 생성합니다.
 * @param authvalidator authValidator
 * @param condition 가능한 AUTH 목록. enumAuthmap 중 하나여야 함.
 */
export const makeAuthMiddleware = (
  authvalidator: AuthValidator,
  condition: AuthType[],
): Asyncify<Handler> => {
  const result = aw(async (req, res, next) => {
    const contains = await authvalidator.contains(req.user?.role, condition);
    if (contains) {
      next();
    } else {
      res.status(401).send();
    }
  });
  return result;
};

// export class AuthActionHandler {
//   #handler: Handler;

//   constructor(handler: Handler) {
//     this.#handler = handler;
//   }

//   handle(...args: Parameters<Handler>): void {
//     const [req, res, next] = args;
//     this.#handler(req, res, next);

//     // 처리를 하고 난 후 authAction 관련된 데이터를 삭제
//     delete req.session.authAction;
//     delete req.session.authActionData;
//   }
// }

type AuthActionHandler<T extends AuthActions> = (
  ...args: [...Parameters<Handler>, AuthActionDataMap[T]]
) => void;

function authActionHandler<T extends AuthActions>(
  handler: AuthActionHandler<T>,
): AuthActionHandler<T> {
  return handler;
}

/* 미리 각 authActions 에 대한 액션을 미리 만들어둔다. */
const authActionHandlers = new Map<AuthActions, AuthActionHandler<AuthActions>>(
  [
    [
      'kakaoDetach',
      authActionHandler<'kakaoDetach'>((req, res, next, data) => {
        res.redirect('/application');
      }),
    ],
  ],
);

export function makeAuthActionMiddleware<T extends AuthActions>(
  passport: PassportStatic,
  strategy: string,
  action: T,
  data: AuthActionDataMap[T],
): Handler {
  return (req, res, next) => {
    req.session.authAction = action;
    req.session.authActionData = data;
    passport.authenticate(strategy)(req, res, next);
  };
}

/**
 * @returns 여기서 성공적으로 처리가 되었다면 true 를 반환한다.
 * 아무것도 하지 않았으면 false 를 반환한다.
 */
export const handleAuthAction = (...args: Parameters<Handler>): boolean => {
  const [req, res, next] = args;
  const { authAction } = req.session;
  if (!authAction) return false;
  // 플래그 핸들러에서 하나하나 처리.

  // authActionHandlers 에서 해당하는 핸들러를 가져옴.
  const handler = authActionHandlers.get(authAction);
  if (!handler) return false;

  // 데이터 가져오기
  const data = req.session.authActionData;

  // 초기화
  req.session.authAction = null;
  req.session.authActionData = null;

  // 실행시킴.
  handler(req, res, next, data);
  return true;
};

export const OAuthHandler = (...args: Parameters<Handler>): void => {
  const [req, res, next] = args;
  const processed = handleAuthAction(req, res, next);
  if (!processed) {
    const redirectLink = req.session.redirectLink ?? '/';
    req.session.redirectLink = null;
    res.redirect(redirectLink);
  }
};

export default {
  makeAuthMiddleware,
  handleAuthAction,
  OAuthHandler,
  makeAuthActionMiddleware,
};
