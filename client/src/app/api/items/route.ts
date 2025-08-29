// src/app/api/items/route.ts
import { 
  getAllItems, 
  createItem, 
  findItemByCode 
} from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { validateItemData } from '@/lib/validation';
import { CreateItemRequest } from '@/types/item';
import { ApiResponse } from '@/types/api';


export async function GET(request: Request) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 });
    }

    const items = getAllItems();
    
    return Response.json({
      success: true,
      data: items
    } as ApiResponse);

  } catch (error) {
    console.error('Get items error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 });
    }

    const itemData: CreateItemRequest = await request.json();

    // Validate item data
    const validationErrors = validateItemData(itemData);
    if (validationErrors.length > 0) {
      return Response.json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors.map(e => e.message)
      } as ApiResponse, { status: 400 });
    }

    // Check for duplicate code
    const existingItem = findItemByCode(itemData.code);
    if (existingItem) {
      return Response.json({
        success: false,
        message: 'Kode barang sudah ada'
      } as ApiResponse, { status: 400 });
    }

    // Create item
    const newItem = createItem(itemData);

    return Response.json({
      success: true,
      data: newItem,
      message: 'Barang berhasil ditambahkan'
    } as ApiResponse, { status: 201 });

  } catch (error) {
    console.error('Create item error:', error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    } as ApiResponse, { status: 500 });
  }
}

