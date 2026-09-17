from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from ShoppingList.items.models import ShoppingList

UserModel = get_user_model()


@receiver(post_save, sender=UserModel)
def create_shopping_list(sender, instance, created, **kwargs):
    if created:
        ShoppingList.objects.create(user=instance)