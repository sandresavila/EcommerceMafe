export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
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