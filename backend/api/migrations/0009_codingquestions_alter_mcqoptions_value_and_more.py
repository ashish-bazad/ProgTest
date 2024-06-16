# Generated by Django 4.2.11 on 2024-03-29 16:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0008_rename_quiz_id_mcqquestions_quiz'),
    ]

    operations = [
        migrations.CreateModel(
            name='CodingQuestions',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('question', models.CharField(max_length=5000)),
            ],
        ),
        migrations.AlterField(
            model_name='mcqoptions',
            name='value',
            field=models.CharField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='mcqquestions',
            name='question',
            field=models.CharField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='numericalquestions',
            name='question',
            field=models.CharField(max_length=5000),
        ),
        migrations.CreateModel(
            name='CodingAnswered',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.TextField(max_length=10000)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.codingquestions')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
