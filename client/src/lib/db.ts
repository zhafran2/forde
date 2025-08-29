import fs from 'fs';
import path from 'path';
import { Item } from '@/types/item';
import { generateId } from '@/lib/utils';

const DB_PATH = path.join(process.cwd(), 'data', 'items.json');

function ensureDataDir() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function getAllItems(): Item[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const items = JSON.parse(data);
    return items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }));
  } catch (error) {
    console.error('Error reading items:', error);
    return [];
  }
}

export function saveItems(items: Item[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2));
  } catch (error) {
    console.error('Error saving items:', error);
    throw new Error('Failed to save items');
  }
}

export function findItemById(id: string): Item | undefined {
  const items = getAllItems();
  return items.find(item => item.id === id);
}

export function findItemByCode(code: string): Item | undefined {
  const items = getAllItems();
  return items.find(item => item.code === code);
}

export function createItem(itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item {
  const items = getAllItems();
  if (findItemByCode(itemData.code)) {
    throw new Error('Kode barang sudah ada');
  }
  const newItem: Item = {
    ...itemData,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  items.push(newItem);
  saveItems(items);
  return newItem;
}

export function updateItem(id: string, updates: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>): Item {
  const items = getAllItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error('Barang tidak ditemukan');
  }
  if (updates.code && updates.code !== items[index].code) {
    const existingItem = findItemByCode(updates.code);
    if (existingItem && existingItem.id !== id) {
      throw new Error('Kode barang sudah ada');
    }
  }
  const updatedItem: Item = {
    ...items[index],
    ...updates,
    updatedAt: new Date()
  };
  items[index] = updatedItem;
  saveItems(items);
  return updatedItem;
}

export function deleteItem(id: string): void {
  const items = getAllItems();
  const item = findItemById(id);
  if (!item) {
    throw new Error('Barang tidak ditemukan');
  }
  if (item.stock > 0) {
    throw new Error('Tidak bisa menghapus barang dengan stok > 0');
  }
  const filteredItems = items.filter(item => item.id !== id);
  saveItems(filteredItems);
}


