from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Count, Q
from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.views.generic.dates import timezone_today

from ShoppingList.items.forms import ItemCreateForm, ItemEditForm
from ShoppingList.items.models import Item


class DashboardView(LoginRequiredMixin, ListView):
    model = Item
    template_name = 'common/dashboard.html'

    def get_queryset(self):
        items = (Item.objects
        .filter(
            shopping_list=self.request.user.shopping_list,
            is_archived=False,
        )
        )

        return items

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(object_list=object_list, **kwargs)

        counts = self.object_list.aggregate(
            pending_count=Count('id', filter=Q(is_bought=False)),
            bought_count=Count('id', filter=Q(is_bought=True)),
            bought_today_count=Count('id', filter=Q(is_bought=True) & Q(bought_at__date=timezone_today()))
        )
        context['counts'] = counts

        pending_items = self.object_list.filter(is_bought=False)
        bought_items = self.object_list.filter(is_bought=True)
        context['pending_items'] = pending_items
        context['bought_items'] = bought_items

        context['add_form'] = ItemCreateForm()
        context['edit_form'] = ItemEditForm()

        return context
