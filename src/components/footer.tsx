import { Link, Typography } from '@mui/material'
import type React from 'react'

export const Footer: React.FC = () => (
  <Typography
    variant="body2"
    color="text.secondary"
    align="center"
    mt={8}
    mb={4}
  >
    Made by Rokoucha with ❤️
    <br />
    <Link color="inherit" href="https://github.com/rokoucha/super-seisan">
      source code
    </Link>
  </Typography>
)
