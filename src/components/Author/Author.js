import React, { useEffect, useState } from "react";
import NavBar from "../Dashboard/NavBar";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Author = ({ Info }) => {
    const [author, setAuthor] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [createAuthor, setCreateAuthor] = useState({
        name: "",
        bio: "",
    });
    const [updateAuthor, setUpdateAuthor] = useState({
        name: "",
        bio: "",
    });
    const [errors, setErrors] = useState({});
    const config = {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Info?.token}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://192.168.1.108:3002/authors?page=${currentPage}`,config
                );
                if (response.status === 200) {
                    if (response.data.length == 0) {
                        setTotalPages(currentPage - 1);
                        setCurrentPage(currentPage - 1);
                    } else {
                        setTotalPages(currentPage + 1);
                    }
                    setAuthor(response.data);
                  
                }
            } catch (error) {
                toast.error("Something went wrong ")
              
            }
        };

        fetchData();
    }, [currentPage,!loading]);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const HandleCreateForm = (e) => {
        const { name, value } = e.target;
        setCreateAuthor((prevBooks) => {
          return {
            ...prevBooks,
            [name]: value
          };
        });
        setUpdateAuthor((prevBooks) => {
            return {
              ...prevBooks,
              [name]: value
            };
          });
      };

    const handleAuthorSubmit = async (e) => {
        try {
            if (validateForm()) {
                
                const response = await axios.post(
                    "http://192.168.1.108:3002/authors",
                    createAuthor,config
                );
             
                if (response.status === 201) {
                    toast.success("Author Created Successfully");
                    setLoading(!loading)
                    setCreateAuthor({
                        name: "",
                        bio: "",
                    });
                }
            }
        } catch (error) {
          
            toast.error("An error occurred while creating the author");
        }
    };

    const DeleteAuthorDetails = async (authorId) => {
        try {

            const response = await axios.delete(
                `http://192.168.1.108:3002/authors/${authorId}`,config
            );
            if (response.status === 204) {
                toast.success("Book Deleted successfully");
                setLoading(!loading)
            }
        } catch (error) {
            toast.error("An error occurred while deleting the author");
        }
    };

    const UpdateAuthorDetails = (authorId) => {
        const newAuthData = author.filter((obj) => obj.id === authorId);

        setUpdateAuthor({
            id: newAuthData[0].id,
            name: newAuthData[0].name,
            bio: newAuthData[0].bio
        });
    };

    const handleUpdateAuthorSubmit = async () => {
        try {
          const response = await axios.patch(
            `http://192.168.1.108:3002/authors/${updateAuthor?.id}`,
            updateAuthor,
            config
          );
      
          if(response.status==200){
              toast.success("Author's Detail Updated Successfully")
              setLoading(!loading)
              setCreateAuthor({
                name: "",
                bio: "",
            });
          }
        } catch (error) {
          toast.error("Something went Wrong")
         
        }
      };
      

    const validateForm = () => {
        const errors = {};
        if (!createAuthor.name.trim()) {
            errors.name = "Name is required";
        }
        if (!createAuthor.bio.trim()) {
            errors.bio = "Biography is required";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const CloseDATA = () => {
        setCreateAuthor({
            name: "",
            bio: "",
        });
    };

    return (
        <div>
            <NavBar Info={Info}/>
            <div className="m-1 p-2 bg-light">
                <div className="p-3 row bg-secondary">
                    <div class="col-sm-6">
                        <Link
                            className="btn btn-primary"
                            data-toggle="modal"
                            data-target="#myModal2"
                        >
                            CREATE AUTHOR
                        </Link>
                    </div>
                    <div class="col-sm-6">
                        <h4 className="">ALL Author</h4>
                    </div>
                </div>

                <table className="table table-hover table-bordered ">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Biography</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {author.map((obj) => (
                            <tr key={obj.id}>
                                <td>{obj.id}</td>
                                <td>{obj.name}</td>
                                <td>{obj.bio}</td>
                                <td>
                                    <Link
                                        className="btn btn-primary"
                                        data-toggle="modal"
                                        data-target="#myModal1"
                                        onClick={() => UpdateAuthorDetails(obj.id)}
                                    >
                                        Update
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        className="btn btn-danger"
                                        onClick={() => DeleteAuthorDetails(obj.id)}
                                    >
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <a className="page-link" href="#" onClick={prevPage}>
                            Previous
                        </a>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li
                            key={index + 1}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""
                                }`}
                        >
                            <a
                                className="page-link"
                                href="#"
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </a>
                        </li>
                    ))}
                    <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                            }`}
                    >
                        <a className="page-link" href="#" onClick={nextPage}>
                            Next
                        </a>
                    </li>
                </ul>
            </div>

            {/* {/ modal2 /} */}

            <div className="modal" id="myModal2">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="name">NAME:</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="name"
                                        value={createAuthor.name}
                                        onChange={HandleCreateForm}
                                        placeholder="Enter name"
                                        name="name"
                                        required
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="bio">BIOGRAPHY:</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="bio"
                                        value={createAuthor.bio}
                                        onChange={HandleCreateForm}
                                        placeholder="Enter biograpy"
                                        name="bio"
                                        required
                                    />
                                </div>
                                <Link
                                    type="submit"
                                    class="btn btn-primary"
                                    onClick={handleAuthorSubmit}
                                    data-dismiss="modal"
                                >
                                    Submit
                                </Link>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={CloseDATA}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* {/ modal 1 /} */}

            <div className="modal" id="myModal1">
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="name">NAME:</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="name"
                                        value={updateAuthor.name}
                                        onChange={HandleCreateForm}
                                        placeholder="Enter name"
                                        name="name"
                                        required
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="bio">BIOGRAPHY:</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="bio"
                                        value={updateAuthor.bio}
                                        onChange={HandleCreateForm}
                                        placeholder="Enter biograpy"
                                        name="bio"
                                        required
                                    />
                                </div>
                                <Link
                                    type="submit"
                                    class="btn btn-primary"
                                    onClick={handleUpdateAuthorSubmit}
                                    data-dismiss="modal"
                                >
                                    Submit
                                </Link>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={CloseDATA}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Author;
