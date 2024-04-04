
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Books({Info}) {
    const [books, setBooks] = useState([]);
  const [filteredBook, setFilteredBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState({
    title: "", author: ""
  });
  const [newcreatebooks, setNewCreateBooks] = useState({
    title: "", author: "", description: ""
  })
  const [createbooks, setCreateBooks] = useState({
    title: "", author: "", description: ""
  })

  const [errors, setErrors] = useState({});
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${Info.token}`,
    },
  };
  useEffect(() => {
    axios.get(`http://192.168.1.108:3001/books?page=${currentPage}`).then((res) => {
      console.log('res: ', res);
      if (res.status === 200) {
        if (res.data.length == 0) {
          setTotalPages(currentPage - 1)
          setCurrentPage(currentPage - 1)
        } else {

          setTotalPages(currentPage + 1)
        }
        setBooks(res.data);
      } else {
        console.log("error");
      }
    });
  }, [currentPage, !loading]);

  const ShowDetails = (id) => {
    setFilteredBook(books.filter((obj) => obj.id === id));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };


  const HandleCreateForm = (e) => {
    const { name, value } = e.target;
    setCreateBooks({ ...createbooks, [name]: value })
  }


  const handleSearchInput = (e) => {
    const { name, value } = e.target;
    setSearch(prevSearch => ({ ...prevSearch, [name]: value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleSearch = async () => {
    try {
      const queryParams = {
        q: {

          title_cont: search.title,
          author_cont: search.author
        }
      };

      const response = await axios.get(`http://192.168.1.108:3001/books?page=${currentPage}`, {
        params: queryParams,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Info.token}`,
        }
      });

      console.log('response:search ', response);
      setBooks(response.data)
      // Handle the response as needed
    } catch (error) {
      console.error('Error occurred during search:', error);
      toast.error("Something went wrong");
    }
  };


  const handleCreateBookSubmit = async (e) => {
    try {

      if (validateForm()) {
        console.log(createbooks, "createbooks");
        const response = await axios.post("http://192.168.1.108:3001/books", createbooks, config);
        console.log('response: ', response);
        if (response.status === 201) {
          toast.success("Book Created Successfully");
          setCreateBooks({
            title: "", author: "", description: ""
          })
        }
      }
    } catch (error) {
      console.error('Error creating book:', error);
      toast.error("An error occurred while creating the book");
    }
  }

  const validateForm = () => {
    const errors = {};
    if (!createbooks.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!createbooks.author.trim()) {
      errors.author = 'Author name is required';
    }
    if (!createbooks.description.trim()) {
      errors.description = 'Description is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const CloseDATA = () => {
    console.log('CloseDATA: ');
    setCreateBooks({
      title: "", author: "", description: ""
    })
  }


  const DeleteBooksDetails = async (bookId) => {
    try {
      console.log('bookId: ', bookId);

      const response = await axios.delete(`http://192.168.1.108:3001/books/${bookId}`, config);
      console.log('response:delete ', response);
      if (response.status === 204) {
        toast.success("Book Deleted successfully");
        setLoading(!loading)
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error("An error occurred while deleting the book");
    }
  }
  const UpdateBooksDetails = (Bookid) => {
   
    let newBook = books.filter(obj => obj.id === Bookid)
    
    setNewCreateBooks({ id:newBook[0].id,author: newBook[0].author, title: newBook[0].title, description: newBook[0].description })
  
  }

 const handleUpdateBookSubmit=async()=>{
  const response =await axios.patch(`http://192.168.1.108:3001/books/${newcreatebooks?.id}`,newcreatebooks,config)
    
    console.log('response:updated ', response);
 }
  return (
    <div className='m-1 p-2 bg-light'>
    <div className='p-3 row bg-secondary'>
      <div class="col-sm-6">
        <Link className='btn btn-primary' data-toggle="modal" data-target="#myModal2">CREATE BOOK
        </Link>
      </div>
      <div class="col-sm-6 d-flex">
        <h4 className=''>ALL BOOKS</h4>
        <div className="ml-5 ">
          <Link className='btn btn-light' data-toggle="collapse" data-target="#demo">Search <i class='fas fa-search'></i></Link>

          <div id="demo" class="collapse">

            <input
              type='text'
              placeholder='Search By Title'
              className="form-control"
              name='title'
              value={search.title}
              onChange={handleSearchInput}
              onKeyPress={handleKeyPress}
            />

            <input
              type='text'
              placeholder='Search By Author'
              className="form-control"
              value={search.author}
              name='author'
              onChange={handleSearchInput}
              onKeyPress={handleKeyPress}
            />

          </div>
        </div>
      </div>
    </div>

    <table className="table table-hover table-bordered ">
      <thead>
        <tr>
          <th>Id</th>
          <th>Book_Title</th>
          <th>Author</th>
          <th>Views</th>
        </tr>
      </thead>
      <tbody>
        {books.map((obj, index) => (
          <tr key={obj.id}>
            <td>{obj.id}</td>
            <td>{obj.title}</td>
            <td>{obj.author}</td>
            <td>
              <Link className='btn btn-info' onClick={() => ShowDetails(obj.id)} data-toggle="modal" data-target="#myModal1">View</Link>
            </td>
            <td>
              <Link className='btn btn-primary' onClick={() => UpdateBooksDetails(obj.id)} data-toggle="modal" data-target="#myModal3">Update Details</Link>
            </td>
            <td>
              <Link className='btn btn-danger' onClick={() => DeleteBooksDetails(obj.id)}>Delete</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <ul className="pagination">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <a className="page-link" href="#" onClick={prevPage}>Previous</a>
      </li>
      {[...Array(totalPages)].map((_, index) => (
        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
          <a className="page-link" href="#" onClick={() => setCurrentPage(index + 1)}>{index + 1}</a>
        </li>
      ))}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <a className="page-link" href="#" onClick={nextPage}>Next</a>
      </li>
    </ul>

    <div className="modal" id="myModal1">
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title"><strong>TITLE: {filteredBook[0]?.title}</strong></h6>
            <button type="button" className="close" data-dismiss="modal">×</button>
          </div>
          <div className="modal-body">
            <p><strong>Author:</strong> {filteredBook[0]?.author}</p>
            <p><strong>Description:</strong> {filteredBook[0]?.description}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>



    {/* modal2 */}

    <div className="modal" id="myModal2">
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" onClick={CloseDATA}>×</button>
          </div>
          <div className="modal-body">
            <form>
              <div class="form-group">
                <label for="title">TITLE:</label>
                <input type="text" class="form-control" id="title" value={createbooks.title} onChange={HandleCreateForm} placeholder="Enter title" name="title" required />
                {errors.title && <div className="text-danger">{errors.title}</div>} </div>
              <div class="form-group">
                <label for="author">AUTHOR NAME:</label>
                <input type="text" class="form-control" id="author" value={createbooks.author} onChange={HandleCreateForm} placeholder="Enter author" name="author" required />
                {errors.author && <div className="text-danger">{errors.author}</div>} </div>
              <div class="form-group ">
                <label for="description">DESCRIPTION:</label>
                <input type="text" class="form-control" id="description" value={createbooks.description} onChange={HandleCreateForm} placeholder="Enter Description" name="description" required />
                {errors.description && <div className="text-danger">{errors.description}</div>}  </div>
              <Link type="submit" class="btn btn-primary" onClick={handleCreateBookSubmit} >Submit</Link>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={CloseDATA}>Close</button>
          </div>
        </div>
      </div>
    </div>

    {/* model3 */}
    <div className="modal" id="myModal3">
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" onClick={CloseDATA}>×</button>
          </div>
          <div className="modal-body">
            <form>
              <div class="form-group">
                <label for="title">TITLE:</label>
                <input type="text" class="form-control" id="title" value={createbooks.title} onChange={HandleCreateForm} placeholder="Enter title" name="title" required />
                {errors.title && <div className="text-danger">{errors.title}</div>} </div>
              <div class="form-group">
                <label for="author">AUTHOR NAME:</label>
                <input type="text" class="form-control" id="author" value={createbooks.author} onChange={HandleCreateForm} placeholder="Enter author" name="author" required />
                {errors.author && <div className="text-danger">{errors.author}</div>} </div>
              <div class="form-group ">
                <label for="description">DESCRIPTION:</label>
                <input type="text" class="form-control" id="description" value={createbooks.description} onChange={HandleCreateForm} placeholder="Enter Description" name="description" required />
                {errors.description && <div className="text-danger">{errors.description}</div>}  </div>
              <Link type="submit" class="btn btn-primary" onClick={handleUpdateBookSubmit} >Submit</Link>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={CloseDATA}>Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Books