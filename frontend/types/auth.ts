export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
  ultimo_login?: string;
  fecha_registro?: string;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  direccion: string;
}