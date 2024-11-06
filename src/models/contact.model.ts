import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const contactSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
  isFavorite: z.boolean()
});

export type Contact = z.infer<typeof contactSchema>;

const createContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url().optional()
});

export type CreateContact = z.infer<typeof createContactSchema>;

export class ContactModel {
  private static async readData(): Promise<{ contacts: Contact[] }> {
    const data = await fs.readFile(path.join(__dirname, '../data/contacts.json'), 'utf-8');
    return JSON.parse(data);
  }

  private static async writeData(data: { contacts: Contact[] }): Promise<void> {
    await fs.writeFile(
      path.join(__dirname, '../data/contacts.json'),
      JSON.stringify(data, null, 2)
    );
  }

  static async getAll(search?: string): Promise<Contact[]> {
    const { contacts } = await this.readData();
    if (!search) return contacts;
    
    return contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(search.toLowerCase())
    );
  }

  static async getFavorites(): Promise<Contact[]> {
    const { contacts } = await this.readData();
    return contacts.filter(contact => contact.isFavorite);
  }

  static async getById(id: string): Promise<Contact | undefined> {
    const { contacts } = await this.readData();
    return contacts.find(contact => contact.id === id);
  }

  static async create(contact: CreateContact): Promise<Contact> {
    const { contacts } = await this.readData();
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      isFavorite: false,
    };
    
    contacts.push(newContact);
    await this.writeData({ contacts });
    return newContact;
  }

  static async update(id: string, contact: CreateContact): Promise<Contact | undefined> {
    const { contacts } = await this.readData();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const updatedContact = {
      ...contacts[index],
      ...contact
    };
    
    contacts[index] = updatedContact;
    await this.writeData({ contacts });
    return updatedContact;
  }

  static async toggleFavorite(id: string): Promise<Contact | undefined> {
    const { contacts } = await this.readData();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    contacts[index].isFavorite = !contacts[index].isFavorite;
    await this.writeData({ contacts });
    return contacts[index];
  }

  static async delete(id: string): Promise<boolean> {
    const { contacts } = await this.readData();
    const filteredContacts = contacts.filter(c => c.id !== id);
    await this.writeData({ contacts: filteredContacts });
    return true;
  }
}