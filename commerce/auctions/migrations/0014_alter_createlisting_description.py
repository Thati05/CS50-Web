# Generated by Django 5.0.7 on 2024-08-06 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0013_alter_createlisting_image_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='createlisting',
            name='description',
            field=models.CharField(default='No description', max_length=300),
        ),
    ]
