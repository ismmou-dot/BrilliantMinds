<?php 
namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    public function store(Request $request, $assignmentId)
    {
        $validated = $request->validate([
            'files.*' => 'nullable|file', // Max 10MB
            'comments' => 'nullable|string',
        ]);

        $submission = Submission::create([
            'assignment_id' => $assignmentId,
            'student_id' => Auth::id(),
            'comments' => $validated['comments'],
            'submitted_at' => now(),
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('submissions','public');
                File::create([
                    'fileable_id' => $submission->id,
                    'fileable_type' => Submission::class,
                    'name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'uploaded_by' => Auth::id(),
                ]);
            }
        }

        return response()->json(['submission' => $submission], 201);
    }

    public function getSubmissions($assignmentId)
    {

        $submissions = Submission::where('assignment_id', $assignmentId)
            ->with(['student', 'files'])
            ->get();

        if ($submissions->isEmpty()) {
            return response()->json(['message' => 'No submissions found for this assignment.'], 404);
        }

        // Append the full URL to the file path
        $submissions->each(function ($submission) {
            $submission->files->each(function ($file) {
            $file->file_path = asset('storage/' . $file->file_path);
            });
        });

        return response()->json($submissions, 200);
    }
    public function getSubmissionByOwner($assignmentId)
    {
        $submission = Submission::where('assignment_id', $assignmentId)
            ->where('student_id', Auth::id())
            ->with('files') // Load the files relationship
            ->first();
          
        if (!$submission) {
            return response()->json(['message' => 'No submission found for this assignment by the current user.'], 404);
        }

        return response()->json($submission, 200);
    }
}
