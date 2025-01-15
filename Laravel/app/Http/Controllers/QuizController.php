<?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\QuizSubmission;

class QuizController extends Controller
{
    public function index($id)
    {
        $quizzes = Quiz::where('classroom_id', $id)->get();
        return response()->json($quizzes);
    }


    public function store(Request $request, $classId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'questions' => 'nullable|array',
            'questions.*.text' => 'required_with:questions|string|max:255',
            'questions.*.type' => 'required_with:questions|in:multiple_choice,true_false,short_answer',
            'questions.*.options' => 'nullable|array',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.points' => 'required_with:questions|integer',
        ]);
        
        $validated['classroom_id'] = $classId;
        $quiz = Quiz::create($validated);

        if (isset($validated['questions'])) {
            foreach ($validated['questions'] as $questionData) {
                $questionData['quiz_id'] = $quiz->id;
                Question::create($questionData);
            }
        }

        return response()->json(['message' => 'Quiz and questions created successfully!', 'quiz' => $quiz]);
    }

    public function show($id)
    {
        $quiz = Quiz::with('questions')->findOrFail($id);
        $quiz->class = $quiz->classroom->name;
        return response()->json($quiz);
    }
    public function getAllQuizzes($classroomId)
    {
        $quizzes = Quiz::where('classroom_id', $classroomId)->get();
        $quizzes->each(function ($quizze) {
            $quizze->class = $quizze->classroom->name;
        });
        return response()->json($quizzes);
    }
    public function storeQuestion(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'text' => 'required|string|max:255',
            'type' => 'required|in:multiple_choice,true_false,short_answer',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable|string',
            'points' => 'required|integer',
        ]);

        $question = Question::create($validated);

        return response()->json([
            'message' => 'Question created successfully!',
            'question' => $question,
        ]);
    }

    public function submit(Request $request,$quizId)
    {
        $validated = $request->validate([
            'score' => 'required|integer', // Score obtenu
            'answers' => 'required|array', // Tableau des réponses
        ]);

        $submission = QuizSubmission::create([
            'quiz_id' => $quizId,
            'score' => $validated['score'],
            'student_id' => auth()->id(),
            'answers' => $validated['answers'],
            'submitted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Quiz soumis avec succès.',
            'submission' => $submission,
        ]);
    }

    public function showAllSubmissions($quizId)
    {
        $submissions = QuizSubmission::where('quiz_id', $quizId)
            ->with('student:id,name,avatar')
            ->get();

        return response()->json($submissions);
    }

    public function showQuizSubmit($quizId)
    {
        $submissions = QuizSubmission::where('quiz_id', $quizId)
            ->where('student_id', auth()->id())
            ->get();

        return response()->json($submissions[0] ?? null);
    }
    public function getQuizzes()
    {
        $user = auth()->user();

        if ($user->role === 'teacher') {
            $quizzes = Quiz::whereHas('classroom', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->get();
        } else if ($user->role === 'student') {
            $quizzes = Quiz::whereHas('classroom.students', function ($query) use ($user) {
                $query->where('student_id', $user->id);
            })->get();
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($quizzes);
    }

}
