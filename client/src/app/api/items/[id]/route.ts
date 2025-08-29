// src/app/api/items/[id]/route.ts
import { 
  findItemById, 
  updateItem, 
  deleteItem 
} from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';
import { validateItemData } from '@/lib/validation';
import { ApiResponse } from '@/types/api';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 });
    }

    const { id } = await params;
    const item = findItemById(id);
    
    if (!item) {
      return Response.json({
        success: false,
        message: 'Barang tidak ditemukan'
      } as ApiResponse, { status: 404 });
    }

    return Response.json({
      success: true,
      data: item
    } as ApiResponse);

  } catch (error) {
    console.error('Get item error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 });
    }

    const updates = await request.json();

    // Validate updates if they include core item fields
    if (updates.name || updates.code || updates.category || 
        updates.stock !== undefined || updates.price !== undefined) {
      
      // Get current item to merge with updates for validation
      const { id } = await params;
      const currentItem = findItemById(id);
      if (!currentItem) {
        return Response.json({
          success: false,
          message: 'Barang tidak ditemukan'
        } as ApiResponse, { status: 404 });
      }

      const dataToValidate = {
        name: updates.name || currentItem.name,
        code: updates.code || currentItem.code,
        category: updates.category || currentItem.category,
        stock: updates.stock !== undefined ? updates.stock : currentItem.stock,
        price: updates.price !== undefined ? updates.price : currentItem.price,
      };

      const validationErrors = validateItemData(dataToValidate);
      if (validationErrors.length > 0) {
        return Response.json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors.map(e => e.message)
        } as ApiResponse, { status: 400 });
      }
    }

    // Update item
    const { id } = await params;
    const updatedItem = updateItem(id, updates);

    return Response.json({
      success: true,
      data: updatedItem,
      message: 'Barang berhasil diupdate'
    } as ApiResponse);

  } catch (error) {
    console.error('Update item error:', error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    } as ApiResponse, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate request
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json({
        success: false,
        message: 'Unauthorized'
      } as ApiResponse, { status: 401 });
    }

    // Delete item (will check stock > 0 constraint)
    const { id } = await params;
    deleteItem(id);

    return Response.json({
      success: true,
      message: 'Barang berhasil dihapus'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete item error:', error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    } as ApiResponse, { status: 500 });
  }
}