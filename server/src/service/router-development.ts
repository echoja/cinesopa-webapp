import { DBManager } from '@/manager/db';
import { Router } from 'express';
import { UserService } from '@/typedef';
import { graphQLServerMiddleware } from '@/graphql';

export function setDevelopmentRouter({
  router,
  db,
  user,
}: {
  router: Router;
  db: DBManager;
  user: UserService;
}): void {
  if (process.env.NODE_ENV === 'development') {

    router.get('/graphql', graphQLServerMiddleware);

    router.get('/test/remove-user/:email', (req, res, next) => {
      const { email } = req.params;
      db.removeUserByEmail(req.params.email)
        .then(() => {
          res.send(`success deleting ${email}`);
        })
        .catch((error) => {
          // console.error(error);
          res.status(500).send(error);
        });
    });

    router.get('/test/make-super-user', (req, res, next) => {
      user
        .initAdmin()
        .then((/* result */) => {
          res.send('admin create successed!');
        })
        .catch((error) => {
          res.send(error);
        });
    });
  }
}

export default {
  setDevelopmentRouter,
};
