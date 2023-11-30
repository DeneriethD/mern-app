import express from 'express';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/users')
  .get(userCtrl.list) // obtener el listado de usuarios
  .post(userCtrl.create);

  router.route('/api/users/defaultphoto')
  .get(userCtrl.defaulPhoto)

  router.route('/api/users/follow')
  .put(authCtrl.requireSignin,
    userCtrl.addFollowing,
    userCtrl.addFollowers)

    router.route('api/users/unfollow')
    .put(authCtrl.requireSignin,
      userCtrl.removeFollowing,
      userCtrl.removeFollowers)

router.route('/api/users/:userId') // para eliminar, crear y editar un usuario es esta rut
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

 

router.param('userId', userCtrl.userById); // a todas las rutas que tiene user id lo busca y se encarga de autenticar

export default router;
