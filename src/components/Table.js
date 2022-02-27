function Table(columns, tableDataArray) {
  return(
    <div className="table">
          {/* ✅ ❌ */}
          {columns.length > 1 && (
            <table align="center" border="2">
              <thead>
                <tr>
                  {columns.map((columnName) => (
                    <th key={columnName}>{columnName} </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableDataArray.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
  )
}

export default Table;
