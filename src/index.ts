import server from './server';
import colors from 'colors';

// Esta variable de entorno se inyecta en automatico al hacer el deployment
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(colors.bgCyan(`VALKYRIE running on port ${port}`))
})

