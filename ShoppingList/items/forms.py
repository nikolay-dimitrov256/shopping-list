from django import forms

from ShoppingList.common.forms import RangeInput
from ShoppingList.items.models import Item


class ItemBaseForm(forms.ModelForm):
    is_urgent = forms.BooleanField(
        label='Спешно',
        widget=RangeInput(
            attrs={
                'min': 0,
                'max': 1,
                'step': 1,
            }
        )
    )
    class Meta:
        model = Item
        fields = ['name', 'notes', 'quantity', 'unit', 'is_urgent', 'store', 'category']


class ItemCreateForm(ItemBaseForm):
    pass


class ItemEditForm(ItemBaseForm):
    pass