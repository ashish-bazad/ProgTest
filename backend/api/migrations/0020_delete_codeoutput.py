# Generated by Django 4.2.11 on 2024-04-08 23:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_rename_test_case_testcases_input_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CodeOutput',
        ),
    ]
