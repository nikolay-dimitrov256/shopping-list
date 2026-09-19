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

            markItemAsBought(item);
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

function markItemAsBought(itemElement) {
    const checkboxElement = itemElement.querySelector('.bought-item-check');
    const itemId = Number(itemElement.dataset.itemId);
    const url = `${window.location.origin}/api/items/${itemId}/`;
    const crsfToken = document.querySelector('#logout-form input[name=csrfmiddlewaretoken]').value;
    const now = new Date();

    fetch(
        url,
        {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'X-CSRFToken': crsfToken,
            },
            body: JSON.stringify({
                'is_bought': checkboxElement.checked, 
                'bought_at': checkboxElement.checked?now:null,
            }),
            credentials: 'same-origin',
        }
    )
    .then(res => {
        if (res.ok) {
            recalculateSummary(checkboxElement.checked);
        }
    })
    .catch(error => console.error(error));
}

function recalculateSummary(isBought) {
    const summaryPendingSpanElement = document.querySelector('.summary .summary-item.pending .count');
    const summaryBoughtSpanElement = document.querySelector('.summary .summary-item.bought .count');
    let pending = Number(summaryPendingSpanElement.textContent);
    let bought = Number(summaryBoughtSpanElement.textContent);

    if (isBought) {
        pending --;
        bought ++;
    } else {
        pending ++;
        bought --;
    }

    summaryPendingSpanElement.textContent = pending;
    summaryBoughtSpanElement.textContent = bought;
}