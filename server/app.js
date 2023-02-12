import express from "express";
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import routes from "./routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from "./database.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express();
const port = 3000;
connect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);
app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars'); 
app.set('views', './views');

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`)
});