from django.contrib.auth import get_user_model
from django.db import models

UserModel = get_user_model()


class Store(models.Model):
    name = models.CharField(
        verbose_name='име',
        max_length=50,
    )

    is_global = models.BooleanField(
        verbose_name='глобален',
        default=False,
    )

    user = models.ForeignKey(
        verbose_name='потребител',
        to=UserModel,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
