"use client";
import React, { useState, useEffect } from 'react';

export default function AdminPage() {
  // 1. Estados de Autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Estados del Panel de Gestión
  const [seccion, setSeccion] = useState('dashboard');
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [montado, setMontado] = useState(false);

  // Estados para Crear y Editar
  const [mostrandoForm, setMostrandoForm] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({ 
    nombre: '', precio: '', descripcion: '', stock: '', id_categoria: '' 
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [productoAEditar, setProductoAEditar] = useState({ nombre: '', precio: '' });

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      cargarProductos();
      cargarCategorias();
    }
  }, [isLoggedIn]); 

  // --- FUNCIONES DE API CORREGIDAS ---

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // CORRECCIÓN: La ruta en app.js es /api + /login de authRoutes
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password: password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  const cargarProductos = async () => {
    try {
      // CORRECCIÓN: Según tu app.js es /api/productos
      const res = await fetch("http://localhost:4000/api/productos");
      const data = await res.json();
      // Si el backend envía un objeto con una propiedad, asegúrate de acceder a ella. 
      // Si envía el array directo, esto funciona:
      setProductos(Array.isArray(data) ? data : (data.productos || []));
    } catch (error) { 
        console.error("Error productos:", error); 
    }
  };

  const cargarCategorias = async () => {
    try {
      // CORRECCIÓN: Según tu app.js es /api + /categorias
      const res = await fetch("http://localhost:4000/api/categorias");
      const data = await res.json();
      const listaCategorias = Array.isArray(data) ? data : (data.categorias || []);
      setCategorias(listaCategorias);
      
      if (listaCategorias.length > 0) {
        setNuevoProducto(prev => ({ ...prev, id_categoria: listaCategorias[0].id_categoria.toString() }));
      }
    } catch (error) { 
        console.error("Error categorías:", error); 
    }
  };

  const guardarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.id_categoria) {
      alert("Faltan datos obligatorios");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevoProducto,
          precio: parseFloat(nuevoProducto.precio),
          stock: parseInt(nuevoProducto.stock) || 0,
          id_categoria: parseInt(nuevoProducto.id_categoria),
          imagen_url: "https://via.placeholder.com/150"
        }),
      });
      if (res.ok) {
        setMostrandoForm(false);
        cargarProductos();
        alert("Producto creado");
      }
    } catch (error) { alert("Error al guardar"); }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    // CORRECCIÓN: La ruta incluye el ID
    await fetch(`http://localhost:4000/api/productos/${id}`, { method: 'DELETE' });
    cargarProductos();
  };

  const actualizarProducto = async () => {
    await fetch(`http://localhost:4000/api/productos/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: productoAEditar.nombre,
        precio: parseFloat(productoAEditar.precio)
      }),
    });
    setEditandoId(null);
    cargarProductos();
  };

  if (!montado) return null;

  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
        <form onSubmit={manejarLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <h1 style={{ textAlign: 'center', color: '#111827', marginBottom: '30px' }}>Mafe Admin Access</h1>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#374151', fontWeight: '600' }}>Email Corporativo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #d1d5db', borderRadius: '6px', color: 'black' }} />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#374151', fontWeight: '600' }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #d1d5db', borderRadius: '6px', color: 'black' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            Entrar al Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Sidebar */}
      <nav style={{ width: '260px', background: '#1f2937', color: 'white', padding: '25px' }}>
        <h2 style={{ color: '#818cf8', marginBottom: '40px' }}>Sistema Interno</h2>
        <div onClick={() => setSeccion('dashboard')} style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', background: seccion === 'dashboard' ? '#374151' : 'transparent', marginBottom: '10px' }}>📊 Dashboard</div>
        <div onClick={() => setSeccion('productos')} style={{ padding: '12px', cursor: 'pointer', borderRadius: '8px', background: seccion === 'productos' ? '#374151' : 'transparent' }}>📦 Inventario</div>
        
        <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: '60px', width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </nav>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '40px' }}>
        {seccion === 'dashboard' ? (
          <div>
            <h1 style={{ color: '#111827' }}>Panel de Control</h1>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginTop: '20px', width: '250px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', textTransform: 'uppercase' }}>Productos Activos</span>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#4f46e5', margin: '10px 0 0 0' }}>{productos.length}</p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1 style={{ color: '#111827' }}>Gestión de Inventario</h1>
              <button onClick={() => setMostrandoForm(true)} style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Nuevo Registro</button>
            </div>

            {mostrandoForm && (
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '15px', color: 'black' }}>Registrar Producto</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <input placeholder="Nombre" value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', color: 'black' }} />
                  <input placeholder="Precio" type="number" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', color: 'black' }} />
                  <select value={nuevoProducto.id_categoria} onChange={(e) => setNuevoProducto({...nuevoProducto, id_categoria: e.target.value})} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', color: 'black' }}>
                    <option value="">Categoría...</option>
                    {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={guardarProducto} style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setMostrandoForm(false)} style={{ flex: 1, padding: '10px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left', color: 'black' }}>Producto</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: 'black' }}>Precio</th>
                    <th style={{ padding: '15px', textAlign: 'center', color: 'black' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'black' }}>
                  {productos.map((p) => (
                    <tr key={p.id_producto} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '15px' }}>
                        {editandoId === p.id_producto ? 
                          <input value={productoAEditar.nombre} onChange={e => setProductoAEditar({...productoAEditar, nombre: e.target.value})} style={{ padding: '5px', border: '1px solid #4f46e5', color: 'black' }} /> 
                          : p.nombre}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {editandoId === p.id_producto ? 
                          <input type="number" value={productoAEditar.precio} onChange={e => setProductoAEditar({...productoAEditar, precio: e.target.value})} style={{ width: '80px', padding: '5px', color: 'black' }} /> 
                          : `$${p.precio}`}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {editandoId === p.id_producto ? (
                          <button onClick={actualizarProducto} style={{ color: '#10b981', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer' }}>Aplicar</button>
                        ) : (
                          <>
                            <button onClick={() => { setEditandoId(p.id_producto); setProductoAEditar({ nombre: p.nombre, precio: p.precio }); }} style={{ color: '#4f46e5', marginRight: '15px', border: 'none', background: 'none', cursor: 'pointer' }}>Editar</button>
                            <button onClick={() => eliminarProducto(p.id_producto)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Eliminar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}