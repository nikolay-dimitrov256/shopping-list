from django.contrib.auth import get_user_model
from django.contrib.auth.forms import BaseUserCreationForm, UserChangeForm

UserModel = get_user_model()


class AppUserCreateForm(BaseUserCreationForm):
    class Meta:
        model = UserModel
        fields = ['email', 'password1', 'password2']


class AppUserChangeForm(UserChangeForm):
    class Meta:
        model = UserModel
        fields = '__all__'
