from django.urls import path, include

from ShoppingList.items import views

urlpatterns = [
    path('create/', views.CreateItemView.as_view(), name='create-item')
]