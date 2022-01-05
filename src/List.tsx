const List = (props: any) => {
    const {items = []} = props;
    if(!items.length) return null;
    return(
        <ul>
            {
                items.map((el:any)=>(
                    <li key={el}>{el}</li>
                ))
            }
        </ul>
    )
}

export default List;