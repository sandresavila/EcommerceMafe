"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [seccion, setSeccion] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [productos, setProductos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null); 
  const [montado, setMontado] = useState(false);

  // Estados para Inventario
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', precio: '', descripcion: '', stock: '0', id_categoria: ''
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [productoAEditar, setProductoAEditar] = useState({ nombre: '', precio: '', stock: '' });

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => { setMontado(true); }, []);

  useEffect(() => {
    if (isLoggedIn) {
      cargarProductos();
      cargarCategorias();
      cargarPedidos();
      cargarStats();
    }
  }, [isLoggedIn]);

  // --- FUNCIONES DE CARGA ---

  const cargarStats = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/pedidos/stats");
      const data = await res.json();
      if (data && data.summary) {
        setStats(data);
      } else {
        setStats({
          summary: { ingresosTotales: 0, pedidosPendientes: 0, totalClientes: 0 },
          salesHistory: [],
          statusDistribution: []
        });
      }
    } catch (error) { 
      setStats({
        summary: { ingresosTotales: 0, pedidosPendientes: 0, totalClientes: 0 },
        salesHistory: [],
        statusDistribution: []
      });
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/productos");
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : (data.productos || []));
    } catch (error) { console.error(error); }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/categorias");
      const data = await res.json();
      const lista = Array.isArray(data) ? data : [];
      setCategorias(lista);
      if (lista.length > 0) setNuevoProducto(prev => ({ ...prev, id_categoria: lista[0].id_categoria.toString() }));
    } catch (error) { console.error(error); }
  };

  const cargarPedidos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/pedidos");
      const data = await res.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); }
  };

  // --- GESTIÓN DE PEDIDOS ---

  const cambiarEstadoPedido = async (id: number, estadoActual: string) => {
    const { value: nuevoEstado } = await Swal.fire({
      title: 'Actualizar Estado del Cliente',
      input: 'select',
      inputOptions: { 
        pendiente: 'Pendiente', 
        pagado: 'Pagado', 
        enviado: 'Enviado', 
        entregado: 'Entregado', 
        cancelado: 'Cancelado' 
      },
      inputValue: estadoActual.toLowerCase(),
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar'
    });

    if (nuevoEstado) {
      try {
        const res = await fetch(`http://localhost:4000/api/pedidos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (res.ok) {
           Swal.fire({ icon: 'success', title: '¡Estado Actualizado!', timer: 1500, showConfirmButton: false });
           cargarPedidos();
           cargarStats();
        } else {
           throw new Error("Error en servidor");
        }
      } catch (error) { 
        Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
      }
    }
  };

  const obtenerEstiloEstado = (estado: string) => {
    const s = estado?.toLowerCase() || '';
    switch (s) {
      case 'pendiente': return { bg: '#fef3c7', text: '#92400e' };
      case 'pagado':    return { bg: '#ccfbf1', text: '#0d9488' };  
      case 'enviado':   return { bg: '#dbeafe', text: '#1e40af' };
      case 'entregado': return { bg: '#dcfce7', text: '#15803d' };
      case 'cancelado': return { bg: '#fee2e2', text: '#991b1b' };
      default:          return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  // --- GESTIÓN DE INVENTARIO ---

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevoProducto,
          precio: parseFloat(nuevoProducto.precio),
          stock: parseInt(nuevoProducto.stock),
          id_categoria: parseInt(nuevoProducto.id_categoria),
          imagen_url: "https://via.placeholder.com/150"
        }),
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Producto Guardado', timer: 2000, showConfirmButton: false });
        setNuevoProducto({ nombre: '', precio: '', descripcion: '', stock: '0', id_categoria: categorias[0]?.id_categoria.toString() || '' });
        cargarProductos();
      }
    } catch (error) { Swal.fire('Error', 'No se pudo guardar', 'error'); }
  };

  const eliminarProducto = async (id: number) => {
    const confirm = await Swal.fire({ title: '¿Eliminar producto?', icon: 'warning', showCancelButton: true });
    if (confirm.isConfirmed) {
      try {
        await fetch(`http://localhost:4000/api/productos/${id}`, { method: 'DELETE' });
        cargarProductos();
      } catch (error) { console.error(error); }
    }
  };

  const activarEdicion = (p: any) => {
    setEditandoId(p.id_producto);
    setProductoAEditar({ nombre: p.nombre, precio: p.precio.toString(), stock: p.stock.toString() });
  };

  const actualizarProducto = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/productos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: productoAEditar.nombre,
          precio: parseFloat(productoAEditar.precio),
          stock: parseInt(productoAEditar.stock)
        }),
      });
      if (res.ok) {
        setEditandoId(null);
        cargarProductos();
        Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1000, showConfirmButton: false });
      }
    } catch (error) { console.error(error); }
  };

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@mafe.com" && password === "admin123") setIsLoggedIn(true);
    else Swal.fire('Acceso Denegado', 'Credenciales incorrectas', 'error');
  };

  if (!montado) return null;

  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
        <form onSubmit={manejarLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '350px' }}>
          <h2 style={{ textAlign: 'center', color: 'black', marginBottom: '20px' }}>Mafe Admin</h2>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', color: 'black' }} />
          <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', color: 'black' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6', color: 'black' }}>
      {/* SIDEBAR */}
      <nav style={{ width: '240px', background: '#1f2937', color: 'white', padding: '20px' }}>
        <h2 style={{ color: '#818cf8', marginBottom: '30px' }}>Sistema Mafe</h2>
        <div onClick={() => setSeccion('dashboard')} style={{ padding: '12px', background: seccion === 'dashboard' ? '#4f46e5' : 'transparent', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px' }}>📊 Dashboard</div>
        <div onClick={() => setSeccion('inventario')} style={{ padding: '12px', background: seccion === 'inventario' ? '#4f46e5' : 'transparent', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px' }}>📦 Inventario</div>
        <div onClick={() => setSeccion('pedidos')} style={{ padding: '12px', background: seccion === 'pedidos' ? '#4f46e5' : 'transparent', borderRadius: '6px', cursor: 'pointer' }}>🛒 Pedidos</div>
        <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: '40px', width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cerrar Sesión</button>
      </nav>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {/* SECCIÓN DASHBOARD */}
        {seccion === 'dashboard' && (
          <>
            <h1 style={{ marginBottom: '25px', fontSize: '28px' }}>Resumen de Negocio</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #4f46e5' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Ingresos Totales</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${Number(stats?.summary?.ingresosTotales || 0).toLocaleString()}</p>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #f59e0b' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Pedidos Pendientes</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats?.summary?.pedidosPendientes || 0}</p>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #10b981' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Clientes Registrados</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats?.summary?.totalClientes || 0}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', height: '400px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px' }}>Tendencia de Ventas</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={stats?.salesHistory || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="fecha" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{r: 5}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', height: '400px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px' }}>Distribución de Pedidos</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={stats?.statusDistribution || []} dataKey="cantidad" nameKey="estado" cx="50%" cy="50%" outerRadius={80} label>
                      {(stats?.statusDistribution || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* SECCIÓN INVENTARIO */}
        {seccion === 'inventario' && (
          <>
            <h1 style={{ marginBottom: '25px', fontSize: '28px' }}>Gestión de Inventario</h1>
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <form onSubmit={guardarProducto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input placeholder="Nombre del producto" value={nuevoProducto.nombre} onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', color: 'black' }} />
                <input placeholder="Precio" type="number" value={nuevoProducto.precio} onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', color: 'black' }} />
                <input placeholder="Descripción" value={nuevoProducto.descripcion} onChange={e => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', color: 'black' }} />
                <input placeholder="Stock inicial" type="number" value={nuevoProducto.stock} onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', color: 'black' }} />
                <select value={nuevoProducto.id_categoria} onChange={e => setNuevoProducto({...nuevoProducto, id_categoria: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', color: 'black' }}>
                  <option value="">Seleccionar Categoría...</option>
                  {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                </select>
                <button type="submit" style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Agregar Producto</button>
              </form>
            </div>
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead style={{ background: '#f9fafb' }}>
                   <tr>
                     <th style={{ padding: '15px', textAlign: 'left' }}>Producto</th>
                     <th style={{ padding: '15px', textAlign: 'left' }}>Precio</th>
                     <th style={{ padding: '15px', textAlign: 'left' }}>Stock</th>
                     <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
                   </tr>
                 </thead>
                 <tbody>
                   {productos.map(p => (
                    <tr key={p.id_producto} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '15px' }}>{editandoId === p.id_producto ? <input value={productoAEditar.nombre} onChange={e => setProductoAEditar({...productoAEditar, nombre: e.target.value})} style={{ color: 'black', border: '1px solid #ccc' }} /> : p.nombre}</td>
                      <td style={{ padding: '15px' }}>{editandoId === p.id_producto ? <input type="number" value={productoAEditar.precio} onChange={e => setProductoAEditar({...productoAEditar, precio: e.target.value})} style={{ color: 'black', border: '1px solid #ccc' }} /> : `$${p.precio}`}</td>
                      <td style={{ padding: '15px' }}>{editandoId === p.id_producto ? <input type="number" value={productoAEditar.stock} onChange={e => setProductoAEditar({...productoAEditar, stock: e.target.value})} style={{ color: 'black', border: '1px solid #ccc' }} /> : p.stock}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {editandoId === p.id_producto ? (
                          <button onClick={actualizarProducto} style={{ background: '#10b981', color: 'white', padding: '5px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                        ) : (
                          <>
                            <button onClick={() => activarEdicion(p)} style={{ color: '#4f46e5', marginRight: '15px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Editar</button>
                            <button onClick={() => eliminarProducto(p.id_producto)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Eliminar</button>
                          </>
                        )}
                      </td>
                    </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </>
        )}

        {/* SECCIÓN PEDIDOS */}
        {seccion === 'pedidos' && (
          <>
            <h1 style={{ marginBottom: '25px', fontSize: '28px' }}>Gestión de Pedidos</h1>
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Cliente</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Total</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Estado</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(p => {
                    const estilo = obtenerEstiloEstado(p.estado);
                    return (
                      <tr key={p.id_pedido} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '15px' }}>#{p.id_pedido}</td>
                        <td style={{ padding: '15px' }}>{p.nombre_cliente || `Usuario #${p.id_usuario}`}</td>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>${p.total}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: estilo.bg, color: estilo.text, textTransform: 'uppercase' }}>
                            {p.estado}
                          </span>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <button onClick={() => cambiarEstadoPedido(p.id_pedido, p.estado)} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Gestionar Estado</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {pedidos.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No hay pedidos registrados.</p>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}