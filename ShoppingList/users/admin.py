from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from ShoppingList.users.forms import AppUserChangeForm, AppUserCreateForm
from ShoppingList.users.models import Profile

UserModel = get_user_model()


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    fields = ['first_name', 'last_name']


@admin.register(UserModel)
class UserModelAdmin(UserAdmin):
    inlines = [ProfileInline]
    add_form_template = 'admin/auth/user/add_form.html'
    change_user_password_template = None

    ordering = ['email']
    list_display = ['__str__']
    readonly_fields = ['date_joined', 'last_login']
    form = AppUserChangeForm
    add_form = AppUserCreateForm

    fieldsets = [
        ['Credentials', {'fields': ['email', 'password']}],
        ['Personal Info', {'fields': ['date_joined', 'last_login']}],
        ['Permissions', {'fields': ['is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions']}]
    ]

    add_fieldsets = [
        [
            None,
            {
                'classes': ['wide'],
                'fields': ['email', 'password1', 'password2']
            }
        ]
    ]
