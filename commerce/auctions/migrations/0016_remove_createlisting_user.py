# Generated by Django 5.0.7 on 2024-08-08 19:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0015_createlisting_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='createlisting',
            name='user',
        ),
    ]
