import Swal from 'sweetalert2'

function alertConfirmjs(message: string, callback: (confirmed: boolean) => void) {
  Swal.fire({
    title: 'Warning !',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText:'Cancel',
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.isConfirmed) {
      callback(true);
    }else{
      callback(false);
    }
  })
  // const confirmed = window.confirm(message);
  // callback(confirmed);
}
export default alertConfirmjs