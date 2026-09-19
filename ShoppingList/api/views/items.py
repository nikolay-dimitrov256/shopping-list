from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from ShoppingList.api.serializers import ItemSerializer
from ShoppingList.items.models import Item


class ListCreateItemAPIView(ListCreateAPIView):
    model = Item
    serializer_class = ItemSerializer

    def get_queryset(self):
        items = Item.objects.filter(
            shopping_list=self.request.user.shopping_list,
            is_archived=False
        )

        return items


class CreateUpdateDeleteItemAPIView(RetrieveUpdateDestroyAPIView):
    model = Item
    serializer_class = ItemSerializer

    def get_queryset(self):
        items = Item.objects.filter(
            shopping_list=self.request.user.shopping_list,
            is_archived=False
        )

        return items
