window.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    initItemCheckboxes();
    
    initAddForm();
    
    initFormOverlays();

    initCategoryLabels();

    initQuantityButtons();

    initEditButtons();

    initEditForm();

    initDeleteButtons();

    initDeleteForm();
    
    // const addForm = document.getElementById('add-item-form');
    // const formOverlay = addForm.parentElement;
    // document.body.append(formOverlay);
    
    // const editForm = document.getElementById('edit-item-form');
    // const formOverlay = editForm.parentElement;
    // formOverlay.classList.add('open')

    // document.querySelector('.delete-form-overlay').classList.add('open');
}

function getCsrfToken() {
    return document.querySelector('input[name=csrfmiddlewaretoken]').value;
}

function initItemCheckboxes() {
    const shoppingListDivElenment = document.querySelector('.shopping-list');
    
    shoppingListDivElenment.addEventListener('click', (event) => {
        if (event.target.classList.contains('bought-item-check')) {
            const item = event.target.parentElement.parentElement;
            
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

            moveBoughtItem(itemElement);
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

    if (form.dataset.itemId) {
        form.dataset.itemId = '';
    }
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

function initEditButtons() {
    const shoppingListDivElenment = document.querySelector('.shopping-list');

    shoppingListDivElenment.addEventListener('click', (e) => {
        // Get the edit button
        const editButtonAElement = e.target.closest('.edit');
        if (!editButtonAElement) {
            return;
        }

        // Get the item element and item ID
        const itemDivElement = editButtonAElement.parentElement.parentElement;
        const itemId = itemDivElement.dataset.itemId;

        // Fetch item data from server
        const baseUrl = window.location.origin;
        const fetchUrl = `${baseUrl}/api/items/${itemId}`;
        const csrfToken = getCsrfToken();

        fetch(fetchUrl,
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'same-origin'
            }
        )
        .then(res => res.json())
        .then(itemData => fillEditForm(itemData))
        .catch(err => console.error(err));
    })
}

function fillEditForm(itemData) {
    const editFormOverlay = document.querySelector('.edit-form-overlay');
    const editForm = editFormOverlay.querySelector('.edit-form');

    // Get input elements
    const nameInputElement = document.getElementById('id_edit-name');
    const quantityInputElement = document.getElementById('id_edit-quantity');
    const unitSelectElement = document.getElementById('id_edit-unit');
    const categoryDivElement = document.getElementById('id_edit-category');
    const storeSelectElement = document.getElementById('id_edit-store');
    const isUrgentCheckboxElement = document.getElementById('id_edit-is_urgent');
    const notesTextareaElement = document.getElementById('id_edit-notes');

    // Fill in edit form
    nameInputElement.value = itemData.name;
    quantityInputElement.value = itemData.quantity;
    unitSelectElement.value = itemData.unit;
    setCategory(itemData.category, editForm);
    storeSelectElement.value = itemData.store;
    isUrgentCheckboxElement.value = Number(itemData['is_urgent']);
    isUrgentCheckboxElement.classList.toggle('on', itemData['is_urgent']);
    notesTextareaElement.value = itemData.notes;
    
    // Make edit from visible
    editFormOverlay.classList.add('open');

    // Write item ID on form
    editForm.dataset.itemId = itemData.id;
}

function setCategory(categoryId, form) {
    if (!categoryId) {
        return;
    }

    const categoryWrapper = form.querySelector('.categories-wrapper');

    categoryWrapper.querySelectorAll('label').forEach(label => {
        label.classList.remove('selected');
    });

    const radio = categoryWrapper.querySelector(`input[value="${categoryId}"]`);

    if (!radio) {
        return;
    }

    radio.checked = true;
    radio.closest('label').classList.add('selected');
}

function initEditForm() {
    const editForm = document.getElementById('edit-item-form');
    const csrfToken = getCsrfToken();

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = formToJSON(editForm, 'edit-');
        const itemId = editForm.dataset.itemId;
        const baseUrl = window.location.origin;
        const fetchUrl = `${baseUrl}/api/items/${itemId}/`;
        
        fetch(
            fetchUrl,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify(data),
            }
        ).then(res => {
            if (res.ok) {
                window.location.reload();
            }
        }).catch(err => console.error(err));
    })
}

function formToJSON(form, prefix = '') {
    const formData = new FormData(form);

    const data = Object.fromEntries(
        [...formData.entries()].map(([key, value]) => {
            if (!prefix) {
                return [key, value];
            }

            key = key.replace(new RegExp(`^${prefix}`), '');
            return [key, value];
        })
    );

    return data;
}

function initDeleteButtons() {
    const shoppingListDivElenment = document.querySelector('.shopping-list');

    shoppingListDivElenment.addEventListener('click', (e) => {
        // Get the delete button
        const deleteButtonAElement = e.target.closest('.delete');
        if (!deleteButtonAElement) {
            return;
        }

        // Show the delete form overlay
        const deleteFormOverlay = document.querySelector('.delete-form-overlay');
        deleteFormOverlay.classList.add('open');

        // Get the item element and item ID
        const itemDivElement = deleteButtonAElement.parentElement.parentElement;
        const itemId = itemDivElement.dataset.itemId;

        // Write item ID on delete form
        const deleteForm = document.getElementById('item-delete-form');
        deleteForm.dataset.itemId = itemId;
    });
}

function initDeleteForm() {
    // Get the delete form
    const deleteForm = document.getElementById('item-delete-form');

    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemId = deleteForm.dataset.itemId;

        if (!itemId) {
            return;
        }

        deleteItem(itemId);
        
    })
}

function deleteItem(itemId) {
        const baseUrl = window.location.origin;
        const fetchUrl = `${baseUrl}/api/items/${itemId}/`;
        const csrfToken = getCsrfToken();

        fetch(
            fetchUrl,
            {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'same-origin',
            }
        )
        .then(res => {
            if (res.ok) {
                window.location.reload();
            }
        })
        .catch(err => console.error(err));
    
}