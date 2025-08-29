import { CreateItemRequest } from '@/types/item';

export type ValidationError = {
  field: string;
  message: string;
};

export function validateItemData(data: CreateItemRequest): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'Nama barang wajib diisi minimal 3 karakter' });
  }

  if (!data.code || !isAlphanumeric(data.code)) {
    errors.push({ field: 'code', message: 'Kode barang wajib alfanumerik (contoh: BRG001)' });
  }

  const validCategories = ['Elektronik', 'Pakaian', 'Makanan'];
  if (!validCategories.includes(data.category)) {
    errors.push({ field: 'category', message: 'Kategori harus salah satu dari: Elektronik, Pakaian, Makanan' });
  }

  if (typeof data.stock !== 'number' || data.stock < 0) {
    errors.push({ field: 'stock', message: 'Stok tidak boleh negatif' });
  }

  if (typeof data.price !== 'number' || data.price <= 0) {
    errors.push({ field: 'price', message: 'Harga wajib angka lebih besar dari 0' });
  }

  return errors;
}

function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

export function validateLoginData(username: string, password: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!username || username.trim().length === 0) {
    errors.push({ field: 'username', message: 'Username wajib diisi' });
  }

  if (!password || password.length === 0) {
    errors.push({ field: 'password', message: 'Password wajib diisi' });
  }

  return errors;
}


