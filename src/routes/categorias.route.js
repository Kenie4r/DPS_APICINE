const { Router } = require('express');
const router = Router();
const controladorCategoria = require('../controllers/categoria.controller') 


router.get('/categoria', (req, res)=> { 
    controladorCategoria.listarCategoria(req, res);
})

module.exports = router;