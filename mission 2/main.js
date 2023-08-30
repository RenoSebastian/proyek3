const items = document.querySelectorAll('.item');
const cartItemsElement = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cartTotal');

let cartItems = [];

items.forEach(item => {
    const priceElement = item.querySelector('.price');
    const countElement = item.querySelector('.count');
    const increaseButton = item.querySelector('.increase');
    const decreaseButton = item.querySelector('.decrease');
    const addToCartButton = item.querySelector('.add-to-cart');
    const itemName = item.querySelector('h3').textContent;
    const itemPrice = parseFloat(priceElement.textContent.substring(4).replace('.', '').replace(',', '.'));
    const itemImgSrc = item.getAttribute('data-img-src');

    let count = 0;

    increaseButton.addEventListener('click', () => {
        count++;
        countElement.textContent = count;
    });

    decreaseButton.addEventListener('click', () => {
        if (count > 0) {
            count--;
            countElement.textContent = count;
        }
    });

    addToCartButton.addEventListener('click', () => {
        const count = parseInt(countElement.textContent);
        if (count > 0) {
            const existingCartItemIndex = cartItems.findIndex(cartItem => cartItem.name === itemName);
            if (existingCartItemIndex !== -1) {
                cartItems[existingCartItemIndex].count += count;
            } else {
                const imgName = item.getAttribute('data-img');
                const imgSrc = `./${imgName}`; // Alamat relatif ke gambar
                const cartItem = { name: itemName, price: itemPrice, count: count, img: imgSrc };
                cartItems.push(cartItem);
            }
            updateCart();
            updateTotalAmount();
        }
    });
    
    
});

function updateCart() {
    cartItemsElement.innerHTML = '';
    cartItems.forEach(cartItem => {
        const div = document.createElement('div');
        div.classList.add('cart-item');

        const itemName = document.createElement('h4');
        itemName.textContent = cartItem.name;
        div.appendChild(itemName);

        const itemDetail = document.createElement('p');
        itemDetail.textContent = `Harga: ${formatCurrency(cartItem.price)} x ${cartItem.count} : ${formatCurrency(cartItem.price * cartItem.count)}`;
        div.appendChild(itemDetail);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.addEventListener('click', () => removeCartItem(cartItem));
        div.appendChild(deleteButton);

        cartItemsElement.appendChild(div);
    });
}


function removeCartItem(item) {
    const itemIndex = cartItems.indexOf(item);
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
        updateCart();
        updateTotalAmount();
    }
}

function updateTotalAmount() {
    const subtotal = cartItems.reduce((total, cartItem) => total + (cartItem.price * cartItem.count), 0);
    const tax = subtotal * 0.11; // Pajak 11%
    const totalAmount = subtotal + tax;

    document.getElementById('cartSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('cartTax').textContent = formatCurrency(tax);
    document.getElementById('cartTotal').textContent = formatCurrency(totalAmount);
}


function formatCurrency(amount) {
    return `Rp. ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}
