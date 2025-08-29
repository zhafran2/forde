"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { CATEGORIES, CreateItemRequest, Item, UpdateItemRequest } from '@/types/item';

export default function Home() {
  const { isAuthenticated, login, logout, loginState, authHeader } = useAuth();
  const { items, loading, error, createItem, updateItem, deleteItem } = useItems(authHeader);
  const [notif, setNotif] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = String(formData.get('username') || '');
    const password = String(formData.get('password') || '');
    const ok = await login(username, password);
    if (!ok) return;
    setNotif('Login berhasil');
    form.reset();
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: CreateItemRequest = {
      name: String(formData.get('name') || ''),
      code: String(formData.get('code') || ''),
      category: String(formData.get('category') || 'Elektronik') as CreateItemRequest['category'],
      stock: Number(formData.get('stock') || 0),
      price: Number(formData.get('price') || 0),
    };
    try {
      await createItem(payload);
      setNotif('Barang berhasil ditambahkan');
      form.reset();
    } catch (e: unknown) {
      const err = e as { message?: string } | Error;
      const msg = err instanceof Error ? err.message : err?.message || 'Gagal menambah barang';
      alert(msg);
    }
  };

  type UpdatableField = keyof Omit<UpdateItemRequest, 'id'>;
  const handleUpdate = async (item: Item, field: UpdatableField, value: string | number) => {
    const updates: Partial<UpdateItemRequest> = { [field]: value } as Partial<UpdateItemRequest>;
    try {
      await updateItem(item.id, updates);
      setNotif('Barang berhasil diupdate');
    } catch (e: unknown) {
      const err = e as { message?: string } | Error;
      const msg = err instanceof Error ? err.message : err?.message || 'Gagal mengupdate barang';
      alert(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus barang ini? (Hanya jika stok = 0)')) return;
    try {
      await deleteItem(id);
      setNotif('Barang berhasil dihapus');
    } catch (e: unknown) {
      const err = e as { message?: string } | Error;
      const msg = err instanceof Error ? err.message : err?.message || 'Gagal menghapus barang';
      alert(msg);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container">
        <h1 className="title">Inventory Barang</h1>
        <section className="card">
          <h2>Login Admin</h2>
          <form onSubmit={handleLogin} className="form-grid">
            <label>
              <span>Username</span>
              <input name="username" type="text" placeholder="admin" required />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" placeholder="admin123" required />
            </label>
            <div className="actions">
              <button type="submit" disabled={loginState.loading}>Login</button>
            </div>
            {loginState.error && <p className="error">{loginState.error}</p>}
          </form>
          <p className="hint">Default: admin / admin123</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">Inventory Barang</h1>
        <button onClick={logout}>Logout</button>
      </header>

      {notif && <div className="notif" onAnimationEnd={() => setNotif(null)}>{notif}</div>}

      <section className="card">
        <h2>Tambah Barang</h2>
        <form onSubmit={handleCreate} className="form-grid">
          <label>
            <span>Nama</span>
            <input name="name" type="text" placeholder="Nama barang" required minLength={3} />
          </label>
          <label>
            <span>Kode</span>
            <input name="code" type="text" placeholder="BRG001" required />
          </label>
          <label>
            <span>Kategori</span>
            <select name="category" defaultValue={CATEGORIES[0]}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <span>Stok</span>
            <input name="stock" type="number" min={0} step={1} defaultValue={0} />
          </label>
          <label>
            <span>Harga</span>
            <input name="price" type="number" min={1} step={1} placeholder="10000" required />
          </label>
          <div className="actions">
            <button type="submit">Simpan</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Daftar Barang</h2>
        {loading && <p>Sedang memuat...</p>}
        {error && <p className="error">{error}</p>}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kode</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <input defaultValue={item.name} onBlur={(e) => e.target.value !== item.name && handleUpdate(item, 'name', e.target.value)} />
                  </td>
                  <td>
                    <input defaultValue={item.code} onBlur={(e) => e.target.value !== item.code && handleUpdate(item, 'code', e.target.value)} />
                  </td>
                  <td>
                    <select defaultValue={item.category} onChange={(e) => handleUpdate(item, 'category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td>
                    <input type="number" min={0} step={1} defaultValue={item.stock} onBlur={(e) => handleUpdate(item, 'stock', Number(e.target.value))} />
                  </td>
                  <td>
                    <input type="number" min={1} step={1} defaultValue={item.price} onBlur={(e) => handleUpdate(item, 'price', Number(e.target.value))} />
                  </td>
                  <td>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>Belum ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

