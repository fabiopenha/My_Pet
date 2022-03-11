const router = require('express').Router()

//controller
const PetController = require('../controllers/PetController')

// middleware
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image_upload')

router.post(
    '/create',
    verifyToken,
    imageUpload.array('images'),
    PetController.create
    )

router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)
router.delete('/:id',verifyToken, PetController.removePetById)
router.patch(
    '/edit/:id',
    verifyToken, 
    imageUpload.array('images'), 
    PetController.updatePet
)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router