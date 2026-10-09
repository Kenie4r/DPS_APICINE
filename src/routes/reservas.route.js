const { Router } = require('express');
const router = Router();

const controladorReservas = require('../controllers/reservas.controller');

const estaVacio = valor =>
    valor == null ||
    (typeof valor === 'string' && valor.trim() === '');

const esNumero = valor =>
    (typeof valor === 'number' || typeof valor === 'string') &&
    !estaVacio(valor) &&
    Number.isFinite(Number(valor));

const validarReserva = (req, res, next) => {
    const validaciones = {};
    const reserva = req.body ?? {};

    const camposTexto = [
        'numero_reserva',
        'codigo_qr',
        'nombre_cliente',
        'documento',
        'funcion'
    ];

    camposTexto.forEach(campo => {
        if (estaVacio(reserva[campo])) {
            validaciones[campo] = `El campo ${campo} es obligatorio`;
        } else if (typeof reserva[campo] !== 'string') {
            validaciones[campo] = `El campo ${campo} debe ser texto`;
        }
    });

    const camposEnteros = [
        'usuario_id',
        'pelicula_id',
        'cantidad'
    ];

    camposEnteros.forEach(campo => {
        if (estaVacio(reserva[campo])) {
            validaciones[campo] = `El campo ${campo} es obligatorio`;
        } else if (
            !esNumero(reserva[campo]) ||
            !Number.isSafeInteger(Number(reserva[campo])) ||
            Number(reserva[campo]) <= 0
        ) {
            validaciones[campo] =
                `El campo ${campo} debe ser un entero positivo`;
        }
    });

    if (estaVacio(reserva.total)) {
        validaciones.total = 'El total es obligatorio';
    } else if (!esNumero(reserva.total) || Number(reserva.total) <= 0) {
        validaciones.total = 'El total debe ser un número mayor a 0';
    }

    if (
        reserva.utilizado != null &&
        ![0, 1, '0', '1', true, false].includes(reserva.utilizado)
    ) {
        validaciones.utilizado = 'Utilizado debe ser 0 o 1';
    }

    if (Object.keys(validaciones).length > 0) {
        return res.status(400).json(validaciones);
    }

    return next();
};

const validarId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'El id debe ser un entero positivo'
        });
    }

    return next();
};

router.get('/reservas', (req, res) => {
    return controladorReservas.listarReservas(req, res);
});

router.get('/reservas/:id', validarId, (req, res) => {
    return controladorReservas.buscarReserva(req, res);
});

router.get('/reservas/pelicula/:id', validarId, (req, res) => {
    return controladorReservas.buscarReservaPelicula(req, res);
});

router.post('/reservas', validarReserva, (req, res) => {
    return controladorReservas.agregarReserva(req, res);
});

// PUT requiere todos los campos obligatorios.
router.put('/reservas/:id', validarId, validarReserva, (req, res) => {
    return controladorReservas.actualizarReserva(req, res);
});

router.delete('/reservas/:id', validarId, (req, res) => {
    return controladorReservas.eliminarReserva(req, res);
});

module.exports = router;