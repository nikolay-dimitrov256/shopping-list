from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.views.generic import DeleteView

from ShoppingList.items.models import Item


@login_required
def archive_items_view(request):
    items = Item.objects.filter(shopping_list__user=request.user, is_bought=True, is_archived=False)
    items.update(is_archived=True)

    return redirect('dashboard')
