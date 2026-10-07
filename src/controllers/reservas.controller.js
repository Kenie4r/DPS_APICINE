const pool = require('../config');

const camposReserva = [
    'numero_reserva',
    'codigo_qr',
    'usuario_id',
    'pelicula_id',
    'nombre_cliente',
    'documento',
    'funcion',
    'cantidad',
    'total',
    'utilizado'
];

const obtenerValores = reserva =>
    camposReserva.map(campo => {
        if (campo === 'utilizado') {
            return Number(reserva.utilizado ?? 0);
        }

        if (campo === 'funcion') {
            return JSON.stringify(reserva.funcion);
        }

        return reserva[campo];
    });

const responderError = (res, error, message) => {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Ya existe una reserva con esos datos únicos'
        });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            message: 'El usuario o la película indicados no existen'
        });
    }

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
            message: 'La reserva tiene registros asociados y no puede eliminarse'
        });
    }

    return res.status(500).json({
        message,
        error: error.message
    });
};

const controladorReservas = {
    listarReservas: async (req, res) => {
        try {
            const [reservas] = await pool.query(
                'SELECT * FROM reservas ORDER BY id'
            );

            return res.json(reservas);
        } catch (error) {
            return responderError(
                res,
                error,
                'No se pudieron obtener las reservas'
            );
        }
    },

    buscarReserva: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const [reservas] = await pool.execute(
                'SELECT * FROM reservas WHERE id = ?',
                [id]
            );

            if (reservas.length === 0) {
                return res.status(404).json({
                    message: 'Reserva no encontrada'
                });
            }

            return res.json(reservas[0]);
        } catch (error) {
            return responderError(
                res,
                error,
                'No se pudo obtener la reserva'
            );
        }
    },

    agregarReserva: async (req, res) => {
        try {
            const reserva = req.body;

            const query = `
                INSERT INTO reservas (
                    numero_reserva,
                    codigo_qr,
                    usuario_id,
                    pelicula_id,
                    nombre_cliente,
                    documento,
                    funcion,
                    cantidad,
                    total,
                    utilizado,
                    fecha_compra
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;

            const [resultado] = await pool.execute(
                query,
                obtenerValores(reserva)
            );

            return res.status(201).json({
                message: 'Reserva agregada correctamente',
                id: resultado.insertId
            });
        } catch (error) {
            return responderError(
                res,
                error,
                'No se pudo agregar la reserva'
            );
        }
    },

    actualizarReserva: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const reserva = req.body;

            const query = `
                UPDATE reservas
                SET numero_reserva = ?,
                    codigo_qr = ?,
                    usuario_id = ?,
                    pelicula_id = ?,
                    nombre_cliente = ?,
                    documento = ?,
                    funcion = ?,
                    cantidad = ?,
                    total = ?,
                    utilizado = COALESCE(?, utilizado)
                WHERE id = ?
            `;

            const valores = obtenerValores(reserva);

            // Si no se envía utilizado, conserva su valor actual.
            valores[camposReserva.indexOf('utilizado')] =
                reserva.utilizado == null
                    ? null
                    : Number(reserva.utilizado);

            const [resultado] = await pool.execute(
                query,
                [...valores, id]
            );

            // Algunos ajustes de MySQL reportan 0 si nada cambió.
            if (resultado.affectedRows === 0) {
                const [reservas] = await pool.execute(
                    'SELECT id FROM reservas WHERE id = ?',
                    [id]
                );

                if (reservas.length === 0) {
                    return res.status(404).json({
                        message: 'Reserva no encontrada'
                    });
                }
            }

            return res.json({
                message: 'Reserva actualizada correctamente',
                id
            });
        } catch (error) {
            return responderError(
                res,
                error,
                'No se pudo actualizar la reserva'
            );
        }
    },

    eliminarReserva: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const [resultado] = await pool.execute(
                'DELETE FROM reservas WHERE id = ?',
                [id]
            );

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Reserva no encontrada'
                });
            }

            return res.json({
                message: 'Reserva eliminada correctamente'
            });
        } catch (error) {
            return responderError(
                res,
                error,
                'No se pudo eliminar la reserva'
            );
        }
    }
};

module.exports = controladorReservas;