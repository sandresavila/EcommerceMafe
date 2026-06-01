import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const loginRequest =
  async (
    correo: string,
    password: string
  ) => {

    const response =
      await axios.post(
        `${API_URL}/auth/login`,
        {
          correo,
          password,
        }
      );

    return response.data;
  };
