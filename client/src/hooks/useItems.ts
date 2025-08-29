import { useCallback, useEffect, useState } from 'react';
import { Item, CreateItemRequest, UpdateItemRequest } from '@/types/item';
import { ApiResponse } from '@/types/api';

type ItemsState = {
  loading: boolean;
  error: string | null;
  items: Item[];
};

export function useItems(authHeader: Record<string, string>) {
  const [state, setState] = useState<ItemsState>({ loading: false, error: null, items: [] });

  const fetchItems = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/items', { headers: { ...authHeader } });
      const data: ApiResponse<Item[]> = await res.json();
      if (!res.ok || !data.success || !Array.isArray(data.data)) {
        throw new Error(data.message || 'Gagal memuat data');
      }
      setState({ loading: false, error: null, items: data.data });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Gagal memuat data';
      setState(s => ({ ...s, loading: false, error: message }));
    }
  }, [authHeader]);

  useEffect(() => {
    if (authHeader.Authorization) {
      fetchItems();
    }
  }, [authHeader, fetchItems]);

  const createItem = useCallback(async (payload: CreateItemRequest) => {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(payload),
    });
    const data: ApiResponse<Item> = await res.json();
    if (!res.ok || !data.success || !data.data) {
      const firstError = Array.isArray(data.errors) && data.errors.length > 0 ? data.errors[0] : undefined;
      throw new Error(firstError || data.message || 'Gagal menambah barang');
    }
    await fetchItems();
    return data.data;
  }, [authHeader, fetchItems]);

  const updateItem = useCallback(async (id: string, updates: Partial<UpdateItemRequest>) => {
    const res = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(updates),
    });
    const data: ApiResponse<Item> = await res.json();
    if (!res.ok || !data.success || !data.data) {
      const firstError = Array.isArray(data.errors) && data.errors.length > 0 ? data.errors[0] : undefined;
      throw new Error(firstError || data.message || 'Gagal mengupdate barang');
    }
    await fetchItems();
    return data.data;
  }, [authHeader, fetchItems]);

  const deleteItem = useCallback(async (id: string) => {
    const res = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader },
    });
    const data: ApiResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Gagal menghapus barang');
    }
    await fetchItems();
    return true;
  }, [authHeader, fetchItems]);

  return { ...state, fetchItems, createItem, updateItem, deleteItem };
}


