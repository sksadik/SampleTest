var dummy;
var discount_applied = true

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {

    let tmp = document.getElementById("dummy")
    dummy = tmp.cloneNode(true);
    tmp.remove()

    var cartItems = document.getElementsByClassName('cart-items')[0]

    let cart_list = JSON.parse(sessionStorage.getItem('cart_list'))

    if (cart_list == null) {
        console.log("cart list created")
        cart_list = [];
        sessionStorage.setItem('cart_list', JSON.stringify(cart_list));
    }

    else {

        for (var i = 0; i < cart_list.length; i++) {

            var cartRow = document.createElement('div')
            cartRow.classList.add('cart-row')
            cartRow.innerHTML = cart_list[i]

            cartItems.append(cartRow)
        }

        updateCartTotal()
    }

    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {

    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItems.getElementsByClassName('cart-row')

    var jsonObject = []

    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var obj = new Object();

        var objTitle = cartRow.getElementsByClassName('cart-item-title')[0].innerHTML

        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var quantity = quantityElement.value

        obj.title = objTitle
        obj.quantity = quantity

        jsonObject.push(obj)
    }

    console.log(JSON.stringify(jsonObject))

    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target

    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }

    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {

    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    var cartRow = dummy.cloneNode(true);

    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }

    var img = cartRow.getElementsByClassName('cart-item-image')[0]
    img.src = imageSrc

    var row_title = cartRow.getElementsByClassName('cart-item-title')[0]
    row_title.innerHTML = title

    var row_price = cartRow.getElementsByClassName('cart-price cart-column')[0]
    row_price.innerHTML = price

    cartItems.append(cartRow)

    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0

    old_total = document.getElementsByClassName('cart-total-price')[0].innerText
    old_total = old_total.replace('$', '')

    let cart_list = JSON.parse(sessionStorage.getItem('cart_list'));
    sessionStorage.clear()
    cart_list = []

    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value

        total = total + (price * quantity)

        cart_html = cartRow.innerHTML

        cart_html = cart_html.replace(/value="[0-9]"/, `value="${quantity}"`)

        cart_list.push(cart_html)
    }
    total = Math.round(total * 100) / 100

    if (total >= 100) {
        total = total - (10 * total) / 100

        if (!discount_applied) {
            alert("You got 10% discount!")
            discount_applied = true
        }
    }

    else discount_applied = false

    sessionStorage.setItem('cart_list', JSON.stringify(cart_list));

    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}