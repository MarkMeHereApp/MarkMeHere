'use client';

import React, { useState, useRef } from "react";
import Papa from "papaparse";
import {  Button,
          Card,
          Table,
          TableHead,
          TableRow,
          TableHeaderCell,
          TableBody,
          TableCell,
          Text,
          Title,
          Badge,} from "@tremor/react";
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid'
import Popup from 'reactjs-popup'
import { string } from "prop-types";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false); // added state variable
  const [data, setData] = useState([]);
  const inputRef = useRef();

  const handleUploadCSV = (files) => {
    setUploading(true);

    const [file] = files;

    const reader = new FileReader();``
    reader.onloadend = ({ target }) => {
      const csvData = Papa.parse(target.result, { header: true })["data"];
      setData(csvData);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDragging(true);
    
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(e.target);
    setDragging(false);
  }

  const handleDrop = (e) => {
    console.log('dropped');
    e.preventDefault();
    e.stopPropagation();
    handleUploadCSV(e.dataTransfer.files);
    setDragging(false);
  };

  return (
    <div className="mb-4">
      <Popup
        trigger={
          <Button
            icon={ArrowUpTrayIcon}
            size="xl"
            className="btn btn-primary"
          >
            Import .CSV"
          </Button>
        }
        modal
        nested
      >
        <Card className="max-w-sm">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {data.length ? (
              <Table className="mt-5">
                <TableHead>
                  <TableRow>
                    {Object.keys(data[0]).map((key) => (
                      <TableHeaderCell key={key}>{key}</TableHeaderCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      {Object.keys(item).map((key) => (
                        <TableCell key={key}>{item[key]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Button
                className="ImportantButton"
                size="xl"
                variant={dragging ? 'primary' : 'secondary'}
                color={dragging ? 'neutral' : 'blue'}
                onClick={() => inputRef.current.click()}
                loading={uploading}
              >
                {uploading ? 'Uploading...' : 'Drag and drop .CSV file here'}
              </Button>
            )}
          </div>
  
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => handleUploadCSV(e.target.files)}
          />
        </Card>
      </Popup>
    </div>
  );  
};


Upload.propTypes = {};

export default Upload;