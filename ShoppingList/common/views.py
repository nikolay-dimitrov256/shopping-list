from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Count, Q
from django.shortcuts import render, redirect
from django.urls import reverse
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
            .order_by('-is_urgent')
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

        if 'add_form' not in context:
            context['add_form'] = ItemCreateForm(
                user=self.request.user,
                prefix='create',
            )
        context['edit_form'] = ItemEditForm(
            user=self.request.user,
            prefix='edit',
        )

        return context

    def post(self, request, *args, **kwargs):
        add_form = ItemCreateForm(
            request.POST,
            prefix='create',
            user=request.user
        )

        if add_form.is_valid():
            item = add_form.save(commit=False)
            item.user = request.user
            item.shopping_list = request.user.shopping_list
            item.save()

            action = request.POST.get('action')

            if action == 'save_and_add':
                return redirect(f'{reverse("dashboard")}?add=1')

            return redirect('dashboard')

        self.object_list = self.get_queryset()

        context = self.get_context_data(add_form=add_form)

        return self.render_to_response(context)
