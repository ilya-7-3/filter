import * as React from 'react';
import {
  OutlinedInput,
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow,
    TableSortLabel,
} from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DangerousRoundedIcon from '@mui/icons-material/DangerousRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useDatalog } from './TableDataProvider/useDatalog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from '@mui/material/Toolbar';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import filters from './filter'
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import {Data} from './TableDataProvider/useDatalog'



interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const headerData: readonly Column[] = [
  {
    id: 'level',
    label: 'Уровень',
    minWidth: 5,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'dateTime',
    label: 'Дата',
    minWidth: 110,
    align: 'right',
  },
  {
    id: 'target',
    label: 'Объект',
    minWidth: 180,
    align: 'right',
  },
  {
    id: 'source',
    label: 'Источник',
    minWidth: 50,
    align: 'right',
  },
  {
    id: 'description',
    label: 'Описание',
    minWidth: 200,
    align: 'right',
  },
];
type Order = 'asc' | 'desc';
enum OrderSelect {
  asc = 'asc',
  desc = 'desc'
}

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

const SortTalbeHead: React.FC<EnhancedTableProps>  = (props) => {
 
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return(
    <TableHead>
        
      <TableRow>
        {headerData.map((item) => (
          <TableCell 
            key={item.id}
            align={item.align}
            style={{ minWidth: item.minWidth }}
          >
            <TableSortLabel
              active={orderBy === item.id}
              direction={orderBy === item.id ? order : OrderSelect.desc}
              onClick={createSortHandler(item.id)}
            >
              {item.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  switch(orderBy){ 
    case 'level':
      return order === OrderSelect.desc
      ? (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => -descendingComparator(a, b, orderBy)
      : (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => descendingComparator(a, b, orderBy);
    default:
      return order === OrderSelect.desc
      ? (a: { [key in Key]: number | string }, b: { [key in Key]: number | string })  => descendingComparator(a, b, orderBy)
      : (a: { [key in Key]: number | string }, b: { [key in Key]: number | string })  => -descendingComparator(a, b, orderBy);
  }
}

const iconImages = [
  <DangerousRoundedIcon sx={{color:'red'}}  />,
  <WarningAmberRoundedIcon sx={{color:'orange'}} />,
  <ErrorOutlineOutlinedIcon sx={{color:'#18371b'}} />,
]
export function TableEventLog() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState<Order>(OrderSelect.desc);
  const [orderBy, setOrderBy] = React.useState<keyof Data>('dateTime');
  const [showFilter,setShowFilter] = React.useState(false);
  const [filterBy, setFilterBy] = React.useState('');
  const [dateStart, setDateStart] =React.useState("");
  const [dateEnd, setDateEnd] =React.useState("");
  const [filterValue, setFilterValue] = React.useState<string[]>([]);
  const [arrayFilters, setArrayFilters] = React.useState<any>([]);
  const rows = useDatalog();
  const [tableElements, setTableElements] = React.useState<Data[]>([]);
  const error = !tableElements.length && arrayFilters.length ? true : false;
  const levels = ['Ошибка','Предупреждение','Уведомление'];
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  React.useEffect(()=>{
   arrayFilters.forEach((el:any)=>{
     if(Object.keys(el)[0] === 'level'){     
       setFilterValue([...el.level]);                                                
     }
   })
   if(!arrayFilters.length) setFilterValue([])
  },[filterBy,arrayFilters])
  React.useEffect(()=>setTableElements([...rows.data]),[rows.data]);

  const handleChangeShowFilter = () => {
    if(!showFilter) filterClear()
    setShowFilter(!showFilter)
  };

  const filterByMethod  = () =>{
    setShowFilter(false);
    let map = new Map();
    const spliceArray = arrayFilters.map((a:any) => ({...a}));
    arrayFilters.forEach((el:any,index:number)=>{
      if(Object.keys(el)[0] === filterBy ){
        spliceArray.splice(index,1)                                                         
      }
    })
    
    map.set(filterBy, filterBy==='Date'? [dateStart,dateEnd]:filterValue);
    const array = rows.data;
    const newArrayFilters = [...spliceArray, Object.fromEntries(map.entries())]; 
    setArrayFilters([...newArrayFilters]);
    setTableElements(filters(array,[...newArrayFilters]));
  }
  console.log('tableElements', tableElements)
  console.log('arrayFilters', arrayFilters)

  const filterClear  = () =>{
    setFilterBy('');
    setDateStart('');
    setDateEnd('');
  }
  
  const handleChangeColumn = (event: SelectChangeEvent) => {
    filterClear();
    setFilterBy(event.target.value as string);
  };

  const handleChangeFilterValue = (event: SelectChangeEvent<typeof filterValue>) => {
    const {
      target: { value },
    } = event;
    setFilterValue(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
 
  const handleChangeDateStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStart(e.target.value);
  };

  const handleChangeDateEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);
  };

 const  handleDelete = (filterColumn:string,index:number, indexLevel:number=0) => {
  const spliceArray = arrayFilters.map((a:any) => ({...a}));
  if(filterColumn === 'Date'){
    spliceArray.splice(index,1)
  }
  if(filterColumn === 'level'){
    if(arrayFilters[index].level.length === 1){
      spliceArray.splice(index,1)   
    }
    else{
      spliceArray[index].level.splice(indexLevel,1)
    }
  }
   setArrayFilters(spliceArray) 
   setTableElements(filters(rows.data,[...spliceArray]));
  };
  
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === OrderSelect.desc;
    setOrder(isAsc ? OrderSelect.asc : OrderSelect.desc);
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
     
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      
      <TableContainer 
        sx={{ 
          maxHeight: 550,
          minHeight: 500 
        }}
      ><Toolbar sx={{display:'flex',
      justifyContent:'end'}}>
        <Tooltip title="Filter list">
        <IconButton onClick={handleChangeShowFilter}>
        {showFilter ? <CloseIcon/> : <FilterListIcon/>}
        </IconButton>
        </Tooltip>
        </Toolbar>
        <Box sx={{display:'flex',
                  justifyContent:'end'}}>
          {arrayFilters.length ? 
                arrayFilters.map((el:any,index:number)=>{             
                    return(
                      <div key={index}>
                      {Object.keys(el)[0]==='Date'?
                        <Chip key={index}
                        sx={{marginRight:'5px'}}
                        label={
                        <Box sx={{marginTop:'3px',
                        display:'flex',
                        alignItems:'center'}}>
                            <span> {`${el.Date[0]? `C ${el.Date[0].replace('T',' ')}` :''}  ${el.Date[1]? `По ${el.Date[1].replace('T',' ')}`:''} ` }</span>
                        </Box>}
                        onDelete={()=>handleDelete(Object.keys(el)[0],index)}  />:
                        el.level.map((element:any,indexlevel:number)=>{
                           return( <Chip key={Number(element)}
                            sx={{marginRight:'5px'}}
                            label={
                            <Box sx={{marginTop:'3px',
                            display:'flex',
                            alignItems:'center'}}>
                              <span> {iconImages[element-1]}</span>
                            </Box>}
                            onDelete={()=>handleDelete(Object.keys(el)[0],index,indexlevel)}  />)
                        })
                      }
                      </div>   
                    )
                }) :''
            }
        </Box>
        {error ? 
              <Box sx={{display:'flex',
              justifyContent:'end',
              marginTop:'5px',
              color:'red'}}>
                 <Alert severity="warning">По указанным фильтрам данные не найдены</Alert>
              </Box>  :''
            }
        {
          showFilter ? 
          <Box sx={{display:'flex',
                    alignItems:'end',
                    justifyContent:'end'}}>
            <Box>
           
        <InputLabel id="demo-simple-select-label">Фильтр по</InputLabel>
        <Select
          sx={{width:'140px',
          marginRight:'15px'}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterBy}
          label="Фильтр по"
          disabled={error? true:false}
          onChange={handleChangeColumn}
        >
          <MenuItem value={'Date'}>Дате</MenuItem>
          <MenuItem value={'level'}>Уровню</MenuItem>
        </Select>
        </Box>
        {filterBy === 'Date' ? 
            <>
                    <TextField
                      id="datetime-local"
                      label="С"
                      type="datetime-local"
                      defaultValue=""
                      sx={{ width: 250,
                        marginRight:'15px' }}
                      onChange={handleChangeDateStart}
                      InputLabelProps={{
                        shrink: true,
                      }} /><TextField
                        id="datetime-local"
                        label="По"
                        type="datetime-local"
                        defaultValue=""
                        sx={{ width: 250,
                          marginRight:'15px' }}
                        onChange={handleChangeDateEnd}
                        InputLabelProps={{
                          shrink: true,
                        }} />
              </> : ''
      }
      {filterBy === 'level' ?
                 <Box>
                    <InputLabel id="demo-multiple-checkbox-label">Значение</InputLabel>
                    <Select 
                    sx={{height:'56px',
                          width:'200px',
                          marginRight:'15px'}}
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={filterValue}
                    label="Метод фильтрации"
                    onChange={handleChangeFilterValue}
                    input={<OutlinedInput label="Значение" />}
                    renderValue={(selected) =>  selected.map((el:any)=>iconImages[el-1])}
                    >
                      {
                        levels.map((el,index:any)=>(
                          <MenuItem 
                          value={index+1}
                          key={index+1}
                          >
                          <Checkbox checked={filterValue.indexOf(index+1) > -1} />
                          <Box sx={{display:'flex',
                                    alignItems:'center'}}>
                            <Box sx={{marginRight:'5px'}} >{iconImages[index]}</Box> <Box>{el}</Box>
                          </Box>
                        </MenuItem>
                        ))
                      }
                    </Select>
                  </Box> : ''}
      <Button 
        sx={{marginRight:'15px'}}
        variant="outlined"  
        color="success"
        onClick={filterByMethod}
        // eslint-disable-next-line no-mixed-operators
        disabled = {filterBy === 'Date' ? (dateStart || dateEnd  ? false : true):
        filterBy === 'level' ? (filterValue.length ? false : true):true
       }>
        Применить
      </Button>
      <Button 
        sx={{marginRight:'15px'}}
        variant="outlined" color="error"  onClick={()=>{
          setShowFilter(false);
          filterClear();
          }}>
        Отменить
       </Button>
      <Button 
        sx={{marginRight:'15px'}}
        disabled={!arrayFilters.length ? true : false}
        variant="outlined"  onClick={()=>{
          setArrayFilters([]);
          filterClear();
          setShowFilter(false);
          setTableElements(filters(rows.data,[]));
          }}>
        Очистить
       </Button>
          </Box>
           : ''
        }
        <Table 
          stickyHeader aria-label="sticky table"
          size="small"
        >
          <SortTalbeHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {tableElements
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.logNum}>
                    {headerData.map((column) => {
                      let value:React.ReactElement |string |number = row[column.id];
                      if(column.id === 'level'){
                        value = iconImages[(row.level-1)]
                      }
                      if(column.id === 'dateTime'){
                        value = row.dateTime.slice(0,16).replace('T','\n')
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={tableElements.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}