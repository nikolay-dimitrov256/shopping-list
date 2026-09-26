from django import forms

from ShoppingList.common.forms import RangeInput
from ShoppingList.items.models import Item, Category
from ShoppingList.stores.models import Store


class ItemBaseForm(forms.ModelForm):
    is_urgent = forms.BooleanField(
        label='Отбележи, като спешно',
        widget=RangeInput(
            attrs={
                'min': 0,
                'max': 1,
                'step': 1,
                'class': 'boolean-range',
                'value': 0,
            }
        )
    )

    category = forms.ModelChoiceField(
        queryset=Category.objects.all(),
        label='Категория:',
        widget=forms.RadioSelect(

        )
    )

    store = forms.ModelChoiceField(
        queryset=Store.objects.all(),
        empty_label='- Избери магазин -',
        label='Магазин',
    )
    class Meta:
        model = Item
        fields = ['name', 'notes', 'quantity', 'unit', 'is_urgent', 'store', 'category']


class ItemCreateForm(ItemBaseForm):
    pass


class ItemEditForm(ItemBaseForm):
    pass