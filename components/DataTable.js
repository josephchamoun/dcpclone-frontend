'use client';

import React from 'react';
import styles from '@/styles/users.module.css';

export default function DataTable({ columns, data, loading, error, onStopAccount }) {
  return (
    <div className={styles.tableContainer}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Desktop Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
              {onStopAccount && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onStopAccount ? 1 : 0)}
                  style={{ textAlign: 'center', padding: '8px' }}
                >
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                  {onStopAccount && (
                    <td>
                      <button className={styles.stopButton} onClick={() => onStopAccount(row)}>
                        Stop Account
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.cardList}>
        {data.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '10px' }}>No data found.</p>
        ) : (
          data.map((row, idx) => (
            <div className={styles.card} key={idx}>
              {columns.map((col) => (
                <div className={styles.cardRow} key={col.key}>
                  <strong>{col.header}: </strong> <span>{row[col.key]}</span>
                </div>
              ))}
              {onStopAccount && (
                <button className={styles.stopButton} onClick={() => onStopAccount(row)}>
                  Stop Account
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
