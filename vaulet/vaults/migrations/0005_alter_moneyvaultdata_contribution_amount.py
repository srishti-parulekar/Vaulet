# Generated by Django 5.1.5 on 2025-02-13 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vaults", "0004_moneyvaultdata"),
    ]

    operations = [
        migrations.AlterField(
            model_name="moneyvaultdata",
            name="contribution_amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
