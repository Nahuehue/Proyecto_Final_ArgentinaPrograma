const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { Op } = require("sequelize")
const sequelize = require("./connection/connection") // conexión a la base de datos
const Generos = require("./models/generos")
const Categorias = require('./models/categorias');
const Catalogo = require('./models/catalogo');

const server = express();

// Middlewares
server.use(express.json());

// lista de las categorías
server.get("/categorias", async (req, res) => {
    try {
        const categorias = await Categorias.findAll()
        res.status(200).send(categorias);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// lista del catálogo entero con ruta absoluta del poster 
server.get("/catalogo", async (req, res) => {
    try {
        const catalogo = await Catalogo.findAll();

        // Mapear la ruta relativa del campo 'poster' a rutas absolutas
        const catalogoConRutasAbsolutas = catalogo.map((item) => {
            return {
                id: item.id,
                titulo: item.titulo,
                categoria: item.categoria,
                genero: item.genero,
                resumen: item.resumen,
                temporadas: item.temporadas,
                reparto: item.reparto,
                poster: `http://${process.env.HOST}:${process.env.PORT}/${item.poster}`,
                trailer: item.trailer,
            };
        });

        res.status(200).send(catalogoConRutasAbsolutas);
    } catch (error) {
        console.error("Error al obtener el catálogo:", error);
        res.status(500).send("Error interno del servidor");
    }
});


// lista del catálogo por ID
server.get("/catalogo/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        res.status(400).send("ID de película/serie no válido");
        return;
    }

    try {
        const peli_serie = await Catalogo.findByPk(id);
        if (peli_serie) {
            res.status(200).send(peli_serie);
        } else {
            res.status(404).send("Elemento no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener la película/serie:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// lista del catálogo por nombre o parte de nombre (título)
server.get("/catalogo/nombre/:nombre", async (req, res) => {
    const nombre = req.params.nombre;

    if (!nombre || nombre.trim() === "") {
        res.status(400).send("Nombre de película/serie no válido");
        return;
    }

    try {
        const peli_serie = await Catalogo.findAll({
            where: { titulo: { [Op.substring]: nombre } }
        });

        if (peli_serie.length === 0) {
            res.status(404).send("No se encontraron películas/series con ese nombre.");
        } else {
            res.status(200).send(peli_serie);
        }
    } catch (error) {
        console.error("Error al buscar por nombre:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// lista del catálogo por género o parte de su género
server.get("/catalogo/genero/:genero", async (req, res) => {
    const genero = req.params.genero;

    if (!genero || genero.trim() === "") {
        res.status(400).send("Género no válido");
        return;
    }

    try {
        const peli_serie = await Catalogo.findAll({
            where: { genero: { [Op.substring]: genero } }
        });

        if (peli_serie.length === 0) {
            res.status(404).send("No se encontraron películas/series con ese género.");
        } else {
            res.status(200).send(peli_serie);
        }
    } catch (error) {
        console.error("Error al buscar por género:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// lista del catálogo por categoría o parte de su categoría
server.get("/catalogo/categoria/:categoria", async (req, res) => {
    const categoria = req.params.categoria;

    if (!categoria || categoria.trim() === "") {
        res.status(400).send("Categoría no válida");
        return;
    }

    try {
        const peli_serie = await Catalogo.findAll({
            where: { categoria: { [Op.substring]: categoria } }
        });

        if (peli_serie.length === 0) {
            res.status(404).send("No se encontraron películas/series con esa categoría.");
        } else {
            res.status(200).send(peli_serie);
        }
    } catch (error) {
        console.error("Error al buscar por categoría:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// lista de los géneros (una prueba para ver si me funcionaba géneros)
server.get("/generos", async (req, res) => {
    try {
        const generos = await Generos.findAll()
        res.status(200).send(generos);
    } catch (error) {
        console.error("Error al obtener los géneros:", error);
        res.status(500).send("Error interno del servidor");
    }
});


// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send({ error: `La URL indicada no existe en este servidor` });
});

// Método oyente de solicitudes
sequelize.authenticate().then(() => {
    server.listen(process.env.PORT, process.env.HOST, () => {
        console.log(`El servidor está escuchando en: http://${process.env.HOST}:${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("Hubo un problema con la conexión a la base de datos:", error);
});