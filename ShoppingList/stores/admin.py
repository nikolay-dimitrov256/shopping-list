from django.contrib import admin

from ShoppingList.stores.models import Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_global', 'user']
