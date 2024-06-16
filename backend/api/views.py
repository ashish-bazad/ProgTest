from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required, user_passes_test
from .models import Quiz, MCQquestions, MCQoptions, MCQanswers, NumericalQuestions, NumericalAnswers, NumericalAnswered, MCQanswered, QuizAttempts, CodingQuestions, CodingAnswered, SuspiciousActivity, userProfile, TestCases, TestCasesOutputs
from .serializers import QuizSerializer, MCQquestionsSerializer, MCQoptionsSerializer, NumericalQuestionsSerializer, CodingAnsweredSerializer, CodingQuestionsSerializer, TestCasesSerializer, SuspiciousActivitySerializer, MCQanswersSerializer, NumericalAnswersSerializer, TestCasesOutputsSerializer
from django.contrib.auth.models import User
from django.http import HttpResponse
import subprocess as sb


@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def createQuiz(request):
    try:
        data = request.data
        qz = Quiz.objects.create(title = data['title'], mcqs = data['mcqs'], numericals = data['numericals'], coding = data['coding'], date = data['date'], start_time = data['start_time'], duration = data['duration'])
    except:
        return Response(status = status.HTTP_400_BAD_REQUEST)
    return Response({"id": qz.id}, status = status.HTTP_201_CREATED)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def editQuiz(request):
    try:
        data = request.data
        qz = Quiz.objects.get(id = data['id'])
        if qz:
            qz.title = data['title']
            qz.mcqs = data['mcqs']
            qz.numericals = data['numericals']
            qz.coding = data['coding']
            qz.date = data['date']
            qz.start_time = data['start_time']
            qz.duration = data['duration']
            qz.save()
            if not qz.mcqs:
                MCQquestions.objects.filter(quiz = qz).delete()
            if not qz.coding:
                CodingQuestions.objects.filter(quiz = qz).delete()
            if not qz.numericals:
                NumericalQuestions.objects.filter(quiz = qz).delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({"message":"quiz not found"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def addMCQquestion(request):
    try:
        data = request.data
        que=MCQquestions.objects.create(quiz = Quiz.objects.filter(id = data['quiz'])[0], question = data['question'], marks = int(data['marks']))
        return Response({que.id},status = status.HTTP_201_CREATED)
    except:
        return Response({"message":"some error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@login_required
def get_mcq_question(request):
    qid = request.GET.get('id')
    combined_response = {}
    ser = MCQquestionsSerializer(MCQquestions.objects.get(id = qid))
    serializer = MCQoptionsSerializer(MCQoptions.objects.filter(question = MCQquestions.objects.get(id = qid)), many = True)
    combined_response["mcq"] = ser.data
    combined_response["options"] = serializer.data
    return Response(combined_response, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def get_numerical_question(request):
    qid = request.GET.get('id')
    combined_response = {}
    qs = NumericalQuestions.objects.get(id = qid)
    ser = NumericalQuestionsSerializer(qs)
    combined_response["numerical"] = ser.data
    ans = NumericalAnswers.objects.get(question = qs)
    sser = NumericalAnswersSerializer(ans)
    combined_response["answer"] = sser.data
    return Response(combined_response, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def get_mcq_answer(request):
    qid = request.GET.get('id')
    qs = MCQquestions.objects.get(id = qid)
    ser = MCQanswersSerializer(MCQanswers.objects.get(question = qs))
    return Response(ser.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def edit_mcq_question(request):
    data = request.data
    qs = MCQquestions.objects.get(id = data['id'])
    if qs:
        qs.question = data['question']
        qs.marks = data['marks']
        qs.save()
        qsa = MCQanswers.objects.get(id = data['ida'])
        qsa.answer = MCQoptions.objects.get(id = data['answer'])
        qsa.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response({"message":"no such question found with this id"}, status = status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def addMCQoption(request):
    data = request.data
    for i in data:
        if i != "question" and i != "answer":
            mo = MCQoptions.objects.create(question = MCQquestions.objects.filter(id = data['question'])[0], value = data[i])
            if i == data['answer']:
                MCQanswers.objects.create(question = MCQquestions.objects.filter(id = data['question'])[0], answer = MCQoptions.objects.filter(id = mo.id)[0])
    return Response(status = status.HTTP_201_CREATED)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def edit_mcq_option(request):
    data = request.data
    op = MCQoptions.objects.get(id = data['id'])
    op.value = data['value']
    op.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def addNumericalQuestion(request):
    data = request.data
    nq = NumericalQuestions.objects.create(quiz = Quiz.objects.filter(id = data['quiz'])[0], question = data['question'], marks = data['marks'])
    return Response({nq.id}, status = status.HTTP_201_CREATED)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def edit_numerical_question(request):
    data = request.data
    nq = NumericalQuestions.objects.get(id = data['id'])
    if nq:
        nq.question = data['question']
        nq.marks = data['marks']
        nq.save()
        nqa = NumericalAnswers.objects.get(id = data['ida'])
        nqa.answer = data['answer']
        nqa.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response({"message":"question not found with this id"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def delNumericalQuestion(request):
    data = request.data
    NumericalQuestions.objects.filter(id = data['id']).delete()
    return Response({"message":"deleted numerical question"},status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def delMCQquestion(request):
    data = request.data
    MCQquestions.objects.filter(id = data['id']).delete()
    return Response({"message":"deleted mcq question"},status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def delQuiz(request):
    data = request.data
    Quiz.objects.filter(id = data['id']).delete()
    return Response({"message":"deleted quiz"},status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def addNumericalAnswer(request):
    data = request.data
    NumericalAnswers.objects.create(question = NumericalQuestions.objects.filter(id = data['question'])[0], answer = data['answer'])
    return Response(status = status.HTTP_201_CREATED)

@api_view(['POST'])
@login_required
def save_responses(request):
    data = request.data
    if Quiz.objects.filter(id = data['quiz']):
        if QuizAttempts.objects.filter(quiz = Quiz.objects.filter(id = data['quiz'])[0], user = request.user):
            pass
        else:
            QuizAttempts.objects.create(quiz = Quiz.objects.filter(id = data['quiz'])[0], user = request.user)
        qz = Quiz.objects.get(id = data['quiz'])
        if qz.mcqs:
            for i in data['mcqs']:
                if data['mcqs'][i] == -1:
                    continue
                MCQanswered.objects.create(user = request.user, question = MCQquestions.objects.filter(id = i)[0], value = MCQoptions.objects.filter(id = data['mcqs'][i])[0], quiz = qz)
        if qz.numericals:
            for i in data['numericals']:
                if data['numericals'][i] == '':
                    continue
                NumericalAnswered.objects.create(user = request.user, question = NumericalQuestions.objects.filter(id = i)[0], value = int(data['numericals'][i]), quiz = qz)
        return Response(status = status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
@login_required
def save_code(request):
    data = request.data
    if Quiz.objects.filter(id = data['quiz']):
        qz = Quiz.objects.get(id = data['quiz'])
        if qz.coding:
            for i in data['coding']:
                if CodingAnswered.objects.filter(user = request.user, question = CodingQuestions.objects.filter(id = i)[0], quiz = qz):
                    a = CodingAnswered.objects.filter(user = request.user, question = CodingQuestions.objects.filter(id = i)[0], quiz = qz)[0]
                    a.value = data['coding'][i]
                    a.save()
                else:
                    CodingAnswered.objects.create(user = request.user, question = CodingQuestions.objects.filter(id = i)[0], quiz = qz, value = data['coding'][i])
            return Response({"message":"saved successfully"},status=status.HTTP_200_OK)
    return Response({"message":"Internal Server Error, Quiz not found"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
def submit_code_quiz(request):
    data = request.data
    if Quiz.objects.filter(id = data['quiz']):
        if QuizAttempts.objects.filter(quiz = Quiz.objects.filter(id = data['quiz'])[0], user = request.user):
            pass
        else:
            QuizAttempts.objects.create(quiz = Quiz.objects.filter(id = data['quiz'])[0], user = request.user)
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@login_required
def get_quizes(request):
    serializer = QuizSerializer(Quiz.objects.all(), many = True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def get_questions(request):
    quiz_id = request.GET.get('quiz')
    try:
        qz = Quiz.objects.get(id=quiz_id)
        combined_response = {}
        if qz.mcqs:
            mcq_serializer = MCQquestionsSerializer(MCQquestions.objects.filter(quiz=qz), many=True)
            combined_response["mcqs"] = mcq_serializer.data
            for i, j in enumerate(combined_response["mcqs"]):
                serializer = MCQoptionsSerializer(MCQoptions.objects.filter(question = combined_response["mcqs"][i]["id"]), many = True)
                combined_response["mcqs"][i]["options"] = serializer.data
        if qz.numericals:
            numerical_serializer = NumericalQuestionsSerializer(NumericalQuestions.objects.filter(quiz=qz), many=True)
            combined_response["numericals"] = numerical_serializer.data
        
        if qz.coding:
            coding_serializer = CodingQuestionsSerializer(CodingQuestions.objects.filter(quiz = qz), many = True)
            combined_response["coding"] = coding_serializer.data

        return Response(combined_response, status=status.HTTP_200_OK)
    except Quiz.DoesNotExist:
        return Response({"message": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@login_required
@user_passes_test(lambda u:u.is_superuser)
def get_questions_with_answers(request):
    id = request.GET.get('id')
    qz = Quiz.objects.get(id = id)
    combined_response = {}
    if qz.mcqs:
        mcqser = MCQquestionsSerializer(MCQquestions.objects.filter(quiz = qz), many = True)
        combined_response["mcqs"] = mcqser.data
        for i, j in enumerate(combined_response["mcqs"]):
            serializer = MCQoptionsSerializer(MCQoptions.objects.filter(question = combined_response["mcqs"][i]["id"]), many = True)
            combined_response["mcqs"][i]["options"] = serializer.data

        for i in combined_response["mcqs"]:
            att = MCQanswered.objects.filter(question = MCQquestions.objects.get(id = int(i['id'])))
            if att:
                i['response']=att[0].value.id
            else:
                i['response'] = -1
            i['answer'] = MCQanswers.objects.get(question = MCQquestions.objects.get(id = int(i['id']))).answer.id

    if qz.numericals:
        numser = NumericalQuestionsSerializer(NumericalQuestions.objects.filter(quiz = qz), many = True)
        combined_response['numericals'] = numser.data
        for i in combined_response['numericals']:
            att = NumericalAnswered.objects.filter(question = NumericalQuestions.objects.get(id = i['id']))
            if att:
                i['response'] = att[0].value
            else:
                i['response'] = 'unattempted'
            i['answer'] = NumericalAnswers.objects.get(question = NumericalQuestions.objects.get(id = i['id'])).answer
    return Response(combined_response, status = status.HTTP_200_OK)
        

@api_view(['GET'])
@login_required
def get_quiz(request):
    quiz_id = request.GET.get('quiz')
    if Quiz.objects.filter(id = quiz_id):
        serializer = QuizSerializer(Quiz.objects.filter(id = quiz_id)[0])
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"message":"quiz not found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@login_required
def check_attempted(request):
    if QuizAttempts.objects.filter(quiz = Quiz.objects.filter(id = int(request.GET.get('id')))[0], user = request.user):
        return Response({True}, status=status.HTTP_200_OK)
    else:
        return Response({False}, status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def add_coding_question(request):
    data = request.data
    CodingQuestions.objects.create(question = data['question'], quiz = Quiz.objects.filter(id = int(data['quiz']))[0], title = data['title'], example_input = data['example_input'], example_output = data['example_output'])
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def edit_coding_question(request):
    data = request.data
    qs = CodingQuestions.objects.get(id = data['id'])
    if qs:
        qs.title = data['title']
        qs.question = data['question']
        qs.example_input = data['example_input']
        qs.example_output = data['example_output']
        qs.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response({"message":"question not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def delCodingQuestion(request):
    data = request.data
    CodingQuestions.objects.filter(id = data['id']).delete()
    return Response({"message":"deleted coding question"},status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def numCod(request):
    id = request.GET.get('quiz')
    ans = len(CodingQuestions.objects.filter(quiz_id = id))
    return Response({ans}, status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
@user_passes_test(lambda u: u.is_superuser)
def compute_result(request):
    quiz_id = request.GET.get('quiz')
    li = QuizAttempts.objects.filter(quiz_id = quiz_id)
    qz = Quiz.objects.get(id = quiz_id)
    for i in li:
        total = 0
        # uid = i.user_id
        if qz.mcqs:
            questions = MCQanswered.objects.filter(user = i.user, quiz = qz)
            for j in questions:
                if j.value == MCQanswers.objects.filter(question = j.question)[0].answer:
                    total += int(j.question.marks)
        if qz.numericals:
            questions = NumericalAnswered.objects.filter(user = i.user, quiz = qz)
            for j in questions:
                if j.value == NumericalAnswers.objects.filter(question = j.question)[0].answer:
                    total += int(j.question.marks)
        if qz.coding:
            questions = CodingAnswered.objects.filter(user = i.user, quiz = qz)
            for j in questions:
                testCases = TestCases.objects.filter(question = j.question)
                code = j.value
                with open(f"{i.user.id}.cpp", "w") as f:
                    print(code, file = f)
                a = sb.run(f"g++ {i.user.id}.cpp -o {i.user.id}", shell = True, capture_output=True)
                if a.returncode != 0:
                    for k in testCases:
                        tmp = TestCasesOutputs.objects.filter(test_case = k)
                        if tmp:
                            tmp[0].output = a.stderr.decode('utf-8')
                            tmp[0].score = 0
                            tmp[0].save()
                        else:
                            TestCasesOutputs.objects.create(test_case = k, output = a.stderr.decode('utf-8'), score = 0)
                    d = sb.run(f"rm {i.user.id}.cpp", shell = True)
                    continue
                for k in testCases:
                    id = k.id
                    with open(f"in{id}", "w") as f:
                        print(k.input, file=f)
                    try:
                        b = sb.run(f"./{i.user.id} < in{id}", shell = True, timeout=5, capture_output=True)
                        c = sb.run(f"rm in{id}", shell = True)
                        if b.returncode == 0 and b.stdout.decode('utf-8') == k.expected_output:
                            total += k.marks
                        tmp = TestCasesOutputs.objects.filter(test_case = k)
                        if tmp:
                            if b.returncode == 0:
                                tmp[0].output = b.stdout.decode('utf-8')
                                tmp[0].score = k.marks if b.stdout.decode('utf-8') == k.expected_output else 0
                                tmp[0].save()
                            else:
                                tmp[0].output = b.stderr.decode('utf-8')
                                tmp[0].score = 0
                                tmp[0].save()
                        else:
                            if b.returncode == 0:
                                TestCasesOutputs.objects.create(test_case = k, output = b.stdout.decode('utf-8'), score = k.marks if k.expected_output == b.stdout.decode('utf-8') else 0)
                            else:
                                TestCasesOutputs.objects.create(test_case = k, output = b.stderr.decode('utf-8'), score = 0)

                    except sb.TimeoutExpired:
                        c = sb.run(f"rm in{id}", shell = True)
                        tmp = TestCasesOutputs.objects.filter(test_case = k)
                        if tmp:
                            tmp[0].output = "Time Limit Exceeded"
                            tmp[0].score = 0
                            tmp[0].save()
                        else:
                            TestCasesOutputs.objects.create(test_case = k, output = "Time Limit Exceeded", score = 0)
                        continue
                d = sb.run(f"rm {i.user.id}.cpp {i.user.id}", shell = True)
        i.total = total
        i.save()
    return Response({"message": "result computed"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@login_required
def run_code(request):
    code = request.data['code']
    ques = CodingQuestions.objects.get(id = request.data['question'])
    id = request.user.id
    with open(f"{id}.cpp", "w") as fi:
        print(code, file = fi)
    with open(f"in{id}", "w") as f:
        print(ques.example_input, file = f)
    a = sb.run(f"g++ {id}.cpp -o {id}", shell = True, capture_output=True)
    if a.returncode != 0:
        d = sb.run(f"rm {id}.cpp in{id}", shell = True)
        return Response({"message":"Compilation Error", "output":a.stderr,"result":False}, status = status.HTTP_200_OK)
    else:
        try:
            b = sb.run(f"./{id} < in{id}", shell = True, timeout = 5, capture_output=True)
            c = sb.run(f"rm {id} {id}.cpp in{id}", shell = True)
            if b.returncode != 0:
                return Response({"message":"Compiled Successfully","output":b.stderr, "result":False}, status=status.HTTP_200_OK)
            else:
                return Response({"message":"Compiled Successfully","output":b.stdout, "result":b.stdout.decode('utf-8') == ques.example_output}, status=status.HTTP_200_OK)
        except sb.TimeoutExpired:
            c = sb.run(f"rm {id} {id}.cpp in{id}", shell = True)
            return Response({"message":"Time Limit Exceeded", "output":"Time Limit Exceeded", "result":False}, status = status.HTTP_200_OK)

@api_view(['POST'])
@login_required
def run_saved_code(request):
    data = request.data
    if Quiz.objects.filter(id = data['quiz']):
        qz = Quiz.objects.get(id = data['quiz'])
        ques = CodingQuestions.objects.get(id = int(data['question']))
        code = ""
        if CodingAnswered.objects.filter(quiz = qz, user = request.user, question = ques):
            code = CodingAnswered.objects.filter(quiz = qz, user = request.user, question = ques)[0].value
        else:
            return Response({"message":"No Saved Code Found", "result":False,"output":""}, status=status.HTTP_200_OK)
        id = request.user.id
        with open(f"{id}.cpp", "w") as fi:
            print(code, file = fi)
        with open(f"in{id}", "w") as f:
            print(ques.example_input, file = f)
        a = sb.run(f"g++ {id}.cpp -o {id}", shell = True, capture_output=True)
        if a.returncode != 0:
            d = sb.run(f"rm {id}.cpp in{id}", shell = True)
            return Response({"message":"Compilation Error", "output":a.stderr,"result":False}, status = status.HTTP_200_OK)
        else:
            try:
                b = sb.run(f"./{id} < in{id}", shell = True, timeout = 5, capture_output=True)
                c = sb.run(f"rm {id} {id}.cpp in{id}", shell = True)
                if b.returncode != 0:
                    return Response({"message":"Compiled Successfully","output":b.stderr, "result":False}, status=status.HTTP_200_OK)
                else:
                    return Response({"message":"Compiled Successfully","output":b.stdout, "result":b.stdout.decode('utf-8') == ques.example_output}, status=status.HTTP_200_OK)
            except sb.TimeoutExpired:
                c = sb.run(f"rm {id} {id}.cpp in{id}", shell = True)
                return Response({"message":"Time Limit Exceeded", "output":"Time Limit Exceeded", "result":False}, status = status.HTTP_200_OK)
    else:
        return Response({"message":"No Saved Code Found","result":False,"output":""},status=status.HTTP_200_OK)

@api_view(['GET'])
@login_required
def get_saved_code(request):
    qid = request.GET.get('quiz')
    qz = Quiz.objects.get(id = qid)
    ques_id = request.GET.get('question')
    ques = CodingQuestions.objects.get(id = ques_id)
    if CodingAnswered.objects.filter(quiz = qz, user = request.user, question = ques):
        code = CodingAnswered.objects.get(quiz = qz, user = request.user, question = ques).value
        return Response({"message":"Code Found", "code":code}, status=status.HTTP_200_OK)
    else:
        return Response({"message":"No Saved Code Found", "code":""}, status=status.HTTP_200_OK)

@login_required
@api_view(['GET'])
def check_superuser(request):
    if request.user.is_superuser:
        return Response({"superuser":True}, status = status.HTTP_200_OK)
    else:
        return Response({"superuser":False}, status= status.HTTP_200_OK)

@login_required
@api_view(['POST'])
def add_suspicious_activity(request):
    if Quiz.objects.filter(id = request.data['quiz']):
        qz = Quiz.objects.get(id = request.data['quiz'])
        user = request.user
        SuspiciousActivity.objects.create(quiz = qz, user = user, full = request.data['full'], hidden = request.data['hidden'], full_duration = request.data['full_duration'], hidden_duration = request.data['hidden_duration'], time = request.data['time'])
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_404_NOT_FOUND)

@login_required
@api_view(['POST'])
def add_roll_number(request):
    if userProfile.objects.filter(user = request.user):
        return Response({"message":"already present"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    else:
        userProfile.objects.create(user = request.user, roll = int(request.data['roll']))
    return Response(status=status.HTTP_200_OK)

@login_required
@api_view(['GET'])
def check_roll_number(request):
    if userProfile.objects.filter(user = request.user):
        return Response({"roll": True}, status=status.HTTP_200_OK)
    else:
        return Response({"roll":False}, status=status.HTTP_200_OK)

@login_required
@api_view(['GET'])
@user_passes_test(lambda u: u.is_superuser)
def get_result_all(request):
    qid = request.GET.get("quiz")
    qz = Quiz.objects.get(id = qid)
    if qz:
        li = QuizAttempts.objects.filter(quiz = qz)
        responseData = {}
        for i in li:
            roll = userProfile.objects.get(user = i.user).roll
            responseData[roll] = i.total
        return Response(responseData, status = status.HTTP_200_OK)
    else:
        return Response({"message":"quiz not found"}, status=status.HTTP_404_NOT_FOUND)

@login_required
@api_view(['POST'])
@user_passes_test(lambda u: u.is_superuser)
def add_test_case(request):
    data = request.data
    que = CodingQuestions.objects.get(id = data['question'])
    if que:
        TestCases.objects.create(question = que, input = data['input'], expected_output = data['expected_output'], marks = int(data['marks']))
        return Response(status=status.HTTP_200_OK)
    else:
        return Response({"message":"No Question found"}, status=status.HTTP_404_NOT_FOUND)

@login_required
@api_view(['POST'])
@user_passes_test(lambda u: u.is_superuser)
def edit_test_case(request):
    data = request.data
    tc = TestCases.objects.get(id = data['id'])
    if tc:
        tc.input = data['input']
        tc.expected_output = data['expected_output']
        tc.marks = data['marks']
        tc.save()
    else:
        return Response({"message":"test case not found with this id"}, status=status.HTTP_404_NOT_FOUND)

@login_required
@api_view(['POST'])
@user_passes_test(lambda u: u.is_superuser)
def delete_test_case(request):
    data = request.data
    if TestCases.objects.get(id = data['id']):
        TestCases.objects.get(id = data['id']).delete()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@login_required
@api_view(['GET'])
@user_passes_test(lambda u: u.is_superuser)
def get_test_cases(request):
    question_id = request.GET.get('question_id')
    serializer = TestCasesSerializer(TestCases.objects.filter(question = CodingQuestions.objects.get(id = question_id)), many = True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@login_required
@api_view(['GET'])
@user_passes_test(lambda u: u.is_superuser)
def get_test_case(request):
    try:
        id = request.GET.get('id')
        serializer = TestCasesSerializer(TestCases.objects.get(id=id))
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@login_required
@api_view(['GET'])
def get_coding_question(request):
    question_id = request.GET.get('id')
    serializer = CodingQuestionsSerializer(CodingQuestions.objects.get(id = question_id))
    return Response(serializer.data, status=status.HTTP_200_OK)

@login_required
@api_view(['GET'])
def get_suspicious_activity(request):
    id = request.GET.get('id')
    roll = request.GET.get('roll')
    profile = userProfile.objects.get(roll = int(roll))
    qz = Quiz.objects.get(id = id)
    serializer = SuspiciousActivitySerializer(SuspiciousActivity.objects.filter(user = profile.user, quiz = qz),many = True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@login_required
@api_view(['GET'])
@user_passes_test(lambda u: u.is_superuser)
def get_result_test_cases(request):
    id = request.GET.get('id')
    testCases = TestCases.objects.filter(question = CodingQuestions.objects.get(id = id))
    ser = TestCasesSerializer(testCases, many = True)
    ta = CodingAnswered.objects.filter(question = CodingQuestions.objects.get(id = id))
    combined_response = ser.data
    for i in combined_response:
        tid = i['id']
        if ta:
            i['result'] = TestCasesOutputsSerializer(TestCasesOutputs.objects.get(test_case = TestCases.objects.get(id = tid))).data
        else:
            i['result'] = {"score":0, "output":"unattempted", "test_case":tid}
    return Response(combined_response, status=status.HTTP_200_OK)