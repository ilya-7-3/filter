import {Data} from './TableDataProvider/useDatalog'
enum Method{
  Date='Date',
  Level='level'
}
const filters = (rows: Data[],newArrayFilters:any) => {
 

  let newRows: Data[] = [...rows];
  newArrayFilters.map((el:any)=>{
  let filterMethod = Object.keys(el)[0];
  let filterValue = Object.values(el)[0] as [];
    
  switch(filterMethod){
    case Method.Date:
      let dateStart =  Object.values(el)[0] as string
      let dateEnd =  Object.values(el)[0] as string
      let start = dateStart[0] ? dateStart[0] : '0';
      let end = dateEnd[1] ? dateEnd[1] : '9999-12-15T12:00:40.708Z';
      
        newRows = newRows.filter((el:any)=>{
          let sliceData = el.dateTime.slice(0,16);
          if(sliceData>=start && sliceData<=end) return true 
        })
  
     break;

    case Method.Level:
    newRows = newRows.filter((el:any)=>{
      let bool = false;
        filterValue.forEach((element :any)=> {
          if(el.level === element) bool=true;
        });
        if(bool) return true;
      })
      break;    
  }

})

  return newRows;

  
}
export default filters;