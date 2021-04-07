import { Fulfilled } from '@/typedef';

import Hangul from 'hangul-js';
import {
  ACCESS_ALL,
  ACCESS_ADMIN,
  ACCESS_AUTH,
  ACCESS_UNAUTH,
  makeResolver,
  db,
} from '@/loader';

export default {
  Query: {
    sopakits: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      condition.status = 'show';
      return db.getSopakits(condition);
    }).only(ACCESS_ALL),
    sopakitsAdmin: makeResolver(async (obj, args, context, info) => {
      const { condition } = args;
      return db.getSopakits(condition);
    }).only(ACCESS_ADMIN),
    /**
     * 소파킷 리스트에 어울리는 데이터를 뽑아내는 리졸버 함수.
     * Film, Sopakit, Product 모두에 접근함.
     */
    sopakitsShown: makeResolver(async (obj, args, context, info) => {
      const condition = { status: 'show' };
      const { list: products } = await db.getProducts({
        product_type: 'sopakit',
        status: 'public',
      });
      const kitIdSet = new Set<number>(); // need check
      const promises = [];
      // console.log('# sopakit-resolver sopakitsShown products');
      // console.log(products);
      // 우선 product 를 순회하면서 중복 없이 kit id 정보들을 빼옴.
      // 중복 없이 담기 위해 일단 Map을 사용하며, 값은 의미없는 값('')을 둠.
      products.forEach((product) => {
        const kitId = product.kit_id;
        if (typeof kitId === 'number' && !kitIdSet.has(kitId)) {
          const promise = db.getSopakit(kitId);
          kitIdSet.add(kitId);
          promises.push(promise);
        }
      });

      // kit id 기반으로 sopakitMap 에 소파킷 정보를 가져옴.
      // 소파킷 키워드 정보를 불러올 때 공개 상태인 것만 가져오도록 함.
      const results = await Promise.allSettled(promises);
      const sopakitMap = new Map(
        results
          .filter(
            (result): result is Fulfilled<typeof result> =>
              result.status === 'fulfilled',
          )
          .filter(({ value }) => value.status === 'show')
          .map(({ value }) => [value.id, value]),
      ); // need check
      // console.log('# sopakit-resolver sopakitsShown promises');
      // console.log(promises);
      // console.log('# sopakit-resolver sopakitsShown sopakitMap1');
      // console.log(sopakitMap);
      const sopakitsShownItems = [];
      const sopakitProductMap = new Map();
      const noKeywordProducts = [];

      // 영화 정보 갖고오기
      const filmResults = await Promise.allSettled(
        products.map((product) => db.getFilm(product.related_film.id)),
      );
      const filmMap = new Map(
        filmResults
          .filter(
            (result): result is Fulfilled<typeof result> =>
              result.status === 'fulfilled',
          )
          .filter(({ value }) => value)
          .map(({ value }) => [value.id, value]),
      );
      // console.log('# sopakit-resolver sopakitsShown filmMap');
      // console.log(filmMap);

      // 결과 형성하기. 키워드가 있느냐 없느냐에 따라서 상품을 둘로 나눔.
      products.forEach((product) => {
        const { kit_id } = product;

        // 만약 현재 product의 kit_id 에 대한 kit 정보를 찾아놓았다면,
        // 키워드가 있다는 뜻이므로 sopakitProductMap 에 추가함.
        if (sopakitMap.has(kit_id)) {
          // sopakitProductMap의 값이 초기화가 되어 있지 않을 경우 빈 배열 만들기
          if (!sopakitProductMap.has(kit_id)) {
            sopakitProductMap.set(kit_id, []);
          }

          // product 에 미리 찾아놓은 영화 정보를 심어주기
          if (filmMap.has(product.related_film)) {
            product.related_film = filmMap.get(product.related_film);
          }

          // 해당하는 칸에 product 추가하기
          sopakitProductMap.get(kit_id).push(product);
        }
        // 만약 kit_id 가 없다면 키워드가 없다는 뜻이므로
        // noKeywordProducts 에 추가함.
        else {
          noKeywordProducts.push(product);
        }
      });
      // console.log('forEachBefore');

      // sopakitsShownItems 완성
      sopakitMap.forEach((sopakitDoc, sopakitId) => {
        // need-check
        sopakitsShownItems.push({
          sopakit: sopakitDoc,
          products: sopakitProductMap.get(sopakitId),
        });
      });
      // for (const [sopakitId, sopakitDoc] of sopakitMap) {
      //   sopakitsShownItems.push({
      //     sopakit: sopakitDoc,
      //     products: sopakitProductMap.get(sopakitId),
      //   });
      // }
      const result = {
        sopakitsShownItems,
        noKeywordProducts,
      };
      // console.log('# Sopakit-resolver sopakitsShown result');
      // console.log(result);
      return result;
    }).only(ACCESS_ALL),
  },
  Mutation: {
    createSopakit: makeResolver(async (obj, args, context, info) => {
      const { input } = args;
      await db.createSopakit(input);
      return { success: true };
    }).only(ACCESS_ADMIN),
    updateSopakit: makeResolver(async (obj, args, context, info) => {
      const { id, input } = args;
      await db.updateSopakit(id, input);
      return { success: true };
    }).only(ACCESS_ADMIN),
    removeSopakit: makeResolver(async (obj, args, context, info) => {
      const { id } = args;
      await db.removeSopakit(id);
      return { success: true };
    }).only(ACCESS_ADMIN),
  },
};
