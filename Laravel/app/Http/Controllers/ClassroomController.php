<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
class ClassroomController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }
    public function index()
    {
        $user = Auth::user(); // Automatically uses the token provided in the Authorization header

    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Fetch classes associated with the user
    $classes = Classroom::where('teacher_id', $user->id)->get();

    return response()->json($classes, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $classroom = Classroom::create([
            'name' => $request->name,
            'description' => $request->description,
            'code' => $this->generateUniqueClassCode(),
            'teacher_id' => auth()->id(),
        ]);

        return response()->json($classroom, 201);
    }

    private function generateUniqueClassCode($length = 8)
    {
        do {
            $code = strtoupper(Str::random($length));
        } while (Classroom::where('code', $code)->exists());

        return $code;
    }
    public function show($id)
    {
        // Fetch class with its discussion
        $class = Classroom::with('discussion')->findOrFail($id);

        return response()->json([
            'class' => $class,
        ]);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'background' => 'nullable|file|max:2048',
        ]);
        $classroom = Classroom::findOrFail($id);
        if ($request->hasFile('background')) {
            $file = $request->file('background');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $backgroundUrl = asset('storage/' . $path);
            $classroom->background = $backgroundUrl;
        }
        $classroom->update($request->except([ 'background']));
        if ($request->has('avatar')) {
            $classroom->save();
        }

        return response()->json($classroom, 200);
    }
    public function showStudents($id)
    {
        $class = Classroom::findOrFail($id);

        $students = $class->students()->with(['quizSubmissions' => function ($query) {
            $query->select('id', 'score');
        }])->get();

        $studentsData = $students->map(function ($student) {
            return [
                'name' => $student->name,
                'email' => $student->email,
                'avatar' => $student->avatar,
                'total_score' => $student->quizSubmissions->sum('score'),
            ];
        });

        return response()->json($studentsData, 200);
    }
    public function deleteStudent($classId, $studentId)
    {
        $class = Classroom::findOrFail($classId);
        $student = $class->students()->findOrFail($studentId);

        $class->students()->detach($studentId);

        return response()->json(['message' => 'Student removed from class successfully'], 200);
    }
    public function classStatistics($id = null)
    {
        $user = Auth::user();

        if ($id) {
            $class = Classroom::findOrFail($id);

            $numberOfStudents = $class->students()->count();
            $numberOfAssignments = $class->assignments()->count();
            $totalNumberOfStudents = User::whereHas('classes', function ($query) use ($id) {
                $query->where('classroom_id', $id);
            })->count();

            return response()->json([
                'number_of_students' => $numberOfStudents,
                'total_number_of_students' => $totalNumberOfStudents,
                'number_of_assignments' => $numberOfAssignments,
            ], 200);
        } else {
            if ($user->hasRole('teacher')) {
                $classes = Classroom::where('teacher_id', $user->id)->get();
                $totalNumberOfStudents = $classes->sum(function ($class) {
                    return $class->students()->count();
                });
                $totalNumberOfAssignments = $classes->sum(function ($class) {
                    return $class->assignments()->count();
                });
                $totalNumberOfClasses = $classes->count();
                $totalNumberOfQuizzes = $classes->sum(function ($class) {
                    return $class->quizzes()->count();
                });
            } else {
                $classes = $user->classes;
                $totalNumberOfStudents = $classes->sum(function ($class) {
                    return $class->students()->count();
                });
                $totalNumberOfAssignments = $classes->sum(function ($class) {
                    return $class->assignments()->count();
                });
                $totalNumberOfQuizzes = $classes->sum(function ($class) {
                    return $class->quizzes()->count();
                });
                $totalNumberOfClasses = $classes->count();
            }

            return response()->json([
                'total_number_of_students' => $totalNumberOfStudents,
                'total_number_of_assignments' => $totalNumberOfAssignments,
                'total_number_of_classes' => $totalNumberOfClasses,
                'total_number_of_quizzes' => $totalNumberOfQuizzes,
            ], 200);
        }
    }
    
}
