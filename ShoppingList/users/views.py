from django.contrib.auth import get_user_model, login
from django.contrib.auth.decorators import login_not_required
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.decorators import classonlymethod, method_decorator
from django.views.generic import CreateView

from ShoppingList.users.forms import AppUserCreateForm

UserModel = get_user_model()


class AppUserRegisterView(CreateView):
    model = UserModel
    form_class = AppUserCreateForm
    template_name = 'users/register.html'

    def get_success_url(self):
        return self.request.META.get('HTTP_REFERRER') or reverse('dashboard')

    @method_decorator(login_not_required)
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(self.get_success_url())

        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        self.object = form.save()

        login(self.request, self.object)

        return redirect(self.get_success_url())


class AppUserLoginView(LoginView):
    template_name = 'users/login.html'

    @method_decorator(login_not_required)
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(self.get_success_url())

        return super().dispatch(request, *args, **kwargs)
