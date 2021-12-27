const filters = (rows: never[],dateStart:string,
  dateEnd:string,filterValue:any | string,newArrayFilters:any) => {
 
enum Method{
  Interval='Interval',
  More='More',
  Less='Less',
  Equals='Equals',
  NotEqual='NotEqual'
}


    let newRows: never[] = [...rows];
    newArrayFilters.map((el:any)=>{
    let filterMethod = Object.keys(el)[0];
    filterValue = Object.values(el)[0];
    
  switch(filterMethod){
    case Method.Interval:
      let dateStart =  Object.values(el)[0] as string
      let dateEnd =  Object.values(el)[0] as string
      let start = dateStart[0] ? dateStart[0] : '0';
      let end = dateEnd[1] ? dateEnd[1] : '9999-12-15T12:00:40.708Z';
    
        newRows = newRows.filter((el:any)=>{
          let sliceData = el.dateTime.slice(0,16);
          if(sliceData>=start && sliceData<=end) return true 
        })
  
     break;

    case Method.More:
        newRows = newRows.filter((el:any)=>{
        if(el.level<filterValue) return true
      })
      break;

    case Method.Less:
        newRows = newRows.filter((el:any)=>{
        if(el.level>filterValue) return true
      })
      break;  

    case Method.Equals:
    newRows = newRows.filter((el:any)=>{
        if(el.level === Number(filterValue)) return true
      })
      break;    

     case Method.NotEqual:
    newRows = newRows.filter((el:any)=>{
        if(el.level !== Number(filterValue)) return true
      })
      break;    
  }
  console.log('___',filterMethod, Object.values(el)[0],  newRows)
  
  })

  return newRows;

  
}
export default filters;