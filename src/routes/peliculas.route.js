const { Router } = require('express');
const router = Router();
const controladorPeliculas = require('../controllers/peliculas.controller') 

/*{
    "id": 1,
    "codigo_pelicula": "TERR001",
    "nombre": "TERRIFIER 3",
    "genero_id": 1,
    "duracion": 2.5,
    "clasificacion": "18+",
    "sala": "2",
    "precio": 5.44,
    "estado": "ACTIVO",
    "url_image": "https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2024/08/terrifier_three_ver2_xxlg.jpg"
  }*/


router.get('/peliculas', (req, res)=> { 
    controladorPeliculas.listarPeliculas(req, res);
})

router.post('/peliculas', (req, res, next )=> { 
    const validaciones = {};
    const pelicula = req.body ?? {};

    const estaVacio = valor =>
    valor == null ||
    (typeof valor === 'string' && valor.trim() === '');

    const esNumero = valor =>
    (typeof valor === 'number' || typeof valor === 'string') &&
    !estaVacio(valor) &&
    Number.isFinite(Number(valor));

    if (estaVacio(pelicula.codigo_pelicula)) {
    validaciones.codigo_pelicula = 'El código de la película es obligatorio';
    }

    if (estaVacio(pelicula.precio)) {
        validaciones.precio = 'El precio es obligatorio';
    } else if (!esNumero(pelicula.precio) || Number(pelicula.precio) <= 0) {
        validaciones.precio = 'El precio debe ser un número mayor a 0';
    }

    if (estaVacio(pelicula.genero_id)) {
        validaciones.genero_id = 'El género es obligatorio';
    } else if ( !esNumero(pelicula.genero_id) || !Number.isSafeInteger(Number(pelicula.genero_id)) || Number(pelicula.genero_id) <= 0) {
        validaciones.genero_id = 'El género debe ser un id entero positivo';
    }

    if (estaVacio(pelicula.duracion)) {
        validaciones.duracion = 'La duración es obligatoria';
    } else if ( !esNumero(pelicula.duracion) || Number(pelicula.duracion) <= 0) {
        validaciones.duracion = 'La duración debe ser un número mayor a 0';
    }

    if (Object.keys(validaciones).length > 0) {
        return res.status(400).json(validaciones);
    }

    //se envia a la base de datos a 
    controladorPeliculas.agregarPelicula(req, res);
}); 


router.put('/peliculas/:id', (req, res)=> { 
    const validaciones = {};
    const pelicula = req.body ?? {};

    const estaVacio = valor =>
    valor == null ||
    (typeof valor === 'string' && valor.trim() === '');

    const esNumero = valor =>
    (typeof valor === 'number' || typeof valor === 'string') &&
    !estaVacio(valor) &&
    Number.isFinite(Number(valor));

    if(Number(pelicula.id)<=0)
        validaciones.id = 'El id de la película es obligatorio';    
    if (estaVacio(pelicula.codigo_pelicula)) {
    validaciones.codigo_pelicula = 'El código de la película es obligatorio';
    }

    if (estaVacio(pelicula.precio)) {
        validaciones.precio = 'El precio es obligatorio';
    } else if (!esNumero(pelicula.precio) || Number(pelicula.precio) <= 0) {
        validaciones.precio = 'El precio debe ser un número mayor a 0';
    }

    if (estaVacio(pelicula.genero_id)) {
        validaciones.genero_id = 'El género es obligatorio';
    } else if ( !esNumero(pelicula.genero_id) || !Number.isSafeInteger(Number(pelicula.genero_id)) || Number(pelicula.genero_id) <= 0) {
        validaciones.genero_id = 'El género debe ser un id entero positivo';
    }

    if (estaVacio(pelicula.duracion)) {
        validaciones.duracion = 'La duración es obligatoria';
    } else if ( !esNumero(pelicula.duracion) || Number(pelicula.duracion) <= 0) {
        validaciones.duracion = 'La duración debe ser un número mayor a 0';
    }

    if (Object.keys(validaciones).length > 0) {
        return res.status(400).json(validaciones);
    }

    //se envia a la base de datos a 
    controladorPeliculas.actualizarPelicula(req, res);
}); 

router.get('/peliculas/:id', (req,res)=>{
    controladorPeliculas.buscarPelicula(req,res); 
})
module.exports = router;