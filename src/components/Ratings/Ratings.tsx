import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function Ratings() {
  return (
    <Stack spacing={1}>
      <Rating 
        name="size-large" 
        defaultValue={5} 
        precision={0.1} 
        readOnly
        onChangeActive={(event, newHover) => {
        console.log(newHover)
        }}/>
        
    </Stack>
  );
}
