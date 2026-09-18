from django.apps import AppConfig


class ItemsConfig(AppConfig):
    name = 'ShoppingList.items'

    def ready(self):
        import ShoppingList.items.signals