import React, { useEffect, useRef, useState } from "react";
import * as xlsx from "xlsx";

const Excel = () => {
  const [excelData, setExcelData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [inputField, setInputField] = useState({
    state: false,
    fieldValue: null,
    fieldKey: null,
  });
  const [inputFieldValue, setInputFieldValue] = useState({
    fieldValue: null,
    fieldKey: null,
    singleKey: null,
  });
  const [sideEffect, setSideEffect] = useState(false);

  const inputRef = useRef(inputField.fieldValue);

  const readExcel = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer(file);
    const excelFile = xlsx.read(data);
    const excelSheet = excelFile.Sheets[excelFile.SheetNames[0]];
    const excelJson = xlsx.utils.sheet_to_json(excelSheet);

    if (excelJson.length > 0) {
      setExcelData(excelJson);
      setKeys(Object.keys(excelJson[0]));
    } else {
      alert("Excel file must contained more than one rows");
    }
  };

  const getInputField = (index, newValue, singleKey) => {
    return (
      inputField.state === true &&
      inputField.fieldKey === index &&
      inputField.fieldValue === newValue && (
        <input
          type="text"
          ref={inputRef}
          onChange={(e) => {
            setInputFieldValue({
              ...inputFieldValue,
              fieldValue: e.target.value,
              fieldKey: index,
              singleKey: singleKey,
            });
          }}
        ></input>
      )
    );
  };

  const saveChanges = () => {
    excelData.map((ele, arrayKey) => {
      if (arrayKey === inputFieldValue.fieldKey) {
        for (let key in ele) {
          if (key === inputFieldValue.singleKey) {
            ele[key] = inputFieldValue.fieldValue;
          }
        }
      }
      return ele;
    });
    setSideEffect(!sideEffect);
  };

  return (
    <div>
      <label htmlFor="">File</label>
      <input
        type="file"
        onChange={(e) => readExcel(e)}
        style={{ border: "1px solid black" }}
      />

      <table className="col-md-12 mt-3">
        <thead>
          <tr className="table table-bordered">
            {/* 
              -- Table Headings
              -- Dynamically Rendered
            */}

            {keys.map((item, index) => {
              return <th key={index}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {
            //Data rendering for Cells
            excelData.map((getData, index) => {
              return (
                <tr key={index} className="table-bordered">
                  {
                    //Matching Keys
                  }
                  {keys.map((singleKey, keyIndex) => {
                    return (
                      <td key={keyIndex}>
                        <span
                          onClick={(e) => {
                            setInputField({
                              ...inputField,
                              state: true,
                              fieldValue: getData[singleKey],
                              fieldKey: index,
                            });
                            if (inputRef.current) {
                              inputRef.current.value = getData[singleKey];
                            }
                          }}
                        >
                          {getData[singleKey]}
                        </span>

                        {
                          // Getting input field
                        }
                        {getInputField(index, getData[singleKey], singleKey)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <button onClick={() => saveChanges()}>Save Changes</button>
    </div>
  );
};

export default Excel;
