import {render, screen} from '@testing-library/react';
import List from './List';

const data = ['html','css','js'];
describe('List component',()=>{
    test('List renders',()=>{
         render(<List items={data}/>);
         const liElement = screen.getByText(/html/i);
        expect(liElement).toBeInTheDocument(); 
    }) 
    
})