import { useEffect, useState } from "react"

interface Data {
    logNum: number;
    level: number;
    dateTime: string;
    target: string;
    source: string;
    description: string;
}

const dummyData: Array<Data> = [
    {logNum:1, level:2, dateTime: '2021-12-15T05:30:40.708Z', target: 'senes 12', source: 'sys',description:'description'},
    {logNum:2, level:3, dateTime: '2021-12-15T06:00:40.708Z', target: 'senes 13', source: 'sys',description:'description'},
    {logNum:3, level:1, dateTime: '2021-12-15T06:30:40.708Z', target: 'senes 14', source: 'sys',description:'description'},
    {logNum:4, level:3, dateTime: '2021-12-15T07:00:40.708Z', target: 'senes 15', source: 'sys',description:'description'},
    {logNum:5, level:2, dateTime: '2021-12-15T07:30:40.708Z', target: 'senes 16', source: 'sys',description:'description'},
    {logNum:6, level:3, dateTime: '2021-12-15T08:00:40.708Z', target: 'senes 17', source: 'sys',description:'description'},
    {logNum:7, level:1, dateTime: '2021-12-15T08:30:40.708Z', target: 'senes 18', source: 'sys',description:'description'},
    {logNum:8, level:1, dateTime: '2021-12-15T09:00:40.708Z', target: 'senes 19', source: 'sys',description:'description'},
    {logNum:9, level:3, dateTime: '2021-12-15T09:30:40.708Z', target: 'senes 20', source: 'sys',description:'description'},
    {logNum:10, level:1, dateTime: '2021-12-15T10:00:40.708Z', target: 'senes 21', source: 'sys',description:'description'},
    {logNum:11, level:1, dateTime: '2021-12-15T10:30:40.708Z', target: 'senes 22', source: 'sys',description:'description'},
    {logNum:12, level:2, dateTime: '2021-12-15T11:00:40.708Z', target: 'senes 23', source: 'sys',description:'description'},
    {logNum:13, level:1, dateTime: '2021-12-15T11:30:40.708Z', target: 'senes 19', source: 'sys',description:'description'},
    {logNum:14, level:2, dateTime: '2021-12-15T12:00:00.708Z', target: 'senes 19', source: 'sys',description:'description'},
    {logNum:15, level:1, dateTime: '2021-12-15T12:30:40.708Z', target: 'senes 22', source: 'sys',description:'description'},
    {logNum:16, level:1, dateTime: '2021-12-15T13:00:40.708Z', target: 'senes 34', source: 'sys',description:'description'},
    {logNum:17, level:3, dateTime: '2021-12-15T13:30:40.708Z', target: 'senes 19', source: 'sys',description:'description'},
    {logNum:18, level:3, dateTime: '2021-12-15T14:00:40.708Z', target: 'senes 12', source: 'sys',description:'description'},
    {logNum:19, level:3, dateTime: '2021-12-15T14:30:40.708Z', target: 'senes 14', source: 'sys',description:'description'},
    {logNum:20, level:2, dateTime: '2021-12-15T15:00:40.708Z', target: 'senes 15', source: 'sys',description:'description'},
    {logNum:21, level:2, dateTime: '2021-12-15T15:30:40.708Z', target: 'senes 17', source: 'sys',description:'description'},
    {logNum:22, level:1, dateTime: '2021-12-15T16:00:40.708Z', target: 'senes 33', source: 'sys',description:'description'},
    {logNum:23, level:1, dateTime: '2021-12-15T16:30:40.708Z', target: 'senes 19', source: 'sys',description:'description'}
];

export const useDatalog = () => {
    const [data, setData] = useState<Array<Data>>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        setData([...dummyData]);
        setIsLoading(true);
    },[])

    return{
        data,
        isError,
        isLoading
    }
}