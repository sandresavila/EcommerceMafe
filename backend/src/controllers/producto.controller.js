import { pool } from "../config/db.js";

// 🔹 Obtener todos
export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Obtener por ID
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Crear producto
export const createProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      id_categoria,
      imagen_url,
      es_distribuido
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO productos 
      (nombre, descripcion, precio, stock, id_categoria, imagen_url, es_distribuido)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria,
        imagen_url,
        es_distribuido || false
      ]
    );

    res.status(201).json({
      id_producto: result.insertId,
      nombre
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Actualizar producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      descripcion,
      precio,
      stock,
      id_categoria,
      imagen_url,
      es_distribuido
    } = req.body;

    const [result] = await pool.query(
      `UPDATE productos SET
        nombre = ?,
        descripcion = ?,
        precio = ?,
        stock = ?,
        id_categoria = ?,
        imagen_url = ?,
        es_distribuido = ?
      WHERE id_producto = ?`,
      [
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria,
        imagen_url,
        es_distribuido,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Eliminar producto
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM productos WHERE id_producto = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};