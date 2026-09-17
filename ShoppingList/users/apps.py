from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'ShoppingList.users'

    def ready(self):
        import ShoppingList.users.signals
