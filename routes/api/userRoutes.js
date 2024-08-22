const router = require('express').Router();

router.route('/').get().post()

router.route('/:userId').get().put().delete()

router.route('/:userId/friends/:friendId').post().delete()


module.exports = router;