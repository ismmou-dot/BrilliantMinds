<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiscussionsTable extends Migration
{
    public function up()
    {
        Schema::create('discussions', function (Blueprint $table) {
            $table->id();
           
            $table->string('title');
            $table->unsignedBigInteger('created_by'); // User who created the discussion
            $table->timestamps();

            // Foreign key constraints
            $table->foreignId('classroom_id')->constrained()->onDelete('cascade');

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('discussions');
    }
}
