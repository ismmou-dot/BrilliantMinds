<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\QuizController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/', function () {
    return 'api';
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/student/dashboard', [StudentController::class, 'dashboard']);
    Route::post('/student/join-class', [StudentController::class, 'storeJoinClass']);
    Route::delete('/student/quit-class/{id}', [StudentController::class, 'quitClass']);
    Route::post('/submissions/{assignmentId}/submit', [SubmissionController::class, 'store']);

});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/classes', [ClassroomController::class, 'index']);
    Route::post('/classes', [ClassroomController::class, 'store']);
    Route::get('/classes/{id}/students', [ClassroomController::class, 'showStudents']);
    Route::delete('/classes/{classId}/students/{studentId}/remove', [ClassroomController::class, 'deleteStudent']);
    Route::post('/classrooms/{classroomId}/assignments/store', [AssignmentController::class, 'store']);
    Route::get('/assignments', [AssignmentController::class,'indexByUser']);
    Route::get('/assignments/{id}', [AssignmentController::class,'index']);
    Route::get('assignments/{assignmentId}/submissions', [SubmissionController::class, 'getSubmissions']);
    Route::post('classes/{id}/update', [ClassroomController::class,'update']);
    Route::get('/classes/statistics/{id?}', [ClassroomController::class, 'classStatistics']);
    Route::get('/quizzes', [QuizController::class, 'getQuizzes']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('classes/{id}', [ClassroomController::class, 'show']);
    Route::get('discussion/{id}/posts', [DiscussionController::class, 'show']);
    Route::post('discussion/{id}/post', [DiscussionController::class, 'store']);
    Route::post('/post/{postId}/comment', [DiscussionController::class, 'storeComment']);
    Route::get('/user', [AuthController::class, 'index']);
    Route::post('/user', [AuthController::class, 'update']);
    Route::get('/classrooms/{classroomId}/assignments', [AssignmentController::class, 'indexByClassroom']);
    Route::get('/classrooms/{classroomId}/assignments/{id}', [AssignmentController::class, 'index']);
    Route::get('/submission/{submissionId}', [SubmissionController::class, 'getSubmissionByOwner']);
    Route::post('/quizzes/{classId}/store', [QuizController::class, 'store']);
    Route::get('/quizzes/{classId}', [QuizController::class, 'getAllQuizzes']);
    Route::get('/quiz/{quizId}', [QuizController::class, 'show']);
    Route::post('/quiz/{quizId}/submit', [QuizController::class, 'submit']);
    Route::get('/quiz/{quizId}/checkSubmission', [QuizController::class, 'showQuizSubmit']);
    Route::get('/quiz/{quizId}/submissions', [QuizController::class, 'showAllSubmissions']);
    
});
Route::get('/posts/{id}', [DiscussionController::class, 'showPost']);
Route::middleware('auth:sanctum')->delete('discussion/{discussionId}/post/{postId}', [DiscussionController::class, 'deletePost']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');