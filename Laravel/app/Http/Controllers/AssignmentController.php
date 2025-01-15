<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\File;
use Carbon\Carbon;

class AssignmentController extends Controller
{
    // public function index($id){
    //     $assignment = Assignment::find($id);
    //     $assignment->class = $assignment->classroom->name;
    //     return response()->json($assignment); 
    // }
    public function index($id)
    {
        $assignment = Assignment::with('files')->find($id);
        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }
        
        $assignment->files->each(function ($file) {
            $file->file_path = asset('storage/' . $file->file_path);
        });
        
        $assignment->class = $assignment->classroom->name;
        return response()->json($assignment);
    }

    public function indexByUser()
    {
        if(auth()->user()->hasRole("student")){
            $studentId = auth()->id();
            $assignments = Assignment::whereHas('classroom.students', function ($query) use ($studentId) {
                $query->where('student_id', $studentId);
            })->orderBy('dueDateTime', 'asc')->get();
        } else {
            $teacherId = auth()->id();
            $assignments = Assignment::whereHas('classroom', function ($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            })->orderBy('dueDateTime', 'asc')->get();
        }
        $assignments->each(function ($assignment) {
            $assignment->class = $assignment->classroom->name;
        });

        return response()->json($assignments);
    }

    public function indexByClassroom($classroomId)
    {
        $assignments = Assignment::where('classroom_id', $classroomId)
                                 ->orderBy('dueDateTime', 'asc')
                                 ->get();
    
        $classroomTitle = Classroom::find($classroomId)->name;
    
        $assignments->each(function ($assignment) use ($classroomTitle) {
            $assignment->class = $classroomTitle;
        });
    
        return response()->json($assignments);
    }

    public function store(Request $request, $classroomId)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'points' => 'required|integer',
            'dueDateTime' => 'nullable|date',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx'
        ]);
   
        $validatedData['classroom_id'] = $classroomId;
        $assignment = Assignment::create([
            'title' => $validatedData['title'],
            'dueDateTime' => Carbon::parse($validatedData['dueDateTime'])->toDateTimeString(),
            'instructions' => $validatedData['instructions'] ?? '',
            'points' => $validatedData['points'] ?? 0,
            'classroom_id' => $validatedData['classroom_id'],
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('assignments','public');
                File::create([
                    'fileable_id' => $assignment->id,
                    'fileable_type' => Assignment::class,
                    'name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'uploaded_by' => auth()->id(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Assignment created successfully!',
            'assignment' => $assignment,
        ]);
    }
}
