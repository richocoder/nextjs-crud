import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';
import FetchGET from 'src/configs/fetchGET';
import FetchDELETE from 'src/configs/fetchDELETE';
import alertConfirmjs from 'src/func/alertConfirmjs';
import Swal from 'sweetalert2';
import DialogForm from 'src/views/user/Form';


const User = () => {
  const [listData, setListData] = useState<any[]>([])
  const [isReload, setIsReload] = useState<boolean>(true)
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [dataSelect, setDataSelect] = useState<any>({})

  useEffect(() => {
    if (isReload) {
      setListData([])
      FetchGET('https://jsonplaceholder.typicode.com/users/')
        .then((resp: any) => {
          setListData(resp)
        })
        .catch((err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
          });
        })
        .finally(() => setIsReload(false))
    }
  }, [isReload]);


  const handleReload = () => {
    setIsReload(true)
  }


  const handleAdd = useCallback(() => {
      setIsOpenForm(true)
      setDataSelect({})
    },
    [],
  )
  const handleEdit = useCallback(
    (data: TypeFormUser) => {
      setIsOpenForm(true)
      setDataSelect(data)
    },
    [],
  )


  const handleHapus = useCallback(
    (data: TypeFormUser) => {
      alertConfirmjs(`Yakin ingin hapus ${data.username}?`, (confirmed: boolean) => {
        if (confirmed) {
          FetchDELETE(`https://jsonplaceholder.typicode.com/users/${data.id}`)
            .then((resp: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "user Berhasil dihapus",
              });
              setListData(oldListData => oldListData.filter((f: TypeFormUser) => f.id !== data.id));
            })
            .catch((err: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
              });
            })
        }
      });
    },[])


  const columns = [
    {
      Header: "No",
      width: 50,
      Cell: (row: any) => <span> {row.index + 1} </span>,
      filterable: false,
      className: "text-center",
      headerClassName: "react-table-header-class",
    },
    {
      Header: "Username",
      accessor: "username",
      className: "text-left",
      headerClassName: "react-table-header-class text-left",
      minWidth: 100,
      Cell: (props: any) => <span className="link" onClick={handleEdit.bind(this, props.original)}>{props.value}</span>
    },
    {
      Header: "Name",
      accessor: "name",
      className: "text-left",
      headerClassName: "react-table-header-class text-left",
      minWidth: 100,
    },
    {
      Header: "Email",
      accessor: "email",
      className: "text-left",
      headerClassName: "react-table-header-class text-left",
      minWidth: 100,
    },
    {
      Header: "Phone",
      accessor: "phone",
      className: "text-left",
      headerClassName: "react-table-header-class text-left",
      minWidth: 100,
    },
    {
      Header: "Action",
      filterable: false,
      className: "text-left",
      headerClassName: "react-table-header-class",
      width: 120,
      Cell: (props: any) => (
        <>
          <p className="text-center btnActonTabel">
            <Button
              title="DELETE"
              variant="contained"
              color={"error"}
              onClick={handleHapus.bind(this, props.original)}
            >
              DELETE
            </Button>
          </p>
        </>
      )
    }

  ];

  const renderForm = useMemo(() => {
    if (isOpenForm) {
      return (
        <DialogForm
          dataSelect={dataSelect}
          open={isOpenForm}
          setOpen={setIsOpenForm}
          handleReload={handleReload}
          setListData={setListData}
        />
      )
    } else return null
  }, [isOpenForm, dataSelect, setListData]);


  return (
    <>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12}>
            <Card sx={{ position: 'relative' }}>
              <CardContent>
                <Button
                  title="Add"
                  variant="contained"
                  color="primary"
                  onClick={handleAdd}
                  className="margin-right"
                >
                  Add
                </Button>
                <Button
                  title="Reload"
                  variant="contained"
                  color="warning"
                  onClick={handleReload}
                  className="margin-right"
                >
                  Reload
                </Button>

                <div className="mgTop10">
                  <ReactTable
                    data={listData}
                    columns={columns}
                    defaultPageSize={15}
                    pageSizeOptions={[10, 15, 20, 25, 50, 100]}
                    className="-striped -highlight custom-react-table-theme-class"
                    filterable={true}
                    defaultFilterMethod={(filter: any, row: any) => {
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined
                        ? String(row[id]?.toString().toLowerCase()).includes(
                          filter?.value?.toString().toLowerCase()
                        )
                        : true;
                    }}
                  />
                </div>


              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ApexChartWrapper>
      {renderForm}
    </>
  )
}

export default User
