from django.db import models
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount
from django.utils import timezone
# Create your models here.

class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length = 100)
    mcqs = models.BooleanField(default = False)
    numericals = models.BooleanField(default = False)
    coding = models.BooleanField(default = False)
    date = models.DateField()
    start_time = models.TimeField()
    duration = models.IntegerField() # in minutes

class MCQquestions(models.Model):
    id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE)
    question = models.CharField(max_length = 5000)
    marks = models.TextField()

class MCQoptions(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(MCQquestions, on_delete = models.CASCADE)
    value = models.CharField(max_length = 5000)

class MCQanswers(models.Model):
    question = models.ForeignKey(MCQquestions, on_delete = models.CASCADE)
    answer = models.ForeignKey(MCQoptions, on_delete = models.CASCADE)

class NumericalQuestions(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE)
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length = 5000)
    marks = models.TextField()

class NumericalAnswers(models.Model):
    question = models.ForeignKey(NumericalQuestions, on_delete = models.CASCADE)
    answer = models.IntegerField()

class QuizAttempts(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    total = models.IntegerField(default = -1)

class MCQanswered(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    question = models.ForeignKey(MCQquestions, on_delete = models.CASCADE)
    value = models.ForeignKey(MCQoptions, on_delete = models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, default = None)

class NumericalAnswered(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    question = models.ForeignKey(NumericalQuestions, on_delete = models.CASCADE)
    value = models.IntegerField()
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, default = None)

class CodingQuestions(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length = 100, default = "")
    question = models.CharField(max_length = 5000)
    example_input = models.CharField(max_length = 500, default = "")
    example_output = models.CharField(max_length = 500, default = "")
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE)

class CodingAnswered(models.Model):
    question = models.ForeignKey(CodingQuestions, on_delete = models.CASCADE)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    value = models.TextField(max_length = 10000)
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE, default = None)

class SuspiciousActivity(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete = models.CASCADE)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    full = models.BooleanField()
    hidden = models.BooleanField()
    full_duration = models.IntegerField()
    hidden_duration = models.IntegerField()
    time = models.TimeField(default=timezone.now)

class userProfile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    roll = models.IntegerField(unique = True)

class TestCases(models.Model):
    question = models.ForeignKey(CodingQuestions, on_delete = models.CASCADE)
    input = models.CharField(max_length = 5000)
    expected_output = models.CharField(max_length = 5000)
    marks = models.IntegerField(default = 0)

class TestCasesOutputs(models.Model):
    test_case = models.ForeignKey(TestCases, on_delete=models.CASCADE)
    output = models.CharField(max_length=5000)
    score = models.IntegerField(default = 0)