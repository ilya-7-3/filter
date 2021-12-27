import * as React from 'react';
import {
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


interface Data {
  logNum: number;
  level: number;
  dateTime: string;
  target: string;
  source: string;
  description: string;
}

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
  const [filterMethod, setFilterMethod] = React.useState('');
  const [dateStart, setDateStart] =React.useState("");
  const [dateEnd, setDateEnd] =React.useState("");
  const [filterValue, setFilterValue] =React.useState('');
  const [arrayFilters, setArrayFilters] = React.useState<any>([]);
  const rows = useDatalog();
  const [tableElements, setTableElements] = React.useState([]);
  const error = !tableElements.length && arrayFilters.length ? true : false;
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  console.log('error',error)
  const handleChangeShowFilter = () => {
    if(!showFilter) filterClear()
    setShowFilter(!showFilter)
  };

  const filterByMethod  = () =>{
    setShowFilter(false);
    let map = new Map();
    const spliceArray = arrayFilters.map((a:any) => ({...a}));
    arrayFilters.forEach((el:any,index:number)=>{
      if(Object.keys(el)[0] === filterMethod && Object.keys(el)[0] === 'Interval'){
        spliceArray.splice(index,1)                                                         
      }
    })
    
    map.set(filterMethod, !filterValue? [dateStart,dateEnd]:filterValue);
    const array = rows.data;
    const newArrayFilters = [...spliceArray, Object.fromEntries(map.entries())]; 
    setArrayFilters([...newArrayFilters]);
    setTableElements(filters(array as never[],dateStart,dateEnd,filterValue,[...newArrayFilters]));
  }
  console.log('tableElements', tableElements)
  console.log('arrayFilters', arrayFilters)

  const filterClear  = () =>{
    setFilterBy('');
    setFilterMethod('');
    setFilterValue('');
    setDateStart('')
    setDateEnd('');
  }
  
  const handleChangeColumn = (event: SelectChangeEvent) => {
    filterClear();
    setFilterBy(event.target.value as string);
  };

  const handleChangeFilterMethod = (event: SelectChangeEvent) => {
    setFilterMethod(event.target.value as string);
  };
  const handleChangeFilterValue = (e: SelectChangeEvent) => {
    setFilterValue(e.target.value as string);
  };
 
  const handleChangeDateStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStart(e.target.value);
  };
  const handleChangeDateEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateEnd(e.target.value);
  };
 const  handleDelete = (index:number) => {
  const spliceArray = arrayFilters.map((a:any) => ({...a}));
  spliceArray.splice(index,1)
   setArrayFilters(spliceArray) 
   setTableElements(filters(rows.data as  never[],dateStart,dateEnd,filterValue,[...spliceArray]));
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
        <FilterListIcon/>
        </IconButton>
        </Tooltip>
        </Toolbar>
        <Box sx={{display:'flex',
                  justifyContent:'end'}}>
          {arrayFilters.length ? 
                arrayFilters.map((el:any,index:number)=>{
                  return(
                    <Chip key={index}
                    sx={{marginRight:'5px'}}
                    label={
                    <Box sx={{marginTop:'3px',
                    display:'flex',
                    alignItems:'center'}}>
                      <span>{Object.keys(el)[0]}</span>
                      <span> {Object.keys(el)[0]==='Interval' ? `_${el.Interval[0]}  ${el.Interval[1]} ` :iconImages[Object.values(el)[0] as number- 1]}</span>
                    </Box>}
                    onDelete={()=>handleDelete(index)}  />
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
          <MenuItem value={''}>Объекту</MenuItem>
          <MenuItem value={''}>Источнику</MenuItem>
          <MenuItem value={''}>Описанию</MenuItem>
        </Select>
        </Box>
        <Box>      
                <InputLabel id="demo-simple-select-label">Метод фильтрации</InputLabel>
                    <Select 
                    sx={{width:'160px',
                    marginRight:'15px'}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filterMethod}
                    label="Метод фильтрации"
                    onChange={handleChangeFilterMethod}
                    disabled={!filterBy ? true : false}
                  >
                    
                    {filterBy === 'Date' ?<MenuItem value={'Interval'}>Промежуток</MenuItem>:''}
                    {filterBy === 'level' ?  
                    [
                    <MenuItem key={1} value={'More'}>Больше</MenuItem>,
                    <MenuItem  key={2} value={'Less'}>Меньше</MenuItem>,
                    <MenuItem  key={3} value={'Equals'}>Равно</MenuItem>,
                    <MenuItem  key={4} value={'NotEqual'}>Не равно</MenuItem>
                    ]
                     : ''}
                  </Select>
              </Box>
        {filterMethod === 'Interval' ? 
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
                    <InputLabel id="demo-simple-select-label">Значение</InputLabel>
                    <Select 
                    sx={{height:'56px',
                          width:'200px',
                          marginRight:'15px'}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filterValue}
                    label="Метод фильтрации"
                    onChange={handleChangeFilterValue}
                    disabled={!filterMethod ? true : false}
                    >
                      <MenuItem value={'1'}>
                        <Box sx={{display:'flex',
                                  alignItems:'center'}}>
                          <Box sx={{marginRight:'5px'}} >{iconImages[0]}</Box> <Box>Ошибка</Box>
                        </Box>
                      </MenuItem>
                      <MenuItem value={'2'}>
                        <Box sx={{display:'flex',
                                  alignItems:'center'}}>
                          <Box  sx={{marginRight:'5px'}}>{iconImages[1]}</Box> <Box>Предупреждение</Box>
                          </Box>
                      </MenuItem>
                      <MenuItem value={'3'}>
                        <Box sx={{display:'flex',
                                  alignItems:'center'}}>
                          <Box sx={{marginRight:'5px'}}>{iconImages[2]}</Box> <Box>Уведомление</Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </Box> : ''}
      <Button 
        sx={{marginRight:'15px'}}
        variant="outlined"  
        color="success"
        onClick={filterByMethod}
        disabled = {filterValue || dateStart || dateEnd ? false : true}>
        Применить
      </Button>
      <Button 
        sx={{marginRight:'15px'}}
        disabled={!filterBy ? true : false}
        variant="outlined" color="error"  onClick={filterClear}>
        Отменить
       </Button>
       <Button 
        sx={{marginRight:'15px'}}
        disabled = {filterValue || dateStart || dateEnd ? false : true}
        variant="outlined">
        Добавить
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
            {rows.data
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
        count={rows.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}