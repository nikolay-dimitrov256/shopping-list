from django.contrib.auth import get_user_model
from django.db import models

from ShoppingList.items.choices import UnitChoices

UserModel = get_user_model()


class ShoppingList(models.Model):
    user = models.OneToOneField(
        to=UserModel,
        on_delete=models.CASCADE,
        primary_key=True,
    )

    def __str__(self):
        return f'Списък на {self.user}'


class Item(models.Model):
    name = models.CharField(
        verbose_name='име',
        max_length=150
    )

    notes = models.TextField(
        verbose_name='забележка',
        null=True,
        blank=True,
    )

    quantity = models.DecimalField(
        verbose_name='количество',
        decimal_places=3,
        max_digits=7,
        default=1
    )

    unit = models.CharField(
        verbose_name='мерни единици',
        max_length=5,
        choices=UnitChoices.choices,
        default=UnitChoices.PIECES,
    )

    is_urgent = models.BooleanField(
        verbose_name='спешно',
        default=False,
    )

    shopping_list = models.ForeignKey(
        to=ShoppingList,
        on_delete=models.CASCADE,
        related_name='items',
    )

    store = models.ForeignKey(
        verbose_name='магазин',
        to='stores.Store',
        on_delete=models.CASCADE,
        related_name='items',
    )

    category = models.ManyToManyField(
        verbose_name='категория',
        to='Category',
        related_name='items',
    )


class Category(models.Model):
    name = models.CharField(
        verbose_name='име',
        max_length=50,
    )