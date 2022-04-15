import React, { useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

const Table = ({ titles = [], items = [], totalItems = items.length, maxPageItems = 10 }) => {
  const totalNumberOfItems = Number(totalItems)
  const [maxPerPage, setMaxPerPage] = useState(Number(maxPageItems))
  const [currentPage, setCurrentPage] = useState(1)
  const defaultPageItemNumbers = [10, 20, 30, 40, 50]
  const pageItemNumbers = (defaultPageItemNumbers.includes(maxPerPage) ? defaultPageItemNumbers : defaultPageItemNumbers.concat([maxPerPage])).sort(
    (a, b) => b - a
  )

  const minIndex = (currentPage - 1) * maxPerPage
  const maxIndex = currentPage * maxPerPage - 1

  const getRowsFromItems = () => {
    const rows = []

    items.forEach((obj, idx) => {
      if (idx <= maxIndex && idx >= minIndex) {
        const indexedItem = {}
        const mustHaveIndexes = new Array(titles.length - 1).fill(undefined)

        Object.entries(obj).forEach(([key, val]) => {
          const index = titles.findIndex((str) => str.toLowerCase() === key.toLowerCase())

          if (index !== -1) {
            indexedItem[index] = val
            mustHaveIndexes[index] = val
          }
        })

        mustHaveIndexes.forEach((val, idx) => {
          if (!val) {
            indexedItem[idx] = ''
          }
        })

        if (Object.keys(indexedItem).length === titles.length) {
          rows.push(indexedItem)
        }
      }
    })

    return rows
  }

  const onChangeMaxPerPage = (e) => {
    const val = Number(e.target.value)

    setMaxPerPage(val)
  }

  const clickPageBack = () => {
    setCurrentPage((prev) => {
      if (prev === 1) {
        return prev
      }

      return prev - 1
    })
  }

  const clickPageForward = () => {
    setCurrentPage((prev) => {
      if (currentPage >= totalNumberOfItems / maxPerPage) {
        return prev
      }

      return prev + 1
    })
  }

  const styles = {
    container: {
      width: '90%',
      marginBottom: '1rem',
      padding: '0.5rem 0',
      backgroundColor: 'var(--bright)',
      borderRadius: '1rem',
      border: '1px solid var(--olive)',
      color: 'var(--olive)',
      boxShadow: '0px 1px 3px 0px grey',
    },
    tableWrap: {
      width: '100%',
    },
    row: {
      padding: '0.7rem 1rem',
      borderBottom: '1px solid var(--olive)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    cell: {
      width: `${100 / titles.length}%`,
      fontSize: '0.9rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      cursor: 'pointer',
    },
    controls: {
      width: '100%',
      marginTop: '1rem',
      fontSize: '0.9rem',
      textAlign: 'right',
    },
    selector: {
      padding: '0.2rem 0.3rem',
      marginRight: '1rem',
      borderRadius: '7px',
      borderColor: 'lightgrey',
      cursor: 'pointer',
    },
  }

  const TableCellContent = ({ item, style = {} }) => {
    const ref = useRef(null)
    const [isCopied, setIsCopied] = useState(false)

    const value = item ?? '-'

    const clickCopy = () => {
      if (!isCopied) {
        setIsCopied(true)
        navigator.clipboard.writeText(value)
        setTimeout(() => {
          setIsCopied(false)
        }, 1000)
      }
    }

    return (
      <div ref={ref} style={style} onClick={clickCopy}>
        {isCopied ? 'Copied 👍' : value}
        &nbsp;
      </div>
    )
  }

  const tableRows = getRowsFromItems()

  return (
    <div style={styles.container}>
      <div style={styles.tableWrap}>
        <div style={styles.row}>
          {titles.map((str, idx) => (
            <div key={`key-${idx}-${str}`} style={{ ...styles.cell, width: idx === 0 ? '100%' : '100px', textAlign: 'center' }}>
              {str}
            </div>
          ))}
        </div>

        {!tableRows.length ? (
          <div style={styles.row}>
            <TableCellContent item='No data' style={{ ...styles.cell, width: '100%' }} />
          </div>
        ) : (
          tableRows.map((obj, idx1) => (
            <div key={`key-${idx1}-${JSON.stringify(obj)}`} style={styles.row}>
              {Object.values(obj).map((val, idx2) => (
                <TableCellContent
                  key={`key-${idx1}-${idx2}-${val}`}
                  item={val}
                  style={{ ...styles.cell, width: idx2 === 0 ? '100%' : '100px', textAlign: idx2 === 0 ? 'left' : 'center' }}
                />
              ))}
            </div>
          ))
        )}
      </div>

      <div style={styles.controls}>
        Rows per page:&nbsp;
        <select value={maxPerPage} onChange={onChangeMaxPerPage} style={styles.selector}>
          {pageItemNumbers.map((num, idx) => (
            <option key={`key-${idx}-${num}`} value={num}>
              {num}
            </option>
          ))}
        </select>
        &nbsp;
        {minIndex + 1}-{maxIndex > totalNumberOfItems ? totalNumberOfItems : maxIndex + 1}
        &nbsp;of&nbsp;{totalNumberOfItems}
        <IconButton onClick={clickPageBack}>
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton onClick={clickPageForward}>
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default Table
