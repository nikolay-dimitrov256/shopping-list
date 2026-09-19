from django.contrib.auth import get_user_model
from django.db import models

from ShoppingList.items.choices import UnitChoices

UserModel = get_user_model()


class ShoppingList(models.Model):
    user = models.OneToOneField(
        to=UserModel,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='shopping_list'
    )

    def __str__(self):
        return f'Списък на {self.user}'

    class Meta:
        verbose_name = 'списък'
        verbose_name_plural = 'списъци'


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

    quantity = models.PositiveIntegerField(
        verbose_name='количество',
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

    is_bought = models.BooleanField(
        verbose_name='закупен',
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    bought_at = models.DateTimeField(
        null=True,
        blank=True,
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
        null=True,
        blank=True,
    )

    category = models.ManyToManyField(
        verbose_name='категория',
        to='Category',
        related_name='items',
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'продукт'
        verbose_name_plural = 'продукти'


class Category(models.Model):
    name = models.CharField(
        verbose_name='име',
        max_length=50,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'