from django.contrib.auth.views import LogoutView
from django.urls import path

from ShoppingList.users import views

urlpatterns = [
    path('register/', views.AppUserRegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login/', views.AppUserLoginView.as_view(), name='login'),
]