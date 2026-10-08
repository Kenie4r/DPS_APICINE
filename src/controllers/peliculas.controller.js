const pool = require('../config');

const controladorPeliculas = {
    listarPeliculas: async (req, res) => {
        try {
            const [peliculas] = await pool.query(
                'SELECT * FROM peliculas ORDER BY id'
            );

            return res.json(peliculas);
        } catch (error) {
            return res.status(500).json({
                message: 'No se pudieron obtener las películas',
                error: error.message
            });
        }
    },

    agregarPelicula: async (req, res) => {
        try {
            const pelicula = req.body;

            const camposRequeridos = [
                //'id',
                'codigo_pelicula',
                'nombre',
                'genero_id',
                'duracion',
                'clasificacion',
                'sala',
                'precio',
                'url_image'
            ];



            const query = `
                INSERT INTO peliculas (
                    codigo_pelicula,
                    nombre,
                    genero_id,
                    duracion,
                    clasificacion,
                    sala,
                    precio,
                    url_image
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valores = camposRequeridos.map(
                campo => pelicula[campo]
            );

            const [resultado] = await pool.execute(query, valores);

            return res.status(201).json({
                message: 'Película agregada correctamente',
                pelicula: {
                    //id: resultado.insertId,
                    ...Object.fromEntries(
                        camposRequeridos.map(campo => [
                            campo,
                            pelicula[campo]
                        ])
                    )
                }
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Ya existe una película con esos datos únicos'
                });
            }

            return res.status(500).json({
                message: 'No se pudo agregar la película',
                error: error.message
            });
        }
    },

    buscarPelicula: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'El id debe ser un entero positivo'
                });
            }

            const [peliculas] = await pool.execute(
                'SELECT * FROM peliculas WHERE id = ?',
                [id]
            );

            if (peliculas.length === 0) {
                return res.status(404).json({
                    message: 'Película no encontrada'
                });
            }

            return res.json(peliculas[0]);
        } catch (error) {
            return res.status(500).json({
                message: 'No se pudo obtener la película',
                error: error.message
            });
        }
    },
    actualizarPelicula: async (req, res) => {
        try {
            const pelicula = req.body;

            const camposRequeridos = [
                'codigo_pelicula',
                'nombre',
                'genero_id',
                'duracion',
                'clasificacion',
                'sala',
                'precio',
                'url_image',
                'id'
            ];



            const query = `
                UPDATE  peliculas 
                SET codigo_pelicula = ? ,
                    nombre = ? ,
                    genero_id = ? ,
                    duracion = ? ,
                    clasificacion = ? ,
                    sala = ? ,
                    precio = ? ,
                    url_image = ? 
                
                WHERE id = ?
            `;

            const valores = camposRequeridos.map(
                campo => pelicula[campo]
            );

            const [resultado] = await pool.execute(query, valores);

            return res.status(201).json({
                message: 'Película actualizada correctamente',
                pelicula: {
                    //id: resultado.insertId,
                    ...Object.fromEntries(
                        camposRequeridos.map(campo => [
                            campo,
                            pelicula[campo]
                        ])
                    )
                }
            });
        } catch (error) {

            return res.status(500).json({
                message: 'No se pudo actualizar la película',
                error: error.message
            });
        }
    },


};

module.exports = controladorPeliculas;