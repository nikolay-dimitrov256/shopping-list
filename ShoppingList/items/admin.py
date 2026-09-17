from django.contrib import admin

from ShoppingList.items.models import ShoppingList


@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    pass
