import {Link} from 'react-router-dom'
import React from 'react';
 
import {useCart} from './hooks/useCart'

function Header (props) {

  const {totalPrice} = useCart();
 
return (
<header className="d-flex justify-between align-center p-40">
<Link to="/" >
<div className="d-flex align-center">
<img width={40} height={40} src="img/logo.png" alt=""/>
<div>
  <h3 className="text-uppercase">React Shop</h3>
  <p className="opacity-5">Магазин лучших кроссовок</p>
</div>
</div>
</Link>
<div>
<ul className="d-flex cu-p">
  <li onClick={props.onClickCart} className="mr-30">
  <img width={18} height={18} src="img/cart.svg" alt="Корзина"/>
    <span>{totalPrice}</span>
  </li>
  <li className="mr-20 cu-p">
  <Link to="/favorites">
  <img width={18} height={18} src="img/heart.svg" alt="Закладки"/>
  </Link>
  </li>
  <li>
  <Link to="/orders">
  <img width={18} height={18} src="img/user.svg" alt="Пользователь"/>
  </Link>
  </li>
</ul>
</div>
</header>
)
}

export default Header;