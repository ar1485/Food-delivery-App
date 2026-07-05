import { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets.js'
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });
  
  const [stagedItems, setStagedItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const handleAddToList = (event) => {
    event.preventDefault();
    if (!image) {
        toast.error("Please select an image!");
        return;
    }
    
    const newItem = {
        id: Date.now(),
        image: image,
        imagePreview: URL.createObjectURL(image),
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category
    };

    setStagedItems([...stagedItems, newItem]);
    
    setData({
      name: "",
      description: "",
      price: "",
      category: "Salad"
    });
    setImage(false);
  }

  const removeStagedItem = (id) => {
    setStagedItems(stagedItems.filter(item => item.id !== id));
  }

  const submitAllItems = async () => {
    if (stagedItems.length === 0) return;
    
    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of stagedItems) {
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("description", item.description);
      formData.append("price", Number(item.price));
      formData.append("category", item.category);
      formData.append("image", item.image);

      try {
        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setIsUploading(false);

    if (failCount === 0) {
      toast.success(`Successfully uploaded ${successCount} items!`);
      setStagedItems([]); 
    } else {
      toast.warning(`Uploaded ${successCount} items, but ${failCount} failed.`);
    }
  }

  return (
    <div className='add'>
      <div className="add-container">
        <h2>Add New Items</h2>
        
        <form className='flex-col' onSubmit={handleAddToList}>
          
          <div className="add-img-upload flex-col">
            <p>Upload Image</p>
            <label htmlFor="image" className="image-upload-label">
              <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" className={image ? "uploaded-img" : "placeholder-img"} />
            </label>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden/>
          </div>

          <div className="add-product-name flex-col">
            <p>Product Name</p>
            <input onChange={onchangeHandler} value={data.name} type="text" name="name" placeholder="Type here" required />
          </div>

          <div className="add-product-description flex-col">
            <p>Product Description</p>
            <textarea onChange={onchangeHandler} value={data.description} name="description" rows="4" placeholder="Write content here..." required></textarea>
          </div>

          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Product Category</p>
              <select onChange={onchangeHandler} value={data.category} name="category">
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Desserts">Desserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
              </select>
            </div>
            
            <div className="add-price flex-col">
              <p>Product Price</p>
              <input onChange={onchangeHandler} value={data.price} type="number" name="price" placeholder="$20" required />
            </div>
          </div>

          <button type="submit" className="add-btn">ADD TO BATCH LIST</button>
        </form>

        {stagedItems.length > 0 && (
          <div className="staged-items-section">
            <h3>Ready to Upload ({stagedItems.length})</h3>
            <div className="staged-items-list">
              {stagedItems.map((item) => (
                <div key={item.id} className="staged-item-card">
                  <img src={item.imagePreview} alt={item.name} />
                  <div className="staged-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.category} • ${item.price}</p>
                  </div>
                  <button onClick={() => removeStagedItem(item.id)} className="remove-staged-btn">✕</button>
                </div>
              ))}
            </div>
            
            <button 
              onClick={submitAllItems} 
              className={`submit-all-btn ${isUploading ? 'uploading' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? "UPLOADING TO SERVER..." : `UPLOAD ALL ${stagedItems.length} ITEMS`}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Add;