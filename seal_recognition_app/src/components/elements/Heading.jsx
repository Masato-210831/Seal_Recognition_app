 import React from 'react'
 import { Box, Typography } from '@mui/material'
 
 const Heading = ({word}) => {
   return (
     <>
      <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize:"24px",
              display: "inline",
              borderBottom: 3,
              borderColor: "#A6A6A6",
              pb: "3px",
            }}
          >
            {word}
          </Typography>
        </Box> 
     </>
   )
 }
 
 export default Heading
 