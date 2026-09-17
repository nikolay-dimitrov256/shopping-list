window.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    initActionsToggles();

    initMenuToggle();
}

function initActionsToggles() {
    const bodyElement = document.querySelector('body');

    document.body.addEventListener('click', (event) => {
        const actionsToggleAElement = event.target.closest('.actions-toggle');

        if (!actionsToggleAElement) {
            const activeActionsDivElements = document.querySelectorAll('.actions.visible');
            activeActionsDivElements.forEach(element => {
                element.classList.toggle('visible');
            });
            return;
        }

        const actionsDivElement = actionsToggleAElement.nextElementSibling;
        
        actionsDivElement.classList.toggle('visible');
    });
}

function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const addButton = document.querySelector('.add-button');
    const menuToggleLabel = document.querySelector('label[for=menu-toggle]');

    menuToggle.addEventListener('change', () => {
        addButton.classList.toggle('menu-toggle-checked', menuToggle.checked);
    });

    document.body.addEventListener('click', (event) => {
        const menuToggleIsClicked = event.target === menuToggle || menuToggleLabel.contains(event.target);
        
        if (!menuToggleIsClicked) {
            menuToggle.checked = false;
            addButton.classList.remove('menu-toggle-checked');
        }
    });
}