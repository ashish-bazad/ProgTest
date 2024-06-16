from django.contrib import admin

# Register your models here.

from .models import Quiz, MCQanswers, MCQoptions, MCQquestions, NumericalAnswers, NumericalQuestions, QuizAttempts, MCQanswered, NumericalAnswered

admin.site.register(Quiz)
admin.site.register(MCQanswers)
admin.site.register(MCQoptions)
admin.site.register(MCQquestions)
admin.site.register(NumericalAnswers)
admin.site.register(NumericalQuestions)
admin.site.register(QuizAttempts)
admin.site.register(MCQanswered)
admin.site.register(NumericalAnswered)