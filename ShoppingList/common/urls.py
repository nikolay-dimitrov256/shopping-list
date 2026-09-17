from django.urls import path
from ShoppingList.common import views

urlpatterns = [
    path('', views.DashboardView.as_view(), name='dashboard'),
]