from django.shortcuts import render
from django.views.generic import CreateView

from ShoppingList.items.forms import ItemCreateForm
from ShoppingList.items.models import Item


class CreateItemView(CreateView):
    model = Item
    form_class = ItemCreateForm

    def get_success_url(self):
        return self.request.META.get('HTTP_REFERER')
