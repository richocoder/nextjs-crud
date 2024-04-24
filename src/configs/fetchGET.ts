import axios from 'axios'

const FetchGET = (
  link: string,
) => {
  let headers: any = {
    'Content-type': 'application/json; charset=UTF-8'
  }

  return axios
    .get(link, { headers })
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      const resp = err?.response
      if (resp) {
        const error = resp.data
        if (error) {
          throw new Error(error.message || JSON.stringify(error));
        } else {
          throw new Error(`${resp.status}: ${resp.statusText}: ${JSON.stringify(resp.data)}`);
        }
      } else {
        throw new Error("Terjadi kesalahan dalam koneksi");
      }
    })
}

export default FetchGET
