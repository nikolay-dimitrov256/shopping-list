from django.urls import path

from ShoppingList.items import views

urlpatterns = [
    path('archive/', views.archive_items_view, name='archive-items'),
]