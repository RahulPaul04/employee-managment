import { useState, useEffect } from 'react';
import './App.css';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function App() {
  const [addemp, setaddemp] = useState(false);
  const [empname, setempname] = useState("");
  const [empmail, setempmail] = useState("");
  const [empusername, setempusername] = useState("");
  const [idarray, setidarray] = useState([]);
  const [usernamearray, setusernamearray] = useState([]);
  const [emailarray, setemailarray] = useState([]);
  const [activearray, setactivearray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/employee');
        if (response.ok) {
          const data = await response.json();
          const ids = data.map(emp => emp.id);
          const usernames = data.map(emp => emp.username);
          const emails = data.map(emp => emp.email);
          const statuses = data.map(emp => emp.status);
          setidarray(ids);
          setusernamearray(usernames);
          setemailarray(emails);
          setactivearray(statuses);
        } else {
          console.error('Failed to fetch employees');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const uploademp = async (emp) => {
    try {
      const response = await fetch('http://localhost:3000/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emp),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Employee added:', data);
        setidarray([...idarray, data.id]);
        setusernamearray([...usernamearray, data.username]);
        setemailarray([...emailarray, data.email]);
        setactivearray([...activearray, data.status]);
      } else {
        console.error('Failed to add employee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addemployee = () => {
    const newEmp = {
      username: empusername,
      email: empmail,
      status: true
    };
    uploademp(newEmp);
    setaddemp(false);
  };

  const changestatus = (e, index) => {
    const newStatus = e.target.value;
    const updatedActiveArray = [...activearray];
    updatedActiveArray[index] = newStatus;
    setactivearray(updatedActiveArray);

    const employeeId = idarray[index];
    fetch(`http://localhost:3000/employee/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(response => {
        if (response.ok) {
          console.log(`Status updated for employee id ${employeeId}`);
        } else {
          console.error('Failed to update status');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const deleteemployee = async (index) => {
    const employeeId = idarray[index];
    try {
      const response = await fetch(`http://localhost:3000/employee/${employeeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log(`Employee with id ${employeeId} deleted`);
        setidarray(idarray.filter((id, i) => i !== index));
        setusernamearray(usernamearray.filter((username, i) => i !== index));
        setemailarray(emailarray.filter((email, i) => i !== index));
        setactivearray(activearray.filter((status, i) => i !== index));
      } else {
        console.error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1 className='text-center mt-3 mb-3'>Employee Management</h1>
      <div onClick={() => setaddemp(true)} className='text-center'>
        <button className='btn btn-success'>ADD EMPLOYEE</button>
      </div>
      {addemp && <div className="employee-add col-md-6 col-12 text-center d-flex-column align-items-center mx-auto">
        <h2>Add Employee</h2>
        <input onChange={(e) => setempusername(e.target.value)} placeholder='User Name' type="text" className="form-control mt-3 mb-3" />
        <input onChange={(e) => setempmail(e.target.value)} placeholder='E-Mail' type="text" className="form-control mt-3 mb-3" />
        <div className="buttons">
          <button onClick={addemployee} className='btn btn-primary'>ADD</button>
          <button onClick={() => setaddemp(false)} className="ms-2 btn btn-danger">CANCEL</button>
        </div>
      </div>}
      <table className='col-12 mt-5'>
        <thead>
          <tr>
            <th className='text-center fs-3'>Id</th>
            <th className='text-center fs-3'>User Name</th>
            <th className='text-center fs-3'>E-Mail</th>
            <th className='text-center fs-3'>Status</th>
            <th className='text-center fs-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usernamearray && usernamearray.map((user, index) => (
            <tr key={index}>
              <td className='text-center fs-5'>{idarray[index]}</td>
              <td className='text-center fs-5'>{user}</td>
              <td className='text-center fs-5'>{emailarray[index]}</td>
              <td className='text-center fs-5'>
                <FormControl fullWidth>
                  <InputLabel id={`status-label-${index}`}>Status</InputLabel>
                  <Select
                    labelId={`status-label-${index}`}
                    id={`status-select-${index}`}
                    value={activearray[index]}
                    label="Status"
                    onChange={(e) => changestatus(e, index)}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </td>
              <td className='text-center fs-5'>
                <button className='btn btn-danger' onClick={() => deleteemployee(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
