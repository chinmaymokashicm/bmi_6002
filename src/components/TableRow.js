function TableRow(row) {
  return (
    <div>
      {row.map((cell) => (
        <td>{cell}</td>
      ))}
    </div>
  );
}

export default TableRow;
