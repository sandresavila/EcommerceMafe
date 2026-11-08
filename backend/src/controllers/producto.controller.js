import {HttpError} from '../utils/errors.js';
import {config} from '../config/env.js';
import {logError} from '../utils/errors.js';
import { pool } from "../config/db.js";

// =========================================
// OBTENER TODOS
// =========================================
export const getProductos =
  async (req, res) => {

    try {

      const [rows] =
        await pool.query(
          `
          SELECT
            p.*,
            c.nombre AS categoria_nombre

          FROM productos p

          LEFT JOIN categorias c
          ON p.id_categoria = c.id_categoria

          ORDER BY p.id_producto DESC
          `
        );

      res.json(rows.map(p=>({...p,precio:Number(p.precio),precio_anterior:p.precio_anterior==null?null:Number(p.precio_anterior)})));

    } catch (error) {

      logError(error);

      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };

// =========================================
// OBTENER POR ID
// =========================================
export const getProductoById =
  async (req, res) => {

    try {

      const { id } = req.params;

      const [rows] =
        await pool.query(
          `
          SELECT
            p.*,
            c.nombre AS categoria_nombre

          FROM productos p

          LEFT JOIN categorias c
          ON p.id_categoria = c.id_categoria

          WHERE p.id_producto = ?
          `,
          [id]
        );

      if (rows.length === 0) {

        return res.status(404).json({
          message:
            "Producto no encontrado",
        });
      }

      res.json({...rows[0],precio:Number(rows[0].precio),precio_anterior:rows[0].precio_anterior==null?null:Number(rows[0].precio_anterior)});

    } catch (error) {

      logError(error);

      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };

// =========================================
// CREAR PRODUCTO
// =========================================
export const createProducto =
  async (req, res) => {

    try {

      const {
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria,
        es_distribuido,
      } = req.body;

      // =====================================
      // IMAGEN
      // =====================================

      const imagen_url =
        req.file
          ? `${config.backendUrl}/uploads/${req.file.filename}`
          : null;

      // =====================================
      // INSERT
      // =====================================

      const [result] =
        await pool.query(
          `
          INSERT INTO productos
          (
            nombre,
            descripcion,
            precio,
            stock,
            id_categoria,
            imagen_url,
            es_distribuido
          )

          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            nombre,
            descripcion,
            precio,
            stock,
            id_categoria || null,
            imagen_url,
            es_distribuido || false,
          ]
        );

      // =====================================
      // DEVOLVER PRODUCTO
      // =====================================

      res.status(201).json({

        id_producto:
          result.insertId,

        nombre,
        descripcion,
        precio,
        stock,

        id_categoria:
          id_categoria || null,

        imagen_url,

        es_distribuido:
          es_distribuido || false,
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };

// =========================================
// ACTUALIZAR PRODUCTO
// =========================================
export const updateProducto =
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        nombre,
        descripcion,
        precio,
        stock,
        id_categoria,
        es_distribuido,
      } = req.body;

      // =====================================
      // OBTENER PRODUCTO ACTUAL
      // =====================================

      const [productoActual] =
        await pool.query(
          `
          SELECT *
          FROM productos

          WHERE id_producto = ?
          `,
          [id]
        );

      if (
        productoActual.length === 0
      ) {

        return res.status(404).json({
          message:
            "Producto no encontrado",
        });
      }

      // =====================================
      // IMAGEN
      // =====================================

      let imagen_url =
        productoActual[0].imagen_url;

      // SI SUBE NUEVA IMAGEN
      if (req.file) {

        imagen_url =
          `${config.backendUrl}/uploads/${req.file.filename}`
      }

      // =====================================
      // UPDATE
      // =====================================

      await pool.query(
        `
        UPDATE productos

        SET
          nombre = ?,
          descripcion = ?,
          precio = ?,
          stock = ?,
          id_categoria = ?,
          imagen_url = ?,
          es_distribuido = ?

        WHERE id_producto = ?
        `,
        [
          nombre,
          descripcion,
          precio,
          stock,
          id_categoria || null,
          imagen_url,
          es_distribuido || false,
          id,
        ]
      );

      // =====================================
      // RESPUESTA
      // =====================================

      res.json({

        id_producto: id,

        nombre,
        descripcion,
        precio,
        stock,

        id_categoria:
          id_categoria || null,

        imagen_url,

        es_distribuido:
          es_distribuido || false,
      });

    } catch (error) {

      logError(error);

      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };

// =========================================
// ELIMINAR PRODUCTO
// =========================================
export const deleteProducto = async(req,res,next)=>{
  let connection;
  try {
    const id=Number(req.params.id);
    if(!Number.isSafeInteger(id)||id<=0)throw new HttpError(400,'Producto inválido');
    connection=await pool.getConnection();await connection.beginTransaction();
    const [rows]=await connection.query('SELECT id_producto FROM productos WHERE id_producto=? FOR UPDATE',[id]);
    if(!rows.length)throw new HttpError(404,'Producto no encontrado');
    const [history]=await connection.query('SELECT id_detalle FROM pedido_detalle WHERE id_producto=? LIMIT 1',[id]);
    if(history.length)throw new HttpError(409,'El producto tiene pedidos y no se puede eliminar');
    await connection.query('DELETE FROM productos WHERE id_producto=?',[id]);await connection.commit();
    res.json({message:'Producto eliminado'});
  }catch(error){if(connection)try{await connection.rollback();}catch(e){logError(e);}next(error);}
  finally{connection?.release();}
};
