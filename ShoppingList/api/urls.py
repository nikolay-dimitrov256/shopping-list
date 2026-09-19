from django.urls import path

from ShoppingList.api import views

urlpatterns = [
    path('items/', views.ListCreateItemAPIView.as_view()),
    path('items/<int:pk>/', views.CreateUpdateDeleteItemAPIView.as_view()),
]