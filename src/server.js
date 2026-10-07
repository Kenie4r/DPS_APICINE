require('dotenv').config(); 


const express = require('express'); 
const cors  = require('cors'); 
const peliculasRoutes = require('./routes/peliculas.route.js')
const reservasRoutes = require('./routes/reservas.route.js')

const app = express(); 

app.use(cors()); 
app.use(express.json()); 
app.use(peliculasRoutes)
app.use(reservasRoutes)

const port = Number(process.env.PORT || 3000);



app.get('/', (req, res)=> { 
    res.json({ 
        message : 'API FUNCIONANDO'
    })
})




app.listen(port, () => {
  console.log(`API funcionando en el puerto ${port}`);
});
