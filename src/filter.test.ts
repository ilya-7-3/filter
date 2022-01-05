import filters from "./filter";

test('adds filter by Date and level', ()=>{
    const rows = [
        {logNum:18, level:3, dateTime: '2021-12-15T14:00:40.708Z', target: 'senes 12', source: 'sys',description:'description'},
        {logNum:19, level:3, dateTime: '2021-12-15T14:30:40.708Z', target: 'senes 14', source: 'sys',description:'description'},
        {logNum:20, level:2, dateTime: '2021-12-15T15:00:40.708Z', target: 'senes 15', source: 'sys',description:'description'},
        {logNum:21, level:2, dateTime: '2021-12-15T15:30:40.708Z', target: 'senes 17', source: 'sys',description:'description'},
        {logNum:22, level:1, dateTime: '2021-12-15T16:00:40.708Z', target: 'senes 33', source: 'sys',description:'description'},
        {logNum:23, level:1, dateTime: '2021-12-15T16:30:40.708Z', target: 'senes 19', source: 'sys',description:'description'}
    ];
    const result = [
        {logNum:22, level:1, dateTime: '2021-12-15T16:00:40.708Z', target: 'senes 33', source: 'sys',description:'description'},
        {logNum:23, level:1, dateTime: '2021-12-15T16:30:40.708Z', target: 'senes 19', source: 'sys',description:'description'}
    ];
    const arrayFilters = [
        {
          "Date": [
            "2021-12-15T15:00",
            ""
          ]
        },
        {
          "level": [
            1
          ]
        }
      ]
    expect(filters(rows, arrayFilters)).toEqual(result);
    expect(filters(rows, [])).toEqual(rows);
    expect(filters([], [])).toEqual([]);
    
    
});
