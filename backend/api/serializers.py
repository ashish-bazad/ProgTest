from rest_framework import serializers
from .models import Quiz, MCQquestions, MCQoptions, NumericalQuestions, QuizAttempts, MCQanswered, NumericalAnswered, CodingAnswered, CodingQuestions, TestCases, SuspiciousActivity, MCQanswers, NumericalAnswers, TestCasesOutputs

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

class QuizAttemptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempts
        fields = '__all__'

class MCQquestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQquestions
        fields = '__all__'

class MCQoptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQoptions
        fields = '__all__'

class MCQanswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQanswers
        fields = '__all__'

class MCQansweredSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQanswered
        fields = '__all__'

class NumericalQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NumericalQuestions
        fields = '__all__'

class NumericalAnsweredSerializer(serializers.ModelSerializer):
    class Meta:
        model = NumericalAnswered
        fields = '__all__'

class NumericalAnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = NumericalAnswers
        fields = '__all__'

class CodingAnsweredSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingAnswered
        fields = '__all__'

class CodingQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingQuestions
        fields = '__all__'

class TestCasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCases
        fields = '__all__'

class TestCasesOutputsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCasesOutputs
        fields = '__all__'
    
class SuspiciousActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = SuspiciousActivity
        fields = '__all__'