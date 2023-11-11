let listProductHTML = document.querySelector('.listProduct');
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span')

let listProducts = [];
let carts = []

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

const generateData = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.products && listProducts.products.length > 0) {
        listProducts.products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.thumbnail}" alt="">
                <h2>${product.title}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add to Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (e) => {
    let click = e.target;
    if (click.classList.contains('addCart')) {
        let product_id = click.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    if (carts.length === 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        const existingProductIndex = carts.findIndex(cartItem => cartItem.product_id === product_id);

        if (existingProductIndex !== -1) {
            carts[existingProductIndex].quantity += 1;
        } else {
            carts.push({
                product_id: product_id,
                quantity: 1
            });
        }
    }

    addCartToHTML();
    addToMemory();
}

const addToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts))
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (carts.length > 0 && listProducts.products && Array.isArray(listProducts.products)) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.products.findIndex((value) => value.id == cart.product_id);

            if (positionProduct !== -1) {
                let info = listProducts.products[positionProduct];
                let productPrice = info.price * cart.quantity;
                totalPrice += productPrice;

                newCart.innerHTML = `<div class="image">
                    <img src="${info.thumbnail}" alt="">
                </div>
                <div class="name">${info.title}</div>
                <div class="totalPrice">$${productPrice}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">+</span>
                </div>`;
                listCartHTML.appendChild(newCart);
            }
        });
    }

    iconCartSpan.innerHTML = totalQuantity;
    document.querySelector('.checkOut').innerHTML = `Total price : $${totalPrice.toFixed(2)}`;
};



listCartHTML.addEventListener('click', (e) => {
    let click = e.target;
    if (click.classList.contains('minus') || click.classList.contains('plus')) {
        let product_id = click.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (click.classList.contains('plus')) {
            type = 'plus'
        }
        changeQuantity(product_id, type)
    }
})

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity +=1;
                break;
        
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange
                } else {
                    carts.splice(positionItemInCart, 1)
                }
                break;
        }
    }
    addToMemory();
    addCartToHTML();
}

const initApp = () => {
    fetch("https://dummyjson.com/products")
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        generateData();
        addCartToHTML();
    })
    .catch(error => console.error('Error fetching data:', error))

    if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
    }
}

initApp();
