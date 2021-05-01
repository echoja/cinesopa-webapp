// require('./typedef');

import { Handler } from 'express';
import { argsToArgsConfig } from 'graphql/type/definition';
import { PassportStatic } from 'passport';
import { registerCustomQueryHandler } from 'puppeteer';
import { Asyncify, JsonArray, SetReturnType } from 'type-fest';
import { Userinfo } from './typedef';

/** ******************* */
/* express middleware */
/** ******************* */

/**
 * async 함수도 express middleware 에 사용할 수 있도록 try-catch 문을 씌운 async 래퍼 함수
 * @param {import('express').Handler} asyncFunc
 */
export const aw = (asyncFunc: Asyncify<Handler>): Asyncify<Handler> => async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    await asyncFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * PromiseSettledResult 가 이행되었다면 그 이행된 값을, 그렇지 않다면 defaultValue 를 반환하는 함수
 * @param {PromiseSettledResult<T>} promise
 */
export function unwrap<T, U>(
  result: PromiseSettledResult<T>,
  defaultValue: U = undefined,
): T | U {
  if (result.status === 'fulfilled') return result.value;
  return defaultValue;
}

type AuthHandlerParams = [...Parameters<Handler>, Userinfo]; // todo: need to change into "[...Parameters<Handler>, user: Userinfo]" in typescript 4.3.1

export function authHandler(
  passport: PassportStatic,
  strategy: string,
  handler: (...args: AuthHandlerParams) => void,
): Handler {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user: Userinfo) => {
      console.log('#util.ts authHandler authenticate callback called');
      if (err) {
        console.log('#util.ts authHandler error occurred');
        return;
      }
      handler(req, res, next, user);
    })(req, res, next);
  };
}

/** PromiseSettledResult 가 이행되었다면 그 값을 반환하고, 그렇지 않으면 예외를 던지는 함수 */
export function tryUnwrap<T>(
  result: PromiseSettledResult<T>,
  errMsg = 'Promise not fulfilled',
): T {
  if (result.status === 'fulfilled') return result.value;
  console.error(`# tryUnwrap ${errMsg}`);
  throw Error(errMsg);
}

/**
 * rejected 된 Promise 를 제외시킵니다.
 * @param results Promise.allSettled 로 얻은 결과
 */
export function onlyFulfilled<T>(
  results: PromiseSettledResult<T>[],
): PromiseFulfilledResult<T>[] {
  return results.filter(
    (result): result is PromiseFulfilledResult<T> =>
      result.status === 'fulfilled',
  );
}

/**
 * fulfilled 된 Promise 를 제외시킵니다.
 * @param results Promise.allSettled 로 얻은 결과
 */
export function onlyRejected<T>(
  results: PromiseSettledResult<T>[],
): PromiseRejectedResult[] {
  return results.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );
}

/**
 * Promise 배열을 allSettled 하여 얻은 결과에서 fulfilled 된 것만 가져옵니다.
 * rejected 된 것은 무시됩니다.
 * @param promises Promise 배열
 */
export async function allSettledFiltered<T>(
  promises: T[],
): Promise<(T extends PromiseLike<infer O> ? O : T)[]> {
  const results = await Promise.allSettled(promises);
  const values = onlyFulfilled(results).map((result) => result.value);
  return values;
}

export const numberWithCommas = (x: number): string => {
  if (typeof x === 'number') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '-';
};

export const toPrice = (x: number): string => `￦ ${numberWithCommas(x)}`;

/**
 * async 버전 map. 만약 중간에 문제가 생겼을 경우의 항목은 그냥 무시합니다.
 * @param list 리스트
 * @param callbackfn 콜백 함수
 */
export async function asyncMap<T, U>(
  list: ReadonlyArray<T>,
  callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
): Promise<U[]> {
  const mapped = list.map(callbackfn);
  const result = await allSettledFiltered(mapped);
  console.log(result);
  return result;
}

/** @deprecated */
export const getDateFromObj = (datetime) => {
  const { year, month, day, hour, minute, second } = datetime;
  return new Date(year, month, day, hour, minute, second);
};

export function isStringArray(array: JsonArray): array is string[] {
  return array.every((value) => typeof value === 'string');
}

/**
 * 오브젝트의 해당하는 키에 대하여 func의 return 값으로 대채 적용 후, obj를 리턴합니다.
 * @param {object} obj 대상 오브제트
 * @param {*} keyArray 해당하는 키
 * @param {*} func
 */
// const graphqlOutput = (obj, func, keyArray) => {
//   Object.keys();
// };
