import React from 'react';
import axios from 'axios';

import {useCart} from '../hooks/useCart'
import Info from '../Info';

import styles from './Drawer.module.scss'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({onClose, onRemove,items =[], opened}) {
  const {cartItems, setCartItems, totalPrice} = useCart();
  const [orderId, setOrderId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);


  const [isOrderComplete, setIsOrderComplete] = React.useState(false);

  const onClickOrder =  async() => {
    try {
      setIsLoading(true);
      
    const {data} = await axios.post('https://63bfbd100cc56e5fb0ddf2ba.mockapi.io/orders/',
    { items: cartItems});

    setOrderId(data.id);
    setIsOrderComplete(true);
    setCartItems([]);

    for(let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      await axios.delete('https://63809f3c8efcfcedac0a3901.mockapi.io/card/' + item.id);
      await delay(1000);
    }
    }
    catch(error) {
      alert('Ошибка при создании заказа :(');
    }
    setIsLoading(false);
  }

    return (
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible:''}` }>
        <div className={styles.drawer}>
        <h2 className="mb-30 d-flex justify-between">
          Корзина
          <img onClick={onClose} className="removeBtn cu-p" src="/img/btn-remove.svg" alt="Close"/>
        </h2>
          {
            items.length > 0 
            ? 
            <div className="cartItems-block flex flex-column">
              <button className="greenButton" onClick={onClose}>
                  <img src="/img/arrow.svg" alt="Arrow" /> Вернуться назад
              </button>
             
              <div className="items">
            {items.map((obj) => 
              <div key={obj.id} className="cartItem d-flex align-center mb-20 mt-10">
              <div style={{backgroundImage: `url(${obj.imageUrl})`}} className="cartItemImg">

              </div>
            <div className="mr-20 flex">
                <p className="mb-5">{obj.title}</p>
                <b>{obj.price}</b>
            </div>
            <img onClick={() => onRemove(obj.id)} className="removeBtn" src="/img/btn-remove.svg" alt="Remove"/>
          </div>
          )}
          </div> 
          <div className="cartTotalBlock">
          <ul>
              <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice}</b>
              </li>
              <li>
                  <span>Налог 5%:</span>
                  <div></div>
                  <b> {totalPrice/100*5} руб.</b>
              </li>
          </ul>
          <button disabled={isLoading} onClick ={onClickOrder} className="greenButton">
            Оформить заказ<img src="/img/arrow.svg" alt="Стрелка"/>
            </button>
          </div>
          </div>
          :
          <Info title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая" } 
          description={isOrderComplete ? `Ваш заказ # ${orderId} скоро будет передан курьерской доставке ` : `Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ`} 
          image={isOrderComplete ? "/img/complete-order.jpg" : "/img/empty-cart.png"}/>
          }
      </div>
      </div>
    )
}

export default Drawer;