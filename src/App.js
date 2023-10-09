import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";

import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState([{}]);
  const [keys, setKeys] = useState([]);
  const [edit, setEdit] = useState({
    editField : false,
    editValue:null,
    key:null
  });

  const [changedData, setChangedData] = useState({
    editedValue:null,
    key:null
  })
  const inputRef = useRef();
  const changeValueRef = useRef();

  const readExcel = async (file) => {
    try {
      if(file)
      {
        const bufferArray = await file.arrayBuffer();
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        return data;
      }else{

        alert("File not found");
        setData([]);
        setKeys([])
      }
      
     
    } catch (error) {
      console.log("------------------------ - Error While Reading File - -----------------");

    }
  };

  const getData = async () => {
    try {
      const res = await readExcel(inputRef.current.files[0]);
      setData(res);
      inputRef.current.value = null;
    } catch (error) {
      console.error("Error reading Excel:", error);
    }
  };
  const handleTableChange = (event) => {
    const files = event.target.files[0];
    readExcel(files);
  };

  useEffect(() => {
    if(data && data.length>0)
    {
      let arr = data[0];
    let keys = Object.keys(arr);
    setKeys(keys);
    }
    
  }, [data]);

  const handleDownload = () => {
    const templateURL = `${window.location.origin}/../public/my-excel.xlsx`;
    fetch(templateURL)
      .then((response) => response.blob())
      .then((blob) => saveAs(blob, "demo_File.xlsx"))
      .catch((error) => console.error("Error downloading template", error));
  };

  console.log("Data",data); 
  

  return (
    <div>
      <div>
        <nav
          className="navbar navbar-expand-sm"
          style={{ background: "#FFBF00", fontWeight: "bold" }}
        >
          <div className="container-fluid">
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <h4>Fetch Data From Excel</h4>
            </div>
          </div>
          <div>
            <button
              className="btn btn-info mx-2 dbutton"
              onClick={handleDownload}
            >
              Download_Template
            </button>
          </div>
        </nav>
      </div>

      <div
        className=" mt-4"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          className="file-input"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <input
            type="file"
            accept=".xlsx"
            className="btn btn-dark"
            onChange={(event) => {
              handleTableChange(event)
            }}
            ref={inputRef}
          />
        </div>
        <div
          className="mt-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {" "}
          <button className="btn btn-success mx-2" onClick={getData}>
            Submit
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <br />
        </div>
      </div>

      <div>
        <table className="table-bordered ">
          <thead>
            <tr style={{backgroundColor:"#FFAC1C ",color:"black",textAlign:"center"}}>
              {keys?.map((ele,i) => {
                return <th scope="col" key={i}>{ele}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data?.map((ele, i) => {
              return (
                <tr key={i}>
                  {
                    keys.map((ky, j) => {
                      return <td  key={j} 
                                onClick={(e)=>setEdit({...edit,editField:true, editValue:ele[ky], key:i})} >

                                    {ele[ky]}{edit.editField===true && edit.editValue ===ele[ky] && edit.key === i &&
                                            
                                            (<><input type="text"  onChange={(e)=>{ele[ky]=e.target.value}} ></input><button onClick={e=>{setEdit({editField : false,editValue:null, key:null })}}>Save</button></>)} 
                                            
                                          </td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;