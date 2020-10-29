// 'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#loginForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantrating = document.querySelector('.rating');
const restaurantprice = document.querySelector('.price'); 
const restaurantcategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');



let login = localStorage.getItem('key');

const getData = async (url) => {
  const response = await fetch(url); // асинхронная функция, получает данные с базы данных, await указывает, что мы дожидаемся получения данных
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибка ${response.status}`); //мы указываем, что если статус респонса не ок, т.е есть ошибка, мы указываем по какому адресу эта ошибка

  }
  return await response.json();

};

getData('./db/partners.json');


function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  if (modalAuth.classList.contains('is-open')) {
    disabledScroll();
  } else {
    enabledScroll();
  }


};

function autorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('key');
    checkAuth();
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();

  }
  console.log('autorized');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('he avtorizovan');
  function logIn(event) {
    
    event.preventDefault();
    
    login = loginInput.value;
    if (!login) {
      alert('VVedite Login');
      loginInput.style.borderColor = '#ff0000';
      return false;
    }
    loginInput.style.borderColor = '';
    localStorage.setItem('key', login);
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();

  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function (event) {
    if (event.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  })

}

function checkAuth () {
  if (login) {
    autorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant(restaurant) {
  const { image, kitchen, name, price, stars,products, time_of_delivery: timeOfDelivery } = restaurant; // это деструктуриация массива, вытаскиваем из него элементы
  
  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  
  // добавляем дата атрибут к карточке(дата продуктс)
  const card = `
        
        <img src='${image}'  alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
          </div>
          
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
          
        </div>
        
      
  `;

  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}


// собственная реализация
// function createDescrGood({ image, kitchen, name, price, stars,products, time_of_delivery: timeOfDelivery }) {
//   const descr = document.createElement('div');
//   descr.className = 'section-heading';
//   descr.insertAdjacentHTML('beforeend', `
  
//       <h2 class="section-title restaurant-title">${name}</h2>
//         <div class="card-info">
//             <div class="rating">
//               ${stars}
//             </div>
//             <div class="price">От ${price} ₽</div>
//             <div class="category">${products}</div>
//           </div>
        
//         </div>
//       <div class="cards cards-menu">
      
      
//       </div>
    
//   `);
//   menu.insertAdjacentElement('beforebegin', descr);
// }

function createCardGood({ description, id, image, name, price }) {  //Деструктурируем прямо в самой функции, не нужно создавать новую переменную

  
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
  
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}
// объект event это объект с которым происходит событие, кликаем на элемент и он подставляется в event
function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      const { name, kitchen, price, stars } = restaurant.info;
      restaurantTitle.textContent = name;
      restaurantrating.textContent = stars;
      restaurantprice.textContent = `От ${price} ₽`;
      restaurantcategory.textContent = kitchen;


      getData(`./db/${restaurant.products}`).then((data) => {
        data.forEach(createCardGood);
        
      })
    } 
  } else{
    toggleModalAuth();
  };


  const restaurant = target.closest('.card-restaurant');

  // вариант запроса регистрации при нажатии на ресторан, работет со сбоями...
  // if (!login) {
  //   toggleModalAuth();
  // } else {
  //   if (restaurant) {
  //     containerPromo.classList.add('hide');
  //     restaurants.classList.add('hide');
  //     menu.classList.remove('hide');
  //     cardsMenu.textContent = '';
  //     createCardGood();
  //     createCardGood();
  //     createCardGood();
  //   }
  // }
  
  

}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
    
  });
  
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function()  {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });
  
  inputSearch.addEventListener('keypress', function(event) {

    if (event.charCode === 13){
      const value = event.target.value.trim;

      if (!value) {
        event.target.value = '';
        return;
      }
      getData('./db/partners.json').then(function (data) {
        return data.map(function(partner) {
          return partner.products;
        });
        
      })
      .then(function (linksProduct) {
        cardsMenu.textContent = '';
        linksProduct.forEach( function(link) {
          getData(`./db/${link}`)
           .then(function (data) { 
              const resultSearch = data.filter(function (item) {
                const name = item.name.tolowerCase();
                return name.includes(value.toLowerCase()) ;
              });
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');
              restaurantTitle.textContent = 'Результат поиска';
              restaurantrating.textContent = '';
              restaurantprice.textContent = '';
              restaurantcategory.textContent = '';
              resultSearch.forEach(createCardGood);
            })
        })
      })
    }
  })
  
  checkAuth();
}

init();
