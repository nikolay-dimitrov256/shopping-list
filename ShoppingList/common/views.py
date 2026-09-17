from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views.generic import DetailView

from ShoppingList.items.models import Item


class DashboardView(LoginRequiredMixin, DetailView):
    model = Item
    template_name = 'common/dashboard.html'

    def get_queryset(self):
        items = Item.objects.filter(shopping_list=self.request.user.shopping_list)

        return items
