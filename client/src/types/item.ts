export interface Item {
  id: string;
  name: string;
  code: string;
  category: 'Elektronik' | 'Pakaian' | 'Makanan';
  stock: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateItemRequest {
  name: string;
  code: string;
  category: 'Elektronik' | 'Pakaian' | 'Makanan';
  stock: number;
  price: number;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {
  id: string;
}

export const CATEGORIES = ['Elektronik', 'Pakaian', 'Makanan'] as const;


