window.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    initItemCheckboxes();
    
    initAddForm();
    
    initFormOverlays();

    initCategoryLabels();

    initQuantityButtons();
    
    // const addForm = document.getElementById('add-item-form');
    // const formOverlay = addForm.parentElement;
    // document.body.append(formOverlay);
    
    // const editForm = document.getElementById('edit-item-form');
    // const formOverlay = editForm.parentElement;
    // document.body.append(formOverlay);
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

function initAddForm() {
    const addButton = document.querySelector('.add-button');
    const addForm = document.getElementById('add-item-form');
    const formOverlay = addForm.parentElement;
    
    addButton.addEventListener('click', () => {
        formOverlay.classList.add('open');
    });
}

function initFormOverlays() {
    const formOverlayElements = document.querySelectorAll('.form-overlay');

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            formOverlayElements.forEach(element => hideOverlay(element));
        }
    });
    
    formOverlayElements.forEach(element => {
        element.addEventListener('click', (e) => {
            if (e.target.closest('.close') || e.target === element || e.target.classList.contains('btn-cancel')) {
                hideOverlay(element)
            }
        });
    });
}

function hideOverlay(overlay) {
    const form = overlay.querySelector('form');

    form.reset();
    overlay.classList.remove('open');
}

function initCategoryLabels() {
    const categoriesWrapperDivElements = document.querySelectorAll('.categories-wrapper');

    categoriesWrapperDivElements.forEach(element => {
        element.addEventListener('click', (e) => {
            if (!e.target.closest('label')) {
                return;
            }

            // Get the selected labels before we select the current one
            const selectedLabelElements = document.querySelectorAll('label.selected');
            
            // Select the clicked label
            e.target.closest('label').classList.toggle('selected');

            // Now these are all selected labels except the clicked one
            selectedLabelElements.forEach(element => {
                element.classList.toggle('selected');
            })
        })
    })
}

function initQuantityButtons() {
    const quantityWrapperDivElements = document.querySelectorAll('.quantity-input-wrapper');

    quantityWrapperDivElements.forEach(element => {
        const quantityInputElement = element.querySelector('input[type=number]');
        const minusButtonElement = element.querySelector('.quantity-minus');
        const plusButtonElement = element.querySelector('.quantity-plus');

        let holdTimeout;
        let holdInterval;

        plusButtonElement.addEventListener('pointerdown', () => {
            startHolding(() => quantityInputElement.stepUp());
        });

        minusButtonElement.addEventListener('pointerdown', () => {
            startHolding(() => quantityInputElement.stepDown());
        });

        [plusButtonElement, minusButtonElement].forEach(button => {
            button.addEventListener('pointerup', stopHolding);
            button.addEventListener('pointercancel', stopHolding);
            button.addEventListener('pointerleave', stopHolding);
        })

        function startHolding(action) {
            action();

            holdTimeout = setTimeout(() => {
                holdInterval = setInterval(action, 100)
            }, 400);
        }

        function stopHolding() {
            clearTimeout(holdTimeout);
            clearInterval(holdInterval);
        }
    })
}