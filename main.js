const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
//abrir conexion a postgres
const config = {
  user: "edwindbm3_user",
  database: "edwindbm3",
  password: "sLdr4n8tI1BNIKVKWVD4xmulHqAKGIFH",
  host: "dpg-cf0deukgqg45vesiea80-a.oregon-postgres.render.com",
  port: 5432,
  ssl: true
}
//generamos un cliente de la db
const cliente = new pg.Pool(config);

// Modelo
class UsuarioModel {
  constructor() {
    this.status = [];
  }

  async getUsuario(){
    const res = await cliente.query("select * from usuarios");
    console.log(res);
    return res.rows;
  }

  async getEdadPromedio(){
    const res = await cliente.query("SELECT AVG(edad) AS promedioEdad FROM usuarios");
    console.log(res);
    return res.rows;
  }
  getStatus(){
    const datos = {
      nameSystem: "api-users",
      version: "0.0.1", 
      develores: "Edwin Agular Verduguez",
      email: "edwintec2014@gmail.com",
      celular:"75533380"
    };
    this.status.push(datos);
    return this.status;
  }

  async addUsuario(datos) { 
    console.log('addUsuario UsuarioModel...')
    //const query = "INSERT INTO todos(task) VALUES($1) RETURNING";
      const query = "INSERT INTO usuarios (nombrecompleto, edad) VALUES ($1, $2)";
      const values = [datos.nombrecompleto, datos.edad]
      const res = await cliente.query(query, values)
      return res;

  }

}

// Controlador
class UsuarioController {
  constructor(model) {
    this.model = model;
  }

  async getUsuarios() {
    return await this.model.getUsuario();
  }

  async getEdadPromedio() {
    return await this.model.getEdadPromedio();
  }

  gestStatus(){
    return this.model.getStatus();
  }

  async addUsuario(datos) {
    console.log('addUsuario UsuarioController...')
    await this.model.addUsuario(datos);
  }

}

// Vistas (Rutas)
const app = express();
const usuarioModel = new UsuarioModel();
const usuarioController = new UsuarioController(usuarioModel);

app.use(bodyParser.json());

app.get("/usuarios", async (req, res) => {
  //console.log(await todoController.getTodos());
  const response = await usuarioController.getUsuarios()
  res.json(response)
});

// Vistas (Rutas) (continuación)

app.post("/usuario", (req, res) => {
  console.log('post usuario...')
  const datos = req.body;
  console.log(datos)
  usuarioController.addUsuario(datos);
  res.sendStatus(200);
});

app.get("/usuarios/promedio-edad", async (req, res) => {
  //console.log(await todoController.getTodos());
  const response = await usuarioController.getEdadPromedio()
  res.json(response)
});
app.get("/status", (req, res) => {
  console.log('get status...')
  const response = usuarioController.gestStatus()
  console.log(response)
  res.json(response)
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
