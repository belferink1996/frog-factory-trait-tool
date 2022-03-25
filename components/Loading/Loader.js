import { Children } from 'react'
import classes from './Loader.module.css'

const animationDelays = [
  '0s',
  '-1.4285714286s',
  '-2.8571428571s',
  '-4.2857142857s',
  '-5.7142857143s',
  '-7.1428571429s',
  '-8.5714285714s',
  '-10s',
]

const Loader = () => {
  return (
    <div className={classes.root}>
      <div className={classes.loading}>
        {Children.toArray(
          animationDelays.map((value) => (
            <div
              className={classes.loaderSquare}
              style={{ animationDelay: value }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Loader
