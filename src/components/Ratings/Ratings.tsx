import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function Ratings() {
  return (
    <Stack spacing={1}>
      <Rating 
        name="half-rating" 
        defaultValue={0.1} 
        precision={0.1} 
        onChangeActive={(event, newHover) => {
        console.log(newHover)
        }}/>
        
    </Stack>
  );
}
