import React, { useState, useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import FetchPOST from 'src/configs/fetchPOST';
import FetchGET from 'src/configs/fetchGET';
import FetchPUT from 'src/configs/fetchPUT';
import validate from 'validate.js';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';


const MuiDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const DialogForm = (props: any) => {
  const {  dataSelect, setListData } = props;
  const [isSimpan, setIsSimpan] = useState<boolean>(false);
  const [formShowError, setFormShowError] = useState<string>("");
  const [form, setForm] = useState<TypeFormUser>({
    id: null,
    name: "",
    username: "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: ""
      }
    },
    phone: "",
    website: "",
    company: {
      name: "",
      catchPhrase: "",
      bs: ""
    }
  });


  useEffect(() => {
    if (dataSelect.id) {
      if (dataSelect.id > 10) {
        // karena dari https://jsonplaceholder.typicode.com, ID cuman sampai 10, data lain manual handle
        setForm(dataSelect);
      } else {
        FetchGET(`https://jsonplaceholder.typicode.com/users/${dataSelect.id}`)
          .then((resp: TypeFormUser) => {
            setForm(resp)
          })
          .catch((err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err,
            });
          })
      }
    } else {
      setForm({
        id: null,
        name: "",
        username: "",
        email: "",
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: {
            lat: "",
            lng: ""
          }
        },
        phone: "",
        website: "",
        company: {
          name: "",
          catchPhrase: "",
          bs: ""
        }
      })
    }
  }, [dataSelect])

  const handleClose = useCallback(() => {
      props.setOpen(false);
    },[props])
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    const newForm: TypeFormUser = { ...form };
    if (name.startsWith('address.')) {
      const propertyName = name.split('.')[1];
      newForm.address = { ...newForm.address, [propertyName]: value };
    } else if (name.startsWith('company.')) {
      const propertyName = name.split('.')[1];
      newForm.company = { ...newForm.company, [propertyName]: value };
    } else {
      setForm({ ...newForm, [name]: value });
      return;
    }

    setForm(newForm);
  };





  const validateForm = () => {
    const { username, email, phone, website } = form;

    const prom = new Promise((resolve, reject) => {
      const constraint = {
        username: {
          length: {
            minimum: 1,
            message: "Wajib isi Username"
          }
        },
        email: {
          presence: {
            allowEmpty: false,
            message: "Wajib isi email"
          },
          email: {
            message: "Email tidak valid"
          }
        },
        phone: {
          length: {
            minimum: 1,
            message: "Wajib isi phone"
          }
        },
        website: {
          length: {
            minimum: 1,
            message: "Wajib isi website"
          }
        },
      };
      const validator = validate({ username, email, phone, website }, constraint, {
        fullMessages: false
      });
      if (validator === undefined) {
        resolve(true);
      } else {
        reject(validator);
      }
    });
    return Promise.all([prom]);
  };
  const handleInsert = useCallback(() => {
    setIsSimpan(true);
    FetchPOST('https://jsonplaceholder.typicode.com/users/', form)
      .then((resp: any) => {
        props.setOpen(false);
        setListData((oldListData: TypeFormUser[]) => [...oldListData, resp]);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: "User berhasil disimpan",
        });
      })
      .catch((err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
        });
      }).finally(() => {
        setIsSimpan(false);
      })
  }, [ setListData, form]);

  const handleUpdateArray = useCallback((dataUpdate: TypeFormUser) => {
    setListData((oldListData: TypeFormUser[]) => {
      return oldListData.map((data: TypeFormUser) => {
        return data.id === dataUpdate.id ? dataUpdate : data;
      });
    });
  }, []);
  const handleUpdate = useCallback(() => {
    if (form.id) {
      // karena dari https://jsonplaceholder.typicode.com, ID cuman sampai 10, data lain manual handle
      if (form.id <= 10) {
        FetchPUT(`https://jsonplaceholder.typicode.com/users/${form.id}`, form)
          .then((resp: any) => {
            handleUpdateArray(form);
            props.setOpen(false);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: "User berhasil diupdate",
            });
          })
          .catch((err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err,
            });
          }).finally(() => {
            setIsSimpan(false);
          })

      } else {
        handleUpdateArray(form);
        props.setOpen(false);
      }
    }
  }, [form, handleUpdateArray]);


  const handleSimpan = useCallback(() => {
    validateForm()
      .then(() => {
        setFormShowError("")
        if (form.id) {
          handleUpdate();
        } else {
          handleInsert();
        }
      })
      .catch(err => {
        const keys = Object.keys(err);
        let errorMessage = "";
        for (const key of keys) {
          errorMessage += err[key] + ". ";
        }
        setFormShowError(errorMessage);
      })
  },
    [props, form, handleInsert],
  )
  return (
    <MuiDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {props?.dataSelect?.id ? "Update" : "Add"} User
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {formShowError && <Typography variant="body1" style={{ color: 'red' }}>{formShowError}</Typography>}
            </Grid>

            <Grid item xs={12} className="mgTop10">
              <TextField
                required
                id="username"
                name="username"
                fullWidth
                value={form.username}
                label="Username"
                onChange={handleChange}
                autoFocus
              />
            </Grid>

            <Grid item xs={12} className="mgTop10">
              <TextField
                required
                id="name"
                name="name"
                fullWidth
                value={form.name}
                label="Name"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={12} className="mgTop10">
              <TextField
                required
                id="email"
                name="email"
                fullWidth
                value={form.email}
                label="Email"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="phone"
                name="phone"
                fullWidth
                value={form.phone}
                label="Phone"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="website"
                name="website"
                fullWidth
                value={form.website}
                label="Website"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>
            <Grid item xs={12} className="mgTop10">
              <Typography variant="h6" className='text-center'>Address</Typography>
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="address.street"
                name="address.street"
                fullWidth
                value={form.address.street}
                label="Street"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="address.suite"
                name="address.suite"
                fullWidth
                value={form.address.suite}
                label="Suite"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="address.city"
                name="address.city"
                fullWidth
                value={form.address.city}
                label="City"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="address.zipcode"
                name="address.zipcode"
                fullWidth
                value={form.address.zipcode}
                label="Zipcode"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="address.geo.lat"
                name="address.geo.lat"
                fullWidth
                value={form.address.geo.lat}
                label="Latitude"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="address.geo.lng"
                name="address.geo.lng"
                fullWidth
                value={form.address.geo.lng}
                label="Longitude"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={12} className="mgTop10">
              <Typography variant="h6" className='text-center'>Company</Typography>
            </Grid>

            <Grid item xs={12} className="mgTop10">
              <TextField
                required
                id="company.name"
                name="company.name"
                fullWidth
                value={form.company.name}
                label="Company Name"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="company.catchPhrase"
                name="company.catchPhrase"
                fullWidth
                value={form.company.catchPhrase}
                label="Catch Phrase"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

            <Grid item xs={6} className="mgTop10">
              <TextField
                required
                id="company.bs"
                name="company.bs"
                fullWidth
                value={form.company.bs}
                label="Business Strategy"
                onChange={handleChange}
                disabled={isSimpan}
              />
            </Grid>

          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSimpan} disabled={isSimpan}>
          {isSimpan ? (
            <><CircularProgress size={22} /> <span style={{ marginLeft: 5 }}>Loading...</span></>
          ) : (
            `${props?.dataSelect?.id ? "Update" : "Simpan"}`
          )}
        </Button>
      </DialogActions>
    </MuiDialog>

  )
}
export default DialogForm;
