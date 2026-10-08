const pool = require('../config');

const controladorCategorias = {
    listarCategoria: async (req, res) => {
        try {
            const [categorias] = await pool.query(
                'SELECT * FROM CATEGORIAS ORDER BY id'
            );

            return res.json(categorias);
        } catch (error) {
            return res.status(500).json({
                message: 'No se pudieron obtener las Categorias',
                error: error.message
            });
        }
    },

   
};

module.exports = controladorCategorias;