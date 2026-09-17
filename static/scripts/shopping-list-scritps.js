window.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    initItemCheckboxes();
}

function initItemCheckboxes() {
    const shoppingListDivElenment = document.querySelector('.shopping-list');

    shoppingListDivElenment.addEventListener('click', (event) => {
        if (event.target.classList.contains('bought-item-check')) {
            const item = event.target.parentElement.parentElement;
            moveBoughtItem(item);
        }
    });
}

function moveBoughtItem(item) {
    const shoppingBodyDivElement = document.querySelector('.shopping-body');
    const boughtItemsDivElement = document.querySelector('.bought-items');
    const checkboxElement = item.querySelector('.bought-item-check');

    if (checkboxElement.checked) {
        boughtItemsDivElement.prepend(item);
        item.classList.toggle('bought-item', checkboxElement.checked);
    } else {
        shoppingBodyDivElement.prepend(item);
        item.classList.toggle('bought-item', checkboxElement.checked);
    }
}