import axios from "axios";
import Swal from 'sweetalert2';

export const request = async (method, url, params, data, idtoken) => {

  let token = localStorage.getItem('token')
  if (idtoken) {
    token = idtoken
  }
  const config = {
    method: method,
    url: url,
    params: params,
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.log(error)
    if (error.response && error.response.status === 401) {
      Swal.fire({
        title: 'Error!',
        text: `Sesion inactiva`,
        icon: 'error',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      })
        .then(() => {
          if (process.env.REACT_APP_ERROR_HANDLERS === 'true') {
            window.location.href = '/'
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('user_auth')
            window.location.reload()
          }
        })
    } else {
      Swal.fire({
        title: 'Error!',
        text: `Ocurrio un error inesperado!`,
        icon: 'error',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      })
        .then(() => {
          if (process.env.REACT_APP_ERROR_HANDLERS === 'true') {
            window.location.href = '/'
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('user_auth')
          }
        })
      throw new Error(error);
    }
  }
}
