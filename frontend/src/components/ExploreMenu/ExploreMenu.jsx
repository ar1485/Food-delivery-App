import './ExploreMenu.css'
import {menu_list} from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {

  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-test'>Discover our delicious menu, featuring a wide variety of dishes to satisfy every craving. From savory appetizers to mouthwatering main courses and delectable desserts, our menu offers something for everyone. Explore our culinary delights and indulge in a memorable dining experience.</p>
        <div className="explore-menu-list">
            {menu_list.map((item,index)=>{
                return (
                    <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>

                    </div>
                )
            })}       
        </div>
        <hr />            
    
    </div>
  )
}

export default ExploreMenu
