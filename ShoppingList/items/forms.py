from django import forms
from django.db.models import Q

from ShoppingList.common.forms import RangeInput
from ShoppingList.items.models import Item, Category
from ShoppingList.stores.models import Store


class ItemBaseForm(forms.ModelForm):
    def __init__(self, *args, user=None, **kwargs):
        super().__init__(*args, **kwargs)

        if user is None:
            self.fields['store'].queryset = Store.objects.filter(is_global=True)
        else:
            self.fields['store'].queryset = Store.objects.filter(Q(is_global=True) | Q(user=user))


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
        ),
        required=False,
    )

    category = forms.ModelChoiceField(
        queryset=Category.objects.all(),
        label='Категория:',
        widget=forms.RadioSelect(),
        required=False,
    )

    store = forms.ModelChoiceField(
        queryset=Store.objects.none(),
        empty_label='- Избери магазин -',
        label='Магазин',
        required=False,
    )
    class Meta:
        model = Item
        fields = ['name', 'notes', 'quantity', 'unit', 'is_urgent', 'store', 'category']


class ItemCreateForm(ItemBaseForm):
    pass


class ItemEditForm(ItemBaseForm):
    pass