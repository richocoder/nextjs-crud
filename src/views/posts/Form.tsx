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
  const { dataSelect, setListData } = props;
  const [isSimpan, setIsSimpan] = useState<boolean>(false);
  const [formShowError, setFormShowError] = useState<string>("");
  const [form, setForm] = useState<TypeFormPosts>({
    userId: 1,
    id: null,
    title: "",
    body: ""
  });


  useEffect(() => {
    if (dataSelect.id) {
      if (dataSelect.id > 10) {
        // karena dari https://jsonplaceholder.typicode.com, ID cuman sampai 10, data lain manual handle
        setForm(dataSelect);
      } else {
        FetchGET(`https://jsonplaceholder.typicode.com/posts/${dataSelect.id}`)
          .then((resp: TypeFormPosts) => {
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
        userId: 1,
        id: null,
        title: "",
        body: ""
      })
    }
  }, [dataSelect])

  const handleClose = useCallback(
    () => {
      props.setOpen(false);
    },
    [props],
  );

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = ev.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const { title, body } = form;

    const prom = new Promise((resolve, reject) => {
      const constraint = {
        title: {
          length: {
            minimum: 1,
            message: "Wajib isi Title"
          }
        },
        body: {
          length: {
            minimum: 1,
            message: "Wajib isi Body"
          }
        }
      };
      const validator = validate({ title, body }, constraint, {
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
    FetchPOST('https://jsonplaceholder.typicode.com/posts/', form)
      .then((resp: any) => {
        props.setOpen(false);
        setListData((oldListData: TypeFormPosts[]) => [...oldListData, resp]);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: "Post berhasil disimpan",
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

  const handleUpdateArray = useCallback((dataUpdate: TypeFormPosts) => {
    setListData((oldListData: TypeFormPosts[]) => {
      return oldListData.map((data: TypeFormPosts) => {
        return data.id === dataUpdate.id ? dataUpdate : data;
      });
    });
  }, []);

  const handleUpdate = useCallback(() => {
    if (form.id) {
      // karena dari https://jsonplaceholder.typicode.com, ID cuman sampai 10, data lain manual handle
      if (form.id <= 10) {
        FetchPUT(`https://jsonplaceholder.typicode.com/posts/${form.id}`, form)
          .then((resp: any) => {
            handleUpdateArray(form);
            props.setOpen(false);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: "Post berhasil diupdate",
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
        setFormShowError("");
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
  }, [form, handleInsert]);

  return (
    <MuiDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {props?.dataSelect?.id ? "Update" : "Add"} Post
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
                id="title"
                name="title"
                fullWidth
                value={form.title}
                label="Title"
                onChange={handleChange}
                autoFocus
              />
            </Grid>

            <Grid item xs={12} className="mgTop10">
              <TextField
                required
                id="body"
                name="body"
                fullWidth
                value={form.body}
                label="Body"
                onChange={handleChange}
                multiline
                rows={4}
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
