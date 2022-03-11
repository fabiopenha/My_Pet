const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

  //create a pet
  static async create(req, res) {
    const { name, age, weight, color } = req.body

    const images = req.files

    const available = true

    // image upload

    // Validation
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' })
      return
    }

    if (!age) {
      res.status(422).json({ message: 'A idade é obrigatória!' })
      return
    }

    if (!weight) {
      res.status(422).json({ message: 'O peso é obrigatório!' })
      return
    }

    if (!color) {
      res.status(422).json({ message: 'A cor é obrigatória!' })
      return
    }

    if (images.length === 0) {
      res.status(422).json({ message: 'A imagem é obrigatória!' })
      return
    }

    // get pet owner
    const token = getToken(req)
    const user = await getUserByToken(token)

    // create pet
    const pet = new Pet({
      name: name,
      age: age,
      weight: weight,
      color: color,
      available: available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    })

    images.map((images) => {
      pet.images.push(images.filename)
    })

    try {
      const newPet = await pet.save()

      res.status(201).json({
        message: 'Pet cadastrado com sucesso!',
        newPet,
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }

  static async getAll(req, res) {

    const pets = await Pet.find().sort('-createAt')

    res.status(200).json({
      pets: pets,
    })

  }

  static async getAllUserPets(req, res) {

    // get user from token
    const token = getToken(req)
    const user = await getUserByToken(token)

    const pets = await Pet.find({ 'user._id': user._id }).sort('-createAt')

    res.status(200).json({
      pets,
    })
  }

  static async getAllUserAdoptions(req, res) {
    // get user from token
    const token = getToken(req)
    const user = await getUserByToken(token)

    const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createAt')

    res.status(200).json({
      pets,
    })
  }

  static async getPetById(req, res) {

    const id = req.params.id

    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido!' })
      return
    }
    // check if pet exists
    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }

    res.status(200).json({
      pet: pet,
    })

  }

  static async removePetById(req, res) {

    const id = req.params.id


    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido!' })
      return
    }

    // check if pet exists
    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }

    // check if logged in user registered the pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString() !== user._id.toString()) {
      if (pet.user._id.toString() !== user._id) {
        res.status(422).json({
          message: 'Houve um problema ao processar a sua solicitação, tente novamente mais tarde!'
        })
        return
      }
    }

    await Pet.findByIdAndRemove(id)

    res.status(200).json({
      message: 'Pet removido com sucesso!',
    })
  }

  static async updatePet(req, res) {
    const id = req.params.id

    const { name, age, weight, color, available } = req.body

    const images = req.files

    const updatedData = {}

    // check if pet exists
    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }

    // check if logged in user registered the pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString() !== user._id.toString()) {
      if (pet.user._id.toString() !== user._id) {
        res.status(422).json({
          message: 'Houve um problema ao processar a sua solicitação, tente novamente mais tarde!'
        })
        return
      }
    }

      // Validation
       if (!name) {
        res.status(422).json({ message: 'O nome é obrigatório!' })
        return
      } else {
        updatedData.name = name
      }

      if (!age) {
        res.status(422).json({ message: 'A idade é obrigatória!' })
        return
      } else {
        updatedData.age = age
      }

      if (!weight) {
        res.status(422).json({ message: 'O peso é obrigatório!' })
        return
      } else {
        updatedData.weight = weight
      }

      if (!color) {
        res.status(422).json({ message: 'A cor é obrigatória!' })
        return
      } else {
        updatedData.color = color
      }

      if (images.length > 0) {
        updatedData.images = []
        images.map((image) => updatedData.images.push(image.filename))
      }

      await Pet.findByIdAndUpdate(id, updatedData)
      res.status(200).json({ message: 'Pet atualizado com sucesso!' })
   
  }

  static async schedule(req, res) {
    const id = req.params.id

    // check if pet exists
    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }

    // check if logged in user registered the pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.equals(user._id)) {
        res.status(422).json({
          message: 'Você não pode agendar uma visita com o seu próprio pet!'
        })
        return
    }

    // check if user has already scheduled a visit
    if(pet.adopter) {
      if(pet.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: 'Você já agendou uma visita para este pet!'
        })
        return
      }
    }
    
    // add user to pet
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image
    }

    await Pet.findByIdAndUpdate(id, pet)

    res.status(200).json({
      message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
    })
  }

  static async concludeAdoption(req, res) {
    const id = req.params.id

    // check if pet exists
    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }

    // check if logged in user registered the pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.toString() !== user._id.toString()) {
      if (pet.user._id.toString() !== user._id) {
        res.status(422).json({
          message: 'Houve um problema ao processar a sua solicitação, tente novamente mais tarde!'
        })
        return
      }
    }

    pet.available = false

    await Pet.findByIdAndUpdate(id, pet)

    res.status(200).json({message: 'Parabéns! O ciclo de adoção foi finaizado com sucesso.'})
  }

}