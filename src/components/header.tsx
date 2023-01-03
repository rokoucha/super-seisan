import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

export const Header: React.FC = () => {
  return (
    <AppBar
      position="relative"
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar
        sx={{
          flexWrap: 'wrap',
          maxWidth: 'md',
          ml: 'auto',
          mr: 'auto',
          width: '100%',
        }}
      >
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          スーパー精算
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
