from django.db.models import TextChoices


class UnitChoices(TextChoices):
    PIECES = 'pcs', 'бр.'
    LITRES = 'lt', 'л'
    MILLILITRES = 'ml', 'мл'
    KILOGRAMS = 'kg', 'кг'
    GRAMS = 'gr', 'гр'
    METERS = 'm', 'м'
    OUNCES = 'oz', 'ун'