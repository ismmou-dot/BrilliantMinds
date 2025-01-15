<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Classroom;
use App\Models\Post;
use App\Models\File;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiscussionController extends Controller
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum')
        ];
    }
    public function show($id)
    {
        
        $posts = Post::where('discussion_id', $id)
            ->with([
                'user:id,name,avatar',
                'files:id,fileable_id,fileable_type,name,file_path,uploaded_by',
                'links:url,uploaded_by',
                'comments.user:id,name,avatar',
            ])
            ->orderBy('created_at', 'asc')
            ->get();
    
       
        $formattedPosts = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'content' => $post->content,
                'created_at' => $post->created_at,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'avatar' => $post->user->avatar,
                ],
                'files' => $post->files->map(function ($file) {
                    return [
                        'name' => $file->name,
                        'icon' => $file->icon,
                        'size' => $file->size,
                        'type' => $file->type,
                        'file_path' => asset('storage/' . $file->file_path),
                    ];
                }),
                'links' => $post->links->map(function ($link) {
                    return [
                        'url' => $link->url,
                        'uploaded_by' => $link->uploaded_by,
                    ];
                }),
                'comments' => $post->comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'created_at' => $comment->created_at,
                        'user' => [
                            'id' => $comment->user->id,
                            'name' => $comment->user->name,
                            'avatar' => $comment->user->avatar,
                        ],
                    ];
                }),
            ];
        });
    
        return response()->json([
            'posts' => $formattedPosts,
        ]);
    }
    
    public function storeComment(Request $request, $postId)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        return response()->json([
            'message' => 'Comment added successfully!',
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                ],
            ],
        ]);
    }

    public function showPost($id)
    {
        $post =  Post::with([
                'user:id,name',
                'files:id,fileable_id,fileable_type,name,file_path,uploaded_by',
                'links:url,uploaded_by',
                'comments.user:id,name',
                    ])->find($id);
        
            if (!$post) {
                return response()->json(['message' => 'Post not found'], 404);
            }

   
            return response()->json([
                    'id' => $post->id,
                    'content' => $post->content,
                    'created_at' => $post->created_at,
                    'user' => [
                        'id' => $post->user->id,
                        'name' => $post->user->name,
                    ],
                    'files' => $post->files->map(function ($file) {
                        return [
                            'name' => $file->name,
                            'file_path' => asset('storage/' . $file->file_path),
                        ];
                    }),
                    'links' => $post->links->map(function ($link) {
                        return [
                            'url' => $link->url,
                            'uploaded_by' => $link->uploaded_by,
                        ];
                    }),
                    'comments' => $post->comments->map(function ($comment) {
                        return [
                            'id' => $comment->id,
                            'content' => $comment->content,
                            'created_at' => $comment->created_at,
                            'user' => [
                                'id' => $comment->user->id,
                                'name' => $comment->user->name,
                                'avatar' => $comment->user->avatar,
                            ],
                        ];
                    }),
            ]);
        }

    

    // Delete a post from the discussion
    public function deletePost($discussionId, $postId)
    {
        
        $discussion = Discussion::findOrFail($discussionId);
        $classroom = Classroom::findOrFail($discussion->classroom_id);
        
        $post = Post::findOrFail($postId);

        if (Auth::id() === $post->user_id || Auth::id() === $classroom->teacher_id) {
            $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully!'
        ]);
            
        }

        return response()->json([
            'message' => 'You are not authorized to delete this post.'
        ], 403);
    }
    public function store(Request $request, $id)
    {

        $request->validate([
            'content' => 'required|string',
            'files.*' => 'file|max:2048',
            'links.*' => 'url',
        ]);
    
        $post = Post::create([
            'discussion_id' => $id,
            'content' => $request->content,
            'user_id' => Auth::id(),
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('uploads', 'public');
                File::create([
                    'fileable_id' => $post->id,
                    'fileable_type' => Post::class,
                    'name' => $file->getClientOriginalName(),
                    'file_path' => $path, 
                    'uploaded_by' => Auth::id(),
                ]);
            }
        }
        if ($request->has('links')) {
            foreach ($request->input('links') as $link) {
                $post->links()->create([
                    'url' => $link,
                    'uploaded_by' => Auth::id(),
                ]);
            }
        }
    
        return response()->json([
            'message' => 'Message posted successfully!',
            'post' => $post,
        ], 201);
    }
    

}

