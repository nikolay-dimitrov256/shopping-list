from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from ShoppingList.users.models import Profile

UserModel = get_user_model()


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    fields = ['__all__']


@admin.register(UserModel)
class UserModelAdmin(UserAdmin):
    inlines = [ProfileInline]
    add_form_template = 'admin/auth/user/add_form.html'
    change_user_password_template = None

    ordering = ['email']
    list_display = ['__str__']

