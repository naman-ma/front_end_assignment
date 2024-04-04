import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function NavBar({ Info }) {
  // console.log('Info: NavBar in auth', Info);
  const navigate = useNavigate();
  const [enableUser, setEnable] = useState(false);
  const [userData, setUserData] = useState({
    name: Info?.user.name,
    email: Info?.user.email
  });

  const LogoutUser = () => {
    localStorage.removeItem('Info');
    toast.success("User Logout Successfully")
    navigate('/');
  }

  const updateUser = async () => {
    try {
      const response = await axios.patch( `http://192.168.1.108:3000/users/${Info?.id}`,userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Info?.token}`
        },
      });
      if (response.ok) {
        toast.success("User information updated successfully");
      } else {
        toast.error("Failed to update user information");
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("An error occurred while updating user information");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm bg-light">
        <a className="navbar-brand" href="#">
          <img src="favicon.ico" alt="logo" />
        </a>
        <ul className="navbar-nav ml-5">
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/dashboard">Book</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/author">Author</Link>
          </li>
        </ul>
        <div style={{ marginLeft: "70%" }}>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle btn btn-light" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className='fas fa-user-circle' style={{ fontSize: "50px", color: "Blue" }}></i>
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" data-toggle="modal" data-target="#myModal">My Profile</Link>
                <Link className="dropdown-item" onClick={LogoutUser} to='/'>Logout</Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div className="modal" id="myModal" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h6>YOUR INFORMATION</h6>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              {enableUser ?
                <>
                  <input type="text" className="form-control mb-2" name="name" value={userData.name} onChange={handleInputChange} />
                  <input type="text" className="form-control" name="email" value={userData.email} onChange={handleInputChange} />
                </>
                :
                <>
                  <p onClick={() => setEnable(true)}>Name: {Info?.user.name}</p>
                  <p onClick={() => setEnable(true)}>Email: {Info?.user.email}</p>
                </>
              }
            </div>
            <div className="modal-footer">
              {enableUser &&
                <div>
                  <button type="button" className="btn btn-primary className='mr-2'" onClick={updateUser}>Update</button>
                  <button type="button" className="btn btn-danger" onClick={() => setEnable(false)}>Cancel</button>
                </div>
              }
              <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
