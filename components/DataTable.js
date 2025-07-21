import React from 'react';
import styles from '@/styles/users.module.css';

export default function DataTable({ columns, data, loading, error, onStopAccount }) {
  return (
    <div className={styles.tableWrapper}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
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
                <td colSpan={columns.length + (onStopAccount ? 1 : 0)} style={{ textAlign: 'center', padding: '8px' }}>
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
      )}
    </div>
  );
}
