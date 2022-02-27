function Table(arrayColumns, arrayRows) {
  {arrayColumns.length > 1 && (<table>
    <tr>
      {arrayColumns.map((columnName) => {
        <th>{columnName}</th>;
      })}
    </tr>
    <tr>
      <td>Alfreds Futterkiste</td>
      <td>Maria Anders</td>
      <td>Germany</td>
    </tr>
    <tr>
      <td>Centro comercial Moctezuma</td>
      <td>Francisco Chang</td>
      <td>Mexico</td>
    </tr>
  </table>)}
}

export default Table;
