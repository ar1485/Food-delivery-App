import { useState, useEffect } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error fetching food list");
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list-container'>
      <div className="list-content-card">
        <h2>All Foods Menu</h2>
        <div className="list-table">
          <div className="list-table-header">
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Action</span>
          </div>
          <div className="list-table-body">
            {list.map((item, index) => {
              return (
                <div key={index} className="list-table-row">
                  <img src={`${url}/images/` + item.image} alt={item.name} />
                  <span className="item-name">{item.name}</span>
                  <span className="item-category">{item.category}</span>
                  <span className="item-price">${item.price}</span>
                  <button onClick={() => removeFood(item._id)} className='delete-btn'>Delete</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List;