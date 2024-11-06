import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import { ContactController } from './controllers/contacts.controller';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Routes
app.get('/', ContactController.index);
app.get('/favorites', ContactController.favorites);
app.get('/new', ContactController.new);
app.post('/contacts', ContactController.create);
app.get('/contacts/:id', ContactController.edit);
app.put('/contacts/:id', ContactController.update);
app.delete('/contacts/:id', ContactController.delete);
app.post('/contacts/:id/toggle-favorite', ContactController.toggleFavorite);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});