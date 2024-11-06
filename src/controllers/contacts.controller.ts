import { Request, Response } from 'express';
import { ContactModel, type CreateContact } from '../models/contact.model';

export class ContactController {
  static async index(req: Request, res: Response) {
    const search = req.query.search as string | undefined;
    const contacts = await ContactModel.getAll(search);
    res.render('contacts/index', { contacts, search });
  }

  static async favorites(req: Request, res: Response) {
    const contacts = await ContactModel.getFavorites();
    res.render('contacts/favorites', { contacts });
  }

  static async new(req: Request, res: Response) {
    res.render('contacts/new');
  }

  static async create(req: Request, res: Response) {
    try {
      await ContactModel.create(req.body as CreateContact);
      res.redirect('/');
    } catch (error) {
      res.render('contacts/new', { error: 'Invalid contact data', data: req.body });
    }
  }

  static async edit(req: Request, res: Response) {
    const contact = await ContactModel.getById(req.params.id);
    if (!contact) return res.redirect('/');
    res.render('contacts/edit', { contact });
  }

  static async update(req: Request, res: Response) {
    try {
      await ContactModel.update(req.params.id, req.body as CreateContact);
      res.redirect('/');
    } catch (error) {
      const contact = await ContactModel.getById(req.params.id);
      res.render('contacts/edit', { error: 'Invalid contact data', contact });
    }
  }

  static async toggleFavorite(req: Request, res: Response) {
    await ContactModel.toggleFavorite(req.params.id);
    res.redirect(req.headers.referer || '/');
  }

  static async delete(req: Request, res: Response) {
    await ContactModel.delete(req.params.id);
    res.redirect('/');
  }
}