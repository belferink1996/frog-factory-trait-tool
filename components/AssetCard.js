import { Fragment } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'

function AssetCard({ name, imageSrc, itemUrl = 'https://pool.pm', onClick, spanArray, style = {} }) {
  return (
    <Card sx={{ margin: '1rem 2rem', borderRadius: '1rem', overflow: 'visible', ...style }}>
      <CardActionArea style={{ display: 'flex', flexDirection: 'column' }} onClick={() => (onClick ? onClick() : window.open(itemUrl, '_blank'))}>
        <CardMedia
          component='img'
          image={imageSrc}
          alt=''
          sx={{
            width: '250px',
            height: '250px',
            borderRadius: '1rem 1rem 0 0',
          }}
        />
        <CardContent style={{ width: '100%' }}>
          <Typography variant='body2' color='text.secondary'>
            {name ? (
              <Fragment>
                {name}
                <br />
              </Fragment>
            ) : null}

            {spanArray &&
              spanArray.map((txt) => (
                <Fragment key={txt}>
                  <span style={{ fontSize: '0.6rem' }}>{txt}</span>
                  <br />
                </Fragment>
              ))}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default AssetCard
