import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const DynamicTable2 = ({ TableData }) => {
  const openPDF = (pdfBuffer) => {
    console.log("pdfis:", pdfBuffer);
    // Convert the Buffer data to a Blob
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Open the PDF in a new tab
    window.open(url, '_blank');
  };

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (TableData.length > 0) {
      setColumns(Object.keys(TableData[0]));
    }
  }, [TableData]);

  return (
    <section className="sec">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column}>{column}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TableData.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {columns.map((column) => (
                  <StyledTableCell key={column}>
                    {column === 'material' ? (
                      <button onClick={() => openPDF(row[column])}>
                        Open PDF
                      </button>
                    ) : (
                      row[column]
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default DynamicTable2;
