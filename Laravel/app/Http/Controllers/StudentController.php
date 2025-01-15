<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Classroom;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    // Fetch classes for the authenticated student
    public function dashboard()
{
    $student = auth()->user();
    $classes = $student->classes()->with(['discussion', 'teacher'])->get(); // Assuming 'teacher' is the relation name

    // Add teacher name to each class
    $classes->map(function ($class) {
        $class->teacher_name = $class->teacher->name; // Assuming 'name' is the teacher's name field
        return $class;
    });

    return response()->json([
        'classes' => $classes,
    ], 200);
}


    // Join a class using the class code
    public function storeJoinClass(Request $request)
    {
        $request->validate([
            'class_code' => 'required|string|exists:classrooms,code',
        ]);

        $classroom = Classroom::where('code', $request->class_code)->first();
        if ($classroom->students()->where('student_id', Auth::id())->exists()) {
            return response()->json([
                'message' => 'You are already enrolled in this class.',
            ], 201);
        }

        $classroom->students()->attach(Auth::id());

        return response()->json([
            'message' => 'Successfully joined the class!',
        ], 200);
    }

    // Quit a class
    public function quitClass($id)
    {
        $classroom = Classroom::findOrFail($id);

        $classroom->students()->detach(auth()->id());

        return response()->json([
            'message' => 'You have successfully quit the class.',
        ], 200);
    }
}

