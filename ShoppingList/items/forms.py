from django import forms

from ShoppingList.items.models import Item


class ItemBaseForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['name', 'notes', 'quantity', 'unit', 'is_urgent', 'store', 'category']


class ItemCreateForm(ItemBaseForm):
    pass


class ItemEditForm(ItemBaseForm):
    pass