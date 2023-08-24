import React from 'react';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppContext from './context';
import Orders from './pages/Orders';



function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true); 
 
  React.useEffect(() => { 
      async function fetchData() {
        try {
          const cartResponse = await axios.get('https://63809f3c8efcfcedac0a3901.mockapi.io/card');
          const favoritesResponse = await axios.get('https://63809f3c8efcfcedac0a3901.mockapi.io/favorites');
          const itemsResponse = await axios.get('https://63809f3c8efcfcedac0a3901.mockapi.io/items');
          
          setIsLoading(false);
    
          setCartItems(cartResponse.data);
          setFavorites(favoritesResponse.data);
          setItems(itemsResponse.data);
        }
        catch(error) {
          alert('Ошибка при запросе данных :(');
        }
      }
      fetchData();
  }, []);


  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if(findItem) {
        await axios.delete(`https://63809f3c8efcfcedac0a3901.mockapi.io/card/${findItem.id}`);
        setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
      }
      else {
        const {data} = await axios.post('https://63809f3c8efcfcedac0a3901.mockapi.io/card/', obj);
        setCartItems(prev => [...prev, data]);
      }
    }
    catch(error) {
        alert('Ошибка при добавлении в корзину');
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
    if(favorites.find((favObj) => favObj.id === obj.id)) {
      axios.delete(`https://63809f3c8efcfcedac0a3901.mockapi.io/favorites/${obj.id}`);
      setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
    } else {
    const { data } = await axios.post('https://63809f3c8efcfcedac0a3901.mockapi.io/favorites', obj);
    setFavorites(prev => [...prev, data]);
    }
  }
  catch (error) {
    alert('Не удалось добавить фавориты')
  }
  };

  const onRemoveItem = (id) => {
     axios.delete(`https://63809f3c8efcfcedac0a3901.mockapi.io/card/${id}`);
     setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onChangeSearchInput = (event) => {
    console.log(event.target.value);
    setSearchValue(event.target.value.toLowerCase());
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };
   
  const onClose = () => setCartOpened(false);


  return (
    <AppContext.Provider value={{items, cartItems, favorites,onAddToFavorite, onAddToCart, isItemAdded, setCartOpened, setCartItems }}>
    <div className="wrapper clear">
         <Drawer items={cartItems} onRemove={onRemoveItem} onClose={onClose} opened={cartOpened}/>
        <Header onClickCart={() => setCartOpened(true)} />
 
        <Routes>
 <Route  path="/"  element={ 
 <Home 
 items={items} 
 cartItems={cartItems}
 searchValue={searchValue}
 setSearchValue={setSearchValue}
 onChangeSearchInput={onChangeSearchInput}
 onAddToFavorite={onAddToFavorite}
 onAddToCart={onAddToCart}
 isLoading={isLoading}
 />} />             
        </Routes>  
        <Routes>
            <Route  path="/favorites"  element={ 
            <Favorites 
              /> } 
            />          
        </Routes>  
        <Routes>
            <Route  path="/orders"  element={ 
            <Orders 
              /> } 
            />          
        </Routes>      
       
    </div>
    </AppContext.Provider>
  );
}

export default App;
